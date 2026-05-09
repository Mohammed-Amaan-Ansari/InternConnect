import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Search, MapPin, Calendar, DollarSign, Briefcase, Filter, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function InternshipSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, Record<string, boolean>>>({
    location: {},
    duration: {},
    type: {},
    stipend: {},
  });

  const [internships, setInternships] = useState<any[]>([]);
  const [sort, setSort] = useState<string>('newest');
  const token = localStorage.getItem('token') || '';

  const fetchInternships = async () => {
    try {
      const url = new URL("http://127.0.0.1:8000/student/dashboard/internships");
      if (searchTerm.trim()) url.searchParams.set('keyword', searchTerm.trim());
      if (sort) url.searchParams.set('sort', sort);

      const locations = Object.keys(selectedFilters.location).filter(k => selectedFilters.location[k]);
      if (locations.length > 0) url.searchParams.set('location', locations.join(','));

      const durations = Object.keys(selectedFilters.duration).filter(k => selectedFilters.duration[k]);
      if (durations.length > 0) url.searchParams.set('duration', durations.join(','));

      const types = Object.keys(selectedFilters.type).filter(k => selectedFilters.type[k]);
      if (types.length > 0) url.searchParams.set('type', types.join(','));

      const stipends = Object.keys(selectedFilters.stipend).filter(k => selectedFilters.stipend[k]);
      if (stipends.length > 0) url.searchParams.set('stipend', stipends.join(','));

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInternships(data);
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
    }
  };

  const handleFilterChange = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [value]: !prev[category][value as keyof typeof prev[typeof category]]
      }
    }));
  };

  // Re-fetch when filters/sort/search change
  useEffect(() => {
    if (!token) return;
    const delayDebounceFn = setTimeout(() => {
      fetchInternships();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, sort, selectedFilters]);

  const applyNow = async (internshipId: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/student/dashboard/applications/${internshipId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        alert("Applied successfully");
      } else {
        alert(body.detail || body.message || "Apply failed");
      }
    } catch (e) {
      console.error("Apply error", e);
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Find Internships</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and interests</p>
        </div>

        {/* Search Bar */}
        <Card className="border-none shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by job title, company, or skills..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                />
              </div>
              <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 px-8" onClick={fetchInternships}>
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg text-gray-900">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#1E40AF]"
                    onClick={() => setSelectedFilters({ location: {}, duration: {}, type: {}, stipend: {} })}
                  >
                    Clear All
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-3">Location</label>
                    <div className="space-y-2">
                      {['Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Remote'].map((loc) => (
                        <label key={loc} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-[#1E40AF] rounded"
                            checked={!!selectedFilters.location[loc]}
                            onChange={() => handleFilterChange('location', loc)}
                          />
                          <span className="text-gray-700">{loc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="pt-6 border-t border-gray-200">
                    <label className="block text-sm text-gray-700 mb-3">Duration</label>
                    <div className="space-y-2">
                      {['1-3 months', '3-6 months', '6+ months'].map((dur) => (
                        <label key={dur} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-[#1E40AF] rounded"
                            checked={!!selectedFilters.duration[dur]}
                            onChange={() => handleFilterChange('duration', dur)}
                          />
                          <span className="text-gray-700">{dur}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Type */}
                  <div className="pt-6 border-t border-gray-200">
                    <label className="block text-sm text-gray-700 mb-3">Type</label>
                    <div className="space-y-2">
                      {['Full-time', 'Part-time'].map((type) => (
                        <label key={type} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-[#1E40AF] rounded"
                            checked={!!selectedFilters.type[type]}
                            onChange={() => handleFilterChange('type', type)}
                          />
                          <span className="text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Stipend */}
                  <div className="pt-6 border-t border-gray-200">
                    <label className="block text-sm text-gray-700 mb-3">Stipend Range</label>
                    <div className="space-y-2">
                      {['< ₹10,000', '₹10,000 - ₹20,000', '> ₹20,000'].map((range) => (
                        <label key={range} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-[#1E40AF] rounded"
                            checked={!!selectedFilters.stipend[range]}
                            onChange={() => handleFilterChange('stipend', range)}
                          />
                          <span className="text-gray-700">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">{internships.length} internships found</p>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Sort by: Most Recent</option>
                <option value="stipend">Sort by: Highest Stipend</option>
              </select>
            </div>

            <div className="space-y-4">
              {internships.map((internship) => (
                <Card key={internship.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl text-gray-900">{internship.title}</h3>
                          <div className="flex items-center gap-1 px-2 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{internship.match}% Match</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{internship.company}</p>
                      </div>
                      <span className="text-sm text-gray-500">{internship.postedDate}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{internship.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{internship.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{internship.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#10B981]">
                        <DollarSign className="w-4 h-4" />
                        <span>{internship.stipend}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {internship.skills.map((skill: string, index: number) => (
                        <Badge key={index} className="bg-[#F8FAFC] text-gray-700 border border-gray-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Link to={`/student/internship/${internship.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button className="flex-1 bg-[#1E40AF] hover:bg-[#1E40AF]/90" onClick={() => applyNow(internship.id)}>
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button size="sm" className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
