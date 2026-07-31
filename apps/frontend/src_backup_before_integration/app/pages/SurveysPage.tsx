import { GovHeader } from '../components/GovHeader';
import { GovFooter } from '../components/GovFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/i18n';

export default function SurveysPage() {
  const { language, surveys } = useStore();
  const t = (key: any) => getTranslation(key, language);

  const getStatusBadge = (status: string) => {
    const variants = {
      live: 'bg-green-500',
      upcoming: 'bg-blue-500',
      closed: 'bg-slate-500',
      draft: 'bg-yellow-500',
    };
    return variants[status as keyof typeof variants] || 'bg-slate-500';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <GovHeader />

      <div className="flex-1 bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {language === 'en' ? 'Survey Directory' : 'सर्वेक्षण निर्देशिका'}
            </h1>
            <p className="text-slate-600">
              {language === 'en' 
                ? 'Browse all surveys conducted by the Ministry of Statistics'
                : 'सांख्यिकी मंत्रालय द्वारा आयोजित सभी सर्वेक्षण ब्राउज़ करें'}
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder={language === 'en' ? 'Search surveys...' : 'सर्वेक्षण खोजें...'}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  {language === 'en' ? 'Filter' : 'फ़िल्टर'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {surveys.map((survey) => (
              <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge className={getStatusBadge(survey.status)}>
                        {t(survey.status)}
                      </Badge>
                      {survey.assignments[0] && (
                        <Badge variant="outline" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          {survey.assignments[0].regionCodes.join(', ')}
                        </Badge>
                      )}
                    </div>
                    <Badge variant="secondary">v{survey.version}</Badge>
                  </div>
                  
                  <CardTitle className="text-xl">
                    {survey.title[language]}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {survey.description[language]}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {survey.assignments[0] && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <div>
                            <div className="font-medium">
                              {language === 'en' ? 'Duration' : 'अवधि'}
                            </div>
                            <div className="text-slate-600">
                              {new Date(survey.assignments[0].startDate).toLocaleDateString()} - {new Date(survey.assignments[0].endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <ExternalLink className="h-4 w-4 text-slate-500" />
                          <div>
                            <div className="font-medium">
                              {language === 'en' ? 'Channels' : 'चैनल'}
                            </div>
                            <div className="text-slate-600">
                              {survey.assignments[0].channels.map(t).join(', ')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <div>
                            <div className="font-medium">
                              {language === 'en' ? 'Target' : 'लक्ष्य'}
                            </div>
                            <div className="text-slate-600">
                              {survey.assignments[0].targetResponses.toLocaleString()} {language === 'en' ? 'responses' : 'प्रतिक्रियाएं'}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      {language === 'en' ? 'View Details' : 'विवरण देखें'}
                    </Button>
                    {survey.status === 'live' && (
                      <Button size="sm" onClick={() => window.location.hash = '/login'}>
                        {language === 'en' ? 'Participate' : 'भाग लें'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}
