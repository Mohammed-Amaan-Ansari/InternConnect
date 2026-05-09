import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Edit, Trash2, Eye, Users, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageListings() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://127.0.0.1:8000/industry/dashboard/internships", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const formatted = res.data.map((item: any) => ({
          ...item,
          posted: new Date(item.posted).toLocaleDateString()
        }));
        setInternships(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleClose = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://127.0.0.1:8000/industry/dashboard/internships/${id}/status`, { status: "Closed" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInternships(prev => prev.map(item => item.id === id ? { ...item, status: 'Closed' } : item));
    } catch (err) {
      console.error("Failed to close internship", err);
    }
  };

  const activeListings = internships.filter(i => i.status === 'Active');
  const closedListings = internships.filter(i => i.status === 'Closed');
  const draftListings = internships.filter(i => i.status === 'Pending');

  return (
    <DashboardLayout role="industry">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Manage Internship Listings</h1>
            <p className="text-gray-600">View and manage all your posted internships</p>
          </div>
          <Link to="/industry/post">
            <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">Post New</Button>
          </Link>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({activeListings.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({closedListings.length})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({draftListings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 space-y-4">
            {activeListings.map((listing) => (
              <Card key={listing.id} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl text-gray-900">{listing.title}</h3>
                        <Badge className="bg-green-100 text-green-800">{listing.status}</Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{listing.applications} applications</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{listing.views} views</span>
                        </div>
                        <span>Posted {listing.posted}</span>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleClose(listing.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="closed" className="mt-6 space-y-4">
            {closedListings.length === 0 ? (
              <Card className="border-none shadow-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">No closed internships</p>
                </CardContent>
              </Card>
            ) : (
              closedListings.map((listing) => (
                <Card key={listing.id} className="border-none shadow-sm opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl text-gray-900">{listing.title}</h3>
                        <Badge variant="secondary">{listing.status}</Badge>
                      </div>
                      <span className="text-sm text-gray-500">Posted {listing.posted}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="draft" className="mt-6 space-y-4">
            {draftListings.length === 0 ? (
              <Card className="border-none shadow-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">No draft internships</p>
                </CardContent>
              </Card>
            ) : (
              draftListings.map((listing) => (
                <Card key={listing.id} className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl text-gray-900">{listing.title}</h3>
                        <Badge className="bg-yellow-100 text-yellow-800">{listing.status}</Badge>
                      </div>
                      <span className="text-sm text-gray-500">Posted {listing.posted}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
