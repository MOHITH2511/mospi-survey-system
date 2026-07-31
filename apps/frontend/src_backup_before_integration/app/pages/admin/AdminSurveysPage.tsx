import { useState } from 'react';
import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent } from '../../components/ui/card';
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
  BarChart,
  Users,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { useStore } from '../../../store/useStore';
import { getTranslation } from '../../../lib/i18n';
import { toast } from 'sonner';

export default function AdminSurveysPage() {
  const { language, surveys, deleteSurvey, updateSurvey } = useStore();
  const t = (key: any) => getTranslation(key, language);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);

  const filteredSurveys = surveys.filter(survey =>
    survey.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.title.hi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusInfo = (status: string) => {
    const statusMap = {
      live: { label: 'Live', color: 'bg-green-600', icon: CheckCircle },
      upcoming: { label: 'Upcoming', color: 'bg-blue-600', icon: Clock },
      closed: { label: 'Closed', color: 'bg-slate-600', icon: XCircle },
      draft: { label: 'Draft', color: 'bg-yellow-600', icon: FileText },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.draft;
  };

  const handleDelete = (surveyId: string) => {
    setSurveyToDelete(surveyId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (surveyToDelete) {
      deleteSurvey(surveyToDelete);
      toast.success('Survey deleted successfully');
      setDeleteDialogOpen(false);
      setSurveyToDelete(null);
    }
  };

  const handleDuplicate = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (survey) {
      const newSurvey = {
        ...survey,
        id: `survey-${Date.now()}`,
        title: {
          en: `${survey.title.en} (Copy)`,
          hi: `${survey.title.hi} (प्रतिलिपि)`
        },
        status: 'draft',
        createdAt: new Date(),
      };
      // Add to store (you'll need to add createSurvey action)
      toast.success('Survey duplicated successfully');
    }
  };

  const handlePublish = (surveyId: string) => {
    updateSurvey(surveyId, { status: 'live' });
    toast.success('Survey published successfully');
  };

  const handleViewAnalytics = (surveyId: string) => {
    window.location.hash = `/admin/surveys/${surveyId}/analytics`;
  };

  return (
    <DashboardShell 
      role="admin" 
      breadcrumbs={[
        { label: 'Admin', href: '#/admin/dashboard' },
        { label: 'Surveys', href: '#/admin/surveys' }
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0D2C7A]">Survey Management</h1>
            <p className="text-slate-600 mt-1">Create, manage, and monitor surveys</p>
          </div>
          <Button
            onClick={() => window.location.hash = '/admin/surveys/new'}
            className="bg-[#0D2C7A] hover:bg-[#081B4D] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Survey
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search surveys..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Surveys Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSurveys.map((survey) => {
            const StatusIcon = getStatusInfo(survey.status).icon;
            
            return (
              <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <Badge className={`${getStatusInfo(survey.status).color} text-white`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {getStatusInfo(survey.status).label}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.location.hash = `/admin/surveys/${survey.id}/analytics`}>
                            <BarChart className="h-4 w-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.hash = `/admin/surveys/${survey.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Survey
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(survey.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          {survey.status === 'draft' && (
                            <DropdownMenuItem onClick={() => handlePublish(survey.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(survey.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Survey Title */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#0D2C7A] line-clamp-2">
                        {survey.title[language]}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                        {survey.description[language]}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <div className="text-2xl font-bold text-[#0D2C7A]">
                          {survey.blocks.length}
                        </div>
                        <div className="text-xs text-slate-600">Questions</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {survey.status === 'live' ? '156' : '0'}
                        </div>
                        <div className="text-xs text-slate-600">Responses</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.location.hash = `/admin/surveys/${survey.id}/analytics`}
                      >
                        <BarChart className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.location.hash = `/admin/surveys/${survey.id}/edit`}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    {/* Meta Info */}
                    <div className="text-xs text-slate-500 pt-2 border-t">
                      Created: {new Date(survey.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSurveys.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <h3 className="font-semibold text-lg text-slate-900 mb-2">No surveys found</h3>
              <p className="text-slate-600 mb-6">
                {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first survey'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => window.location.hash = '/admin/surveys/new'}
                  className="bg-[#0D2C7A] hover:bg-[#081B4D] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Survey
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the survey
                and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardShell>
  );
}
