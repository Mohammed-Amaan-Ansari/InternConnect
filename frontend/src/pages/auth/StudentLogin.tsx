import { Link, useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { GraduationCap, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function StudentLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Build form data
    const formBody = new URLSearchParams();
    formBody.append("username", formData.email); // must be "username" for OAuth2PasswordRequestForm
    formBody.append("password", formData.password);

    const response = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // important!
      },
      body: formBody.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Login failed");
      return;
    }

    // Save token in localStorage
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.role);

    // Redirect based on role
    if (data.role === "student") {
      navigate("/student/dashboard");
    } else {
      alert("Select Proper Login Role");
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong");
  }
};


  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicNavbar />

      <div className="max-w-md mx-auto px-4 py-16">
        <Link to="/auth/role-selection" className="inline-flex items-center gap-2 text-[#1E40AF] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to role selection
        </Link>

        <Card className="border-none shadow-sm">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl text-gray-900 text-center mb-2">Student Sign In</h1>
            <p className="text-gray-600 text-center mb-8">
              Access your internship dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    placeholder="student@college.edu"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-[#1E40AF] rounded" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-[#1E40AF] hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/auth/student/register" className="text-[#1E40AF] hover:underline">
                  Register now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
