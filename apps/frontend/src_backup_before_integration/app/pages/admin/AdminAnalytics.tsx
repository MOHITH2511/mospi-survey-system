import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BarChart3, TrendingUp, Users, FileText } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <DashboardShell 
      role="admin" 
      breadcrumbs={[
        { label: 'Admin', href: '#/admin/dashboard' },
        { label: 'Analytics' }
      ]}
    >
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2C7A]">Analytics</h1>
          <p className="text-slate-600 mt-1">Comprehensive survey data analytics and insights</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-[#0D2C7A] mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Total Responses</p>
                <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">45,892</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-[#0D2C7A] mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">1,234</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% from last month
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="h-8 w-8 text-[#0D2C7A] mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Active Surveys</p>
                <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">28</h3>
                <p className="text-xs text-slate-500 mt-1">Across all regions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-600">Completion Rate</p>
                <h3 className="text-3xl font-bold text-green-600 mt-2">78.4%</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5% from last month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Advanced analytics charts would appear here</p>
                <p className="text-sm mt-2">Integrated with survey data and real-time updates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
