export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-off-white text-heritage-brown">
      {children}
    </div>
  );
}
