import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Search,
  FileText,
  BookOpen,
  Notebook,
  User,
  Briefcase,
  Plus,
  FolderOpen,
  Users,
  MessageSquare,
  BarChart3,
  CheckSquare,
  UsersRound,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'student' | 'industry' | 'admin';
}



export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const studentMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Search, label: 'Search', path: '/student/search' },
    { icon: FileText, label: 'Applications', path: '/student/applications' },
    { icon: MessageSquare, label: 'Messages', path: '/student/messages' },
    { icon: BookOpen, label: 'Learning Hub', path: '/student/learning' },
    { icon: Notebook, label: 'Logbook', path: '/student/logbook' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  const industryMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/industry/dashboard' },
    { icon: Plus, label: 'Post', path: '/industry/post' },
    { icon: FolderOpen, label: 'Manage', path: '/industry/manage' },
    { icon: Users, label: 'Candidates', path: '/industry/candidates' },
    { icon: MessageSquare, label: 'Messages', path: '/industry/messages' },
    { icon: BarChart3, label: 'Analytics', path: '/industry/analytics' },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: CheckSquare, label: 'Approvals', path: '/admin/approvals' },
    { icon: UsersRound, label: 'Students', path: '/admin/students' },
    { icon: Briefcase, label: 'Companies', path: '/admin/companies' },
    { icon: BookOpen, label: 'Learning Resources', path: '/admin/resources' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const menuItems =
    role === 'student'
      ? studentMenuItems
      : role === 'industry'
        ? industryMenuItems
        : adminMenuItems;

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1E40AF] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg text-[#1E40AF]">InternConnect</span>
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <Avatar className="w-9 h-9 cursor-pointer">
                <AvatarFallback className="bg-[#1E40AF] text-white">
                  {role === 'student' ? 'S' : role === 'industry' ? 'I' : 'A'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 -ml-64'
            }`}
        >
          <div className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                        ? 'bg-[#1E40AF] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <aside className="lg:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40">
            <div className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                          ? 'bg-[#1E40AF] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 p-6 lg:p-8 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
            }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
