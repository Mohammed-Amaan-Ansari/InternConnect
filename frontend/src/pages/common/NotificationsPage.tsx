import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Bell,
  Check,
  Trash2,
  Briefcase,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function NotificationsPage() {
  const role = (localStorage.getItem('role') as any) || 'student';
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 1,
      type: 'application',
      icon: Briefcase,
      title: 'Application Status Update',
      message: 'Your application for Software Development Intern at Tech Solutions Inc. has been shortlisted.',
      time: '2 hours ago',
      read: false,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 2,
      type: 'success',
      icon: CheckCircle2,
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated and is now visible to recruiters.',
      time: '2 days ago',
      read: true,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    }
  ]);

  useEffect(() => {
    if (role === 'admin') {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get("http://127.0.0.1:8000/admin/dashboard/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            // Map backend notifications to UI format
            const mapped = res.data.map((n: any) => ({
              id: n.id,
              type: 'system',
              icon: Bell,
              title: n.title,
              message: n.message,
              time: n.time,
              read: false,
              color: 'text-blue-600',
              bgColor: 'bg-blue-100'
            }));
            setNotifications(mapped);
          })
          .catch(console.error);
      }
    }
  }, [role]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout role={role}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Check className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read">
              Read ({notifications.length - unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`border-none shadow-sm ${!notification.read ? 'bg-blue-50/50' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-gray-900">{notification.title}</h3>
                          {!notification.read && (
                            <Badge className="bg-[#1E40AF] text-white">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!notification.read && (
                          <Button variant="ghost" size="sm">
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="unread" className="space-y-3">
            {notifications.filter(n => !n.read).map((notification) => {
              const Icon = notification.icon;
              return (
                <Card key={notification.id} className="border-none shadow-sm bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-gray-900">{notification.title}</h3>
                          <Badge className="bg-[#1E40AF] text-white">New</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="ghost" size="sm">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="read" className="space-y-3">
            {notifications.filter(n => n.read).map((notification) => {
              const Icon = notification.icon;
              return (
                <Card key={notification.id} className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 mb-1">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
