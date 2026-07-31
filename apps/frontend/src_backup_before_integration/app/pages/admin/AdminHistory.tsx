import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { History, Clock, FileText } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { useStore } from '../../../store/useStore';

export default function AdminHistory() {
  const { surveys, language } = useStore();

  const historyItems = [
    {
      id: '1',
      action: 'Survey Created',
      item: 'National Health Survey 2025',
      user: 'Admin User',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'create'
    },
    {
      id: '2',
      action: 'Survey Published',
      item: 'Employment Tracking Survey',
      user: 'Admin User',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'publish'
    },
    {
      id: '3',
      action: 'Assignment Created',
      item: 'Delhi Region Assignment',
      user: 'Admin User',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      type: 'assign'
    },
    {
      id: '4',
      action: 'Survey Modified',
      item: 'Consumer Expenditure Survey',
      user: 'Admin User',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      type: 'edit'
    },
  ];

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <DashboardShell 
      role="admin" 
      breadcrumbs={[
        { label: 'Admin', href: '#/admin/dashboard' },
        { label: 'History' }
      ]}
    >
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2C7A]">Activity History</h1>
          <p className="text-slate-600 mt-1">Track all administrative actions and changes</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="h-8 w-8 text-[#0D2C7A] mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Total Actions</p>
                <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">1,234</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="h-8 w-8 text-[#0D2C7A] mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Today</p>
                <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">47</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <History className="h-8 w-8 text-[#0D2C7A] mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">This Week</p>
                <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">289</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historyItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => {
                    // Navigate to survey if it's survey-related
                    if (item.type === 'create' || item.type === 'publish' || item.type === 'edit') {
                      const survey = surveys.find(s => s.title.en === item.item);
                      if (survey) {
                        window.location.hash = `/admin/surveys/${survey.id}/analytics`;
                      }
                    }
                  }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">{item.action}</p>
                      <span className="text-xs text-slate-500">{formatTimeAgo(item.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{item.item}</p>
                    <p className="text-xs text-slate-500 mt-1">by {item.user}</p>
                    <p className="text-xs text-blue-600 mt-1">Click to view details →</p>
                  </div>
                  <Badge 
                    variant={item.type === 'create' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
