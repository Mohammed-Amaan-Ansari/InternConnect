import { Link, useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { School, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function CollegeRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    facultyName: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("http://127.0.0.1:8000/auth/register/faculty", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
    facultyName: formData.facultyName,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Registration failed");
      return;
    }

    // Optional: store token or user
    localStorage.setItem("collegeUser", JSON.stringify(data));

    alert("Registration successful!");

    // Navigate after successful registration
    navigate("/auth/college/login");

  } catch (error) {
    console.error(error);
    alert("Server error. Make sure FastAPI is running.");
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicNavbar />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link
          to="/auth/role-selection"
          className="inline-flex items-center gap-2 text-[#1E40AF] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to role selection
        </Link>

        <Card className="border-none shadow-sm">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <School className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl text-gray-900 text-center mb-2">
              College/Institution Registration
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Register your institution to manage student internships
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Faculty Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Faculty Name
                </label>
                <input
                  type="text"
                  value={formData.facultyName}
                  onChange={(e) =>
                    setFormData({ ...formData, facultyName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  placeholder="Faculty Name"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  placeholder="faculty@college.edu.in"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  placeholder="Full address"
                  required
                />
              </div>

              {/* Passwords */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    placeholder="Minimum 8 characters"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 text-[#1E40AF] rounded"
                  required
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#1E40AF] hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-[#1E40AF] hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90"
              >
                Register Institution
              </Button>
            </form>

            {/* Already Registered */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already registered?{' '}
                <Link
                  to="/auth/college/login"
                  className="text-[#1E40AF] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
