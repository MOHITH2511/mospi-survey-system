import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { getTranslation } from '../../../lib/i18n';

export default function CitizenDashboard() {
  const { language, surveys, responses, currentUser } = useStore();
  const t = (key: any) => getTranslation(key, language);

  const liveSurveys = surveys.filter(s => s.status === 'live');
  const userResponses = responses.filter(r => r.userId === currentUser?.id);
  const completedSurveys = userResponses.filter(r => r.status === 'completed').length;
  const pendingSurveys = userResponses.filter(r => r.status !== 'completed').length;

  const stats = [
    {
      title: language === 'en' ? 'Available Surveys' : 'उपलब्ध सर्वेक्षण',
      value: liveSurveys.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('completed'),
      value: completedSurveys,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: language === 'en' ? 'In Progress' : 'प्रगति में',
      value: pendingSurveys,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <DashboardShell 
      role="citizen" 
      breadcrumbs={[
        { label: 'Citizen', href: '#/citizen/dashboard' },
        { label: 'Dashboard' }
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-2">
              {language === 'en' ? `Welcome, ${currentUser?.name}!` : `स्वागत है, ${currentUser?.name}!`}
            </h2>
            <p className="text-blue-100 mb-4">
              {language === 'en' 
                ? 'Your participation helps improve government services and policies'
                : 'आपकी भागीदारी सरकारी सेवाओं और नीतियों में सुधार करने में मदद करती है'}
            </p>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Surveys */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            {language === 'en' ? 'Available Surveys' : 'उपलब्ध सर्वेक्षण'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveSurveys.map((survey) => {
              const userResponse = userResponses.find(r => r.surveyId === survey.id);
              const isCompleted = userResponse?.status === 'completed';
              const isInProgress = userResponse && !isCompleted;

              return (
                <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={isCompleted ? 'bg-green-500' : 'bg-blue-500'}>
                        {isCompleted ? t('completed') : t('live')}
                      </Badge>
                      {survey.assignments[0] && (
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {language === 'en' ? 'Deadline:' : 'समय सीमा:'}
                          </span>
                          <span>{new Date(survey.assignments[0].endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{survey.title[language]}</CardTitle>
                    <CardDescription>{survey.description[language]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isInProgress && userResponse && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-600">
                            {language === 'en' ? 'Progress' : 'प्रगति'}
                          </span>
                          <span className="font-medium">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                    )}

                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex items-center justify-between">
                        <span>{language === 'en' ? 'Estimated Time:' : 'अनुमानित समय:'}</span>
                        <span className="font-medium">15-20 {language === 'en' ? 'minutes' : 'मिनट'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{language === 'en' ? 'Questions:' : 'प्रश्न:'}</span>
                        <span className="font-medium">{survey.blocks.length}</span>
                      </div>
                    </div>

                    {isCompleted ? (
                      <Button variant="outline" className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'View Receipt' : 'रसीद देखें'}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => window.location.hash = `/citizen/surveys/${survey.id}/fill`}
                      >
                        {isInProgress 
                          ? (language === 'en' ? 'Continue Survey' : 'सर्वेक्षण जारी रखें')
                          : (language === 'en' ? 'Start Survey' : 'सर्वेक्षण शुरू करें')
                        }
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        {userResponses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Recent Activity' : 'हाल की गतिविधि'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userResponses.slice(0, 3).map((response) => {
                  const survey = surveys.find(s => s.id === response.surveyId);
                  if (!survey) return null;

                  return (
                    <div key={response.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          response.status === 'completed' ? 'bg-green-50' : 'bg-orange-50'
                        }`}>
                          {response.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{survey.title[language]}</div>
                          <div className="text-sm text-slate-500">
                            {response.submittedAt 
                              ? new Date(response.submittedAt).toLocaleDateString()
                              : language === 'en' ? 'In Progress' : 'प्रगति में'}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {language === 'en' ? 'View' : 'देखें'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
