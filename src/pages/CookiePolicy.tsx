import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, Database, Shield, Settings, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  const { t } = useTranslation();

  // Set page title for SEO
  React.useEffect(() => {
    document.title = 'Cookie Policy - Caschi Gialli | Politica sui Cookie';
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
            Come utilizziamo i cookie e le tecnologie di archiviazione locale su Caschi Gialli
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Ultimo aggiornamento: 26 Gennaio 2025
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 space-y-8">
            {/* Section 1: What are Cookies */}
            <section>
              <div className="flex items-center mb-4">
                <Cookie className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">1. Cosa Sono i Cookie e il Local Storage</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti 
                  un sito web. Il Local Storage è una tecnologia simile che permette di memorizzare dati 
                  direttamente nel tuo browser.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <Cookie className="h-4 w-4 mr-2" />
                      Cookie Tradizionali
                    </h4>
                    <p className="text-blue-700 text-sm">
                      File temporanei che scadono dopo un periodo determinato e vengono 
                      inviati al server ad ogni richiesta.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Local Storage
                    </h4>
                    <p className="text-green-700 text-sm">
                      Archiviazione locale nel browser che persiste fino alla cancellazione 
                      manuale e non viene inviata automaticamente al server.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: How We Use Storage */}
            <section>
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">2. Come Utilizziamo l'Archiviazione Locale</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    <strong>Importante:</strong> Caschi Gialli utilizza principalmente il Local Storage 
                    del browser per memorizzare i tuoi dati, non cookie tradizionali.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">Dati Memorizzati nel Local Storage</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Token di Autenticazione</h4>
                      <p className="text-sm text-gray-600">
                        Memorizzato come <code className="bg-gray-100 px-1 rounded">auth_token</code> per 
                        mantenere la tua sessione di login attiva.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Eye className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Dati del Profilo Utente</h4>
                      <p className="text-sm text-gray-600">
                        Memorizzati come <code className="bg-gray-100 px-1 rounded">user_data</code> per 
                        evitare richieste ripetute al server e migliorare le performance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Settings className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Preferenze Lingua</h4>
                      <p className="text-sm text-gray-600">
                        La tua scelta di lingua (italiano/inglese) viene memorizzata per 
                        mantenere le tue preferenze tra le sessioni.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Struttura dei Dati</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 overflow-x-auto">
{`// Esempio di dati memorizzati nel Local Storage:
localStorage.setItem('auth_token', 'Bearer eyJhbGciOiJIUzI1NiIs...');
localStorage.setItem('user_data', JSON.stringify({
  id: "123",
  name: "Mario Rossi",
  email: "mario@example.com",
  type: "cg",
  location: { lat: 41.9028, lng: 12.4964 }
}));`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Section 3: Purpose and Legal Basis */}
            <section>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">3. Finalità e Base Giuridica</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Finalità del Trattamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Funzionalità Essenziali</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Mantenimento della sessione di login</li>
                      <li>• Accesso alle funzionalità della piattaforma</li>
                      <li>• Sicurezza dell'account utente</li>
                      <li>• Prevenzione accessi non autorizzati</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Esperienza Utente</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Personalizzazione dell'interfaccia</li>
                      <li>• Mantenimento preferenze lingua</li>
                      <li>• Ottimizzazione delle performance</li>
                      <li>• Riduzione tempi di caricamento</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Base Giuridica (GDPR)</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <ul className="text-purple-700 space-y-2">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Art. 6(1)(b):</span>
                      <span>Esecuzione del contratto - necessario per fornire i servizi richiesti</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Art. 6(1)(f):</span>
                      <span>Interesse legittimo - miglioramento dell'esperienza utente e sicurezza</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4: Data Retention */}
            <section>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">4. Durata di Conservazione</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Token di Autenticazione</h4>
                    <p className="text-red-700 text-sm">
                      <strong>Durata:</strong> Fino al logout manuale o scadenza del token
                    </p>
                    <p className="text-red-700 text-sm mt-1">
                      <strong>Cancellazione:</strong> Automatica al logout
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Dati Profilo</h4>
                    <p className="text-blue-700 text-sm">
                      <strong>Durata:</strong> Fino alla cancellazione dell'account
                    </p>
                    <p className="text-blue-700 text-sm mt-1">
                      <strong>Cancellazione:</strong> Automatica alla cancellazione account
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Preferenze</h4>
                    <p className="text-green-700 text-sm">
                      <strong>Durata:</strong> Indefinita (fino a cancellazione manuale)
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      <strong>Cancellazione:</strong> Manuale tramite browser
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Cancellazione Automatica</h4>
                  <p className="text-orange-700">
                    Quando cancelli il tuo account o fai logout, tutti i dati memorizzati nel 
                    Local Storage vengono automaticamente rimossi dal tuo browser.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Your Control */}
            <section>
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">5. Il Tuo Controllo sui Dati</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Gestione Tramite Piattaforma</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Logout</h4>
                    <p className="text-green-700 text-sm mb-2">
                      Cancella automaticamente token e dati di sessione
                    </p>
                    <code className="text-xs bg-green-100 px-2 py-1 rounded">
                      Pulsante "Logout" → Cancellazione automatica
                    </code>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Cancellazione Account</h4>
                    <p className="text-red-700 text-sm mb-2">
                      Rimuove tutti i dati dal Local Storage e dal server
                    </p>
                    <code className="text-xs bg-red-100 px-2 py-1 rounded">
                      Profilo → "Delete Account" → Cancellazione totale
                    </code>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Gestione Tramite Browser</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Istruzioni per Browser Popolari:</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-gray-800">Chrome:</strong>
                      <p className="text-gray-600 ml-4">
                        Impostazioni → Privacy e sicurezza → Cancella dati di navigazione → 
                        Seleziona "Dati dei siti web" → Cancella dati
                      </p>
                    </div>
                    
                    <div>
                      <strong className="text-gray-800">Firefox:</strong>
                      <p className="text-gray-600 ml-4">
                        Impostazioni → Privacy e sicurezza → Cookie e dati dei siti web → 
                        Gestisci dati → Cerca "caschigialli.it" → Rimuovi
                      </p>
                    </div>
                    
                    <div>
                      <strong className="text-gray-800">Safari:</strong>
                      <p className="text-gray-600 ml-4">
                        Preferenze → Privacy → Gestisci dati siti web → 
                        Cerca "caschigialli.it" → Rimuovi
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Nota:</strong> Cancellando i dati del Local Storage perderai la sessione 
                    di login e dovrai accedere nuovamente alla piattaforma.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Third Party */}
            <section>
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">6. Cookie di Terze Parti</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    <strong>Buone Notizie:</strong> Caschi Gialli non utilizza cookie di terze parti 
                    per tracking, pubblicità o analisi comportamentale.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">Servizi Esterni Utilizzati</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">OpenStreetMap (Nominatim)</h4>
                      <p className="text-sm text-gray-600">
                        Utilizzato per la ricerca di indirizzi. Non memorizza cookie persistenti.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Leaflet Maps</h4>
                      <p className="text-sm text-gray-600">
                        Libreria per mappe interattive. Funziona senza cookie di tracking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Privacy by Design:</strong> Abbiamo scelto tecnologie che rispettano 
                    la tua privacy e non richiedono cookie di terze parti per il tracking.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Updates */}
            <section>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Aggiornamenti della Cookie Policy</h3>
                <p className="text-orange-700 mb-4">
                  Questa Cookie Policy può essere aggiornata periodicamente per riflettere 
                  cambiamenti nelle nostre pratiche o per conformità normativa.
                </p>
                <div className="space-y-2 text-sm text-orange-700">
                  <p><strong>Notifica:</strong> Ti informeremo di modifiche significative tramite email o avviso sulla piattaforma</p>
                  <p><strong>Controllo:</strong> Ti incoraggiamo a rivedere questa policy regolarmente</p>
                  <p><strong>Consenso:</strong> Continuando a utilizzare la piattaforma accetti le modifiche</p>
                </div>
              </div>
            </section>

            {/* Section 8: Contact */}
            <section>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Domande sulla Cookie Policy?</h3>
                <p className="text-gray-700 mb-4">
                  Per qualsiasi domanda riguardo questa Cookie Policy o per esercitare i tuoi diritti:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-900">📧 Email</p>
                    <a href="mailto:privacy@caschigialli.it" className="text-blue-600 hover:text-blue-700">
                      privacy@caschigialli.it
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">📞 Telefono</p>
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