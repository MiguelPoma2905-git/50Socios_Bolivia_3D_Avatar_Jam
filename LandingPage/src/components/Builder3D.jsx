import { useState, useRef, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import BuilderModel from './BuilderModel';
import soundManager from '../utils/soundManager';

const MECHAS = [
  {
    id: 'primekatari',
    name: 'PrimeKatari',
    model: '/models/PrimeKatari.fbx',
    modelPolygon: '/models/pumita.fbx',
    color: 'var(--neon-blue)',
    class: 'Autobús Municipal PumaKatari v3.2',
  },
  {
    id: 'zprime',
    name: 'Zprime Mecha',
    model: '/models/Zprimeultra.fbx',
    modelPolygon: '/models/zprime.fbx',
    color: 'var(--neon-red)',
    class: 'Prototipo Zprime',
  },
];

const VIEWS = {
  front: { pos: [0, 0, 10], label: 'FRONTAL' },
  back: { pos: [0, 0, -10], label: 'TRASERA' },
  left: { pos: [-10, 0, 0], label: 'IZQUIERDA' },
  right: { pos: [10, 0, 0], label: 'DERECHA' },
  top: { pos: [0, 10, 0.001], label: 'SUPERIOR' },
  bottom: { pos: [0, -10, 0.001], label: 'INFERIOR' },
};

const Builder3D = () => {
  const [mode, setMode] = useState('solid');
  const [isPaused, setIsPaused] = useState(false);
  const [activeMecha, setActiveMecha] = useState(MECHAS[0]);
  const controlsRef = useRef(null);

  const handleView = useCallback((key) => {
    soundManager.playTapeClick();
    const c = controlsRef.current;
    if (!c) return;
    const v = VIEWS[key];
    c.object.position.set(v.pos[0], v.pos[1], v.pos[2]);
    c.target.set(0, 0, 0);
    c.update();
  }, []);

  const togglePause = useCallback(() => {
    soundManager.playTapeClick();
    setIsPaused((p) => !p);
  }, []);

  const handleMode = useCallback(
    (m) => {
      if (m === mode) return;
      soundManager.playTapeClick();
      soundManager.playSliderTick(m === 'solid' ? 1 : m === 'textured' ? 3 : 2);
      setMode(m);
    },
    [mode],
  );

  const modelPath = mode === 'polygons' ? activeMecha.modelPolygon : activeMecha.model;

  return (
    <section id="taller3d" style={styles.section}>
      <div style={styles.inner}>
        <div className="metal-panel" style={styles.sidebar}>
          <div style={styles.header}>
            <span style={styles.hudLabel}>MÓDULO DE ENSAMBLAJE</span>
            <h2 style={styles.title}>3D BUILDER</h2>
            <div style={styles.statusLine}>
              <div className="pulse-green" style={styles.dot} />
              <span style={styles.statusText}>MOTOR 3D: OPERATIVO</span>
            </div>
          </div>

          <div style={styles.mechaList}>
            {MECHAS.map((mecha) => {
              const isActive = mecha.id === activeMecha.id;
              return (
                <button
                  key={mecha.id}
                  onClick={() => {
                    if (mecha.id === activeMecha.id) return;
                    soundManager.playTapeClick();
                    soundManager.playSliderTick(2);
                    setActiveMecha(mecha);
                  }}
                  style={{
                    ...styles.mechaBtn,
                    borderColor: isActive ? mecha.color : '#3f3f46',
                    boxShadow: isActive
                      ? `0 0 12px ${mecha.color}55, inset 0 0 8px ${mecha.color}22`
                      : 'none',
                  }}
                >
                  <div
                    style={{
                      ...styles.mechaDot,
                      backgroundColor: isActive ? mecha.color : '#3f3f46',
                      boxShadow: isActive ? `0 0 8px ${mecha.color}` : 'none',
                    }}
                  />
                  <div style={styles.mechaInfo}>
                    <span
                      style={{
                        ...styles.mechaName,
                        color: isActive ? '#f4f4f5' : 'var(--text-secondary)',
                      }}
                    >
                      {mecha.name}
                    </span>
                    <span style={styles.mechaClass}>{mecha.class}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={styles.group}>
            <span style={styles.groupLabel}>MODO</span>
            <div style={styles.row}>
              <button
                onClick={() => handleMode('solid')}
                style={mode === 'solid' ? styles.activeBtn : styles.btn}
              >
                SÓLIDO
              </button>
              <button
                onClick={() => handleMode('textured')}
                style={mode === 'textured' ? styles.activeBtn : styles.btn}
              >
                TEXTURAS
              </button>
            </div>
            <button
              onClick={() => handleMode('polygons')}
              style={{
                ...(mode === 'polygons' ? styles.activeBtn : styles.btn),
                width: '100%',
                borderColor: mode === 'polygons' ? 'var(--neon-green)' : '#3f3f46',
                color: mode === 'polygons' ? 'var(--neon-green)' : undefined,
                boxShadow: mode === 'polygons'
                  ? '0 0 10px rgba(0,255,0,0.2)'
                  : undefined,
              }}
            >
              POLÍGONOS
            </button>
          </div>

          <div style={styles.group}>
            <span style={styles.groupLabel}>VISTAS</span>
            <div style={styles.viewGrid}>
              {Object.entries(VIEWS).map(([key, v]) => (
                <button
                  key={key}
                  onClick={() => handleView(key)}
                  style={styles.viewBtn}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.group}>
            <span style={styles.groupLabel}>ANIMACIÓN</span>
            <button onClick={togglePause} style={{ ...styles.btn, width: '100%' }}>
              {isPaused ? '▶ REANUDAR' : '⏸ PAUSAR'}
            </button>
          </div>

          <div style={styles.helpBox}>
            <span style={styles.groupLabel}>CONTROLES</span>
            <div style={styles.helpText}>
              <span>Click + Arrastrar → Rotar</span>
              <span>Click Der. + Arrastrar → Mover</span>
              <span>Scroll → Zoom</span>
              <span>Click Ejes Gizmo → Vista</span>
            </div>
          </div>

          <div className="warning-stripes" style={styles.stripes} />
        </div>

        <div style={styles.canvasWrap}>
          <Canvas
            camera={{ position: [0, 0, 15], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true }}
            style={{ background: mode === 'polygons' ? '#050a0f' : mode === 'solid' ? '#1a1a1a' : '#0a0a0f' }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <directionalLight position={[-5, -3, -5]} intensity={0.4} />
            <hemisphereLight args={['#b1e1ff', '#000000', 0.5]} />
            <Suspense fallback={null}>
              <BuilderModel
                key={`${mode}-${activeMecha.id}`}
                mode={mode}
                isPaused={isPaused}
                modelPath={modelPath}
              />
            </Suspense>
            <OrbitControls
              ref={controlsRef}
              enableDamping
              dampingFactor={0.15}
              minDistance={0.01}
              maxDistance={500}
            />
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport
                axisColors={['#ef4444', '#22c55e', '#3b82f6']}
                labelColor="#ffffff"
              />
            </GizmoHelper>
          </Canvas>
          <div style={styles.fileLabel}>{activeMecha.name}.fbx</div>
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
    background:
      'linear-gradient(to bottom, var(--bg-deep) 0%, var(--bg-dark) 50%, var(--bg-deep) 100%)',
    padding: '120px 40px',
    transition: 'background 0.45s ease',
  },
  inner: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '24px',
    maxWidth: '1400px',
    width: '100%',
    zIndex: 5,
    height: '75vh',
    minHeight: '500px',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 16px',
    border: '2px solid var(--border-metal)',
    background: 'rgba(5, 6, 10, 0.88)',
    gap: '20px',
    overflowY: 'auto',
  },
  header: {
    borderBottom: '1px solid rgba(39, 39, 42, 0.4)',
    paddingBottom: '12px',
  },
  hudLabel: {
    fontFamily: 'var(--font-hud)',
    color: 'var(--text-secondary)',
    fontSize: '9px',
    letterSpacing: '2px',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '18px',
    fontWeight: '900',
    marginTop: '4px',
    letterSpacing: '0.5px',
    color: 'var(--text-primary)',
  },
  statusLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  statusText: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--neon-green)',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  groupLabel: {
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
    letterSpacing: '1.5px',
  },
  row: {
    display: 'flex',
    gap: '8px',
  },
  btn: {
    flex: 1,
    padding: '8px 6px',
    fontFamily: 'var(--font-mecha)',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    background: 'rgba(5, 6, 10, 0.6)',
    border: '2px solid #3f3f46',
    borderRadius: '4px',
    color: '#a1a1aa',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeBtn: {
    flex: 1,
    padding: '8px 6px',
    fontFamily: 'var(--font-mecha)',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    background: 'rgba(0, 229, 255, 0.1)',
    border: '2px solid var(--neon-blue)',
    borderRadius: '4px',
    color: 'var(--neon-blue)',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(0, 229, 255, 0.2)',
    transition: 'all 0.2s ease',
  },
  mechaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid rgba(39, 39, 42, 0.4)',
    borderBottom: '1px solid rgba(39, 39, 42, 0.4)',
    padding: '12px 0',
  },
  mechaBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    border: '2px solid',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'left',
    background: 'rgba(5, 6, 10, 0.6)',
    transition: 'all 0.25s ease',
  },
  mechaDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
    transition: 'all 0.25s ease',
  },
  mechaInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  mechaName: {
    fontFamily: 'var(--font-mecha)',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    transition: 'color 0.25s ease',
  },
  mechaClass: {
    fontFamily: 'var(--font-hud)',
    fontSize: '7px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  viewGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
  },
  viewBtn: {
    padding: '6px 4px',
    fontFamily: 'var(--font-hud)',
    fontSize: '8px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    background: 'rgba(5, 6, 10, 0.6)',
    border: '1.5px solid #3f3f46',
    borderRadius: '3px',
    color: '#a1a1aa',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  helpBox: {
    marginTop: 'auto',
    padding: '12px',
    border: '1px solid rgba(39, 39, 42, 0.4)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  helpText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    fontFamily: 'var(--font-hud)',
    fontSize: '8px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  stripes: {
    width: '100%',
    height: '6px',
    borderRadius: '2px',
    opacity: 0.4,
  },
  canvasWrap: {
    position: 'relative',
    border: '2px solid var(--border-metal)',
    borderRadius: '4px',
    overflow: 'hidden',
    minHeight: '500px',
  },
  fileLabel: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    fontFamily: 'var(--font-hud)',
    fontSize: '9px',
    color: 'var(--text-secondary)',
    background: 'rgba(5, 6, 10, 0.7)',
    padding: '4px 10px',
    borderRadius: '3px',
    border: '1px solid rgba(39, 39, 42, 0.4)',
    zIndex: 10,
    pointerEvents: 'none',
  },
};

export default Builder3D;
