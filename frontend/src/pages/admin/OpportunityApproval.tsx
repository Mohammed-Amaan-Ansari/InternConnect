import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CheckCircle2, Building2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function OpportunityApproval() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://127.0.0.1:8000/admin/dashboard/companies/pending", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCompanies(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://127.0.0.1:8000/admin/dashboard/companies/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm("Are you sure you want to reject this company?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://127.0.0.1:8000/admin/dashboard/companies/${id}/reject`,
        { reason: "Registration rejected by Admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error("Failed to reject company", e);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Company Approvals</h1>
          <p className="text-gray-600">Review and approve new company registrations for industry portal access</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">Loading...</div>
        ) : companies.length === 0 ? (
          <div className="flex justify-center py-20 text-gray-500">No pending company registrations at the moment.</div>
        ) : (
          <div className="space-y-4">
            {companies.map((company) => (
              <Card key={company.id} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl text-gray-900 mb-2">{company.company_name}</h3>
                      <p className="text-gray-600 mb-3">{company.address}</p>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Contact: {company.contact_person}</span>
                        <span>•</span>
                        <span className="text-[#10B981]">{company.designation}</span>
                        <span>•</span>
                        <span>Phone: {company.phone}</span>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" className="bg-[#10B981] hover:bg-[#10B981]/90" onClick={() => handleApprove(company.id)}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve Connect Access
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={() => handleReject(company.id)}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
