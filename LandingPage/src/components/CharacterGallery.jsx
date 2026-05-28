import { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';

const charactersData = [
  {
    id: 'katari',
    name: 'PrimeKatari',
    class: 'Autobús Municipal PumaKatari v3.2',
    faction: 'Altiplano Cyber-Systems',
    habilidad: 'Wi-Fi de la Justicia',
    color: 'var(--neon-blue)',
    glowColor: 'var(--neon-blue-glow)',
    stats: { speed: 65, power: 85, chicha: 70, chassis: 90 },
    lore: 'El líder del grupo y el único que todavía intenta mantener algo de dignidad en medio del caos. Es enorme, elegante y está lleno de detalles. Siempre anda limpio, encerado y oliendo a nuevo, algo rarísimo entre tanto humo y polvo. Su problema eterno es que es demasiado ancho para callecitas paceña y cada vez que intenta transformarse termina bloqueando media avenida igual no como si un bloqueo sea un problema en la ciudad Maravilla.',
    specifications: [
      { label: 'CHASIS', value: 'Carrocería King Long 12m Modificada' },
      { label: 'NÚCLEO', value: 'Generador de Fusión Andina a Quinua' },
      { label: 'PODER ESPECIAL', value: 'Wi-Fi de la Justicia: Activa una señal mística que obliga a todos a formar fila y respetar turnos.' },
      { label: 'TÁCTICA', value: 'Hace perder tiempo buscando sencillo y desestabiliza con mirada de funcionario serio.' }
    ]
  },
  {
    id: 'micro',
    name: 'Microtron',
    class: 'Dodge D-300 Clásico (1978)',
    faction: 'Sindicato Rebelde del Colectivo Rayo',
    habilidad: 'Rayo Voceador',
    color: 'var(--neon-green)',
    glowColor: 'var(--neon-green-glow)',
    stats: { speed: 50, power: 90, chicha: 98, chassis: 95 },
    lore: 'Viejo, pesado, ruidoso y más lento que obra de alcalde. Cada movimiento suyo viene acompañado de eructos de diésel, humo negro y abundante. Está lleno de bultos, aguayos y bolsas misteriosas que nadie sabe quién dejó ahí. Sus asientos de tela barata sobrevivieron desde la guerra del chaco y su motor funciona a pura fe, aceite reciclado y trancadera.',
    specifications: [
      { label: 'CHASIS', value: 'Dodge D-300 Heavy Metal Body' },
      { label: 'STICKERS', value: '“Tu envidia es mi potencia”, “A mí no me nadie”, “Si me chocas, me mejoras”' },
      { label: 'PODER ESPECIAL', value: 'Rayo Voceador: Lanza un grito sónico de “¡al fondo que hay campo!”' },
      { label: 'EFECTO', value: 'Comprime el espacio y mete veinte enemigos donde solo cabían tres.' }
    ]
  },
  {
    id: 'dorado',
    name: 'elDoradee',
    class: 'HN Flota El Dorado Heavy Cruiser',
    faction: 'Sindicato Interprovincial de Ruta Larga',
    habilidad: 'Efecto Somnoliento',
    color: 'var(--neon-yellow)',
    glowColor: 'var(--neon-yellow-glow)',
    stats: { speed: 75, power: 95, chicha: 88, chassis: 85 },
    lore: 'El gigante interdepartamental del equipo. Grande, resistente y construido para sobrevivir caminos destruidos, bloqueos eternos y viajes de 18 horas sin descanso. Es medio loquillo se pone a adelantar 5 camiones en una curva, pero es su manera de ser. Fanático de las películas aleatorias y de cargar el celular a ultima hora. Pero no le pregunten del olor porque voces dicen que a veces huele a chisito o peor cof cof.',
    specifications: [
      { label: 'CHASIS', value: 'Chasis Flota de Lujo Doble Eje' },
      { label: 'TATUAJES', value: '“Dios guía mi camino”, “No corro, vuelo bajito”, “Prohibido enamorarse...”' },
      { label: 'PODER ESPECIAL', value: 'Efecto Somnoliento: Hace que cualquiera caiga dormido como pasajero a medianoche.' },
      { label: 'COMPADRE', value: 'Cuidadito con su compadre tío Kari.' }
    ]
  },
  {
    id: 'minibu',
    name: 'MiniBu',
    class: 'Toyota HiAce Microvan (1995)',
    faction: 'Asociación de Trameadores Cuánticos',
    habilidad: 'Trameaje Cuántico',
    color: 'var(--neon-chicha)',
    glowColor: 'var(--neon-chicha-glow)',
    stats: { speed: 90, power: 55, chicha: 95, chassis: 60 },
    lore: 'Pequeño, agresivo y totalmente impredecible. Maneja como si estuviera compitiendo en Formula 1. Cambia de carril sin avisar, aparece de la nada y desaparece igual de rápido. Está lleno de rayones, golpes y marcas. Medio alzado su puerta es automatica.',
    specifications: [
      { label: 'STICKERS', value: '“No tengo la culpa de ser tan guapo” o “No soy rápido, ustedes son lentos”' },
      { label: 'CARGA TRASERA', value: 'Aguayos, cajas y hasta pollos vivos sin explicación lógica' },
      { label: 'PODER ESPECIAL', value: 'Trameaje Cuántico: Desaparece antes de llegar al destino si la pelea se complica.' },
      { label: 'MONETIZACIÓN', value: 'Aún así cobra doble tramo a todos los involucrados.' }
    ]
  },
  {
    id: 'huevito',
    name: 'HueviTron',
    class: 'Toyota Corolla Huevito (1992)',
    faction: 'El Espía Rápido (Chasqui Trufi)',
    habilidad: 'Escape Libre Estrepitoso',
    color: 'var(--neon-red)',
    glowColor: 'var(--neon-red-glow)',
    stats: { speed: 95, power: 45, chicha: 85, chassis: 50 },
    lore: 'El tuneado extremo del grupo y el más waso. Tiene tantas modificaciones que ya parece un rompecabezas armado con piezas de cinco autos distintos. Lleva luces LED exageradas, alerón inútil y escape escandaloso que suena como petardo en marcha. Con música a todo volumen y un ambientador de pino de 2001.',
    specifications: [
      { label: 'STICKERS', value: '“Espacio para 3 gatitas”, “Peligro: conductor romántico”' },
      { label: 'MODIFICACIÓN', value: 'Luz LED exagerada y alerón de plástico inútil' },
      { label: 'PODER ESPECIAL', value: 'Escape Libre Estrepitoso: Explota el escape con un estruendo sónico alarmante.' },
      { label: 'TÁCTICA', value: 'Escapa lentamente haciendo ruido innecesario mientras creen que pasó algo grave.' }
    ]
  }
];

const bocetoImages = {
  katari: '/imgs/bocetopuma.jpeg',
  micro: '/imgs/bocetomicro.jpeg',
  dorado: '/imgs/bocetodoradee.jpeg',
  minibu: '/imgs/bocetomini.jpeg',
  huevito: '/imgs/bocetohuevito.jpeg'
};

const CharacterGallery = () => {
  const [activeChar, setActiveChar] = useState(charactersData[0]);
  const [activePhase, setActivePhase] = useState(4); // 1: Boceto, 2: Wireframe, 3: Textura, 4: Render Final
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Trigger laser scanner sweep when isScanning is active
  useEffect(() => {
    if (!isScanning) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
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

  const handleCharSelect = (char) => {
    if (char.id === activeChar.id) return;
    soundManager.playTapeClick();
    soundManager.playNeonFlicker();
    setActiveChar(char);
    setIsScanning(true);
    setScanProgress(0);
    soundManager.playSliderTick(activePhase);
    soundManager.playRadioStatic(0.2);
  };

  const handlePhaseChange = (phase) => {
    if (phase === activePhase) return;
    soundManager.playTapeClick();
    soundManager.playSliderTick(phase);
    setActivePhase(phase);
    setIsScanning(true);
    setScanProgress(0);
    soundManager.playRadioStatic(0.2);
  };

  const getPhaseName = () => {
    switch (activePhase) {
      case 1: return 'Fase 1: Concepción Rústica (Lápiz)';
      case 2: return 'Fase 2: Estructura 3D (Wireframe Holograma)';
      case 3: return 'Fase 3: Blindaje Paceño (Metal y Calcas)';
      case 4: return 'Fase 4: Operativo en Ruta (Render Final)';
      default: return '';
    }
  };

  // Render internal procedural SVGs for 5 characters x 4 phases
  const renderMechaSvg = () => {
    const charId = activeChar.id;
    const phase = activePhase;

    // Background & grid configurations
    let strokeColor = 'var(--text-primary)';
    let strokeWidth = '1.5';

    if (phase === 1) {
      strokeColor = '#4b5563'; // graphite pencil look
      strokeWidth = '1.2';
    } else if (phase === 2) {
      strokeColor = 'var(--neon-blue)'; // neon wireframe
      strokeWidth = '0.9';
    }

    const renderSketchDecorations = () => (
      <g opacity="0.45" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 3">
        {/* Draw technical grids and annotations */}
        <line x1="50" y1="150" x2="450" y2="150" />
        <line x1="250" y1="20" x2="250" y2="280" />
        <circle cx="250" cy="150" r="100" />
        <rect x="70" y="40" width="360" height="220" />
        <text x="80" y="55" fontFamily="var(--font-hud)" fontSize="8" fill="var(--text-secondary)">EJE X-CERO: COMPRESIÓN SUSPENSIÓN</text>
        <text x="310" y="250" fontFamily="var(--font-hud)" fontSize="8" fill="var(--text-secondary)">MODELADO PROCEDIMENTAL v1.8</text>
      </g>
    );

    const renderWireframeNodes = (points) => {
      if (phase !== 2) return null;
      return (
        <g fill="#00ffff" style={{ filter: 'drop-shadow(0 0 3px rgba(0,255,255,0.8))' }}>
          {points.map((pt, i) => (
            <circle key={i} cx={pt[0]} cy={pt[1]} r="3" />
          ))}
        </g>
      );
    };

    // --- CHARACTER 1: PRIME KATARI (Puma Municipal) ---
    if (charId === 'katari') {
      const nodes = [[160,80], [340,80], [360,180], [330,230], [170,230], [140,180], [250,50], [210,130], [290,130]];
      
      switch (phase) {
        case 1: // Sketch
          return (
            <g>
              {renderSketchDecorations()}
              <g stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.75" strokeLinecap="round">
                {/* Outer rough sketch paths */}
                <path d="M 160,80 L 340,80 L 360,180 L 330,230 L 170,230 L 140,180 Z" />
                <path d="M 163,83 L 337,83 L 357,178 L 327,227 L 173,227 L 143,178 Z" strokeDasharray="2 1" />
                {/* Windshield */}
                <rect x="180" y="100" width="140" height="40" />
                {/* Puma ears/horns concept */}
                <path d="M 160,80 L 140,50 L 190,80" />
                <path d="M 340,80 L 360,50 L 310,80" />
                {/* Wheels/Tracks representation */}
                <circle cx="190" cy="245" r="20" />
                <circle cx="310" cy="245" r="20" />
                {/* Antenna */}
                <line x1="250" y1="50" x2="250" y2="10" strokeWidth="2" />
                <circle cx="250" cy="10" r="4" />
                {/* Annotations */}
                <text x="260" y="25" fontFamily="var(--font-typewriter)" fontSize="10" fill="var(--text-secondary)">*Antena Wi-Fi*</text>
                <text x="350" y="130" fontFamily="var(--font-typewriter)" fontSize="9" fill="var(--text-secondary)">Blindaje Anti-Piedras</text>
              </g>
            </g>
          );
        case 2: // Wireframe
          return (
            <g>
              <g stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.9" filter="drop-shadow(0 0 4px var(--neon-blue-glow))">
                <polygon points="160,80 340,80 360,180 330,230 170,230 140,180" />
                <polygon points="180,100 320,100 320,140 180,140" />
                {/* Mesh linkages */}
                <line x1="160" y1="80" x2="180" y2="100" />
                <line x1="340" y1="80" x2="320" y2="100" />
                <line x1="360" y1="180" x2="320" y2="140" />
                <line x1="140" y1="180" x2="180" y2="140" />
                <line x1="250" y1="50" x2="250" y2="80" />
                {/* Inner skeleton lines */}
                <line x1="250" y1="80" x2="250" y2="230" />
                <line x1="140" y1="180" x2="360" y2="180" />
                <line x1="170" y1="230" x2="330" y2="230" />
                {/* Wheels */}
                <polygon points="175,230 190,260 205,230" />
                <polygon points="295,230 310,260 325,230" />
              </g>
              {renderWireframeNodes(nodes)}
            </g>
          );
        case 3: // Texture (Rusted metal plates + decals)
          return (
            <g>
              {/* Slate metal base plate representation */}
              <rect x="130" y="40" width="240" height="220" fill="#2d3748" rx="8" stroke="#4a5568" strokeWidth="3" opacity="0.3" />
              <g stroke="#3f4e66" strokeWidth="2">
                {/* Main heavy armor structure with rust patches */}
                <path d="M 160,80 L 340,80 L 360,180 L 330,230 L 170,230 L 140,180 Z" fill="#24334a" />
                {/* Rust spot overlays */}
                <path d="M 165,90 Q 180,95 190,82 Q 185,110 165,90" fill="#b45309" stroke="none" opacity="0.8" />
                <path d="M 320,200 Q 345,190 338,220 Q 320,210 320,200" fill="#7c2d12" stroke="none" opacity="0.85" />
                {/* Gritty plating seams & rivets */}
                <line x1="250" y1="80" x2="250" y2="230" stroke="#101726" strokeWidth="2.5" />
                <circle cx="250" cy="110" r="3" fill="#0f172a" />
                <circle cx="250" cy="160" r="3" fill="#0f172a" />
                <circle cx="250" cy="200" r="3" fill="#0f172a" />
                {/* Decal: Municipal Signage */}
                <rect x="180" y="145" width="140" height="30" fill="#090a0f" stroke="#00ffff" strokeWidth="1" />
                <text x="250" y="164" fill="#00ffff" fontFamily="var(--font-hud)" fontSize="9" fontWeight="bold" textAnchor="middle">
                  SINDICATO MUNICIPAL PACEÑO
                </text>
              </g>
            </g>
          );
        case 4: // Render Final (Fully Colored & Glowing)
          return (
            <g>
              {/* Underglow Reflected ground trail */}
              <ellipse cx="250" cy="250" rx="110" ry="12" fill="var(--neon-blue-glow)" filter="blur(6px)" />
              {/* City skyline glow background */}
              <path d="M 100,220 L 130,170 L 150,190 L 180,140 L 220,180 L 250,110 L 280,170 L 310,150 L 340,195 L 380,130 L 400,220 Z" fill="#0c111d" opacity="0.5" />
              <path d="M 250,110 L 290,170 L 210,170 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.3" /> {/* Illimani backdrop shadow */}
              
              <g stroke="#0f172a" strokeWidth="2">
                {/* Gorgeous blue & gold municipal paint job */}
                <path d="M 160,80 L 340,80 L 360,180 L 330,230 L 170,230 L 140,180 Z" fill="#1d4ed8" />
                {/* Decorative golden/yellow stripes */}
                <path d="M 160,80 L 250,80 L 250,230 L 170,230 Z" fill="#eab308" stroke="none" opacity="0.85" />
                
                {/* Holographic glowing visor windshield */}
                <rect x="180" y="100" width="140" height="40" fill="#020617" stroke="var(--neon-blue)" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 8px var(--neon-blue-glow))' }} />
                <path d="M 190,110 L 310,110 L 300,130 L 200,130 Z" fill="rgba(0, 229, 255, 0.25)" />
                
                {/* Heavy mechanical legs & shock-absorbers */}
                <path d="M 175,230 L 160,265 L 195,265" fill="#334155" />
                <path d="M 325,230 L 340,265 L 305,265" fill="#334155" />
                
                {/* Glowing LED Projector Headlights */}
                <circle cx="160" cy="205" r="8" fill="#eab308" style={{ filter: 'drop-shadow(0 0 10px var(--neon-yellow))' }} />
                <circle cx="340" cy="205" r="8" fill="#eab308" style={{ filter: 'drop-shadow(0 0 10px var(--neon-yellow))' }} />
                
                {/* Energized Antennas */}
                <line x1="250" y1="80" x2="250" y2="25" stroke="var(--neon-blue)" strokeWidth="2" />
                <circle cx="250" cy="25" r="5" fill="var(--neon-blue)" style={{ filter: 'drop-shadow(0 0 12px var(--neon-blue))' }} />
                <circle cx="250" cy="25" r="12" fill="none" stroke="var(--neon-blue-glow)" strokeWidth="1" strokeDasharray="3 3" />
                
                <text x="250" y="175" fill="#ffffff" fontFamily="var(--font-hud)" fontSize="9" fontWeight="bold" textAnchor="middle">
                  PUMA KATARI
                </text>
              </g>
            </g>
          );
      }
    }

    // --- CHARACTER 2: MICROTRON (Colectivo Dodge) ---
    if (charId === 'micro') {
      const nodes = [[150,110], [350,110], [370,210], [310,240], [190,240], [130,210], [250,80]];
      
      switch (phase) {
        case 1:
          return (
            <g>
              {renderSketchDecorations()}
              <g stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.75" strokeLinecap="round">
                <path d="M 150,110 Q 250,70 350,110 L 370,210 L 310,240 L 190,240 L 130,210 Z" />
                <rect x="180" y="125" width="140" height="35" rx="5" />
                {/* Grill teeth details */}
                <rect x="200" y="180" width="100" height="30" />
                <line x1="220" y1="180" x2="220" y2="210" />
                <line x1="250" y1="180" x2="250" y2="210" />
                <line x1="280" y1="180" x2="280" y2="210" />
                {/* Wheels */}
                <circle cx="170" cy="250" r="22" />
                <circle cx="330" cy="250" r="22" />
                <text x="120" y="90" fontFamily="var(--font-typewriter)" fontSize="9" fill="var(--text-secondary)">Fig 2. Dodge D-300 Sindicato Rebelde</text>
              </g>
            </g>
          );
        case 2:
          return (
            <g>
              <g stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.9" filter="drop-shadow(0 0 4px var(--neon-green-glow))">
                <polygon points="150,110 250,80 350,110 370,210 310,240 190,240 130,210" />
                <polygon points="180,125 320,125 320,160 180,160" />
                <polygon points="200,180 300,180 300,210 200,210" />
                {/* Radial lines and link webbing */}
                <line x1="250" y1="80" x2="250" y2="125" />
                <line x1="150" y1="110" x2="180" y2="125" />
                <line x1="350" y1="110" x2="320" y2="125" />
                <line x1="130" y1="210" x2="200" y2="210" />
                <line x1="370" y1="210" x2="300" y2="210" />
                <line x1="250" y1="160" x2="250" y2="180" />
                {/* Cybernetic leg joint pivots */}
                <circle cx="170" cy="240" r="6" />
                <circle cx="330" cy="240" r="6" />
              </g>
              {renderWireframeNodes(nodes)}
            </g>
          );
        case 3:
          return (
            <g>
              <rect x="120" y="60" width="260" height="200" fill="#2d2a29" rx="12" stroke="#44403c" strokeWidth="3" opacity="0.2" />
              <g stroke="#3a3530" strokeWidth="2">
                <path d="M 150,110 Q 250,75 350,110 L 370,210 L 310,240 L 190,240 L 130,210 Z" fill="#57534e" />
                {/* Heavy greasy metal plates */}
                <path d="M 160,120 L 250,120 L 250,230 L 180,230 Z" fill="#44403c" />
                {/* Rust spot patches */}
                <ellipse cx="160" cy="180" rx="15" ry="8" fill="#7c2d12" stroke="none" opacity="0.9" />
                <path d="M 330,170 Q 360,185 340,200 Z" fill="#b45309" stroke="none" opacity="0.8" />
                {/* Old retro window frame */}
                <rect x="180" y="125" width="140" height="35" fill="#1c1917" stroke="#b45309" strokeWidth="1.5" />
                {/* Decal "GUÍAME VIRGEN" */}
                <path d="M 190,170 H 310" stroke="#ffffff" strokeWidth="4" opacity="0.3" />
                <text x="250" y="172" fill="#ffea00" fontFamily="var(--font-hud)" fontSize="7" fontWeight="bold" textAnchor="middle">
                  VIRGEN DE COPACABANA GUÍAME
                </text>
              </g>
            </g>
          );
        case 4:
          return (
            <g>
              {/* Vibrant green laser trails & smoke underglow */}
              <ellipse cx="250" cy="255" rx="120" ry="14" fill="var(--neon-green-glow)" filter="blur(6px)" />
              {/* Cyber chicha warning stripes background decoration */}
              <g opacity="0.2">
                <path d="M 80,100 L 120,60 H 140 L 100,100 Z" fill="var(--neon-yellow)" />
                <path d="M 130,100 L 170,60 H 190 L 150,100 Z" fill="var(--neon-yellow)" />
                <path d="M 310,100 L 350,60 H 370 L 330,100 Z" fill="var(--neon-yellow)" />
              </g>

              <g stroke="#0f172a" strokeWidth="2">
                {/* Classic Sky Blue & Red retro colectivo stripes */}
                <path d="M 150,110 Q 250,75 350,110 L 370,210 L 310,240 L 190,240 L 130,210 Z" fill="#f8fafc" />
                {/* Heavy red lower base block paint */}
                <path d="M 134,180 L 366,180 L 360,215 L 310,240 L 190,240 L 140,215 Z" fill="#ef4444" />
                {/* Classic green and yellow side lines */}
                <path d="M 140,150 Q 250,120 360,150 L 364,168 Q 250,138 136,168 Z" fill="#22c55e" />
                
                {/* CRT display screen for microbus route */}
                <rect x="180" y="115" width="140" height="30" fill="#090a0f" stroke="var(--neon-green)" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px var(--neon-green-glow))' }} />
                <text x="250" y="133" fill="var(--neon-green)" fontFamily="var(--font-hud)" fontSize="9" fontWeight="bold" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 3px var(--neon-green))' }}>
                  COLECTIVO RAYO • H1
                </text>
                
                {/* Massive armored chrome engine grille teeth */}
                <rect x="200" y="180" width="100" height="30" rx="3" fill="#475569" stroke="#94a3b8" />
                <line x1="220" y1="180" x2="220" y2="210" stroke="#e2e8f0" strokeWidth="2" />
                <line x1="235" y1="180" x2="235" y2="210" stroke="#e2e8f0" strokeWidth="2" />
                <line x1="250" y1="180" x2="250" y2="210" stroke="#e2e8f0" strokeWidth="2" />
                <line x1="265" y1="180" x2="265" y2="210" stroke="#e2e8f0" strokeWidth="2" />
                <line x1="280" y1="180" x2="280" y2="210" stroke="#e2e8f0" strokeWidth="2" />
                
                {/* Glowing neon headlights with light beams */}
                <circle cx="165" cy="205" r="11" fill="var(--neon-yellow)" style={{ filter: 'drop-shadow(0 0 12px var(--neon-yellow))' }} />
                <circle cx="335" cy="205" r="11" fill="var(--neon-yellow)" style={{ filter: 'drop-shadow(0 0 12px var(--neon-yellow))' }} />
                {/* Laser Ray Voceador Megaphones on roof corners */}
                <path d="M 140,105 L 120,95 L 125,85 L 145,98 Z" fill="#475569" />
                <path d="M 360,105 L 380,95 L 375,85 L 355,98 Z" fill="#475569" />
                <ellipse cx="120" cy="90" rx="4" ry="7" fill="var(--neon-green)" style={{ filter: 'drop-shadow(0 0 8px var(--neon-green))' }} />
                
                {/* Heavy mechanical wheel-legs */}
                <rect x="175" y="240" width="22" height="15" fill="#1e293b" />
                <rect x="303" y="240" width="22" height="15" fill="#1e293b" />
              </g>
            </g>
          );
      }
    }

    // --- CHARACTER 3: EL DORADEE (Flota El Dorado) ---
    if (charId === 'dorado') {
      const nodes = [[140,70], [360,70], [370,190], [340,240], [160,240], [130,190], [250,40], [170,130], [330,130]];

      switch (phase) {
        case 1:
          return (
            <g>
              {renderSketchDecorations()}
              <g stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.75" strokeLinecap="round">
                {/* Giant long fleet profile */}
                <path d="M 140,70 L 360,70 L 370,190 L 340,240 L 160,240 L 130,190 Z" />
                <line x1="140" y1="130" x2="360" y2="130" />
                {/* Dual smokestack sketch */}
                <line x1="150" y1="70" x2="150" y2="20" strokeWidth="2.5" />
                <line x1="350" y1="70" x2="350" y2="20" strokeWidth="2.5" />
                {/* Panoramic double deck windows */}
                <rect x="170" y="80" width="160" height="35" />
                <rect x="170" y="140" width="160" height="35" />
                {/* Rear text annotation */}
                <text x="365" y="100" fontFamily="var(--font-typewriter)" fontSize="8" fill="var(--text-secondary)">*Doble smokestack*</text>
                <text x="80" y="245" fontFamily="var(--font-typewriter)" fontSize="8" fill="var(--text-secondary)">Pesado Interprovincial</text>
              </g>
            </g>
          );
        case 2:
          return (
            <g>
              <g stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.9" filter="drop-shadow(0 0 4px var(--neon-yellow-glow))">
                <polygon points="140,70 360,70 370,190 340,240 160,240 130,190" />
                <line x1="140" y1="130" x2="360" y2="130" />
                <polygon points="170,80 330,80 330,115 170,115" />
                <polygon points="170,140 330,140 330,175 170,175" />
                {/* Vertical support columns */}
                <line x1="210" y1="70" x2="210" y2="240" />
                <line x1="290" y1="70" x2="290" y2="240" />
                {/* Exhaust chimneys */}
                <line x1="150" y1="70" x2="150" y2="30" />
                <line x1="350" y1="70" x2="350" y2="30" />
              </g>
              {renderWireframeNodes(nodes)}
            </g>
          );
        case 3:
          return (
            <g>
              <rect x="110" y="30" width="280" height="230" fill="#2d221a" rx="10" stroke="#5c4533" strokeWidth="3" opacity="0.2" />
              <g stroke="#3e3025" strokeWidth="2">
                <path d="M 140,70 L 360,70 L 370,190 L 340,240 L 160,240 L 130,190 Z" fill="#78350f" />
                {/* Rusted heavy structural chassis */}
                <path d="M 150,80 H 350 V 125 H 150 Z" fill="#451a03" />
                <path d="M 150,135 H 350 V 180 H 150 Z" fill="#451a03" />
                {/* Rust blobs and scrapes */}
                <path d="M 145,90 Q 155,100 135,115 Z" fill="#b45309" stroke="none" />
                <path d="M 350,150 Q 365,160 345,175 Z" fill="#7c2d12" stroke="none" />
                {/* Decal "EL DORADO" rear quote */}
                <text x="250" y="210" fill="#f59e0b" fontFamily="var(--font-hud)" fontSize="9" fontWeight="bold" textAnchor="middle">
                  EL DORADO • EL REY DE LA RUTA
                </text>
              </g>
            </g>
          );
        case 4:
          return (
            <g>
              {/* Ground golden neon reflection */}
              <ellipse cx="250" cy="255" rx="130" ry="15" fill="var(--neon-yellow-glow)" filter="blur(7px)" />
              
              <g stroke="#0f172a" strokeWidth="2">
                {/* Main heavy armor: Majestic gold chassis with sleek black accents */}
                <path d="M 140,70 L 360,70 L 370,190 L 340,240 L 160,240 L 130,190 Z" fill="#f59e0b" />
                {/* Black styling layers */}
                <path d="M 140,70 H 360 L 350,130 H 150 Z" fill="#1e293b" />
                
                {/* Top deck panoramic windscreen (neon glowing yellow) */}
                <rect x="170" y="80" width="160" height="35" fill="#020617" stroke="var(--neon-yellow)" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px var(--neon-yellow-glow))' }} />
                
                {/* Bottom deck VIP passenger compartment */}
                <rect x="170" y="140" width="160" height="35" fill="#020617" stroke="var(--neon-yellow)" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px var(--neon-yellow-glow))' }} />
                <path d="M 180,145 H 320" stroke="var(--neon-yellow)" strokeWidth="1" strokeDasharray="5 3" />
                
                {/* Chrome Dual Vertical Smokestacks emitting neon steam */}
                <line x1="148" y1="70" x2="148" y2="20" stroke="#cbd5e1" strokeWidth="4" />
                <line x1="352" y1="70" x2="352" y2="20" stroke="#cbd5e1" strokeWidth="4" />
                <path d="M 140,20 Q 148,5 156,20" stroke="var(--neon-yellow)" strokeWidth="1.5" fill="none" style={{ filter: 'drop-shadow(0 0 5px var(--neon-yellow))' }} />
                <path d="M 344,20 Q 352,5 360,20" stroke="var(--neon-yellow)" strokeWidth="1.5" fill="none" style={{ filter: 'drop-shadow(0 0 5px var(--neon-yellow))' }} />
                
                {/* Massive road-crusher armored wheels */}
                <circle cx="180" cy="242" r="16" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
                <circle cx="320" cy="242" r="16" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
                
                {/* Highly reflective rear neon plaque */}
                <text x="250" y="210" fill="#ffffff" fontFamily="var(--font-mecha)" fontSize="11" fontWeight="800" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 8px var(--neon-yellow))' }}>
                  EL DORADO
                </text>
              </g>
            </g>
          );
      }
    }

    // --- CHARACTER 4: MINIBU (Minibús HiAce) ---
    if (charId === 'minibu') {
      const nodes = [[170,110], [330,110], [345,190], [310,230], [190,230], [155,190], [250,75], [200,150], [300,150]];

      switch (phase) {
        case 1:
          return (
            <g>
              {renderSketchDecorations()}
              <g stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.75" strokeLinecap="round">
                {/* Flat nose boxy Japanese microvan */}
                <path d="M 170,110 L 330,110 L 345,190 L 310,230 L 190,230 L 155,190 Z" />
                {/* Side sliding door frame */}
                <path d="M 240,115 V 230 M 310,115 V 230 M 240,115 H 310 V 210 H 240 Z" />
                {/* Small front headlights */}
                <rect x="175" y="195" width="20" height="15" />
                <rect x="305" y="195" width="20" height="15" />
                {/* Letrero label */}
                <rect x="210" y="125" width="80" height="20" />
                <text x="315" y="145" fontFamily="var(--font-typewriter)" fontSize="8" fill="var(--text-secondary)">*Puerta Corrediza*</text>
                <text x="100" y="100" fontFamily="var(--font-typewriter)" fontSize="9" fill="var(--text-secondary)">Fig 4. Minibús Trameador</text>
              </g>
            </g>
          );
        case 2:
          return (
            <g>
              <g stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.9" filter="drop-shadow(0 0 4px var(--neon-chicha-glow))">
                <polygon points="170,110 330,110 345,190 310,230 190,230 155,190" />
                {/* Sliding door wireframe links */}
                <line x1="240" y1="110" x2="240" y2="230" />
                <line x1="290" y1="110" x2="290" y2="230" />
                <polygon points="190,120 310,120 310,155 190,155" />
                <line x1="170" y1="110" x2="190" y2="120" />
                <line x1="330" y1="110" x2="310" y2="120" />
                {/* Shock absorber nodes */}
                <circle cx="180" cy="240" r="4.5" />
                <circle cx="320" cy="240" r="4.5" />
              </g>
              {renderWireframeNodes(nodes)}
            </g>
          );
        case 3:
          return (
            <g>
              <rect x="135" y="65" width="230" height="190" fill="#291a27" rx="8" stroke="#54334f" strokeWidth="3" opacity="0.2" />
              <g stroke="#3a2536" strokeWidth="2">
                <path d="M 170,110 L 330,110 L 345,190 L 310,230 L 190,230 L 155,190 Z" fill="#5c4b57" />
                {/* Rusty side sliding door */}
                <path d="M 235,115 H 300 V 225 H 235 Z" fill="#40323d" />
                <path d="M 240,150 Q 260,175 250,195 Z" fill="#b45309" stroke="none" />
                {/* Decal "CEJA" route placard */}
                <rect x="200" y="125" width="100" height="20" fill="#09090b" stroke="#ffffff" />
                <text x="250" y="138" fill="#ff00ff" fontFamily="var(--font-hud)" fontSize="8" fontWeight="bold" textAnchor="middle">
                  CEJA - PRADO - OBRAJES
                </text>
              </g>
            </g>
          );
        case 4:
          return (
            <g>
              {/* Deep magenta/chicha underglow */}
              <ellipse cx="250" cy="245" rx="100" ry="12" fill="var(--neon-chicha-glow)" filter="blur(6px)" />
              
              <g stroke="#0f172a" strokeWidth="2">
                {/* Classic silver/white minibus body with dynamic green stripes */}
                <path d="M 170,110 L 330,110 L 345,190 L 310,230 L 190,230 L 155,190 Z" fill="#e2e8f0" />
                {/* Chicha magenta racing stripe */}
                <path d="M 160,170 H 340 L 345,188 H 155 Z" fill="var(--neon-chicha)" />
                {/* Emerald green secondary stripe */}
                <path d="M 163,188 H 337 L 341,202 H 159 Z" fill="#10b981" />
                
                {/* Glowing neon destination signs in windshield */}
                <rect x="185" y="118" width="130" height="32" fill="#020617" stroke="var(--neon-chicha)" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px var(--neon-chicha-glow))' }} />
                <text x="250" y="138" fill="var(--neon-chicha)" fontFamily="var(--font-hud)" fontSize="9" fontWeight="bold" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 3px var(--neon-chicha))' }}>
                  TRAMEADOR • MULTIVERSE
                </text>
                
                {/* Glowing high-intensity front headlamps */}
                <circle cx="180" cy="210" r="9" fill="#00ffff" style={{ filter: 'drop-shadow(0 0 8px var(--neon-blue))' }} />
                <circle cx="320" cy="210" r="9" fill="#00ffff" style={{ filter: 'drop-shadow(0 0 8px var(--neon-blue))' }} />
                
                {/* Cyber leg joints */}
                <path d="M 195,230 L 180,255 L 205,255" fill="#475569" />
                <path d="M 305,230 L 320,255 L 295,255" fill="#475569" />
                
                {/* Flashing route stickers on passenger windows */}
                <rect x="200" y="162" width="22" height="6" fill="#facc15" stroke="none" />
                <rect x="226" y="162" width="22" height="6" fill="#f43f5e" stroke="none" />
              </g>
            </g>
          );
      }
    }

    // --- CHARACTER 5: HUEVITRON (Corolla Huevito) ---
    if (charId === 'huevito') {
      const nodes = [[160,140], [340,140], [360,200], [310,230], [190,230], [140,200], [250,110]];

      switch (phase) {
        case 1:
          return (
            <g>
              {renderSketchDecorations()}
              <g stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.75" strokeLinecap="round">
                {/* Low aerodynamic retro hatchback silhouette */}
                <path d="M 160,140 L 220,135 L 270,165 L 340,165 L 360,200 L 310,230 L 190,230 L 140,200 Z" />
                {/* Massive oversized rear wing spoiler */}
                <path d="M 155,140 L 140,110 L 175,110 L 170,140 Z" />
                {/* Huge exhaust pipe sketch */}
                <rect x="155" y="222" width="30" height="12" />
                <text x="325" y="130" fontFamily="var(--font-typewriter)" fontSize="8" fill="var(--text-secondary)">*Alerón deportivo*</text>
                <text x="210" y="245" fontFamily="var(--font-typewriter)" fontSize="8" fill="var(--text-secondary)">Escape Sónico de Plasma</text>
              </g>
            </g>
          );
        case 2:
          return (
            <g>
              <g stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.9" filter="drop-shadow(0 0 4px var(--neon-red-glow))">
                <polygon points="160,140 220,135 270,165 340,165 360,200 310,230 190,230 140,200" />
                {/* Spoiler wireframe */}
                <polygon points="155,140 140,110 175,110 170,140" />
                <line x1="140" y1="110" x2="175" y2="140" />
                {/* Exhaust tube wires */}
                <polygon points="155,222 185,222 185,232 155,232" />
                <line x1="190" y1="230" x2="250" y2="230" />
              </g>
              {renderWireframeNodes(nodes)}
            </g>
          );
        case 3:
          return (
            <g>
              <rect x="120" y="90" width="260" height="160" fill="#2d1a1d" rx="8" stroke="#5c3337" strokeWidth="3" opacity="0.2" />
              <g stroke="#3e2528" strokeWidth="2">
                <path d="M 160,140 L 220,135 L 270,165 L 340,165 L 360,200 L 310,230 L 190,230 L 140,200 Z" fill="#523c40" />
                {/* Rust spot patches on hood & trunk */}
                <ellipse cx="230" cy="150" rx="12" ry="5" fill="#7c2d12" stroke="none" />
                {/* Heavy oversized exhaust pipe of plasma */}
                <rect x="155" y="218" width="30" height="12" fill="#71717a" />
                <circle cx="155" cy="224" r="5" fill="#18181b" />
                {/* Decal logo chicha */}
                <text x="250" y="195" fill="#ff007f" fontFamily="var(--font-hud)" fontSize="9" fontWeight="bold" textAnchor="middle">
                  HUEVI-TRON • CHASQUI RAPIDO
                </text>
              </g>
            </g>
          );
        case 4:
          return (
            <g>
              {/* Neon pink ground trail underglow */}
              <ellipse cx="250" cy="245" rx="110" ry="11" fill="var(--neon-red-glow)" filter="blur(5px)" />
              {/* Backlight speed lines */}
              <line x1="100" y1="150" x2="140" y2="150" stroke="var(--neon-red)" strokeWidth="1" strokeDasharray="8 5" opacity="0.5" />
              <line x1="80" y1="180" x2="130" y2="180" stroke="var(--neon-red)" strokeWidth="1" strokeDasharray="12 4" opacity="0.5" />
              
              <g stroke="#0f172a" strokeWidth="2">
                {/* Sleek metallic dark paint with glowing pink trim strips */}
                <path d="M 160,140 L 220,135 L 270,165 L 340,165 L 360,200 L 310,230 L 190,230 L 140,200 Z" fill="#0f172a" />
                <path d="M 220,135 L 270,165 L 340,165 L 350,185 L 220,150 Z" fill="var(--neon-red)" />
                
                {/* High-profile futuristic carbon rear wing spoiler */}
                <path d="M 155,140 L 135,105 H 175 L 168,140 Z" fill="#1e293b" />
                <rect x="130" y="101" width="48" height="4" fill="var(--neon-red)" />
                
                {/* Highly customized visual glass windshield */}
                <polygon points="225,142 265,168 332,168 310,142" fill="#020617" stroke="var(--neon-red)" strokeWidth="1.5" />
                
                {/* Oversized plasma laser cannon exhaust pipe emitting neon red flames */}
                <rect x="150" y="215" width="35" height="15" rx="2" fill="#64748b" />
                <circle cx="148" cy="222.5" r="7.5" fill="#f43f5e" style={{ filter: 'drop-shadow(0 0 10px var(--neon-red))' }} />
                <path d="M 148,222.5 L 125,215 L 130,222.5 L 125,230 Z" fill="var(--neon-red)" opacity="0.85" />
                
                {/* Low profile sleek sports wheels */}
                <circle cx="210" cy="235" r="14" fill="#020617" stroke="var(--neon-red)" strokeWidth="2.5" />
                <circle cx="300" cy="235" r="14" fill="#020617" stroke="var(--neon-red)" strokeWidth="2.5" />
              </g>
            </g>
          );
      }
    }

    return null;
  };

  return (
    <section id="galeria" style={styles.section} className="grunge-texture scene-transition">
      <div style={styles.lightingOverlay} />

      <div className="cg-content-grid" style={styles.contentGrid}>
        
        {/* LEFT COLUMN: HANGAR TERMINAL SIDEBAR */}
        <div style={styles.hangarPanel} className="metal-panel">
          <div style={styles.panelHeader}>
            <span style={styles.panelLabel}>SELECCIÓN DE PROTOCOLO</span>
            <h4 style={styles.panelTitle}>EL GARAJE DE MECHAS</h4>
            <div style={styles.terminalStatusBar}>
              <div style={styles.terminalStatusDot} className="pulse-green" />
              <span style={{ fontSize: '9px', fontFamily: 'var(--font-hud)', color: 'var(--neon-green)' }}>CONEXIÓN HANGAR: ESTABLE</span>
            </div>
          </div>

          <div style={styles.charList}>
            {charactersData.map((char) => {
              const isActive = char.id === activeChar.id;
              return (
                <button
                  key={char.id}
                  onClick={() => handleCharSelect(char)}
                  onMouseEnter={() => soundManager.playNeonFlicker()}
                  className="shake-hover"
                  style={{
                    ...styles.charButton,
                    borderColor: isActive ? char.color : '#27272a',
                    boxShadow: isActive ? `0 0 15px ${char.glowColor}` : 'none',
                    background: isActive ? 'rgba(5, 6, 10, 0.9)' : 'var(--bg-deep)',
                  }}
                >
                  <div style={{ ...styles.colorIndicator, backgroundColor: char.color }} />
                  <div style={styles.charButtonContent}>
                    <span style={{
                      ...styles.charButtonName,
                      color: isActive ? '#f4f4f5' : 'var(--text-secondary)'
                    }}>
                      {char.name}
                    </span>
                    <span style={styles.charButtonClass}>{char.class}</span>
                  </div>
                  {isActive && (
                    <div style={{
                      ...styles.activeIndicatorDot,
                      backgroundColor: char.color,
                      boxShadow: `0 0 8px ${char.color}`
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          <div style={styles.hangarFooterStrip} className="warning-stripes" />
        </div>

        {/* CENTER COLUMN: CRT MONITOR VISUALIZER */}
        <div style={styles.monitorContainer} className="metal-panel">
          {/* Warning Stripes Bezel */}
          <div style={styles.monitorBezel} className="warning-stripes" />
          
          <div style={styles.screenInner}>
            <div style={styles.scanlines} />

            {/* Laser Line Scanner */}
            {isScanning && (
              <div style={{
                ...styles.laserLine,
                left: `${scanProgress}%`,
              }} />
            )}

            {/* Holographic Diagnostic HUD */}
            <div style={styles.hudOverlay}>
              <div style={styles.hudHeader}>
                <span style={{ color: activeChar.color, textShadow: `0 0 5px ${activeChar.color}` }}>
                  MONITOR DE DIAGNÓSTICO: {activeChar.name.toUpperCase()}
                </span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-hud)', fontSize: '9px' }}>
                  FASES: {activePhase}/4
                </span>
              </div>
              <div style={styles.hudFooter}>
                <span>ESTADO: COMPILANDO RENDERS</span>
                <span>SCANER: {isScanning ? 'ESCANEANDO...' : 'EN LINEA'}</span>
              </div>
            </div>

            {/* Render Sketch Image if Phase 1, otherwise render Procedural SVG */}
            <div style={styles.svgDisplay}>
              {activePhase === 1 ? (
                <img 
                  src={bocetoImages[activeChar.id]} 
                  alt={`Boceto de ${activeChar.name}`} 
                  style={styles.bocetoImage} 
                />
              ) : (
                renderMechaSvg()
              )}
            </div>

            {/* 4-STAGE ENGINEERING DIALS CONTROLLER */}
            <div style={styles.phaseController}>
              {[1, 2, 3, 4].map((phaseNum) => {
                const isActive = activePhase === phaseNum;
                return (
                  <button
                    key={phaseNum}
                    onClick={() => handlePhaseChange(phaseNum)}
                    className="shake-hover"
                    style={{
                      ...styles.phaseButton,
                      color: isActive ? activeChar.color : 'var(--text-secondary)',
                      borderColor: isActive ? activeChar.color : '#27272a',
                      background: isActive ? 'rgba(9, 10, 15, 0.95)' : 'rgba(5, 6, 10, 0.4)',
                      boxShadow: isActive ? `0 0 10px ${activeChar.glowColor}` : 'none',
                    }}
                  >
                    <span style={styles.phaseNumLabel}>{phaseNum}</span>
                    <span style={styles.phaseTextLabel}>
                      {phaseNum === 1 ? 'BOCETO' : phaseNum === 2 ? 'WIRE' : phaseNum === 3 ? 'TEXTURA' : 'RENDER'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TELEMETRY & MODELER LOG HUD */}
        <div style={styles.telemetryPanel} className="metal-panel">
          <div style={styles.cardHeader}>
            <span style={{ ...styles.cardLabel, color: activeChar.color }}>TELÉMETRIA DIRECTA</span>
            <h3 style={styles.cardTitle}>{activeChar.name}</h3>
            <span style={styles.cardSubTitle}>{activeChar.faction}</span>
          </div>

          {/* Core specs listing */}
          <div style={styles.specsList}>
            {activeChar.specifications.map((spec, i) => (
              <div key={i} style={styles.specItem}>
                <span style={styles.specLabel}>{spec.label}</span>
                <span style={styles.specValue}>{spec.value}</span>
              </div>
            ))}
          </div>

          {/* MODELLER'S LOG DIARY TEXT */}
          <div style={styles.logTerminal}>
            <div style={styles.logTermHeader}>
              <div style={{ ...styles.logTermDot, backgroundColor: activeChar.color }} />
              <span>BITÁCORA DEL MODELADOR</span>
            </div>
            <div style={styles.activePhaseLabel}>
              {getPhaseName()}
            </div>
            <p style={styles.logText}>
              {activeChar.lore}
            </p>
          </div>

          {/* TELEMETRY STATS PROGRESS BARS */}
          <div style={styles.statsContainer}>
            <span style={styles.statsTitle}>ESPECIFICACIONES DE RENDIMIENTO DE CALLE</span>
            
            {/* Speed Bar */}
            <div style={styles.statRow}>
              <div style={styles.statLabelGroup}>
                <span>VELOCIDAD DE PENDIENTE</span>
                <span>{activeChar.stats.speed}%</span>
              </div>
              <div style={styles.barOuter}>
                <div style={{
                  ...styles.barInner,
                  width: `${activeChar.stats.speed}%`,
                  backgroundColor: activeChar.color,
                  boxShadow: `0 0 8px ${activeChar.color}`
                }} />
              </div>
            </div>

            {/* Power Bar */}
            <div style={styles.statRow}>
              <div style={styles.statLabelGroup}>
                <span>COMPRESIÓN DE MOTOR</span>
                <span>{activeChar.stats.power}%</span>
              </div>
              <div style={styles.barOuter}>
                <div style={{
                  ...styles.barInner,
                  width: `${activeChar.stats.power}%`,
                  backgroundColor: activeChar.color,
                  boxShadow: `0 0 8px ${activeChar.color}`
                }} />
              </div>
            </div>

            {/* Chicha Factor Bar */}
            <div style={styles.statRow}>
              <div style={styles.statLabelGroup}>
                <span>FACTOR CHICHA (ESTILO)</span>
                <span>{activeChar.stats.chicha}%</span>
              </div>
              <div style={styles.barOuter}>
                <div style={{
                  ...styles.barInner,
                  width: `${activeChar.stats.chicha}%`,
                  backgroundColor: activeChar.color,
                  boxShadow: `0 0 8px ${activeChar.color}`
                }} />
              </div>
            </div>

            {/* Chassis Armor Bar */}
            <div style={styles.statRow}>
              <div style={styles.statLabelGroup}>
                <span>RESISTENCIA DE ADOQUÍN</span>
                <span>{activeChar.stats.chassis}%</span>
              </div>
              <div style={styles.barOuter}>
                <div style={{
                  ...styles.barInner,
                  width: `${activeChar.stats.chassis}%`,
                  backgroundColor: activeChar.color,
                  boxShadow: `0 0 8px ${activeChar.color}`
                }} />
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
    background: 'radial-gradient(ellipse at 70% 30%, rgba(255, 0, 60, 0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '0.8fr 1.4fr 1fr',
    gap: '30px',
    maxWidth: '1400px',
    width: '100%',
    alignItems: 'stretch',
    zIndex: 5,
  },
  hangarPanel: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 20px',
    border: '2px solid var(--border-metal)',
    justifyContent: 'space-between',
    background: 'rgba(5, 6, 10, 0.88)',
  },
  panelHeader: {
    marginBottom: '20px',
  },
  panelLabel: {
    fontFamily: 'var(--font-hud)',
    color: 'var(--text-secondary)',
    fontSize: '9px',
    letterSpacing: '2px',
  },
  panelTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '18px',
    fontWeight: '900',
    marginTop: '4px',
    letterSpacing: '0.5px',
    color: 'var(--text-primary)',
  },
  terminalStatusBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
  },
  terminalStatusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  charList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexGrow: 1,
    justifyContent: 'center',
  },
  charButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    border: '2.5px solid',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
  },
  colorIndicator: {
    width: '4px',
    height: '24px',
    borderRadius: '2px',
    marginRight: '12px',
  },
  charButtonContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
  },
  charButtonName: {
    fontFamily: 'var(--font-mecha)',
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '0.5px',
    transition: 'color 0.2s ease',
  },
  charButtonClass: {
    fontFamily: 'var(--font-hud)',
    fontSize: '8px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.5px',
    marginTop: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  activeIndicatorDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    position: 'absolute',
    right: '12px',
  },
  hangarFooterStrip: {
    height: '10px',
    width: '100%',
    borderRadius: '2px',
    marginTop: '24px',
    opacity: 0.7,
  },
  monitorContainer: {
    border: '3px solid var(--border-metal)',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    background: '#010204',
    display: 'flex',
    flexDirection: 'column',
    height: '520px',
  },
  monitorBezel: {
    height: '14px',
    width: '100%',
    borderBottom: '1px solid var(--border-metal)',
    opacity: 0.8,
  },
  screenInner: {
    position: 'relative',
    flexGrow: 1,
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '16px 20px',
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
    opacity: 0.22,
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
    pointerEvents: 'none',
    zIndex: 7,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '40px',
  },
  hudHeader: {
    display: 'flex',
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    letterSpacing: '1px',
    textShadow: '0 0 3px rgba(0,0,0,0.9)',
  },
  hudFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
    letterSpacing: '1.5px',
    textShadow: '0 0 3px rgba(0,0,0,0.9)',
    marginTop: '4px',
  },
  svgDisplay: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxHeight: '380px',
    margin: '10px 0',
  },
  phaseController: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    zIndex: 12,
    position: 'relative',
    height: '50px',
  },
  phaseButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: '4px',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  phaseNumLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  phaseTextLabel: {
    fontFamily: 'var(--font-mecha)',
    fontSize: '8px',
    letterSpacing: '1px',
    fontWeight: '800',
  },
  telemetryPanel: {
    padding: '24px',
    border: '2px solid var(--border-metal)',
    background: 'rgba(5, 6, 10, 0.88)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardHeader: {
    marginBottom: '14px',
  },
  cardLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    letterSpacing: '2.5px',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '22px',
    fontWeight: '900',
    marginTop: '4px',
    color: 'var(--text-primary)',
    letterSpacing: '0.5px',
  },
  cardSubTitle: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    marginTop: '2px',
    display: 'block',
  },
  specsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    borderTop: '1px solid var(--border-metal)',
    borderBottom: '1px solid var(--border-metal)',
    padding: '12px 0',
    marginBottom: '16px',
  },
  specItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    fontFamily: 'var(--font-hud)',
    letterSpacing: '0.5px',
  },
  specLabel: {
    color: 'var(--text-secondary)',
  },
  specValue: {
    color: 'var(--text-primary)',
    fontWeight: 'bold',
  },
  logTerminal: {
    background: '#040508',
    border: '1.5px solid var(--border-metal)',
    borderRadius: '4px',
    padding: '12px 14px',
    marginBottom: '16px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  logTermHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: '#a1a1aa',
    letterSpacing: '1px',
    marginBottom: '6px',
  },
  logTermDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
  },
  activePhaseLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '10px',
    color: 'var(--neon-yellow)',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  logText: {
    fontFamily: 'var(--font-typewriter)',
    fontSize: '10px',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    textAlign: 'left',
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  statsTitle: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  statRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabelGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    letterSpacing: '0.5px',
    color: 'var(--text-primary)',
  },
  barOuter: {
    height: '6px',
    width: '100%',
    backgroundColor: '#18181b',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  barInner: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.6s cubic-bezier(0.1, 0.8, 0.2, 1)',
  },
  bocetoImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '6px',
    border: '2px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
    filter: 'contrast(1.02) brightness(0.95)',
  },
};

export default CharacterGallery;
