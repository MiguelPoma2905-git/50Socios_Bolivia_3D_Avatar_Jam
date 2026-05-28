import { useState, useEffect, useRef, forwardRef } from 'react';
import soundManager from '../utils/soundManager';
import HTMLFlipBook from 'react-pageflip';

// CONFIGURACIÓN DINÁMICA DE ANÉCDOTAS DEL CÓMIC DE LOS UTAFORMERS (DATA-DRIVEN)
const comicPages = [
  {
    image: '/imgs/comic.png',
    title: 'Utaformers: Anécdotas Paceñas',
    text: 'La ciudad trancadera, o también llamada ciudad maravilla, nos trae muchos misterios.'
  },
  {
    image: '/imgs/marraqueta.jpg',
    title: 'Capítulo 1: El Despertar de la marraqueta',
    text: 'Los Utaformers pelean por un pedazo de marraqueta a falta de gasolina en su sector.'
  },
  {
    image: '/imgs/2.png',
    title: 'Capítulo 2: Motor de a la Fe de Dios',
    text: '96 pasajeros a bordo. El motor Cummins de 1978 despierta liberando un humo negro y tóxico.'
  },
  {
    image: '/imgs/7.png',
    title: 'Capítulo 3: Cerco en el Peaje Autopista',
    text: 'Las barreras de plasma municipal intentan acorralar a los colectivos. ¡La caravana no se detiene!'
  },
  {
    image: '/imgs/10.png',
    title: 'Capítulo 4: Los Leds no Son una Etapa',
    text: 'Huevitron reclama por sus derechos de usar exorbitantes LEDs para mantener su facha.'
  },
  {
    image: '/imgs/comic3.webp',
    title: 'Capítulo 5: Trameaje Cuántico',
    text: 'El mecha MiniBu (HiAce 95) distorsiona el espacio paceño para teleportar colectivos a El Alto.'
  },
  {
    image: '/imgs/comic2.webp',
    title: 'Capítulo 6: Cumbia o no Cumbia, esa es la cuestión',
    text: 'PrimeKatari y Microtron discuten: "Es aburrido viajar sin mi remix cumbia."'
  }
];

const ComicPageMedia = ({ src, alt, fallbackFn }) => {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          backgroundColor: '#0c0d10',
          borderRadius: '4px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}
      />
    );
  }

  return fallbackFn ? fallbackFn() : (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: '#1a1816',
      color: '#a8a29e',
      fontFamily: 'var(--font-hud)',
      padding: '20px',
      textAlign: 'center',
      border: '2px dashed #44403c',
      borderRadius: '4px'
    }}>
      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--neon-yellow)' }}>[ ILUSTRACIÓN CLANDESTINA ]</span>
      <span style={{ fontSize: '8px', marginTop: '6px', color: '#78716c' }}>Añade {alt} en /imgs/ para desbloquear esta página.</span>
    </div>
  );
};

// Componente de página para HTMLFlipBook
const ComicPageBlock = forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref} style={{ width: '100%', height: '100%', backgroundColor: '#0c0d10', border: '2px solid #2e2e4a', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)' }}>
      {props.children}
    </div>
  );
});

// RUTA DE IMÁGENES PARA EL TELEVISOR CRT RETRO
// Agrega rutas aquí para sobreescribir los marcadores vectoriales (ej. '/imgs/tv_cam4.png')
const tvImages = {
  channel4: '/imgs/tv.png',
  channel7: '/imgs/tv2.jfif',
  channel13: '/imgs/tv3.jpeg'
};




// 5 Emisoras Paceñas de Utaformers
const radioStations = [
  {
    freq: 88.5,
    name: '88.5 FM - Radio Yungas Clandestina',
    report: '--- TRANSMISIÓN CLANDESTINA TRIPLE-FILTRO ---\n\n[REBELDE_YUNGAS]: ¡Atención choferes! La Flota elDoradee ha sido detectada descendiendo por las curvas de Cotapata cargando mineral de litio altamente enriquecido. Sus escapes triples lanzan columnas de humo oscuro que anulan por completo los sensores de los satélites municipales de vigilancia. ¡El gigante interdepartamental está burlando el bloqueo con su Efecto Somnoliento! Estén atentos a la señal de tío Kari.',
  },
  {
    freq: 91.3,
    name: '91.3 FM - Radio Fides Rebelde',
    report: '--- REPORTA EL CURA DE LA PRENSA REBELDE ---\n\n[FIDES]: ¡Último minuto! Choque colosal en plena Pérez Velasco. El mecha municipal PrimeKatari bloqueó por completo la avenida debido a su excesiva anchura al intentar transformarse en modo combate. Los colectivos de Microtron arremetieron activando el Rayo Voceador al grito sónico de "¡Al fondo hay campo!", forzando la compresión de espacio-tiempo. Se reporta derrame de refrigerante chicha.',
  },
  {
    freq: 98.9,
    name: '98.9 FM - Radio Cyber-Kollasuyo',
    report: '--- LA VOZ SINDICAL DEL ALTIPLANO ---\n\n[SINDICATO_MINIBUS]: Emitimos un ultimátum a las autoridades de tránsito. Exigimos la devolución del mecha MiniBu (HiAce 95) confiscado injustamente. De lo contrario, activaremos el protocolo de "Trameaje Cuántico" masivo, teleportando dos mil minibuses de Sopocachi a El Alto instantáneamente y cobrando doble tramo de combate a toda la población.',
  },
  {
    freq: 101.5,
    name: '101.5 FM - Radio Chicha Power',
    report: '--- ALERTA SÓNICA EN LA AUTOPISTA ---\n\n[CHICHA_POWER]: ¡Reporte de velocidad! HueviTron (Corolla Huevito) fue detectado a 185 km/h en la subida a la Ceja. Al ser acorralado por la patrulla municipal, detonó su Escape Libre Estrepitoso, provocando una onda sónica ensordecedora que aturdió a las cebras de tránsito mientras el mecha escapaba lentamente haciendo ruido innecesario.',
  },
  {
    freq: 105.1,
    name: '105.1 FM - Radio Illimani PCS',
    report: '--- BOLETÍN OFICIAL DE LA ALCALDÍA ---\n\n[ALTI-SYSTEMS]: El centro de control de La Paz informa que PrimeKatari patrulla pacíficamente la plaza San Pedro. Se ha activado su Wi-Fi de la Justicia, obligando a los rebeldes a formar filas ordenadas. Recordamos a los ciudadanos que resistirse al Puma implica perder tiempo buscando sencillo y someterse a la mirada fija del funcionario.',
  }
];

