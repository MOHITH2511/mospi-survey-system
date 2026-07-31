import { ArrowRight, BarChart, FileEdit, Users, Vote, Info } from 'lucide-react';
import { GovHeader } from '../components/GovHeader';
import { GovFooter } from '../components/GovFooter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/i18n';

export default function HomePage() {
  const { language, surveys } = useStore();
  const t = (key: any) => getTranslation(key, language);

  const liveSurveys = surveys.filter(s => s.status === 'live').slice(0, 3);

  const roleCards = [
    {
      icon: FileEdit,
      title: t('createSurvey'),
      description: language === 'en' 
        ? 'Design and deploy AI-powered surveys with no-code builder' 
        : 'नो-कोड बिल्डर के साथ एआई-संचालित सर्वेक्षण डिज़ाइन और तैनात करें',
      role: 'admin',
      color: 'bg-blue-500',
      link: '/login',
    },
    {
      icon: BarChart,
      title: t('monitorProgress'),
      description: language === 'en' 
        ? 'Track survey progress and quality metrics in real-time' 
        : 'वास्तविक समय में सर्वेक्षण प्रगति और गुणवत्ता मेट्रिक्स ट्रैक करें',
      role: 'supervisor',
      color: 'bg-green-500',
      link: '/login',
    },
    {
      icon: Users,
      title: t('fieldEnumeration'),
      description: language === 'en' 
        ? 'Conduct field surveys with assisted data collection tools' 
        : 'सहायक डेटा संग्रह उपकरण के साथ क्षेत्र सर्वेक्षण आयोजित करें',
      role: 'enumerator',
      color: 'bg-orange-500',
      link: '/login',
    },
    {
      icon: Vote,
      title: t('takeSurvey'),
      description: language === 'en' 
        ? 'Participate in surveys and contribute to national data' 
        : 'सर्वेक्षण में भाग लें और राष्ट्रीय डेटा में योगदान दें',
      role: 'citizen',
      color: 'bg-purple-500',
      link: '/login',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <GovHeader />

      {/* Demo Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-3">
          <Alert className="bg-transparent border-0">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900 font-semibold">
              {language === 'en' ? 'Demo Portal' : 'डेमो पोर्टल'}
            </AlertTitle>
            <AlertDescription className="text-blue-800 text-sm">
              {language === 'en'
                ? 'This is a demonstration portal. Login with any phone number using OTP: 123456. Select a role (Admin, Supervisor, Enumerator, or Citizen) to explore the features.'
                : 'यह एक प्रदर्शन पोर्टल है। ओटीपी: 123456 का उपयोग करके किसी भी फ़ोन नंबर से लॉगिन करें। विशेषताओं का पता लगाने के लिए एक भूमिका (प्रशासक, पर्यवेक्षक, गणनाकर्ता, या नागरिक) चुनें।'}
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => window.location.hash = '/surveys'}>
                {t('viewAllSurveys')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20" onClick={() => window.location.hash = '/login'}>
                {t('login')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            {language === 'en' ? 'Access by Role' : 'भूमिका के अनुसार पहुंच'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleCards.map((card) => (
              <Card 
                key={card.role}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => window.location.hash = card.link}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group-hover:bg-slate-100">
                    {language === 'en' ? 'Access Portal' : 'पोर्टल एक्सेस करें'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Live Surveys */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {t('currentLiveSurveys')}
            </h2>
            <Button variant="outline" onClick={() => window.location.hash = '/surveys'}>
              {t('viewAllSurveys')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveSurveys.map((survey) => (
              <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-green-500">{t('live')}</Badge>
                    <Badge variant="outline">
                      {survey.assignments[0]?.regionCodes.join(', ') || 'National'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {survey.title[language]}
                  </CardTitle>
                  <CardDescription>
                    {survey.description[language]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Target:' : 'लक्ष्य:'}</span>
                      <span className="font-medium">
                        {survey.assignments[0]?.targetResponses.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'End Date:' : 'समाप्ति तिथि:'}</span>
                      <span className="font-medium">
                        {survey.assignments[0]?.endDate 
                          ? new Date(survey.assignments[0].endDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => window.location.hash = `/surveys/${survey.id}`}
                  >
                    {language === 'en' ? 'View Details' : 'विवरण देखें'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            {language === 'en' ? 'Key Features' : 'मुख्य विशेषताएं'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileEdit className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {language === 'en' ? 'No-Code Survey Builder' : 'नो-कोड सर्वेक्षण बिल्डर'}
              </h3>
              <p className="text-slate-600 text-sm">
                {language === 'en' 
                  ? 'Create complex surveys with drag-and-drop interface and AI assistance'
                  : 'ड्रैग-एंड-ड्रॉप इंटरफ़ेस और एआई सहायता के साथ जटिल सर्वेक्षण बनाएं'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {language === 'en' ? 'Real-time Analytics' : 'वास्तविक समय विश्लेषण'}
              </h3>
              <p className="text-slate-600 text-sm">
                {language === 'en'
                  ? 'Monitor survey progress and data quality with live dashboards'
                  : 'लाइव डैशबोर्ड के साथ सर्वेक्षण प्रगति और डेटा गुणवत्ता की निगरानी करें'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {language === 'en' ? 'Multi-Channel Delivery' : 'बहु-चैनल वितरण'}
              </h3>
              <p className="text-slate-600 text-sm">
                {language === 'en'
                  ? 'Reach respondents via WhatsApp, SMS, IVR, web, and AI avatars'
                  : 'व्हाट्सएप, एसएमएस, आईवीआर, वेब और एआई अवतारों के माध्यम से उत्तरदाताओं तक पहुंचें'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <GovFooter />
    </div>
  );
}