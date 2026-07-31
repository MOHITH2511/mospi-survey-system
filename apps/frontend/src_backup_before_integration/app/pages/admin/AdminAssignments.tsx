import { useState } from 'react';
import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Plus,
  Search,
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Checkbox } from '../../components/ui/checkbox';
import { useStore } from '../../../store/useStore';
import { getTranslation } from '../../../lib/i18n';

export default function AdminAssignments() {
  const { language, surveys, regions } = useStore();
  const t = (key: any) => getTranslation(key, language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    surveyId: '',
    regionType: 'zone', // 'zone' or 'state'
    selectedRegions: [] as string[],
    targetResponses: 0,
    startDate: '',
    endDate: '',
  });

  const zones = [
    { id: 'north', name: 'North Zone', states: ['HP', 'PB', 'HR', 'DL', 'UT', 'UK', 'RJ', 'UP'] },
    { id: 'south', name: 'South Zone', states: ['KA', 'TN', 'KL', 'AP', 'TG', 'PY', 'LD'] },
    { id: 'east', name: 'East Zone', states: ['WB', 'OR', 'JH', 'BR', 'SK', 'AN'] },
    { id: 'west', name: 'West Zone', states: ['GJ', 'MH', 'GO', 'DD', 'DN'] },
    { id: 'central', name: 'Central Zone', states: ['MP', 'CT', 'JK', 'LA'] },
    { id: 'northeast', name: 'Northeast Zone', states: ['AS', 'AR', 'NL', 'MN', 'MZ', 'TR', 'ML'] },
  ];

  // Mock assignment data
  const assignments = [
    {
      id: 'assgn-1',
      surveyId: 'survey-1',
      surveyTitle: 'National Household Survey 2026',
      region: 'Maharashtra',
      supervisors: 12,
      enumerators: 85,
      target: 5000,
      completed: 3890,
      status: 'active',
      startDate: '2026-02-01',
      endDate: '2026-02-28',
    },
    {
      id: 'assgn-2',
      surveyId: 'survey-1',
      surveyTitle: 'National Household Survey 2026',
      region: 'Delhi',
      supervisors: 8,
      enumerators: 45,
      target: 2500,
      completed: 2100,
      status: 'active',
      startDate: '2026-02-01',
      endDate: '2026-02-28',
    },
    {
      id: 'assgn-3',
      surveyId: 'survey-2',
      surveyTitle: 'Agricultural Census 2026',
      region: 'Punjab',
      supervisors: 15,
      enumerators: 120,
      target: 8000,
      completed: 890,
      status: 'upcoming',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
    },
  ];

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.surveyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSurvey =
      selectedSurvey === 'all' || a.surveyId === selectedSurvey;

    return matchesSearch && matchesSurvey;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Active', className: 'bg-green-600 text-white', icon: CheckCircle },
      upcoming: { label: 'Upcoming', className: 'bg-blue-600 text-white', icon: Clock },
      completed: { label: 'Completed', className: 'bg-slate-600 text-white', icon: CheckCircle },
      delayed: { label: 'Delayed', className: 'bg-red-600 text-white', icon: AlertCircle },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.active;
  };

  return (
    <DashboardShell 
      role="admin" 
      breadcrumbs={[
        { label: 'Admin', href: '#/admin/dashboard' },
        { label: 'Assignments', href: '#/admin/assignments' }
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0D2C7A]">Survey Assignments</h1>
            <p className="text-slate-600 mt-1">Manage regional survey assignments and teams</p>
          </div>
          <Button 
            className="bg-[#0D2C7A] hover:bg-[#081B4D] text-white"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Assignments</p>
                  <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">24</h3>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Regions</p>
                  <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">18</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Field Staff</p>
                  <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">456</h3>
                  <p className="text-xs text-slate-500 mt-1">35 Supervisors, 421 Enumerators</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Overall Progress</p>
                  <h3 className="text-3xl font-bold text-green-600 mt-2">73.4%</h3>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="All Surveys" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Surveys</SelectItem>
                  {surveys.map((survey) => (
                    <SelectItem key={survey.id} value={survey.id}>
                      {survey.title.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Assignments Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => {
                const StatusIcon = getStatusBadge(assignment.status).icon;
                const completionRate = (assignment.completed / assignment.target) * 100;

                return (
                  <div
                    key={assignment.id}
                    className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-[#0D2C7A]">
                            {assignment.surveyTitle}
                          </h3>
                          <Badge className={getStatusBadge(assignment.status).className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {getStatusBadge(assignment.status).label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{assignment.region}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-6 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Supervisors</p>
                        <p className="text-lg font-semibold text-[#0D2C7A]">{assignment.supervisors}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Enumerators</p>
                        <p className="text-lg font-semibold text-[#0D2C7A]">{assignment.enumerators}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Target</p>
                        <p className="text-lg font-semibold text-[#0D2C7A]">{assignment.target.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Completed</p>
                        <p className="text-lg font-semibold text-green-600">{assignment.completed.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-semibold text-[#0D2C7A]">{completionRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full transition-all"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAssignments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">No assignments found</p>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Create Assignment Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Assign survey to regions and set targets
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="survey">Select Survey</Label>
                <Select value={newAssignment.surveyId} onValueChange={(val) => setNewAssignment({...newAssignment, surveyId: val})}>
                  <SelectTrigger id="survey">
                    <SelectValue placeholder="Choose a survey" />
                  </SelectTrigger>
                  <SelectContent>
                    {surveys.map((survey) => (
                      <SelectItem key={survey.id} value={survey.id}>
                        {survey.title.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assignment Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={newAssignment.regionType === 'zone'} 
                      onCheckedChange={() => setNewAssignment({...newAssignment, regionType: 'zone', selectedRegions: []})}
                    />
                    <label className="text-sm">By Zone (North, South, East, West, Central, Northeast)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={newAssignment.regionType === 'state'} 
                      onCheckedChange={() => setNewAssignment({...newAssignment, regionType: 'state', selectedRegions: []})}
                    />
                    <label className="text-sm">By State</label>
                  </div>
                </div>
              </div>

              {newAssignment.regionType === 'zone' && (
                <div className="space-y-2">
                  <Label>Select Zones</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {zones.map((zone) => (
                      <div key={zone.id} className="flex items-start space-x-2 p-3 border rounded-lg">
                        <Checkbox 
                          checked={newAssignment.selectedRegions.includes(zone.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewAssignment({...newAssignment, selectedRegions: [...newAssignment.selectedRegions, zone.id]});
                            } else {
                              setNewAssignment({...newAssignment, selectedRegions: newAssignment.selectedRegions.filter(r => r !== zone.id)});
                            }
                          }}
                        />
                        <div>
                          <label className="text-sm font-medium">{zone.name}</label>
                          <p className="text-xs text-slate-500">{zone.states.length} states</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newAssignment.regionType === 'state' && (
                <div className="space-y-2">
                  <Label>Select States</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                    {regions.filter(r => r.type === 'state').map((region) => (
                      <div key={region.id} className="flex items-center space-x-2">
                        <Checkbox 
                          checked={newAssignment.selectedRegions.includes(region.code)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewAssignment({...newAssignment, selectedRegions: [...newAssignment.selectedRegions, region.code]});
                            } else {
                              setNewAssignment({...newAssignment, selectedRegions: newAssignment.selectedRegions.filter(r => r !== region.code)});
                            }
                          }}
                        />
                        <label className="text-sm">{region.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date"
                    value={newAssignment.startDate}
                    onChange={(e) => setNewAssignment({...newAssignment, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate" 
                    type="date"
                    value={newAssignment.endDate}
                    onChange={(e) => setNewAssignment({...newAssignment, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target Responses</Label>
                <Input 
                  id="target" 
                  type="number"
                  placeholder="Enter target number"
                  value={newAssignment.targetResponses}
                  onChange={(e) => setNewAssignment({...newAssignment, targetResponses: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-[#0D2C7A] hover:bg-[#081B4D] text-white"
                onClick={() => {
                  // TODO: Create assignment in store
                  console.log('Creating assignment:', newAssignment);
                  setIsCreateDialogOpen(false);
                  setNewAssignment({
                    surveyId: '',
                    regionType: 'zone',
                    selectedRegions: [],
                    targetResponses: 0,
                    startDate: '',
                    endDate: '',
                  });
                }}
              >
                Create Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>      </div>
    </DashboardShell>
  );
}
