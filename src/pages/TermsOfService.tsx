import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Users, Shield, AlertTriangle, Scale, Gavel, CheckCircle, XCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const { t } = useTranslation();

  // Set page title for SEO
  React.useEffect(() => {
    document.title = 'Terms of Service - Caschi Gialli | Termini di Servizio';
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
            Termini e condizioni per l'utilizzo della piattaforma Caschi Gialli
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Ultimo aggiornamento: 26 Gennaio 2025
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 space-y-8">
            {/* Section 1: Acceptance */}
            <section>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">1. Accettazione dei Termini</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Benvenuto su Caschi Gialli! Utilizzando la nostra piattaforma, accetti di essere vincolato 
                  da questi Termini di Servizio ("Termini"). Se non accetti questi termini, non utilizzare 
                  i nostri servizi.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">
                    <strong>Importante:</strong> Questi termini costituiscono un accordo legale tra te e 
                    Caschi Gialli S.r.l. Ti incoraggiamo a leggerli attentamente.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">Chi Può Utilizzare Caschi Gialli</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Devi avere almeno 18 anni</li>
                  <li>Devi fornire informazioni accurate e veritiere</li>
                  <li>Devi avere la capacità legale di stipulare contratti</li>
                  <li>Non devi essere stato precedentemente sospeso dalla piattaforma</li>
                </ul>
              </div>
            </section>

            {/* Section 2: Platform Description */}
            <section>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">2. Descrizione del Servizio</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Caschi Gialli è una piattaforma digitale che connette clienti con professionisti 
                  qualificati ("Caschi Gialli") per servizi a domicilio in Italia.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Servizi Offerti</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Per i Clienti</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Ricerca professionisti qualificati</li>
                      <li>• Sistema di messaggistica integrato</li>
                      <li>• Gestione richieste di servizio</li>
                      <li>• Localizzazione geografica</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Per i Caschi Gialli</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Profilo professionale personalizzato</li>
                      <li>• Ricezione richieste di lavoro</li>
                      <li>• Gestione area di servizio</li>
                      <li>• Portfolio fotografico</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>Nota Importante:</strong> Caschi Gialli facilita il contatto tra clienti e 
                    professionisti ma non è parte del contratto di servizio che si stabilisce tra loro. 
                    Non siamo responsabili per la qualità, tempestività o altri aspetti dei servizi forniti.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: User Responsibilities */}
            <section>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">3. Responsabilità degli Utenti</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Responsabilità Generali</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fornire informazioni accurate e aggiornate</li>
                  <li>Mantenere la sicurezza del proprio account</li>
                  <li>Rispettare le leggi italiane ed europee applicabili</li>
                  <li>Non utilizzare la piattaforma per scopi illegali o non autorizzati</li>
                  <li>Rispettare gli altri utenti e comunicare in modo professionale</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Responsabilità Specifiche per i Clienti</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fornire descrizioni accurate delle richieste di servizio</li>
                  <li>Comunicare chiaramente i propri bisogni e aspettative</li>
                  <li>Rispettare gli accordi presi con i Caschi Gialli</li>
                  <li>Pagare i servizi secondo gli accordi stabiliti</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6">Responsabilità Specifiche per i Caschi Gialli</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Possedere le qualifiche e licenze necessarie per i servizi offerti</li>
                  <li>Fornire servizi di qualità professionale</li>
                  <li>Rispettare gli accordi presi con i clienti</li>
                  <li>Mantenere aggiornate le informazioni del profilo</li>
                  <li>Rispondere tempestivamente alle richieste</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Prohibited Activities */}
            <section>
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">4. Attività Vietate</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium mb-2">
                    Le seguenti attività sono strettamente vietate sulla piattaforma:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Contenuti Vietati</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                      <li>Contenuti illegali, offensivi o diffamatori</li>
                      <li>Spam o comunicazioni non richieste</li>
                      <li>Informazioni false o fuorvianti</li>
                      <li>Contenuti che violano i diritti di proprietà intellettuale</li>
                      <li>Materiale pornografico o inappropriato</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Comportamenti Vietati</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                      <li>Impersonare altre persone o entità</li>
                      <li>Tentare di aggirare le misure di sicurezza</li>
                      <li>Utilizzare bot o sistemi automatizzati</li>
                      <li>Raccogliere dati di altri utenti senza consenso</li>
                      <li>Interferire con il funzionamento della piattaforma</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800">
                    <strong>Conseguenze:</strong> La violazione di questi termini può comportare 
                    la sospensione o la chiusura permanente dell'account, oltre a possibili azioni legali.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Payments and Fees */}
            <section>
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">5. Pagamenti e Commissioni</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Utilizzo Gratuito della Piattaforma</h3>
                <p>
                  Attualmente, l'utilizzo di Caschi Gialli è gratuito sia per i clienti che per i 
                  professionisti. Non applichiamo commissioni sulle transazioni.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Pagamenti tra Utenti</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>I pagamenti per i servizi avvengono direttamente tra cliente e Casco Giallo</li>
                  <li>Caschi Gialli non gestisce i pagamenti né funge da intermediario</li>
                  <li>Gli utenti sono responsabili di concordare metodi e termini di pagamento</li>
                  <li>Raccomandiamo di utilizzare metodi di pagamento tracciabili</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">Possibili Commissioni Future</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    Ci riserviamo il diritto di introdurre commissioni in futuro. In tal caso, 
                    gli utenti saranno informati con almeno 30 giorni di preavviso.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Intellectual Property */}
            <section>
              <div className="flex items-center mb-4">
                <Gavel className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">6. Proprietà Intellettuale</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Proprietà di Caschi Gialli</h3>
                <p>
                  La piattaforma Caschi Gialli, inclusi design, logo, codice, contenuti e funzionalità, 
                  è di proprietà di Caschi Gialli S.r.l. e protetta dalle leggi sul copyright e altri 
                  diritti di proprietà intellettuale.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Contenuti degli Utenti</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Mantieni la proprietà dei contenuti che carichi (foto, descrizioni, ecc.)</li>
                  <li>Concedi a Caschi Gialli una licenza per utilizzare i tuoi contenuti sulla piattaforma</li>
                  <li>Garantisci di avere i diritti sui contenuti che carichi</li>
                  <li>Non caricare contenuti che violano i diritti di terzi</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">Licenza d'Uso</h3>
                <p>
                  Ti concediamo una licenza limitata, non esclusiva e revocabile per utilizzare 
                  la piattaforma secondo questi termini. Non puoi:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Copiare, modificare o distribuire la piattaforma</li>
                  <li>Fare reverse engineering del codice</li>
                  <li>Utilizzare i nostri marchi senza autorizzazione</li>
                  <li>Creare opere derivate basate sulla piattaforma</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Limitation of Liability */}
            <section>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">7. Limitazione di Responsabilità</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 font-medium">
                    <strong>Importante:</strong> Caschi Gialli è una piattaforma di intermediazione. 
                    Non siamo responsabili per i servizi forniti dai professionisti.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">Esclusioni di Responsabilità</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Qualità, sicurezza o legalità dei servizi offerti dai Caschi Gialli</li>
                  <li>Accuratezza delle informazioni fornite dagli utenti</li>
                  <li>Danni derivanti dall'utilizzo della piattaforma</li>
                  <li>Interruzioni del servizio o problemi tecnici</li>
                  <li>Perdita di dati o informazioni</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">Limitazioni</h3>
                <p>
                  Nella misura massima consentita dalla legge, la nostra responsabilità totale 
                  verso qualsiasi utente non supererà mai l'importo di €100 per qualsiasi reclamo.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Indennizzo</h3>
                <p>
                  Accetti di indennizzare e tenere indenne Caschi Gialli da qualsiasi reclamo, 
                  danno o spesa derivante dal tuo utilizzo della piattaforma o dalla violazione 
                  di questi termini.
                </p>
              </div>
            </section>

            {/* Section 8: Termination */}
            <section>
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">8. Risoluzione del Contratto</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Risoluzione da Parte dell'Utente</h3>
                <p>
                  Puoi chiudere il tuo account in qualsiasi momento attraverso le impostazioni 
                  del profilo o contattandoci direttamente.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Risoluzione da Parte di Caschi Gialli</h3>
                <p>
                  Possiamo sospendere o chiudere il tuo account se:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violi questi Termini di Servizio</li>
                  <li>Fornisci informazioni false o fuorvianti</li>
                  <li>Utilizzi la piattaforma per attività illegali</li>
                  <li>Danneggi la reputazione o il funzionamento della piattaforma</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">Effetti della Risoluzione</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Perdita dell'accesso alla piattaforma</li>
                  <li>Cancellazione dei dati del profilo</li>
                  <li>Interruzione delle comunicazioni in corso</li>
                  <li>Mantenimento dei dati per obblighi legali (se applicabile)</li>
                </ul>
              </div>
            </section>

            {/* Section 9: Governing Law */}
            <section>
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">9. Legge Applicabile e Giurisdizione</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Questi Termini di Servizio sono regolati dalla legge italiana. Qualsiasi controversia 
                  sarà sottoposta alla giurisdizione esclusiva dei tribunali di Roma, Italia.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">Risoluzione delle Controversie</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li><strong>Negoziazione diretta:</strong> Incoraggiamo la risoluzione amichevole</li>
                  <li><strong>Mediazione:</strong> Possibilità di mediazione prima del contenzioso</li>
                  <li><strong>Tribunale competente:</strong> Tribunali di Roma per controversie non risolte</li>
                </ol>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Diritti del Consumatore:</strong> Se sei un consumatore, mantieni tutti 
                    i diritti previsti dal Codice del Consumo italiano e dalle normative europee applicabili.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10: Changes and Contact */}
            <section>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Modifiche ai Termini</h3>
                <p className="text-gray-700 mb-4">
                  Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. 
                  Le modifiche significative saranno comunicate con almeno 30 giorni di preavviso 
                  tramite email o avviso sulla piattaforma.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contatti</h3>
                <p className="text-gray-700">
                  Per domande sui Termini di Servizio, contattaci a:
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">📧 <a href="mailto:legal@caschigialli.it" className="text-blue-600 hover:text-blue-700">legal@caschigialli.it</a></p>
                  <p className="text-gray-600">📞 <a href="tel:+390123456789" className="text-blue-600 hover:text-blue-700">+39 012 345 6789</a></p>
                  <p className="text-gray-600">📍 Via Roma 123, 00100 Roma, Italia</p>
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