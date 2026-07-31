import { ReactNode, useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  ClipboardList,
  UserCheck,
  Flag,
  History,
  Database,
  X,
  ChevronLeft,
  Home,
} from 'lucide-react';
import { GovHeader } from './GovHeader';
import { GovFooter } from './GovFooter';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { cn } from '../components/ui/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/i18n';

interface DashboardShellProps {
  children: ReactNode;
  role: 'admin' | 'supervisor' | 'enumerator' | 'citizen';
  breadcrumbs?: { label: string; href?: string }[];
}

const roleMenuItems = {
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '#/admin/dashboard' },
    { icon: FileText, label: 'Surveys', href: '#/admin/surveys' },
    { icon: ClipboardList, label: 'Assignments', href: '#/admin/assignments' },
    { icon: Database, label: 'Question Bank', href: '#/admin/question-bank' },
    { icon: Users, label: 'Supervisors', href: '#/admin/supervisors' },
    { icon: BarChart3, label: 'Analytics', href: '#/admin/analytics' },
    { icon: History, label: 'History', href: '#/admin/history' },
    { icon: Settings, label: 'Settings', href: '#/admin/settings' },
  ],
  supervisor: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '#/supervisor/dashboard' },
    { icon: FileText, label: 'Surveys', href: '#/supervisor/surveys' },
    { icon: Users, label: 'Field Teams', href: '#/supervisor/field-teams' },
    { icon: Flag, label: 'Quality', href: '#/supervisor/quality' },
    { icon: BarChart3, label: 'Analytics', href: '#/supervisor/analytics' },
    { icon: Settings, label: 'Settings', href: '#/supervisor/settings' },
  ],
  enumerator: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '#/enumerator/dashboard' },
    { icon: ClipboardList, label: 'Assigned', href: '#/enumerator/assigned' },
    { icon: UserCheck, label: 'Callbacks', href: '#/enumerator/callbacks' },
    { icon: FileText, label: 'Collect', href: '#/enumerator/collect' },
    { icon: History, label: 'History', href: '#/enumerator/history' },
    { icon: Settings, label: 'Settings', href: '#/enumerator/settings' },
  ],
  citizen: [
    { icon: Home, label: 'Home', href: '#/citizen/dashboard' },
    { icon: FileText, label: 'My Surveys', href: '#/citizen/surveys' },
    { icon: History, label: 'History', href: '#/citizen/history' },
    { icon: Settings, label: 'Settings', href: '#/citizen/settings' },
  ],
};

export function DashboardShell({ children, role, breadcrumbs }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language } = useStore();
  const menuItems = roleMenuItems[role];
  const currentHash = window.location.hash;

  const Sidebar = (
    <div className="flex flex-col h-full bg-slate-50 border-r">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold capitalize text-slate-900">{role} Portal</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentHash === item.href || currentHash.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-700 hover:bg-slate-200'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />
      
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={() => window.location.hash = '/'}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <GovHeader onMenuClick={() => setSidebarOpen(true)} showMenu />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r bg-slate-50">
          {Sidebar}
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white">
              {Sidebar}
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="border-b bg-white px-6 py-3">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.flatMap((crumb, index) => {
                    const items = [];
                    if (index > 0) {
                      items.push(<BreadcrumbSeparator key={`sep-${index}`} />);
                    }
                    items.push(
                      <BreadcrumbItem key={`item-${index}`}>
                        {crumb.href ? (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    );
                    return items;
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}

          <div className="flex-1 bg-slate-50">
            {children}
          </div>
        </main>
      </div>

      <GovFooter />
    </div>
  );
}