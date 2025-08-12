import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Eye, Lock, Database, Mail, Phone, MapPin, Calendar, Users, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isItalian = i18n.language === 'it';

  // Set page title for SEO
  React.useEffect(() => {
    const title = isItalian 
      ? 'Privacy Policy - Caschi Gialli | Protezione dei Dati'
      : 'Privacy Policy - Caschi Gialli | Data Protection';
    document.title = title;
  }, [isItalian]);

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
            {isItalian 
              ? 'La tua privacy è importante per noi. Questa policy spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati.'
              : 'Your privacy is important to us. This policy explains how we collect, use and protect your data.'
            }
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {isItalian ? 'Ultimo aggiornamento: 26 Gennaio 2025' : 'Last updated: January 26, 2025'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 space-y-8">
            {/* Section 1: Information We Collect */}
            <section>
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '1. Informazioni che Raccogliamo' : '1. Information We Collect'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Informazioni Personali' : 'Personal Information'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>{isItalian ? 'Dati di registrazione:' : 'Registration data:'}</strong> {isItalian ? 'Nome, email, numero di telefono' : 'Name, email, phone number'}</li>
                  <li><strong>{isItalian ? 'Informazioni di profilo:' : 'Profile information:'}</strong> {isItalian ? 'Foto profilo, descrizione professionale, servizi offerti' : 'Profile photo, professional description, services offered'}</li>
                  <li><strong>{isItalian ? 'Dati di localizzazione:' : 'Location data:'}</strong> {isItalian ? 'Indirizzo, coordinate GPS per la ricerca di servizi' : 'Address, GPS coordinates for service search'}</li>
                  <li><strong>{isItalian ? 'Informazioni di contatto:' : 'Contact information:'}</strong> {isItalian ? 'Messaggi scambiati attraverso la piattaforma' : 'Messages exchanged through the platform'}</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">
                  {isItalian ? 'Informazioni Tecniche' : 'Technical Information'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>{isItalian ? 'Dati di utilizzo:' : 'Usage data:'}</strong> {isItalian ? 'Come utilizzi la piattaforma, pagine visitate' : 'How you use the platform, pages visited'}</li>
                  <li><strong>{isItalian ? 'Informazioni del dispositivo:' : 'Device information:'}</strong> {isItalian ? 'Tipo di dispositivo, browser, sistema operativo' : 'Device type, browser, operating system'}</li>
                  <li><strong>{isItalian ? 'Dati di rete:' : 'Network data:'}</strong> {isItalian ? 'Indirizzo IP, provider di servizi internet' : 'IP address, internet service provider'}</li>
                </ul>
              </div>
            </section>

            {/* Section 2: How We Use Information */}
            <section>
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '2. Come Utilizziamo le Informazioni' : '2. How We Use Information'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Fornitura del Servizio' : 'Service Provision'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Connettere clienti con professionisti qualificati nella loro area' : 'Connect clients with qualified professionals in their area'}</li>
                  <li>{isItalian ? 'Facilitare la comunicazione tra utenti attraverso il sistema di messaggistica' : 'Facilitate communication between users through the messaging system'}</li>
                  <li>{isItalian ? 'Mostrare profili e servizi disponibili in base alla localizzazione' : 'Display profiles and available services based on location'}</li>
                  <li>{isItalian ? 'Gestire richieste di servizio e assegnazioni' : 'Manage service requests and assignments'}</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">
                  {isItalian ? 'Miglioramento del Servizio' : 'Service Improvement'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Analizzare l\'utilizzo della piattaforma per migliorare l\'esperienza utente' : 'Analyze platform usage to improve user experience'}</li>
                  <li>{isItalian ? 'Sviluppare nuove funzionalità basate sui feedback degli utenti' : 'Develop new features based on user feedback'}</li>
                  <li>{isItalian ? 'Prevenire frodi e garantire la sicurezza della piattaforma' : 'Prevent fraud and ensure platform security'}</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">
                  {isItalian ? 'Comunicazioni' : 'Communications'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Inviare notifiche importanti riguardo al tuo account' : 'Send important notifications about your account'}</li>
                  <li>{isItalian ? 'Fornire supporto clienti quando richiesto' : 'Provide customer support when requested'}</li>
                  <li>{isItalian ? 'Informare su aggiornamenti dei termini di servizio (solo se necessario)' : 'Inform about terms of service updates (only when necessary)'}</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Information Sharing */}
            <section>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '3. Condivisione delle Informazioni' : '3. Information Sharing'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    <strong>{isItalian ? 'Importante:' : 'Important:'}</strong> {isItalian ? 'Non vendiamo mai i tuoi dati personali a terze parti.' : 'We never sell your personal data to third parties.'}
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Condivisione Necessaria' : 'Necessary Sharing'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>{isItalian ? 'Con altri utenti:' : 'With other users:'}</strong> {isItalian ? 'Nome, foto profilo, servizi offerti, area di servizio (solo per Caschi Gialli)' : 'Name, profile photo, services offered, service area (only for Caschi Gialli)'}</li>
                  <li><strong>{isItalian ? 'Per comunicazioni:' : 'For communications:'}</strong> {isItalian ? 'Messaggi scambiati attraverso la piattaforma' : 'Messages exchanged through the platform'}</li>
                  <li><strong>{isItalian ? 'Fornitori di servizi:' : 'Service providers:'}</strong> {isItalian ? 'Hosting, analisi (con accordi di riservatezza)' : 'Hosting, analytics (with confidentiality agreements)'}</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">
                  {isItalian ? 'Condivisione Legale' : 'Legal Sharing'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Quando richiesto dalla legge o da autorità competenti' : 'When required by law or competent authorities'}</li>
                  <li>{isItalian ? 'Per proteggere i diritti, la proprietà o la sicurezza di Caschi Gialli' : 'To protect the rights, property or safety of Caschi Gialli'}</li>
                  <li>{isItalian ? 'In caso di fusione, acquisizione o vendita di asset aziendali' : 'In case of merger, acquisition or sale of business assets'}</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Data Security */}
            <section>
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '4. Sicurezza dei Dati' : '4. Data Security'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  {isItalian 
                    ? 'Implementiamo misure di sicurezza tecniche e organizzative appropriate per proteggere i tuoi dati personali contro accesso non autorizzato, alterazione, divulgazione o distruzione.'
                    : 'We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure or destruction.'
                  }
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Misure di Sicurezza' : 'Security Measures'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>{isItalian ? 'Crittografia:' : 'Encryption:'}</strong> {isItalian ? 'Tutti i dati sono crittografati in transito e a riposo' : 'All data is encrypted in transit and at rest'}</li>
                  <li><strong>{isItalian ? 'Autenticazione sicura:' : 'Secure authentication:'}</strong> {isItalian ? 'Sistema di login con cookie HttpOnly sicuri e password crittografate' : 'Login system with secure HttpOnly cookies and encrypted passwords'}</li>
                  <li><strong>{isItalian ? 'Accesso limitato:' : 'Limited access:'}</strong> {isItalian ? 'Solo personale autorizzato può accedere ai dati' : 'Only authorized personnel can access data'}</li>
                  <li><strong>{isItalian ? 'Monitoraggio:' : 'Monitoring:'}</strong> {isItalian ? 'Controllo continuo per rilevare attività sospette' : 'Continuous monitoring to detect suspicious activities'}</li>
                  <li><strong>{isItalian ? 'Backup sicuri:' : 'Secure backups:'}</strong> {isItalian ? 'Copie di sicurezza crittografate e protette' : 'Encrypted and protected backup copies'}</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {isItalian ? 'Cookie HttpOnly' : 'HttpOnly Cookies'}
                  </h4>
                  <p className="text-blue-700 text-sm">
                    {isItalian 
                      ? 'Utilizziamo cookie HttpOnly sicuri per l\'autenticazione che non sono accessibili tramite JavaScript, garantendo maggiore sicurezza contro attacchi XSS.'
                      : 'We use secure HttpOnly cookies for authentication that are not accessible via JavaScript, providing better security against XSS attacks.'
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Your Rights */}
            <section>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '5. I Tuoi Diritti' : '5. Your Rights'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  {isItalian 
                    ? 'In conformità con il GDPR e le leggi italiane sulla privacy, hai i seguenti diritti:'
                    : 'In accordance with GDPR and Italian privacy laws, you have the following rights:'
                  }
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {isItalian ? 'Diritto di Accesso' : 'Right of Access'}
                    </h4>
                    <p className="text-blue-700 text-sm">
                      {isItalian 
                        ? 'Puoi richiedere una copia di tutti i dati personali che abbiamo su di te.'
                        : 'You can request a copy of all personal data we have about you.'
                      }
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {isItalian ? 'Diritto di Rettifica' : 'Right of Rectification'}
                    </h4>
                    <p className="text-green-700 text-sm">
                      {isItalian 
                        ? 'Puoi correggere o aggiornare i tuoi dati personali in qualsiasi momento.'
                        : 'You can correct or update your personal data at any time.'
                      }
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">
                      {isItalian ? 'Diritto di Cancellazione' : 'Right of Erasure'}
                    </h4>
                    <p className="text-red-700 text-sm">
                      {isItalian 
                        ? 'Puoi richiedere la cancellazione dei tuoi dati personali ("diritto all\'oblio").'
                        : 'You can request deletion of your personal data ("right to be forgotten").'
                      }
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      {isItalian ? 'Diritto di Portabilità' : 'Right of Portability'}
                    </h4>
                    <p className="text-purple-700 text-sm">
                      {isItalian 
                        ? 'Puoi richiedere i tuoi dati in un formato strutturato e leggibile.'
                        : 'You can request your data in a structured and readable format.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: Cookies */}
            <section>
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '6. Cookie e Tecnologie Simili' : '6. Cookies and Similar Technologies'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  {isItalian 
                    ? 'Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza sulla piattaforma.'
                    : 'We use cookies and similar technologies to improve your experience on the platform.'
                  }
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Tipi di Cookie' : 'Types of Cookies'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>{isItalian ? 'Cookie essenziali:' : 'Essential cookies:'}</strong> {isItalian ? 'Necessari per il funzionamento della piattaforma' : 'Necessary for platform functionality'}</li>
                  <li><strong>{isItalian ? 'Cookie di autenticazione:' : 'Authentication cookies:'}</strong> {isItalian ? 'Cookie HttpOnly sicuri che mantengono la tua sessione di login attiva' : 'Secure HttpOnly cookies that keep your login session active'}</li>
                  <li><strong>{isItalian ? 'Cookie di preferenze:' : 'Preference cookies:'}</strong> {isItalian ? 'Ricordano le tue preferenze di lingua e altre impostazioni' : 'Remember your language preferences and other settings'}</li>
                </ul>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>{isItalian ? 'Controllo dei Cookie:' : 'Cookie Control:'}</strong> {isItalian ? 'Puoi gestire le preferenze dei cookie attraverso le impostazioni del tuo browser. Nota che disabilitare alcuni cookie potrebbe limitare alcune funzionalità della piattaforma.' : 'You can manage cookie preferences through your browser settings. Note that disabling some cookies may limit some platform functionality.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Contact */}
            <section>
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '7. Contattaci' : '7. Contact Us'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  {isItalian 
                    ? 'Per qualsiasi domanda riguardo questa Privacy Policy o per esercitare i tuoi diritti, puoi contattarci:'
                    : 'For any questions about this Privacy Policy or to exercise your rights, you can contact us:'
                  }
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
                        <p className="font-medium text-gray-900">{isItalian ? 'Telefono' : 'Phone'}</p>
                        <a href="tel:+390123456789" className="text-blue-600 hover:text-blue-700">
                          +39 012 345 6789
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start md:col-span-2">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{isItalian ? 'Indirizzo' : 'Address'}</p>
                        <p className="text-gray-600">
                          Caschi Gialli S.r.l.<br />
                          Via Roma 123<br />
                          00100 Roma, {isItalian ? 'Italia' : 'Italy'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>{isItalian ? 'Tempo di Risposta:' : 'Response Time:'}</strong> {isItalian ? 'Ci impegniamo a rispondere alle tue richieste entro 30 giorni, come previsto dal GDPR.' : 'We commit to responding to your requests within 30 days, as required by GDPR.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8: Updates */}
            <section>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  {isItalian ? 'Aggiornamenti della Privacy Policy' : 'Privacy Policy Updates'}
                </h3>
                <p className="text-yellow-700">
                  {isItalian 
                    ? 'Potremmo aggiornare questa Privacy Policy periodicamente. Ti notificheremo eventuali modifiche significative tramite email o attraverso un avviso sulla piattaforma. Ti incoraggiamo a rivedere questa policy regolarmente.'
                    : 'We may update this Privacy Policy periodically. We will notify you of significant changes via email or through a notice on the platform. We encourage you to review this policy regularly.'
                  }
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;