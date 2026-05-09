import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Users, Briefcase, Building2, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [data, setData] = useState<any>({
    stats: {
      totalStudents: 0,
      totalCompanies: 0,
      activeInternships: 0,
      placementRate: "0%"
    },
    recentActivities: []
  });
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchDashboard = async () => {
      try {
        const statsRes = await axios.get("http://127.0.0.1:8000/admin/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(statsRes.data);

        const approvalsRes = await axios.get("http://127.0.0.1:8000/admin/dashboard/companies/pending", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingApprovals(approvalsRes.data.slice(0, 3)); // Just show top 3 on dashboard
      } catch (error) {
        console.error("Failed to load admin dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://127.0.0.1:8000/admin/dashboard/companies/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingApprovals(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const statsList = [
    { icon: Users, label: 'Total Students', value: data.stats.totalStudents, change: 'Lifetime', color: 'bg-blue-500' },
    { icon: Building2, label: 'Partner Companies', value: data.stats.totalCompanies, change: 'Lifetime', color: 'bg-green-500' },
    { icon: Briefcase, label: 'Active Internships', value: data.stats.activeInternships, change: 'Currently active', color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'Placement Rate', value: data.stats.placementRate, change: 'Of total students', color: 'bg-orange-500' },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your institution's internship program</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsList.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-3xl text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-xs text-gray-500">{stat.change}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl text-gray-900">Pending Approvals</h2>
                      <Link to="/admin/approvals">
                        <Button variant="ghost" size="sm">View All</Button>
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {pendingApprovals.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                          <div className="flex-1">
                            <h3 className="text-gray-900 mb-1">{item.company_name}</h3>
                            <p className="text-sm text-gray-600">{item.contact_person} - {item.designation}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.address}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-[#10B981] hover:bg-[#10B981]/90" onClick={() => handleApprove(item.id)}>
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      ))}
                      {pendingApprovals.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No pending approvals.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="text-lg text-gray-900 mb-4">Recent Activities</h2>
                    <div className="space-y-4">
                      {data.recentActivities.map((activity: any, idx: number) => (
                        <div key={idx} className="flex gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'company' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                      {data.recentActivities.length === 0 && (
                        <p className="text-gray-500 text-sm">No recent activities.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] text-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                      <Link to="/admin/approvals">
                        <Button variant="outline" size="sm" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                          Review Approvals
                        </Button>
                      </Link>
                      <Link to="/admin/students">
                        <Button variant="outline" size="sm" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                          Monitor Students
                        </Button>
                      </Link>
                      <Link to="/admin/analytics">
                        <Button variant="outline" size="sm" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 mt-2">
                          View Analytics
                        </Button>
                      </Link>
                      <Link to="/admin/resources">
                        <Button variant="outline" size="sm" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 mt-2">
                          Manage Resources
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
