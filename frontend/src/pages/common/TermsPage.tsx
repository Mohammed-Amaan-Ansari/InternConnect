import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl text-gray-900 mb-4">Terms and Conditions</h1>
        <p className="text-gray-600 mb-8">Last updated: November 23, 2025</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to InternConnect ("Platform", "we", "us", or "our"). These Terms and Conditions ("Terms") govern your access to and use of the InternConnect platform, including any content, functionality, and services offered on or through the Platform.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">2. User Accounts</h2>
            <h3 className="text-lg text-gray-900 mb-3">2.1 Registration</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              To access certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <h3 className="text-lg text-gray-900 mb-3">2.2 Account Security</h3>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">3. User Roles and Responsibilities</h2>
            <h3 className="text-lg text-gray-900 mb-3">3.1 Students</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Students agree to provide truthful information about their education, skills, and experience. Students are responsible for ensuring their applications are accurate and professional.
            </p>
            <h3 className="text-lg text-gray-900 mb-3">3.2 Industry Partners</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Industry partners agree to post legitimate internship opportunities and to treat all applicants fairly and in compliance with applicable employment laws.
            </p>
            <h3 className="text-lg text-gray-900 mb-3">3.3 College Administrators</h3>
            <p className="text-gray-600 leading-relaxed">
              College administrators are responsible for managing their institution's presence on the Platform and ensuring compliance with institutional policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">4. Acceptable Use</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Use the Platform for any unlawful purpose</li>
              <li>Post false, misleading, or fraudulent information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Upload viruses or malicious code</li>
              <li>Attempt to gain unauthorized access to the Platform</li>
              <li>Scrape or collect data from the Platform without permission</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Platform and its original content, features, and functionality are owned by InternConnect and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You retain ownership of any content you post to the Platform. By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content on the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">6. Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Your use of the Platform is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">7. Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Platform will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed">
              The Platform is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the Platform's operation or the information, content, or materials included on the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, InternConnect shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on the Platform. Your continued use of the Platform after such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-[#F8FAFC] rounded-lg">
              <p className="text-gray-900">Email: legal@internconnect.edu</p>
              <p className="text-gray-900">Phone: +91 1234567890</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
