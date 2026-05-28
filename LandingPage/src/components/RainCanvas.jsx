import { useEffect, useRef } from 'react';

const RainCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle high DPI screens for sharp drawing
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Raindrop variables
    const maxDrops = 100;
    const drops = [];
    const splashes = [];

    // Initialize drops
    for (let i = 0; i < maxDrops; i++) {
      drops.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight,
        length: 10 + Math.random() * 20,
        speed: 12 + Math.random() * 8,
        opacity: 0.15 + Math.random() * 0.3,
        thickness: 0.8 + Math.random() * 1.2,
        // Alternate colors to reflect the city neons (blue vs green/magenta)
        color: Math.random() > 0.4 ? '#00e5ff' : (Math.random() > 0.5 ? '#ff00ff' : '#39ff14'),
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Draw and update raindrops
      ctx.lineCap = 'round';
      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.strokeStyle = drop.color;
        ctx.globalAlpha = drop.opacity;
        ctx.lineWidth = drop.thickness;
        
        // Draw slanted raindrop (wind from left/top to right/bottom)
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 2, drop.y + drop.length);
        ctx.stroke();

        // Update positions
        drop.y += drop.speed;
        drop.x += 1.2; // Slanted fall

        // Recycle drop or trigger splash
        if (drop.y > window.innerHeight - 10) {
          // 15% chance to trigger splash animation on the floor
          if (Math.random() < 0.25) {
            splashes.push({
              x: drop.x,
              y: window.innerHeight - 5,
              radius: 1,
              maxRadius: 4 + Math.random() * 8,
              opacity: drop.opacity,
              color: drop.color,
              speed: 0.3 + Math.random() * 0.4,
            });
          }
          
          // Reset drop back to top
          drop.y = Math.random() * -60;
          drop.x = Math.random() * window.innerWidth;
        }
        
        // Wrap around sides if blown off screen
        if (drop.x > window.innerWidth) {
          drop.x = 0;
        }
      });

      // 2. Draw and update splashing ripples
      ctx.lineWidth = 1;
      for (let i = splashes.length - 1; i >= 0; i--) {
        const splash = splashes[i];
        ctx.beginPath();
        ctx.strokeStyle = splash.color;
        ctx.globalAlpha = splash.opacity;
        
        // Draw splash semi-ellipse ring
        ctx.arc(splash.x, splash.y, splash.radius, 0, Math.PI, true);
        ctx.stroke();

        // Expand ripple and fade out
        splash.radius += splash.speed;
        splash.opacity -= 0.035;

        // Remove dead splashes
        if (splash.opacity <= 0 || splash.radius >= splash.maxRadius) {
          splashes.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10,
        pointerEvents: 'none',
        opacity: 0.55,
      }}
    />
  );
};

export default RainCanvas;
