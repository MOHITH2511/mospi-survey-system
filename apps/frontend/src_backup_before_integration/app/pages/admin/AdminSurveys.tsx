import { useState } from 'react';
import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Plus, 
  Search, 
  Edit, 
  Copy,
  Trash2,
  Eye,
  Send,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useStore } from '../../../store/useStore';
import { getTranslation } from '../../../lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

export default function AdminSurveys() {
  const { language, surveys } = useStore();
  const t = (key: any) => getTranslation(key, language);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const getStatusBadge = (status: string) => {
    const variants = {
      live: 'bg-green-500',
      upcoming: 'bg-blue-500',
      closed: 'bg-slate-500',
      draft: 'bg-yellow-500',
    };
    return variants[status as keyof typeof variants] || 'bg-slate-500';
  };

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
                          survey.description[language].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || survey.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const surveyStats = {
    all: surveys.length,
    live: surveys.filter(s => s.status === 'live').length,
    closed: surveys.filter(s => s.status === 'closed').length,
    upcoming: surveys.filter(s => s.status === 'upcoming').length,
    draft: surveys.filter(s => s.status === 'draft').length,
  };

  return (
    <DashboardShell 
      role="admin" 
      breadcrumbs={[
        { label: 'Admin', href: '#/admin/dashboard' },
        { label: 'Surveys' }
      ]}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'en' ? 'Survey Management' : 'सर्वेक्षण प्रबंधन'}
            </h1>
            <p className="text-slate-600">
              {language === 'en' 
                ? 'Create, manage, and monitor all surveys'
                : 'सभी सर्वेक्षण बनाएं, प्रबंधित करें और मॉनिटर करें'}
            </p>
          </div>
          <Button onClick={() => window.location.hash = '/admin/surveys/new'}>
            <Plus className="h-4 w-4 mr-2" />
            {t('create')} {t('surveys')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder={language === 'en' ? 'Search surveys...' : 'सर्वेक्षण खोजें...'}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({surveyStats.all})</TabsTrigger>
                <TabsTrigger value="live">Live ({surveyStats.live})</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming ({surveyStats.upcoming})</TabsTrigger>
                <TabsTrigger value="closed">Closed ({surveyStats.closed})</TabsTrigger>
                <TabsTrigger value="draft">Draft ({surveyStats.draft})</TabsTrigger>
              </TabsList>
            </Tabs>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'en' ? 'Title' : 'शीर्षक'}</TableHead>
                  <TableHead>{language === 'en' ? 'Status' : 'स्थिति'}</TableHead>
                  <TableHead>{language === 'en' ? 'Version' : 'संस्करण'}</TableHead>
                  <TableHead>{language === 'en' ? 'Responses' : 'प्रतिक्रियाएं'}</TableHead>
                  <TableHead>{language === 'en' ? 'Created' : 'बनाया गया'}</TableHead>
                  <TableHead className="text-right">{language === 'en' ? 'Actions' : 'कार्य'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSurveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{survey.title[language]}</div>
                        <div className="text-sm text-slate-500 line-clamp-1">
                          {survey.description[language]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(survey.status)}>
                        {t(survey.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>v{survey.version}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {survey.assignments[0]?.targetResponses.toLocaleString() || '0'}
                        </div>
                        <div className="text-slate-500">target</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {language === 'en' ? 'Actions' : 'कार्य'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.location.hash = `/admin/surveys/${survey.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            {t('edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            {t('view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          {survey.status === 'draft' && (
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              {t('publish')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
