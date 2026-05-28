import { useState, useEffect, useRef } from 'react';
import soundManager from '../utils/soundManager';

const carouselImages = [
  '/imgs/1.png',
  '/imgs/2.png',
  '/imgs/7.png',
  '/imgs/10.png'
];

const HeroSection = () => {
  const [pedalPressed, setPedalPressed] = useState(false);
  const [revVal, setRevVal] = useState(0); // 0 to 1
  const [transformed, setTransformed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Background photo carousel rotation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Heavy shaking values based on acceleration (pure render)
  const getShakeStyle = () => {
    if (revVal === 0) return {};
    return {
      filter: revVal > 0.65 ? `blur(${revVal * 0.8}px)` : 'none',
    };
  };

  return (
    <section id="inicio" style={styles.section} className="grunge-texture scene-transition">
      {/* Background photo carousel layers */}
      <div style={styles.carouselContainer}>
        {carouselImages.map((img, index) => (
          <div
            key={index}
            style={{
              ...styles.carouselLayer,
              backgroundImage: `url(${img})`,
              opacity: currentBgIndex === index ? 0.38 : 0,
            }}
          />
        ))}
      </div>

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
      <div 
        className={`hero-content-container ${revVal > 0.65 ? 'shake-active-intense' : (revVal > 0.15 ? 'shake-active-mild' : '')}`}
        style={{ ...styles.contentContainer, ...getShakeStyle() }}
      >
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
              <defs>
                {/* Mirror chrome gradient for bumpers, wheels, and exhausts */}
                <linearGradient id="chrome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="20%" stopColor="#94a3b8" />
                  <stop offset="40%" stopColor="#f8fafc" />
                  <stop offset="60%" stopColor="#cbd5e1" />
                  <stop offset="80%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                
                {/* Soot / Hollín exhaust gradient */}
                <radialGradient id="soot-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(15, 15, 17, 0.9)" />
                  <stop offset="60%" stopColor="rgba(30, 30, 32, 0.4)" />
                  <stop offset="100%" stopColor="rgba(9, 9, 11, 0)" />
                </radialGradient>

                {/* Dirt / Barro splash gradient */}
                <linearGradient id="mud-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(101, 67, 33, 0.65)" />
                  <stop offset="50%" stopColor="rgba(141, 105, 54, 0.3)" />
                  <stop offset="100%" stopColor="rgba(101, 67, 33, 0)" />
                </linearGradient>
              </defs>

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
                transform: `translate(160px, 280px) rotate(${revVal * -300}deg)`, // fast spinning
                transformOrigin: 'center',
                transition: 'transform 0.1s ease',
              }}>
                {/* Front Chrome Wheel */}
                <circle cx="0" cy="0" r="34" fill="#2d2d30" stroke="#18181b" strokeWidth="6" />
                <circle cx="0" cy="0" r="28" fill="none" stroke="#52525b" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="22" fill="url(#chrome-grad)" stroke="#9ca3af" strokeWidth="1" />
                <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#374151" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="12" fill="url(#chrome-grad)" />
                <circle cx="0" cy="0" r="7" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
                <circle cx="0" cy="-10" r="1.8" fill="#18181b" />
                <circle cx="8.6" cy="-5" r="1.8" fill="#18181b" />
                <circle cx="8.6" cy="5" r="1.8" fill="#18181b" />
                <circle cx="0" cy="10" r="1.8" fill="#18181b" />
                <circle cx="-8.6" cy="5" r="1.8" fill="#18181b" />
                <circle cx="-8.6" cy="-5" r="1.8" fill="#18181b" />
                {/* Mud splash on front wheel */}
                <path d="M -20,24 Q 0,18 20,24 L 28,30 Q 0,22 -28,30 Z" fill="rgba(101,67,33,0.5)" />
              </g>
              
              <g style={{
                transform: `translate(440px, 280px) rotate(${revVal * -300}deg)`,
                transformOrigin: 'center',
                transition: 'transform 0.1s ease',
              }}>
                {/* Rear Chrome Wheel */}
                <circle cx="0" cy="0" r="36" fill="#2d2d30" stroke="#18181b" strokeWidth="6" />
                <circle cx="0" cy="0" r="30" fill="none" stroke="#52525b" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="24" fill="url(#chrome-grad)" stroke="#9ca3af" strokeWidth="1" />
                <circle cx="0" cy="0" r="17" fill="#1e293b" stroke="#374151" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="12" fill="url(#chrome-grad)" />
                <circle cx="0" cy="0" r="7" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
                <circle cx="0" cy="-10" r="1.8" fill="#18181b" />
                <circle cx="8.6" cy="-5" r="1.8" fill="#18181b" />
                <circle cx="8.6" cy="5" r="1.8" fill="#18181b" />
                <circle cx="0" cy="10" r="1.8" fill="#18181b" />
                <circle cx="-8.6" cy="5" r="1.8" fill="#18181b" />
                <circle cx="-8.6" cy="-5" r="1.8" fill="#18181b" />
                {/* Mud splash on rear wheel */}
                <path d="M -22,26 Q 0,20 22,26 L 30,32 Q 0,24 -30,32 Z" fill="rgba(101,67,33,0.5)" />
              </g>

              {/* MAIN REBEL BUS CHASSIS */}
              {/* Left Wing / Cab Side Panel (slides forward/up) */}
              <g style={{
                transform: `translate(${revVal * -20}px, ${revVal * -15}px) rotate(${revVal * -3}deg)`,
                transition: 'transform 0.1s ease',
              }}>
                {/* White Upper & Middle Body */}
                <path d="M 120,200 L 150,110 L 460,110 L 485,200 L 460,268 L 140,268 Z" fill="#ffffff" stroke="#111" strokeWidth="2.5" />
                
                {/* Green Bottom Section */}
                <path d="M 140,195 L 483,195 L 460,268 L 140,268 Z" fill="#165b33" stroke="#111" strokeWidth="1" />
                
                {/* Green Roof & Wind Visor (Cachucha) */}
                <path d="M 150,110 L 146,106 Q 165,95 200,95 L 460,95 Q 470,95 470,105 L 460,110 Z" fill="#165b33" stroke="#111" strokeWidth="1.5" />
                <path d="M 142,112 C 142,108 152,108 160,112 Z" fill="#e5e7eb" />
                {/* Retro Colectivo Multi-Striped Interleaved Green & White Paint Stripes on the White middle band with Gold borders (Fileteado) */}
                {/* Gold framing outlines */}
                <path d="M 180,170 H 400 L 452,203 H 483" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.95" />
                <path d="M 180,198 H 386 L 424,231 H 475" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.95" />
                
                {/* 7 Interleaved Green & White horizontal stripes */}
                <path d="M 180,172 H 399 L 450,205 H 482" stroke="#165b33" strokeWidth="3.5" fill="none" />
                <path d="M 180,176 H 397 L 446,209 H 481" stroke="#ffffff" strokeWidth="3.5" fill="none" />
                <path d="M 180,180 H 395 L 442,213 H 480" stroke="#165b33" strokeWidth="3.5" fill="none" />
                <path d="M 180,184 H 393 L 438,217 H 479" stroke="#ffffff" strokeWidth="3.5" fill="none" />
                <path d="M 180,188 H 391 L 434,221 H 478" stroke="#165b33" strokeWidth="3.5" fill="none" />
                <path d="M 180,192 H 389 L 430,225 H 477" stroke="#ffffff" strokeWidth="3.5" fill="none" />
                <path d="M 180,196 H 387 L 426,229 H 476" stroke="#165b33" strokeWidth="3.5" fill="none" />


                {/* Vertical Panel seams & Rivets (Remaches) */}
                <g opacity="0.8">
                  {/* Seam 1 at x = 215 */}
                  <line x1="215" y1="110" x2="215" y2="268" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
                  <line x1="216" y1="110" x2="216" y2="268" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                  <circle cx="215" cy="115" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="215" cy="132" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="215" cy="152" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="215" cy="172" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="215" cy="202" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="215" cy="222" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="215" cy="242" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="215" cy="260" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />

                  {/* Seam 2 at x = 295 */}
                  <line x1="295" y1="110" x2="295" y2="268" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
                  <line x1="296" y1="110" x2="296" y2="268" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                  <circle cx="295" cy="115" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="295" cy="132" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="295" cy="152" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="295" cy="172" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="295" cy="202" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="295" cy="222" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="295" cy="242" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="295" cy="260" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />

                  {/* Seam 3 at x = 375 */}
                  <line x1="375" y1="110" x2="375" y2="268" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
                  <line x1="376" y1="110" x2="376" y2="268" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                  <circle cx="375" cy="115" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="375" cy="132" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="375" cy="152" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="375" cy="172" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="375" cy="202" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="375" cy="222" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="375" cy="242" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                  <circle cx="375" cy="260" r="1.2" fill="#9ca3af" stroke="#4b5563" strokeWidth="0.3" />
                </g>

                {/* Mud / Barro splashes along the bottom edge of the micro */}
                <path d="M 140,245 Q 180,250 220,253 Q 280,246 340,251 Q 400,248 460,244 L 460,268 L 140,268 Z" fill="url(#mud-grad)" opacity="0.65" />

                {/* Wheel cutout arcs */}
                <path d="M 120,268 A 38,38 0 0,1 180,268" fill="#18181b" />
                <path d="M 400,268 A 42,42 0 0,1 480,268" fill="#18181b" />

                {/* Windows Layout & Multi-colored Stained Acrylic Vent Vents (Vidrios superiores de color) */}
                {/* Windshield */}
                <path d="M 160,125 Q 162,120 168,120 L 210,120 L 210,190 L 160,190 Z" fill="#1e293b" stroke="#334155" strokeWidth="2.5" />
                <path d="M 165,126 L 165,185" stroke="#64748b" strokeWidth="1" />
                
                {/* Route Placard inside Front Windshield (CHASQUIPAMPA / PEREZ / CEJA) */}
                <g transform="translate(168, 126) rotate(2)">
                  <rect x="0" y="0" width="36" height="42" rx="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
                  <rect x="2" y="2" width="32" height="38" rx="1.5" fill="none" stroke="#ef4444" strokeWidth="1" />
                  <text x="18" y="10" fill="#dc2626" fontFamily="Impact, Arial Black, sans-serif" fontSize="6.5" fontWeight="bold" textAnchor="middle">CHASQUI</text>
                  <text x="18" y="16" fill="#dc2626" fontFamily="Impact, Arial Black, sans-serif" fontSize="6" fontWeight="bold" textAnchor="middle">PAMPA</text>
                  <text x="18" y="25" fill="#1e3a8a" fontFamily="Impact, Arial Black, sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle">PEREZ</text>
                  <text x="18" y="36" fill="#15803d" fontFamily="Impact, Arial Black, sans-serif" fontSize="9" fontWeight="bold" textAnchor="middle">CEJA</text>
                </g>

                {/* Main passenger windows with Silhouette passengers */}
                <rect x="220" y="120" width="70" height="70" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2.5" />
                {/* Yellow acrylic vent glass */}
                <rect x="221" y="121" width="68" height="18" fill="rgba(251, 191, 36, 0.7)" stroke="#334155" strokeWidth="1" />
                <line x1="255" y1="120" x2="255" y2="190" stroke="#64748b" strokeWidth="1" />
                
                <rect x="300" y="120" width="70" height="70" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2.5" />
                {/* Cobalt blue acrylic vent glass */}
                <rect x="301" y="121" width="68" height="18" fill="rgba(59, 130, 246, 0.65)" stroke="#334155" strokeWidth="1" />
                <line x1="335" y1="120" x2="335" y2="190" stroke="#64748b" strokeWidth="1" />

                <rect x="380" y="120" width="70" height="70" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2.5" />
                {/* Amber acrylic vent glass */}
                <rect x="381" y="121" width="68" height="18" fill="rgba(251, 191, 36, 0.7)" stroke="#334155" strokeWidth="1" />
                <line x1="415" y1="120" x2="415" y2="190" stroke="#64748b" strokeWidth="1" />
                
                {/* Passenger silhouettes */}
                <circle cx="238" cy="155" r="8" fill="#475569" opacity="0.6" />
                <path d="M 226,178 Q 238,168 250,178 Z" fill="#475569" opacity="0.6" />
                <circle cx="318" cy="158" r="8" fill="#475569" opacity="0.6" />
                <path d="M 306,180 Q 318,170 330,180 Z" fill="#475569" opacity="0.6" />

                {/* Inspección Técnica & SOAT Stickers inside window */}
                <circle cx="172" cy="180" r="3.5" fill="#ef4444" opacity="0.85" />
                <text x="172" y="182" fill="#fff" fontSize="5" fontWeight="bold" textAnchor="middle">26</text>
                <circle cx="181" cy="180" r="3.5" fill="#fbbf24" opacity="0.85" />
                <circle cx="190" cy="180" r="3.5" fill="#3b82f6" opacity="0.85" />

                {/* Hand-painted Route Placard (6 DE AGOSTO / TELEFERICO) */}
                <g transform="translate(225, 142)">
                  <rect x="0" y="0" width="60" height="26" rx="4" fill="#165b33" stroke="#ffffff" strokeWidth="1.2" />
                  <text x="30" y="10" fill="#ffffff" fontFamily="Impact, Arial Black, sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle" style={{ letterSpacing: '0.2px' }}>6 DE AGOSTO</text>
                  <text x="30" y="21" fill="#ffffff" fontFamily="Impact, Arial Black, sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle" style={{ letterSpacing: '0.2px' }}>TELEFERICO</text>
                </g>

                {/* Sticker of GAMLP Plate registration */}
                <g transform="translate(390, 168)">
                  <rect x="0" y="0" width="12" height="12" fill="#22c55e" opacity="0.8" rx="0.5" stroke="#ffffff" strokeWidth="0.5" />
                  <text x="6" y="9" fill="#ffffff" fontSize="5" fontFamily="var(--font-hud)" textAnchor="middle" fontWeight="bold">3450</text>
                </g>

                {/* Lettering: 3D Hand-painted "VILLA" with gold drop-shadow */}
                <text x="187" y="214" fill="#000000" fontFamily="Georgia, serif" fontSize="16" fontWeight="bold" textAnchor="middle" style={{ letterSpacing: '1px' }}>VILLA</text>
                <text x="186" y="213" fill="#d97706" fontFamily="Georgia, serif" fontSize="16" fontWeight="bold" textAnchor="middle" style={{ letterSpacing: '1px' }}>VILLA</text>
                <text x="185" y="212" fill="#ffffff" stroke="#165b33" strokeWidth="1" fontFamily="Georgia, serif" fontSize="16" fontWeight="bold" textAnchor="middle" style={{ letterSpacing: '1px' }}>VILLA</text>

                {/* Lettering: Cross + "Jesús Guía Mi Camino" */}
                <g transform="translate(352, 203)">
                  <path d="M 6,0 H 10 V 16 H 6 Z M 2,4 H 14 V 8 H 2 Z" fill="#ffffff" />
                  <text x="20" y="8" fill="#ffffff" fontFamily="Georgia, serif" fontSize="8" fontWeight="bold" fontStyle="italic">Jesús Guía</text>
                  <text x="20" y="15" fill="#ffffff" fontFamily="Georgia, serif" fontSize="8" fontWeight="bold" fontStyle="italic">Mi Camino</text>
                </g>

                {/* Roof Destination Box (MICRO Victoria) with gold border fileteado */}
                <rect x="230" y="78" width="160" height="22" rx="3" fill="#ffffff" stroke="#165b33" strokeWidth="2.5" />
                <rect x="229" y="77" width="162" height="24" rx="4" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
                {/* 3D shadows on text */}
                <text x="277" y="95" fill="#d97706" fontFamily="Impact, Arial Black, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">MICRO</text>
                <text x="275" y="93" fill="#165b33" fontFamily="Impact, Arial Black, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">MICRO</text>
                <text x="337" y="95" fill="#d97706" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fontWeight="bold" textAnchor="middle">Victoria</text>
                <text x="335" y="93" fill="#15803d" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fontWeight="bold" textAnchor="middle">Victoria</text>

                <circle cx="165" cy="100" r="2.5" fill="#f59e0b" />
                <circle cx="452" cy="100" r="2.5" fill="#f59e0b" />
              </g>

              {/* BONNET / MOTOR GRILLE PANEL (Splits open & lifts up) */}
              <g style={{
                transform: `translate(${revVal * -35}px, ${revVal * -25}px) rotate(${revVal * -12}deg)`,
                transformOrigin: '120px 240px',
                transition: 'transform 0.1s ease',
              }}>
                {/* Green front fender & sloped bonnet */}
                <path d="M 140,200 L 122,200 Q 95,202 78,208 Q 72,210 70,216 L 70,254 Q 70,260 76,262 L 140,268 Z" fill="#165b33" stroke="#111" strokeWidth="2" />
                
                {/* White stripes on top of bonnet */}
                <path d="M 125,201 Q 102,203 85,206" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                <path d="M 125,204 Q 105,206 92,208" stroke="#ffffff" strokeWidth="1" fill="none" />
                
                {/* Wheel cutout */}
                <path d="M 90,268 A 38,38 0 0,1 140,268" fill="#18181b" />

                {/* Front Grill plate (Silver) */}
                <path d="M 70,216 L 70,254 L 74,252 L 74,218 Z" fill="url(#chrome-grad)" stroke="#4b5563" strokeWidth="1" />
                
                {/* Bumper (Chrome mirror gradient) */}
                <rect x="54" y="248" width="22" height="20" rx="3" fill="url(#chrome-grad)" stroke="#1e293b" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))' }} />

                {/* Front License Plate */}
                <g transform="translate(65, 258) rotate(-6)">
                  <rect x="-10" y="-4" width="20" height="8" fill="#ffffff" stroke="#1e3a8a" strokeWidth="0.6" rx="0.5" />
                  <text x="0" y="2" fill="#111827" fontFamily="monospace" fontSize="4.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.2">3450FDS</text>
                </g>

                {/* Mudflap hanging behind front wheel with dirt splash */}
                <g transform="translate(182, 260)">
                  <rect x="-8" y="0" width="16" height="28" fill="#1c1917" rx="1" />
                  <path d="M -8,0 L -8,28" stroke="#ffffff" strokeWidth="0.8" />
                  <text x="0" y="24" fill="#ffffff" fontSize="4.5" fontFamily="var(--font-hud)" textAnchor="middle" fontWeight="bold">DODGE</text>
                  {/* Mud splat on mudflap */}
                  <rect x="-8" y="16" width="16" height="12" fill="rgba(101,67,33,0.4)" />
                </g>

                {/* Headlights (Flashes bright when accelerating) */}
                <circle cx="68" cy="235" r="10" 
                  fill="#ffffff" 
                  stroke="#cbd5e1" 
                  strokeWidth="2" 
                  style={{
                    filter: pedalPressed ? 'drop-shadow(0 0 15px #ffea00)' : 'none',
                    animation: pedalPressed ? 'neon-flicker 0.12s infinite' : 'none',
                  }}
                />
                <circle cx="68" cy="235" r="5" fill="#fef08a" opacity="0.8" />

                {/* Side Turn Signal */}
                <circle cx="95" cy="222" r="3" fill="#ea580c" stroke="#111" strokeWidth="0.8" />

                {/* Hood ornament (Chrome) */}
                <path d="M 78,208 L 74,200 L 70,204 Z" fill="url(#chrome-grad)" stroke="#4b5563" strokeWidth="1" />
                <line x1="74" y1="200" x2="80" y2="204" stroke="#ffffff" strokeWidth="1" />

                {/* Massive side mirror brackets (monster truck mirrors) */}
                {/* Bracket pipes */}
                <path d="M 125,182 L 105,178 L 105,212 L 125,208" stroke="#cbd5e1" strokeWidth="2.5" fill="none" />
                {/* Rectangular Mirror casing */}
                <rect x="95" y="172" width="10" height="35" rx="2" fill="#18181b" stroke="#64748b" strokeWidth="1" />
                {/* Flat glass face reflection */}
                <rect x="96" y="173" width="8" height="33" rx="1" fill="#cbd5e1" />
                {/* Small extra convex mirror at bottom */}
                <circle cx="100" cy="214" r="4.5" fill="#18181b" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="100" cy="214" r="3" fill="#94a3b8" />

                {/* Extra round blind spot mirror on the bumper fender pointing down */}
                <path d="M 80,248 L 70,260" stroke="#cbd5e1" strokeWidth="1" fill="none" />
                <circle cx="70" cy="260" r="3.5" fill="#18181b" stroke="#cbd5e1" strokeWidth="0.8" />
                <circle cx="70" cy="260" r="2.2" fill="#94a3b8" />
              </g>

              {/* BACK REAR CAP (Slides backwards and opens vents) */}
              <g style={{
                transform: `translate(${revVal * 25}px, 0px)`,
                transition: 'transform 0.1s ease',
              }}>
                <path d="M 460,110 L 485,200 L 460,268 H 472 L 498,254 L 498,185 Q 492,118 460,110 Z" fill="#ffffff" stroke="#111" strokeWidth="2" />
                <path d="M 460,195 H 492 L 498,254 L 460,268 Z" fill="#165b33" stroke="#111" strokeWidth="1" />
                
                {/* Brake light */}
                <rect x="492" y="195" width="6" height="28" rx="2" fill="#ef4444" stroke="#111" strokeWidth="0.8" style={{ filter: pedalPressed ? 'drop-shadow(0 0 10px #ef4444)' : 'none' }} />

                {/* Rear License Plate */}
                <g transform="translate(480, 230) rotate(5)">
                  <rect x="-10" y="-4" width="20" height="8" fill="#ffffff" stroke="#1e3a8a" strokeWidth="0.6" rx="0.5" />
                  <text x="0" y="2" fill="#111827" fontFamily="monospace" fontSize="4.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.2">3450FDS</text>
                </g>

                {/* Rear exhaust pipe with soot particle shadow overlay */}
                <ellipse cx="488" cy="264" rx="25" ry="12" fill="url(#soot-grad)" opacity="0.8" />
                <rect x="475" y="260" width="35" height="10" fill="url(#chrome-grad)" stroke="#374151" strokeWidth="1.5" rx="1" transform="rotate(8, 475, 260)" />
                <circle cx="510" cy="265" r="4.5" fill="#18181b" />

                {/* Mudflap hanging behind rear wheel with dirt splash */}
                <g transform="translate(440, 260)">
                  <rect x="-10" y="0" width="20" height="30" fill="#1c1917" rx="1" />
                  <path d="M -10,0 L -10,30" stroke="#ffffff" strokeWidth="0.8" />
                  <path d="M -4,6 H 0 C 3,6 4,7 4,9 C 4,11 3,12 0,12 H -4 Z M -1,8 V 10 H 0 C 1,10 1.5,9.5 1.5,9 C 1.5,8.5 1,8 0,8 Z" fill="#ffffff" transform="scale(0.8) translate(-2, 4)" />
                  <text x="0" y="26" fill="#ffffff" fontSize="4.5" fontFamily="var(--font-hud)" textAnchor="middle" fontWeight="bold">DODGE</text>
                  {/* Mud splat on mudflap */}
                  <rect x="-10" y="16" width="20" height="14" fill="rgba(101,67,33,0.4)" />
                </g>
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
      <div className="hero-pedal-area" style={styles.pedalArea}>
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
    background: 'var(--bg-deep)',
    padding: '100px 40px 80px 40px',
    overflow: 'hidden',
    transition: 'background 0.45s ease',
  },
  carouselContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  carouselLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center 72%',
    transition: 'opacity 1.5s ease-in-out',
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
