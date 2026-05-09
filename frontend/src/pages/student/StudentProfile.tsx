import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { User, Mail, Phone, MapPin, Upload, Plus, X, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    college: '',
    course: '',
    year: '',
    cgpa: '',
    graduationYear: '',
    resumeUrl: '',
    portfolioUrl: '',
    skills: [] as string[],
    profileVisibility: true,
  });

  const [uploadingResume, setUploadingResume] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://127.0.0.1:8000/student/dashboard/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile({
        ...profile,
        fullName: res.data.fullName || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        course: res.data.course || '',
        year: res.data.year || '',
        resumeUrl: res.data.resumeUrl || '',
        portfolioUrl: res.data.portfolioUrl || '',
        profileVisibility: res.data.profileVisibility ?? true,
      });
      setSkills(res.data.skills || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put("http://127.0.0.1:8000/student/dashboard/profile", {
        ...profile,
        skills: skills
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingResume(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/student/dashboard/profile/resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setProfile({ ...profile, resumeUrl: res.data.resumeUrl });
      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload resume");
    } finally {
      setUploadingResume(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (loading) return (
    <DashboardLayout role="student">
      <div className="flex justify-center py-20">Loading profile data...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout role="student">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="border-none shadow-sm lg:col-span-1">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-[#1E40AF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Profile Completion</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#10B981] h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">75% Complete</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Quick Stats</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Applications</span>
                      <span className="text-gray-900">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Profile Views</span>
                      <span className="text-gray-900">48</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Member Since</span>
                      <span className="text-gray-900">Jan 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl text-gray-900 mb-6">Personal Information</h2>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Passionate computer science student seeking opportunities in software development and data analytics."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Academic Details */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl text-gray-900 mb-6">Academic Details</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">College/University</label>
                      <input
                        type="text"
                        value={profile.college}
                        onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Course/Program</label>
                      <input
                        type="text"
                        value={profile.course}
                        onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Year</label>
                      <select
                        value={profile.year}
                        onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">CGPA</label>
                      <input
                        type="text"
                        value={profile.cgpa}
                        onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Graduation Year</label>
                      <input
                        type="text"
                        value={profile.graduationYear}
                        onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl text-gray-900 mb-6">Skills</h2>
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a new skill"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button onClick={addSkill} className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} className="bg-[#1E40AF]/10 text-[#1E40AF] hover:bg-[#1E40AF]/20 px-3 py-1.5">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-2">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resume */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl text-gray-900 mb-6">Resume</h2>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1E40AF] transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload your resume</p>
                  <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 2MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                  />
                  <Button variant="outline" className="mt-4" disabled={uploadingResume}>
                    {uploadingResume ? "Uploading..." : "Choose File"}
                  </Button>
                </div>
                {profile.resumeUrl ? (
                  <p className="text-xs text-green-600 mt-2">
                    Current Resume: <a href={`http://127.0.0.1:8000${profile.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-green-800">View Resume</a>
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">No resume uploaded yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={fetchProfile}>Cancel</Button>
              <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]/90" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
