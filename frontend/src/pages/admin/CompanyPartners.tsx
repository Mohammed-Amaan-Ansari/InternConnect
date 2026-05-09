import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Building2, Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CompanyPartners() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get("http://127.0.0.1:8000/admin/dashboard/companies", {
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

    const handleRemoveCompany = async (companyId: number) => {
        if (!window.confirm("Are you sure you want to revoke this company's access?")) return;
        
        try {
            const token = localStorage.getItem("token");
            await axios.post(`http://127.0.0.1:8000/admin/dashboard/companies/${companyId}/revoke`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompanies(prev => prev.filter(c => c.id !== companyId));
        } catch (error) {
            console.error("Failed to remove company", error);
            alert("Failed to remove company. Please try again.");
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl text-gray-900 mb-2">Company Partners</h1>
                    <p className="text-gray-600">Overview of all approved industry partners and their platform activity</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">Loading...</div>
                ) : companies.length === 0 ? (
                    <div className="flex justify-center py-20 text-gray-500">No approved companies found.</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {companies.map((company) => (
                            <Card key={company.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Building2 className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{company.company_name}</h3>
                                                <div className="flex gap-2 mt-1">
                                                   <Badge variant="secondary" className="bg-green-100 text-green-800">Active Partner</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                          onClick={() => handleRemoveCompany(company.id)}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors text-sm font-medium"
                                        >
                                          Remove
                                        </button>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{company.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <Phone className="w-4 h-4" />
                                            <span>{company.contact_person}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Total Postings</p>
                                            <p className="text-lg font-semibold text-gray-900">{company.total_postings}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Active Now</p>
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-purple-500" />
                                                <p className="text-lg font-semibold text-purple-600">{company.active_postings}</p>
                                            </div>
                                        </div>
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
