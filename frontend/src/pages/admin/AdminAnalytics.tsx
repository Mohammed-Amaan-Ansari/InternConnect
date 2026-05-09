import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, Building2, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminAnalytics() {
  const [data, setData] = useState<any>({
    stats: {
      totalStudents: 0,
      totalCompanies: 0,
      activeInternships: 0,
      placementRate: "0%"
    },
    monthlyData: [],
    departmentData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchAnalytics = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/admin/dashboard/stats", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://127.0.0.1:8000/admin/dashboard/analytics", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setData({
          stats: statsRes.data.stats,
          monthlyData: analyticsRes.data.monthlyData,
          departmentData: analyticsRes.data.departmentData
        });
      } catch (error) {
        console.error("Failed to load admin analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const statsList = [
    {
      title: 'Total Students',
      value: data.stats.totalStudents,
      change: 'Lifetime',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Industry Partners',
      value: data.stats.totalCompanies,
      change: 'Lifetime',
      icon: Building2,
      color: 'bg-green-500',
    },
    {
      title: 'Active Internships',
      value: data.stats.activeInternships,
      change: 'Current',
      icon: Briefcase,
      color: 'bg-purple-500',
    },
    {
      title: 'Placement Rate',
      value: data.stats.placementRate,
      change: 'Lifetime',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">Loading...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsList.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-3xl text-gray-900 mb-1">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-xs text-[#10B981]">{stat.change}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={data.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(val) => val.toLocaleString()} />
                        <Tooltip formatter={(val: number) => val.toLocaleString()} />
                        <Legend />
                        <Bar dataKey="students" fill="#1E40AF" name="Students" />
                        <Bar dataKey="internships" fill="#10B981" name="Internships" />
                        <Bar dataKey="placements" fill="#F59E0B" name="Placements" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Growth Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={data.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(val) => val.toLocaleString()} />
                        <Tooltip formatter={(val: number) => val.toLocaleString()} />
                        <Legend />
                        <Line type="monotone" dataKey="students" stroke="#1E40AF" strokeWidth={2} />
                        <Line type="monotone" dataKey="internships" stroke="#10B981" strokeWidth={2} />
                        <Line type="monotone" dataKey="placements" stroke="#F59E0B" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="distribution" className="space-y-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Department-wise Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={data.departmentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${entry.value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {data.departmentData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-3">
                        {data.departmentData.map((dept: any, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: dept.color }}
                            />
                            <span className="text-sm text-gray-700">{dept.name}: {dept.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
