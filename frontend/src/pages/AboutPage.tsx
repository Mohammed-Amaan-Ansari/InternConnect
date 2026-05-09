import { PublicNavbar } from '../components/layout/PublicNavbar';
import { Footer } from '../components/layout/Footer';
import { Card, CardContent } from '../components/ui/card';
import {
  Target,
  Eye,
  GraduationCap,
  Building2,
  School,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const howItWorks = [
    {
      role: 'Students',
      icon: GraduationCap,
      color: 'bg-blue-500',
      steps: [
        'Create your profile and upload resume',
        'Browse and apply for internships',
        'Get matched with opportunities',
        'Track applications and progress',
        'Maintain digital logbook',
        'Earn academic credits',
      ],
    },
    {
      role: 'Industry',
      icon: Building2,
      color: 'bg-green-500',
      steps: [
        'Register your company',
        'Post internship opportunities',
        'Review student applications',
        'Shortlist and interview candidates',
        'Manage active interns',
        'Provide feedback and ratings',
      ],
    },
    {
      role: 'College/Faculty',
      icon: School,
      color: 'bg-purple-500',
      steps: [
        'Register your institution',
        'Approve internship postings',
        'Monitor student progress',
        'Review logbook entries',
        'Assign academic credits',
        'Generate analytics reports',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl mb-6">
              About InternConnect
            </h1>
            <p className="text-xl text-blue-100">
              Empowering India's future workforce through seamless integration of academia and industry, 
              aligned with the transformative vision of National Education Policy 2020.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#1E40AF]/10 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-[#1E40AF]" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To bridge the gap between academic learning and industry requirements by providing 
                  a comprehensive platform that facilitates meaningful internships, continuous skill 
                  development, and seamless collaboration between students, educational institutions, 
                  and industry partners.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-lg flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-[#10B981]" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  To become India's leading internship management ecosystem that transforms 
                  how students gain practical experience, how industries discover talent, and 
                  how educational institutions prepare graduates for the evolving job market, 
                  fully aligned with NEP 2020 principles.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
              How InternConnect Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A seamless experience for all stakeholders in the internship ecosystem
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl text-gray-900 mb-6">{item.role}</h3>
                    <div className="space-y-4">
                      {item.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm text-gray-600">{stepIndex + 1}</span>
                          </div>
                          <p className="text-gray-600">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEP 2020 Alignment */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-[#10B981]/10 text-[#10B981] rounded-full mb-6">
                <span className="text-sm">NEP 2020</span>
              </div>
              <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
                Aligned with National Education Policy
              </h2>
              <p className="text-lg text-gray-600">
                InternConnect embodies the core principles and objectives of NEP 2020
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
              <div className="flex gap-4">
                <div className="w-2 h-auto bg-[#1E40AF] rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl text-gray-900 mb-2">Flexible Learning Pathways</h3>
                  <p className="text-gray-600">
                    Credit-based internship system allowing students to earn academic credits while 
                    gaining practical experience, supporting multiple entry and exit points.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-2 h-auto bg-[#10B981] rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl text-gray-900 mb-2">Industry-Academia Integration</h3>
                  <p className="text-gray-600">
                    Strengthening collaboration between educational institutions and industries to 
                    ensure curriculum relevance and student employability.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-2 h-auto bg-[#1E40AF] rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl text-gray-900 mb-2">Skill Development Focus</h3>
                  <p className="text-gray-600">
                    Emphasis on practical skills, vocational training, and holistic development 
                    beyond theoretical knowledge.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-2 h-auto bg-[#10B981] rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl text-gray-900 mb-2">Technology-Enabled Learning</h3>
                  <p className="text-gray-600">
                    Digital platforms for seamless tracking, assessment, and documentation of 
                    internship experiences and learning outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Have questions? We're here to help. Reach out to our team for support, 
                partnerships, or general inquiries.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1E40AF]/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#1E40AF]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">support@interncpnnect.edu.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1E40AF]/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#1E40AF]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">+91 1800-XXX-XXXX</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1E40AF]/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#1E40AF]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">New Delhi, India</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl text-gray-900 mb-6">Quick Contact</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      placeholder="Your message"
                    />
                  </div>
                  <Button className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                    Send Message
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
