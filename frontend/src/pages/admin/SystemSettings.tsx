import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { Settings, Bell, Shield, Mail, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function SystemSettings() {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">System Settings</h1>
          <p className="text-gray-600">Manage platform configuration and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">
              <Settings className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="data">
              <Database className="w-4 h-4 mr-2" />
              Data
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="InternConnect" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input id="tagline" defaultValue="Complete Internship Management Platform" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" defaultValue="support@internconnect.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-phone">Support Phone</Label>
                  <Input id="support-phone" defaultValue="+91 1234567890" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Enable to show maintenance page to users</p>
                  </div>
                  <Switch />
                </div>
                <Button onClick={handleSave} className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure system notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send email notifications to users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Application Status Updates</Label>
                    <p className="text-sm text-gray-500">Notify students of application changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Opportunity Alerts</Label>
                    <p className="text-sm text-gray-500">Alert students about new internships</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-gray-500">Send weekly summary emails</p>
                  </div>
                  <Switch />
                </div>
                <Button onClick={handleSave} className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security and access control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Lock Session</Label>
                    <p className="text-sm text-gray-500">Automatically lock after inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Complexity</Label>
                    <p className="text-sm text-gray-500">Enforce strong password requirements</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button onClick={handleSave} className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Configure email service settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" type="number" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">SMTP Username</Label>
                  <Input id="smtp-user" type="email" placeholder="your-email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input id="smtp-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input id="from-email" type="email" defaultValue="noreply@internconnect.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signature">Email Signature</Label>
                  <Textarea 
                    id="email-signature" 
                    rows={4}
                    defaultValue="Best regards,&#10;The InternConnect Team"
                  />
                </div>
                <Button onClick={handleSave} className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Settings */}
          <TabsContent value="data">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Backup and data retention settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-gray-500">Automatically backup database daily</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention">Data Retention Period (days)</Label>
                  <Input id="retention" type="number" defaultValue="365" />
                </div>
                <div className="space-y-4 p-4 bg-[#F8FAFC] rounded-lg">
                  <h3 className="text-sm text-gray-900">Backup Actions</h3>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      Create Backup
                    </Button>
                    <Button variant="outline">
                      Download Latest Backup
                    </Button>
                    <Button variant="outline">
                      Restore from Backup
                    </Button>
                  </div>
                </div>
                <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="text-sm text-red-900">Danger Zone</h3>
                  <p className="text-sm text-red-600">
                    These actions are irreversible. Please be careful.
                  </p>
                  <Button variant="destructive">
                    Clear All Logs
                  </Button>
                </div>
                <Button onClick={handleSave} className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
