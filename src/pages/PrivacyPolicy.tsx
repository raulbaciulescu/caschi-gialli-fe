import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Eye, Lock, Database, Mail, Phone, MapPin, Calendar, Users, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  // Set page title for SEO
  React.useEffect(() => {
    document.title = 'Privacy Policy - Caschi Gialli | Protezione dei Dati';
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
            La tua privacy è importante per noi. Questa policy spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Ultimo aggiornamento: 26 Gennaio 2025
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 space-y-8">
            {/* Section 1: Information We Collect */}
            <section>
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">1. Informazioni che Raccogliamo</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Informazioni Personali</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Dati di registrazione:</strong> Nome, email, numero di telefono</li>
                  <li><strong>Informazioni di profilo:</strong> Foto profilo, descrizione professionale, servizi offerti</li>
                  <li><strong>Dati di localizzazione:</strong> Indirizzo, coordinate GPS per la ricerca di servizi</li>
                  <li><strong>Informazioni di contatto:</strong> Messaggi scambiati attraverso la piattaforma</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Informazioni Tecniche</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Dati di utilizzo:</strong> Come utilizzi la piattaforma, pagine visitate</li>
                  <li><strong>Informazioni del dispositivo:</strong> Tipo di dispositivo, browser, sistema operativo</li>
                  <li><strong>Dati di rete:</strong> Indirizzo IP, provider di servizi internet</li>
                  <li><strong>Dati di archiviazione locale:</strong> Token di autenticazione e dati profilo memorizzati nel browser</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Archiviazione Locale (Local Storage)</h4>
                  <p className="text-blue-700 text-sm">
                    Utilizziamo il Local Storage del tuo browser per memorizzare:
                  </p>
                  <ul className="text-blue-700 text-sm mt-2 space-y-1">
                    <li>• <code className="bg-blue-100 px-1 rounded">auth_token</code>: Token di autenticazione per mantenere la sessione</li>
                    <li>• <code className="bg-blue-100 px-1 rounded">user_data</code>: Informazioni del profilo utente per ottimizzare le performance</li>
                    <li>• Preferenze lingua e altre impostazioni dell'interfaccia</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2: How We Use Information */}
            <section>
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">2. Come Utilizziamo le Informazioni</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Fornitura del Servizio</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Connettere clienti con professionisti qualificati nella loro area</li>
                  <li>Facilitare la comunicazione tra utenti attraverso il sistema di messaggistica</li>
                  <li>Mostrare profili e servizi disponibili in base alla localizzazione</li>
                  <li>Gestire richieste di servizio e assegnazioni</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Miglioramento del Servizio</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Analizzare l'utilizzo della piattaforma per migliorare l'esperienza utente</li>
                  <li>Sviluppare nuove funzionalità basate sui feedback degli utenti</li>
                  <li>Prevenire frodi e garantire la sicurezza della piattaforma</li>
                  <li>Ottimizzare le performance tramite archiviazione locale dei dati frequentemente utilizzati</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Comunicazioni</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Inviare notifiche importanti riguardo al tuo account</li>
                  <li>Fornire supporto clienti quando richiesto</li>
                  <li>Informare su aggiornamenti dei termini di servizio (solo se necessario)</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Information Sharing */}
            <section>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">3. Condivisione delle Informazioni</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    <strong>Importante:</strong> Non vendiamo mai i tuoi dati personali a terze parti.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">Condivisione Necessaria</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Con altri utenti:</strong> Nome, foto profilo, servizi offerti, area di servizio (solo per Caschi Gialli)</li>
                  <li><strong>Per comunicazioni:</strong> Messaggi scambiati attraverso la piattaforma</li>
                  <li><strong>Fornitori di servizi:</strong> Hosting, analisi (con accordi di riservatezza)</li>
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-green-800 mb-2">Archiviazione Locale - Nessuna Condivisione</h4>
                  <p className="text-green-700 text-sm">
                    I dati memorizzati nel Local Storage del tuo browser (token di autenticazione, 
                    dati profilo) rimangono esclusivamente sul tuo dispositivo e non vengono 
                    condivisi con terze parti.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Condivisione Legale</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Quando richiesto dalla legge o da autorità competenti</li>
                  <li>Per proteggere i diritti, la proprietà o la sicurezza di Caschi Gialli</li>
                  <li>In caso di fusione, acquisizione o vendita di asset aziendali</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Data Security */}
            <section>
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">4. Sicurezza dei Dati</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Implementiamo misure di sicurezza tecniche e organizzative appropriate per proteggere 
                  i tuoi dati personali contro accesso non autorizzato, alterazione, divulgazione o distruzione.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Misure di Sicurezza</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Crittografia:</strong> Tutti i dati sono crittografati in transito e a riposo</li>
                  <li><strong>Autenticazione:</strong> Sistema di login sicuro con password crittografate</li>
                  <li><strong>Accesso limitato:</strong> Solo personale autorizzato può accedere ai dati</li>
                  <li><strong>Monitoraggio:</strong> Controllo continuo per rilevare attività sospette</li>
                  <li><strong>Backup sicuri:</strong> Copie di sicurezza crittografate e protette</li>
                  <li><strong>Archiviazione locale sicura:</strong> I dati nel browser sono protetti dalle politiche di sicurezza del browser stesso</li>
                </ul>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Sicurezza del Local Storage</h4>
                  <p className="text-purple-700 text-sm">
                    I dati nel Local Storage sono protetti dalle politiche di sicurezza del browser 
                    e sono accessibili solo dal dominio caschigialli.it. Vengono automaticamente 
                    cancellati quando fai logout o cancelli il tuo account.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Your Rights */}
            <section>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">5. I Tuoi Diritti</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  In conformità con il GDPR e le leggi italiane sulla privacy, hai i seguenti diritti:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Diritto di Accesso</h4>
                    <p className="text-blue-700 text-sm">
                      Puoi richiedere una copia di tutti i dati personali che abbiamo su di te.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Diritto di Rettifica</h4>
                    <p className="text-green-700 text-sm">
                      Puoi correggere o aggiornare i tuoi dati personali in qualsiasi momento.
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Diritto di Cancellazione</h4>
                    <p className="text-red-700 text-sm">
                      Puoi richiedere la cancellazione dei tuoi dati personali ("diritto all'oblio").
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Diritto di Portabilità</h4>
                    <p className="text-purple-700 text-sm">
                      Puoi richiedere i tuoi dati in un formato strutturato e leggibile.
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Controllo dell'Archiviazione Locale</h4>
                  <p className="text-orange-700 text-sm mb-2">
                    Hai il controllo completo sui dati memorizzati nel tuo browser:
                  </p>
                  <ul className="text-orange-700 text-sm space-y-1">
                    <li>• <strong>Logout:</strong> Cancella automaticamente token e dati di sessione</li>
                    <li>• <strong>Cancellazione account:</strong> Rimuove tutti i dati dal Local Storage</li>
                    <li>• <strong>Impostazioni browser:</strong> Puoi cancellare manualmente i dati del sito</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6: Cookies */}
            <section>
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">6. Cookie e Tecnologie Simili</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza sulla piattaforma.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Tipi di Cookie</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Cookie essenziali:</strong> Necessari per il funzionamento della piattaforma</li>
                  <li><strong>Cookie di preferenze:</strong> Ricordano le tue impostazioni (lingua, tema)</li>
                  <li><strong>Cookie analitici:</strong> Ci aiutano a capire come utilizzi la piattaforma</li>
                </ul>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>Controllo dei Cookie:</strong> Puoi gestire le preferenze dei cookie 
                    attraverso le impostazioni del tuo browser. Nota che disabilitare alcuni cookie 
                    potrebbe limitare alcune funzionalità della piattaforma.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Contact */}
            <section>
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">7. Contattaci</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Per qualsiasi domanda riguardo questa Privacy Policy o per esercitare i tuoi diritti, 
                  puoi contattarci:
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
                        <p className="font-medium text-gray-900">Telefono</p>
                        <a href="tel:+390123456789" className="text-blue-600 hover:text-blue-700">
                          +39 012 345 6789
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start md:col-span-2">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Indirizzo</p>
                        <p className="text-gray-600">
                          Caschi Gialli S.r.l.<br />
                          Via Roma 123<br />
                          00100 Roma, Italia
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Tempo di Risposta:</strong> Ci impegniamo a rispondere alle tue richieste 
                    entro 30 giorni, come previsto dal GDPR.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8: Updates */}
            <section>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Aggiornamenti della Privacy Policy</h3>
                <p className="text-yellow-700">
                  Potremmo aggiornare questa Privacy Policy periodicamente. Ti notificheremo 
                  eventuali modifiche significative tramite email o attraverso un avviso sulla piattaforma. 
                  Ti incoraggiamo a rivedere questa policy regolarmente.
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