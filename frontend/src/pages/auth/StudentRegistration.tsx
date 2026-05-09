import { Link, useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function StudentRegistration() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    course: '',
    year: '',
    rollNumber: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!formData.fullName.trim())
      newErrors.fullName = 'Full Name is required';

    if (!formData.email)
      newErrors.email = 'Email Address is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = 'Invalid email format';

    if (!formData.phone)
      newErrors.phone = 'Phone Number is required';
    else {
      const digits = formData.phone.replace(/\D/g, '');
      if (digits.length !== 10) newErrors.phone = 'Phone must be 10 digits';
    }

    if (!formData.course.trim())
      newErrors.course = 'Course/Program is required';

    if (!formData.year)
      newErrors.year = 'Year of Study is required';

    if (!formData.rollNumber.trim())
      newErrors.rollNumber = 'Roll Number is required';

    if (!formData.password)
      newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Minimum 8 characters required';

    if (!formData.confirmPassword)
      newErrors.confirmPassword = 'Confirm Password is required';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  setSubmitting(true);
  try {
    const sanitizedPhone = formData.phone.replace(/\D/g, '');
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: sanitizedPhone,
      course: formData.course,
      year: formData.year,
      rollNumber: formData.rollNumber,
      password: formData.password,
      acceptTerms: formData.acceptTerms,
    };
    console.log("Submitting registration payload", payload);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const response = await fetch("http://127.0.0.1:8000/auth/register/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    console.log("Registration response status", response.status);

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      // non-JSON response
    }
    console.log("Registration response body", data);

    if (response.ok) {
      alert("Student registered successfully");
      localStorage.setItem("user", JSON.stringify(data));
      navigate(data.redirectTo || "/auth/student/login");
    } else {
      const detail = data?.detail || data?.message || "Registration failed";
      alert(detail);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error. Please try again.");
  } finally {
    setSubmitting(false);
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
            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl text-gray-900 text-center mb-2">
              Student Registration
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Create your account to start your internship journey
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name & Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    placeholder="student@college.edu"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
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
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Course & Year */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Course/Program
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) =>
                      setFormData({ ...formData, course: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    placeholder="B.Tech Computer Science"
                  />
                  {errors.course && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.course}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Year of Study
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.year}
                    </p>
                  )}
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, rollNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  placeholder="Enter your roll number"
                />
                {errors.rollNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rollNumber}
                  </p>
                )}
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
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
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
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 text-[#1E40AF] rounded"
                  checked={formData.acceptTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptTerms: e.target.checked })
                  }
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    className="text-[#1E40AF] hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="text-[#1E40AF] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Account'}
              </Button>
            </form>

            {/* Already Registered */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/auth/student/login"
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
