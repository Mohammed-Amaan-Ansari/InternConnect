import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Briefcase,
  GraduationCap,
  Building2,
  Award,
  TrendingUp,
  Users,
  BookOpen,
  Target,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Briefcase,
      title: 'Industry Internships',
      description: 'Access thousands of verified internship opportunities from leading companies.',
    },
    {
      icon: Award,
      title: 'Credit-Based Learning',
      description: 'Earn academic credits aligned with NEP 2020 guidelines through internships.',
    },
    {
      icon: TrendingUp,
      title: 'Skill Development',
      description: 'AI-powered skill gap analysis and personalized learning recommendations.',
    },
    {
      icon: Users,
      title: 'Faculty Mentorship',
      description: 'Continuous monitoring and guidance from college faculty and industry mentors.',
    },
    {
      icon: BookOpen,
      title: 'Learning Hub',
      description: 'Access curated resources, courses, and materials to upskill yourself.',
    },
    {
      icon: Target,
      title: 'Career Tracking',
      description: 'Track your progress, applications, and maintain a comprehensive logbook.',
    },
  ];

  const nepFeatures = [
    'Flexible credit transfer system',
    'Industry-academia collaboration',
    'Multidisciplinary learning approach',
    'Continuous assessment and feedback',
    'Digital logbook maintenance',
    'Skill-based credential framework',
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-[#10B981] rounded-full mb-6">
                <span className="text-sm">Aligned with NEP 2020</span>
              </div>
              <h1 className="text-4xl lg:text-6xl mb-6">
                Transform Your Future with <span className="text-[#10B981]">InternConnect</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                India's premier internship management platform connecting students, institutions,
                and industry for meaningful skill development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/role-selection">
                  <Button size="lg" className="bg-[#10B981] hover:bg-[#10B981]/90 text-white">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6">
                    <GraduationCap className="w-8 h-8 text-[#1E40AF] mb-2" />
                    <p className="text-2xl text-gray-900 mb-1">50,000+</p>
                    <p className="text-sm text-gray-600">Active Students</p>
                  </div>
                  <div className="bg-white rounded-lg p-6">
                    <Building2 className="w-8 h-8 text-[#1E40AF] mb-2" />
                    <p className="text-2xl text-gray-900 mb-1">2,500+</p>
                    <p className="text-sm text-gray-600">Partner Companies</p>
                  </div>
                  <div className="bg-white rounded-lg p-6">
                    <Briefcase className="w-8 h-8 text-[#1E40AF] mb-2" />
                    <p className="text-2xl text-gray-900 mb-1">15,000+</p>
                    <p className="text-sm text-gray-600">Internships Posted</p>
                  </div>
                  <div className="bg-white rounded-lg p-6">
                    <Award className="w-8 h-8 text-[#1E40AF] mb-2" />
                    <p className="text-2xl text-gray-900 mb-1">500+</p>
                    <p className="text-sm text-gray-600">Institutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
              Comprehensive Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to discover, apply, and excel in industry internships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#1E40AF]/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#1E40AF]" />
                    </div>
                    <h3 className="text-xl text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEP 2020 Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-[#10B981]/10 text-[#10B981] rounded-full mb-6">
                <span className="text-sm">NEP 2020 Compliant</span>
              </div>
              <h2 className="text-3xl lg:text-4xl text-gray-900 mb-6">
                Aligned with National Education Policy 2020
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                InternConnect is designed to support the transformative goals of NEP 2020, 
                bridging the gap between academia and industry while promoting holistic, 
                multidisciplinary education.
              </p>
              <div className="space-y-3">
                {nepFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1E40AF]/5 to-[#10B981]/5 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#1E40AF] rounded-full flex items-center justify-center text-white">
                      1
                    </div>
                    <h3 className="text-lg text-gray-900">For Students</h3>
                  </div>
                  <p className="text-gray-600">
                    Find verified internships, earn credits, track progress, and develop industry-ready skills
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#1E40AF] rounded-full flex items-center justify-center text-white">
                      2
                    </div>
                    <h3 className="text-lg text-gray-900">For Industry</h3>
                  </div>
                  <p className="text-gray-600">
                    Post opportunities, discover talent, manage interns, and build future workforce
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#1E40AF] rounded-full flex items-center justify-center text-white">
                      3
                    </div>
                    <h3 className="text-lg text-gray-900">For Colleges</h3>
                  </div>
                  <p className="text-gray-600">
                    Monitor students, approve opportunities, track outcomes, and ensure quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1E40AF] to-[#1E3A8A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            Ready to Start Your Internship Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students, companies, and institutions already using InternConnect
          </p>
          <Link to="/auth/role-selection">
            <Button size="lg" className="bg-[#10B981] hover:bg-[#10B981]/90 text-white">
              Create Your Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
