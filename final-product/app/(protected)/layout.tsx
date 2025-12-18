import { redirect } from "next/navigation";

import { sidebarLinks } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { SearchCommand } from "@/components/dashboard/search-command";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

import Link from "next/link";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items.filter(
      ({ authorizeOnly }) => !authorizeOnly || authorizeOnly === user.role,
    ),
  }));

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* <DashboardSidebar links={filteredLinks} /> */}

      <div className="sticky top-4 z-50 w-full px-4">
        <header className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border border-white/10 bg-[#0A0A0C]/80 px-4 backdrop-blur-md shadow-lg shadow-black/20 supports-[backdrop-filter]:bg-[#0A0A0C]/60">

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hidden md:flex items-center gap-1 pl-2">
              <span className="text-lg font-bold text-white tracking-tight">Futurist</span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/80">OS</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium ml-2">
              <Link href="/dashboard" className="px-3 py-1.5 text-white/70 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/meetings" className="px-3 py-1.5 text-white/70 hover:text-white transition-colors">
                Meetings
              </Link>
              <Link href="/dashboard/billing" className="px-3 py-1.5 text-white/70 hover:text-white transition-colors">
                Billing
              </Link>
              <Link href="/dashboard/settings" className="px-3 py-1.5 text-white/70 hover:text-white transition-colors">
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <div className="hidden md:block">
              <ModeToggle />
            </div>
            <UserAccountNav />
            <MobileSheetSidebar links={filteredLinks} />
          </div>
        </header>
      </div>

      <main className="flex-1 p-4 xl:px-8">
        <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
          {children}
        </MaxWidthWrapper>
      </main>
    </div>
  );
}
