import { useState } from 'react';
import { GovHeader } from '../components/GovHeader';
import { GovFooter } from '../components/GovFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/i18n';
import { toast } from 'sonner';
import emblemImg from '../../assets/emblem.png';

export default function LoginPage() {
  const { language, users, setCurrentUser } = useStore();
  const t = (key: any) => getTranslation(key, language);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleLogin = () => {
    if (!selectedRole) {
      toast.error(language === 'en' ? 'Please select a role' : 'कृपया भूमिका चुनें');
      return;
    }

    // Find a user with the selected role
    const user = users.find(u => u.role === selectedRole);
    if (user) {
      setCurrentUser(user);
      toast.success(language === 'en' ? `Welcome, ${user.name}!` : `स्वागत है, ${user.name}!`);
      
      // Redirect based on role
      setTimeout(() => {
        window.location.hash = `/${selectedRole}/dashboard`;
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <GovHeader />

      {/* Main Content with Gradient Background */}
      <div 
        className="flex-1 flex items-center justify-center py-12 px-4"
        style={{
          background: 'linear-gradient(135deg, #0D2C7A 0%, #2D4F9A 50%, #5D3A8E 100%)'
        }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <img src={emblemImg} alt="Government of India" className="w-full h-full" />
            </div>
            <CardTitle className="text-2xl text-[#0D2C7A]">
              {language === 'en' ? 'Login to Portal' : 'पोर्टल में लॉगिन करें'}
            </CardTitle>
            <CardDescription className="text-slate-600">
              {language === 'en' 
                ? 'Select your role to access the dashboard' 
                : 'डैशबोर्ड तक पहुंचने के लिए अपनी भूमिका चुनें'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">
                {language === 'en' ? 'Select Role (Demo)' : 'भूमिका चुनें (डेमो)'}
              </label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="h-12 border-slate-300">
                  <SelectValue 
                    placeholder={language === 'en' ? 'Administrator (MoSPI)' : 'व्यवस्थापक (MoSPI)'} 
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    {language === 'en' ? 'Administrator (MoSPI)' : 'व्यवस्थापक (MoSPI)'}
                  </SelectItem>
                  <SelectItem value="supervisor">
                    {language === 'en' ? 'Supervisor (State Level)' : 'पर्यवेक्षक (राज्य स्तर)'}
                  </SelectItem>
                  <SelectItem value="enumerator">
                    {language === 'en' ? 'Enumerator (Field Officer)' : 'गणनाकर्ता (फील्ड अधिकारी)'}
                  </SelectItem>
                  <SelectItem value="citizen">
                    {language === 'en' ? 'Citizen (Respondent)' : 'नागरिक (उत्तरदाता)'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full h-12 bg-[#FF7722] hover:bg-[#E56610] text-white font-semibold text-base"
              onClick={handleLogin}
            >
              {language === 'en' ? 'Access Portal' : 'पोर्टल का उपयोग करें'}
            </Button>

            <div className="pt-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Government of India • MoSPI • Smart Survey Tool'
                  : 'भारत सरकार • MoSPI • स्मार्ट सर्वेक्षण उपकरण'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <GovFooter />
    </div>
  );
}
