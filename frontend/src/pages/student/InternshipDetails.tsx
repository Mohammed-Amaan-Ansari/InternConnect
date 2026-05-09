import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Users,
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Bookmark,
  MessageSquare,
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InternshipDetails() {
  const { id } = useParams<{ id: string }>();
  const [internship, setInternship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;

    axios.get(`http://127.0.0.1:8000/student/dashboard/internships/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setInternship(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/student/dashboard/applications/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Successfully applied for internship!");
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        alert(err.response.data.detail);
      } else {
        alert("Failed to apply");
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex justify-center items-center py-20">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!internship) {
    return (
      <DashboardLayout role="student">
        <div className="flex justify-center items-center py-20">Internship not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="max-w-5xl mx-auto">
        <Link to="/student/search" className="inline-flex items-center gap-2 text-[#1E40AF] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl text-gray-900 mb-3">{internship.title}</h1>
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-gray-500" />
                      <span className="text-xl text-gray-700">{internship.company}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm">{internship.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm">{internship.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#10B981]">
                    <DollarSign className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Stipend</p>
                      <p className="text-sm">{internship.stipend}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="text-sm">{internship.type}</p>
                    </div>
                  </div>
                </div>

                {internship.skills && internship.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {internship.skills.map((skill: string, index: number) => (
                      <Badge key={index} className="bg-[#1E40AF]/10 text-[#1E40AF]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl text-gray-900 mb-3">About the Internship</h2>
                    <p className="text-gray-600 leading-relaxed">{internship.description || 'No description provided.'}</p>
                  </div>

                  {internship.responsibilities && internship.responsibilities.length > 0 && (
                    <div>
                      <h2 className="text-xl text-gray-900 mb-3">Responsibilities</h2>
                      <ul className="space-y-2">
                        {internship.responsibilities.map((resp: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {internship.requirements && internship.requirements.length > 0 && internship.requirements[0] !== '' && (
                    <div>
                      <h2 className="text-xl text-gray-900 mb-3">Requirements</h2>
                      <ul className="space-y-2">
                        {internship.requirements.map((req: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {internship.benefits && internship.benefits.length > 0 && internship.benefits[0] !== '' && (
                    <div>
                      <h2 className="text-xl text-gray-900 mb-3">Benefits & Perks</h2>
                      <ul className="space-y-2">
                        {internship.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <Button onClick={handleApply} className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90 mb-4">
                  Apply Now
                </Button>
                {internship.company_user_id && (
                  <Button 
                    variant="outline" 
                    className="w-full mb-4 border-[#1E40AF] text-[#1E40AF] hover:bg-[#1E40AF]/5"
                    onClick={() => navigate(`/student/messages?companyId=${internship.company_user_id}&name=${encodeURIComponent(internship.company)}`)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message HR
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Save for Later
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg text-gray-900 mb-4">Application Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Openings</span>
                    <Badge className="bg-[#10B981]/10 text-[#10B981]">{internship.openings} positions</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Applicants</span>
                    <span className="text-sm text-gray-900">{internship.applicants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Posted</span>
                    <span className="text-sm text-gray-900">{new Date(internship.postedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Deadline</span>
                    <Badge className="bg-orange-100 text-orange-800">{internship.deadline}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
