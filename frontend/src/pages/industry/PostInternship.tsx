import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function PostInternship() {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [category, setCategory] = useState('Technology');
  const [description, setDescription] = useState('');

  const [duration, setDuration] = useState('1 month');
  const [type, setType] = useState('Full-time');
  const [openings, setOpenings] = useState(1);
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('On-site');
  const [stipend, setStipend] = useState('');
  const [deadline, setDeadline] = useState('');

  const [eligibility, setEligibility] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [preferredYear, setPreferredYear] = useState('');
  const [benefits, setBenefits] = useState('');

  const [skills, setSkills] = useState<string[]>(['React', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to post an internship.");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/industry/dashboard/internships",
        {
          title,
          department,
          category,
          description,
          duration,
          type,
          openings,
          location,
          workMode,
          stipend,
          deadline,
          eligibility,
          skills,
          minCgpa,
          preferredYear,
          benefits
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Internship posted successfully!");
      navigate("/industry/dashboard");
    } catch (error) {
      console.error("Failed to post internship", error);
      alert("Failed to post internship. Please check console for details.");
    }
  };

  return (
    <DashboardLayout role="industry">
      <div className="max-w-4xl mx-auto">
        <Link to="/industry/dashboard" className="inline-flex items-center gap-2 text-[#1E40AF] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Post New Internship</h1>
          <p className="text-gray-600">Fill in the details to create an internship opportunity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl text-gray-900 mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Internship Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Software Development Intern"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Department *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    >
                      <option>Engineering</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>Operations</option>
                      <option>Design</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    >
                      <option>Technology</option>
                      <option>Marketing</option>
                      <option>Finance</option>
                      <option>Design</option>
                      <option>Content Writing</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Description *</label>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internship Details */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl text-gray-900 mb-6">Internship Details</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Duration *</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    >
                      <option>1 month</option>
                      <option>2 months</option>
                      <option>3 months</option>
                      <option>4 months</option>
                      <option>5 months</option>
                      <option>6 months</option>
                      <option>6+ months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Type *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">No. of Openings *</label>
                    <input
                      type="number"
                      value={openings}
                      onChange={(e) => setOpenings(Number(e.target.value))}
                      placeholder="5"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Work Mode *</label>
                    <select
                      value={workMode}
                      onChange={(e) => setWorkMode(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    >
                      <option>On-site</option>
                      <option>Remote</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Stipend (₹/month) *</label>
                    <input
                      type="number"
                      value={stipend}
                      onChange={(e) => setStipend(e.target.value)}
                      placeholder="20000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Application Deadline *</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl text-gray-900 mb-6">Requirements</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Eligibility Criteria</label>
                  <textarea
                    rows={3}
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    placeholder="e.g., Currently pursuing B.Tech/B.E. in Computer Science or related field"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Required Skills</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} className="bg-[#1E40AF]/10 text-[#1E40AF] px-3 py-1.5">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="ml-2">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Minimum CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={minCgpa}
                      onChange={(e) => setMinCgpa(e.target.value)}
                      placeholder="7.0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Preferred Year of Study</label>
                    <select
                      value={preferredYear}
                      onChange={(e) => setPreferredYear(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    >
                      <option value="">Any</option>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl text-gray-900 mb-6">Benefits & Perks</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Additional Benefits / Perks</label>
                  <textarea
                    rows={3}
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    placeholder="E.g., Certificate of Completion, Pre-Placement Offer (PPO), Flexible Working Hours..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Link to="/industry/dashboard" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button type="button" variant="outline" className="flex-1">
              Save as Draft
            </Button>
            <Button type="submit" className="flex-1 bg-[#1E40AF] hover:bg-[#1E40AF]/90">
              Post Internship
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
