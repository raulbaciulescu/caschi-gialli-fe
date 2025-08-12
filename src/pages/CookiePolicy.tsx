import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, Shield, Settings, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isItalian = i18n.language === 'it';

  // Set page title for SEO
  React.useEffect(() => {
    const title = isItalian 
      ? 'Cookie Policy - Caschi Gialli | Politica sui Cookie'
      : 'Cookie Policy - Caschi Gialli | Cookie Usage';
    document.title = title;
  }, [isItalian]);

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
            {isItalian 
              ? 'Come utilizziamo i cookie e le tecnologie di archiviazione su Caschi Gialli'
              : 'How we use cookies and storage technologies on Caschi Gialli'
            }
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {isItalian ? 'Ultimo aggiornamento: 26 Gennaio 2025' : 'Last updated: January 26, 2025'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 space-y-8">
            {/* Section 1: What are Cookies */}
            <section>
              <div className="flex items-center mb-4">
                <Cookie className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '1. Cosa Sono i Cookie' : '1. What Are Cookies'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  {isItalian 
                    ? 'I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. Utilizziamo i cookie per mantenere la tua sessione di login e migliorare l\'esperienza utente sulla piattaforma.'
                    : 'Cookies are small text files that are stored on your device when you visit a website. We use cookies to maintain your login session and improve the user experience on the platform.'
                  }
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Cookie className="h-4 w-4 mr-2" />
                    {isItalian ? 'Cookie HttpOnly' : 'HttpOnly Cookies'}
                  </h4>
                  <p className="text-blue-700 text-sm">
                    {isItalian 
                      ? 'Utilizziamo cookie sicuri HttpOnly che non sono accessibili tramite JavaScript e vengono inviati automaticamente al server per mantenere la tua sessione.'
                      : 'We use secure HttpOnly cookies that are not accessible via JavaScript and are automatically sent to the server to maintain your session.'
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: How We Use Cookies */}
            <section>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '2. Come Utilizziamo i Cookie' : '2. How We Use Cookies'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    <strong>{isItalian ? 'Importante:' : 'Important:'}</strong> {isItalian ? 'Caschi Gialli utilizza cookie sicuri HttpOnly per l\'autenticazione e cookie di sessione per il funzionamento della piattaforma.' : 'Caschi Gialli uses secure HttpOnly cookies for authentication and session cookies for platform functionality.'}
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Tipi di Cookie Utilizzati' : 'Types of Cookies Used'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {isItalian ? 'Cookie di Autenticazione' : 'Authentication Cookies'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {isItalian 
                          ? 'Cookie HttpOnly sicuri che mantengono la tua sessione di login attiva senza essere accessibili tramite JavaScript.'
                          : 'Secure HttpOnly cookies that maintain your login session without being accessible via JavaScript.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Settings className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {isItalian ? 'Cookie di Sessione' : 'Session Cookies'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {isItalian 
                          ? 'Cookie temporanei che scadono quando chiudi il browser, utilizzati per il funzionamento della piattaforma.'
                          : 'Temporary cookies that expire when you close your browser, used for platform functionality.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Eye className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {isItalian ? 'Preferenze Lingua' : 'Language Preferences'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {isItalian 
                          ? 'Cookie che ricordano la tua scelta di lingua (italiano/inglese) per mantenere le tue preferenze.'
                          : 'Cookies that remember your language choice (Italian/English) to maintain your preferences.'
                        }
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '3. Finalità e Base Giuridica' : '3. Purpose and Legal Basis'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Finalità del Trattamento' : 'Processing Purposes'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {isItalian ? 'Funzionalità Essenziali' : 'Essential Functionality'}
                    </h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• {isItalian ? 'Mantenimento della sessione di login' : 'Maintaining login session'}</li>
                      <li>• {isItalian ? 'Accesso alle funzionalità della piattaforma' : 'Access to platform features'}</li>
                      <li>• {isItalian ? 'Sicurezza dell\'account utente' : 'User account security'}</li>
                      <li>• {isItalian ? 'Prevenzione accessi non autorizzati' : 'Preventing unauthorized access'}</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {isItalian ? 'Esperienza Utente' : 'User Experience'}
                    </h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• {isItalian ? 'Mantenimento preferenze lingua' : 'Maintaining language preferences'}</li>
                      <li>• {isItalian ? 'Funzionamento corretto della piattaforma' : 'Proper platform functionality'}</li>
                      <li>• {isItalian ? 'Navigazione fluida tra le pagine' : 'Smooth navigation between pages'}</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">
                  {isItalian ? 'Base Giuridica (GDPR)' : 'Legal Basis (GDPR)'}
                </h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <ul className="text-purple-700 space-y-2">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Art. 6(1)(b):</span>
                      <span>{isItalian ? 'Esecuzione del contratto - necessario per fornire i servizi richiesti' : 'Contract performance - necessary to provide requested services'}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Art. 6(1)(f):</span>
                      <span>{isItalian ? 'Interesse legittimo - miglioramento dell\'esperienza utente e sicurezza' : 'Legitimate interest - improving user experience and security'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4: Data Retention */}
            <section>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '4. Durata di Conservazione' : '4. Data Retention'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {isItalian ? 'Cookie di Autenticazione' : 'Authentication Cookies'}
                    </h4>
                    <p className="text-blue-700 text-sm">
                      <strong>{isItalian ? 'Durata:' : 'Duration:'}</strong> {isItalian ? 'Fino al logout manuale o scadenza automatica' : 'Until manual logout or automatic expiration'}
                    </p>
                    <p className="text-blue-700 text-sm mt-1">
                      <strong>{isItalian ? 'Cancellazione:' : 'Deletion:'}</strong> {isItalian ? 'Automatica al logout o scadenza' : 'Automatic on logout or expiration'}
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">
                      {isItalian ? 'Cookie di Sessione' : 'Session Cookies'}
                    </h4>
                    <p className="text-red-700 text-sm">
                      <strong>{isItalian ? 'Durata:' : 'Duration:'}</strong> {isItalian ? 'Fino alla chiusura del browser' : 'Until browser is closed'}
                    </p>
                    <p className="text-red-700 text-sm mt-1">
                      <strong>{isItalian ? 'Cancellazione:' : 'Deletion:'}</strong> {isItalian ? 'Automatica alla chiusura del browser' : 'Automatic when browser is closed'}
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {isItalian ? 'Preferenze' : 'Preferences'}
                    </h4>
                    <p className="text-green-700 text-sm">
                      <strong>{isItalian ? 'Durata:' : 'Duration:'}</strong> {isItalian ? '1 anno o fino a cancellazione manuale' : '1 year or until manual deletion'}
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      <strong>{isItalian ? 'Cancellazione:' : 'Deletion:'}</strong> {isItalian ? 'Manuale tramite browser' : 'Manual via browser'}
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    {isItalian ? 'Cancellazione Automatica' : 'Automatic Deletion'}
                  </h4>
                  <p className="text-orange-700">
                    {isItalian 
                      ? 'Quando fai logout o cancelli il tuo account, tutti i cookie di autenticazione vengono automaticamente invalidati e rimossi.'
                      : 'When you logout or delete your account, all authentication cookies are automatically invalidated and removed.'
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Your Control */}
            <section>
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '5. Il Tuo Controllo sui Dati' : '5. Your Control Over Data'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Gestione Tramite Piattaforma' : 'Platform Management'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Logout</h4>
                    <p className="text-green-700 text-sm mb-2">
                      {isItalian 
                        ? 'Invalida automaticamente tutti i cookie di autenticazione'
                        : 'Automatically invalidates all authentication cookies'
                      }
                    </p>
                    <code className="text-xs bg-green-100 px-2 py-1 rounded">
                      {isItalian ? 'Pulsante "Logout" → Cancellazione automatica' : '"Logout" Button → Automatic deletion'}
                    </code>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">
                      {isItalian ? 'Cancellazione Account' : 'Account Deletion'}
                    </h4>
                    <p className="text-red-700 text-sm mb-2">
                      {isItalian 
                        ? 'Invalida tutti i cookie e rimuove i dati dal server'
                        : 'Invalidates all cookies and removes data from server'
                      }
                    </p>
                    <code className="text-xs bg-red-100 px-2 py-1 rounded">
                      {isItalian ? 'Profilo → "Elimina Account" → Cancellazione totale' : 'Profile → "Delete Account" → Total deletion'}
                    </code>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">
                  {isItalian ? 'Gestione Tramite Browser' : 'Browser Management'}
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    {isItalian ? 'Istruzioni per Browser Popolari:' : 'Instructions for Popular Browsers:'}
                  </h4>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-gray-800">Chrome:</strong>
                      <p className="text-gray-600 ml-4">
                        {isItalian 
                          ? 'Impostazioni → Privacy e sicurezza → Cookie e altri dati dei siti → Visualizza tutti i cookie → Cerca "caschigialli.it" → Rimuovi'
                          : 'Settings → Privacy and security → Cookies and other site data → View all cookies → Search "caschigialli.it" → Remove'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <strong className="text-gray-800">Firefox:</strong>
                      <p className="text-gray-600 ml-4">
                        {isItalian 
                          ? 'Impostazioni → Privacy e sicurezza → Cookie e dati dei siti web → Gestisci dati → Cerca "caschigialli.it" → Rimuovi'
                          : 'Settings → Privacy & Security → Cookies and Site Data → Manage Data → Search "caschigialli.it" → Remove'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <strong className="text-gray-800">Safari:</strong>
                      <p className="text-gray-600 ml-4">
                        {isItalian 
                          ? 'Preferenze → Privacy → Gestisci dati siti web → Cerca "caschigialli.it" → Rimuovi'
                          : 'Preferences → Privacy → Manage Website Data → Search "caschigialli.it" → Remove'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>{isItalian ? 'Nota:' : 'Note:'}</strong> {isItalian ? 'Cancellando i cookie perderai la sessione di login e dovrai accedere nuovamente alla piattaforma.' : 'Deleting cookies will log you out and you\'ll need to sign in again to the platform.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Third Party */}
            <section>
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '6. Cookie di Terze Parti' : '6. Third Party Cookies'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    <strong>{isItalian ? 'Buone Notizie:' : 'Good News:'}</strong> {isItalian ? 'Caschi Gialli non utilizza cookie di terze parti per tracking, pubblicità o analisi comportamentale.' : 'Caschi Gialli does not use third-party cookies for tracking, advertising or behavioral analysis.'}
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Servizi Esterni Utilizzati' : 'External Services Used'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">OpenStreetMap (Nominatim)</h4>
                      <p className="text-sm text-gray-600">
                        {isItalian 
                          ? 'Utilizzato per la ricerca di indirizzi. Non memorizza cookie persistenti.'
                          : 'Used for address search. Does not store persistent cookies.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Leaflet Maps</h4>
                      <p className="text-sm text-gray-600">
                        {isItalian 
                          ? 'Libreria per mappe interattive. Funziona senza cookie di tracking.'
                          : 'Library for interactive maps. Works without tracking cookies.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>{isItalian ? 'Privacy by Design:' : 'Privacy by Design:'}</strong> {isItalian ? 'Abbiamo scelto tecnologie che rispettano la tua privacy e non richiedono cookie di terze parti per il tracking.' : 'We chose technologies that respect your privacy and don\'t require third-party cookies for tracking.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Updates */}
            <section>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  {isItalian ? 'Aggiornamenti della Cookie Policy' : 'Cookie Policy Updates'}
                </h3>
                <p className="text-orange-700 mb-4">
                  {isItalian 
                    ? 'Questa Cookie Policy può essere aggiornata periodicamente per riflettere cambiamenti nelle nostre pratiche o per conformità normativa.'
                    : 'This Cookie Policy may be updated periodically to reflect changes in our practices or for regulatory compliance.'
                  }
                </p>
                <div className="space-y-2 text-sm text-orange-700">
                  <p><strong>{isItalian ? 'Notifica:' : 'Notification:'}</strong> {isItalian ? 'Ti informeremo di modifiche significative tramite email o avviso sulla piattaforma' : 'We will inform you of significant changes via email or platform notice'}</p>
                  <p><strong>{isItalian ? 'Controllo:' : 'Review:'}</strong> {isItalian ? 'Ti incoraggiamo a rivedere questa policy regolarmente' : 'We encourage you to review this policy regularly'}</p>
                  <p><strong>{isItalian ? 'Consenso:' : 'Consent:'}</strong> {isItalian ? 'Continuando a utilizzare la piattaforma accetti le modifiche' : 'Continuing to use the platform means you accept the changes'}</p>
                </div>
              </div>
            </section>

            {/* Section 8: Contact */}
            <section>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {isItalian ? 'Domande sulla Cookie Policy?' : 'Questions about Cookie Policy?'}
                </h3>
                <p className="text-gray-700 mb-4">
                  {isItalian 
                    ? 'Per qualsiasi domanda riguardo questa Cookie Policy o per esercitare i tuoi diritti:'
                    : 'For any questions about this Cookie Policy or to exercise your rights:'
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-900">📧 Email</p>
                    <a href="mailto:privacy@caschigialli.it" className="text-blue-600 hover:text-blue-700">
                      privacy@caschigialli.it
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">📞 {isItalian ? 'Telefono' : 'Phone'}</p>
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

export default CookiePolicy;