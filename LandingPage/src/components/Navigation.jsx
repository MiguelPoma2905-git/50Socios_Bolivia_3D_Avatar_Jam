import soundManager from '../utils/soundManager';

const Navigation = ({ activeSection }) => {
  const menuItems = [
    { id: 'inicio', title: 'INICIO', routes: 'PÉREZ - CEJA - AUTOPISTA', color: 'var(--neon-green)' },
    { id: 'historia', title: 'HISTORIA', routes: 'TALLER - EL ALTO - COTAHUMA', color: 'var(--neon-blue)' },
    { id: 'proceso', title: 'BAJO EL CAPÓ', routes: 'SOPOCACHI - PRADO - MIRAFLORES', color: 'var(--neon-chicha)' },
    { id: 'galeria', title: 'GARAJE MECHA', routes: 'GARAJE - SAN PEDRO - ACHUMANI', color: 'var(--neon-red)' },
<<<<<<< HEAD
    { id: 'speaker', title: 'RADIO SINDICAL', routes: 'SINTONIZANDO - FM - 88.5', color: 'var(--neon-yellow)' },
=======
    { id: 'roadmap', title: 'HOJA DE RUTA', routes: 'CONTROL - PEAJE - V. FÁTIMA', color: 'var(--neon-yellow)' },
    { id: 'taller3d', title: '3D BUILDER', routes: 'ENSAMBLAJE - 3D - RENDER', color: 'var(--neon-purple)' },
>>>>>>> ebf4036c1b443654c6c0c5cc1973862e17d6786b
  ];

  const handleScroll = (id) => {
    soundManager.playTapeClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHover = () => {
    soundManager.playNeonFlicker();
  };

  return (
    <div style={styles.navContainer}>
      <div style={styles.navInner}>
        <div style={styles.workshopTitle}>
          <span style={{ color: 'var(--neon-red)', textShadow: '0 0 10px rgba(255,0,60,0.5)', whiteSpace: 'nowrap' }}>[ TALLER CLANDESTINO ]</span>
          <span style={styles.hudTerminal}>SISTEMA DE RUTAS v1.0.8</span>
        </div>

        <nav style={styles.navMenu}>
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                onMouseEnter={handleHover}
                className="shake-hover"
                style={{
                  ...styles.routePlacard,
                  borderColor: isActive ? item.color : '#3f3f46',
                  boxShadow: isActive ? `0 0 15px ${item.color}55, inset 0 0 10px ${item.color}33` : 'none',
                }}
              >
                {/* Microbus Route Strip Warning lines */}
                <div style={{ ...styles.stripeBar, backgroundColor: isActive ? item.color : '#27272a' }} />
                
                <div style={styles.placardContent}>
                  {/* Destination */}
                  <span style={styles.placardLabel}>CORTESÍA</span>
                  
                  {/* Route text */}
                  <span style={{ 
                    ...styles.placardTitle, 
                    color: isActive ? item.color : '#f4f4f5',
                    textShadow: isActive ? `0 0 8px ${item.color}` : 'none' 
                  }}>
                    {item.title}
                  </span>
                </div>
                
                {/* Small indicator dot */}
                <div style={{ 
                  ...styles.statusDot, 
                  backgroundColor: isActive ? item.color : '#3f3f46',
                  boxShadow: isActive ? `0 0 10px ${item.color}` : 'none'
                }} />
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

const styles = {
  navContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 100,
    padding: '16px 24px',
    background: 'linear-gradient(to bottom, rgba(5, 6, 10, 0.95) 0%, rgba(5, 6, 10, 0.75) 60%, transparent 100%)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(39, 39, 42, 0.4)',
  },
  navInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1300px',
    margin: '0 auto',
    width: '100%',
  },
  workshopTitle: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'var(--font-mecha)',
    fontWeight: '800',
    letterSpacing: '1px',
    fontSize: '15px',
  },
  hudTerminal: {
    fontFamily: 'var(--font-hud)',
    fontSize: '10px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    letterSpacing: '2px',
  },
  navMenu: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  routePlacard: {
    background: '#090a0f',
    border: '2px solid #3f3f46',
    borderRadius: '4px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '4px 14px 4px 6px',
    textAlign: 'left',
    transition: 'all 0.25s ease',
    minWidth: '145px',
    overflow: 'hidden',
  },
  stripeBar: {
    width: '5px',
    height: '38px',
    borderRadius: '2px',
    marginRight: '10px',
    transition: 'background-color 0.25s ease',
  },
  placardContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  placardLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '8px',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    lineHeight: 1,
    marginBottom: '1px',
  },
  placardTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: '900',
    fontSize: '14px',
    letterSpacing: '0.5px',
    lineHeight: 1.1,
    transition: 'all 0.25s ease',
  },
  placardRoutes: {
    fontFamily: 'var(--font-hud)',
    fontSize: '8px',
    letterSpacing: '0.5px',
    lineHeight: 1,
    marginTop: '3px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '120px',
    transition: 'color 0.25s ease',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    transition: 'all 0.25s ease',
  },
};

export default Navigation;
