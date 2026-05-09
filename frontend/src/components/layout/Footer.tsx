import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#1E40AF] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-white">InternConnect</span>
            </Link>
            <p className="text-sm">
              Empowering students with industry-ready skills through meaningful internships aligned with NEP 2020.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-[#10B981] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/auth/student/register" className="hover:text-[#10B981] transition-colors">
                   For Students
                </Link>
              </li>
              <li>
                <Link to="/auth/industry/register" className="hover:text-[#10B981] transition-colors">
                  For Companies
                </Link>
              </li>
              <li>
                <Link to="/auth/college/register" className="hover:text-[#10B981] transition-colors">
                  For Institutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-[#10B981] transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#10B981] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#10B981] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-[#10B981] transition-colors">
                  NEP 2020 Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@internconnect.edu.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} InternConnect. All rights reserved. | Aligned with NEP 2020</p>
        </div>
      </div>
    </footer>
  );
}
