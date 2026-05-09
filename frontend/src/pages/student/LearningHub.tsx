import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { BookOpen, Video, FileText, Award, TrendingUp, Clock, Star, PlayCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LearningHub() {
  const [resources, setResources] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);

  const token = localStorage.getItem('token') || '';

  const fetchResources = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/student/dashboard/learning-resources', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (e) {
      console.error('Error loading resources', e);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchResources();
  }, []);

  const searchYouTube = async () => {
    if (!searchTerm.trim()) return;
    try {
      const url = new URL('http://127.0.0.1:8000/student/dashboard/learning-resources/search');
      url.searchParams.set('query', searchTerm.trim());
      url.searchParams.set('max_results', '12');
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSearchResults(data);
    } catch (e) {
      console.error('Search error', e);
    }
  };

  const importResults = async () => {
    if (!searchTerm.trim()) return;
    try {
      setImporting(true);
      const url = new URL('http://127.0.0.1:8000/student/dashboard/learning-resources/import');
      url.searchParams.set('query', searchTerm.trim());
      url.searchParams.set('max_results', '12');
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchResources();
        alert('Imported search results into your resources');
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.detail || 'Import failed');
      }
    } catch (e) {
      console.error('Import error', e);
    } finally {
      setImporting(false);
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Learning Hub</h1>
          <p className="text-gray-600">Upskill yourself with personalized learning recommendations</p>
        </div>

        {/* YouTube Search */}
        <Card className="border-none shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search learning content (e.g., React hooks, SQL basics)..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                />
              </div>
              <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 px-8" onClick={searchYouTube}>
                Search Videos
              </Button>
              <Button variant="outline" onClick={importResults} disabled={importing}>
                {importing ? 'Importing...' : 'Import These Results'}
              </Button>
            </div>
            {!!searchResults.length && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {searchResults.map((v, idx) => (
                  <Card key={idx} className="border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#1E40AF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Video className="w-6 h-6 text-[#1E40AF]" />
                        </div>
                        <div className="flex-1">
                          <a href={v.url} target="_blank" rel="noreferrer" className="text-[#1E40AF] hover:underline">
                            <h3 className="text-gray-900 mb-2">{v.title}</h3>
                          </a>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{v.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="roadmaps">Roadmaps</TabsTrigger>
            <TabsTrigger value="videos">Platform Videos</TabsTrigger>
            <TabsTrigger value="resources">Saved Videos</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.filter(r => r.category !== 'Roadmap' && r.category !== 'Video').map((r) => (
                <Card key={r.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <Badge className="bg-[#F8FAFC] text-gray-700 border border-gray-200 mb-2">
                      {r.category}
                    </Badge>
                    <a href={r.url.startsWith('http') ? r.url : `http://127.0.0.1:8000${r.url}`} target="_blank" rel="noreferrer" className="text-[#1E40AF] hover:underline">
                      <h3 className="text-lg text-gray-900 mb-2">{r.title}</h3>
                    </a>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{r.description}</p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
                      onClick={() => window.open(r.url.startsWith('http') ? r.url : `http://127.0.0.1:8000${r.url}`, '_blank', 'noopener,noreferrer')}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Watch / View Content
                    </Button>
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-sm text-gray-600 font-medium">Status: {r.status}</span>
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `http://127.0.0.1:8000/student/dashboard/learning-resources/${r.id}/status`,
                              {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ status: r.status === 'Completed' ? 'Saved' : 'Completed' }),
                              }
                            );
                            if (res.ok) {
                              await fetchResources();
                            }
                          } catch (e) {
                            console.error('Update status error', e);
                          }
                        }}
                      >
                        {r.status === 'Completed' ? 'Mark as Saved' : 'Mark Completed'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {resources.filter(r => r.category !== 'Roadmap' && r.category !== 'Video').length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">No courses matching.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.filter(r => r.category === 'Video').map((r) => (
                <Card key={r.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <Badge className="bg-[#F8FAFC] text-gray-700 border border-gray-200 mb-2">
                      {r.category}
                    </Badge>
                    <a href={r.url.startsWith('http') ? r.url : `http://127.0.0.1:8000${r.url}`} target="_blank" rel="noreferrer" className="text-[#1E40AF] hover:underline">
                      <h3 className="text-lg text-gray-900 mb-2">{r.title}</h3>
                    </a>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{r.description}</p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
                      onClick={() => window.open(r.url.startsWith('http') ? r.url : `http://127.0.0.1:8000${r.url}`, '_blank', 'noopener,noreferrer')}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Watch / View Content
                    </Button>
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-sm text-gray-600 font-medium">Status: {r.status}</span>
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('token') || '';
                            const res = await fetch(
                              `http://127.0.0.1:8000/student/dashboard/learning-resources/${r.id}/status`,
                              {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ status: r.status === 'Completed' ? 'Saved' : 'Completed' }),
                              }
                            );
                            if (res.ok) {
                              const fetchResources = async () => {
                                 const tres = await fetch('http://127.0.0.1:8000/student/dashboard/learning-resources', { headers: { Authorization: `Bearer ${token}` }});
                                 if (tres.ok) {
                                     // Quick hack to force reload in context
                                     window.location.reload();
                                 }
                              };
                              await fetchResources();
                            }
                          } catch (e) {
                            console.error('Update status error', e);
                          }
                        }}
                      >
                        {r.status === 'Completed' ? 'Mark as Saved' : 'Mark Completed'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {resources.filter(r => r.category === 'Video').length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">No platform videos available.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="roadmaps">
            <div className="grid md:grid-cols-2 gap-6">
              {resources.filter(r => r.category === 'Roadmap').map((r) => (
                <Card key={r.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg text-gray-900 mb-2">{r.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{r.description}</p>
                        <Button 
                          className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90"
                          onClick={() => window.open(r.url.startsWith('http') ? r.url : `http://127.0.0.1:8000${r.url}`, '_blank', 'noopener,noreferrer,width=800,height=900')}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Open Roadmap PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {resources.filter(r => r.category === 'Roadmap').length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">No roadmaps provided yet.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((v, index) => (
                <Card key={index} className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#1E40AF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Video className="w-6 h-6 text-[#1E40AF]" />
                      </div>
                      <div className="flex-1">
                        <a href={v.url} target="_blank" rel="noreferrer" className="text-[#1E40AF] hover:underline">
                          <h3 className="text-gray-900 mb-2">{v.title}</h3>
                        </a>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{v.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="border-none shadow-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-32 h-32 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-16 h-16 text-[#10B981]" />
                  </div>
                  <h2 className="text-2xl text-gray-900 mb-2">Keep Learning!</h2>
                  <p className="text-gray-600">You've completed 3 courses this month</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-[#F8FAFC] rounded-lg">
                    <p className="text-3xl text-[#1E40AF] mb-2">24</p>
                    <p className="text-sm text-gray-600">Hours Learned</p>
                  </div>
                  <div className="text-center p-6 bg-[#F8FAFC] rounded-lg">
                    <p className="text-3xl text-[#10B981] mb-2">8</p>
                    <p className="text-sm text-gray-600">Certificates Earned</p>
                  </div>
                  <div className="text-center p-6 bg-[#F8FAFC] rounded-lg">
                    <p className="text-3xl text-orange-500 mb-2">95%</p>
                    <p className="text-sm text-gray-600">Average Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
