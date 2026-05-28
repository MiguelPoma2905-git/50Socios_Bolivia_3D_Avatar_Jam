import { useState, useEffect } from 'react';
import RainCanvas from './components/RainCanvas';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import LoreTable from './components/LoreTable';
import UnderTheHood from './components/UnderTheHood';
import CharacterGallery from './components/CharacterGallery';
import Roadmap from './components/Roadmap';
import Builder3D from './components/Builder3D';
import soundManager from './utils/soundManager';

function App() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isMuted, setIsMuted] = useState(true);
  const [theme, setTheme] = useState('dark'); // 'dark' (Noche Cyberpunk) or 'light' (Mañana Fría Paceña)

  // Sync theme with document.body to cascade CSS variables correctly
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
  }, [theme]);

  // Track active section on scroll to update the illuminated menu route signs
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'historia', 'proceso', 'galeria', 'roadmap', 'taller3d'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    soundManager.playTapeClick();
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundManager.setMute(nextMute);
  };

  const handleToggleTheme = () => {
    soundManager.playTapeClick();
    soundManager.playMetalClank(0.3);
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={theme === 'light' ? 'light-theme' : 'dark-theme'} style={styles.appWrapper}>
      {/* Drifting morning clouds & low-lying neblina banks */}
      <div className="clouds-container">
        {/* Layer 1: High slow cloud */}
        <svg className="cloud-layer cloud-layer-very-slow" style={{ top: '5%', height: '100px', width: '220px' }} viewBox="0 0 100 50">
          <path d="M10 40 a15 15 0 0 1 15 -15 a20 20 0 0 1 35 -10 a15 15 0 0 1 25 10 a15 15 0 0 1 5 15 z" />
        </svg>
        {/* Layer 2: Mid-height fluffy cloud bank */}
        <svg className="cloud-layer cloud-layer-slow" style={{ top: '18%', left: '15%', height: '120px', width: '250px' }} viewBox="0 0 200 100">
          <path d="M10 80 A20 20 0 0 1 30 60 A25 25 0 0 1 70 50 A30 30 0 0 1 120 40 A25 25 0 0 1 160 55 A20 20 0 0 1 190 80 Z" />
        </svg>
        {/* Layer 3: High medium cloud */}
        <svg className="cloud-layer cloud-layer-medium" style={{ top: '10%', left: '40%', height: '80px', width: '180px' }} viewBox="0 0 100 50">
          <path d="M10 40 a15 15 0 0 1 15 -15 a20 20 0 0 1 35 -10 a15 15 0 0 1 25 10 a15 15 0 0 1 5 15 z" />
        </svg>
        {/* Layer 4: Fast high wind cloud */}
        <svg className="cloud-layer cloud-layer-fast" style={{ top: '6%', left: '65%', height: '110px', width: '240px' }} viewBox="0 0 100 50">
          <path d="M10 40 a15 15 0 0 1 15 -15 a20 20 0 0 1 35 -10 a15 15 0 0 1 25 10 a15 15 0 0 1 5 15 z" />
        </svg>
        {/* Layer 5: Low heavy fog mist (very blurry) */}
        <svg className="fog-layer cloud-layer-very-slow" style={{ top: '35%', left: '10%', height: '140px', width: '380px' }} viewBox="0 0 200 100">
          <path d="M10 80 A20 20 0 0 1 30 60 A25 25 0 0 1 70 50 A30 30 0 0 1 120 40 A25 25 0 0 1 160 55 A20 20 0 0 1 190 80 Z" />
        </svg>
        {/* Layer 6: Mid-low mist layer */}
        <svg className="fog-layer cloud-layer-slow" style={{ top: '50%', left: '50%', height: '150px', width: '400px' }} viewBox="0 0 200 100">
          <path d="M10 80 A20 20 0 0 1 30 60 A25 25 0 0 1 70 50 A30 30 0 0 1 120 40 A25 25 0 0 1 160 55 A20 20 0 0 1 190 80 Z" />
        </svg>
      </div>

      {/* Freezing Neblina / Haze bottom overlay gradient */}
      <div className="neblina-overlay" />

      {/* Immersive CRT Computer Monitor grid scanlines */}
      <div className="scanlines" />

      {/* Real-time canvas reflective rain drops */}
      <RainCanvas />

      {/* Floating Bolivian Route Placards menu */}
      <Navigation activeSection={activeSection} />

      {/* FLOATING DUAL INDUSTRIAL DASHBOARD (Top-Right) */}
      <div className="app-dashboard-card metal-panel" style={styles.dashboardCard}>
        
        {/* SWITCH 1: SOUND SYSTEM */}
        <div style={styles.dashboardSwitchGroup}>
          <div style={styles.labelGroup}>
            <span style={styles.plateTitle}>GENERADOR ACÚSTICO</span>
            <span style={{ 
              ...styles.statusText,
              color: isMuted ? 'var(--neon-red)' : 'var(--neon-green)',
              textShadow: isMuted ? '0 0 8px var(--neon-red-glow)' : '0 0 8px var(--neon-green-glow)'
            }}>
              {isMuted ? 'SILENCIADO' : 'OPERATIVO'}
            </span>
          </div>
          
          <button
            onClick={handleToggleSound}
            className="shake-hover"
            style={{
              ...styles.toggleSwitch,
              borderColor: isMuted ? 'var(--neon-red)' : 'var(--neon-green)',
              background: isMuted ? 'rgba(217,71,71,0.08)' : 'rgba(27,154,46,0.08)',
            }}
          >
            <div style={{
              ...styles.switchLever,
              transform: isMuted ? 'translateY(6px) rotate(15deg)' : 'translateY(-6px) rotate(-15deg)',
              backgroundColor: isMuted ? '#991b1b' : '#065f46',
            }}>
              <div style={{
                ...styles.switchKnob,
                backgroundColor: isMuted ? 'var(--neon-red)' : 'var(--neon-green)',
                boxShadow: isMuted ? '0 0 10px var(--neon-red-glow)' : '0 0 10px var(--neon-green-glow)',
              }} />
            </div>
          </button>
        </div>

        {/* Vertical divider */}
        <div style={styles.switchDivider} />

        {/* SWITCH 2: THEME / WEATHER SWITCH */}
        <div style={styles.dashboardSwitchGroup}>
          <div style={styles.labelGroup}>
            <span style={styles.plateTitle}>CLIMA PACEÑO</span>
            <span style={{ 
              ...styles.statusText,
              color: theme === 'dark' ? 'var(--neon-blue)' : 'var(--neon-chicha)',
              textShadow: theme === 'dark' ? '0 0 8px var(--neon-blue-glow)' : '0 0 8px var(--neon-chicha-glow)'
            }}>
              {theme === 'dark' ? 'NOCHE CYBER' : 'MAÑANA FRÍA'}
            </span>
          </div>
          
          <button
            onClick={handleToggleTheme}
            className="shake-hover"
            style={{
              ...styles.toggleSwitch,
              borderColor: theme === 'dark' ? 'var(--neon-blue)' : 'var(--neon-chicha)',
              background: theme === 'dark' ? 'rgba(0,229,255,0.08)' : 'rgba(196,106,45,0.08)',
            }}
          >
            <div style={{
              ...styles.switchLever,
              transform: theme === 'dark' ? 'translateY(6px) rotate(15deg)' : 'translateY(-6px) rotate(-15deg)',
              backgroundColor: theme === 'dark' ? '#0369a1' : '#b45309',
            }}>
              <div style={{
                ...styles.switchKnob,
                backgroundColor: theme === 'dark' ? 'var(--neon-blue)' : 'var(--neon-chicha)',
                boxShadow: theme === 'dark' ? '0 0 10px var(--neon-blue-glow)' : '0 0 10px var(--neon-chicha-glow)',
              }} />
            </div>
          </button>
        </div>

      </div>

      {/* SECTIONS */}
      <HeroSection isSoundMuted={isMuted} />
      <LoreTable />
      <UnderTheHood />
      <CharacterGallery />
      <Roadmap />
      <Builder3D />

      {/* CLANDESTINE FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          <div style={styles.footerLeft}>
            <span style={styles.footerTitle}>UTAFORMERS: AL FONDO HAY CAMPO</span>
            <span style={styles.footerSub}>PROYECTO INDIE DE MICROS CLÁSICOS PACEÑOS © 2026</span>
          </div>
          
          <div className="app-warning-line warning-stripes" style={styles.warningLine} />

          <div className="app-footer-right" style={styles.footerRight}>
            <span>RETRO-TECNOLOGÍA DE LAS HUACAS - LA PAZ, BOLIVIA</span>
            <span>DISEÑADO PARA CONDICIONES CRÍTICAS DE CALLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  appWrapper: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: 'var(--bg-deep)',
    transition: 'background-color 0.45s ease',
  },
  dashboardCard: {
    position: 'fixed',
    top: '95px',
    right: '24px',
    zIndex: 99,
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'var(--bg-card)',
    border: '1.5px solid var(--border-metal)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  dashboardSwitchGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  labelGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    minWidth: '110px',
  },
  plateTitle: {
    fontFamily: 'var(--font-hud)',
    fontSize: '8px',
    color: 'var(--text-secondary)',
    letterSpacing: '1.5px',
    lineHeight: 1,
  },
  statusText: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    marginTop: '3px',
    transition: 'all 0.2s ease',
  },
  toggleSwitch: {
    width: '26px',
    height: '38px',
    borderRadius: '4px',
    border: '2px solid',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  switchLever: {
    width: '4px',
    height: '20px',
    borderRadius: '2px',
    position: 'relative',
    transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s ease',
  },
  switchKnob: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    position: 'absolute',
    left: '50%',
    top: '0',
    transform: 'translateX(-50%)',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
  },
  switchDivider: {
    width: '1px',
    height: '30px',
    backgroundColor: 'var(--border-metal)',
    opacity: 0.5,
  },
  footer: {
    background: 'var(--bg-dark)',
    borderTop: '2px solid var(--border-metal)',
    padding: '30px 40px',
    position: 'relative',
    zIndex: 10,
    transition: 'background-color 0.45s ease, border-color 0.45s ease',
  },
  footerGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    flexWrap: 'wrap',
    gap: '20px',
  },
  footerLeft: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  footerTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: '900',
    fontSize: '15px',
    letterSpacing: '1px',
    color: 'var(--text-primary)',
  },
  footerSub: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
    letterSpacing: '1.5px',
    marginTop: '4px',
  },
  warningLine: {
    width: '120px',
    height: '8px',
    borderRadius: '2px',
    opacity: 0.5,
  },
  footerRight: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right',
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
    gap: '4px',
    letterSpacing: '1px',
  },
};

export default App;