const LoreTable = () => {
  const [activeItem, setActiveItem] = useState(null); // 'newspaper', 'radio', 'retroTv', 'comic'
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Radio state
  const [radioFreq, setRadioFreq] = useState(95.0); // slider freq 88.0 - 108.0
  const [radioVolume, setRadioVolume] = useState(80);
  const [radioPowered, setRadioPowered] = useState(false);
  const [radioText, setRadioText] = useState('--- APAGADO • PRESIONE POWER ---');
  const [activeStationName, setActiveStationName] = useState('OFF');
  const [staticLevel, setStaticLevel] = useState(1); // 0 (clear) to 1 (full static)
  const [lastTunedStation, setLastTunedStation] = useState(null);

  // Retro TV state
  const [tvPowered, setTvPowered] = useState(false);
  const [tvChannel, setTvChannel] = useState(4); // 4, 7, 13
  const [tvGlitch, setTvGlitch] = useState(false);

  // Interactive Comic state (Cinematic Single-Panel Parallax)
  const [comicPage, setComicPage] = useState(0);

  // Unfolding newspaper state
  const [isUnfolded, setIsUnfolded] = useState(false);

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

  // TV periodic analog glitch effect
  useEffect(() => {
    if (!tvPowered) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTvGlitch(false);
      return;
    }

    let glitchTimeout;

    const scheduleNextGlitch = () => {
      // Schedule glitch between 4 and 9 seconds randomly
      const randomInterval = 4000 + Math.random() * 5000;
      glitchTimeout = setTimeout(() => {
        setTvGlitch(true);
        soundManager.playRadioStatic(0.22);

        // Turn glitch off after 350ms
        setTimeout(() => {
          setTvGlitch(false);
          scheduleNextGlitch();
        }, 350);
      }, randomInterval);
    };

    scheduleNextGlitch();

    return () => {
      clearTimeout(glitchTimeout);
    };
  }, [tvPowered]);


  // Radio Tuning State Updater
  const updateRadioTuningState = (freq, powered) => {
    if (!powered) {
      setRadioText('--- APAGADO • PRESIONE POWER ---');
      setActiveStationName('OFF');
      setStaticLevel(1);
      setLastTunedStation(null);
      return;
    }

    // Check if close to any station freq (within 0.6 MHz)
    let foundStation = null;
    let minDistance = 999;

    radioStations.forEach(st => {
      const dist = Math.abs(freq - st.freq);
      if (dist < 0.6 && dist < minDistance) {
        minDistance = dist;
        foundStation = st;
      }
    });

    if (foundStation) {
      const currentStatic = minDistance / 0.6; // 0 at exact freq, 1 at boundary
      setStaticLevel(currentStatic);
      setActiveStationName(foundStation.name);

      if (currentStatic < 0.25) {
        // Clear audio sintonizada
        setRadioText(foundStation.report);

        // Auto play a voice noise when newly sintonized clearly
        if (lastTunedStation !== foundStation.freq) {
          setLastTunedStation(foundStation.freq);
          soundManager.playRadioVoiceNoise(1.2); // Play brief automatic squelch/voice
        }
      } else {
        // Blurry sintonización
        setRadioText(`[ SEÑAL DÉBIL - INTERFERENCIA SINDICAL ]\n\nSintonizando...\n\n${foundStation.report.substring(0, 100)}... [Estática]`);
        if (lastTunedStation !== null) {
          setLastTunedStation(null);
        }
      }
    } else {
      setStaticLevel(1);
      setActiveStationName('ESTÁTICA');
      setRadioText('--- KSHHHHHHH • RUIDO BLANCO ANALÓGICO ---\n\n[ESTÁTICA DE RADIO DE TRANSPORTE PACEÑO]\nGire la perilla de sintonización para captar reportes de combate de Utaformers.');
      if (lastTunedStation !== null) {
        setLastTunedStation(null);
      }
    }
  };

  // Play static sound loop while tuning
  const handleFreqChange = (e) => {
    const newFreq = parseFloat(e.target.value);
    setRadioFreq(newFreq);
    if (radioPowered) {
      soundManager.playRadioTuning();
    }
    updateRadioTuningState(newFreq, radioPowered);
  };

  const toggleRadioPower = () => {
    soundManager.playTapeClick();
    const nextPowered = !radioPowered;
    if (nextPowered) {
      soundManager.playRadioStatic(0.8);
    }
    setRadioPowered(nextPowered);
    updateRadioTuningState(radioFreq, nextPowered);
  };

  const handlePlayVoice = () => {
    if (!radioPowered) return;
    soundManager.playRadioVoiceNoise(2.2);
  };

  const handleTvChannelChange = (channel) => {
    if (!tvPowered) return;
    soundManager.playTapeClick();
    soundManager.playRadioStatic(0.4);
    soundManager.playRadioVoiceNoise(1.5);
    setTvChannel(channel);
  };

  const toggleTvPower = () => {
    soundManager.playTapeClick();
    const nextPower = !tvPowered;
    if (nextPower) {
      soundManager.playRadioStatic(0.5);
      soundManager.playRadioVoiceNoise(1.8);
    }
    setTvPowered(nextPower);
  };

  const flipBookRef = useRef(null);

  const handleNextPage = () => {
    if (flipBookRef.current && flipBookRef.current.pageFlip) {
      soundManager.playPaperRustle();
      try { flipBookRef.current.pageFlip().flipNext(); } catch { /* ignore */ }
    }
  };

  const handlePrevPage = () => {
    if (flipBookRef.current && flipBookRef.current.pageFlip) {
      soundManager.playPaperRustle();
      try { flipBookRef.current.pageFlip().flipPrev(); } catch { /* ignore */ }
    }
  };

  const handleSetPage = (idx) => {
    if (flipBookRef.current && flipBookRef.current.pageFlip) {
      soundManager.playPaperRustle();
      try { flipBookRef.current.pageFlip().turnToPage(idx); } catch { /* ignore */ }
    }
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeItem !== 'comic') return;
      if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, comicPage]);

  const handleOpenNewspaper = () => {
    soundManager.playPaperRustle();
    setActiveItem('newspaper');
    setTimeout(() => {
      setIsUnfolded(true);
    }, 100);
  };

  const handleCloseNewspaper = () => {
    soundManager.playTapeClick();
    setIsUnfolded(false);
    setActiveItem(null);
  };

  const openItemModal = (item) => {
    soundManager.playTapeClick();
    if (item === 'retroTv') {
      soundManager.playMetalClank(0.2);
      soundManager.playRadioStatic(0.2);
    } else if (item === 'comic') {
      soundManager.playPaperRustle();
    }
    setActiveItem(item);
  };

  const closeItemModal = () => {
    soundManager.playTapeClick();
    setActiveItem(null);
  };

  // Removed renderLeftPage/renderRightPage functions as we transitioned to a Cinematic Single-Panel layout

  return (
    <section id="historia" ref={sectionRef} style={styles.section} className="grunge-texture scene-transition">
      <div style={styles.lightingOverlay} />

      {/* Dynamic CSS styles loaded in header */}
      <style>{`
        @keyframes unfold-paper {
          0% {
            transform: perspective(1200px) rotateX(-90deg) scale(0.3);
            opacity: 0;
          }
          50% {
            transform: perspective(1200px) rotateX(15deg) scale(0.85);
            opacity: 0.8;
          }
          100% {
            transform: perspective(1200px) rotateX(0deg) scale(1);
            opacity: 1;
          }
        }
        .unfold-animation {
          animation: unfold-paper 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          transform-origin: top center;
        }
        .stamp-mark {
          color: #dc2626;
          border: 3px double #dc2626;
          border-radius: 4px;
          padding: 2px 6px;
          font-family: var(--font-hud);
          font-size: 9px;
          font-weight: bold;
          text-transform: uppercase;
          transform: rotate(-15deg);
          display: inline-block;
          animation: shake-intense 0.15s ease-out;
        }
        .radio-grille-glow {
          box-shadow: 0 0 10px var(--neon-green-glow);
          animation: neon-pulse-green 1.2s infinite alternate;
        }

        /* 3D COMIC FLIP ANIMATIONS */
        @keyframes flip-next-animation {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(-180deg);
          }
        }
        @keyframes flip-prev-animation {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(180deg);
          }
        }
        .flipping-sheet.next {
          animation: flip-next-animation 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .flipping-sheet.prev {
          animation: flip-prev-animation 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* TV STATIC GLITCH ANIMATIONS */
        @keyframes static-noise-anim {
          0% { transform: translate(0, 0) scale(1); }
          20% { transform: translate(-3px, 2px) scale(1.08); }
          40% { transform: translate(2px, -3px) scale(0.95); }
          60% { transform: translate(-1px, -2px) scale(1.05); }
          80% { transform: translate(3px, 1px) scale(0.98); }
          100% { transform: translate(-2px, -1px) scale(1.02); }
        }
        @keyframes scanline-drift {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>

      {/* Title */}
      <div style={styles.header}>
        <span style={styles.label}>SECCIÓN 2 — EL CÓMIC Y SECRETOS DEL MICRO</span>
        <h2 style={styles.title}>EL SECRETO EN EL PISO DEL MICRO</h2>
        <p style={styles.desc}>
          Los retazos de la guerra andina no se archivan en servidores en la nube. Están tirados sobre la chapa grasosa del microbús. Explora los objetos caídos en las rendijas del piso.
        </p>
      </div>

      {/* Workbench Table styled as a Microbus Worn Floorboard */}
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

          {/* ITEM 1: CRUMPLED NEWSPAPER (EL DIARIO) */}
          <div
            onClick={handleOpenNewspaper}
            style={{ ...styles.tableItem, transform: 'rotate(-8deg)' }}
            className="shake-hover"
          >
            <div style={styles.itemBadge}>[ PERIÓDICO ]</div>
            <svg width="120" height="90" viewBox="0 0 120 90" style={styles.itemSvg}>
              <rect x="5" y="5" width="110" height="80" rx="3" fill="#ebdcb9" stroke="#78716c" strokeWidth="2" />
              {/* Sepia folds lines */}
              <line x1="60" y1="5" x2="60" y2="85" stroke="#78716c" strokeWidth="1" strokeDasharray="2 2" />
              <rect x="15" y="12" width="90" height="15" fill="#292524" />
              <text x="60" y="22" fill="#ebdcb9" fontFamily="var(--font-title)" fontSize="6" fontWeight="bold" textAnchor="middle">EL DIARIO</text>
              <text x="60" y="26" fill="#ebdcb9" fontFamily="var(--font-hud)" fontSize="3.5" textAnchor="middle">Decano de la Prensa Nacional</text>
              <rect x="15" y="32" width="42" height="4" fill="#57534e" />
              <rect x="15" y="39" width="42" height="3" fill="#78716c" />
              <rect x="15" y="45" width="42" height="3" fill="#78716c" />
              <rect x="15" y="51" width="42" height="28" fill="none" stroke="#a8a29e" strokeWidth="1" />
              <circle cx="36" cy="65" r="7" fill="#78716c" />
              <rect x="63" y="32" width="42" height="42" fill="none" stroke="#a8a29e" strokeWidth="1" />
              <line x1="66" y1="38" x2="102" y2="38" stroke="#78716c" strokeWidth="1" />
              <line x1="66" y1="44" x2="102" y2="44" stroke="#78716c" strokeWidth="1" />
              <line x1="66" y1="50" x2="102" y2="50" stroke="#78716c" strokeWidth="1" />
              <line x1="66" y1="56" x2="102" y2="56" stroke="#78716c" strokeWidth="1" />
            </svg>
            <span style={styles.itemLabel}>EL DIARIO</span>
          </div>

          {/* ITEM 2: INTERACTIVE FM RADIO */}
          <div
            onClick={() => openItemModal('radio')}
            style={{
              ...styles.tableItem,
              transform: 'rotate(5deg)',
              borderColor: radioPowered ? 'var(--neon-green)' : 'var(--border-metal)',
              boxShadow: radioPowered ? '0 0 20px var(--neon-green-glow)' : 'none',
            }}
            className="shake-hover"
          >
            <div style={{ ...styles.itemBadge, color: radioPowered ? 'var(--neon-green)' : 'var(--text-secondary)' }}>
              [ {radioPowered ? 'RADIO ON' : 'RADIO ANALÓGICA'} ]
            </div>
            <svg width="120" height="90" viewBox="0 0 120 90" style={styles.itemSvg}>
              <rect x="15" y="15" width="90" height="70" rx="8" fill="#52525b" stroke="#27272a" strokeWidth="3" />
              <line x1="30" y1="15" x2="10" y2="-12" stroke="#94a3b8" strokeWidth="3" />
              <circle cx="10" cy="-12" r="3.5" fill="#e2e8f0" />
              {/* Dial glass */}
              <rect x="25" y="24" width="70" height="22" rx="3" fill="#18181b" stroke="#71717a" />
              {/* Frequency needle */}
              <line x1={30 + ((radioFreq - 88) / 20) * 60} y1="24" x2={30 + ((radioFreq - 88) / 20) * 60} y2="46" stroke="var(--neon-red)" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 3px var(--neon-red-glow))' }} />
              {/* Speaker grille */}
              <rect x="25" y="52" width="45" height="26" fill="#27272a" />
              <line x1="30" y1="56" x2="65" y2="56" stroke="#18181b" strokeWidth="2" />
              <line x1="30" y1="62" x2="65" y2="62" stroke="#18181b" strokeWidth="2" />
              <line x1="30" y1="68" x2="65" y2="68" stroke="#18181b" strokeWidth="2" />
              <line x1="30" y1="74" x2="65" y2="74" stroke="#18181b" strokeWidth="2" />
              {/* Knob */}
              <circle cx="85" cy="65" r="8" fill="#18181b" stroke="#71717a" />
              <line x1="85" y1="57" x2="85" y2="65" stroke="var(--neon-yellow)" strokeWidth="1.5" />
            </svg>
            <span style={{ ...styles.itemLabel, color: radioPowered ? 'var(--neon-green)' : 'var(--text-primary)' }}>
              RECEPTOR TRANSCEPTOR
            </span>
          </div>

          {/* ITEM 3: RETRO CRT TELEVISION */}
          <div
            onClick={() => openItemModal('retroTv')}
            style={{
              ...styles.tableItem,
              transform: 'rotate(-12deg)',
            }}
            className="shake-hover"
          >
            <div style={styles.itemBadge}>[ TELEVISOR CRT ]</div>
            <svg width="120" height="90" viewBox="0 0 120 90" style={styles.itemSvg}>
              {/* Wood/grey TV box */}
              <rect x="15" y="15" width="90" height="68" rx="8" fill="#4b5563" stroke="#1f2937" strokeWidth="3" />
              {/* Screen outer */}
              <rect x="23" y="21" width="56" height="46" rx="6" fill="#0f172a" stroke="#374151" strokeWidth="1.5" />
              {/* Screen inner */}
              <rect x="25" y="23" width="52" height="42" rx="4" fill="#1e293b" />
              {/* Screen glare reflection */}
              <path d="M 28,25 L 45,45 M 28,32 L 38,42" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              {/* TV panel controls */}
              <rect x="83" y="21" width="16" height="46" rx="2" fill="#374151" />
              {/* Rotary dials */}
              <circle cx="91" cy="29" r="4.5" fill="#111827" stroke="#9ca3af" strokeWidth="0.5" />
              <line x1="91" y1="29" x2="91" y2="25" stroke="#ffffff" strokeWidth="1" />
              <circle cx="91" cy="41" r="4.5" fill="#111827" stroke="#9ca3af" strokeWidth="0.5" />
              <line x1="91" y1="41" x2="94" y2="44" stroke="#ffffff" strokeWidth="1" />
              {/* Speaker slits */}
              <line x1="86" y1="52" x2="96" y2="52" stroke="#111827" strokeWidth="1.5" />
              <line x1="86" y1="56" x2="96" y2="56" stroke="#111827" strokeWidth="1.5" />
              <line x1="86" y1="60" x2="96" y2="60" stroke="#111827" strokeWidth="1.5" />
              {/* Feet */}
              <rect x="28" y="83" width="10" height="4" fill="#111827" rx="1" />
              <rect x="82" y="83" width="10" height="4" fill="#111827" rx="1" />
              {/* Antenna */}
              <line x1="50" y1="15" x2="30" y2="0" stroke="#6b7280" strokeWidth="2" />
              <circle cx="30" cy="0" r="2.5" fill="#9ca3af" />
              <line x1="60" y1="15" x2="80" y2="-2" stroke="#6b7280" strokeWidth="2" />
              <circle cx="80" cy="-2" r="2.5" fill="#9ca3af" />
            </svg>
            <span style={styles.itemLabel}>TELEVISOR CRT INFORMATIVO</span>
          </div>

          {/* ITEM 4: INTERACTIVE COMIC BOOK */}
          <div
            onClick={() => openItemModal('comic')}
            style={{
              ...styles.tableItem,
              transform: 'rotate(15deg)',
            }}
            className="shake-hover"
          >
            <div style={styles.itemBadge}>[ CÓMIC DE ANÉCDOTAS ]</div>
            <svg width="120" height="90" viewBox="0 0 120 90" style={styles.itemSvg}>
              {/* Open Book pages */}
              <path d="M 15,20 C 35,16 55,26 60,28 C 65,26 85,16 105,20 L 105,75 C 85,71 65,81 60,83 C 55,81 35,71 15,75 Z" fill="#ebdcb9" stroke="#7c2d12" strokeWidth="2.5" />
              {/* Book spine line */}
              <line x1="60" y1="28" x2="60" y2="83" stroke="#7c2d12" strokeWidth="2" />
              {/* Comic panels outlines left page */}
              <rect x="22" y="26" width="14" height="20" fill="none" stroke="#854d0e" strokeWidth="0.8" />
              <rect x="39" y="26" width="15" height="20" fill="none" stroke="#854d0e" strokeWidth="0.8" />
              <rect x="22" y="49" width="32" height="20" fill="none" stroke="#854d0e" strokeWidth="0.8" />

              {/* Comic panels outlines right page */}
              <rect x="66" y="26" width="32" height="20" fill="none" stroke="#854d0e" strokeWidth="0.8" />
              <rect x="66" y="49" width="14" height="20" fill="none" stroke="#854d0e" strokeWidth="0.8" />
              <rect x="83" y="49" width="15" height="20" fill="none" stroke="#854d0e" strokeWidth="0.8" />
              {/* Speech bubble */}
              <path d="M 85,32 Q 91,32 91,35 Q 91,38 85,38 Q 83,38 82,41 L 82,38 Q 79,38 79,35 Q 79,32 85,32 Z" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
            </svg>
            <span style={styles.itemLabel}>CÓMIC DE ANÉCDOTAS UTAFORMERS</span>
          </div>

        </div>
      </div>

      {/* LORE LIGHTBOX MODALS */}
      {/* 1. NEWSPAPER: EL DIARIO (3D UNFOLD ANIMATION) */}
      {activeItem === 'newspaper' && (
        <div style={styles.modalOverlay} onClick={handleCloseNewspaper}>
          <div
            className={isUnfolded ? 'unfold-animation' : ''}
            style={styles.newspaperModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.newspaperHeader}>
              <span>EL DIARIO — DECANO DE LA PRENSA NACIONAL • LA PAZ, BOLIVIA</span>
              <button style={styles.closeBtn} onClick={handleCloseNewspaper}>×</button>
            </div>

            <div style={styles.newspaperContent}>
              {/* Header Gótico tradicional */}
              <div style={styles.sepiaPaperBanner}>
                <h1 style={styles.sepiaPaperGothicTitle}>El Diario</h1>
                <span style={styles.sepiaPaperSubtitle}>Decano de la Prensa Nacional • Fundado en 1904 • Año CXXII • Edición Digital Clandestina</span>
              </div>

              <h3 style={styles.newsTitle}>¿PARO SINDICAL O CONFLICTO METROPOLITANO DE MECHAS?</h3>
              <h4 style={styles.newsSubtitle}>Paceños reportan colosos de metal transformándose en Autopista y Pérez Velasco</h4>

              <div className="news-columns" style={styles.newsColumns}>
                <p style={styles.newsText}>
                  La noche paceña se estremeció no por un bloqueo de juntas vecinales, sino por metal crujiente y rugidos de motores diésel modificados con extracto de neón chicha. Reportes provenientes de las laderas de Munaypata y Pampahasi afirman que tradicionales microbuses Dodge de la línea CH y micros Toyota Coaster han deslizado sus paneles oxidados, estirado pistones hidráulicos y erigido como gigantescos guardianes de metal en plena pendiente.
                  <br /><br />
                  ¿La causa? Fuentes secretas del sindicato "Colectivo Rayo" revelan que la antigua radiación telúrica concentrada bajo el templo andino de Tiwanaku y filtrada en los cimientos de la autopista reaccionó químicamente con el diésel pesado y el mocochinchi local. El motor Cummins de 1978 ha cobrado vida autónoma andina. Los Utaformers están en las calles.
                </p>

                <p style={styles.newsText}>
                  <strong>EL COMBATE POR LAS RUTAS SINDICALES</strong>
                  <br /><br />
                  <strong>Los Libres (La Resistencia Rústica):</strong> Liderados por el mítico colectivo Dodge de Don Severo (Microtron) y el tuneado y veloz HueviTron. Este bando defiende el libre albedrío del transporte tradicional paceño, el derecho a llevar pollos en la parte trasera, y a comer salteñas escuchando radio AM. Combaten con su Rayo Voceador y escapes estrepitosos.
                  <br /><br />
                  <strong>Altiplano Cyber-Systems (El Orden Municipal):</strong> Comandados por la unidad pesada PrimeKatari, una flota edilicia equipada con Wi-Fi de la Justicia y blindajes anti-piedras. Buscan regular las pendientes de la urbe mediante telemetrías frías, forzar filas ordenadas y suprimir el caos vehicular tradicional.
                </p>
              </div>

              <div style={styles.newsFooter}>
                <span>DIRECTOR GENERAL DEL SINDICATO REBELDE DE MICROS CLÁSICOS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RADIO FM INTERACTIVA MODAL */}
      {activeItem === 'radio' && (
        <div style={styles.modalOverlay} onClick={closeItemModal}>
          <div style={styles.radioCabinetModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.radioModalHeader}>
              <span style={{ color: 'var(--neon-green)' }}>RECEPTOR DE FRECUENCIA PACEÑA FM v2.4</span>
              <button style={styles.closeBtnRadio} onClick={closeItemModal}>×</button>
            </div>

            <div style={styles.radioCabinetContent}>

              {/* Radio Dashboard Interface */}
              <div style={styles.radioPanelGrid}>

                {/* Physical Retro Dial */}
                <div style={styles.radioDialWrapper}>

                  {/* Dial scale markings */}
                  <div style={styles.dialScale}>
                    <span>88</span><span>90</span><span>92</span><span>94</span><span>96</span><span>98</span><span>100</span><span>102</span><span>104</span><span>106</span><span>108</span>
                  </div>

                  {/* Glass viewport */}
                  <div style={styles.dialGlass}>
                    {/* Tickmarks */}
                    <div style={styles.dialTicks} />

                    {/* Active needle */}
                    <div style={{
                      ...styles.dialNeedle,
                      left: `${((radioFreq - 88) / 20) * 100}%`
                    }} />

                    {/* Freq Display */}
                    <div style={styles.digitalFreqDisplay}>
                      <span style={{ color: radioPowered ? 'var(--neon-green)' : '#1c1917' }}>
                        {radioPowered ? `${radioFreq.toFixed(1)} MHz` : '00.0 OFF'}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic LED Tuning Signal Strength */}
                  <div style={styles.ledSignalStrength}>
                    <span style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>SEÑAL DE COMUNICACIÓN:</span>
                    <div style={styles.ledBar}>
                      {[1, 2, 3, 4, 5].map((led) => {
                        const lit = radioPowered && (staticLevel < (1 - (led - 1) * 0.2));
                        return (
                          <div
                            key={led}
                            style={{
                              ...styles.ledNode,
                              backgroundColor: lit ? (led > 3 ? 'var(--neon-red)' : 'var(--neon-green)') : '#18181b',
                              boxShadow: lit ? (led > 3 ? '0 0 5px var(--neon-red)' : '0 0 5px var(--neon-green)') : 'none'
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Tactical knobs & switches */}
                <div style={styles.radioControlsRow}>
                  {/* Switch POWER */}
                  <button
                    onClick={toggleRadioPower}
                    style={{
                      ...styles.powerToggleBtn,
                      backgroundColor: radioPowered ? 'var(--neon-red)' : '#1e293b',
                      color: '#ffffff',
                      boxShadow: radioPowered ? '0 0 10px var(--neon-red)' : 'none'
                    }}
                  >
                    POWER
                  </button>

                  {/* Switch PLAY VOICE */}
                  <button
                    onClick={handlePlayVoice}
                    disabled={!radioPowered}
                    style={{
                      ...styles.voiceToggleBtn,
                      backgroundColor: !radioPowered ? '#18181b' : (activeStationName !== 'ESTÁTICA' && activeStationName !== 'OFF' ? 'var(--neon-green)' : '#3f3f46'),
                      color: '#ffffff',
                      boxShadow: radioPowered && activeStationName !== 'ESTÁTICA' && activeStationName !== 'OFF' ? '0 0 10px var(--neon-green-glow)' : 'none',
                      borderColor: radioPowered && activeStationName !== 'ESTÁTICA' && activeStationName !== 'OFF' ? 'var(--neon-green)' : 'var(--border-metal)',
                      opacity: radioPowered ? 1 : 0.5,
                      cursor: radioPowered ? 'pointer' : 'default'
                    }}
                  >
                    CANAL VOZ
                  </button>

                  {/* Volume Knob */}
                  <div style={styles.knobControlGroup}>
                    <span style={styles.knobLabel}>VOLUMEN</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={radioVolume}
                      onChange={(e) => setRadioVolume(parseInt(e.target.value))}
                      style={styles.volumeSlider}
                      disabled={!radioPowered}
                    />
                  </div>

                  {/* Active Station Banner */}
                  <div style={styles.stationBadge}>
                    <span style={styles.stationBadgeLabel}>EMISORA</span>
                    <span style={{
                      ...styles.stationBadgeName,
                      color: radioPowered ? 'var(--neon-yellow)' : '#3f3f46'
                    }}>
                      {activeStationName}
                    </span>
                  </div>
                </div>

                {/* Sintonización manual slider */}
                <div style={styles.tuningSliderGroup}>
                  <span style={styles.knobLabel}>SINTONIZADOR MANUAL (FM)</span>
                  <input
                    type="range"
                    min="88.0"
                    max="108.0"
                    step="0.1"
                    value={radioFreq}
                    onChange={handleFreqChange}
                    style={styles.tuningSlider}
                    disabled={!radioPowered}
                  />
                </div>
              </div>

              {/* CRT Monitor readout of news */}
              <div style={styles.radioMonitorDisplay}>
                <div style={styles.monitorHeaderStrip}>
                  <div className={radioPowered ? "radio-grille-glow" : ""} style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: radioPowered ? 'var(--neon-green)' : '#27272a'
                  }} />
                  <span style={styles.monitorHeaderLabel}>TELEMETRÍA RECEPTORA CRÍPTICA — SINDICATO</span>
                </div>

                {/* News Content Display area */}
                <div style={{
                  ...styles.monitorTextArea,
                  color: radioPowered ? 'var(--neon-green)' : '#1f2937',
                  opacity: radioPowered ? 1 : 0.4
                }}>
                  <pre style={{
                    fontFamily: 'var(--font-hud)',
                    fontSize: '11px',
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {radioText}
                  </pre>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. TELEVISOR CRT RETRO MODAL */}
      {activeItem === 'retroTv' && (
        <div style={styles.modalOverlay} onClick={closeItemModal}>
          <div style={styles.tvCabinetModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.tvModalHeader}>
              <span style={{ color: 'var(--neon-yellow)' }}>TELEVISOR CRT PACEÑO CLÁSICO — CANALES SINDICALES</span>
              <button style={styles.closeBtnTv} onClick={closeItemModal}>×</button>
            </div>

            <div style={styles.tvCabinetContent}>
              <div style={styles.tvChassis}>
                {/* Antennas drawn dynamically */}
                {/* CRT Screen Border */}
                <div style={styles.tvBezel}>
                  {/* Outer curved screen glass */}
                  <div style={{
                    ...styles.tvScreenContainer,
                    boxShadow: tvPowered ? '0 0 30px rgba(0, 229, 255, 0.25), inset 0 0 20px rgba(0,0,0,0.8)' : 'inset 0 0 30px rgba(0,0,0,0.95)'
                  }}>
                    {/* Retro Scanlines */}
                    <div style={styles.tvScanlines} />

                    {/* Flickering noise glare */}
                    {tvPowered && <div style={styles.tvFlicker} />}

                    {/* Full screen static glitch interference */}
                    {tvPowered && tvGlitch && (
                      <div style={styles.tvGlitchOverlay}>
                        <div style={styles.tvGlitchNoise} />
                        <div style={styles.tvGlitchHorizontalBar} />
                      </div>
                    )}

                    {/* SCREEN DATA BASED ON CHANNEL */}
                    {!tvPowered ? (
                      <div style={styles.screenOffText}>
                        <span>--- APAGADO ---</span>
                        <span style={{ fontSize: '9px', marginTop: '8px', color: '#4b5563', textAlign: 'center' }}>PRESIONA EL BOTÓN DE POWER PARA SINTONIZAR</span>
                      </div>
                    ) : (
                      <div style={{
                        ...styles.screenActiveContent,
                        transform: tvGlitch ? 'translate(-4px, 4px) skewX(-10deg)' : 'none',
                        filter: tvGlitch ? 'invert(0.1) contrast(2) saturate(0.2)' : 'none',
                        transition: 'transform 0.05s ease-out'
                      }}>
                        {/* Channel 4: Tele-Sindicato */}
                        {tvChannel === 4 && (
                          tvImages.channel4 ? (
                            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
                              <img src={tvImages.channel4} alt="Canal 4 Hangar" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                              <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', color: 'var(--neon-green)', fontFamily: 'var(--font-hud)', zIndex: 12 }}>
                                [CÁM 04 - SOPOCACHI REBELDE]
                              </div>
                            </div>
                          ) : (
                            <div style={styles.tvChannelLayout}>
                              <div style={styles.tvChannelHeader}>
                                <span style={{ color: 'var(--neon-green)' }}>[CÁM 04 - SOPOCACHI REBELDE]</span>
                                <span>DIAGNÓSTICO AL HANGAR</span>
                              </div>
                              <div style={styles.tvChannelMain}>
                                <div style={styles.bouncingBusWrapper}>
                                  <svg viewBox="0 0 100 50" style={{ width: '120px', height: 'auto', animation: 'microbus-rattle 0.08s infinite alternate' }}>
                                    <path d="M 10,35 Q 50,15 90,35 L 85,45 L 15,45 Z" fill="var(--neon-green)" stroke="#ffffff" strokeWidth="1" />
                                    <circle cx="28" cy="45" r="5" fill="#000" stroke="#fff" strokeWidth="0.8" />
                                    <circle cx="72" cy="45" r="5" fill="#000" stroke="#fff" strokeWidth="0.8" />
                                    <rect x="35" y="25" width="30" height="10" fill="#000" />
                                  </svg>
                                </div>
                                <pre style={styles.tvTickerText}>
                                  {`--- TELEMETRÍA EN VIVO ---\n- Estado motor: ACTIVO [Neón Chicha]\n- Fuga combustible: 2% (tolerable)\n- Pasajeros a bordo: 24 (capacidad 12)\n- Nivel chicha en radiador: 92%`}
                                </pre>
                              </div>
                            </div>
                          )
                        )}

                        {/* Channel 7: Canal Municipal */}
                        {tvChannel === 7 && (
                          tvImages.channel7 ? (
                            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
                              <img src={tvImages.channel7} alt="Canal 7 Oficial" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                              <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', color: 'var(--neon-blue)', fontFamily: 'var(--font-hud)', zIndex: 12 }}>
                                [CANAL 07 - ALTI-SYSTEMS CENTRAL]
                              </div>
                            </div>
                          ) : (
                            <div style={styles.tvChannelLayout}>
                              <div style={styles.tvChannelHeader}>
                                <span style={{ color: 'var(--neon-blue)' }}>[CANAL 07 - ALTI-SYSTEMS CENTRAL]</span>
                                <span>MENSAJE OFICIAL EDIL</span>
                              </div>
                              <div style={styles.tvChannelMain}>
                                <div style={styles.spinningRadarWrapper}>
                                  <svg viewBox="0 0 100 100" style={styles.radarSvg}>
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--neon-blue)" strokeWidth="1" />
                                    <circle cx="50" cy="50" r="30" fill="none" stroke="var(--neon-blue)" strokeWidth="0.8" strokeDasharray="3 3" />
                                    <circle cx="50" cy="50" r="15" fill="none" stroke="var(--neon-blue)" strokeWidth="0.5" />
                                    <line x1="50" y1="5" x2="50" y2="95" stroke="var(--neon-blue)" strokeWidth="0.5" />
                                    <line x1="5" y1="50" x2="95" y2="50" stroke="var(--neon-blue)" strokeWidth="0.5" />
                                    <circle cx="70" cy="35" r="4" fill="var(--neon-red)" style={{ animation: 'neon-flicker 1s infinite' }} />
                                  </svg>
                                </div>
                                <pre style={{ ...styles.tvTickerText, color: 'var(--neon-blue)' }}>
                                  {`--- ALERTA VIAL MUNICIPAL ---\n¡Peligro! Detectados disturbios sónicos en la subida a la Ceja. Choferes tradicionales usan bocinas prohibidas de 120 decibelios. PrimeKatari ha sido desplegado para restablecer el orden absoluto.`}
                                </pre>
                              </div>
                            </div>
                          )
                        )}

                        {/* Channel 13: Chicha Vision */}
                        {tvChannel === 13 && (
                          tvImages.channel13 ? (
                            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
                              <img src={tvImages.channel13} alt="Canal 13 Publicidad" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                              <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', color: 'var(--neon-chicha)', fontFamily: 'var(--font-hud)', zIndex: 12 }}>
                                [CANAL 13 - CHICHA VISION TV]
                              </div>
                            </div>
                          ) : (
                            <div style={styles.tvChannelLayout}>
                              <div style={styles.tvChannelHeader}>
                                <span style={{ color: 'var(--neon-chicha)' }}>[CANAL 13 - CHICHA VISION TV]</span>
                                <span>PUBLICIDAD RETRO VINTAGE</span>
                              </div>
                              <div style={styles.tvChannelMain}>
                                <div style={styles.adBanner}>
                                  <span className="warning-stripes" style={styles.chichaAdBanner}>¡COMPRA RECONSTITUYENTE!</span>
                                  <h4 style={{ color: 'var(--neon-yellow)', margin: '4px 0', fontSize: '12px', fontFamily: 'var(--font-mecha)' }}>Mocochinchi Extremo</h4>
                                  <p style={{ fontSize: '8px', color: '#f4f4f5', margin: 0 }}>"¡Para combatir la altura en tu mecha!"</p>
                                </div>
                                <pre style={{ ...styles.tvTickerText, color: 'var(--neon-chicha)' }}>
                                  {`--- SINDICATO INFORMA ---\nSe convoca a todos los afiliados a la parrillada bailable en el hangar de Cotahuma este sábado. Traer su propio líquido refrigerante (singani).`}
                                </pre>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* TV Side Control Panel */}
                <div style={styles.tvControlSide}>
                  <div style={styles.tvControlsGrid}>
                    {/* TV Power button */}
                    <button
                      onClick={toggleTvPower}
                      style={{
                        ...styles.tvPowerBtn,
                        backgroundColor: tvPowered ? 'var(--neon-red)' : '#1e293b',
                        boxShadow: tvPowered ? '0 0 12px var(--neon-red-glow)' : 'none'
                      }}
                    >
                      POWER
                    </button>

                    <div style={styles.channelLabelBlock}>
                      <span>DIAL CANAL</span>
                    </div>

                    <div style={styles.tvChannelSelectors}>
                      {[4, 7, 13].map((ch) => (
                        <button
                          key={ch}
                          onClick={() => handleTvChannelChange(ch)}
                          disabled={!tvPowered}
                          style={{
                            ...styles.tvChBtn,
                            borderColor: tvPowered && tvChannel === ch ? 'var(--neon-yellow)' : '#3f3f46',
                            color: tvPowered && tvChannel === ch ? 'var(--neon-yellow)' : '#cbd5e1',
                            boxShadow: tvPowered && tvChannel === ch ? '0 0 8px var(--neon-yellow-glow)' : 'none',
                            opacity: tvPowered ? 1 : 0.4
                          }}
                        >
                          CH {ch}
                        </button>
                      ))}
                    </div>

                    <div style={styles.speakerGrilleBox}>
                      <div style={styles.tvSpeakerVent} />
                      <div style={styles.tvSpeakerVent} />
                      <div style={styles.tvSpeakerVent} />
                      <div style={styles.tvSpeakerVent} />
                      <div style={styles.tvSpeakerVent} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 4. COMIC PACEÑO INTERACTIVO MODAL */}
      {activeItem === 'comic' && (
        <div style={styles.modalOverlay} onClick={closeItemModal}>
          <div style={styles.comicModalContainer} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={styles.comicHeader}>
              <span className="neon-text-red" style={{ fontFamily: 'var(--font-hud)', fontSize: '11px', fontWeight: 'bold' }}>
                UTAFORMERS: ANÉCDOTAS PACEÑAS 3D
              </span>
              <button style={styles.closeBtnComic} onClick={closeItemModal}>×</button>
            </div>

            {/* Comic Panel Body */}
            <div style={{ ...styles.comicBookWrapper, padding: '20px', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'center' }}>
                <HTMLFlipBook
                  width={340}
                  height={480}
                  size="stretch"
                  minWidth={280}
                  maxWidth={450}
                  minHeight={400}
                  maxHeight={600}
                  maxShadowOpacity={0.5}
                  showCover={true}
                  mobileScrollSupport={true}
                  className="comic-flipbook"
                  onFlip={(e) => setComicPage(e.data)}
                  ref={flipBookRef}
                >
                  {comicPages.map((page, index) => (
                    <ComicPageBlock key={index}>
                      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#090a0f' }}>
                        <div style={{ flex: 1, padding: '10px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <ComicPageMedia src={page.image} alt={page.title} />
                        </div>
                        <div style={{ padding: '12px 15px', background: '#1a1816', borderTop: '2px solid #2e2e4a', minHeight: '100px' }}>
                          <h3 style={{ ...styles.comicTextTitle, fontSize: '12px' }}>{page.title}</h3>
                          <div style={{ marginTop: '8px' }}>
                            <p style={{ ...styles.comicDialogueText, color: '#a8a29e', fontSize: '9px', lineHeight: '1.4' }}>{page.text}</p>
                          </div>
                        </div>
                      </div>
                    </ComicPageBlock>
                  ))}
                </HTMLFlipBook>
              </div>
            </div>

            {/* Comic Navigation Footer with Dots */}
            <div style={styles.comicNavigation}>
              <button
                onClick={handlePrevPage}
                disabled={comicPage === 0}
                style={{
                  ...styles.comicNavBtn,
                  opacity: comicPage === 0 ? 0.4 : 1,
                  cursor: comicPage === 0 ? 'default' : 'pointer'
                }}
              >
                PORTADA / ATRÁS
              </button>

              {/* Dots list */}
              <div style={styles.slideDotsContainer}>
                {comicPages.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSetPage(idx)}
                    style={{
                      ...styles.slideDot,
                      backgroundColor: comicPage === idx ? 'var(--neon-green)' : '#2e2e4a',
                      boxShadow: comicPage === idx ? '0 0 8px var(--neon-green)' : 'none',
                      transform: comicPage === idx ? 'scale(1.25)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={comicPage === comicPages.length - 1}
                style={{
                  ...styles.comicNavBtn,
                  opacity: comicPage === comicPages.length - 1 ? 0.4 : 1,
                  cursor: comicPage === comicPages.length - 1 ? 'default' : 'pointer',
                  background: comicPage === 0 ? 'var(--neon-green)' : '#7c2d12',
                  borderColor: comicPage === 0 ? 'var(--neon-green)' : '#290f02',
                  color: comicPage === 0 ? '#000000' : '#ebdcb9',
                  boxShadow: comicPage === 0 ? '0 0 10px var(--neon-green-glow)' : 'none'
                }}
              >
                {comicPage === 0 ? 'ABRIR CÓMIC' : 'PÁG SIGUIENTE'}
              </button>
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    padding: '20px',
  },
  newspaperModal: {
    background: '#ebdcb9', // physical sepia El Diario paper
    color: '#292524',
    border: '14px solid #1c1917',
    borderRadius: '4px',
    maxWidth: '750px',
    width: '100%',
    boxShadow: '0 30px 60px rgba(0,0,0,0.7)',
    overflow: 'hidden',
  },
  newspaperHeader: {
    background: '#1c1917',
    color: '#ebdcb9',
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
    color: '#ebdcb9',
    fontSize: '24px',
    lineHeight: 1,
    padding: '0 4px',
  },
  newspaperContent: {
    padding: '24px 30px 30px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'var(--font-typewriter)',
  },
  sepiaPaperBanner: {
    width: '100%',
    textAlign: 'center',
    borderBottom: '5px double #1c1917',
    paddingBottom: '14px',
    marginBottom: '20px',
  },
  sepiaPaperGothicTitle: {
    fontFamily: 'Georgia, serif',
    fontWeight: '900',
    fontSize: '44px',
    letterSpacing: '1px',
    color: '#1c1917',
    margin: 0,
  },
  sepiaPaperSubtitle: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: '#57534e',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'block',
    marginTop: '6px',
  },
  newsTitle: {
    fontFamily: 'var(--font-typewriter)',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: '1.2',
    color: '#dc2626', // traditional Sensationalist title
    margin: '0 0 10px 0',
  },
  newsSubtitle: {
    fontSize: '12px',
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#57534e',
    borderBottom: '1px solid #1c1917',
    paddingBottom: '12px',
    width: '100%',
    marginBottom: '20px',
  },
  newsColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    textAlign: 'justify',
  },
  newsText: {
    fontSize: '11px',
    lineHeight: '1.6',
    color: '#1c1917',
  },
  newsFooter: {
    marginTop: '25px',
    borderTop: '1px solid #1c1917',
    paddingTop: '12px',
    width: '100%',
    fontSize: '9px',
    textAlign: 'center',
    color: '#57534e',
  },
  radioCabinetModal: {
    background: '#27272a',
    border: '4px solid #18181b',
    borderRadius: '12px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.1)',
    maxWidth: '650px',
    width: '100%',
    overflow: 'hidden',
  },
  radioModalHeader: {
    background: '#18181b',
    borderBottom: '2px solid #3f3f46',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    fontFamily: 'var(--font-hud)',
    letterSpacing: '1px',
  },
  closeBtnRadio: {
    background: 'none',
    color: 'var(--neon-green)',
    fontSize: '24px',
    lineHeight: 1,
    padding: '0 4px',
  },
  radioCabinetContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    background: 'linear-gradient(to bottom, #27272a 0%, #18181b 100%)',
  },
  radioPanelGrid: {
    background: '#18181b',
    border: '2px solid #3f3f46',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  radioDialWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  dialScale: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 6px',
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
  },
  dialGlass: {
    height: '42px',
    width: '100%',
    background: '#090a0f',
    border: '2.5px solid #3f3f46',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.8)',
  },
  dialTicks: {
    position: 'absolute',
    top: 0,
    left: '2%',
    right: '2%',
    height: '8px',
    backgroundImage: 'repeating-linear-gradient(90deg, #52525b, #52525b 2px, transparent 2px, transparent 10px)',
  },
  dialNeedle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: 'var(--neon-red)',
    boxShadow: '0 0 8px var(--neon-red)',
    transition: 'left 0.15s cubic-bezier(0.1, 0.8, 0.2, 1)',
    zIndex: 10,
  },
  digitalFreqDisplay: {
    position: 'absolute',
    bottom: '4px',
    right: '12px',
    fontFamily: 'var(--font-hud)',
    fontSize: '15px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  ledSignalStrength: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 6px',
  },
  ledBar: {
    display: 'flex',
    gap: '6px',
  },
  ledNode: {
    width: '12px',
    height: '6px',
    borderRadius: '1px',
    transition: 'all 0.1s ease',
  },
  radioControlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  powerToggleBtn: {
    padding: '8px 16px',
    borderRadius: '4px',
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease',
  },
  voiceToggleBtn: {
    padding: '8px 16px',
    borderRadius: '4px',
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    fontWeight: 'bold',
    border: '1.5px solid var(--border-metal)',
    transition: 'all 0.2s ease',
  },
  knobControlGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    flexGrow: 1,
    maxWidth: '220px',
  },
  knobLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '8px',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  volumeSlider: {
    width: '100%',
    accentColor: 'var(--neon-green)',
    cursor: 'pointer',
  },
  stationBadge: {
    background: '#090a0f',
    border: '1.5px solid #27272a',
    borderRadius: '4px',
    padding: '6px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: '150px',
  },
  stationBadgeLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '7px',
    color: '#52525b',
  },
  stationBadgeName: {
    fontFamily: 'var(--font-hud)',
    fontSize: '10px',
    fontWeight: 'bold',
    marginTop: '2px',
  },
  tuningSliderGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '4px',
  },
  tuningSlider: {
    width: '100%',
    accentColor: 'var(--neon-yellow)',
    cursor: 'pointer',
  },
  radioMonitorDisplay: {
    background: '#040508',
    border: '2px solid #27272a',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  monitorHeaderStrip: {
    background: '#090a0f',
    padding: '6px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid #1c1917',
  },
  monitorHeaderLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '8px',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
  },
  monitorTextArea: {
    padding: '16px 20px',
    background: '#020305',
    minHeight: '130px',
    maxHeight: '180px',
    overflowY: 'auto',
    textAlign: 'left',
    transition: 'all 0.3s ease',
  },
  // TV Retro Styles
  tvCabinetModal: {
    background: '#1c1917', // Dark wood cabinet tone
    color: '#cbd5e1',
    border: '8px solid #44403c', // thick cabinet borders
    borderRadius: '16px',
    maxWidth: '750px',
    width: '100%',
    boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 4px 0 rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  tvModalHeader: {
    background: '#12100e',
    borderBottom: '2px solid #2e2a24',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    letterSpacing: '1px',
  },
  closeBtnTv: {
    background: 'none',
    color: 'var(--neon-yellow)',
    fontSize: '24px',
    lineHeight: 1,
    cursor: 'pointer',
  },
  tvCabinetContent: {
    padding: '24px',
    background: 'radial-gradient(circle at center, #1b1918 0%, #0d0c0c 100%)',
  },
  tvChassis: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '24px',
    alignItems: 'center',
  },
  tvAntennaContainer: {
    position: 'absolute',
    top: '-30px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '120px',
    display: 'none', // drawn in SVG, but container kept for anchor
  },
  tvBezel: {
    background: '#272522',
    border: '10px solid #1c1a18',
    borderRadius: '12px',
    padding: '14px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.05)',
  },
  tvScreenContainer: {
    position: 'relative',
    background: '#090b10',
    width: '100%',
    height: '240px',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #111',
  },
  tvScanlines: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
    backgroundSize: '100% 4px',
    zIndex: 10,
    pointerEvents: 'none',
    opacity: 0.35,
  },
  tvFlicker: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 229, 255, 0.03)',
    zIndex: 9,
    pointerEvents: 'none',
    animation: 'neon-flicker 0.15s infinite alternate',
  },
  screenOffText: {
    color: '#374151',
    fontFamily: 'var(--font-hud)',
    fontWeight: 'bold',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  screenActiveContent: {
    width: '100%',
    height: '100%',
    color: 'var(--neon-green)',
    fontFamily: 'var(--font-hud)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  tvChannelLayout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: '12px',
    boxSizing: 'border-box'
  },
  tvChannelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '9px',
    borderBottom: '1px solid rgba(57,255,20,0.2)',
    paddingBottom: '4px',
  },
  tvChannelMain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    flexGrow: 1,
    justifyContent: 'center',
  },
  bouncingBusWrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: '4px 0',
  },
  spinningRadarWrapper: {
    width: '60px',
    height: '60px',
    margin: '4px auto',
  },
  radarSvg: {
    width: '100%',
    height: '100%',
    animation: 'spin 4s linear infinite',
  },
  tvTickerText: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    textAlign: 'left',
    lineHeight: '1.3',
    whiteSpace: 'pre-wrap',
    margin: 0,
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    padding: '6px',
    borderRadius: '4px',
  },
  adBanner: {
    textAlign: 'center',
    padding: '4px',
    border: '1px dashed var(--neon-chicha)',
    borderRadius: '4px',
    background: 'rgba(255,0,255,0.05)',
  },
  chichaAdBanner: {
    fontSize: '8px',
    fontWeight: 'bold',
    color: '#000000',
    padding: '2px 8px',
    borderRadius: '2px',
    display: 'inline-block',
  },
  tvControlSide: {
    background: '#1e1a18',
    border: '4px solid #12100f',
    borderRadius: '8px',
    padding: '16px',
    height: '100%',
    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5)',
  },
  tvControlsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
  },
  tvPowerBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    fontFamily: 'var(--font-mecha)',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#ffffff',
    border: '3px solid #111',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  channelLabelBlock: {
    fontFamily: 'var(--font-hud)',
    fontSize: '8px',
    color: '#9ca3af',
    letterSpacing: '1px',
    textAlign: 'center',
  },
  tvChannelSelectors: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  tvChBtn: {
    padding: '6px 12px',
    borderRadius: '4px',
    fontFamily: 'var(--font-hud)',
    fontSize: '10px',
    fontWeight: 'bold',
    background: '#111317',
    border: '2px solid',
    transition: 'all 0.15s ease',
  },
  speakerGrilleBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    width: '80%',
    marginTop: '10px',
  },
  tvSpeakerVent: {
    height: '3px',
    background: '#090a0d',
    borderRadius: '1px',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  },

  // Comic Clandestino Styles
  comicModalContainer: {
    background: '#09090e',
    border: '4px solid #2e2e4a',
    boxShadow: '0 0 35px rgba(0, 229, 255, 0.2), inset 0 0 20px rgba(0,0,0,0.8)',
    borderRadius: '12px',
    maxWidth: '750px',
    width: '95%',
    maxHeight: '92vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  comicHeader: {
    background: '#12121e',
    borderBottom: '2px solid #222235',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'var(--font-hud)',
    letterSpacing: '1.5px',
  },
  closeBtnComic: {
    background: 'none',
    color: 'var(--neon-red)',
    fontSize: '24px',
    lineHeight: 1,
    cursor: 'pointer',
  },
  comicBookWrapper: {
    padding: '24px 24px 16px 24px',
    background: 'radial-gradient(circle at center, #11111d 0%, #06060c 100%)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 0,
    gap: '16px',
  },
  comicPanelContainer: {
    width: '100%',
    maxWidth: '520px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 0,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.1s ease-out, opacity 0.15s ease-in-out',
  },
  comicPanelBorders: {
    width: '100%',
    height: '100%',
    background: '#040408',
    border: '4px solid #000000',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(239, 68, 68, 0.15)',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comicPanelMedia: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comicShineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 5,
    mixBlendMode: 'plus-lighter',
    transition: 'background 0.1s ease-out',
  },
  overlayArrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.6)',
    border: '1.5px solid rgba(255,255,255,0.15)',
    color: '#ffffff',
    fontSize: '24px',
    lineHeight: '34px',
    textAlign: 'center',
    cursor: 'pointer',
    zIndex: 8,
    transition: 'all 0.2s ease',
    opacity: 0.7,
    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
  },
  comicTextSection: {
    width: '100%',
    maxWidth: '520px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    textAlign: 'center',
  },
  comicTextTitle: {
    fontFamily: 'var(--font-mecha)',
    fontSize: '14px',
    color: 'var(--neon-yellow)',
    margin: 0,
    fontWeight: 'bold',
    letterSpacing: '1px',
    textShadow: '0 0 8px rgba(253, 224, 71, 0.3)',
  },
  comicDialogueBox: {
    background: '#fffeb3',
    border: '2.5px solid #000000',
    borderRadius: '4px',
    padding: '8px 14px',
    boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
    position: 'relative',
    textAlign: 'left',
  },
  comicDialogueSpokesperson: {
    fontFamily: 'var(--font-hud)',
    fontSize: '7.5px',
    fontWeight: '900',
    color: '#dc2626',
    letterSpacing: '1px',
    marginBottom: '2px',
  },
  comicDialogueText: {
    fontFamily: 'var(--font-title)',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#000000',
    margin: 0,
    lineHeight: '1.3',
  },
  comicNavigation: {
    background: '#12121e',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '2px solid #222235',
  },
  comicNavBtn: {
    background: '#2e2e4a',
    color: '#cbd5e1',
    border: '1.5px solid #3f3f66',
    borderRadius: '4px',
    padding: '6px 14px',
    fontFamily: 'var(--font-hud)',
    fontWeight: 'bold',
    fontSize: '10px',
    letterSpacing: '1.5px',
    transition: 'all 0.15s ease',
  },
  slideDotsContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  tvChannelImage: {
    width: '100%',
    height: '110px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1.5px solid rgba(255,255,255,0.15)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
    marginBottom: '4px',
  },
  tvGlitchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 15,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  tvGlitchNoise: {
    width: '100%',
    height: '100%',
    background: 'repeating-radial-gradient(circle, #555 0px, #222 2px, #000 4px)',
    opacity: 0.7,
    animation: 'static-noise-anim 0.05s infinite',
  },
  tvGlitchHorizontalBar: {
    position: 'absolute',
    width: '100%',
    height: '12px',
    background: 'rgba(255, 255, 255, 0.4)',
    boxShadow: '0 0 10px rgba(255,255,255,0.8)',
    animation: 'scanline-drift 0.2s infinite linear',
  },
  flippingSheet3D: {
    position: 'absolute',
    top: 0,
    width: '50%',
    height: '100%',
    transformStyle: 'preserve-3d',
    zIndex: 30,
    pointerEvents: 'none',
  },
  flippingFaceFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    zIndex: 32,
  },
  flippingFaceBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    transform: 'rotateY(180deg)',
    zIndex: 31,
  },
};

export default LoreTable;
