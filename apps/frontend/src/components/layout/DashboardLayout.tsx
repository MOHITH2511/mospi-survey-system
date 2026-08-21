import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingChatbot from "@/components/FloatingChatbot";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/context/TranslationProvider";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  Library,
  Archive,
  Globe,
  Sparkles,
  Mic,
  CheckCircle2,
  Activity,
  AlertTriangle,
  ClipboardCheck,
  ScrollText,
  Settings,
  LogOut,
  ShieldCheck,
  UserCog,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";

/* ── Navigation config per role ── */
const navConfig = {
  admin: {
    label: "Nodal Officer",
    items: [
      { to: "/admin", icon: LayoutDashboard, label: "Dashboard Overview" },
      { to: "/admin/survey-builder", icon: FileText, label: "AI Survey Builder" },
      { to: "/admin/import", icon: UploadCloud, label: "Survey Import Center" },
      { to: "/admin/question-bank", icon: Library, label: "Question Bank" },
      { to: "/admin/registry", icon: Archive, label: "Survey Registry" },
      { to: "/admin/publish", icon: Globe, label: "Deployment Center" },
      { to: "/admin/monitoring", icon: Activity, label: "Monitoring Hub" },
      { to: "/admin/insights", icon: Sparkles, label: "AI Insights" },
      { to: "/admin/users", icon: UserCog, label: "User Management" },
      { to: "/admin/config", icon: Settings, label: "Survey Quality Controls" },
    ],
  },
  citizen: {
    label: "Citizen Portal",
    items: [
      { to: "/citizen", icon: LayoutDashboard, label: "My Dashboard" },
      { to: "/citizen/survey", icon: Mic, label: "Take Voice Survey" },
      { to: "/citizen/complete", icon: CheckCircle2, label: "Completed Surveys" },
    ],
  },
  supervisor: {
    label: "Quality Supervisor",
    items: [
      { to: "/supervisor", icon: LayoutDashboard, label: "Supervisor Hub" },
      { to: "/supervisor/quality-flags", icon: AlertTriangle, label: "Quality Flags" },
      { to: "/supervisor/audit-logs", icon: ScrollText, label: "System Audit Logs" },
      { to: "/supervisor/validation", icon: ClipboardCheck, label: "Validation Queue" },
    ],
  },
  enumerator: {
    label: "Field Enumerator",
    items: [
      { to: "/enumerator", icon: LayoutDashboard, label: "Field Dashboard" },
    ],
  },
} as const;

type Role = keyof typeof navConfig;

export default function DashboardLayout({ role }: { role: Role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const nav = navConfig[role];
  const { t } = useTranslation();

  return (
    <TooltipProvider>
      <SidebarProvider
        style={{
          "--sidebar-width": "18.5rem",
          "--sidebar-width-icon": "5rem",
        } as React.CSSProperties}
      >
        <Sidebar variant="sidebar" collapsible="icon" className="border-r-0 [&>div]:bg-[#003366] shadow-xl">
          {/* ── Sidebar Header (Official Branding) ── */}
          <SidebarHeader className="p-4 border-b border-white/10 mb-2">
            <div className="flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:justify-center">
              <img
                src="/mospi-emblem.svg"
                alt="State Emblem of India"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
              <div className="flex flex-col group-data-[collapsible=icon]:hidden min-w-0">
                <span className="text-base font-bold text-white leading-tight tracking-wide truncate">
                  {t("Digital India")}
                </span>
                <span className="text-[12px] text-blue-200/90 uppercase tracking-widest mt-0.5">
                  {t("Survey Portal")}
                </span>
              </div>
            </div>
          </SidebarHeader>

          {/* ── Navigation ── */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="!text-blue-200/90 text-sm font-semibold uppercase tracking-widest mt-2 mb-1 px-3">
                {t(`${nav.label} Panel`)}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2 px-2">
                  {nav.items.map((item) => {
                    const isActive = location.pathname === item.to;
                    const translatedLabel = t(item.label);
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={translatedLabel}
                          onClick={() => navigate(item.to)}
                          className={`h-10 px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center transition-all duration-300 rounded-lg !bg-transparent hover:!bg-transparent data-[active=true]:!bg-transparent hover:translate-x-1 ${isActive
                              ? "!text-white font-bold drop-shadow-md"
                              : "!text-white/80 hover:!text-white font-medium"
                            }`}
                        >
                          <item.icon
                            className="shrink-0 transition-all group-data-[collapsible=icon]:mr-0 mr-3 h-5 w-5 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5"
                            strokeWidth={isActive ? 2 : 1.5}
                          />
                          <span className="text-sm truncate">
                            {translatedLabel}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-auto">
              <SidebarGroupLabel className="!text-blue-200/90 text-sm font-semibold uppercase tracking-widest mb-1 px-3">
                {t("System")}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2 px-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip={t("Portal Settings")}
                      className="h-10 px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center !bg-transparent hover:!bg-transparent data-[active=true]:!bg-transparent !text-white/80 hover:!text-white hover:translate-x-1 transition-all duration-300 font-medium rounded-lg"
                    >
                      <Settings className="shrink-0 transition-all group-data-[collapsible=icon]:mr-0 mr-3 h-5 w-5 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                      <span className="text-sm truncate">
                        {t("Portal Settings")}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* ── Footer ── */}
          <SidebarFooter className="p-4 border-t border-white/10">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={t("Sign Out")}
                  onClick={() => navigate("/login")}
                  className="h-10 px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center !bg-transparent hover:!bg-transparent data-[active=true]:!bg-transparent !text-red-400 hover:!text-red-300 hover:translate-x-1 transition-all duration-300 font-bold rounded-lg"
                >
                  <LogOut className="shrink-0 transition-all group-data-[collapsible=icon]:mr-0 mr-3 h-5 w-5 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" strokeWidth={2} />
                  <span className="text-sm truncate">
                    {t("Sign Out")}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-slate-50/50">
          {/* ── Top Bar ── */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm">
            <SidebarTrigger className="text-[#004e8c] hover:bg-blue-50" />

            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#003366] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#002244] hover:-translate-y-0.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("Back")}
            </button>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-gray-900 hidden sm:block">
                {t("National Data Gateway")}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#004e8c]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#004e8c]">
                  {t(`${role} Session Active`)}
                </span>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-5">
              <LanguageSwitcher />
              <div className="hidden sm:block h-6 w-px bg-gray-200" />

              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-900">{t("Official User")}</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003366] shadow-inner border-2 border-white ring-2 ring-gray-100">
                  <span className="text-sm font-bold text-white uppercase">{role[0]}</span>
                </div>
              </div>
            </div>
          </header>

          {/* ── Page Content ── */}
          <div id="main-content" className="flex-1 overflow-auto p-6 lg:p-8">
            <Outlet />
          </div>
          <FloatingChatbot />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
