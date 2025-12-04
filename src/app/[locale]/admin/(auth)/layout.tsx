// Route group layout that excludes login from admin layout
// This layout doesn't require auth - it's just a wrapper
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
