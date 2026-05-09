import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Footer } from '../../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Book,
  Video,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { toast } from 'sonner';

export default function HelpSupport() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent. We'll get back to you soon!");
  };

  const faqs = [
    {
      question: 'How do I apply for an internship?',
      answer:
        'To apply, sign up as a student, complete your profile, browse internships, and click "Apply Now" on any listing.',
    },
    {
      question: 'Do I need an account to apply?',
      answer:
        'Yes, you must create a student account to apply for internships.',
    },
    {
      question: 'How do companies post internships?',
      answer:
        'Companies can sign up and use their dashboard to post internship opportunities.',
    },
    {
      question: 'What if I forgot my password?',
      answer:
        'Click "Forgot Password" on the login page and follow the reset instructions.',
    },
  ];

  const resources = [
    {
      icon: Book,
      title: 'User Guide',
      description: 'Complete guide to using InternConnect',
      color: 'bg-blue-500',
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step walkthrough videos',
      color: 'bg-purple-500',
    },
    {
      icon: MessageCircle,
      title: 'Community Forum',
      description: 'Connect with students and companies',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
          <PublicNavbar />
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Quick Resources */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Card
                key={index}
                className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600">
                    {resource.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQs */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#1E40AF]" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="border-none shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#1E40AF]" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input required />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" required />
                    </div>
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input required />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea rows={5} required />
                  </div>
                  <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div>
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-[#1E40AF]" />
                  <span>support@internconnect.edu</span>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span>+91 1234567890</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}
