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
  Shield,
  Gauge,
  MessageSquareText,
  ImageIcon,
  Menu,
  Boxes,
  X,
  type LucideIcon,
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

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  requiredPermission?: string;
  /** Show only for these roles (bypasses permission check) */
  roles?: string[];
}

interface SidebarProps {
  locale: string;
  userEmail: string;
  userName?: string | null;
  role: string;
  permissions: string[];
  children: React.ReactNode;
}

export default function Sidebar({
  locale,
  userEmail,
  userName,
  role,
  permissions,
  children,
}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // phones: the sidebar is a slide-in menu, closed after each navigation
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [pathname]);
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
  // desktop-only collapse; the phone menu always shows labels
  const collapsed = isCollapsed && !mobileOpen;

  const allNavItems: NavItem[] = [
    { href: `/${locale}/admin`, icon: Home, label: "Today", requiredPermission: "admin:access" },
    { href: `/${locale}/admin/pipeline`, icon: Target, label: "Pipeline", requiredPermission: "deals:read" },
    { href: `/${locale}/admin/audits`, icon: Gauge, label: "Audits", requiredPermission: "audits:read" },
    { href: `/${locale}/admin/templates`, icon: MessageSquareText, label: "Templates", requiredPermission: "templates:manage" },
    { href: `/${locale}/admin/contacts`, icon: Mail, label: "Inbox", requiredPermission: "contacts:read" },
    { href: `/${locale}/admin/posts`, icon: FileText, label: "Posts", requiredPermission: "posts:read" },
    { href: `/${locale}/admin/morpheus`, icon: Boxes, label: "Morpheus", requiredPermission: "morpheus:read" },
    { href: `/${locale}/admin/media`, icon: ImageIcon, label: "Media", requiredPermission: "media:read" },
    { href: `/${locale}/admin/users`, icon: Users, label: "Users", requiredPermission: "users:read" },
    { href: `/${locale}/admin/roles`, icon: Shield, label: "Roles", roles: ["super_admin", "admin"] },
  ];

  // Filter nav items based on user permissions
  const navItems = allNavItems.filter((item) => {
    if (item.roles) {
      return item.roles.includes(role);
    }
    if (item.requiredPermission) {
      return permissions.includes(item.requiredPermission);
    }
    return true;
  });

  return (
    <SidebarContext.Provider value={{ isCollapsed, sidebarWidth, mainMargin }}>
      {/* Sidebar - Fixed */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 ${isCollapsed ? "md:w-16" : "md:w-64"} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-card border-r border-[var(--line)] flex flex-col overflow-y-auto transition-all duration-300`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className={collapsed ? "mx-auto" : ""}>
              <Image
                src="/kreatale-logo-primary.svg"
                alt="Kreatale"
                width={44}
                height={44}
                className="shrink-0"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="ml-auto md:hidden" aria-label="Close menu">
              <X className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className={`hidden md:inline-flex ${collapsed ? "mx-auto" : "ml-auto"}`}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          </div>
          {!collapsed && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-background p-2.5">
              <Avatar name={userName} email={userEmail} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {userName || userEmail}
                </p>
                <p className="label-mono text-muted-foreground">
                  {role.replace("_", " ")}
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center mt-4">
              <Avatar name={userName} email={userEmail} size="md" />
            </div>
          )}
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            // a section stays highlighted on its sub-pages (e.g. a deal inside Pipeline)
            const isActive =
              pathname === item.href ||
              (item.href !== `/${locale}/admin` && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold rounded-full transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:bg-background hover:text-foreground"
                } ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4 border-t border-[var(--line)]">
          <Button
            variant="ghost"
            className={`w-full ${
              collapsed ? "justify-center" : "justify-start"
            }`}
            onClick={() => setShowSignOutDialog(true)}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="size-4" />
            {!collapsed && <span>Sign Out</span>}
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
        className={`admin-main flex-1 ${isCollapsed ? "md:ml-16" : "md:ml-64"} p-4 md:p-8 overflow-y-auto min-h-screen transition-all duration-300`}
      >
        <div className="sticky top-0 z-20 -mx-4 -mt-4 mb-5 flex items-center gap-3 border-b border-[var(--line)] bg-card/95 px-4 py-3 backdrop-blur md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
          <Image src="/kreatale-logo-primary.svg" alt="Kreatale" width={28} height={28} />
        </div>
        {children}
      </main>
    </SidebarContext.Provider>
  );
}
