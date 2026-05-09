import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useState, FormEvent, useRef } from 'react';
import axios from 'axios';
import { BookOpen, Upload } from 'lucide-react';

export default function ResourceManagement() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Roadmap');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || (!file && !url)) {
      alert("Please provide a title and either a file or a URL.");
      return;
    }
    
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    if (file) formData.append("file", file);
    if (url) formData.append("url", url);

    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/admin/dashboard/learning-resources", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Resource uploaded successfully!");
      setTitle('');
      setDescription('');
      setUrl('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      alert("Failed to upload resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-[#1E40AF]" />
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Resource Management</h1>
            <p className="text-gray-600">Upload roadmaps and learning materials for students</p>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1E40AF]"
                    placeholder="e.g. Data Science Roadmap 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1E40AF]"
                  >
                    <option value="Roadmap">Roadmap</option>
                    <option value="Course">Course</option>
                    <option value="Article">Article</option>
                    <option value="Study Material">Study Material</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1E40AF]"
                  placeholder="Briefly describe what this resource entails"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 p-4 bg-[#F8FAFC] rounded-lg border border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File (PDF)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1E40AF]/10 file:text-[#1E40AF] hover:file:bg-[#1E40AF]/20"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400 font-medium">OR</span>
                    <label className="text-sm font-medium text-gray-700">External URL</label>
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1E40AF]"
                    placeholder="https://example.com/guide"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading} className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 px-8">
                  <Upload className="w-4 h-4 mr-2" />
                  {loading ? 'Uploading...' : 'Publish Resource'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
