import React from 'react';
import { Shield, Eye, Lock, Users, FileText, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const PrivacyPolicyEn: React.FC = () => {
  // Set page title for SEO
  React.useEffect(() => {
    document.title = 'Privacy Policy - Caschi Gialli | Data Protection';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Your privacy is important to us. This policy explains how we collect, use and protect your data.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 26, 2025
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 space-y-8">
            {/* Section 1: Information We Collect */}
            <section>
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Registration data:</strong> Name, email, phone number</li>
                  <li><strong>Profile information:</strong> Profile photo, professional description, services offered</li>
                  <li><strong>Location data:</strong> Address, GPS coordinates for service search</li>
                  <li><strong>Contact information:</strong> Messages exchanged through the platform</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Technical Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Usage data:</strong> How you use the platform, pages visited</li>
                  <li><strong>Device information:</strong> Device type, browser, operating system</li>
                  <li><strong>Network data:</strong> IP address, internet service provider</li>
                </ul>
              </div>
            </section>

            {/* Section 2: How We Use Information */}
            <section>
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">2. How We Use Information</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Service Provision</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Connect clients with qualified professionals in their area</li>
                  <li>Facilitate communication between users through the messaging system</li>
                  <li>Display profiles and available services based on location</li>
                  <li>Manage service requests and assignments</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Service Improvement</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Analyze platform usage to improve user experience</li>
                  <li>Develop new features based on user feedback</li>
                  <li>Prevent fraud and ensure platform security</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Communications</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Send important notifications about your account</li>
                  <li>Provide customer support when requested</li>
                  <li>Inform about terms of service updates (only when necessary)</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Information Sharing */}
            <section>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">3. Information Sharing</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    <strong>Important:</strong> We never sell your personal data to third parties.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">Necessary Sharing</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>With other users:</strong> Name, profile photo, services offered, service area (only for Caschi Gialli)</li>
                  <li><strong>For communications:</strong> Messages exchanged through the platform</li>
                  <li><strong>Service providers:</strong> Hosting, analytics (with confidentiality agreements)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Legal Sharing</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>When required by law or competent authorities</li>
                  <li>To protect the rights, property or safety of Caschi Gialli</li>
                  <li>In case of merger, acquisition or sale of business assets</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Data Security */}
            <section>
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">4. Data Security</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  We implement appropriate technical and organizational security measures to protect 
                  your personal data against unauthorized access, alteration, disclosure or destruction.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Security Measures</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                  <li><strong>Authentication:</strong> Secure login system with encrypted passwords</li>
                  <li><strong>Limited access:</strong> Only authorized personnel can access data</li>
                  <li><strong>Monitoring:</strong> Continuous monitoring to detect suspicious activities</li>
                  <li><strong>Secure backups:</strong> Encrypted and protected backup copies</li>
                </ul>
              </div>
            </section>

            {/* Section 5: Your Rights */}
            <section>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">5. Your Rights</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  In accordance with GDPR and Italian privacy laws, you have the following rights:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Right of Access</h4>
                    <p className="text-blue-700 text-sm">
                      You can request a copy of all personal data we have about you.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Right of Rectification</h4>
                    <p className="text-green-700 text-sm">
                      You can correct or update your personal data at any time.
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Right of Erasure</h4>
                    <p className="text-red-700 text-sm">
                      You can request deletion of your personal data ("right to be forgotten").
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Right of Portability</h4>
                    <p className="text-purple-700 text-sm">
                      You can request your data in a structured and readable format.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: Cookies */}
            <section>
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">6. Cookies and Similar Technologies</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  We use cookies and similar technologies to improve your experience on the platform.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Types of Cookies</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Essential cookies:</strong> Necessary for platform functionality</li>
                  <li><strong>Authentication cookies:</strong> Keep your login session active</li>
                  <li><strong>Analytics cookies:</strong> Help us understand how you use the platform</li>
                </ul>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>Cookie Control:</strong> You can manage cookie preferences 
                    through your browser settings. Note that disabling some cookies 
                    may limit some platform functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Contact */}
            <section>
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">7. Contact Us</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  For any questions about this Privacy Policy or to exercise your rights, 
                  you can contact us:
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <a href="mailto:privacy@caschigialli.it" className="text-blue-600 hover:text-blue-700">
                          privacy@caschigialli.it
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <a href="tel:+390123456789" className="text-blue-600 hover:text-blue-700">
                          +39 012 345 6789
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start md:col-span-2">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">
                          Caschi Gialli S.r.l.<br />
                          Via Roma 123<br />
                          00100 Roma, Italy
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Response Time:</strong> We commit to responding to your requests 
                    within 30 days, as required by GDPR.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8: Updates */}
            <section>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Privacy Policy Updates</h3>
                <p className="text-yellow-700">
                  We may update this Privacy Policy periodically. We will notify you 
                  of significant changes via email or through a notice on the platform. 
                  We encourage you to review this policy regularly.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyEn;