import { Link } from 'react-router-dom';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Card, CardContent } from '../../components/ui/card';
import { GraduationCap, Building2, School, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function RoleSelection() {
  const roles = [
    {
      icon: GraduationCap,
      title: 'Student',
      description: 'Find internships, track applications, and develop your skills',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-50',
      loginPath: '/auth/student/login',
      registerPath: '/auth/student/register',
    },
    {
      icon: Building2,
      title: 'Industry Partner',
      description: 'Post opportunities, discover talent, and manage interns',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-50',
      loginPath: '/auth/industry/login',
      registerPath: '/auth/industry/register',
    },
    {
      icon: School,
      title: 'College/Faculty',
      description: 'Monitor students, approve opportunities, and track outcomes',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-50',
      loginPath: '/auth/college/login',
      registerPath: '/auth/college/register',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl text-gray-900 mb-4">Welcome to InternConnect</h1>
          <p className="text-xl text-gray-600">Select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Card
                key={index}
                className={`border-2 border-gray-200 hover:border-[#1E40AF] transition-all ${role.hoverColor} cursor-pointer group`}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${role.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl text-gray-900 mb-3">{role.title}</h2>
                  <p className="text-gray-600 mb-6">{role.description}</p>
                  <div className="space-y-3">
                    <Link to={role.loginPath}>
                      <Button variant="outline" className="w-full mb-3">
                        Sign In
                      </Button>
                    </Link>
                    <Link to={role.registerPath}>
                      <Button className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                        Register
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Need help choosing?{' '}
            <Link to="/help" className="text-[#1E40AF] hover:underline">
              View our guide
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
