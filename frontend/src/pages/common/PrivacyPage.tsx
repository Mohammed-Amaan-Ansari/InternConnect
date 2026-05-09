import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPage() {
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#1E40AF] rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl text-gray-900">Privacy Policy</h1>
          </div>
        </div>
        <p className="text-gray-600 mb-8">Last updated: November 23, 2025</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At InternConnect, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our internship management platform.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our Platform, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our Platform.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-[#1E40AF]" />
              <h2 className="text-2xl text-gray-900">Information We Collect</h2>
            </div>
            
            <h3 className="text-lg text-gray-900 mb-3">Personal Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Name, email address, phone number</li>
              <li>Educational background and academic records</li>
              <li>Skills, certifications, and work experience</li>
              <li>Resume and portfolio materials</li>
              <li>Profile pictures and other uploaded content</li>
            </ul>

            <h3 className="text-lg text-gray-900 mb-3">Usage Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We automatically collect certain information about your device and how you interact with our Platform:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Log data (IP address, browser type, pages visited)</li>
              <li>Device information (device type, operating system)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Application activity and interactions</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-[#1E40AF]" />
              <h2 className="text-2xl text-gray-900">How We Use Your Information</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide, maintain, and improve our Platform</li>
              <li>Match students with relevant internship opportunities</li>
              <li>Facilitate communication between students and industry partners</li>
              <li>Send you updates, notifications, and marketing communications</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues and fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may share your information with:
            </p>
            
            <h3 className="text-lg text-gray-900 mb-3">Industry Partners</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you apply for an internship, we share your profile information with the relevant industry partner to facilitate the application process.
            </p>

            <h3 className="text-lg text-gray-900 mb-3">Educational Institutions</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We share information with your college administrators to help them monitor your progress and manage institutional relationships.
            </p>

            <h3 className="text-lg text-gray-900 mb-3">Service Providers</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We engage third-party service providers to perform functions on our behalf, such as hosting, data analysis, and customer service.
            </p>

            <h3 className="text-lg text-gray-900 mb-3">Legal Requirements</h3>
            <p className="text-gray-600 leading-relaxed">
              We may disclose your information if required by law or in response to valid requests by public authorities.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-[#1E40AF]" />
              <h2 className="text-2xl text-gray-900">Data Security</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">Your Rights and Choices</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Access:</strong> You can request access to your personal information</li>
              <li><strong>Correction:</strong> You can update or correct your information through your account settings</li>
              <li><strong>Deletion:</strong> You can request deletion of your account and associated data</li>
              <li><strong>Opt-out:</strong> You can opt out of marketing communications at any time</li>
              <li><strong>Data Portability:</strong> You can request a copy of your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to collect and track information about your use of our Platform. You can control cookies through your browser settings, but disabling cookies may limit your ability to use certain features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our Platform is not intended for users under the age of 16. We do not knowingly collect personal information from children under 16. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-4 p-6 bg-[#F8FAFC] rounded-lg border border-gray-200">
              <div className="space-y-2">
                <p className="text-gray-900"><strong>Email:</strong> privacy@internconnect.edu</p>
                <p className="text-gray-900"><strong>Phone:</strong> +91 1234567890</p>
                <p className="text-gray-900"><strong>Address:</strong> InternConnect Platform, Education District, India</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
