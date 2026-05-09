import { Link } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1E40AF] rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-[#1E40AF]">InternConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-[#1E40AF] transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-[#1E40AF] transition-colors">
              About Us
            </Link>
            <Link to="/auth/role-selection" className="text-gray-700 hover:text-[#1E40AF] transition-colors">
              Find Internships
            </Link>
            <Link to="/help" className="text-gray-700 hover:text-[#1E40AF] transition-colors">
              Help
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth/role-selection">
              <Button variant="ghost" className="text-[#1E40AF]">
                Sign In
              </Button>
            </Link>
            <Link to="/auth/role-selection">
              <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-[#1E40AF] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-[#1E40AF] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/student/search"
                className="text-gray-700 hover:text-[#1E40AF] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Internships
              </Link>
              <Link
                to="/help"
                className="text-gray-700 hover:text-[#1E40AF] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Help
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Link to="/auth/role-selection" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/role-selection" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
