import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Users, Shield, AlertTriangle, Scale, Gavel, CheckCircle, XCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isItalian = i18n.language === 'it';

  // Set page title for SEO
  React.useEffect(() => {
    const title = isItalian 
      ? 'Terms of Service - Caschi Gialli | Termini di Servizio'
      : 'Terms of Service - Caschi Gialli | Service Terms';
    document.title = title;
  }, [isItalian]);

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
            {isItalian 
              ? 'Termini e condizioni per l\'utilizzo della piattaforma Caschi Gialli'
              : 'Terms and conditions for using the Caschi Gialli platform'
            }
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {isItalian ? 'Ultimo aggiornamento: 26 Gennaio 2025' : 'Last updated: January 26, 2025'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 space-y-8">
            {/* Section 1: Acceptance */}
            <section>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '1. Accettazione dei Termini' : '1. Acceptance of Terms'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  {isItalian 
                    ? 'Benvenuto su Caschi Gialli! Utilizzando la nostra piattaforma, accetti di essere vincolato da questi Termini di Servizio ("Termini"). Se non accetti questi termini, non utilizzare i nostri servizi.'
                    : 'Welcome to Caschi Gialli! By using our platform, you agree to be bound by these Terms of Service ("Terms"). If you do not accept these terms, do not use our services.'
                  }
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">
                    <strong>{isItalian ? 'Importante:' : 'Important:'}</strong> {isItalian ? 'Questi termini costituiscono un accordo legale tra te e Caschi Gialli S.r.l. Ti incoraggiamo a leggerli attentamente.' : 'These terms constitute a legal agreement between you and Caschi Gialli S.r.l. We encourage you to read them carefully.'}
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Chi Può Utilizzare Caschi Gialli' : 'Who Can Use Caschi Gialli'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Devi avere almeno 18 anni' : 'You must be at least 18 years old'}</li>
                  <li>{isItalian ? 'Devi fornire informazioni accurate e veritiere' : 'You must provide accurate and truthful information'}</li>
                  <li>{isItalian ? 'Devi avere la capacità legale di stipulare contratti' : 'You must have the legal capacity to enter into contracts'}</li>
                  <li>{isItalian ? 'Non devi essere stato precedentemente sospeso dalla piattaforma' : 'You must not have been previously suspended from the platform'}</li>
                </ul>
              </div>
            </section>

            {/* Section 2: Platform Description */}
            <section>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '2. Descrizione del Servizio' : '2. Service Description'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  {isItalian 
                    ? 'Caschi Gialli è una piattaforma digitale che connette clienti con professionisti qualificati ("Caschi Gialli") per servizi a domicilio in Italia.'
                    : 'Caschi Gialli is a digital platform that connects clients with qualified professionals ("Caschi Gialli") for home services in Italy.'
                  }
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Servizi Offerti' : 'Services Offered'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {isItalian ? 'Per i Clienti' : 'For Clients'}
                    </h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• {isItalian ? 'Ricerca professionisti qualificati' : 'Search for qualified professionals'}</li>
                      <li>• {isItalian ? 'Sistema di messaggistica integrato' : 'Integrated messaging system'}</li>
                      <li>• {isItalian ? 'Gestione richieste di servizio' : 'Service request management'}</li>
                      <li>• {isItalian ? 'Localizzazione geografica' : 'Geographic location'}</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      {isItalian ? 'Per i Caschi Gialli' : 'For Caschi Gialli'}
                    </h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• {isItalian ? 'Profilo professionale personalizzato' : 'Personalized professional profile'}</li>
                      <li>• {isItalian ? 'Ricezione richieste di lavoro' : 'Receive job requests'}</li>
                      <li>• {isItalian ? 'Gestione area di servizio' : 'Service area management'}</li>
                      <li>• {isItalian ? 'Portfolio fotografico' : 'Photo portfolio'}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>{isItalian ? 'Nota Importante:' : 'Important Note:'}</strong> {isItalian ? 'Caschi Gialli facilita il contatto tra clienti e professionisti ma non è parte del contratto di servizio che si stabilisce tra loro. Non siamo responsabili per la qualità, tempestività o altri aspetti dei servizi forniti.' : 'Caschi Gialli facilitates contact between clients and professionals but is not part of the service contract established between them. We are not responsible for the quality, timeliness or other aspects of services provided.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: User Responsibilities */}
            <section>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '3. Responsabilità degli Utenti' : '3. User Responsibilities'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Responsabilità Generali' : 'General Responsibilities'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Fornire informazioni accurate e aggiornate' : 'Provide accurate and updated information'}</li>
                  <li>{isItalian ? 'Mantenere la sicurezza del proprio account' : 'Maintain the security of your account'}</li>
                  <li>{isItalian ? 'Rispettare le leggi italiane ed europee applicabili' : 'Comply with applicable Italian and European laws'}</li>
                  <li>{isItalian ? 'Non utilizzare la piattaforma per scopi illegali o non autorizzati' : 'Do not use the platform for illegal or unauthorized purposes'}</li>
                  <li>{isItalian ? 'Rispettare gli altri utenti e comunicare in modo professionale' : 'Respect other users and communicate professionally'}</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">
                  {isItalian ? 'Responsabilità Specifiche per i Clienti' : 'Specific Responsibilities for Clients'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Fornire descrizioni accurate delle richieste di servizio' : 'Provide accurate descriptions of service requests'}</li>
                  <li>{isItalian ? 'Comunicare chiaramente i propri bisogni e aspettative' : 'Clearly communicate your needs and expectations'}</li>
                  <li>{isItalian ? 'Rispettare gli accordi presi con i Caschi Gialli' : 'Respect agreements made with Caschi Gialli'}</li>
                  <li>{isItalian ? 'Pagare i servizi secondo gli accordi stabiliti' : 'Pay for services according to established agreements'}</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">
                  {isItalian ? 'Responsabilità Specifiche per i Caschi Gialli' : 'Specific Responsibilities for Caschi Gialli'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Possedere le qualifiche e licenze necessarie per i servizi offerti' : 'Possess necessary qualifications and licenses for services offered'}</li>
                  <li>{isItalian ? 'Fornire servizi di qualità professionale' : 'Provide professional quality services'}</li>
                  <li>{isItalian ? 'Rispettare gli accordi presi con i clienti' : 'Respect agreements made with clients'}</li>
                  <li>{isItalian ? 'Mantenere aggiornate le informazioni del profilo' : 'Keep profile information updated'}</li>
                  <li>{isItalian ? 'Rispondere tempestivamente alle richieste' : 'Respond promptly to requests'}</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Prohibited Activities */}
            <section>
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '4. Attività Vietate' : '4. Prohibited Activities'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium mb-2">
                    {isItalian 
                      ? 'Le seguenti attività sono strettamente vietate sulla piattaforma:'
                      : 'The following activities are strictly prohibited on the platform:'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {isItalian ? 'Contenuti Vietati' : 'Prohibited Content'}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                      <li>{isItalian ? 'Contenuti illegali, offensivi o diffamatori' : 'Illegal, offensive or defamatory content'}</li>
                      <li>{isItalian ? 'Spam o comunicazioni non richieste' : 'Spam or unsolicited communications'}</li>
                      <li>{isItalian ? 'Informazioni false o fuorvianti' : 'False or misleading information'}</li>
                      <li>{isItalian ? 'Contenuti che violano i diritti di proprietà intellettuale' : 'Content that violates intellectual property rights'}</li>
                      <li>{isItalian ? 'Materiale pornografico o inappropriato' : 'Pornographic or inappropriate material'}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {isItalian ? 'Comportamenti Vietati' : 'Prohibited Behaviors'}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                      <li>{isItalian ? 'Impersonare altre persone o entità' : 'Impersonating other people or entities'}</li>
                      <li>{isItalian ? 'Tentare di aggirare le misure di sicurezza' : 'Attempting to bypass security measures'}</li>
                      <li>{isItalian ? 'Utilizzare bot o sistemi automatizzati' : 'Using bots or automated systems'}</li>
                      <li>{isItalian ? 'Raccogliere dati di altri utenti senza consenso' : 'Collecting other users\' data without consent'}</li>
                      <li>{isItalian ? 'Interferire con il funzionamento della piattaforma' : 'Interfering with platform operation'}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800">
                    <strong>{isItalian ? 'Conseguenze:' : 'Consequences:'}</strong> {isItalian ? 'La violazione di questi termini può comportare la sospensione o la chiusura permanente dell\'account, oltre a possibili azioni legali.' : 'Violation of these terms may result in account suspension or permanent closure, as well as possible legal action.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Payments and Fees */}
            <section>
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '5. Pagamenti e Commissioni' : '5. Payments and Fees'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Utilizzo Gratuito della Piattaforma' : 'Free Platform Usage'}
                </h3>
                <p>
                  {isItalian 
                    ? 'Attualmente, l\'utilizzo di Caschi Gialli è gratuito sia per i clienti che per i professionisti. Non applichiamo commissioni sulle transazioni.'
                    : 'Currently, using Caschi Gialli is free for both clients and professionals. We do not apply transaction fees.'
                  }
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Pagamenti tra Utenti' : 'Payments Between Users'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'I pagamenti per i servizi avvengono direttamente tra cliente e Casco Giallo' : 'Payments for services occur directly between client and Casco Giallo'}</li>
                  <li>{isItalian ? 'Caschi Gialli non gestisce i pagamenti né funge da intermediario' : 'Caschi Gialli does not handle payments nor act as intermediary'}</li>
                  <li>{isItalian ? 'Gli utenti sono responsabili di concordare metodi e termini di pagamento' : 'Users are responsible for agreeing on payment methods and terms'}</li>
                  <li>{isItalian ? 'Raccomandiamo di utilizzare metodi di pagamento tracciabili' : 'We recommend using traceable payment methods'}</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Possibili Commissioni Future' : 'Possible Future Fees'}
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    {isItalian 
                      ? 'Ci riserviamo il diritto di introdurre commissioni in futuro. In tal caso, gli utenti saranno informati con almeno 30 giorni di preavviso.'
                      : 'We reserve the right to introduce fees in the future. In such case, users will be informed with at least 30 days notice.'
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Intellectual Property */}
            <section>
              <div className="flex items-center mb-4">
                <Gavel className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '6. Proprietà Intellettuale' : '6. Intellectual Property'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Proprietà di Caschi Gialli' : 'Caschi Gialli Property'}
                </h3>
                <p>
                  {isItalian 
                    ? 'La piattaforma Caschi Gialli, inclusi design, logo, codice, contenuti e funzionalità, è di proprietà di Caschi Gialli S.r.l. e protetta dalle leggi sul copyright e altri diritti di proprietà intellettuale.'
                    : 'The Caschi Gialli platform, including design, logo, code, content and functionality, is owned by Caschi Gialli S.r.l. and protected by copyright laws and other intellectual property rights.'
                  }
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Contenuti degli Utenti' : 'User Content'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Mantieni la proprietà dei contenuti che carichi (foto, descrizioni, ecc.)' : 'You retain ownership of content you upload (photos, descriptions, etc.)'}</li>
                  <li>{isItalian ? 'Concedi a Caschi Gialli una licenza per utilizzare i tuoi contenuti sulla piattaforma' : 'You grant Caschi Gialli a license to use your content on the platform'}</li>
                  <li>{isItalian ? 'Garantisci di avere i diritti sui contenuti che carichi' : 'You guarantee you have rights to the content you upload'}</li>
                  <li>{isItalian ? 'Non caricare contenuti che violano i diritti di terzi' : 'Do not upload content that violates third party rights'}</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Licenza d\'Uso' : 'Usage License'}
                </h3>
                <p>
                  {isItalian 
                    ? 'Ti concediamo una licenza limitata, non esclusiva e revocabile per utilizzare la piattaforma secondo questi termini. Non puoi:'
                    : 'We grant you a limited, non-exclusive and revocable license to use the platform according to these terms. You may not:'
                  }
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Copiare, modificare o distribuire la piattaforma' : 'Copy, modify or distribute the platform'}</li>
                  <li>{isItalian ? 'Fare reverse engineering del codice' : 'Reverse engineer the code'}</li>
                  <li>{isItalian ? 'Utilizzare i nostri marchi senza autorizzazione' : 'Use our trademarks without authorization'}</li>
                  <li>{isItalian ? 'Creare opere derivate basate sulla piattaforma' : 'Create derivative works based on the platform'}</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Limitation of Liability */}
            <section>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '7. Limitazione di Responsabilità' : '7. Limitation of Liability'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 font-medium">
                    <strong>{isItalian ? 'Importante:' : 'Important:'}</strong> {isItalian ? 'Caschi Gialli è una piattaforma di intermediazione. Non siamo responsabili per i servizi forniti dai professionisti.' : 'Caschi Gialli is an intermediation platform. We are not responsible for services provided by professionals.'}
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Esclusioni di Responsabilità' : 'Liability Exclusions'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Qualità, sicurezza o legalità dei servizi offerti dai Caschi Gialli' : 'Quality, safety or legality of services offered by Caschi Gialli'}</li>
                  <li>{isItalian ? 'Accuratezza delle informazioni fornite dagli utenti' : 'Accuracy of information provided by users'}</li>
                  <li>{isItalian ? 'Danni derivanti dall\'utilizzo della piattaforma' : 'Damages arising from platform use'}</li>
                  <li>{isItalian ? 'Interruzioni del servizio o problemi tecnici' : 'Service interruptions or technical problems'}</li>
                  <li>{isItalian ? 'Perdita di dati o informazioni' : 'Loss of data or information'}</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Limitazioni' : 'Limitations'}
                </h3>
                <p>
                  {isItalian 
                    ? 'Nella misura massima consentita dalla legge, la nostra responsabilità totale verso qualsiasi utente non supererà mai l\'importo di €100 per qualsiasi reclamo.'
                    : 'To the maximum extent permitted by law, our total liability to any user will never exceed €100 for any claim.'
                  }
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Indennizzo' : 'Indemnification'}
                </h3>
                <p>
                  {isItalian 
                    ? 'Accetti di indennizzare e tenere indenne Caschi Gialli da qualsiasi reclamo, danno o spesa derivante dal tuo utilizzo della piattaforma o dalla violazione di questi termini.'
                    : 'You agree to indemnify and hold harmless Caschi Gialli from any claim, damage or expense arising from your use of the platform or violation of these terms.'
                  }
                </p>
              </div>
            </section>

            {/* Section 8: Termination */}
            <section>
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '8. Risoluzione del Contratto' : '8. Contract Termination'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Risoluzione da Parte dell\'Utente' : 'User Termination'}
                </h3>
                <p>
                  {isItalian 
                    ? 'Puoi chiudere il tuo account in qualsiasi momento attraverso le impostazioni del profilo o contattandoci direttamente.'
                    : 'You can close your account at any time through profile settings or by contacting us directly.'
                  }
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Risoluzione da Parte di Caschi Gialli' : 'Caschi Gialli Termination'}
                </h3>
                <p>
                  {isItalian ? 'Possiamo sospendere o chiudere il tuo account se:' : 'We may suspend or close your account if you:'}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Violi questi Termini di Servizio' : 'Violate these Terms of Service'}</li>
                  <li>{isItalian ? 'Fornisci informazioni false o fuorvianti' : 'Provide false or misleading information'}</li>
                  <li>{isItalian ? 'Utilizzi la piattaforma per attività illegali' : 'Use the platform for illegal activities'}</li>
                  <li>{isItalian ? 'Danneggi la reputazione o il funzionamento della piattaforma' : 'Damage the reputation or operation of the platform'}</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Effetti della Risoluzione' : 'Effects of Termination'}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isItalian ? 'Perdita dell\'accesso alla piattaforma' : 'Loss of access to the platform'}</li>
                  <li>{isItalian ? 'Invalidazione automatica di tutti i cookie di autenticazione' : 'Automatic invalidation of all authentication cookies'}</li>
                  <li>{isItalian ? 'Cancellazione dei dati del profilo' : 'Deletion of profile data'}</li>
                  <li>{isItalian ? 'Interruzione delle comunicazioni in corso' : 'Interruption of ongoing communications'}</li>
                  <li>{isItalian ? 'Mantenimento dei dati per obblighi legali (se applicabile)' : 'Data retention for legal obligations (if applicable)'}</li>
                </ul>
              </div>
            </section>

            {/* Section 9: Governing Law */}
            <section>
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {isItalian ? '9. Legge Applicabile e Giurisdizione' : '9. Governing Law and Jurisdiction'}
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  {isItalian 
                    ? 'Questi Termini di Servizio sono regolati dalla legge italiana. Qualsiasi controversia sarà sottoposta alla giurisdizione esclusiva dei tribunali di Roma, Italia.'
                    : 'These Terms of Service are governed by Italian law. Any dispute will be subject to the exclusive jurisdiction of the courts of Rome, Italy.'
                  }
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isItalian ? 'Risoluzione delle Controversie' : 'Dispute Resolution'}
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li><strong>{isItalian ? 'Negoziazione diretta:' : 'Direct negotiation:'}</strong> {isItalian ? 'Incoraggiamo la risoluzione amichevole' : 'We encourage amicable resolution'}</li>
                  <li><strong>{isItalian ? 'Mediazione:' : 'Mediation:'}</strong> {isItalian ? 'Possibilità di mediazione prima del contenzioso' : 'Possibility of mediation before litigation'}</li>
                  <li><strong>{isItalian ? 'Tribunale competente:' : 'Competent court:'}</strong> {isItalian ? 'Tribunali di Roma per controversie non risolte' : 'Rome courts for unresolved disputes'}</li>
                </ol>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>{isItalian ? 'Diritti del Consumatore:' : 'Consumer Rights:'}</strong> {isItalian ? 'Se sei un consumatore, mantieni tutti i diritti previsti dal Codice del Consumo italiano e dalle normative europee applicabili.' : 'If you are a consumer, you retain all rights provided by the Italian Consumer Code and applicable European regulations.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10: Changes and Contact */}
            <section>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {isItalian ? 'Modifiche ai Termini' : 'Changes to Terms'}
                </h3>
                <p className="text-gray-700 mb-4">
                  {isItalian 
                    ? 'Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche significative saranno comunicate con almeno 30 giorni di preavviso tramite email o avviso sulla piattaforma.'
                    : 'We reserve the right to modify these terms at any time. Significant changes will be communicated with at least 30 days notice via email or platform notice.'
                  }
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {isItalian ? 'Contatti' : 'Contact'}
                </h3>
                <p className="text-gray-700">
                  {isItalian 
                    ? 'Per domande sui Termini di Servizio, contattaci a:'
                    : 'For questions about the Terms of Service, contact us at:'
                  }
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">📧 <a href="mailto:legal@caschigialli.it" className="text-blue-600 hover:text-blue-700">legal@caschigialli.it</a></p>
                  <p className="text-gray-600">📞 <a href="tel:+390123456789" className="text-blue-600 hover:text-blue-700">+39 012 345 6789</a></p>
                  <p className="text-gray-600">📍 Via Roma 123, 00100 Roma, {isItalian ? 'Italia' : 'Italy'}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;