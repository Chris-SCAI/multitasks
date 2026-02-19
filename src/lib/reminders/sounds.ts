export type NotificationSound = "none" | "bell" | "pulse" | "chirp" | "chord" | "bowl";

export const SOUND_LABELS: Record<NotificationSound, string> = {
  none: "Aucun son",
  bell: "Cloche",
  pulse: "Pulsation",
  chirp: "Bip joyeux",
  chord: "Accord",
  bowl: "Bol tibétain",
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playBell() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

function playPulse() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  for (const freq of [440, 660]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.15);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

function playChirp() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.35);
}

function playChord() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  for (const freq of [523, 659, 784]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  }
}

function playBowl() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Partiels inharmoniques d'un bol tibétain réaliste
  // Chaque partiel a 2 oscillateurs légèrement désaccordés pour créer le battement
  const partials = [
    { freq: 245, detune: 0.8, gain: 0.10, decay: 5.0 },   // Fondamentale chaude
    { freq: 518, detune: 1.2, gain: 0.07, decay: 4.0 },   // Partiel ~2x (inharmonique)
    { freq: 812, detune: 1.5, gain: 0.04, decay: 3.0 },   // Partiel ~3.3x
    { freq: 1135, detune: 1.8, gain: 0.02, decay: 2.2 },  // Partiel haut
  ];

  // Master gain pour contrôler le volume global
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(1, now);
  masterGain.connect(ctx.destination);

  // Transitoire d'attaque — bruit bref simulant le frappé du maillet
  const strikeLen = 0.06;
  const bufferSize = ctx.sampleRate * strikeLen;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
  }
  const strikeSource = ctx.createBufferSource();
  strikeSource.buffer = noiseBuffer;
  const strikeFilter = ctx.createBiquadFilter();
  strikeFilter.type = "bandpass";
  strikeFilter.frequency.setValueAtTime(800, now);
  strikeFilter.Q.setValueAtTime(1.5, now);
  const strikeGain = ctx.createGain();
  strikeGain.gain.setValueAtTime(0.25, now);
  strikeGain.gain.exponentialRampToValueAtTime(0.001, now + strikeLen);
  strikeSource.connect(strikeFilter);
  strikeFilter.connect(strikeGain);
  strikeGain.connect(masterGain);
  strikeSource.start(now);
  strikeSource.stop(now + strikeLen);

  // Partiels résonnants — paires désaccordées pour le battement caractéristique
  for (const p of partials) {
    for (const sign of [-1, 1]) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      const f = p.freq + sign * p.detune;
      osc.frequency.setValueAtTime(f, now);
      // Vibrato subtil — ondulation lente typique du métal
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.setValueAtTime(3.5 + sign * 0.5, now);
      vibratoGain.gain.setValueAtTime(f * 0.002, now);
      vibratoGain.gain.linearRampToValueAtTime(0, now + p.decay);
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibrato.start(now);
      vibrato.stop(now + p.decay);

      // Enveloppe : attaque douce + decay exponentiel long
      const vol = p.gain * 0.5;
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(vol, now + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + p.decay);

      osc.connect(gainNode);
      gainNode.connect(masterGain);
      osc.start(now);
      osc.stop(now + p.decay);
    }
  }
}

export function playTimerEndSound(): void {
  if (typeof window === "undefined") return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Double bip : 2x chirp espaces de 200ms
    for (const offset of [0, 0.25]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now + offset);
      osc.frequency.exponentialRampToValueAtTime(1200, now + offset + 0.15);
      gain.gain.setValueAtTime(0.3, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.2);
    }
  } catch {
    // AudioContext non supporte ou bloque
  }
}

export function playNotificationSound(sound: NotificationSound): void {
  if (sound === "none" || typeof window === "undefined") return;

  try {
    switch (sound) {
      case "bell":
        playBell();
        break;
      case "pulse":
        playPulse();
        break;
      case "chirp":
        playChirp();
        break;
      case "chord":
        playChord();
        break;
      case "bowl":
        playBowl();
        break;
    }
  } catch {
    // AudioContext non supporté ou bloqué
  }
}
