import { useState, useRef } from 'react';
import YouTube from 'react-youtube';
import soundManager from '../utils/soundManager';

const CyberSpeaker = () => {
  const [videoId, setVideoId] = useState('K4DyBUG242c');
  const [inputUrl, setInputUrl] = useState('https://youtube.com/watch?v=K4DyBUG242c');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [ytError, setYtError] = useState(null);

  const playerRef = useRef(null);

  const onReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
  };

  const onStateChange = (event) => {
    // YouTube.PlayerState.PLAYING is 1
    if (event.data === 1) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setInputUrl(val);
    const extractedId = extractVideoId(val);
    if (extractedId && extractedId.length === 11) {
      setVideoId(extractedId);
      setIsPlaying(false);
      setYtError(null);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    soundManager.playTapeClick();
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    if (playerRef.current) {
      playerRef.current.setVolume(newVol);
    }
  };

  return (
    <section id="speaker" style={styles.section} className="scene-transition">
      {/* 
        This section uses the generated 8K hyperrealistic product photography image
        of the retro audio speaker embedded in the metal control panel.
      */}
      <div style={styles.lightingOverlay} />

      <div style={styles.header}>
        <h2 style={styles.title}>TEMITAS QUE TE ENTRAN AL CORAZÓN</h2>
        <span style={styles.subtitle}>Para mirar por la ventana mientras el micro baja por la Pérez</span>
        <p style={styles.desc}>
          “Esos temitas que te agarran justo cuando ya está anocheciendo en La Paz, con las luces prendidas trepando los cerros y el vidrio empañado del micro. Dale play al parlantito y dejá que la música te acompañe en el viaje, mientras el chofer mete curva suave y la ciudad pasa despacito, a ritmo de trufi. Canciones para quedarse mirando afuera y sentir cómo el chasis también tiene corazón.”
        </p>
      </div>

      <div style={styles.panelContainer}>
        <div style={styles.panelBackground}>
          {/* CSS Drawn Cyberpunk Speaker */}
          <div style={styles.speakerHousing}>
            <div style={styles.speakerNeonRing} className="speaker-pulse">
              <div style={styles.speakerGrille}>
                <div style={styles.speakerCone} className={isPlaying ? 'vibrating' : ''}>
                  {/* Decorative Screws */}
                  <div style={{...styles.screw, top: '6%', left: '50%'}} />
                  <div style={{...styles.screw, bottom: '6%', left: '50%'}} />
                  <div style={{...styles.screw, left: '6%', top: '50%'}} />
                  <div style={{...styles.screw, right: '6%', top: '50%'}} />
                  <div style={{...styles.screw, top: '16%', left: '16%'}} />
                  <div style={{...styles.screw, top: '16%', right: '16%'}} />
                  <div style={{...styles.screw, bottom: '16%', left: '16%'}} />
                  <div style={{...styles.screw, bottom: '16%', right: '16%'}} />

                  <div style={styles.speakerCenterDustCap} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle wire/conduit decorations */}
          <div style={styles.wireDeco1} />
          <div style={styles.wireDeco2} />
          <div style={styles.stickerPuma}>PUMA-TRANSFORMER</div>
          <div style={styles.stickerEnvidia}>TU ENVIDIA ES MI BENDICIÓN</div>
          <div style={styles.stickerNadie}>A MÍ NO ME MANDA NADIE</div>
          
          {/* Espacios estratégicos para imágenes tipo sticker */}
          <img src="/imgs/comic.png" alt="Sticker Spot 1" style={styles.imageSticker1} />
          <img src="/imgs/comic.png" alt="Sticker Spot 2" style={styles.imageSticker2} />

          {/* Interactive Overlay UI matching the prompt's description */}
          <div style={styles.controlsOverlay}>
            
            {/* Tactile Knobs Row */}
            <div style={styles.knobsRow}>
              <div style={styles.knobContainer}>
                <div style={styles.knobGlow}>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume} 
                    onChange={handleVolumeChange} 
                    style={styles.knobInput}
                  />
                </div>
                <span style={styles.knobLabel}>VOLUME: GENERAL</span>
              </div>
              
              <div style={styles.knobContainer}>
                <div style={{...styles.knobGlow, opacity: 0.5}}>
                  <input type="range" min="0" max="100" defaultValue="50" style={styles.knobInput} disabled />
                </div>
                <span style={styles.knobLabel}>VOLUME: CANAL SINDICAL</span>
              </div>
            </div>

            {/* Stacked Rectangular Buttons */}
            <div style={styles.buttonsRow}>
              <button 
                onClick={togglePlay}
                style={{
                  ...styles.mechButton,
                  boxShadow: isPlaying ? '0 0 15px rgba(220, 38, 38, 0.6), inset 0 0 10px rgba(220, 38, 38, 0.4)' : 'inset 0 0 10px rgba(220, 38, 38, 0.2)'
                }}
              >
                <span style={{ color: isPlaying ? '#ff4444' : '#dd5555', textShadow: isPlaying ? '0 0 8px #ff0000' : '0 0 4px #ff0000' }}>
                  {isPlaying ? '║' : '►'}
                </span>
              </button>
              <button style={styles.mechButton}>
                <span style={{ color: '#552222' }}>››</span>
              </button>
            </div>

            {/* Static YouTube URL Input */}
            <div style={styles.inputContainer}>
              <span style={styles.inputLabel}>SEÑAL YT //</span>
              <input 
                type="text" 
                value={inputUrl}
                onChange={handleUrlChange}
                placeholder="Pegar enlace de YouTube aquí..."
                style={styles.urlInput}
                spellCheck="false"
              />
            </div>

            {/* Tiny cracked red-phosphor LED display terminal */}
            <div style={styles.ledTerminal}>
              <div style={styles.ledText}>
                {ytError 
                  ? `YOUTUBE ERROR ${ytError}: EL DUEÑO BLOQUEÓ LA REPRODUCCIÓN EXTERNA. ¡PRUEBA OTRO LINK!` 
                  : `YOUTUBE: SINDICAL FM - CANAL ACTIVO [${videoId}] - STATUS: ${isPlaying ? 'PLAYING' : 'PAUSED'}`}
              </div>
              <div style={styles.ledScanline} />
            </div>

          </div>
        </div>

        {/* Visually hidden but rendered YouTube Player to prevent browser blocking */}
        <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', opacity: 0 }}>
          <YouTube 
            videoId={videoId} 
            opts={{
              height: '10',
              width: '10',
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                playsinline: 1,
                origin: window.location.origin,
              },
            }}
            onReady={onReady}
            onStateChange={onStateChange}
            onError={(e) => {
              console.log("YT Error:", e.data);
              setYtError(e.data);
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse-cyan {
          0% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.2); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.5); }
          100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.2); }
        }
        .speaker-pulse {
          animation: pulse-cyan 3s infinite ease-in-out;
        }
        @keyframes scroll-led {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes speaker-vibrate {
          0% { transform: scale(1); }
          25% { transform: scale(1.015); }
          50% { transform: scale(1); }
          75% { transform: scale(1.01); }
          100% { transform: scale(1); }
        }
        .vibrating {
          animation: speaker-vibrate 0.1s infinite alternate;
        }
      `}</style>
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
    background: 'linear-gradient(to bottom, var(--bg-deep) 0%, #060608 50%, var(--bg-deep) 100%)',
    padding: '100px 40px',
    overflow: 'hidden',
  },
  lightingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,255,0.03) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  header: {
    textAlign: 'center',
    maxWidth: '700px',
    marginBottom: '50px',
    zIndex: 5,
  },
  label: {
    fontFamily: 'var(--font-hud)',
    color: 'var(--neon-chicha)',
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
  subtitle: {
    display: 'block',
    fontFamily: 'var(--font-hud)',
    color: 'var(--neon-chicha)',
    fontSize: '13px',
    letterSpacing: '1.5px',
    fontWeight: 'bold',
    marginTop: '12px',
    textTransform: 'uppercase',
  },
  desc: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginTop: '15px',
    lineHeight: '1.6',
  },
  panelContainer: {
    width: '100%',
    maxWidth: '850px',
    aspectRatio: '16/9',
    position: 'relative',
    borderRadius: '16px',
    border: '4px solid #1a1a24',
    boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.9)',
    overflow: 'hidden',
    zIndex: 10,
  },
  panelBackground: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#161616',
    backgroundImage: `
      repeating-linear-gradient(90deg, transparent 0, transparent 50px, rgba(255,255,255,0.015) 50px, rgba(255,255,255,0.015) 51px),
      repeating-linear-gradient(0deg, transparent 0, transparent 50px, rgba(255,255,255,0.015) 50px, rgba(255,255,255,0.015) 51px),
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 20%),
      radial-gradient(circle at 80% 70%, rgba(0,255,255,0.02) 0%, transparent 20%)
    `,
    border: '1px solid #222',
  },
  speakerHousing: {
    position: 'absolute',
    top: '38%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    background: '#090a0f',
    border: '8px solid #1a1a24',
    boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  speakerNeonRing: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '4px solid rgba(0, 255, 255, 0.4)',
    boxShadow: '0 0 20px rgba(0,255,255,0.4), inset 0 0 15px rgba(0,255,255,0.2)',
    padding: '8px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerGrille: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: '#111',
    backgroundImage: 'radial-gradient(rgba(0,0,0,0.6) 2px, transparent 2px)',
    backgroundSize: '8px 8px',
    position: 'relative',
    overflow: 'hidden',
    border: '2px solid #000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,1)',
  },
  speakerCone: {
    width: '72%',
    height: '72%',
    borderRadius: '50%',
    background: 'repeating-linear-gradient(45deg, #111 0, #111 2px, #18181b 2px, #18181b 4px)',
    boxShadow: '0 0 15px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,1), inset 0 0 10px rgba(255,255,255,0.05)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #222',
    position: 'relative',
  },
  screw: {
    position: 'absolute',
    width: '6px',
    height: '6px',
    background: 'radial-gradient(circle, #888 0%, #333 100%)',
    borderRadius: '50%',
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 1px 3px rgba(0,0,0,0.8)',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
  },
  speakerCenterDustCap: {
    width: '35%',
    height: '35%',
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, #27272a 0%, #050505 60%)',
    boxShadow: '0 5px 10px rgba(0,0,0,0.6)',
    border: '1px solid #1f1f1f',
  },
  wireDeco1: {
    position: 'absolute',
    top: '-20px',
    left: '15%',
    width: '8px',
    height: '200px',
    background: 'linear-gradient(90deg, #b45309 0%, #78350f 50%, #b45309 100%)',
    borderRadius: '4px',
    transform: 'rotate(15deg)',
    boxShadow: '2px 5px 10px rgba(0,0,0,0.6)',
    zIndex: 1,
  },
  wireDeco2: {
    position: 'absolute',
    bottom: '80px',
    right: '5%',
    width: '12px',
    height: '180px',
    background: 'linear-gradient(90deg, #3f3f46 0%, #18181b 50%, #3f3f46 100%)',
    borderRadius: '6px',
    transform: 'rotate(-25deg)',
    boxShadow: '-2px 5px 10px rgba(0,0,0,0.6)',
    zIndex: 1,
  },
  stickerPuma: {
    position: 'absolute',
    top: '20%',
    right: '12%',
    background: '#fef08a',
    color: '#000',
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    fontWeight: 'bold',
    padding: '4px 8px',
    transform: 'rotate(8deg)',
    border: '1px solid #ca8a04',
    boxShadow: '1px 2px 4px rgba(0,0,0,0.4)',
    opacity: 0.8,
    zIndex: 2,
    borderBottomRightRadius: '10px',
  },
  stickerEnvidia: {
    position: 'absolute',
    top: '12%',
    left: '18%',
    background: '#ef4444',
    color: '#fff',
    fontFamily: 'var(--font-title)',
    fontSize: '10px',
    fontWeight: '900',
    padding: '6px 10px',
    transform: 'rotate(-12deg)',
    border: '2px dashed #b91c1c',
    boxShadow: '2px 4px 6px rgba(0,0,0,0.5)',
    opacity: 0.85,
    zIndex: 2,
    borderTopLeftRadius: '12px',
    letterSpacing: '1px',
    textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
  },
  stickerNadie: {
    position: 'absolute',
    bottom: '35%',
    right: '6%',
    background: '#0ea5e9',
    color: '#fff',
    fontFamily: 'var(--font-title)',
    fontSize: '9px',
    fontWeight: '900',
    padding: '4px 12px',
    transform: 'rotate(-15deg)',
    border: '2px solid #0369a1',
    boxShadow: '-2px 3px 5px rgba(0,0,0,0.6)',
    opacity: 0.9,
    zIndex: 2,
    borderTopRightRadius: '15px',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
  },
  imageSticker1: {
    position: 'absolute',
    top: '8%',
    right: '25%',
    width: '65px',
    height: '65px',
    objectFit: 'cover',
    border: '3px solid #f8fafc',
    boxShadow: '2px 4px 6px rgba(0,0,0,0.7)',
    transform: 'rotate(12deg)',
    zIndex: 2,
    borderRadius: '2px',
    backgroundColor: '#222',
  },
  imageSticker2: {
    position: 'absolute',
    bottom: '22%',
    left: '8%',
    width: '90px',
    height: '60px',
    objectFit: 'cover',
    border: '4px solid #fef08a',
    boxShadow: '-2px 4px 8px rgba(0,0,0,0.8)',
    transform: 'rotate(-8deg)',
    zIndex: 2,
    borderRadius: '2px',
    backgroundColor: '#222',
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: '20px',
    left: '0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '0 40px',
  },
  knobsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '500px',
  },
  knobContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  knobGlow: {
    background: 'rgba(0, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '8px',
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
    border: '1px solid rgba(0, 255, 255, 0.1)',
  },
  knobInput: {
    width: '120px',
    accentColor: '#00ffff',
    cursor: 'pointer',
  },
  knobLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: '#00ffff',
    letterSpacing: '1px',
    textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
    background: 'rgba(0,0,0,0.6)',
    padding: '2px 6px',
    borderRadius: '2px',
  },
  buttonsRow: {
    display: 'flex',
    gap: '15px',
  },
  mechButton: {
    width: '60px',
    height: '35px',
    background: '#111',
    border: '2px solid #333',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'var(--font-mecha)',
    fontSize: '14px',
    transition: 'all 0.15s ease',
  },
  ledTerminal: {
    width: '100%',
    maxWidth: '600px',
    height: '30px',
    background: '#0a0000',
    border: '2px solid #3a0000',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    boxShadow: 'inset 0 0 10px rgba(255,0,0,0.3), 0 5px 15px rgba(0,0,0,0.8)',
    marginTop: '10px',
  },
  ledText: {
    fontFamily: 'var(--font-typewriter)',
    fontSize: '12px',
    color: '#ff3333',
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textShadow: '0 0 5px #ff0000, 0 0 10px #ff0000',
    animation: 'scroll-led 15s linear infinite',
  },
  ledInput: {
    // (Deprecated inside scrolling marquee)
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#111',
    border: '1px solid #333',
    padding: '4px 10px',
    borderRadius: '4px',
    width: '100%',
    maxWidth: '500px',
  },
  inputLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--neon-chicha)',
    letterSpacing: '1px',
    whiteSpace: 'nowrap',
  },
  urlInput: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontFamily: 'var(--font-hud)',
    fontSize: '11px',
    width: '100%',
    outline: 'none',
    letterSpacing: '0.5px',
  },
  ledScanline: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(255,0,0,0) 50%, rgba(0,0,0,0.5) 50%)',
    backgroundSize: '100% 4px',
    pointerEvents: 'none',
  }
};

export default CyberSpeaker;
