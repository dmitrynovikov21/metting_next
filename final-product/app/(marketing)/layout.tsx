interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0C]">
      <main className="flex-1">{children}</main>
    </div>
  );
}
