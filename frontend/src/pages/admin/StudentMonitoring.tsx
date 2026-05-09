import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Eye, Download, GraduationCap, Briefcase, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentMonitoring() {
  const [data, setData] = useState<any>({
    analytics: { enrolled: 0, ongoing: 0, completed: 0 },
    students: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedLogbookStudent, setSelectedLogbookStudent] = useState<any>(null);
  const [studentLogbooks, setStudentLogbooks] = useState<any[]>([]);
  const [logbookLoading, setLogbookLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://127.0.0.1:8000/admin/dashboard/students", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleViewLogbook = async (student: any) => {
    setSelectedLogbookStudent(student);
    setLogbookLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://127.0.0.1:8000/admin/dashboard/students/${student.id}/logbooks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentLogbooks(res.data);
    } catch (e) {
      console.error("Failed to fetch logbooks", e);
    } finally {
      setLogbookLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Student Monitoring</h1>
          <p className="text-gray-600">Track student internship progress and performance</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-semibold text-gray-900">{data.analytics.enrolled}</p>
                      <p className="text-sm text-gray-600">Enrolled for Placements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-semibold text-gray-900">{data.analytics.ongoing}</p>
                      <p className="text-sm text-gray-600">Ongoing Internships</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-semibold text-gray-900">{data.analytics.completed}</p>
                      <p className="text-sm text-gray-600">Completed Placements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {data.students.length === 0 ? (
              <div className="flex justify-center py-20 text-gray-500">No students found.</div>
            ) : (
              <div className="space-y-4">
                {data.students.map((student: any) => (
                  <Card key={student.id} className="border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl text-gray-900">{student.name}</h3>
                            <Badge className={student.status === 'Ongoing' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                              {student.status}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-600 mb-4">
                            <span>{student.course}</span>
                            <span>•</span>
                            <span>{student.year} Year</span>
                            <span>•</span>
                            <span>Interning at: {student.company}</span>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Internship Progress</span>
                              <span className="text-gray-900">{student.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-[#10B981] h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewLogbook(student)}>
                            <Download className="w-4 h-4 mr-2" />
                            Logbook
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Student Details: {selectedStudent.name}</h2>
            <div className="space-y-4 overflow-y-auto pr-2 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-medium">{selectedStudent.course}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">{selectedStudent.year} Year</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className="font-medium"><Badge>{selectedStudent.status}</Badge></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interning At</p>
                  <p className="font-medium">{selectedStudent.company}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3 mt-4">Internship Applications</h3>
                {selectedStudent.applications && selectedStudent.applications.length > 0 ? (
                  <div className="space-y-3">
                    {selectedStudent.applications.map((app: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-md border border-gray-100 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{app.role}</p>
                          <p className="text-sm text-gray-600">{app.company}</p>
                        </div>
                        <Badge className={
                          app.status === 'Selected' || app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                        }>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No applications actively tracked.</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end flex-none pt-4 border-t">
              <Button onClick={() => setSelectedStudent(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {selectedLogbookStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative max-h-[90vh] flex flex-col">
            <button onClick={() => setSelectedLogbookStudent(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <Eye className="w-5 h-5 hidden" /> {/* Hidden icon for symmetry, could use X */}
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedLogbookStudent.name}'s Logbook History</h2>
            <div className="overflow-y-auto flex-1 pr-2">
              {logbookLoading ? (
                <div className="py-10 text-center text-gray-500">Loading logbooks...</div>
              ) : studentLogbooks.length === 0 ? (
                <div className="py-10 text-center text-gray-500">No logbook entries submitted yet.</div>
              ) : (
                <div className="space-y-4">
                  {studentLogbooks.map(lb => (
                    <Card key={lb.id} className="shadow-sm border border-gray-100">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-lg">Week {lb.weekNumber}</h3>
                          <Badge className={lb.status === 'Approved' ? 'bg-green-100 text-green-800' : lb.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                            {lb.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{lb.taskDescription}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>Hours: {lb.hoursWorked}</span>
                          <span>Submitted: {new Date(lb.submittedAt).toLocaleDateString()}</span>
                          {lb.fileUrl && (
                            <a href={lb.fileUrl.startsWith('http') ? lb.fileUrl : `http://127.0.0.1:8000${lb.fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Attached File</a>
                          )}
                        </div>
                        {lb.supervisorComments && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm border-l-2 border-[#1E40AF]">
                            <strong>Supervisor Note:</strong> {lb.supervisorComments}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end flex-none pt-4 border-t">
              <Button onClick={() => setSelectedLogbookStudent(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
