"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  LogOut,
  FileText,
  Users,
  Home,
  Mail,
  ChevronLeft,
  ChevronRight,
  Target,
  FolderKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Avatar from "@/components/ui/avatar";

interface SidebarContextType {
  isCollapsed: boolean;
  sidebarWidth: string;
  mainMargin: string;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  sidebarWidth: "w-64",
  mainMargin: "ml-64",
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProps {
  locale: string;
  userEmail: string;
  userName?: string | null;
  role: string;
  children: React.ReactNode;
}

export default function Sidebar({
  locale,
  userEmail,
  userName,
  role,
  children,
}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Load collapsed state from localStorage on mount (client-side only)
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut({
        callbackUrl: `/${locale}/admin/login`,
        redirect: true,
      });
    } catch (error) {
      console.error("Error signing out:", error);
      setSigningOut(false);
    }
  };

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";
  const mainMargin = isCollapsed ? "ml-16" : "ml-64";

  const navItems = [
    {
      href: `/${locale}/admin`,
      icon: Home,
      label: "Dashboard",
    },
    {
      href: `/${locale}/admin/posts`,
      icon: FileText,
      label: "Posts",
    },
    {
      href: `/${locale}/admin/projects`,
      icon: FolderKanban,
      label: "Projects",
    },
    {
      href: `/${locale}/admin/contacts`,
      icon: Mail,
      label: "Inquiry",
    },
    {
      href: `/${locale}/admin/leads`,
      icon: Target,
      label: "Leads",
    },
  ];

  if (role === "super_admin" || role === "admin") {
    navItems.push({
      href: `/${locale}/admin/users`,
      icon: Users,
      label: "Users",
    });
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, sidebarWidth, mainMargin }}>
      {/* Sidebar - Fixed */}
      <aside
        className={`fixed left-0 top-0 ${sidebarWidth} h-screen bg-card border-r border-border flex flex-col overflow-y-auto transition-all duration-300`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className={isCollapsed ? "mx-auto" : ""}>
              <Image
                src="/kreatale-logo-primary.svg"
                alt="Kreatale"
                width={32}
                height={32}
                className="shrink-0"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className={isCollapsed ? "mx-auto" : "ml-auto"}
            >
              {isCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-3 mt-4">
              <Avatar name={userName} email={userEmail} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {userName || userEmail}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {role.replace("_", " ")}
                </p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center mt-4">
              <Avatar name={userName} email={userEmail} size="md" />
            </div>
          )}
        </div>
        <nav className="flex-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="size-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4 border-t border-border">
          <Button
            variant="ghost"
            className={`w-full ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
            onClick={() => setShowSignOutDialog(true)}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className="size-4" />
            {!isCollapsed && <span>Sign Out</span>}
          </Button>
        </div>

        <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign Out</DialogTitle>
              <DialogDescription>
                Are you sure you want to sign out? You&apos;ll need to log in
                again to access the admin panel.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSignOutDialog(false)}
                disabled={signingOut}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </aside>

      {/* Main content - Scrollable */}
      <main
        className={`flex-1 ${mainMargin} p-6 overflow-y-auto min-h-screen transition-all duration-300`}
      >
        {children}
      </main>
    </SidebarContext.Provider>
  );
}
