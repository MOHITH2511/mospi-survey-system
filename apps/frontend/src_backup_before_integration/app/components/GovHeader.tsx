import { Bell, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/i18n';
import emblemImg from '../../assets/emblem.png';

interface GovHeaderProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export function GovHeader({ onMenuClick, showMenu = false }: GovHeaderProps) {
  const { currentUser, language, setLanguage, setCurrentUser } = useStore();
  const t = (key: any) => getTranslation(key, language);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.hash = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E0E0E0]">
      {/* Top Bar - Government of India */}
      <div className="bg-white border-b border-[#E0E0E0]">
        <div className="max-w-[1400px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="text-slate-600">Government of India</span>
              <span className="text-slate-600">Ministry of Statistics and Programme Implementation</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#main" className="text-slate-600 hover:text-[#0D2C7A] text-sm">
                Skip to Main Content
              </a>
              <div className="flex items-center gap-1">
                <button className="text-slate-600 hover:text-[#0D2C7A] text-sm px-1">A+</button>
                <button className="text-slate-600 hover:text-[#0D2C7A] text-sm px-1">A-</button>
              </div>
              <button
                onClick={toggleLanguage}
                className={`text-sm px-2 py-1 rounded ${
                  language === 'en'
                    ? 'text-[#FF7722] font-semibold'
                    : 'text-slate-600 hover:text-[#0D2C7A]'
                }`}
              >
                English
              </button>
              <span className="text-slate-400">|</span>
              <button
                onClick={toggleLanguage}
                className={`text-sm px-2 py-1 rounded ${
                  language === 'hi'
                    ? 'text-[#FF7722] font-semibold'
                    : 'text-slate-600 hover:text-[#0D2C7A]'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Logo and Title */}
      <div className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Emblem and Title */}
            <div className="flex items-center gap-4">
              {showMenu && (
                <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <img src={emblemImg} alt="Government of India" className="h-14 w-14" />
              <div>
                <div className="text-[#0D2C7A] text-lg font-semibold leading-tight">
                  {language === 'en' 
                    ? 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय'
                    : 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय'
                  }
                </div>
                <div className="text-[#0D2C7A] text-xl font-bold">
                  Ministry of Statistics and Programme Implementation
                </div>
              </div>
            </div>

            {/* Right - Logo and Actions */}
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <div className="text-xs text-slate-500">MoSPI Logo</div>
              </div>

              {currentUser && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5 text-slate-600" />
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[#FF7722] text-white text-xs">
                          3
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <div className="p-2 font-medium">Notifications</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <div className="flex flex-col gap-1">
                          <div className="font-medium text-sm">New survey assigned</div>
                          <div className="text-xs text-slate-500">2 hours ago</div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2">
                        <div className="w-8 h-8 bg-[#0D2C7A] rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {currentUser.name.charAt(0)}
                        </div>
                        <div className="text-left hidden md:block">
                          <div className="text-sm font-medium">{currentUser.name}</div>
                          <div className="text-xs text-slate-500 capitalize">{currentUser.role}</div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {!currentUser && (
                <Button 
                  onClick={() => window.location.hash = '/login'}
                  className="bg-[#FF7722] hover:bg-[#E56610] text-white"
                >
                  {t('login')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
