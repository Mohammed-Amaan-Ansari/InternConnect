import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Plus, Calendar, Download, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Logbook() {
  const [showAddEntry, setShowAddEntry] = useState(false);

  const entries = [
    {
      id: 1,
      date: '2024-11-15',
      week: 'Week 4',
      title: 'Implemented User Authentication Module',
      description: 'Completed the user authentication feature using JWT tokens. Integrated login and signup functionality with proper validation.',
      hours: 8,
      skills: ['React', 'Node.js', 'JWT'],
      supervisorComment: 'Excellent work! Keep it up.',
      status: 'Approved',
    },
    {
      id: 2,
      date: '2024-11-08',
      week: 'Week 3',
      title: 'Database Schema Design',
      description: 'Designed and implemented database schema for the project. Created necessary tables and relationships.',
      hours: 6,
      skills: ['MongoDB', 'Database Design'],
      supervisorComment: null,
      status: 'Pending Review',
    },
    {
      id: 3,
      date: '2024-11-01',
      week: 'Week 2',
      title: 'Project Setup and Planning',
      description: 'Set up the development environment, initialized the project structure, and planned the sprint activities.',
      hours: 4,
      skills: ['Project Management', 'Git'],
      supervisorComment: 'Good start! Make sure to document everything.',
      status: 'Approved',
    },
  ];

  return (
    <DashboardLayout role="student">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Internship Logbook</h1>
            <p className="text-gray-600">Document your daily activities and learning</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]/90" onClick={() => setShowAddEntry(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Entries</p>
              <p className="text-3xl text-gray-900">{entries.length}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Hours</p>
              <p className="text-3xl text-gray-900">{entries.reduce((sum, e) => sum + e.hours, 0)}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl text-[#10B981]">
                {entries.filter((e) => e.status === 'Approved').length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl text-orange-500">
                {entries.filter((e) => e.status === 'Pending Review').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Entry Form */}
        {showAddEntry && (
          <Card className="border-none shadow-sm mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl text-gray-900 mb-6">New Logbook Entry</h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Hours Worked</label>
                    <input
                      type="number"
                      placeholder="8"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="What did you work on today?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your activities, learnings, and achievements..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Skills Used (comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, MongoDB"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowAddEntry(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                    Save Entry
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Entries List */}
        <div className="space-y-6">
          {entries.map((entry) => (
            <Card key={entry.id} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl text-gray-900">{entry.title}</h3>
                      <Badge
                        className={
                          entry.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {entry.status === 'Approved' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {entry.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                      <span>•</span>
                      <span>{entry.week}</span>
                      <span>•</span>
                      <span>{entry.hours} hours</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">{entry.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {entry.skills.map((skill, index) => (
                    <Badge key={index} className="bg-[#1E40AF]/10 text-[#1E40AF]">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {entry.supervisorComment && (
                  <div className="bg-[#F8FAFC] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-[#1E40AF]" />
                      <span className="text-sm text-gray-700">Supervisor Feedback</span>
                    </div>
                    <p className="text-sm text-gray-600">{entry.supervisorComment}</p>
                  </div>
                )}

                {!entry.supervisorComment && entry.status === 'Pending Review' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      Waiting for supervisor review and feedback
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
