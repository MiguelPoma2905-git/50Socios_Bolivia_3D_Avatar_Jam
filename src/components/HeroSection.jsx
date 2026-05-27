import React, { useState, useEffect, useRef } from 'react';
import soundManager from '../utils/soundManager';

const HeroSection = ({ isSoundMuted }) => {
  const [pedalPressed, setPedalPressed] = useState(false);
  const [revVal, setRevVal] = useState(0); // 0 to 1
  const [transformed, setTransformed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const particleCanvasRef = useRef(null);
  const requestRef = useRef(null);
  const particles = useRef([]);
  const sparks = useRef([]);
  
  // Parallax tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Core sound and engine rev state loop
  useEffect(() => {
    let interval;
    if (pedalPressed) {
      soundManager.startEngine();
      let currentRev = 0;
      
      interval = setInterval(() => {
        currentRev = Math.min(currentRev + 0.08, 1);
        setRevVal(currentRev);
        soundManager.revEngine(currentRev);

        // If rev reaches 0.95, trigger a full partial mecha state!
        if (currentRev >= 0.95) {
          setTransformed(true);
        }
      }, 50);
    } else {
      if (revVal > 0) {
        soundManager.stopEngine(transformed);
      }
      
      let currentRev = revVal;
      interval = setInterval(() => {
        currentRev = Math.max(currentRev - 0.12, 0);
        setRevVal(currentRev);
        if (currentRev === 0) {
          clearInterval(interval);
          setTransformed(false);
        }
      }, 50);
    }

    return () => {
      clearInterval(interval);
    };
  }, [pedalPressed]);

  // Exhaust Smoke & Wheel Sparks Canvas particle loop
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Exhaust position (bottom right of the microbus graphic)
      const busBaseX = canvas.width / 2 + 50;
      const busBaseY = canvas.height / 2 + 100;

      // 1. Emit dark exhaust smoke when accelerating
      if (pedalPressed && revVal > 0.15) {
        // Create smoke particles
        const numSmoke = Math.ceil(revVal * 3);
        for (let i = 0; i < numSmoke; i++) {
          particles.current.push({
            x: busBaseX + 60,
            y: busBaseY + 30,
            vx: 1.5 + Math.random() * 3 + revVal * 2,
            vy: -0.5 - Math.random() * 2,
            size: 5 + Math.random() * 12,
            opacity: 0.8 * revVal,
            growth: 0.6 + Math.random() * 0.8,
            color: Math.random() > 0.4 ? 'rgba(30, 30, 35, ' : 'rgba(70, 60, 60, ',
          });
        }

        // Create sparks from wheels
        if (Math.random() < revVal * 0.8) {
          const numSparks = Math.ceil(revVal * 4);
          for (let i = 0; i < numSparks; i++) {
            sparks.current.push({
              x: busBaseX - 100 + Math.random() * 160, // underwheels area
              y: busBaseY + 45,
              vx: (Math.random() - 0.5) * 6,
              vy: -2 - Math.random() * 5,
              size: 1.5 + Math.random() * 2,
              life: 1.0,
              decay: 0.04 + Math.random() * 0.05,
              color: Math.random() > 0.5 ? '#ff4e00' : '#ffea00',
            });
          }
        }
      }

      // 2. Draw and update smoke
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity.toFixed(2)})`;
        ctx.fill();

        // Update smoke physics
        p.x += p.vx;
        p.y += p.vy;
        p.size += p.growth;
        p.opacity -= 0.015;

        if (p.opacity <= 0 || p.size > 80) {
          particles.current.splice(i, 1);
        }
      }

      // 3. Draw and update sparks
      for (let i = sparks.current.length - 1; i >= 0; i--) {
        const s = sparks.current[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Update spark physics
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.2; // gravity
        s.life -= s.decay;

        if (s.life <= 0) {
          sparks.current.splice(i, 1);
        }
      }

      requestRef.current = requestAnimationFrame(updateParticles);
    };

    updateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(requestRef.current);
    };
  }, [pedalPressed, revVal]);

  const handlePedalDown = () => {
    setPedalPressed(true);
  };

  const handlePedalUp = () => {
    setPedalPressed(false);
  };

  // Heavy shaking values based on acceleration
  const getShakeStyle = () => {
    if (revVal === 0) return {};
    const amp = revVal * 15;
    const rx = (Math.random() - 0.5) * amp;
    const ry = (Math.random() - 0.5) * amp;
    const rot = (Math.random() - 0.5) * (revVal * 2);
    return {
      transform: `translate3d(${rx}px, ${ry}px, 0px) rotate(${rot}deg)`,
      filter: revVal > 0.65 ? `blur(${revVal * 0.8}px)` : 'none',
      transition: 'transform 0.02s linear',
    };
  };

  return (
    <section id="inicio" style={styles.section} className="grunge-texture scene-transition">
      {/* Background vignette & Neon spotlight */}
      <div style={styles.vignette} />
      
      {/* Clandestine Neon Street Lamp */}
      <div style={styles.streetLampContainer}>
        <div style={{
          ...styles.lampBulb,
          animation: pedalPressed ? 'shake-intense 0.08s infinite' : 'none',
          backgroundColor: revVal > 0.8 ? 'var(--neon-green)' : 'var(--neon-yellow)',
          boxShadow: revVal > 0.8 ? '0 0 40px var(--neon-green)' : '0 0 25px var(--neon-yellow-glow)',
        }} className="neon-flicker-anim" />
        <div style={styles.lightBeam} />
      </div>

      {/* Main Content Layout */}
      <div style={{ ...styles.contentContainer, ...getShakeStyle() }}>
        {/* Cinematic Parallax Title */}
        <div style={{
          ...styles.titleGroup,
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
        }}>
          <span style={styles.subtitle}>VIDEOJUEGO INDIE EN DESARROLLO</span>
          
          <h1 style={styles.gameTitle} className="neon-text-red">
            UTAFORMERS
          </h1>
          
          <div style={styles.titleDivider}>
            <div style={styles.warningStrip} className="warning-stripes" />
            <span style={styles.titleBadge}>AL FONDO HAY CAMPO</span>
            <div style={styles.warningStrip} className="warning-stripes" />
          </div>
          
          <p style={styles.tagline}>
            LA GUERRA SECRETA DE LOS MICROS DE RUTA CONTRA LA LÍNEA PUMAKATARI
          </p>
        </div>

        {/* Clandestine Garage Bay with the Microbus Graphic */}
        <div style={{
          ...styles.busStage,
          transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
        }}>
          {/* Canvas for particle sparks and engine smoke */}
          <canvas ref={particleCanvasRef} style={styles.particleCanvas} />

          {/* SVG Custom Layered Microbus with Mecha panel displacement */}
          <div style={{
            ...styles.busGraphicsWrapper,
            animation: pedalPressed ? 'shake-intense 0.05s infinite' : 'microbus-rattle 0.15s infinite alternate ease-in-out',
          }}>
            <svg viewBox="0 0 600 350" style={styles.busSvg}>
              {/* Ground shadow */}
              <ellipse cx="300" cy="300" rx="200" ry="15" fill="rgba(0,0,0,0.4)" filter="blur(6px)" />
              
              {/* MECHA CORES (Underbody / Hidden reveal layer) */}
              <g style={{ 
                opacity: revVal,
                transition: 'opacity 0.2s ease',
              }}>
                {/* Glowing neon green energy matrix */}
                <rect x="200" y="160" width="200" height="100" fill="none" stroke="var(--neon-green)" strokeWidth="3" filter="drop-shadow(0 0 10px var(--neon-green))" />
                <path d="M 230,180 H 370 M 230,220 H 370 M 230,200 L 370,240 M 230,240 L 370,200" stroke="var(--neon-green)" strokeWidth="1.5" />
                {/* Mechanical hydraulic cylinders */}
                <rect x="180" y="240" width="15" height="40" fill="#3f3f46" />
                <rect x="400" y="240" width="15" height="40" fill="#3f3f46" />
                <line x1="187" y1="240" x2="187" y2="290" stroke="#a1a1aa" strokeWidth="6" />
                <line x1="407" y1="240" x2="407" y2="290" stroke="#a1a1aa" strokeWidth="6" />
              </g>

              {/* WHEELS (tilt sideways like transformer joints) */}
              <g style={{
                transform: `translate(160px, 280px) rotate(${revVal * -25}deg)`,
                transformOrigin: 'center',
                transition: 'transform 0.1s ease',
              }}>
                {/* Front Wheel */}
                <circle cx="0" cy="0" r="32" fill="#18181b" stroke="#3f3f46" strokeWidth="4" />
                <circle cx="0" cy="0" r="16" fill="#3f3f46" />
                <rect x="-4" y="-32" width="8" height="64" fill="#52525b" />
                <rect x="-32" y="-4" width="64" height="8" fill="#52525b" />
              </g>
              
              <g style={{
                transform: `translate(440px, 280px) rotate(${revVal * -25}deg)`,
                transformOrigin: 'center',
                transition: 'transform 0.1s ease',
              }}>
                {/* Rear Wheel */}
                <circle cx="0" cy="0" r="34" fill="#18181b" stroke="#3f3f46" strokeWidth="4" />
                <circle cx="0" cy="0" r="16" fill="#3f3f46" />
                <rect x="-4" y="-34" width="8" height="68" fill="#52525b" />
                <rect x="-34" y="-4" width="68" height="8" fill="#52525b" />
              </g>

              {/* MAIN REBEL BUS CHASSIS */}
              {/* Left Wing / Cab Side Panel (slides forward/up) */}
              <g style={{
                transform: `translate(${revVal * -20}px, ${revVal * -15}px) rotate(${revVal * -3}deg)`,
                transition: 'transform 0.1s ease',
              }}>
                {/* Vintage Bolivian Micro Coachwork body */}
                <path d="M 120,200 L 150,120 L 450,120 L 480,200 L 460,270 L 140,270 Z" fill="#D94747" stroke="#52525b" strokeWidth="3" />
                
                {/* Side paint strip (yellow-green classic block) */}
                <path d="M 128,220 L 142,180 L 458,180 L 472,220 Z" fill="#F4B400" />
                <path d="M 134,240 L 140,225 L 460,225 L 466,240 Z" fill="#1b9a2e" />

                {/* Hand painted Route Text Placards in the window glass */}
                <rect x="230" y="130" width="140" height="28" fill="#090a0f" stroke="#F4B400" strokeWidth="1.5" />
                <text x="300" y="148" fill="#F4B400" fontFamily="var(--font-hud)" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                  PÉREZ - CEJA - AL FONDITO
                </text>
              </g>

              {/* BONNET / MOTOR GRILLE PANEL (Splits open & lifts up) */}
              <g style={{
                transform: `translate(${revVal * -35}px, ${revVal * -25}px) rotate(${revVal * -12}deg)`,
                transformOrigin: '120px 240px',
                transition: 'transform 0.1s ease',
              }}>
                {/* Front nose / hood of classic Dodge colectivo */}
                <path d="M 60,230 L 120,200 L 140,270 L 70,270 Z" fill="#D94747" stroke="#52525b" strokeWidth="2.5" />
                {/* Front vintage grille rows */}
                <rect x="75" y="218" width="12" height="42" fill="#27272a" rx="2" transform="rotate(-15, 75, 218)" />
                <rect x="90" y="214" width="12" height="42" fill="#27272a" rx="2" transform="rotate(-15, 90, 214)" />
                
                {/* Headlights (Flashes bright when accelerating) */}
                <circle cx="70" cy="245" r="12" 
                  fill={pedalPressed ? (Math.random() > 0.3 ? '#F4B400' : '#71717a') : '#F4B400'} 
                  stroke="#a1a1aa" 
                  strokeWidth="2" 
                  style={{
                    filter: pedalPressed ? 'drop-shadow(0 0 15px #F4B400)' : 'none',
                  }}
                />
              </g>

              {/* BACK REAR CAP (Slides backwards and opens vents) */}
              <g style={{
                transform: `translate(${revVal * 25}px, 0px)`,
                transition: 'transform 0.1s ease',
              }}>
                <path d="M 450,120 L 520,200 L 510,270 L 460,270 Z" fill="#D94747" stroke="#52525b" strokeWidth="2.5" />
                {/* Rear exhaust pipe */}
                <rect x="495" y="260" width="30" height="12" fill="#3f3f46" rx="2" transform="rotate(10, 495, 260)" />
              </g>
            </svg>

            {/* In-Garage Transformer HUD Overlay (Active under Transformation) */}
            <div style={{
              ...styles.hudOverlay,
              opacity: transformed ? 1 : 0,
              transform: transformed ? 'scale(1)' : 'scale(0.9)',
              pointerEvents: 'none',
            }}>
              <div style={styles.hudHeader}>
                <span className="neon-text-green">SISTEMA: EN ACCIÓN</span>
                <span style={{ marginLeft: 'auto' }}>RPM CAPACIDAD: 100%</span>
              </div>
              <div style={styles.hudGrid}>
                <div>CHASIS: METACARGA</div>
                <div>NÚCLEO: ACTIVO [ALTA PRESIÓN]</div>
                <div>LADERA INCLINACIÓN: 45°</div>
                <div style={{ color: 'var(--neon-red)' }}>ESTADO: EXCESO PASAJEROS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heavy Mechanical Gas Pedal Controller (Bottom-Right) */}
      <div style={styles.pedalArea}>
        <div style={styles.pedalTerminal}>
          <div style={styles.pedalTermHeader}>
            <div style={styles.blinkingDot} />
            <span>INTERFAZ ACELERADORA DE PRESIÓN</span>
          </div>
          <p style={styles.pedalTermText}>
            {pedalPressed 
              ? `PRESIONANDO: ${(revVal * 100).toFixed(0)}% RPM | INYECTANDO ENERGÍA...` 
              : 'MANTÉN PRESIONADO EL PEDAL PARA ARRANCAR EL MOTOR Y FORZAR LA TRANSFORMACIÓN'}
          </p>
        </div>
        
        <button
          onMouseDown={handlePedalDown}
          onMouseUp={handlePedalUp}
          onMouseLeave={handlePedalUp}
          onTouchStart={(e) => { e.preventDefault(); handlePedalDown(); }}
          onTouchEnd={(e) => { e.preventDefault(); handlePedalUp(); }}
          style={{
            ...styles.metalPedal,
            transform: pedalPressed 
              ? 'perspective(400px) rotateX(25deg) translateY(4px)' 
              : 'perspective(400px) rotateX(10deg) translateY(0)',
            borderColor: pedalPressed ? 'var(--neon-red)' : 'var(--border-metal)',
            boxShadow: pedalPressed 
              ? '0 0 25px var(--neon-red-glow), inset 0 2px 5px rgba(0,0,0,0.8)' 
              : '0 8px 0px var(--border-metal), 0 15px 15px rgba(0,0,0,0.3)',
          }}
        >
          <div style={styles.pedalStripes} className="warning-stripes" />
          
          <div style={styles.pedalGripLines}>
            <div style={styles.gripLine} />
            <div style={styles.gripLine} />
            <div style={styles.gripLine} />
            <div style={styles.gripLine} />
            <div style={styles.gripLine} />
          </div>

          <span style={{
            ...styles.pedalText,
            color: pedalPressed ? 'var(--neon-red)' : 'var(--text-primary)',
          }}>
            {pedalPressed ? 'RPM MÁXIMO' : 'ACELERAR'}
          </span>
        </button>
      </div>

      {/* Downward Scroll indicator */}
      <div style={styles.scrollIndicator}>
        <span style={styles.scrollText}>DESCENDER AL TALLER</span>
        <div style={styles.scrollArrow} />
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
    background: 'radial-gradient(circle at center, var(--bg-dark) 0%, var(--bg-deep) 100%)',
    padding: '100px 40px 80px 40px',
    overflow: 'hidden',
    transition: 'background 0.45s ease',
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 95%)',
    pointerEvents: 'none',
    zIndex: 2,
  },
  streetLampContainer: {
    position: 'absolute',
    top: '0px',
    left: '20%',
    height: '100%',
    width: '300px',
    zIndex: 1,
    pointerEvents: 'none',
  },
  lampBulb: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    position: 'absolute',
    top: '120px',
    left: '143px',
    transition: 'all 0.15s ease',
  },
  lightBeam: {
    position: 'absolute',
    top: '130px',
    left: '30px',
    width: '240px',
    height: '500px',
    background: 'linear-gradient(to bottom, var(--neon-yellow-glow) 0%, rgba(244, 180, 0, 0.02) 60%, transparent 100%)',
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    filter: 'blur(3px)',
  },
  contentContainer: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '30px',
    maxWidth: '1200px',
    width: '100%',
    alignItems: 'center',
    zIndex: 5,
    marginTop: '20px',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
      marginTop: '40px',
    },
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    transition: 'transform 0.05s ease-out',
  },
  subtitle: {
    fontFamily: 'var(--font-hud)',
    color: 'var(--neon-yellow)',
    fontSize: '11px',
    letterSpacing: '4px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  gameTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '72px',
    fontWeight: '900',
    letterSpacing: '-2px',
    lineHeight: '0.9',
    marginBottom: '10px',
  },
  titleDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    width: '100%',
  },
  warningStrip: {
    flex: 1,
    height: '10px',
    borderRadius: '2px',
    opacity: 0.85,
  },
  titleBadge: {
    fontFamily: 'var(--font-mecha)',
    fontWeight: '800',
    fontSize: '18px',
    letterSpacing: '4px',
    color: 'var(--text-primary)',
    textShadow: '0 0 10px rgba(255,255,255,0.2)',
  },
  tagline: {
    fontFamily: 'var(--font-hud)',
    fontSize: '14px',
    color: 'var(--text-secondary)',
    letterSpacing: '2px',
    lineHeight: '1.6',
    maxWidth: '520px',
  },
  busStage: {
    position: 'relative',
    height: '380px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.05s ease-out',
  },
  particleCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 4,
    pointerEvents: 'none',
  },
  busGraphicsWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
    zIndex: 3,
  },
  busSvg: {
    width: '100%',
    height: 'auto',
    overflow: 'visible',
  },
  hudOverlay: {
    position: 'absolute',
    top: '-30px',
    left: '10%',
    right: '10%',
    background: 'rgba(5, 10, 8, 0.95)',
    border: '1.5px solid var(--neon-green)',
    boxShadow: '0 0 20px var(--neon-green-glow)',
    borderRadius: '4px',
    padding: '8px 12px',
    fontFamily: 'var(--font-hud)',
    fontSize: '10px',
    color: 'var(--neon-green)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    zIndex: 6,
  },
  hudHeader: {
    display: 'flex',
    borderBottom: '1px solid rgba(57,255,20,0.3)',
    paddingBottom: '4px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  hudGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4px',
    color: '#a7f3d0',
  },
  pedalArea: {
    position: 'absolute',
    bottom: '40px',
    right: '40px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    zIndex: 10,
    background: 'var(--bg-card)',
    backdropFilter: 'blur(5px)',
    border: '1px solid var(--border-metal)',
    padding: '12px 20px',
    borderRadius: '4px',
    maxWidth: '480px',
    '@media (max-width: 768px)': {
      right: '20px',
      left: '20px',
      bottom: '10px',
      maxWidth: 'calc(100% - 40px)',
    },
  },
  pedalTerminal: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    width: '260px',
  },
  pedalTermHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-hud)',
    fontSize: '10px',
    color: 'var(--neon-red)',
    fontWeight: 'bold',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  blinkingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--neon-red)',
    animation: 'neon-flicker 1s infinite alternate',
  },
  pedalTermText: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
    lineHeight: '1.3',
  },
  metalPedal: {
    width: '100px',
    height: '110px',
    background: 'linear-gradient(to bottom, #3f3f46 0%, #1f1f23 100%)',
    border: '3px solid',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    transition: 'all 0.05s ease-out',
    cursor: 'pointer',
  },
  pedalStripes: {
    width: '100%',
    height: '8px',
    borderRadius: '2px',
    opacity: 0.35,
  },
  pedalGripLines: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '60%',
  },
  gripLine: {
    height: '3px',
    background: '#18181b',
    borderRadius: '1px',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  },
  pedalText: {
    fontFamily: 'var(--font-mecha)',
    fontWeight: '800',
    fontSize: '10px',
    letterSpacing: '1px',
    transition: 'color 0.1s ease',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    pointerEvents: 'none',
    zIndex: 5,
  },
  scrollText: {
    fontFamily: 'var(--font-hud)',
    color: 'var(--text-secondary)',
    fontSize: '9px',
    letterSpacing: '3px',
    fontWeight: 'bold',
  },
  scrollArrow: {
    width: '1px',
    height: '24px',
    background: 'linear-gradient(to bottom, var(--neon-blue), transparent)',
    position: 'relative',
    animation: 'neon-pulse 1.5s infinite ease-in-out',
  },
};

export default HeroSection;
