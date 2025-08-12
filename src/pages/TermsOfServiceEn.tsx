import React from 'react';
import { FileText, Users, Shield, AlertTriangle, Scale, Gavel, CheckCircle, XCircle } from 'lucide-react';

const TermsOfServiceEn: React.FC = () => {
  // Set page title for SEO
  React.useEffect(() => {
    document.title = 'Terms of Service - Caschi Gialli | Service Terms';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            Terms and conditions for using the Caschi Gialli platform
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 26, 2025
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 space-y-8">
            {/* Section 1: Acceptance */}
            <section>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Welcome to Caschi Gialli! By using our platform, you agree to be bound 
                  by these Terms of Service ("Terms"). If you do not accept these terms, 
                  do not use our services.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">
                    <strong>Important:</strong> These terms constitute a legal agreement between you and 
                    Caschi Gialli S.r.l. We encourage you to read them carefully.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">Who Can Use Caschi Gialli</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must be at least 18 years old</li>
                  <li>You must provide accurate and truthful information</li>
                  <li>You must have the legal capacity to enter into contracts</li>
                  <li>You must not have been previously suspended from the platform</li>
                </ul>
              </div>
            </section>

            {/* Section 2: Platform Description */}
            <section>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">2. Service Description</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Caschi Gialli is a digital platform that connects clients with qualified 
                  professionals ("Caschi Gialli") for home services in Italy.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Services Offered</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">For Clients</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Search for qualified professionals</li>
                      <li>• Integrated messaging system</li>
                      <li>• Service request management</li>
                      <li>• Geographic location</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">For Caschi Gialli</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Personalized professional profile</li>
                      <li>• Receive job requests</li>
                      <li>• Service area management</li>
                      <li>• Photo portfolio</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>Important Note:</strong> Caschi Gialli facilitates contact between clients and 
                    professionals but is not part of the service contract established between them. 
                    We are not responsible for the quality, timeliness or other aspects of services provided.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: User Responsibilities */}
            <section>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">3. User Responsibilities</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">General Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and updated information</li>
                  <li>Maintain the security of your account</li>
                  <li>Comply with applicable Italian and European laws</li>
                  <li>Do not use the platform for illegal or unauthorized purposes</li>
                  <li>Respect other users and communicate professionally</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Specific Responsibilities for Clients</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate descriptions of service requests</li>
                  <li>Clearly communicate your needs and expectations</li>
                  <li>Respect agreements made with Caschi Gialli</li>
                  <li>Pay for services according to established agreements</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Specific Responsibilities for Caschi Gialli</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Possess necessary qualifications and licenses for services offered</li>
                  <li>Provide professional quality services</li>
                  <li>Respect agreements made with clients</li>
                  <li>Keep profile information updated</li>
                  <li>Respond promptly to requests</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Prohibited Activities */}
            <section>
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">4. Prohibited Activities</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium mb-2">
                    The following activities are strictly prohibited on the platform:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Prohibited Content</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                      <li>Illegal, offensive or defamatory content</li>
                      <li>Spam or unsolicited communications</li>
                      <li>False or misleading information</li>
                      <li>Content that violates intellectual property rights</li>
                      <li>Pornographic or inappropriate material</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Prohibited Behaviors</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                      <li>Impersonating other people or entities</li>
                      <li>Attempting to bypass security measures</li>
                      <li>Using bots or automated systems</li>
                      <li>Collecting other users' data without consent</li>
                      <li>Interfering with platform operation</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800">
                    <strong>Consequences:</strong> Violation of these terms may result in 
                    account suspension or permanent closure, as well as possible legal action.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Payments and Fees */}
            <section>
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">5. Payments and Fees</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Free Platform Usage</h3>
                <p>
                  Currently, using Caschi Gialli is free for both clients and 
                  professionals. We do not apply transaction fees.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Payments Between Users</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Payments for services occur directly between client and Casco Giallo</li>
                  <li>Caschi Gialli does not handle payments nor act as intermediary</li>
                  <li>Users are responsible for agreeing on payment methods and terms</li>
                  <li>We recommend using traceable payment methods</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">Possible Future Fees</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    We reserve the right to introduce fees in the future. In such case, 
                    users will be informed with at least 30 days notice.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Intellectual Property */}
            <section>
              <div className="flex items-center mb-4">
                <Gavel className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">6. Intellectual Property</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Caschi Gialli Property</h3>
                <p>
                  The Caschi Gialli platform, including design, logo, code, content and functionality, 
                  is owned by Caschi Gialli S.r.l. and protected by copyright laws and other 
                  intellectual property rights.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">User Content</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You retain ownership of content you upload (photos, descriptions, etc.)</li>
                  <li>You grant Caschi Gialli a license to use your content on the platform</li>
                  <li>You guarantee you have rights to the content you upload</li>
                  <li>Do not upload content that violates third party rights</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">Usage License</h3>
                <p>
                  We grant you a limited, non-exclusive and revocable license to use 
                  the platform according to these terms. You may not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Copy, modify or distribute the platform</li>
                  <li>Reverse engineer the code</li>
                  <li>Use our trademarks without authorization</li>
                  <li>Create derivative works based on the platform</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Limitation of Liability */}
            <section>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">7. Limitation of Liability</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 font-medium">
                    <strong>Important:</strong> Caschi Gialli is an intermediation platform. 
                    We are not responsible for services provided by professionals.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">Liability Exclusions</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Quality, safety or legality of services offered by Caschi Gialli</li>
                  <li>Accuracy of information provided by users</li>
                  <li>Damages arising from platform use</li>
                  <li>Service interruptions or technical problems</li>
                  <li>Loss of data or information</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">Limitations</h3>
                <p>
                  To the maximum extent permitted by law, our total liability 
                  to any user will never exceed €100 for any claim.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Indemnification</h3>
                <p>
                  You agree to indemnify and hold harmless Caschi Gialli from any claim, 
                  damage or expense arising from your use of the platform or violation 
                  of these terms.
                </p>
              </div>
            </section>

            {/* Section 8: Termination */}
            <section>
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">8. Contract Termination</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">User Termination</h3>
                <p>
                  You can close your account at any time through profile settings 
                  or by contacting us directly.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Caschi Gialli Termination</h3>
                <p>
                  We may suspend or close your account if you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violate these Terms of Service</li>
                  <li>Provide false or misleading information</li>
                  <li>Use the platform for illegal activities</li>
                  <li>Damage the reputation or operation of the platform</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">Effects of Termination</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Loss of access to the platform</li>
                  <li>Deletion of profile data</li>
                  <li>Interruption of ongoing communications</li>
                  <li>Data retention for legal obligations (if applicable)</li>
                </ul>
              </div>
            </section>

            {/* Section 9: Governing Law */}
            <section>
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">9. Governing Law and Jurisdiction</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  These Terms of Service are governed by Italian law. Any dispute 
                  will be subject to the exclusive jurisdiction of the courts of Rome, Italy.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Dispute Resolution</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li><strong>Direct negotiation:</strong> We encourage amicable resolution</li>
                  <li><strong>Mediation:</strong> Possibility of mediation before litigation</li>
                  <li><strong>Competent court:</strong> Rome courts for unresolved disputes</li>
                </ol>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Consumer Rights:</strong> If you are a consumer, you retain all 
                    rights provided by the Italian Consumer Code and applicable European regulations.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10: Changes and Contact */}
            <section>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Changes to Terms</h3>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these terms at any time. 
                  Significant changes will be communicated with at least 30 days notice 
                  via email or platform notice.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
                <p className="text-gray-700">
                  For questions about the Terms of Service, contact us at:
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">📧 <a href="mailto:legal@caschigialli.it" className="text-blue-600 hover:text-blue-700">legal@caschigialli.it</a></p>
                  <p className="text-gray-600">📞 <a href="tel:+390123456789" className="text-blue-600 hover:text-blue-700">+39 012 345 6789</a></p>
                  <p className="text-gray-600">📍 Via Roma 123, 00100 Roma, Italy</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceEn;