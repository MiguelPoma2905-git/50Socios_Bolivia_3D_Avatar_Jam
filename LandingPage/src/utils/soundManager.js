class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.isMuted = true;
    
    // Engine nodes
    this.engineCtx = null;
    this.engineOsc = null;
    this.engineSub = null;
    this.engineGain = null;
    this.engineFilter = null;
  }

  // Initialize the audio context (must be triggered by a user interaction)
  init() {
    if (this.ctx) return;
    
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.45;
      this.masterGain.connect(this.ctx.destination);
      
      this.startAmbientHum();
    } catch (e) {
      console.error("Web Audio API not supported or blocked: ", e);
    }
  }

  setMute(mute) {
    this.isMuted = mute;
    if (!this.ctx) {
      this.init();
    }
    if (this.masterGain) {
      // Smooth transition to avoid clicking sounds
      this.masterGain.gain.setTargetAtTime(mute ? 0 : 0.45, this.ctx.currentTime, 0.1);
    }
  }

  // Clandestine generator hum & rain crackle background
  startAmbientHum() {
    if (!this.ctx) return;

    // Low rumble generator
    const osc = this.ctx.createOscillator();
    const oscSub = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    this.ambientGain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
    
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(27.5, this.ctx.currentTime); // A0 note

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(80, this.ctx.currentTime);

    this.ambientGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    osc.connect(filter);
    oscSub.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    osc.start();
    oscSub.start();

    // Create a procedural rain crackle (white noise buffer)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1500, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start();

    // Save references to stop or modify them later
    this.ambientSource = { osc, oscSub, noise, noiseGain };
  }

  // Synthesize neon flicker buzz
  playNeonFlicker() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now); // Double mains frequency buzz

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.Q.setValueAtTime(5, now);

    gain.gain.setValueAtTime(0, now);
    // Simulate flickering volume
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.setValueAtTime(0.02, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
    gain.gain.setValueAtTime(0, now + 0.2);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.25);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(now + 0.45);
  }

  // Start microbus engine accelerator rev
  startEngine() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Set up engine synthesizer nodes
    this.engineOsc = this.ctx.createOscillator();
    this.engineSub = this.ctx.createOscillator();
    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineGain = this.ctx.createGain();

    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(45, now); // Idle rumble

    this.engineSub.type = 'sawtooth';
    this.engineSub.frequency.setValueAtTime(22.5, now); // Deep undertone

    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(90, now);

    this.engineGain.gain.setValueAtTime(0.1, now);
    // Fade in
    this.engineGain.gain.linearRampToValueAtTime(0.35, now + 0.2);

    this.engineOsc.connect(this.engineFilter);
    this.engineSub.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    this.engineOsc.start();
    this.engineSub.start();
  }

  // Rev the engine based on a value from 0 to 1
  revEngine(intensity) {
    if (!this.ctx || !this.engineOsc || !this.engineFilter || !this.engineGain) return;

    const now = this.ctx.currentTime;
    // Map intensity to engine frequency: idle 45Hz -> fully revved 160Hz
    const freq = 45 + intensity * 125;
    // Map intensity to sub frequency: idle 22.5Hz -> fully revved 80Hz
    const subFreq = 22.5 + intensity * 62.5;
    // Open up filter cutoff: idle 90Hz -> revved 600Hz (lets high grit through)
    const cutoff = 90 + intensity * 600;
    // Increase engine volume slightly
    const volume = 0.35 + intensity * 0.45;

    this.engineOsc.frequency.setTargetAtTime(freq, now, 0.05);
    this.engineSub.frequency.setTargetAtTime(subFreq, now, 0.05);
    this.engineFilter.frequency.setTargetAtTime(cutoff, now, 0.08);
    this.engineGain.gain.setTargetAtTime(volume, now, 0.05);

    // Procedural rattling sound at high revs (simulate old loose components)
    if (intensity > 0.6 && Math.random() < 0.2) {
      this.playMetalClank(0.04);
    }
  }

  // Stop the engine and play mechanical wind-down
  stopEngine(isTransforming = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.engineOsc && this.engineSub && this.engineGain && this.engineFilter) {
      if (isTransforming) {
        // Transformation sound! Grind pitch and steam blowoff
        this.engineOsc.frequency.linearRampToValueAtTime(30, now + 0.5);
        this.engineSub.frequency.linearRampToValueAtTime(15, now + 0.5);
        this.engineFilter.frequency.linearRampToValueAtTime(40, now + 0.5);
        this.engineGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        const osc = this.engineOsc;
        const sub = this.engineSub;
        setTimeout(() => {
          try {
            osc.stop();
            sub.stop();
          } catch {
            // Suppress stop errors if nodes were already stopped
          }
        }, 800);

        this.playTransformationSfx();
      } else {
        // Simple mechanical stall
        this.engineOsc.frequency.setTargetAtTime(10, now, 0.25);
        this.engineSub.frequency.setTargetAtTime(5, now, 0.25);
        this.engineGain.gain.linearRampToValueAtTime(0, now + 0.4);

        const osc = this.engineOsc;
        const sub = this.engineSub;
        setTimeout(() => {
          try {
            osc.stop();
            sub.stop();
          } catch {
            // Suppress stop errors if nodes were already stopped
          }
        }, 500);
      }
    }

    this.engineOsc = null;
    this.engineSub = null;
    this.engineFilter = null;
    this.engineGain = null;
  }

  // Play mechanical metallic rattling clank
  playMetalClank(customVol = 0.25) {
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(250 + Math.random() * 400, now);
    
    filter.type = 'peaking';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(8, now);

    gain.gain.setValueAtTime(customVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(now + 0.2);
  }

  // Procedural mecha panel sliding and steam blowoff
  playTransformationSfx() {
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Hydraulic Steam Release (Filtered white noise)
    const bufferSize = this.ctx.sampleRate * 1.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 1.2); // Sweeps down like steam venting

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    // 2. Heavy Gears Clashing (Deep synth sweeps)
    const gearOsc = this.ctx.createOscillator();
    const gearGain = this.ctx.createGain();
    
    gearOsc.type = 'sawtooth';
    gearOsc.frequency.setValueAtTime(110, now);
    gearOsc.frequency.linearRampToValueAtTime(45, now + 0.8);
    
    gearGain.gain.setValueAtTime(0, now);
    gearGain.gain.linearRampToValueAtTime(0.35, now + 0.1);
    gearGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    gearOsc.connect(gearGain);
    gearGain.connect(this.masterGain);
    gearOsc.start();
    gearOsc.stop(now + 1.0);

    // 3. Electric sparks popping
    for (let i = 0; i < 4; i++) {
      const delay = 0.1 + i * 0.25;
      setTimeout(() => {
        this.playMetalClank(0.12);
      }, delay * 1000);
    }
  }

  // Morse Code / Cyber Transmissions
  playMorseTick(duration = 0.08) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now); // Green CRT tech chime

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(now + duration + 0.05);
  }

  // Radio Static Burst
  playRadioStatic(duration = 0.6) {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(1.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.05, now + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    // Minor mechanical crackle
    this.playMorseTick(0.12);
  }

  // Tape Cassette player click
  playTapeClick() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, now);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(200, now);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(now + 0.1);
  }

  // Giant Rubber Stamp Thud (milestone submission)
  playStampSlam() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Bass Impact boom (Low pitch sweep)
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(150, now);
    boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.25); // Drops deep
    
    boomGain.gain.setValueAtTime(0.7, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    boomOsc.connect(boomGain);
    boomGain.connect(this.masterGain);
    boomOsc.start();
    boomOsc.stop(now + 0.7);

    // 2. High Metallic Clatter (Iron stamp hitting concrete)
    const ironOsc = this.ctx.createOscillator();
    const ironFilter = this.ctx.createBiquadFilter();
    const ironGain = this.ctx.createGain();

    ironOsc.type = 'sawtooth';
    ironOsc.frequency.setValueAtTime(280, now);

    ironFilter.type = 'bandpass';
    ironFilter.frequency.setValueAtTime(1800, now);
    ironFilter.Q.setValueAtTime(2.5, now);

    ironGain.gain.setValueAtTime(0.25, now);
    ironGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    ironOsc.connect(ironFilter);
    ironFilter.connect(ironGain);
    ironGain.connect(this.masterGain);
    ironOsc.start();
    ironOsc.stop(now + 0.2);

    // 3. Expanding air pressure / dust blast (Noise hiss)
    const bufferSize = this.ctx.sampleRate * 0.4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(400, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start();
  }

  // Interactive slider tick (Under the Hood changes)
  playSliderTick(phaseIndex) {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency shifts based on stage (1. Sketch -> 4. Operational)
    osc.frequency.setValueAtTime(300 + phaseIndex * 150, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(now + 0.05);
  }

  // Procedural paper newspaper unfolding/rustle sound effect
  playPaperRustle() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.6;
    const bufferSize = this.ctx.sampleRate * duration;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Fill noise buffer
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4500, now); // super high-pitch crackle for papery crispness
    
    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(6000, now);
    filter2.Q.setValueAtTime(1.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);

    // Amplitude modulation flutters to simulate separate paper rustles
    for (let t = 0.05; t < duration; t += 0.05) {
      gain.gain.setValueAtTime(0.06 + Math.random() * 0.14, now + t);
      filter2.frequency.setValueAtTime(5000 + Math.random() * 3000, now + t);
    }
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(filter2);
    filter2.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start();
  }

  // Procedural tuning AM/FM frequency sweep static sound effect
  playRadioTuning() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.4;
    const bufferSize = this.ctx.sampleRate * duration;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    // Sweep the bandpass filter frequency up and down quickly like sintonización
    filter.frequency.exponentialRampToValueAtTime(3200, now + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.05, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.playMorseTick(0.06);
  }

  // Tape walkie-talkie microphone key press click (squelch / beep)
  playMicClick() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Quick burst of high-passed noise for the "squelch" of mic click
    const duration = 0.08;
    const bufferSize = this.ctx.sampleRate * duration;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3500, now);
    filter.Q.setValueAtTime(4.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    // High mechanical click
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1600, now);
    oscGain.gain.setValueAtTime(0.08, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start();
    osc.stop(now + 0.05);
  }

  // Synthesize radio voice chatter procedurally using vocal formants, pitch modulation, and walkie-talkie distortion
  playRadioVoiceNoise(duration = 2.0) {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Play a mic click at start
    this.playMicClick();

    // Delay voices slightly after the click
    const voiceStart = now + 0.05;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const modulator = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    
    const filter = this.ctx.createBiquadFilter();
    const voiceGain = this.ctx.createGain();
    
    // Male robot/chatter base pitches (around 130-220Hz)
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130 + Math.random() * 40, voiceStart);
    
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(260 + Math.random() * 80, voiceStart); // Harmonic
    
    // Cadence modulator for pitch oscillation
    modulator.frequency.setValueAtTime(7 + Math.random() * 3, voiceStart); 
    modGain.gain.setValueAtTime(25, voiceStart); 
    
    // Radio filter band (Centered at 850Hz, high Q to narrow the vocal formant)
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, voiceStart);
    filter.Q.setValueAtTime(5.0, voiceStart);
    
    voiceGain.gain.setValueAtTime(0, now);
    
    // Build random phonetic speech syllables
    let time = voiceStart;
    const syllableCount = Math.floor(duration * 5); // 5 syllables per second
    const step = (duration - 0.1) / syllableCount;
    
    for (let i = 0; i < syllableCount; i++) {
      const sylDuration = step * (0.35 + Math.random() * 0.45);
      
      // Syllable onset/envelope
      voiceGain.gain.setValueAtTime(0.01, time);
      voiceGain.gain.linearRampToValueAtTime(0.24, time + sylDuration * 0.2);
      
      // Formant frequency sweep mimicking vowel articulation
      filter.frequency.linearRampToValueAtTime(600 + Math.random() * 900, time + sylDuration * 0.5);
      
      // Random word pitch movements
      osc1.frequency.linearRampToValueAtTime(110 + Math.random() * 60, time + sylDuration);
      osc2.frequency.linearRampToValueAtTime(220 + Math.random() * 120, time + sylDuration);
      
      time += sylDuration;
      
      // Word gap fade
      voiceGain.gain.linearRampToValueAtTime(0.02, time);
      time += (step - sylDuration);
    }
    
    // Fade out completely at the end
    voiceGain.gain.linearRampToValueAtTime(0, now + duration);

    // Connections
    modulator.connect(modGain.gain);
    modGain.connect(osc1.frequency);
    modGain.connect(osc2.frequency);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(voiceGain);
    voiceGain.connect(this.masterGain);
    
    modulator.start(voiceStart);
    osc1.start(voiceStart);
    osc2.start(voiceStart);
    
    modulator.stop(now + duration);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    
    // Add continuous background static fuzz
    const bufferSize = this.ctx.sampleRate * duration;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1100, now);
    noiseFilter.Q.setValueAtTime(1.8, now);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    noise.start(now);
    
    // Ending squelch click
    setTimeout(() => {
      this.playMicClick();
    }, (duration - 0.05) * 1000);
  }
}

// Single instance for global application use
const soundManagerInstance = new SoundManager();
export default soundManagerInstance;
