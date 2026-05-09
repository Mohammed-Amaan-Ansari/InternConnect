import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Building2, Calendar, MapPin, Eye, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ApplicationsTracker() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://127.0.0.1:8000/student/dashboard/applications", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const formattedApps = res.data.map((app: any) => {
          let statusColor = 'bg-gray-100 text-gray-800';
          if (app.status === 'Applied' || app.status === 'Under Review') statusColor = 'bg-yellow-100 text-yellow-800';
          if (app.status === 'Shortlisted' || app.status === 'Interview Scheduled') statusColor = 'bg-blue-100 text-blue-800';
          if (app.status === 'Selected') statusColor = 'bg-green-100 text-green-800';
          if (app.status === 'Rejected') statusColor = 'bg-red-100 text-red-800';

          // Fake timeline based on status for now
          const timeline = [
            { stage: 'Applied', date: new Date(app.appliedDate).toLocaleDateString(), completed: true },
            { stage: 'Review', date: 'Pending', completed: app.status !== 'Applied' },
            { stage: 'Shortlisted', date: 'Pending', completed: ['Shortlisted', 'Interview Scheduled', 'Selected'].includes(app.status) },
            { stage: 'Interview', date: 'Pending', completed: ['Interview Scheduled', 'Selected'].includes(app.status) },
            { stage: 'Offer', date: 'Pending', completed: app.status === 'Selected' },
          ];

          return {
            ...app,
            statusColor,
            timeline
          };
        });
        setApplications(formattedApps);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const activeApplications = applications.filter(a => a.status !== 'Rejected');
  const rejectedApplications = applications.filter(a => a.status === 'Rejected');

  return (
    <DashboardLayout role="student">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track all your internship applications in one place</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">Loading...</div>
        ) : (
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active ({activeApplications.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
              <TabsTrigger value="saved">Saved (0)</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {activeApplications.map((app) => (
                <Card key={app.id} className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl text-gray-900 mb-2">{app.role}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <Building2 className="w-4 h-4" />
                          <span>{app.company}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{app.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={app.statusColor}>{app.status}</Badge>
                    </div>

                    {/* Timeline */}
                    <div className="mb-6">
                      <h4 className="text-sm text-gray-700 mb-4">Application Progress</h4>
                      <div className="flex items-center justify-between relative">
                        {app.timeline.map((stage: any, index: number) => (
                          <div key={index} className="flex flex-col items-center relative z-10 flex-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${stage.completed
                                  ? 'bg-[#10B981] text-white'
                                  : 'bg-gray-200 text-gray-400'
                                }`}
                            >
                              {stage.completed ? '✓' : index + 1}
                            </div>
                            <p className="text-xs text-gray-900 text-center mb-1">{stage.stage}</p>
                            <p className="text-xs text-gray-500 text-center">{stage.date}</p>
                            {index < app.timeline.length - 1 && (
                              <div
                                className={`absolute top-5 left-1/2 w-full h-0.5 ${stage.completed ? 'bg-[#10B981]' : 'bg-gray-200'
                                  }`}
                                style={{ zIndex: -1 }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" onClick={() => window.location.href = `/student/internship/${app.internshipId}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = `/student/messages?companyId=${app.companyId}&applicationId=${app.id}`}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message HR
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {activeApplications.length === 0 && (
                <div className="text-center py-10 text-gray-500">No active applications yet.</div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-6">
              {rejectedApplications.map((app) => (
                <Card key={app.id} className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl text-gray-900 mb-2">{app.role}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <Building2 className="w-4 h-4" />
                          <span>{app.company}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{app.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={app.statusColor}>{app.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {rejectedApplications.length === 0 && (
                <div className="text-center py-10 text-gray-500">No rejected applications.</div>
              )}
            </TabsContent>

            <TabsContent value="saved">
              <Card className="border-none shadow-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">No saved internships yet</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}
