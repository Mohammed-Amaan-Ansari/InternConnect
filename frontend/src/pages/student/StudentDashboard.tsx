import { useEffect, useState } from "react";
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Briefcase,
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Star,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from "axios";

type StatItem = {
  icon: React.ComponentType<any>;
  label: string;
  value: number | string;
  change: string;
  color: string;
};

type RecentApplication = {
  id: number;
  company: string;
  role: string;
  status: string;
  appliedDate: string;
  statusColor: string;
};

type RecommendedInternship = {
  id: number;
  company: string;
  role: string;
  location: string;
  duration: string;
  stipend: string;
  match: number;
};

type UpcomingDeadline = {
  id: number;
  company: string;
  role: string;
  deadline: string;
  daysLeft: number;
};

export default function StudentDashboard() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [recommendedInternships, setRecommendedInternships] = useState<RecommendedInternship[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    // 1️⃣ Fetch Dashboard Stats
    axios.get("http://127.0.0.1:8000/student/dashboard/stats", { headers })
      .then(res => {
        const data = res.data;
        setStats([
          { icon: FileText, label: "Applications", value: data.applications, change: "+0 this week", color: "bg-blue-500" },
          { icon: CheckCircle2, label: "Shortlisted", value: data.shortlisted, change: "+0 new", color: "bg-green-500" },
          { icon: Clock, label: "In Progress", value: data.inProgress, change: "Active", color: "bg-orange-500" },
          { icon: TrendingUp, label: "Profile Views", value: data.profileViews, change: "+0 this week", color: "bg-purple-500" },
        ]);
      })
      .catch(console.error);

    // 2️⃣ Fetch Recent Applications
    axios.get("http://127.0.0.1:8000/student/dashboard/recent-applications", { headers })
      .then(res => {
        const apps = res.data.map((app: any) => ({
          ...app,
          statusColor:
            app.status === "Shortlisted"
              ? "bg-green-100 text-green-800"
              : app.status === "Under Review" || app.status === "Interview Scheduled"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800",
          appliedDate: new Date(app.appliedDate).toLocaleDateString(),
        }));
        setRecentApplications(apps);
      })
      .catch(console.error);

    // 3️⃣ Fetch Recommended Internships
    axios.get("http://127.0.0.1:8000/student/dashboard/recommended-internships", { headers })
      .then(res => {
        setRecommendedInternships(res.data);
      })
      .catch(console.error);

    // 4️⃣ Fetch Upcoming Deadlines
    axios.get("http://127.0.0.1:8000/student/dashboard/deadlines", { headers })
      .then(res => {
        const deadlines = res.data.map((item: any) => ({
          ...item,
          deadline: new Date(item.deadline).toLocaleDateString(),
        }));
        setUpcomingDeadlines(deadlines);
      })
      .catch(console.error);

  }, [token]);

  return (
    <DashboardLayout role="student">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Welcome back, Student!</h1>
          <p className="text-gray-600">Here's what's happening with your internship journey</p>
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
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-gray-900">Recent Applications</h2>
                  <Link to="/student/applications">
                    <Button variant="ghost" size="sm">
                      View All <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentApplications.map(app => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{app.role}</h3>
                        <p className="text-sm text-gray-600 mb-2">{app.company}</p>
                        <p className="text-xs text-gray-500">Applied {app.appliedDate}</p>
                      </div>
                      <Badge className={app.statusColor}>{app.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Internships */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-gray-900">Recommended for You</h2>
                  <Link to="/student/search">
                    <Button variant="ghost" size="sm">
                      Explore More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {recommendedInternships.map(internship => (
                    <div key={internship.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900 mb-1">{internship.role}</h3>
                          <p className="text-sm text-gray-600">{internship.company}</p>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{internship.match}% Match</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>{internship.location}</span>
                        <span>•</span>
                        <span>{internship.duration}</span>
                        <span>•</span>
                        <span className="text-[#10B981]">{internship.stipend}</span>
                      </div>
                      <Link to={`/student/internship/${internship.id}`}>
                        <Button size="sm" className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-[#1E40AF]" />
                  <h2 className="text-lg text-gray-900">Upcoming Deadlines</h2>
                </div>
                <div className="space-y-4">
                  {upcomingDeadlines.map(item => (
                    <div key={item.id} className="p-4 bg-[#F8FAFC] rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-900">{item.company}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{item.role}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{item.deadline}</p>
                        <Badge className="bg-orange-100 text-orange-800">{item.daysLeft} days left</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/student/search">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Browse All Opportunities
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link to="/student/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 w-4 h-4" />
                      Update Profile
                    </Button>
                  </Link>
                  <Link to="/student/search">
                    <Button variant="outline" className="w-full justify-start">
                      <Briefcase className="mr-2 w-4 h-4" />
                      Find Internships
                    </Button>
                  </Link>
                  <Link to="/student/logbook">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 w-4 h-4" />
                      Update Logbook
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Skill Development */}
            <Card className="border-none shadow-sm bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] text-white">
              <CardContent className="p-6">
                <h3 className="text-lg mb-2">Boost Your Skills</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Check out personalized learning recommendations
                </p>
                <Link to="/student/learning">
                  <Button size="sm" className="bg-white text-[#1E40AF] hover:bg-gray-100">
                    Go to Learning Hub <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
