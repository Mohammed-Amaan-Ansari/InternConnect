import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Star, MapPin, GraduationCap, Eye, MessageSquare, X, Check, Mail, Phone, Building, FileText, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CandidatesReview() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const navigate = useNavigate();

  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [minCgpaFilter, setMinCgpaFilter] = useState('');

  const fetchCandidates = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = new URL("http://127.0.0.1:8000/industry/dashboard/candidates");
    if (roleFilter !== 'All Roles') {
      url.searchParams.set('role', roleFilter);
    }
    if (minCgpaFilter && !isNaN(parseFloat(minCgpaFilter))) {
      url.searchParams.set('min_cgpa', minCgpaFilter);
    }

    setLoading(true);
    axios.get(url.toString(), {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res: any) => {
        setCandidates(res.data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCandidates();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [roleFilter, minCgpaFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://127.0.0.1:8000/industry/dashboard/applications/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleMessage = (studentUserId: number, candidateName: string) => {
    if (!studentUserId) {
       console.error("No student_user_id available for this candidate");
       return;
    }
    navigate(`/industry/messages?studentId=${studentUserId}&name=${encodeURIComponent(candidateName)}`);
  };

  return (
    <DashboardLayout role="industry">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Review Candidates</h1>
          <p className="text-gray-600">Browse and shortlist candidates for your internships</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg text-gray-900 mb-4">Filters</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Role</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option>All Roles</option>
                      <option>Software Development</option>
                      <option>Data Analytics</option>
                      <option>UI/UX Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Min CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="7.0"
                      value={minCgpaFilter}
                      onChange={(e) => setMinCgpaFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">Loading...</div>
            ) : candidates.length === 0 ? (
              <div className="flex justify-center py-10 text-gray-500">No candidates found.</div>
            ) : (
              candidates.map((candidate: any) => (
                <Card key={candidate.id} className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-[#1E40AF] rounded-full flex items-center justify-center text-white text-xl uppercase">
                          {candidate.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl text-gray-900">{candidate.name}</h3>
                            <Badge className="bg-[#10B981]/10 text-[#10B981]">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {candidate.match}% Match
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              <span>{candidate.college}</span>
                            </div>
                            <span>•</span>
                            <span>{candidate.course}</span>
                            <span>•</span>
                            <span>CGPA: {candidate.cgpa}</span>
                          </div>
                          {candidate.skills && candidate.skills.length > 0 && candidate.skills[0] !== '' && (
                            <div className="flex gap-2 mb-3">
                              {candidate.skills.map((skill: string, idx: number) => (
                                <Badge key={idx} className="bg-[#F8FAFC] text-gray-700 border border-gray-200">{skill}</Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-sm text-gray-600">Applied for: {candidate.role}</p>
                          <p className="text-xs mt-1 text-gray-500">Status: {candidate.status}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(candidate.status === 'Shortlisted' || candidate.status === 'Selected') && (
                          <Button variant="outline" size="sm" onClick={() => handleMessage(candidate.student_user_id, candidate.name)}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(candidate)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>

                        {(candidate.status === 'Applied' || candidate.status === 'Reviewed') && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleStatusChange(candidate.id, 'Rejected')}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-[#1E40AF] hover:bg-[#1E40AF]/90"
                              onClick={() => handleStatusChange(candidate.id, 'Shortlisted')}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Shortlist
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative overflow-hidden flex flex-col max-h-[92vh] border border-white/20">
            <div className="p-8 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#1E40AF] rounded-full flex items-center justify-center text-white text-2xl uppercase font-semibold shadow-inner">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCandidate.name}</h2>
                  <p className="text-[#1E40AF] font-medium flex items-center gap-2 mt-1">
                    {selectedCandidate.role}
                    <Badge variant="secondary" className="bg-[#10B981]/10 text-[#10B981] border-none ml-2">
                      {selectedCandidate.status}
                    </Badge>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)} 
                className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              {/* Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-gray-400" /> Contact Info
                  </h3>
                  <div className="space-y-3">
                    <a href={`mailto:${selectedCandidate.email}`} className="flex items-center gap-3 text-gray-600 hover:text-[#1E40AF] transition-colors">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedCandidate.email}
                    </a>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedCandidate.phone}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" /> Education
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-gray-600">
                      <Building className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedCandidate.college}</p>
                        <p className="text-sm">{selectedCandidate.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Star className="w-4 h-4 text-gray-400" />
                      CGPA: <span className="font-semibold text-gray-900">{selectedCandidate.cgpa}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {selectedCandidate.skills && selectedCandidate.skills.length > 0 && selectedCandidate.skills[0] !== '' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Core Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((s: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-[#1E40AF]/5 text-[#1E40AF] border-[#1E40AF]/20 px-3 py-1">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume Section */}
              {selectedCandidate.resumeUrl && typeof selectedCandidate.resumeUrl === 'string' && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Applicant Resume</p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <a 
                    href={selectedCandidate.resumeUrl.startsWith('http') ? selectedCandidate.resumeUrl : `http://127.0.0.1:8000${selectedCandidate.resumeUrl}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1E40AF] transition-colors shadow-sm"
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 bg-gray-50/50">
              <Button variant="outline" onClick={() => setSelectedCandidate(null)}>Close Profile</Button>
              {(selectedCandidate.status === 'Applied' || selectedCandidate.status === 'Reviewed') && (
                <Button 
                  className="bg-[#1E40AF] hover:bg-[#1E40AF]/90"
                  onClick={() => {
                    handleStatusChange(selectedCandidate.id, 'Shortlisted');
                    setSelectedCandidate(null);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" /> Shortlist Candidate
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
