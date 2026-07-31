import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Settings, Bell, Lock, Globe, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';

export default function AdminSettings() {
  return (
    <DashboardShell 
      role="admin" 
      breadcrumbs={[
        { label: 'Admin', href: '#/admin/dashboard' },
        { label: 'Settings' }
      ]}
    >
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2C7A]">Settings</h1>
          <p className="text-slate-600 mt-1">Manage system preferences and configurations</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Admin User" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="admin@mospi.gov.in" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+91 9876543210" />
              </div>
              <Button className="w-full">Update Profile</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-600">Receive email updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Survey Alerts</p>
                  <p className="text-sm text-slate-600">Get notified on survey completion</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Quality Flags</p>
                  <p className="text-sm text-slate-600">Alert on data quality issues</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Updates</p>
                  <p className="text-sm text-slate-600">Important system announcements</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full">Change Password</Button>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-600">Add extra security</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Language</Label>
                <select className="w-full p-2 border rounded-md">
                  <option>English</option>
                  <option>हिंदी (Hindi)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Date Format</Label>
                <select className="w-full p-2 border rounded-md">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <select className="w-full p-2 border rounded-md">
                  <option>IST (UTC+5:30)</option>
                  <option>UTC</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-slate-600">Enable dark theme</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
