import { useEffect, useState } from "react";
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Plus,
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from "axios";

// Types
type StatItem = {
  icon: React.ComponentType<any>;
  label: string;
  value: number | string;
  change: string;
  color: string;
};

type Application = {
  id: number;
  name: string;
  role: string;
  college: string;
  appliedDate: string;
  status: string;
  match: number;
};

type Internship = {
  id: number;
  title: string;
  posted: string;
  applications: number;
  views: number;
  status: string;
};

type Interview = {
  candidate: string;
  role: string;
  date: string;
  time: string;
};

export default function IndustryDashboard() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [activeInternships, setActiveInternships] = useState<Internship[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    // 1️⃣ Fetch Dashboard Stats
    axios.get("http://127.0.0.1:8000/industry/dashboard/stats", { headers })
      .then(res => {
        const data = res.data;
        setStats([
          { icon: Briefcase, label: 'Active Postings', value: data.activePostings, change: `+${data.newPostings} this month`, color: 'bg-blue-500' },
          { icon: Users, label: 'Total Applicants', value: data.totalApplicants, change: `+${data.newApplicants} this week`, color: 'bg-green-500' },
          { icon: CheckCircle2, label: 'Active Interns', value: data.activeInterns, change: `${data.completingSoon} completing soon`, color: 'bg-purple-500' },
          { icon: Eye, label: 'Profile Views', value: data.profileViews, change: `+${data.profileViewsChange} this week`, color: 'bg-orange-500' },
        ]);
      })
      .catch(console.error);

    // 2️⃣ Fetch Recent Applications
    axios.get("http://127.0.0.1:8000/industry/dashboard/recent-applications", { headers })
      .then(res => {
        const apps = res.data.map((app: any) => ({
          ...app,
          name: app.studentName || "Unknown",
          role: app.internshipRole || "Unknown",
          match: app.match || 85,
          appliedDate: new Date(app.appliedDate).toLocaleDateString(),
        }));
        setRecentApplications(apps);
      })
      .catch(console.error);

    // 3️⃣ Fetch Active Internships
    axios.get("http://127.0.0.1:8000/industry/dashboard/internships", { headers })
      .then(res => {
        const internships = res.data.map((i: any) => ({
          ...i,
          posted: new Date(i.posted).toLocaleDateString(),
        }));
        setActiveInternships(internships);
      })
      .catch(console.error);

    // 4️⃣ Fetch Upcoming Interviews
    axios.get("http://127.0.0.1:8000/industry/dashboard/interviews", { headers })
      .then(res => {
        const ivs = res.data.map((iv: any) => ({
          ...iv,
          candidate: iv.studentName || "Unknown",
          role: iv.internshipRole || "Unknown",
          date: iv.scheduledDate ? new Date(iv.scheduledDate).toLocaleDateString() : "TBD",
          time: iv.time || "TBD"
        }));
        setUpcomingInterviews(ivs);
      })
      .catch(console.error);

  }, [token]);

  return (
    <DashboardLayout role="industry">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Welcome back, Company!</h1>
            <p className="text-gray-600">Here's an overview of your internship programs</p>
          </div>
          <Link to="/industry/post">
            <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
              <Plus className="w-4 h-4 mr-2" />
              Post New Internship
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
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
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-gray-900">Recent Applications</h2>
                  <Link to="/industry/candidates">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#1E40AF] rounded-full flex items-center justify-center text-white">
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-gray-900 mb-1">{app.name}</h3>
                          <p className="text-sm text-gray-600">{app.college}</p>
                          <p className="text-xs text-gray-500 mt-1">Applied for {app.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-[#10B981]/10 text-[#10B981] mb-2">{app.match}% Match</Badge>
                        <p className="text-xs text-gray-500">{app.appliedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Internships */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-gray-900">Active Internship Postings</h2>
                  <Link to="/industry/manage">
                    <Button variant="ghost" size="sm">
                      Manage All
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {activeInternships.map((internship) => (
                    <div key={internship.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900 mb-1">{internship.title}</h3>
                          <p className="text-sm text-gray-500">Posted {internship.posted}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">{internship.status}</Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{internship.applications} applications</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{internship.views} views</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Upcoming Interviews */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-[#1E40AF]" />
                  <h2 className="text-lg text-gray-900">Upcoming Interviews</h2>
                </div>
                <div className="space-y-4">
                  {upcomingInterviews.map((interview, index) => (
                    <div key={index} className="p-4 bg-[#F8FAFC] rounded-lg">
                      <p className="text-sm text-gray-900 mb-1">{interview.candidate}</p>
                      <p className="text-xs text-gray-600 mb-2">{interview.role}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{interview.date}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{interview.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Calendar
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link to="/industry/post">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="mr-2 w-4 h-4" />
                      Post Internship
                    </Button>
                  </Link>
                  <Link to="/industry/candidates">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 w-4 h-4" />
                      Review Candidates
                    </Button>
                  </Link>
                  <Link to="/industry/analytics">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="mr-2 w-4 h-4" />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
