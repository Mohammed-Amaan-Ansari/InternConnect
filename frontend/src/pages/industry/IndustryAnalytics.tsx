import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function IndustryAnalytics() {
  const [stats, setStats] = useState({
    totalPostings: 0,
    totalApplicants: 0,
    profileViews: 0,
    conversionRate: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://127.0.0.1:8000/industry/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setStats({
          totalPostings: res.data.totalPostings || 0,
          totalApplicants: res.data.totalApplicants || 0,
          profileViews: res.data.profileViews || 0,
          conversionRate: res.data.conversionRate || 0
        });
      })
      .catch(err => {
        console.error("Failed to fetch stats", err);
      });
  }, []);

  const statCards = [
    { icon: BarChart3, label: 'Total Postings', value: stats.totalPostings.toString(), color: 'bg-blue-500' },
    { icon: Users, label: 'Total Applicants', value: stats.totalApplicants.toString(), color: 'bg-green-500' },
    { icon: Eye, label: 'Profile Views', value: stats.profileViews.toLocaleString(), color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'Conversion Rate', value: `${stats.conversionRate}%`, color: 'bg-orange-500' },
  ];

  return (
    <DashboardLayout role="industry">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Analytics & Insights</h1>
          <p className="text-gray-600">Track your internship program performance</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Detailed analytics charts coming soon</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
