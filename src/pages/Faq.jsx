import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useLangStore } from '../store';

export default function Faq() {
  const { lang } = useLangStore();
  const { isMobile } = useBreakpoint();
  const l = lang || 'fr';
  const [open, setOpen] = useState(0);

  const C = {
    bg: '#f5f5f5',
    card: '#ffffff',
    card2: '#ececec',
    border: 'rgba(0,0,0,0.1)',
    text: '#111111',
    text2: '#444444',
    text3: '#888888',
    red: '#132853',
    shadow: '0 4px 24px rgba(0,0,0,0.08)',
  };

  const t = (obj) => obj[l] || obj.fr;

  const categories = [
    {
      icon: '🚗',
      label: t({ fr:'Achat de véhicule', en:'Vehicle purchase', de:'Fahrzeugkauf', es:'Compra de vehículo', it:'Acquisto veicolo', pt:'Compra de veículo' }),
      items: [
        { q: t({ fr:'Quels types de véhicules proposez-vous ?', en:'What types of vehicles do you offer?', de:'Welche Fahrzeugtypen bieten Sie an?', es:'¿Qué tipos de vehículos ofrece?', it:'Che tipi di veicoli offrite?', pt:'Que tipos de veículos oferecem?' }),
          a: t({ fr:'Nous proposons des véhicules neufs et d\'occasion : berlines, SUV, citadines, coupés, breaks, monospaces, utilitaires et 4x4. Tous nos véhicules d\'occasion sont inspectés et garantis.', en:'We offer new and used vehicles: sedans, SUVs, city cars, coupes, estates, MPVs, vans and 4x4s. All our used vehicles are inspected and warranted.', de:'Wir bieten Neu- und Gebrauchtwagen: Limousinen, SUVs, Kleinwagen, Coupés, Kombis, Vans, Transporter und Geländewagen. Alle Gebrauchtwagen sind geprüft und garantiert.', es:'Ofrecemos vehículos nuevos y de ocasión: berlinas, SUV, urbanos, cupés, familiares, monovolúmenes, furgonetas y 4x4. Todos inspeccionados y con garantía.', it:'Offriamo veicoli nuovi e usati: berline, SUV, city car, coupé, station wagon, monovolume, furgoni e 4x4. Tutti ispezionati e garantiti.', pt:'Oferecemos veículos novos e usados: berlina, SUV, citadinos, cupés, carrinhas, monovolumes, furgões e 4x4. Todos inspecionados e com garantia.' }) },
        { q: t({ fr:'Les véhicules sont-ils garantis ?', en:'Are the vehicles warranted?', de:'Sind die Fahrzeuge garantiert?', es:'¿Están garantizados los vehículos?', it:'I veicoli sono garantiti?', pt:'Os veículos têm garantia?' }),
          a: t({ fr:'Oui. Chaque véhicule inclut une garantie de 12 mois ou 10 000 km. Des extensions jusqu\'à 36 mois et une option carrosserie sont disponibles.', en:'Yes. Each vehicle includes a 12-month or 10,000 km warranty. Extensions up to 36 months and a body option are available.', de:'Ja. Jedes Fahrzeug hat eine Garantie von 12 Monaten oder 10.000 km. Erweiterungen bis zu 36 Monaten und eine Karosserie-Option sind verfügbar.', es:'Sí. Cada vehículo incluye una garantía de 12 meses o 10.000 km. Hay extensiones hasta 36 meses y opción de carrocería.', it:'Sì. Ogni veicolo include una garanzia di 12 mesi o 10.000 km. Disponibili estensioni fino a 36 mesi e opzione carrozzeria.', pt:'Sim. Cada veículo inclui uma garantia de 12 meses ou 10.000 km. Extensões até 36 meses e opção de carroçaria estão disponíveis.' }) },
        { q: t({ fr:'Puis-je financer mon achat ?', en:'Can I finance my purchase?', de:'Kann ich meinen Kauf finanzieren?', es:'¿Puedo financiar mi compra?', it:'Posso finanziare l\'acquisto?', pt:'Posso financiar a minha compra?' }),
          a: t({ fr:'Bien sûr. Nous proposons le paiement intégral, un acompte de 25%, ou un financement sur 60 mois avec mensualités. Utilisez notre simulateur pour estimer votre budget.', en:'Of course. We offer full payment, a 25% deposit, or 60-month financing with monthly payments. Use our simulator to estimate your budget.', de:'Natürlich. Wir bieten Vollzahlung, eine Anzahlung von 25% oder eine Finanzierung über 60 Monate mit Raten. Nutzen Sie unseren Rechner.', es:'Por supuesto. Ofrecemos pago completo, señal del 25% o financiación a 60 meses. Use nuestro simulador.', it:'Certamente. Offriamo pagamento completo, acconto del 25% o finanziamento a 60 mesi. Usate il nostro simulatore.', pt:'Claro. Oferecemos pagamento integral, entrada de 25% ou financiamento a 60 meses. Use o nosso simulador.' }) },
        { q: t({ fr:'Puis-je essayer le véhicule avant d\'acheter ?', en:'Can I test the vehicle before buying?', de:'Kann ich das Fahrzeug vor dem Kauf testen?', es:'¿Puedo probar el vehículo antes de comprar?', it:'Posso provare il veicolo prima dell\'acquisto?', pt:'Posso experimentar o veículo antes de comprar?' }),
          a: t({ fr:'Oui, nous organisons des essais sur rendez-vous à notre showroom de Naumburg, en Allemagne.', en:'Yes, we arrange test drives by appointment at our Naumburg showroom in Germany.', de:'Ja, wir vereinbaren Probefahrten in unserem Showroom in Naumburg.', es:'Sí, organizamos pruebas de conducción con cita en nuestro showroom de Naumburg.', it:'Sì, organizziamo prove su strada su appuntamento nel nostro showroom di Naumburg.', pt:'Sim, organizamos test drives por marcação no nosso showroom de Naumburg.' }) },
      ],
    },
    {
      icon: '🚚',
      label: t({ fr:'Livraison', en:'Delivery', de:'Lieferung', es:'Entrega', it:'Consegna', pt:'Entrega' }),
      items: [
        { q: t({ fr:'Quels sont les délais de livraison ?', en:'What are the delivery times?', de:'Wie lange dauert die Lieferung?', es:'¿Cuáles son los plazos de entrega?', it:'Quali sono i tempi di consegna?', pt:'Quais são os prazos de entrega?' }),
          a: t({ fr:'En moyenne 48h pour la France et l\'Europe, selon la localisation. Le véhicule est livré à votre porte avec toutes les démarches administratives effectuées.', en:'On average 48h for France and Europe, depending on location. The vehicle is delivered to your door with all administrative formalities completed.', de:'Im Durchschnitt 48h für Frankreich und Europa. Das Fahrzeug wird vor Ihre Tür geliefert, alle Formalitäten sind erledigt.', es:'Media de 48h para Francia y Europa. El vehículo se entrega a su puerta con todos los trámites realizados.', it:'In media 48h per Francia e Europa. Il veicolo viene consegnato a domicilio con tutte le formalità completate.', pt:'Em média 48h para França e Europa. O veículo é entregue à sua porta com todas as formalidades tratadas.' }) },
        { q: t({ fr:'Combien coûte la livraison ?', en:'How much does delivery cost?', de:'Was kostet die Lieferung?', es:'¿Cuánto cuesta la entrega?', it:'Quanto costa la consegna?', pt:'Quanto custa a entrega?' }),
          a: t({ fr:'Le tarif dépend de la distance. Un devis précis vous est communiqué avant validation de la commande. Des remises s\'appliquent pour plusieurs véhicules.', en:'The price depends on distance. An exact quote is provided before order confirmation. Discounts apply for multiple vehicles.', de:'Der Preis hängt von der Entfernung ab. Ein genaues Angebot erhalten Sie vor der Bestellbestätigung. Rabatte bei mehreren Fahrzeugen.', es:'El precio depende de la distancia. Se comunica un presupuesto exacto antes de confirmar. Descuentos para varios vehículos.', it:'Il prezzo dipende dalla distanza. Preventivo esatto prima della conferma. Sconti per più veicoli.', pt:'O preço depende da distância. Orçamento exato antes da confirmação. Descontos para vários veículos.' }) },
        { q: t({ fr:'Livrez-vous dans toute l\'Europe ?', en:'Do you deliver across Europe?', de:'Liefern Sie in ganz Europa?', es:'¿Entrega en toda Europa?', it:'Consegnate in tutta Europa?', pt:'Entregam em toda a Europa?' }),
          a: t({ fr:'Oui, nous livrons dans tous les pays de l\'Union européenne ainsi que la Suisse et le Royaume-Uni.', en:'Yes, we deliver to all EU countries as well as Switzerland and the United Kingdom.', de:'Ja, wir liefern in alle EU-Länder sowie in die Schweiz und das Vereinigte Königreich.', es:'Sí, entregamos en todos los países de la UE, Suiza y Reino Unido.', it:'Sì, consegniamo in tutti i paesi UE, Svizzera e Regno Unito.', pt:'Sim, entregamos em todos os países da UE, Suíça e Reino Unido.' }) },
      ],
    },
    {
      icon: '🔧',
      label: t({ fr:'Garantie & Après-vente', en:'Warranty & After-sales', de:'Garantie & Kundendienst', es:'Garantía y posventa', it:'Garanzia e post-vendita', pt:'Garantia e pós-venda' }),
      items: [
        { q: t({ fr:'Que couvre la garantie ?', en:'What does the warranty cover?', de:'Was deckt die Garantie ab?', es:'¿Qué cubre la garantía?', it:'Cosa copre la garanzia?', pt:'O que cobre a garantia?' }),
          a: t({ fr:'La garantie couvre le moteur, la boîte de vitesses, la direction, le freinage, l\'électronique, la climatisation et le système électrique. Voir la page Garantie pour le détail.', en:'The warranty covers engine, gearbox, steering, braking, electronics, air conditioning and electrical system. See the Warranty page for details.', de:'Die Garantie deckt Motor, Getriebe, Lenkung, Bremsen, Elektronik, Klimaanlage und Elektrik. Details auf der Garantie-Seite.', es:'La garantía cubre motor, caja de cambios, dirección, frenos, electrónica, aire acondicionado y sistema eléctrico. Consulte la página de Garantía.', it:'La garanzia copre motore, cambio, sterzo, freni, elettronica, climatizzatore e impianto elettrico. Vedere la pagina Garanzia.', pt:'A garantia cobre motor, caixa de velocidades, direção, travões, eletrónica, ar condicionado e sistema elétrico. Ver página Garantia.' }) },
        { q: t({ fr:'Comment déclarer un sinistre / une panne ?', en:'How do I report a fault / breakdown?', de:'Wie melde ich einen Schaden / eine Panne?', es:'¿Cómo reporto una avería?', it:'Come segnalo un guasto?', pt:'Como comunico uma avaria?' }),
          a: t({ fr:'Contactez-nous par téléphone, WhatsApp ou email. Nous vous guidons vers notre atelier partenaire le plus proche, et la prise en charge est directe.', en:'Contact us by phone, WhatsApp or email. We guide you to our nearest partner workshop, with direct coverage.', de:'Kontaktieren Sie uns per Telefon, WhatsApp oder E-Mail. Wir verweisen Sie an unsere nächste Partnerwerkstatt.', es:'Contáctenos por teléfono, WhatsApp o email. Le guiamos al taller asociado más cercano.', it:'Contattateci per telefono, WhatsApp o email. Vi indirizziamo all\'officina partner più vicina.', pt:'Contacte-nos por telefone, WhatsApp ou email. Encaminhamos para a oficina parceira mais próxima.' }) },
      ],
    },
    {
      icon: '💳',
      label: t({ fr:'Paiement & Financement', en:'Payment & Financing', de:'Zahlung & Finanzierung', es:'Pago y financiación', it:'Pagamento e finanziamento', pt:'Pagamento e financiamento' }),
      items: [
        { q: t({ fr:'Quels modes de paiement acceptez-vous ?', en:'What payment methods do you accept?', de:'Welche Zahlungsarten akzeptieren Sie?', es:'¿Qué métodos de pago aceptan?', it:'Quali metodi di pagamento accettate?', pt:'Que métodos de pagamento aceitam?' }),
          a: t({ fr:'Paiement intégral, acompte de 25% puis solde à la livraison, ou mensualités sur 60 mois. Le virement bancaire est le mode standard.', en:'Full payment, 25% deposit then balance on delivery, or 60-month installments. Bank transfer is the standard method.', de:'Vollzahlung, 25% Anzahlung und Rest bei Lieferung, oder 60 Monatsraten. Banküberweisung ist Standard.', es:'Pago completo, señal del 25% y saldo en la entrega, o plazos de 60 meses. Transferencia bancaria.', it:'Pagamento completo, acconto del 25% e saldo alla consegna, o rate a 60 mesi. Bonifico bancario.', pt:'Pagamento integral, entrada de 25% e saldo na entrega, ou prestações a 60 meses. Transferência bancária.' }) },
        { q: t({ fr:'Comment est calculée la mensualité ?', en:'How is the monthly payment calculated?', de:'Wie wird die Monatsrate berechnet?', es:'¿Cómo se calcula la cuota mensual?', it:'Come si calcola la rata mensile?', pt:'Como é calculada a prestação mensal?' }),
          a: t({ fr:'Sur 60 mois à 6% annuel. Exemple : 25 000€ ≈ 483€/mois. Utilisez notre simulateur de financement pour un calcul précis.', en:'Over 60 months at 6% annual. Example: €25,000 ≈ €483/month. Use our financing simulator for an exact calculation.', de:'Über 60 Monate zu 6% jährlich. Beispiel: 25.000€ ≈ 483€/Monat. Nutzen Sie unseren Finanzierungsrechner.', es:'A 60 meses al 6% anual. Ejemplo: 25.000€ ≈ 483€/mes. Use nuestro simulador.', it:'Su 60 mesi al 6% annuo. Esempio: 25.000€ ≈ 483€/mese. Usate il nostro simulatore.', pt:'A 60 meses a 6% ao ano. Exemplo: 25.000€ ≈ 483€/mês. Use o nosso simulador.' }) },
      ],
    },
    {
      icon: '🛡️',
      label: t({ fr:'Vente & Reprise', en:'Selling & Trade-in', de:'Verkauf & Ankauf', es:'Venta y recompra', it:'Vendita e permuta', pt:'Venda e recompra' }),
      items: [
        { q: t({ fr:'Comment vendre mon véhicule ?', en:'How can I sell my vehicle?', de:'Wie verkaufe ich mein Fahrzeug?', es:'¿Cómo vendo mi vehículo?', it:'Come vendo il mio veicolo?', pt:'Como vendo o meu veículo?' }),
          a: t({ fr:'Remplissez le formulaire sur la page « Vendre ». Vous recevez une estimation gratuite sous 24h. Si l\'offre vous convient, nous organisons la reprise.', en:'Fill in the form on the "Sell" page. You receive a free estimate within 24h. If the offer suits you, we arrange collection.', de:'Füllen Sie das Formular auf der Seite "Verkaufen" aus. Sie erhalten eine kostenlose Bewertung in 24h.', es:'Rellene el formulario en la página "Vender". Recibe una estimación gratuita en 24h.', it:'Compilate il modulo nella pagina "Vendi". Ricevete una stima gratuita entro 24h.', pt:'Preencha o formulário na página "Vender". Recebe uma estimativa gratuita em 24h.' }) },
        { q: t({ fr:'Proposez-vous une reprise en cas d\'achat ?', en:'Do you offer a trade-in when buying?', de:'Bieten Sie einen Ankauf beim Kauf an?', es:'¿Ofrecen recompra al comprar?', it:'Offrite una permuta in caso di acquisto?', pt:'Oferecem recompra em caso de compra?' }),
          a: t({ fr:'Oui, vous pouvez déduire la valeur de votre ancien véhicule du prix d\'achat de votre nouveau véhicule.', en:'Yes, you can deduct the value of your old vehicle from the price of your new vehicle.', de:'Ja, Sie können den Wert Ihres Altfahrzeugs vom Kaufpreis abziehen.', es:'Sí, puede descontar el valor de su antiguo vehículo.', it:'Sì, potete dedurre il valore del vostro vecchio veicolo.', pt:'Sim, pode deduzir o valor do seu antigo veículo.' }) },
      ],
    },
  ];

  return (
    <div style={{ minHeight:'100vh', background:C.bg, paddingTop:76 }}>

      {/* Hero */}
      <section style={{
        position:'relative', height: isMobile ? '50vh' : '55vh', minHeight:380,
        display:'flex', alignItems:'center', overflow:'hidden',
        background:'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
      }}>
        <motion.div
          initial={{ opacity:0, scale:1.1 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:1.2 }}
          style={{
            position:'absolute', inset:0,
            backgroundImage:'url(https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1800&q=80)',
            backgroundSize:'cover', backgroundPosition:'center', opacity:0.2
          }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 100%)' }} />

        <motion.div
          initial={{ opacity:0, y:40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8, delay:0.2 }}
          style={{ position:'relative', zIndex:2, padding: isMobile ? '0 5%' : '0 7%', maxWidth:900 }}
        >
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(19,40,83,0.3)', border:'1px solid rgba(19,40,83,0.5)', borderRadius:4, padding:'8px 18px', marginBottom:24 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#132853', display:'inline-block' }} />
            <span style={{ fontSize:12, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.9)' }}>
              FAQ
            </span>
          </div>
          <h1 style={{
            fontFamily:"'Outfit',sans-serif", fontWeight:900,
            fontSize: isMobile ? 'clamp(36px,8vw,64px)' : 'clamp(48px,6vw,88px)',
            color:'#fff', letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:20
          }}>
            {t({ fr:'Questions\nféquentes', en:'Frequently\nasked questions', de:'Häufig\ngestellte Fragen', es:'Preguntas\nfrecuentes', it:'Domande\nfrequenti', pt:'Perguntas\nfrequentes' })}
          </h1>
          <p style={{ fontSize: isMobile ? 16 : 18, color:'rgba(255,255,255,0.7)', lineHeight:1.7, maxWidth:600, marginBottom:32 }}>
            {t({ fr:'Tout ce que vous devez savoir sur l\'achat, la vente, la livraison et la garantie.', en:'Everything you need to know about buying, selling, delivery and warranty.', de:'Alles, was Sie über Kauf, Verkauf, Lieferung und Garantie wissen müssen.', es:'Todo lo que necesita saber sobre compra, venta, entrega y garantía.', it:'Tutto quello che dovete sapere su acquisto, vendita, consegna e garanzia.', pt:'Tudo o que precisa de saber sobre compra, venda, entrega e garantia.' })}
          </p>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="section-pad">
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          {categories.map((cat, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity:0, y:30 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.5, delay:ci*0.05 }}
              style={{ marginBottom:40 }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#132853,#0E1E3D)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {cat.icon}
                </div>
                <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize: isMobile ? 22 : 28, color:C.text }}>
                  {cat.label}
                </h2>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {cat.items.map((item, i) => {
                  const isOpen = open === `${ci}-${i}`;
                  return (
                    <div key={i} style={{
                      background:C.card, border:`1px solid ${isOpen ? 'rgba(19,40,83,0.35)' : C.border}`,
                      borderRadius:14, overflow:'hidden', boxShadow:C.shadow, transition:'border-color 0.25s'
                    }}>
                      <button
                        onClick={() => setOpen(isOpen ? -1 : `${ci}-${i}`)}
                        style={{
                          width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                          gap:16, padding: isMobile ? '18px 20px' : '20px 24px', background:'transparent',
                          border:'none', cursor:'pointer', textAlign:'left', fontFamily:"'Outfit',sans-serif"
                        }}
                      >
                        <span style={{ fontSize: isMobile ? 15 : 16, fontWeight:700, color:C.text, lineHeight:1.5 }}>{item.q}</span>
                        <span style={{
                          width:30, height:30, flexShrink:0, borderRadius:'50%',
                          background: isOpen ? 'linear-gradient(135deg,#132853,#0E1E3D)' : C.card2,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          color: isOpen ? '#fff' : C.text2, fontSize:15, fontWeight:800,
                          transition:'all 0.25s', transform: isOpen ? 'rotate(45deg)' : 'none'
                        }}>
                          +
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height:0, opacity:0 }}
                            animate={{ height:'auto', opacity:1 }}
                            exit={{ height:0, opacity:0 }}
                            transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
                            style={{ overflow:'hidden' }}
                          >
                            <div style={{ padding: isMobile ? '0 20px 22px' : '0 24px 24px', fontSize:14.5, color:C.text2, lineHeight:1.8 }}>
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* CTA */}
          <motion.div
            initial={{ opacity:0, y:30 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.5 }}
            style={{ textAlign:'center', background:'linear-gradient(135deg,#0a0a0a,#1a1a1a)', borderRadius:20, padding: isMobile ? 32 : 48, marginTop:16 }}
          >
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize: isMobile ? 24 : 30, color:'#fff', marginBottom:12 }}>
              {t({ fr:'Votre question n\'est pas dans la liste ?', en:'Your question is not listed?', de:'Ihre Frage ist nicht dabei?', es:'¿Su pregunta no está en la lista?', it:'La tua domanda non è in elenco?', pt:'A sua pergunta não está na lista?' })}
            </h2>
            <p style={{ fontSize:14.5, color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:24 }}>
              {t({ fr:'Notre équipe vous répond sous 24h.', en:'Our team replies within 24h.', de:'Unser Team antwortet innerhalb von 24h.', es:'Nuestro equipo responde en 24h.', it:'Il nostro team risponde entro 24h.', pt:'A nossa equipa responde em 24h.' })}
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/contact" style={{
                background:'linear-gradient(135deg,#132853,#0E1E3D)', color:'#fff', textDecoration:'none',
                fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, padding:'14px 28px',
                borderRadius:8, display:'inline-flex', alignItems:'center', gap:8,
                boxShadow:'0 4px 16px rgba(19,40,83,0.4)'
              }}>
                {t({ fr:'Nous contacter', en:'Contact us', de:'Kontakt', es:'Contáctenos', it:'Contattaci', pt:'Fale connosco' })} →
              </Link>
              <a href="https://wa.me/491745232945" target="_blank" rel="noopener noreferrer" style={{
                background:'#25D366', color:'#fff', textDecoration:'none', fontFamily:"'Outfit',sans-serif",
                fontSize:14, fontWeight:700, padding:'14px 28px', borderRadius:8, display:'inline-flex', alignItems:'center', gap:8,
                boxShadow:'0 4px 16px rgba(37,211,102,0.3)'
              }}>
                💬 WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
