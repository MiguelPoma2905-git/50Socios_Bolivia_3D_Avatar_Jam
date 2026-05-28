import { useState } from 'react';
import soundManager from '../utils/soundManager';

const Roadmap = () => {
  const [driverName, setDriverName] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [isStamped, setIsStamped] = useState(false);
  const [shakeRoadmap, setShakeRoadmap] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driverName || !driverEmail) return;

    soundManager.playStampSlam();
    setIsStamped(true);
    setShakeRoadmap(true);
    
    setTimeout(() => {
      setShakeRoadmap(false);
      // Voice message confirmation from dispatch headquarters!
      soundManager.playRadioVoiceNoise(2.8);
    }, 600);
  };

  const milestones = [
    { control: 'PEREZ VELASCO', hito: 'Fase 1: Taller Clandestino', desc: 'Organización del sindicato de choferes rebeldes. Diseños conceptuales listos.', status: 'COMPLETADO', hour: '14:20' },
    { control: 'PEAJE AUTOPISTA', hito: 'Fase 2: Motor de Presión', desc: 'Integración de Web Audio rev y panel-transformation en prototipos Dodge.', status: 'COMPLETADO', hour: '15:10' },
    { control: 'LA PORTADA', hito: 'Fase 3: Pruebas de Ladera', desc: 'Físicas de escalada andina en pendientes extremas y saltos de adoquín.', status: 'COMPLETADO', hour: '16:05' },
    { control: 'CRUCE LA CEJA', hito: 'Fase 4: Operación Ch\'amak', desc: 'Lanzamiento de Beta Cerrada en el primer combate urbano abierto de La Paz.', status: 'PENDIENTE', hour: '--:--' },
  ];

  return (
    <section id="roadmap" style={styles.section} className="grunge-texture scene-transition">
      <div style={styles.lightingOverlay} />

      <div style={styles.header}>
        <span style={styles.label}>SECCIÓN 5 — HOJA DE RUTA Y REGISTRO</span>
        <h2 style={styles.title}>REGISTRO EN BITÁCORA DEL SINDICATO</h2>
        <p style={styles.desc}>
          Sella tu hoja de ruta general para enrolarte como Chofer de Resistencia contra el control corporativo en las calles paceñas.
        </p>
      </div>

      {/* DRIVER ROUTE SHEET CONTAINER */}
      <div style={{
        ...styles.sheetContainer,
        animation: shakeRoadmap ? 'shake-intense 0.1s infinite' : 'none',
      }}>
        {/* Physical cardboard route card */}
        <div style={styles.routeCard} className="oil-slick">
          
          {/* Circular Red Ink Stamp Overlay */}
          {isStamped && (
            <div style={styles.inkStampContainer}>
              <svg viewBox="0 0 160 160" style={styles.inkStampSvg}>
                <circle cx="80" cy="80" r="70" fill="none" stroke="#D94747" strokeWidth="4" strokeDasharray="18 4 6 4" opacity="0.85" />
                <circle cx="80" cy="80" r="62" fill="none" stroke="#D94747" strokeWidth="1.5" opacity="0.85" />
                
                <path id="stampPath" d="M 18,80 A 62,62 0 0,1 142,80" fill="none" />
                <text fill="#D94747" fontSize="10" fontWeight="bold" fontFamily="var(--font-hud)" letterSpacing="1">
                  <textPath href="#stampPath" startOffset="50%" textAnchor="middle">
                    SINDICATO UTAFORMERS
                  </textPath>
                </text>
                
                <path id="stampPathBottom" d="M 142,80 A 62,62 0 0,1 18,80" fill="none" />
                <text fill="#D94747" fontSize="9" fontWeight="bold" fontFamily="var(--font-hud)" letterSpacing="1.2">
                  <textPath href="#stampPathBottom" startOffset="50%" textAnchor="middle">
                    ★ CONTROLADO LA PAZ ★
                  </textPath>
                </text>

                <rect x="42" y="68" width="76" height="24" rx="2" fill="none" stroke="#D94747" strokeWidth="3" opacity="0.85" />
                <text x="80" y="84" fill="#D94747" fontFamily="var(--font-hud)" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="2">
                  AL FONDO V.
                </text>
              </svg>
            </div>
          )}

          {/* Card Header details */}
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleBlock}>
              <h3 style={styles.cardTitle}>HOJA DE RUTA GENERAL</h3>
              <span style={styles.cardSub}>SINDICATO DE TRANSPORTES UTAFORMERS - REGISTRO DE TRÁNSITO</span>
            </div>
            <div style={styles.cardNumber}>Nº 00420-B</div>
          </div>

          <div style={styles.cardInfoGrid}>
            <div><strong>SINDICATO:</strong> MICROS REBELDES UTAS</div>
            <div><strong>TERMINAL:</strong> PÉREZ VELASCO - CEJA EL ALTO</div>
            <div><strong>CENTRO DE PRESIÓN:</strong> COTAHUMA SUBTERRÁNEO</div>
            <div><strong>VEHÍCULO ADAPTADO:</strong> DODGE COLECTIVO D-300 (1978)</div>
          </div>

          {/* TABLE OF ROADMAP MILESTONES */}
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>PUNTO CONTROL</th>
                <th style={styles.th}>HITO / TAREA</th>
                <th style={styles.th}>DETALLE DEL PROGRESO</th>
                <th style={styles.th}>HORA REG.</th>
                <th style={styles.th}>SELLO DIGITAL</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((m, i) => {
                const isDone = m.status === 'COMPLETADO';
                return (
                  <tr key={i} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>{m.control}</td>
                    <td style={{ ...styles.td, color: '#44403c', fontWeight: 'bold' }}>{m.hito}</td>
                    <td style={styles.td}>{m.desc}</td>
                    <td style={{ ...styles.td, fontFamily: 'var(--font-hud)', fontSize: '11px' }}>{m.hour}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        color: isDone ? 'var(--neon-green)' : '#c46a2d',
                        borderColor: isDone ? 'var(--neon-green)' : '#c46a2d',
                        background: isDone ? 'rgba(27,154,46,0.06)' : 'rgba(196,106,45,0.06)',
                      }}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* SIGN UP FORM (INTEGRATED INTO ROADMAP SHEET) */}
          {!isStamped ? (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formHeader}>
                <span>ENROLAR ALFA-COMPAÑERO DEL SINDICATO:</span>
              </div>
              
              <div className="roadmap-form-row" style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.labelInput}>ALIAS DEL CHOFER (FIRMA DE RUTA):</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Ej. 'Severo El Rápido'"
                    style={styles.textInput}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.labelInput}>RADIO DE FRECUENCIA (CORREO ELECTRÓNICO):</label>
                  <input
                    type="email"
                    required
                    value={driverEmail}
                    onChange={(e) => setDriverEmail(e.target.value)}
                    onFocus={() => soundManager.playMicClick()}
                    placeholder="Ej. severo@microsrebeldes.bo"
                    style={styles.textInput}
                  />
                </div>
              </div>

              {/* Physical Rubber Stamp CTA Button */}
              <div style={styles.stampButtonContainer}>
                <button
                  type="submit"
                  className="shake-hover"
                  style={styles.stampButton}
                >
                  <div style={styles.stampIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 22h14M12 2v16M8 8l4-4 4 4" />
                    </svg>
                  </div>
                  <span>FIRMAR Y SELLAR SALIDA</span>
                </button>
              </div>
            </form>
          ) : (
            <div style={styles.successArea}>
              <div style={styles.successDot} />
              <div style={styles.successTextContainer}>
                <h4 style={styles.successTitle}>¡CONTROL TOTALMENTE REGISTRADO!</h4>
                <p style={styles.successDesc}>
                  Compañero Chofer <strong>{driverName}</strong>. Tu frecuencia radial (<strong>{driverEmail}</strong>) ha sido registrada exitosamente en las bitácoras del Sindicato de Micros Rebeldes. Se ha sellado tu salida del peaje. Pronto captarás señales de frecuencia encriptadas para la primera prueba de conducción alfa en pendientes. ¡Al fondo hay campo!
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to bottom, var(--bg-deep) 0%, var(--bg-dark) 50%, var(--bg-deep) 100%)',
    padding: '120px 40px',
    overflow: 'hidden',
    transition: 'background 0.45s ease',
  },
  lightingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at center, var(--neon-yellow-glow) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  header: {
    textAlign: 'center',
    maxWidth: '700px',
    marginBottom: '60px',
    zIndex: 5,
  },
  label: {
    fontFamily: 'var(--font-hud)',
    color: 'var(--neon-yellow)',
    fontSize: '11px',
    letterSpacing: '3px',
    fontWeight: 'bold',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '36px',
    fontWeight: '900',
    color: 'var(--text-primary)',
    marginTop: '10px',
  },
  desc: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginTop: '15px',
    lineHeight: '1.6',
  },
  sheetContainer: {
    width: '100%',
    maxWidth: '1000px',
    zIndex: 5,
    transition: 'transform 0.05s linear',
  },
  routeCard: {
    background: '#fcfbf7', // physical light card look
    border: '8px double #a8a29e',
    borderRadius: '4px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 0 40px rgba(120,113,108,0.1)',
    padding: '30px',
    position: 'relative',
    color: '#1c1917',
    fontFamily: 'var(--font-typewriter)',
    overflow: 'hidden',
  },
  inkStampContainer: {
    position: 'absolute',
    top: '12%',
    right: '8%',
    width: '160px',
    height: '160px',
    transform: 'rotate(-18deg)',
    zIndex: 100,
    pointerEvents: 'none',
  },
  inkStampSvg: {
    width: '100%',
    height: 'auto',
    display: 'block',
    filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.15))',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '3px double #78716c',
    paddingBottom: '16px',
    marginBottom: '20px',
  },
  cardTitleBlock: {
    textAlign: 'left',
  },
  cardTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: '900',
    fontSize: '24px',
    letterSpacing: '1px',
    lineHeight: 1.1,
  },
  cardSub: {
    fontFamily: 'var(--font-hud)',
    fontSize: '10px',
    color: '#78716c',
    letterSpacing: '1px',
    marginTop: '4px',
    display: 'block',
  },
  cardNumber: {
    fontFamily: 'var(--font-hud)',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#D94747',
    border: '2px solid #D94747',
    padding: '4px 12px',
    borderRadius: '4px',
    transform: 'rotate(2deg)',
  },
  cardInfoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px 20px',
    textAlign: 'left',
    fontSize: '11px',
    borderBottom: '1px solid #d6d3d1',
    paddingBottom: '16px',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '30px',
  },
  thRow: {
    borderBottom: '2px solid #78716c',
  },
  th: {
    padding: '10px 8px',
    fontSize: '11px',
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#44403c',
  },
  tr: {
    borderBottom: '1px solid #d6d3d1',
  },
  td: {
    padding: '12px 8px',
    fontSize: '11px',
    textAlign: 'left',
    lineHeight: '1.4',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: 'bold',
    fontFamily: 'var(--font-hud)',
    letterSpacing: '1px',
    border: '1.5px solid',
  },
  form: {
    borderTop: '3px double #78716c',
    paddingTop: '20px',
    textAlign: 'left',
  },
  formHeader: {
    fontFamily: 'var(--font-hud)',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#44403c',
    letterSpacing: '1px',
    marginBottom: '16px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  labelInput: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#44403c',
  },
  textInput: {
    background: 'none',
    border: 'none',
    borderBottom: '2px dashed #78716c',
    padding: '6px 0',
    fontFamily: 'var(--font-typewriter)',
    fontSize: '13px',
    color: '#292524',
    outline: 'none',
    transition: 'all 0.2s ease',
    ':focus': {
      borderBottomColor: '#D94747',
    },
  },
  stampButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
  },
  stampButton: {
    background: '#D94747',
    color: '#fcfbf7',
    border: '3px solid #7f1d1d',
    borderRadius: '4px',
    padding: '12px 28px',
    fontFamily: 'var(--font-mecha)',
    fontWeight: '800',
    fontSize: '14px',
    letterSpacing: '1.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  stampIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  successArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(27, 154, 46, 0.06)',
    border: '2px solid #1b9a2e',
    borderRadius: '6px',
    padding: '18px 24px',
    textAlign: 'left',
    marginTop: '20px',
  },
  successDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#1b9a2e',
    boxShadow: '0 0 10px rgba(27,154,46,0.5)',
    flexShrink: 0,
  },
  successTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  successTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#1b9a2e',
    fontFamily: 'var(--font-hud)',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  successDesc: {
    fontSize: '11px',
    color: '#44403c',
    lineHeight: '1.5',
  },
};

export default Roadmap;
