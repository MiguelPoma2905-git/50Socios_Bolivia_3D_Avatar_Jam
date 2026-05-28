import { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';

const UnderTheHood = () => {
  const [gear, setGear] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Trigger scanning laser line sweep interval
  useEffect(() => {
    if (!isScanning) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      if (progress <= 100) {
        setScanProgress(progress);
      } else {
        setIsScanning(false);
        clearInterval(interval);
        soundManager.playMorseTick(0.08);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [isScanning]);

  // Always run an infinite background scan for gear 1 (Hologram)
  const [infiniteScan, setInfiniteScan] = useState(0);
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1.5;
      if (progress > 100) progress = -10;
      setInfiniteScan(progress);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleGearShift = (notch) => {
    if (notch === gear) return;
    soundManager.playTapeClick();
    soundManager.playMetalClank(0.4);
    setGear(notch);
    setIsScanning(true);
    setScanProgress(0);
    soundManager.playSliderTick(notch);
    soundManager.playRadioStatic(0.3);
  };

  const getGearLabel = () => {
    switch (gear) {
      case 1: return '1ª MARCHA: HOLOGRAMA (RAYOS X)';
      case 2: return '2ª MARCHA: PERFIL DEL MICROTRON';
      case 3: return '3ª MARCHA: ESTADO DEL CHASIS';
      case 4: return '4ª MARCHA: REPUTACIÓN SINDICAL';
      default: return '';
    }
  };

  return (
    <section id="proceso" style={styles.section} className="grunge-texture scene-transition">
      <div style={styles.lightingOverlay} />

      <div className="uth-content-grid" style={styles.contentGrid}>
        
        {/* LEFT COLUMN: MECHA STAGE MONITOR */}
        <div style={styles.monitorContainer} className="metal-panel">
          <div style={styles.monitorBezel} className="warning-stripes" />
          
          <div style={styles.screenInner}>
            <div style={styles.scanlines} />

            {/* Sweep Laser Line on Gear Change */}
            {isScanning && (
              <div style={{
                ...styles.laserLine,
                left: `${scanProgress}%`,
              }} />
            )}

            {/* Infinite Laser Line on Hologram Gear */}
            {gear === 1 && !isScanning && (
              <div style={{
                ...styles.laserLine,
                left: `${infiniteScan}%`,
                opacity: 0.5,
              }} />
            )}

            <div style={styles.hudOverlay}>
              <div style={styles.hudHeader}>
                <span className="neon-text-blue">TELEMETRÍA: UTAFORMERS_3D v0.98</span>
                <span style={{ marginLeft: 'auto' }}>GEAR: {gear}</span>
              </div>
              <div style={styles.hudFooter}>
                <span>BITÁCORA TALLER: ACTIVA</span>
                <span>SCAN: {isScanning ? 'EN PROCESO...' : 'COMPLETO'}</span>
              </div>
            </div>

            {/* LAYER 1: HOLOGRAMA */}
            <div style={{
              ...styles.layerContent,
              opacity: gear === 1 ? 1 : 0,
              background: '#020617',
              color: 'var(--neon-blue)',
              pointerEvents: gear === 1 ? 'auto' : 'none',
              padding: '20px',
            }}>
              <div style={{...styles.stageTitleHud, zIndex: 5}} className="neon-text-blue">HOLOGRAMA DE CARCASA</div>
              
              <img 
                src="/holograma_microtron.jpg" 
                alt="Microtron Holograma"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 10px var(--neon-blue-glow))',
                  position: 'relative',
                  zIndex: 2,
                }} 
              />
            </div>

            {/* LAYER 2: PERFIL */}
            <div style={{
              ...styles.layerContent,
              opacity: gear === 2 ? 1 : 0,
              background: '#040714',
              pointerEvents: gear === 2 ? 'auto' : 'none',
              padding: '60px 40px',
            }}>
              <div style={styles.dataRow}>
                <span style={styles.dataLabel}>NOMBRE SINDICAL:</span>
                <span style={styles.dataValue} className="neon-text-chicha">CHASIS-17 “EL VOLADOR”</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.dataLabel}>LÍNEA ORIGINAL:</span>
                <span style={styles.dataValue}>CEJA → PÉREZ → VILLA FÁTIMA</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.dataLabel}>TRANSFORMACIÓN:</span>
                <span style={styles.dataValue} className="neon-text-red">CLANDESTINA / TALLER NO REGISTRADO</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.dataLabel}>KILOMETRAJE:</span>
                <span style={styles.dataValue}>“MEJOR NO PREGUNTAR”</span>
              </div>
            </div>

            {/* LAYER 3: ESTADO DEL CHASIS */}
            <div style={{
              ...styles.layerContent,
              opacity: gear === 3 ? 1 : 0,
              background: '#0a0a0f',
              pointerEvents: gear === 3 ? 'auto' : 'none',
              padding: '40px',
              justifyContent: 'flex-start',
            }}>
              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <div style={styles.statNum}>12</div>
                  <div style={styles.statDesc}>CHOQUES SOBREVIVIDOS</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statNum}>5</div>
                  <div style={styles.statDesc}>VECES REPINTADO</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statNum}>47</div>
                  <div style={styles.statDesc}>STICKERS ACUMULADOS</div>
                </div>
              </div>

              <div style={styles.statusList}>
                <div style={styles.statusItem}><span style={{color: 'var(--text-secondary)'}}>EMBRAGUE:</span> <span style={{fontFamily: 'var(--font-mecha)', fontSize: '13px', color: 'var(--neon-yellow)'}}>LLORANDO</span></div>
                <div style={styles.statusItem}><span style={{color: 'var(--text-secondary)'}}>NEUMÁTICOS:</span> <span style={{fontFamily: 'var(--font-mecha)', fontSize: '13px', color: 'var(--neon-red)'}}>LISOS COMO MESA</span></div>
                <div style={styles.statusItem}><span style={{color: 'var(--text-secondary)'}}>COMBUSTIBLE:</span> <span style={{fontFamily: 'var(--font-mecha)', fontSize: '13px'}}>PREMIUM (SI HAY PLATA)</span></div>
                <div style={styles.statusItem}><span style={{color: 'var(--text-secondary)'}}>HUMO NEGRO:</span> <span style={{fontFamily: 'var(--font-mecha)', fontSize: '13px', color: 'var(--neon-red)'}}>PREOCUPANTE</span></div>
                <div style={styles.statusItem}><span style={{color: 'var(--text-secondary)'}}>SUSPENSIÓN:</span> <span style={{fontFamily: 'var(--font-mecha)', fontSize: '13px'}}>BENDECIDA POR DIOSITO</span></div>
                <div style={styles.statusItem}><span style={{color: 'var(--text-secondary)'}}>BOCINA:</span> <span style={{fontFamily: 'var(--font-mecha)', fontSize: '13px'}}>PARA HACER RENEGAR</span></div>
                <div style={styles.statusItem}><span style={{color: 'var(--text-secondary)'}}>SOAT:</span> <span style={{fontFamily: 'var(--font-mecha)', fontSize: '13px', color: 'var(--neon-green)'}}>MISTERIOSAMENTE VIGENTE</span></div>
              </div>
            </div>

            {/* LAYER 4: REPUTACIÓN */}
            <div style={{
              ...styles.layerContent,
              opacity: gear === 4 ? 1 : 0,
              background: '#0d0404',
              pointerEvents: gear === 4 ? 'auto' : 'none',
              padding: '50px 40px',
              justifyContent: 'center',
            }}>
              <div style={styles.repContainer}>
                <div style={styles.repRow}>
                  <span style={styles.repLabel}>RESPETO SINDICAL:</span>
                  <span style={styles.repStars}>★★★★☆</span>
                </div>
                <div style={styles.repRow}>
                  <span style={styles.repLabel}>CARRERA ILEGAL PROB.:</span>
                  <span style={styles.repValue} className="neon-text-red">89%</span>
                </div>
                <div style={styles.repRow}>
                  <span style={styles.repLabel}>ENEMISTAD PUMAKATARI:</span>
                  <span style={styles.repDanger}>ALTA (NIVEL ROJO)</span>
                </div>
                <div style={styles.repRow}>
                  <span style={styles.repLabel}>NIVEL EGO IA:</span>
                  <span style={styles.repDanger}>EXCESIVO</span>
                </div>
              </div>
              
              <div style={styles.quotesContainer}>
                <div style={styles.repQuote}>"Adelanta hasta en curva" <span style={styles.quoteAuthor}>- Fama en autopista</span></div>
                <div style={styles.repQuote}>"El Come Pendientes" <span style={styles.quoteAuthor}>- Apodo en taller</span></div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: INDUSTRIAL GEAR SHIFT CONTROLLER */}
        <div style={styles.controllerCard} className="metal-panel">
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>PANEL DE CONTROL METÁLICO</span>
            <h3 style={styles.cardTitle}>ARCHIVO SINDICAL CONFIDENCIAL</h3>
            <p style={styles.cardDesc}>
              Acciona la palanca de cambios del microbus para revisar el historial y estado técnico del Microtron.
            </p>
          </div>

          {/* ACTIVE STATE DISPLAY TERMINAL */}
          <div style={styles.stateTerminal}>
            <div style={styles.termHeader}>
              <div style={styles.termDot} />
              <span>CAJA DE CAMBIOS REBELDE</span>
            </div>
            <div style={styles.termLabel} className={gear === 4 ? 'neon-text-red' : 'neon-text-blue'}>
              {getGearLabel()}
            </div>
          </div>

          {/* INTERACTIVE GEAR LEVER SLOT GATE */}
          <div style={styles.leverBay}>
            <div style={styles.leverGatePlate}>
              <div style={styles.leverTrack} />
              
              <div style={styles.notchesList}>
                {[1, 2, 3, 4].map((notch) => {
                  const isActive = gear === notch;
                  return (
                    <button
                      key={notch}
                      onClick={() => handleGearShift(notch)}
                      style={{
                        ...styles.notchButton,
                        color: isActive ? 'var(--neon-yellow)' : 'var(--text-secondary)',
                        borderColor: isActive ? 'var(--neon-yellow)' : 'var(--border-metal)',
                        boxShadow: isActive ? '0 0 10px var(--neon-yellow-glow)' : 'none',
                        background: isActive ? '#1c1917' : 'var(--bg-deep)',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-hud)', fontSize: '10px' }}>{notch}ª</span>
                      <span style={{ fontFamily: 'var(--font-mecha)', fontSize: '7px', marginTop: '1px' }}>
                        {notch === 1 ? 'HOLOGRAMA' : notch === 2 ? 'PERFIL' : notch === 3 ? 'CHASIS' : 'FAMA'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Physical Lever Stick */}
              <div style={{
                ...styles.leverStick,
                left: `${15 + (gear - 1) * 23.3}%`,
              }}>
                <div style={styles.leverShaft} />
                <div 
                  onClick={() => handleGearShift(gear === 4 ? 1 : gear + 1)}
                  style={styles.leverKnob} 
                  className="warning-stripes shake-hover" 
                />
              </div>
            </div>
          </div>
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
    background: 'radial-gradient(ellipse at 30% 30%, var(--neon-chicha-glow) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '40px',
    maxWidth: '1200px',
    width: '100%',
    alignItems: 'center',
    zIndex: 5,
  },
  monitorContainer: {
    width: '100%',
    height: '520px',
    border: '3px solid var(--border-metal)',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    background: '#020306',
  },
  monitorBezel: {
    height: '14px',
    width: '100%',
    borderBottom: '1px solid var(--border-metal)',
    opacity: 0.8,
  },
  screenInner: {
    position: 'relative',
    height: 'calc(100% - 14px)',
    width: '100%',
    overflow: 'hidden',
  },
  scanlines: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%)',
    backgroundSize: '100% 4px',
    pointerEvents: 'none',
    zIndex: 10,
    opacity: 0.2,
  },
  laserLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '3px',
    backgroundColor: 'var(--neon-green)',
    boxShadow: '0 0 15px var(--neon-green), 0 0 5px var(--neon-green-glow)',
    zIndex: 8,
    transition: 'left 0.05s linear',
  },
  hudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: '12px 16px',
    pointerEvents: 'none',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textShadow: '0 0 3px rgba(0,0,0,0.8)',
  },
  layerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageTitlePaper: {
    position: 'absolute',
    top: '35px',
    left: '20px',
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    fontWeight: 'bold',
    border: '1px solid var(--border-metal)',
    padding: '3px 8px',
    borderRadius: '2px',
    color: 'var(--text-primary)',
  },
  stageTitleHud: {
    position: 'absolute',
    top: '35px',
    left: '20px',
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    fontWeight: 'bold',
    border: '1px solid var(--neon-blue)',
    padding: '3px 8px',
    borderRadius: '2px',
  },
  stageTitleTextured: {
    position: 'absolute',
    top: '35px',
    left: '20px',
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#e4e4e7',
    border: '1px solid #52525b',
    padding: '3px 8px',
    borderRadius: '2px',
  },
  stageTitleRender: {
    position: 'absolute',
    top: '35px',
    left: '20px',
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    fontWeight: 'bold',
    border: '1px solid var(--neon-red)',
    padding: '3px 8px',
    borderRadius: '2px',
  },
  mechaSvg: {
    width: '80%',
    height: 'auto',
    maxHeight: '260px',
  },
  controllerCard: {
    padding: '30px',
    textAlign: 'left',
  },
  cardHeader: {
    marginBottom: '20px',
  },
  cardLabel: {
    fontFamily: 'var(--font-hud)',
    color: 'var(--neon-chicha)',
    fontSize: '10px',
    letterSpacing: '2.5px',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '24px',
    fontWeight: '900',
    marginTop: '6px',
    color: 'var(--text-primary)',
  },
  cardDesc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginTop: '10px',
  },
  stateTerminal: {
    background: '#040508',
    border: '1px solid var(--border-metal)',
    borderRadius: '4px',
    padding: '12px 16px',
    marginBottom: '30px',
  },
  termHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: '#a1a1aa',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  termDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: 'var(--neon-yellow)',
    boxShadow: '0 0 5px var(--neon-yellow)',
  },
  termLabel: {
    fontFamily: 'var(--font-mecha)',
    fontWeight: '800',
    fontSize: '14px',
    letterSpacing: '1px',
    transition: 'all 0.2s ease',
  },
  leverBay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '160px',
    background: 'rgba(5, 5, 8, 0.4)',
    border: '1px dashed var(--border-metal)',
    borderRadius: '6px',
    position: 'relative',
  },
  leverGatePlate: {
    width: '90%',
    height: '90px',
    background: '#12131a',
    border: '3px solid #27272a',
    borderRadius: '12px',
    position: 'relative',
    boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.5)',
  },
  leverTrack: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    right: '5%',
    height: '12px',
    background: '#07070a',
    borderRadius: '6px',
    transform: 'translateY(-50%)',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9)',
  },
  notchesList: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    padding: '0 8%',
    zIndex: 10,
    position: 'relative',
  },
  notchButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    borderRadius: '6px',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  leverStick: {
    position: 'absolute',
    top: '-32px',
    width: '48px',
    height: '110px',
    pointerEvents: 'none',
    zIndex: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  leverShaft: {
    width: '6px',
    height: '75px',
    background: 'linear-gradient(90deg, #9ca3af 0%, #374151 50%, #1f2937 100%)',
    borderRadius: '3px',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.4)',
  },
  leverKnob: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '3px solid #1e293b',
    boxShadow: '0 4px 8px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.2)',
    pointerEvents: 'auto',
    cursor: 'grab',
    marginTop: '-85px',
  },
  dataRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  dataLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  dataValue: {
    fontFamily: 'var(--font-mecha)',
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontWeight: '800',
    textAlign: 'right',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  statsGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    gap: '15px',
    marginBottom: '25px',
  },
  statBox: {
    flex: 1,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-metal)',
    padding: '15px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '4px',
  },
  statNum: {
    fontFamily: 'var(--font-mecha)',
    fontSize: '28px',
    color: 'var(--neon-blue)',
    textShadow: '0 0 10px var(--neon-blue-glow)',
    fontWeight: '800',
  },
  statDesc: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textAlign: 'center',
    marginTop: '5px',
    textTransform: 'uppercase',
  },
  statusList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'rgba(0,0,0,0.3)',
    padding: '8px 12px',
    borderRadius: '2px',
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    letterSpacing: '1px',
    borderLeft: '2px solid var(--border-metal)',
    textTransform: 'uppercase',
  },
  repContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px',
  },
  repRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px dashed rgba(255,0,0,0.2)',
  },
  repLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  repStars: {
    color: 'var(--neon-yellow)',
    fontSize: '18px',
    letterSpacing: '2px',
    textShadow: '0 0 8px var(--neon-yellow)',
  },
  repValue: {
    fontFamily: 'var(--font-mecha)',
    fontSize: '14px',
    fontWeight: '800',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  repDanger: {
    fontFamily: 'var(--font-mecha)',
    fontSize: '14px',
    color: 'var(--neon-red)',
    fontWeight: '800',
    textShadow: '0 0 10px var(--neon-red-glow)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  quotesContainer: {
    width: '100%',
    borderLeft: '3px solid var(--neon-chicha)',
    paddingLeft: '15px',
  },
  repQuote: {
    fontFamily: 'var(--font-mecha)',
    fontSize: '13px',
    fontStyle: 'italic',
    color: 'var(--text-primary)',
    marginBottom: '10px',
    letterSpacing: '0.5px',
  },
  quoteAuthor: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
    fontStyle: 'normal',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  }
};

export default UnderTheHood;
