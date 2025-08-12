import React from 'react';
import { Cookie, Shield, Settings, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const CookiePolicyEn: React.FC = () => {
  // Set page title for SEO
  React.useEffect(() => {
    document.title = 'Cookie Policy - Caschi Gialli | Cookie Usage';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <Cookie className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600">
            How we use cookies and local storage technologies on Caschi Gialli
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 26, 2025
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 space-y-8">
            {/* Section 1: What are Cookies */}
            <section>
              <div className="flex items-center mb-4">
                <Cookie className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">1. What Are Cookies</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Cookies are small text files that are stored on your device when you visit 
                  a website. We use cookies to maintain your login session and improve 
                  the user experience on the platform.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Cookie className="h-4 w-4 mr-2" />
                    HttpOnly Cookies
                  </h4>
                  <p className="text-blue-700 text-sm">
                    We use secure HttpOnly cookies that are not accessible via JavaScript 
                    and are automatically sent to the server to maintain your session.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: How We Use Cookies */}
            <section>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">2. How We Use Cookies</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    <strong>Important:</strong> Caschi Gialli uses secure HttpOnly 
                    cookies for authentication and session cookies for platform functionality.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">Types of Cookies Used</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Authentication Cookies</h4>
                      <p className="text-sm text-gray-600">
                        Secure HttpOnly cookies that maintain your login session 
                        without being accessible via JavaScript.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Settings className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Session Cookies</h4>
                      <p className="text-sm text-gray-600">
                        Temporary cookies that expire when you close your browser, 
                        used for platform functionality.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Eye className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Language Preferences</h4>
                      <p className="text-sm text-gray-600">
                        Cookies that remember your language choice (Italian/English) 
                        to maintain your preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Purpose and Legal Basis */}
            <section>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">3. Purpose and Legal Basis</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Processing Purposes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Essential Functionality</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Maintaining login session</li>
                      <li>• Access to platform features</li>
                      <li>• User account security</li>
                      <li>• Preventing unauthorized access</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">User Experience</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Maintaining language preferences</li>
                      <li>• Proper platform functionality</li>
                      <li>• Smooth navigation between pages</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Legal Basis (GDPR)</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <ul className="text-purple-700 space-y-2">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Art. 6(1)(b):</span>
                      <span>Contract performance - necessary to provide requested services</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Art. 6(1)(f):</span>
                      <span>Legitimate interest - improving user experience and security</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4: Data Retention */}
            <section>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">4. Data Retention</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Authentication Cookies</h4>
                    <p className="text-blue-700 text-sm">
                      <strong>Duration:</strong> Until manual logout or automatic expiration
                    </p>
                    <p className="text-blue-700 text-sm mt-1">
                      <strong>Deletion:</strong> Automatic on logout or expiration
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Session Cookies</h4>
                    <p className="text-red-700 text-sm">
                      <strong>Duration:</strong> Until browser is closed
                    </p>
                    <p className="text-red-700 text-sm mt-1">
                      <strong>Deletion:</strong> Automatic when browser is closed
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Preferences</h4>
                    <p className="text-green-700 text-sm">
                      <strong>Duration:</strong> 1 year or until manual deletion
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      <strong>Deletion:</strong> Manual via browser
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Automatic Deletion</h4>
                  <p className="text-orange-700">
                    When you logout or delete your account, all authentication cookies 
                    are automatically invalidated and removed.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Your Control */}
            <section>
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">5. Your Control Over Data</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Platform Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Logout</h4>
                    <p className="text-green-700 text-sm mb-2">
                      Automatically invalidates all authentication cookies
                    </p>
                    <code className="text-xs bg-green-100 px-2 py-1 rounded">
                      "Logout" Button → Automatic deletion
                    </code>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Account Deletion</h4>
                    <p className="text-red-700 text-sm mb-2">
                      Invalidates all cookies and removes data from server
                    </p>
                    <code className="text-xs bg-red-100 px-2 py-1 rounded">
                      Profile → "Delete Account" → Total deletion
                    </code>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Browser Management</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Instructions for Popular Browsers:</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-gray-800">Chrome:</strong>
                      <p className="text-gray-600 ml-4">
                        Settings → Privacy and security → Cookies and other site data → 
                        View all cookies → Search "caschigialli.it" → Remove
                      </p>
                    </div>
                    
                    <div>
                      <strong className="text-gray-800">Firefox:</strong>
                      <p className="text-gray-600 ml-4">
                        Settings → Privacy & Security → Cookies and Site Data → 
                        Manage Data → Search "caschigialli.it" → Remove
                      </p>
                    </div>
                    
                    <div>
                      <strong className="text-gray-800">Safari:</strong>
                      <p className="text-gray-600 ml-4">
                        Preferences → Privacy → Manage Website Data → 
                        Search "caschigialli.it" → Remove
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Note:</strong> Deleting cookies will log you out and you'll need 
                    to sign in again to the platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Third Party */}
            <section>
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">6. Third Party Cookies</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    <strong>Good News:</strong> Caschi Gialli does not use third-party cookies 
                    for tracking, advertising or behavioral analysis.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">External Services Used</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">OpenStreetMap (Nominatim)</h4>
                      <p className="text-sm text-gray-600">
                        Used for address search. Does not store persistent cookies.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Leaflet Maps</h4>
                      <p className="text-sm text-gray-600">
                        Library for interactive maps. Works without tracking cookies.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Privacy by Design:</strong> We chose technologies that respect 
                    your privacy and don't require third-party cookies for tracking.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Updates */}
            <section>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Cookie Policy Updates</h3>
                <p className="text-orange-700 mb-4">
                  This Cookie Policy may be updated periodically to reflect 
                  changes in our practices or for regulatory compliance.
                </p>
                <div className="space-y-2 text-sm text-orange-700">
                  <p><strong>Notification:</strong> We will inform you of significant changes via email or platform notice</p>
                  <p><strong>Review:</strong> We encourage you to review this policy regularly</p>
                  <p><strong>Consent:</strong> Continuing to use the platform means you accept the changes</p>
                </div>
              </div>
            </section>

            {/* Section 8: Contact */}
            <section>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions about Cookie Policy?</h3>
                <p className="text-gray-700 mb-4">
                  For any questions about this Cookie Policy or to exercise your rights:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-900">📧 Email</p>
                    <a href="mailto:privacy@caschigialli.it" className="text-blue-600 hover:text-blue-700">
                      privacy@caschigialli.it
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">📞 Phone</p>
                    <a href="tel:+390123456789" className="text-blue-600 hover:text-blue-700">
                      +39 012 345 6789
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyEn;