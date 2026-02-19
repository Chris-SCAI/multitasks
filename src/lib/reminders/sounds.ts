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

  // Fondamentale + harmoniques d'un bol tibétain (résonance riche, decay très long)
  const harmonics = [
    { freq: 220, gain: 0.12, decay: 2.5 },
    { freq: 440, gain: 0.08, decay: 2.0 },
    { freq: 660, gain: 0.04, decay: 1.5 },
    { freq: 885, gain: 0.02, decay: 1.2 },
  ];

  for (const h of harmonics) {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(h.freq, now);
    // Légère modulation de fréquence pour le côté "vivant" du bol
    osc.frequency.linearRampToValueAtTime(h.freq * 0.998, now + h.decay);
    gainNode.gain.setValueAtTime(h.gain, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + h.decay);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + h.decay);
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
