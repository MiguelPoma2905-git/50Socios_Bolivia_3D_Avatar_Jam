import React, { useState, useEffect, useRef } from 'react';
import soundManager from '../utils/soundManager';

const LoreTable = () => {
  const [activeItem, setActiveItem] = useState(null); // 'newspaper', 'radio', 'cassette', 'blueprint'
  const [radioLogs, setRadioLogs] = useState([]);
  const [radioActive, setRadioActive] = useState(false);
  const [radioHovered, setRadioHovered] = useState(false);
  const [cassettePlaying, setCassettePlaying] = useState(false);
  const [logsInterval, setLogsInterval] = useState(null);
  
  const visualizerCanvasRef = useRef(null);
  const visualizerAnimRef = useRef(null);

  // Intersection observer to animate table items when scrolled into view
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Radio dialogue generator logs
  const dialogueSource = [
    "[CHOFER_ZONA_NORTE]: Central, habla el 14. Hay un trufi parado en la bajada de Munaypata... pero tiene cables azules saliendo del motor. Repito, cables azules.",
    "[CENTRAL]: Aquí Central. 14, mantenga distancia. No toque el capó. Ya despachamos al mecánico de guardia.",
    "[CHOFER_VILLA_FÁTIMA]: ¡Cuidado, muchachos! Un PumaKatari se desvió de su ruta comercial en la Bush... se le iluminaron los costados de celeste. Dio un salto de diez metros sobre una trancadera.",
    "[CHOFER_ZONA_SUR]: ¿Alguien vio el colectivo rojo de Sopocachi? Se transformó completo en la curva de Holguín... levantó dos toneladas de chatarra para tapar el paso de la patrulla.",
    "[CENTRAL]: Atención a todos los choferes del sindicato. Los Pumas corporativos están patrullando el peaje. Activen sus núcleos de presión. ¡Al fondo hay campo!",
  ];

  useEffect(() => {
    if (radioActive) {
      soundManager.playRadioStatic(1.2);
      let logIndex = 0;
      setRadioLogs([dialogueSource[0]]);
      
      const interval = setInterval(() => {
        logIndex++;
        if (logIndex < dialogueSource.length) {
          setRadioLogs(prev => [...prev, dialogueSource[logIndex]]);
          soundManager.playMorseTick(0.1);
        } else {
          setRadioLogs(prev => [...prev, "--- FIN DE LA TRANSMISIÓN ---"]);
          clearInterval(interval);
        }
      }, 3500);
      
      setLogsInterval(interval);
    } else {
      if (logsInterval) {
        clearInterval(logsInterval);
      }
      setRadioLogs([]);
    }
    return () => {
      if (logsInterval) clearInterval(logsInterval);
    };
  }, [radioActive]);

  // Cassette visualizer loop
  useEffect(() => {
    if (cassettePlaying) {
      soundManager.playTapeClick();
      soundManager.playRadioStatic(0.8);
      
      const canvas = visualizerCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      let waveOffset = 0;
      const drawWave = () => {
        ctx.fillStyle = '#06070c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw HUD grid lines
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 15) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }

        // Draw frequency waves (cyber green LED theme)
        ctx.strokeStyle = 'var(--neon-green)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'var(--neon-green-glow)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
          const mod = Math.sin(x * 0.05 + waveOffset) * 15;
          const noise = (Math.random() - 0.5) * 6 * Math.sin(x * 0.01);
          const amp = Math.sin(x * Math.PI / canvas.width) * 20; // envelope edges
          
          const y = (canvas.height / 2) + (mod + noise) * (amp / 20);
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Draw tape timer
        ctx.font = '9px Share Tech Mono';
        ctx.fillStyle = 'var(--neon-green)';
        const minutes = Math.floor(waveOffset / 60);
        const seconds = Math.floor(waveOffset % 60);
        ctx.fillText(`REC PLAY > 0${minutes}:${seconds < 10 ? '0' : ''}${seconds} / 04:20`, 10, 20);

        waveOffset += 0.15;
        visualizerAnimRef.current = requestAnimationFrame(drawWave);
      };
      
      drawWave();
    } else {
      if (visualizerAnimRef.current) {
        cancelAnimationFrame(visualizerAnimRef.current);
      }
      const canvas = visualizerCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#06070c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    return () => {
      if (visualizerAnimRef.current) cancelAnimationFrame(visualizerAnimRef.current);
    };
  }, [cassettePlaying]);

  const toggleRadio = () => {
    setRadioActive(!radioActive);
  };

  const handleRadioEnter = () => {
    setRadioHovered(true);
    soundManager.playRadioStatic(0.4);
  };

  const handleRadioLeave = () => {
    setRadioHovered(false);
  };

  const toggleCassette = () => {
    setCassettePlaying(!cassettePlaying);
  };

  const openItemModal = (item) => {
    soundManager.playTapeClick();
    setActiveItem(item);
  };

  const closeItemModal = () => {
    soundManager.playTapeClick();
    setActiveItem(null);
  };

  return (
    <section id="historia" ref={sectionRef} style={styles.section} className="grunge-texture scene-transition">
      <div style={styles.lightingOverlay} />
      
      {/* Title */}
      <div style={styles.header}>
        <span style={styles.label}>SECCIÓN 2 — LA BITÁCORA DEL CHOFER</span>
        <h2 style={styles.title}>EL SECRETO EN EL PISO DEL MICRO</h2>
        <p style={styles.desc}>
          Los retazos de la guerra no se archivan en corporaciones. Están tirados sobre la chapa grasosa del micro. Explora los objetos caídos en las rendijas del piso.
        </p>
      </div>

      {/* Workshop Workbench Table styled as a Microbus Worn Floorboard */}
      <div style={{
        ...styles.workbenchTable,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(80px)',
      }}>
        {/* Worn micro floor tracks */}
        <div style={styles.microFloorPlate} />
        <div style={{ ...styles.floorRib, bottom: '20px' }} />
        <div style={{ ...styles.floorRib, bottom: '80px' }} />
        <div style={{ ...styles.floorRib, bottom: '140px' }} />
        <div style={{ ...styles.floorRib, bottom: '200px' }} />
        
        {/* Stray Bolivian Coins (1 Bs, 2Bs, 5Bs) */}
        <div style={{ ...styles.coinBs, left: '8%', bottom: '22px', transform: 'rotate(15deg)' }}>
          <span style={styles.coinLabel}>2Bs</span>
        </div>
        <div style={{ ...styles.coinBs, left: '42%', bottom: '42px', width: '22px', height: '22px', transform: 'rotate(-40deg)', borderColor: '#c2410c' }}>
          <span style={styles.coinLabel}>1Bs</span>
        </div>
        <div style={{ ...styles.coinBs, right: '15%', bottom: '15px', width: '26px', height: '26px', transform: 'rotate(5deg)', borderWidth: '2.5px' }}>
          <span style={styles.coinLabel}>5Bs</span>
        </div>

        {/* Scattered items */}
        <div style={styles.itemsGrid}>
          
          {/* ITEM 1: CRUMPLED NEWSPAPER */}
          <div 
            onClick={() => openItemModal('newspaper')}
            style={{ ...styles.tableItem, transform: 'rotate(-8deg)' }}
            className="shake-hover"
          >
            <div style={styles.itemBadge}>[ PERIÓDICO ]</div>
            <svg width="120" height="90" viewBox="0 0 120 90" style={styles.itemSvg}>
              <rect x="5" y="5" width="110" height="80" rx="3" fill="#e5e5d8" stroke="#78716c" strokeWidth="2" />
              <path d="M 10,40 L 40,35 M 90,20 L 110,35 M 30,70 L 60,60" stroke="#a8a29e" strokeWidth="1" />
              <rect x="15" y="15" width="90" height="10" fill="#cc1111" />
              <text x="60" y="23" fill="#fff" fontFamily="var(--font-hud)" fontSize="7" fontWeight="bold" textAnchor="middle">EL EXTRA PACEÑO</text>
              <rect x="15" y="32" width="40" height="5" fill="#292524" />
              <rect x="15" y="42" width="40" height="3" fill="#78716c" />
              <rect x="15" y="49" width="40" height="3" fill="#78716c" />
              <rect x="65" y="32" width="40" height="25" fill="#d6d3d1" stroke="#a8a29e" />
              <circle cx="85" cy="45" r="8" fill="#D94747" />
            </svg>
            <span style={styles.itemLabel}>EL EXTRA PACEÑO</span>
          </div>

          {/* ITEM 2: RADIO TRANSCEIVER (Hover Reactive Dialogue) */}
          <div 
            onClick={toggleRadio}
            onMouseEnter={handleRadioEnter}
            onMouseLeave={handleRadioLeave}
            style={{ 
              ...styles.tableItem, 
              transform: 'rotate(5deg)',
              borderColor: radioActive ? 'var(--neon-green)' : (radioHovered ? 'var(--neon-blue)' : 'var(--border-metal)'),
              boxShadow: radioActive ? '0 0 20px var(--neon-green-glow)' : (radioHovered ? '0 0 15px var(--neon-blue-glow)' : 'none'),
            }}
            className="shake-hover"
          >
            <div style={{...styles.itemBadge, color: radioActive ? 'var(--neon-green)' : 'var(--text-secondary)'}}>
              [ {radioActive ? 'RADIO ON' : 'HOVER O CLIC'} ]
            </div>
            <svg width="120" height="90" viewBox="0 0 120 90" style={styles.itemSvg}>
              <rect x="25" y="15" width="70" height="70" rx="6" fill="#1c1917" stroke="#44403c" strokeWidth="3" />
              <line x1="35" y1="15" x2="20" y2="-10" stroke="#78716c" strokeWidth="4" />
              <rect x="35" y="25" width="50" height="20" rx="2" fill={radioActive ? '#093a1a' : '#27272a'} stroke="#44403c" />
              {radioActive && <line x1="55" y1="25" x2="55" y2="45" stroke="var(--neon-green)" strokeWidth="2" />}
              <circle cx="60" cy="65" r="16" fill="#292524" />
              <line x1="50" y1="65" x2="70" y2="65" stroke="#1c1917" strokeWidth="2" />
              <line x1="50" y1="60" x2="70" y2="60" stroke="#1c1917" strokeWidth="2" />
              <line x1="50" y1="70" x2="70" y2="70" stroke="#1c1917" strokeWidth="2" />
            </svg>
            <span style={{...styles.itemLabel, color: radioActive ? 'var(--neon-green)' : 'var(--text-primary)'}}>
              RADIO DE SINDICATO
            </span>

            {/* Hover Floating dialogue bubble */}
            {radioHovered && (
              <div style={styles.hoverBubble}>
                <div style={styles.hoverBubbleHeader}>TRANSMISIÓN FRAGMENTADA DE CANAL:</div>
                <div style={styles.hoverBubbleBody}>
                  "¡Central! ¡Central! ¡El 21 verde se está parando en dos patas en plena Pérez Velasco! ¡Cambio!"
                </div>
                <div style={styles.hoverBubbleArrow} />
              </div>
            )}
          </div>

          {/* ITEM 3: CASSETTE TAPE */}
          <div 
            onClick={toggleCassette}
            style={{ 
              ...styles.tableItem, 
              transform: 'rotate(-12deg)',
              borderColor: cassettePlaying ? 'var(--neon-green)' : 'var(--border-metal)',
              boxShadow: cassettePlaying ? '0 0 20px var(--neon-green-glow)' : 'none',
            }}
            className="shake-hover"
          >
            <div style={{...styles.itemBadge, color: cassettePlaying ? 'var(--neon-green)' : 'var(--text-secondary)'}}>
              [ {cassettePlaying ? 'REPRODUCIR' : 'TAPE OFF'} ]
            </div>
            <svg width="120" height="90" viewBox="0 0 120 90" style={styles.itemSvg}>
              <rect x="15" y="20" width="90" height="58" rx="4" fill="#292524" stroke="#57534e" strokeWidth="2" />
              <rect x="25" y="28" width="70" height="24" rx="2" fill="#78716c" />
              <text x="60" y="42" fill="#000000" fontFamily="var(--font-hud)" fontSize="7" fontWeight="bold" textAnchor="middle">
                BITÁCORA LOG_02
              </text>
              <g style={{
                transform: cassettePlaying ? 'rotate(360deg)' : 'none',
                transformOrigin: '40px 62px',
                transition: 'transform 20s linear infinite',
              }}>
                <circle cx="40" cy="62" r="10" fill="#1c1917" />
                <path d="M 36,62 L 44,62 M 40,58 L 40,66" stroke="#d6d3d1" strokeWidth="2" />
              </g>
              <g style={{
                transform: cassettePlaying ? 'rotate(360deg)' : 'none',
                transformOrigin: '80px 62px',
                transition: 'transform 20s linear infinite',
              }}>
                <circle cx="80" cy="62" r="10" fill="#1c1917" />
                <path d="M 76,62 L 84,62 M 80,58 L 80,66" stroke="#d6d3d1" strokeWidth="2" />
              </g>
            </svg>
            <span style={{...styles.itemLabel, color: cassettePlaying ? 'var(--neon-green)' : 'var(--text-primary)'}}>
              CASSETE DE GRABACIÓN
            </span>
          </div>

          {/* ITEM 4: MECHA BLUEPRINTS */}
          <div 
            onClick={() => openItemModal('blueprint')}
            style={{ ...styles.tableItem, transform: 'rotate(15deg)' }}
            className="shake-hover"
          >
            <div style={styles.itemBadge}>[ PLANO ]</div>
            <svg width="120" height="90" viewBox="0 0 120 90" style={styles.itemSvg}>
              <rect x="10" y="10" width="100" height="70" fill="#2D74D6" stroke="#3b82f6" strokeWidth="2" />
              <line x1="20" y1="10" x2="20" y2="80" stroke="rgba(255,255,255,0.15)" />
              <line x1="40" y1="10" x2="40" y2="80" stroke="rgba(255,255,255,0.15)" />
              <line x1="60" y1="10" x2="60" y2="80" stroke="rgba(255,255,255,0.15)" />
              <line x1="80" y1="10" x2="80" y2="80" stroke="rgba(255,255,255,0.15)" />
              <line x1="10" y1="30" x2="110" y2="30" stroke="rgba(255,255,255,0.15)" />
              <line x1="10" y1="50" x2="110" y2="50" stroke="rgba(255,255,255,0.15)" />
              <circle cx="60" cy="45" r="22" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
              <rect x="42" y="28" width="36" height="34" fill="none" stroke="#93c5fd" strokeWidth="1" />
              <path d="M 60,15 L 60,75 M 30,45 L 90,45" stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="3 3" />
            </svg>
            <span style={styles.itemLabel}>PLANO COLECTIVO</span>
          </div>

        </div>
      </div>

      {/* DYNAMIC CRT TERMINAL DISPLAY (When Radio/Cassette is active) */}
      {(radioActive || cassettePlaying) && (
        <div style={styles.crtContainer} className="metal-panel">
          <div style={styles.crtScan} />
          
          <div style={styles.crtHeader}>
            <div style={styles.greenPulse} />
            <span style={{ fontFamily: 'var(--font-hud)' }}>
              {radioActive ? 'MONITOR DE TRANSCEPCIÓN RADIAL GENERAL' : 'DECODIFICADOR DE CINTA CLANDESTINA'}
            </span>
          </div>

          <div style={styles.crtBody}>
            {/* If Radio is active, show the dialogue terminal */}
            {radioActive && (
              <div style={styles.logsArea}>
                {radioLogs.map((log, index) => (
                  <div key={index} style={styles.logLine}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* If Cassette is active, show visualizer */}
            {cassettePlaying && (
              <div style={styles.visualizerArea}>
                <canvas ref={visualizerCanvasRef} style={styles.visualizerCanvas} />
                <div style={styles.visualizerInfo}>
                  <p style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>LOG_DON_SEVERO_002.WAV</p>
                  <p style={{ color: 'var(--text-primary)', fontSize: '11px', marginTop: '4px', fontFamily: 'var(--font-hud)', lineHeight: '1.4' }}>
                    "...La invasión no vino de las estrellas, muchachos. La tecnología dormía bajo las ruinas del Altiplano. Cuando inyectamos el diésel adulterado con concentrado de neón chicha en las Cummins D-300, las chapas crujieron. Estaban vivas. Los colectivos no se detienen..."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LORE LIGHTBOX MODALS */}
      {activeItem === 'newspaper' && (
        <div style={styles.modalOverlay} onClick={closeItemModal}>
          <div style={styles.newspaperModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.newspaperHeader}>
              <span>DIARIO EXTRA DE LA PAZ — SENSACIONALISTA</span>
              <button style={styles.closeBtn} onClick={closeItemModal}>×</button>
            </div>
            
            <div style={styles.newspaperContent}>
              <h3 style={styles.newsTitle}>¿PARO DE TRANSPORTES O INVASIÓN ALIENÍGENA?</h3>
              <h4 style={styles.newsSubtitle}>Vecinos reportan Micros gigantescos parándose en dos patas sobre la Autopista</h4>
              
              <div style={styles.newsColumns}>
                <p style={styles.newsText}>
                  La noche paceña se estremeció no por bloqueos, sino por metal crujiente y ruidos de motor diésel ensordecedores. Reportes provenientes de la bajada de Munaypata y La Portada afirman que antiguos microbuses Dodge de la línea CH y Toyota Coaster comenzaron a deslizar sus paneles laterales, estirar pistones hidráulicos oxidados de dos metros y erigirse como gigantescos guardianes de metal en plena pendiente.
                  <br /><br />
                  ¿La causa? Fuentes clandestinas del sindicato revelan que <strong>antigua radiación cósmica</strong> concentrada en las ruinas arqueológicas del Altiplano y filtrada bajo los cimientos del teleférico, reaccionó químicamente con el diésel pesado. El Cummins de 1978 cobró vida autónoma.
                </p>
                
                <p style={styles.newsText}>
                  <strong>EL CONFLICTO PACEÑO: LA BATALLA DE FACCIONES</strong>
                  <br /><br />
                  <strong>1. Los Micros Clásicos (Los Libres / Rústicos):</strong> Colectivos ruidosos propulsados por puro diésel y la chispa andina. Organizados por Don Severo y los rudos choferes locales, luchan por mantener el libre albedrío, sus tradicionales rutas del Prado, y resistirse a la imposición tecnológica corporativa.
                  <br /><br />
                  <strong>2. Los PumaKataris (El Sistema / La Resistencia):</strong> Flota municipal de mechas ultra-tecnológicos, controlados por algoritmos y blindaje militar de "Altiplano Cyber-Systems". Buscan implantar orden, telemetrías rígidas y suprimir el caos tradicional de la ciudad con cañones de gas y escudos de fotones celestes.
                </p>
              </div>

              <div style={styles.newsFooter}>
                <span>EDICIÓN BAJO CONTROL GENERAL DEL SINDICATO REBELDE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeItem === 'blueprint' && (
        <div style={styles.modalOverlay} onClick={closeItemModal}>
          <div style={styles.blueprintModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.blueprintHeader}>
              <span className="neon-text-blue" style={{ fontFamily: 'var(--font-hud)' }}>
                SINDICATO DE COMBATE: DIAGNÓSTICO DE LA GUERRA URBANA
              </span>
              <button style={styles.closeBtnBlue} onClick={closeItemModal}>×</button>
            </div>

            <div style={styles.blueprintContent}>
              <div style={styles.schematicWrapper}>
                <svg viewBox="0 0 500 400" style={styles.blueSvg}>
                  <rect x="0" y="0" width="500" height="400" fill="none" stroke="#2563eb" strokeWidth="1" />
                  <path d="M 0,100 H 500 M 0,200 H 500 M 0,300 H 500 M 100,0 V 400 M 200,0 V 400 M 300,0 V 400 M 400,0 V 400" stroke="rgba(37,99,235,0.25)" strokeWidth="0.5" />
                  
                  {/* Exploded Mecha microbus diagram */}
                  <g stroke="var(--neon-blue)" strokeWidth="1.2" fill="none" filter="drop-shadow(0 0 5px var(--neon-blue-glow))">
                    <path d="M 80,180 L 120,90 L 380,90 L 420,180 L 400,260 L 100,260 Z" strokeDasharray="3 4" strokeWidth="1" />
                    
                    {/* Head Core */}
                    <rect x="140" y="110" width="40" height="40" rx="4" />
                    <circle cx="160" cy="130" r="8" />
                    <line x1="160" y1="130" x2="190" y2="130" />
                    
                    {/* Cyber energy Reactor */}
                    <polygon points="210,180 290,180 310,240 190,240" />
                    <circle cx="250" cy="210" r="14" />
                    <path d="M 235,210 H 265 M 250,195 V 225 M 240,200 L 260,220 M 240,220 L 260,200" />
                    
                    {/* Leg hydraulic thrusters */}
                    <line x1="130" y1="260" x2="130" y2="340" />
                    <rect x="120" y="280" width="20" height="30" />
                    <line x1="370" y1="260" x2="370" y2="340" />
                    <rect x="360" y="280" width="20" height="30" />
                    
                    <line x1="160" y1="110" x2="220" y2="50" strokeDasharray="2 2" />
                    <text x="230" y="46" fill="#93c5fd" fontFamily="var(--font-hud)" fontSize="9">NÚCLEO DRIVER-CHASSIS [CABINA]</text>

                    <line x1="250" y1="195" x2="250" y2="70" strokeDasharray="2 2" />
                    <text x="230" y="66" fill="#93c5fd" fontFamily="var(--font-hud)" fontSize="9">REACTOR CRISTAL DIÉSEL DE PRESIÓN</text>
                  </g>
                </svg>
              </div>

              {/* Specs Panel */}
              <div style={styles.specsPanel}>
                <h4 style={{ color: 'var(--neon-blue)', marginBottom: '8px' }}>UTA-SYSTEMS S-45 REBELDE</h4>
                <div style={styles.specGrid}>
                  <div>ESTRUCTURA: MICROS CLÁSICOS (LOS LIBRES)</div>
                  <div>RIVAL: LOS PUMAKATARI (EL SISTEMA)</div>
                  <div>NÚCLEO MOTOR: CUMMINS CON EXTRACTO DE NEÓN CHICHA</div>
                  <div>PROPÓSITO: LIBERACIÓN DE RUTAS Y CAOS CALLEJERO</div>
                  <div>DIAGNÓSTICO: ADAPTACIÓN RÚSTICA RESILIENTE (100%)</div>
                </div>
                <p style={{ marginTop: '12px', fontSize: '11px', color: '#93c5fd', lineHeight: '1.4' }}>
                  ¡AL FONDO HAY CAMPO! Los viejos colectivos paceños no toleran chips corporativos. Defiende tu ruta en las pendientes de Munaypata y Sopocachi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
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
    padding: '120px 40px 100px 40px',
    overflow: 'visible',
    transition: 'background 0.45s ease',
  },
  lightingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at 50% 60%, var(--neon-blue-glow) 0%, transparent 70%)',
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
    color: 'var(--neon-blue)',
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
  workbenchTable: {
    width: '100%',
    maxWidth: '1000px',
    height: '240px',
    position: 'relative',
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    zIndex: 5,
  },
  microFloorPlate: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '14px',
    background: 'linear-gradient(to bottom, var(--border-metal) 0%, #1c1917 100%)',
    border: '1.5px solid var(--border-metal)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
    borderRadius: '4px',
  },
  floorRib: {
    position: 'absolute',
    left: '2%',
    right: '2%',
    height: '4px',
    background: '#1c1917',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    borderBottom: '1px solid rgba(0,0,0,0.5)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  },
  coinBs: {
    position: 'absolute',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #78350f 100%)',
    border: '2px solid #f59e0b',
    boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
  },
  coinLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '6px',
    fontWeight: 'bold',
    color: '#fef3c7',
  },
  itemsGrid: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    paddingBottom: '16px',
    zIndex: 12,
    flexWrap: 'wrap',
    gap: '20px',
  },
  tableItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'var(--bg-card)',
    border: '1.5px solid var(--border-metal)',
    borderRadius: '6px',
    padding: '12px',
    transition: 'all 0.25s ease',
    position: 'relative',
  },
  itemBadge: {
    fontFamily: 'var(--font-hud)',
    fontSize: '8px',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    letterSpacing: '1px',
  },
  itemSvg: {
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
    transition: 'all 0.2s ease',
  },
  itemLabel: {
    fontFamily: 'var(--font-mecha)',
    fontWeight: 'bold',
    fontSize: '11px',
    letterSpacing: '1px',
    marginTop: '10px',
    color: 'var(--text-primary)',
  },
  hoverBubble: {
    position: 'absolute',
    bottom: '105%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '210px',
    background: 'rgba(5, 10, 8, 0.95)',
    border: '1.5px solid var(--neon-blue)',
    boxShadow: '0 0 15px var(--neon-blue-glow)',
    borderRadius: '6px',
    padding: '10px',
    zIndex: 150,
    fontFamily: 'var(--font-hud)',
    textAlign: 'left',
    animation: 'shake-mild 0.3s ease-out',
  },
  hoverBubbleHeader: {
    fontSize: '8px',
    color: 'var(--neon-blue)',
    fontWeight: 'bold',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  hoverBubbleBody: {
    fontSize: '10px',
    color: '#e0f2fe',
    lineHeight: '1.3',
  },
  hoverBubbleArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: '8px solid var(--neon-blue)',
  },
  crtContainer: {
    width: '100%',
    maxWidth: '850px',
    background: '#040508',
    border: '2px solid var(--border-metal)',
    borderRadius: '8px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(57,255,20,0.05)',
    marginTop: '60px',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 5,
  },
  crtScan: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
    backgroundSize: '100% 4px',
    pointerEvents: 'none',
    opacity: 0.15,
  },
  crtHeader: {
    background: 'var(--bg-dark)',
    borderBottom: '1px solid var(--border-metal)',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--text-primary)',
    fontSize: '11px',
    letterSpacing: '1.5px',
  },
  greenPulse: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--neon-green)',
    boxShadow: '0 0 8px var(--neon-green)',
    animation: 'neon-pulse-green 1s infinite alternate',
  },
  crtBody: {
    padding: '20px',
    minHeight: '160px',
  },
  logsArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    textAlign: 'left',
    fontFamily: 'var(--font-hud)',
    fontSize: '12px',
    color: '#86efac',
    maxHeight: '180px',
    overflowY: 'auto',
  },
  logLine: {
    borderLeft: '2px stroke rgba(57, 255, 20, 0.3)',
    paddingLeft: '10px',
    lineHeight: '1.4',
  },
  visualizerArea: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '20px',
    alignItems: 'center',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  visualizerCanvas: {
    width: '100%',
    height: '110px',
    background: '#06070c',
    border: '1px solid #1f2937',
    borderRadius: '4px',
  },
  visualizerInfo: {
    textAlign: 'left',
    fontFamily: 'var(--font-hud)',
    fontSize: '12px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    padding: '20px',
  },
  newspaperModal: {
    background: '#fcfbf7', // physical newsprint paper look
    color: '#292524',
    border: '15px solid #292524',
    borderRadius: '2px',
    maxWidth: '650px',
    width: '100%',
    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
  },
  newspaperHeader: {
    background: '#292524',
    color: '#fcfbf7',
    padding: '8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'var(--font-hud)',
    fontSize: '10px',
    letterSpacing: '2px',
  },
  closeBtn: {
    background: 'none',
    color: '#fcfbf7',
    fontSize: '24px',
    lineHeight: 1,
    padding: '0 4px',
  },
  newspaperContent: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'var(--font-typewriter)',
  },
  newsTitle: {
    fontFamily: 'var(--font-typewriter)',
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: '1.1',
    borderBottom: '3px double #292524',
    paddingBottom: '10px',
    width: '100%',
    color: '#cc1111', // Sensationalist red title
  },
  newsSubtitle: {
    fontSize: '13px',
    marginTop: '10px',
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#57534e',
    borderBottom: '1px solid #292524',
    paddingBottom: '12px',
    width: '100%',
    marginBottom: '20px',
  },
  newsColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    textAlign: 'justify',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  newsText: {
    fontSize: '12px',
    lineHeight: '1.65',
  },
  newsFooter: {
    marginTop: '25px',
    borderTop: '1px solid #292524',
    paddingTop: '10px',
    width: '100%',
    fontSize: '10px',
    textAlign: 'center',
    color: '#78716c',
  },
  blueprintModal: {
    background: '#020617',
    border: '3px solid var(--neon-blue)',
    boxShadow: '0 0 35px var(--neon-blue-glow)',
    borderRadius: '8px',
    maxWidth: '850px',
    width: '100%',
  },
  blueprintHeader: {
    background: '#090d16',
    borderBottom: '2px solid #1e293b',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    letterSpacing: '2px',
  },
  closeBtnBlue: {
    background: 'none',
    color: 'var(--neon-blue)',
    fontSize: '24px',
    lineHeight: 1,
    padding: '0 4px',
  },
  blueprintContent: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '20px',
    padding: '24px',
    alignItems: 'center',
    '@media (max-width: 800px)': {
      gridTemplateColumns: '1fr',
    },
  },
  schematicWrapper: {
    border: '1px solid #1e40af',
    borderRadius: '4px',
    overflow: 'hidden',
    background: '#020813',
  },
  blueSvg: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  specsPanel: {
    background: '#090d16',
    border: '1px solid #1e293b',
    borderRadius: '4px',
    padding: '16px',
    textAlign: 'left',
  },
  specGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px',
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    color: '#93c5fd',
    borderTop: '1px solid #1e293b',
    paddingTop: '12px',
    marginTop: '6px',
  },
};

export default LoreTable;
