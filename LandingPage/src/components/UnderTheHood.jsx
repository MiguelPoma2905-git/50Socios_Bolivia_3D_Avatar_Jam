import { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';

const UnderTheHood = () => {
  const [gear, setGear] = useState(4); // 1: Sketch, 2: Wireframe, 3: Texture, 4: Render
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Trigger scanning laser line sweep interval when isScanning is active
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
      case 1: return '1ª MARCHA: EL BOCETO (LÁPIZ)';
      case 2: return '2ª MARCHA: EL HOLOGRAMA (WIREFRAME)';
      case 3: return '3ª MARCHA: EL CHASIS (METAL Y GRASA)';
      case 4: return '4ª MARCHA: OPERACIÓN COMBATE PACEÑO';
      default: return '';
    }
  };

  return (
    <section id="proceso" style={styles.section} className="grunge-texture scene-transition">
      <div style={styles.lightingOverlay} />

      <div className="uth-content-grid" style={styles.contentGrid}>
        
        {/* LEFT COLUMN: MECHA STAGE MONITOR */}
        <div style={styles.monitorContainer} className="metal-panel">
          {/* Warning stripes bezel */}
          <div style={styles.monitorBezel} className="warning-stripes" />
          
          <div style={styles.screenInner}>
            <div style={styles.scanlines} />

            {/* Scanning Laser Line */}
            {isScanning && (
              <div style={{
                ...styles.laserLine,
                left: `${scanProgress}%`,
              }} />
            )}

            {/* Holographic Diagnostic HUD Details */}
            <div style={styles.hudOverlay}>
              <div style={styles.hudHeader}>
                <span className="neon-text-blue">TELEMETRÍA: UTAFORMERS_3D v0.98</span>
                <span style={{ marginLeft: 'auto' }}>RPM: {gear}200 G/M</span>
              </div>
              <div style={styles.hudFooter}>
                <span>BITÁCORA TALLER: ACTIVA</span>
                <span>SCAN: {isScanning ? 'EN PROCESO...' : 'COMPLETO'}</span>
              </div>
            </div>

            {/* DRAWING VIEWER LAYERS */}
            {/* LAYER 1: BOCETO (Gear 1) */}
            <div style={{
              ...styles.layerContent,
              opacity: gear === 1 ? 1 : 0,
              background: 'var(--bg-deep)',
              color: 'var(--text-primary)',
            }}>
              {/* Grid backdrop */}
              <div style={styles.paperGrid} />
              <div style={styles.stageTitlePaper}>DISEÑO CONCEPTUAL</div>
              
              {/* Concept Sketch Vector drawing */}
              <svg viewBox="0 0 500 300" style={styles.mechaSvg}>
                <g stroke="var(--text-primary)" strokeWidth="1" fill="none" opacity="0.6">
                  {/* Grid layout guide lines */}
                  <circle cx="250" cy="150" r="110" stroke="var(--border-metal)" strokeWidth="0.5" strokeDasharray="3 3" />
                  <rect x="130" y="40" width="240" height="220" stroke="var(--border-metal)" strokeWidth="0.5" strokeDasharray="5 5" />
                  
                  {/* Heavy Mecha Outline */}
                  <path d="M 140,150 L 250,90 L 360,150 L 340,240 L 160,240 Z" strokeWidth="1.5" />
                  <circle cx="180" cy="180" r="14" />
                  <circle cx="320" cy="180" r="14" />
                  <rect x="200" y="105" width="100" height="20" />
                  <path d="M 210,115 H 290" />
                  
                  <path d="M 170,240 L 140,285 L 170,290" strokeWidth="2" />
                  <path d="M 330,240 L 360,285 L 330,290" strokeWidth="2" />
                  
                  <text x="140" y="60" fontFamily="var(--font-hud)" fontSize="9" fill="var(--text-secondary)">Fig 1. Chasis Dodge D-300</text>
                  <text x="300" y="270" fontFamily="var(--font-hud)" fontSize="9" fill="var(--text-secondary)">Soporte: Adoquín Hidráulico</text>
                </g>
              </svg>
            </div>

            {/* LAYER 2: WIREFRAME (Gear 2) */}
            <div style={{
              ...styles.layerContent,
              opacity: gear === 2 ? 1 : 0,
              background: '#020617', // holographic blue remains dark for neon glow fidelity
              color: 'var(--neon-blue)',
            }}>
              <div style={styles.stageTitleHud} className="neon-text-blue">HOLOGRAPHIC MESH VIEW</div>
              
              <svg viewBox="0 0 500 300" style={styles.mechaSvg}>
                <g stroke="var(--neon-blue)" strokeWidth="0.8" fill="none" opacity="0.9" filter="drop-shadow(0 0 4px var(--neon-blue-glow))">
                  <polygon points="250,60 140,120 180,240 250,220" />
                  <polygon points="250,60 360,120 320,240 250,220" />
                  <polygon points="140,120 360,120 320,240 180,240" />
                  <line x1="250" y1="60" x2="250" y2="220" />
                  <line x1="140" y1="120" x2="250" y2="220" />
                  <line x1="360" y1="120" x2="250" y2="220" />
                  <line x1="180" y1="240" x2="250" y2="220" />
                  <line x1="320" y1="240" x2="250" y2="220" />
                  
                  <circle cx="250" cy="60" r="3.5" fill="var(--neon-blue)" />
                  <circle cx="140" cy="120" r="3.5" fill="var(--neon-blue)" />
                  <circle cx="360" cy="120" r="3.5" fill="var(--neon-blue)" />
                  <circle cx="180" cy="240" r="3.5" fill="var(--neon-blue)" />
                  <circle cx="320" cy="240" r="3.5" fill="var(--neon-blue)" />
                  <circle cx="250" cy="220" r="3.5" fill="var(--neon-blue)" />

                  <circle cx="250" cy="140" r="45" strokeDasharray="3 3" />
                  <circle cx="250" cy="140" r="60" strokeWidth="0.4" />
                </g>
              </svg>
            </div>

            {/* LAYER 3: METAL TEXTURE (Gear 3) */}
            <div style={{
              ...styles.layerContent,
              opacity: gear === 3 ? 1 : 0,
              background: '#1c1917',
              color: '#d4d4d8',
            }}>
              <div style={styles.stageTitleTextured}>METAL DURO & RUSTIC DUST</div>
              
              <svg viewBox="0 0 500 300" style={styles.mechaSvg}>
                <g fill="#3f3f46" stroke="#71717a" strokeWidth="2">
                  <path d="M 130,130 L 250,70 L 370,130 L 330,230 L 170,230 Z" />
                  <path d="M 150,150 L 250,110 L 350,150 L 310,220 L 190,220 Z" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
                  
                  <circle cx="160" cy="160" r="2.5" fill="#18181b" />
                  <circle cx="340" cy="160" r="2.5" fill="#18181b" />
                  <circle cx="200" cy="210" r="2.5" fill="#18181b" />
                  <circle cx="300" cy="210" r="2.5" fill="#18181b" />

                  <path d="M 245,122 C 245,150 255,160 253,190" fill="none" stroke="#09090b" strokeWidth="4" opacity="0.65" />
                </g>
              </svg>
            </div>

            {/* LAYER 4: FULL ACTION RENDER (Gear 4) */}
            <div style={{
              ...styles.layerContent,
              opacity: gear === 4 ? 1 : 0,
              background: 'radial-gradient(circle at center, var(--bg-dark) 0%, var(--bg-deep) 100%)',
            }}>
              <div style={styles.stageTitleRender} className="neon-text-red">OPERATIVO EN COMBATE</div>
              
              <svg viewBox="0 0 500 300" style={styles.mechaSvg}>
                <ellipse cx="250" cy="265" rx="140" ry="12" fill="var(--neon-blue-glow)" filter="blur(5px)" />

                <g stroke="#27272a" strokeWidth="2">
                  {/* Colectivo Red Paint */}
                  <path d="M 130,130 L 250,70 L 370,130 L 330,230 L 170,230 Z" fill="#D94747" />
                  {/* Andean Chicha Deco (Electric green/magenta highlights) */}
                  <path d="M 138,155 L 250,115 L 362,155 L 340,195 L 160,195 Z" fill="var(--neon-chicha)" stroke="var(--neon-chicha)" strokeWidth="1.5" />
                  <path d="M 148,175 L 250,140 L 352,175 L 340,195 L 160,195 Z" fill="#F4B400" />

                  {/* Windshield */}
                  <rect x="200" y="80" width="100" height="20" fill="#090a0f" stroke="#F4B400" strokeWidth="1.5" />
                  <text x="250" y="93" fill="#F4B400" fontFamily="var(--font-hud)" fontSize="9" fontWeight="bold" textAnchor="middle">
                    PÉREZ - AUTOPISTA
                  </text>

                  {/* Headlights */}
                  <circle cx="170" cy="210" r="10" fill="#F4B400" stroke="#f4f4f5" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 10px var(--neon-yellow))' }} />
                  <circle cx="330" cy="210" r="10" fill="#F4B400" stroke="#f4f4f5" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 10px var(--neon-yellow))' }} />

                  {/* Pressure generator core */}
                  <rect x="235" y="210" width="30" height="35" rx="3" fill="#064e3b" stroke="var(--neon-green)" strokeWidth="1.5" />
                  <circle cx="250" cy="227" r="6" fill="var(--neon-green)" style={{ filter: 'drop-shadow(0 0 8px var(--neon-green))' }} />

                  {/* Cyber Legs */}
                  <path d="M 160,230 L 140,280 L 175,285" fill="#3f3f46" strokeWidth="2" />
                  <path d="M 340,230 L 360,280 L 325,285" fill="#3f3f46" strokeWidth="2" />
                </g>
              </svg>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: INDUSTRIAL GEAR SHIFT CONTROLLER */}
        <div style={styles.controllerCard} className="metal-panel">
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>PANEL DE CONTROL METÁLICO</span>
            <h3 style={styles.cardTitle}>ETAPAS DE INGENIERÍA</h3>
            <p style={styles.cardDesc}>
              Acciona la palanca de cambios del microbus para desplazar los renders de desarrollo. Siente la compresión neumática en cada slot.
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
                      <span style={{ fontFamily: 'var(--font-mecha)', fontSize: '8px', marginTop: '1px' }}>
                        {notch === 1 ? 'BOCETO' : notch === 2 ? 'WIRE' : notch === 3 ? 'METAL' : 'RENDER'}
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
    height: '420px',
    border: '3px solid var(--border-metal)',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    background: '#020306',
    transition: 'border-color 0.45s ease',
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
    zIndex: 7,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  hudHeader: {
    display: 'flex',
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    letterSpacing: '1px',
    textShadow: '0 0 3px rgba(0,0,0,0.8)',
    color: 'var(--text-primary)',
  },
  hudFooter: {
    display: 'flex',
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
    transition: 'opacity 0.4s ease-in-out',
  },
  paperGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(var(--border-metal) 1px, transparent 0), linear-gradient(90deg, var(--border-metal) 1px, transparent 0)',
    backgroundSize: '15px 15px',
    pointerEvents: 'none',
    opacity: 0.15,
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
};

export default UnderTheHood;
