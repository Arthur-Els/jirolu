/**
 * Audio Engine berbasis Web Audio API murni untuk Museum Gamelan "Jirolu".
 * Mendukung instrumen bernada (Saron, Bonang) dan instrumen bersuara (Gong, Kendang).
 * Fitur:
 * - Latensi 0 ms dengan AudioBuffer
 * - Fade out halus peredaman
 * - Pengatur volume master & tombol bisu (mute)
 * - Penghentian suara saat laras berganti atau gong berulang dipukul
 * - Synthesizer cadangan perunggu dan membran jika file .webm belum tersedia
 */

// Instance tunggal AudioContext dan Master Gain Node
let audioContextInstance: AudioContext | null = null;
let masterGainNode: GainNode | null = null;
let currentVolume: number = 0.85;
let isAudioMuted: boolean = false;

// Menyimpan daftar node suara yang aktif untuk fade-out teratur
interface ActiveSound {
  id?: string;
  source: AudioBufferSourceNode | OscillatorNode;
  gainNode: GainNode;
  stopTime: number;
}
const activeSounds: Set<ActiveSound> = new Set();
const singleVoiceTrackers: Map<string, ActiveSound> = new Map();

/**
 * Mengambil atau membuat instance AudioContext tunggal.
 */
export function getAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    return null as unknown as AudioContext;
  }

  if (!audioContextInstance) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContextInstance = new AudioContextClass();

    masterGainNode = audioContextInstance.createGain();
    masterGainNode.gain.setValueAtTime(isAudioMuted ? 0 : currentVolume, audioContextInstance.currentTime);
    masterGainNode.connect(audioContextInstance.destination);
  }

  if (audioContextInstance.state === "suspended") {
    audioContextInstance.resume();
  }

  return audioContextInstance;
}

/**
 * Mengatur volume suara utama (0.0 sampai 1.0)
 */
export function setMasterVolume(volume: number): void {
  currentVolume = Math.max(0, Math.min(1, volume));
  if (masterGainNode && audioContextInstance && !isAudioMuted) {
    masterGainNode.gain.setValueAtTime(currentVolume, audioContextInstance.currentTime);
  }
}

/**
 * Mengambil nilai volume master saat ini
 */
export function getMasterVolume(): number {
  return currentVolume;
}

/**
 * Mengaktifkan atau menonaktifkan mode bisu (mute)
 */
export function toggleMute(): boolean {
  isAudioMuted = !isAudioMuted;
  if (masterGainNode && audioContextInstance) {
    const target = isAudioMuted ? 0 : currentVolume;
    masterGainNode.gain.setValueAtTime(target, audioContextInstance.currentTime);
  }
  return isAudioMuted;
}

export function getMuteState(): boolean {
  return isAudioMuted;
}

/**
 * Memastikan AudioContext aktif saat pengguna pertama kali berinteraksi
 */
export async function unlockAudioContext(): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx.state === "running";
}

/**
 * Menghentikan semua suara yang sedang aktif dengan fade out halus
 * (digunakan saat pengunjung mengganti laras Slendro/Pelog)
 */
export function stopAllActiveSounds(fadeDuration: number = 0.15): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  activeSounds.forEach((sound) => {
    try {
      sound.gainNode.gain.cancelScheduledValues(now);
      sound.gainNode.gain.setValueAtTime(sound.gainNode.gain.value, now);
      sound.gainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
      setTimeout(() => {
        try {
          sound.source.stop();
        } catch {}
      }, fadeDuration * 1000 + 30);
    } catch {}
  });

  activeSounds.clear();
  singleVoiceTrackers.clear();
}

/**
 * Menghentikan satu suara spesifik berdasarkan id suara (misal gong yang sama dipukul lagi)
 */
export function stopSpecificSound(id: string, fadeDuration: number = 0.1): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const existing = singleVoiceTrackers.get(id);
  if (existing) {
    const now = ctx.currentTime;
    try {
      existing.gainNode.gain.cancelScheduledValues(now);
      existing.gainNode.gain.setValueAtTime(existing.gainNode.gain.value, now);
      existing.gainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
      setTimeout(() => {
        try {
          existing.source.stop();
        } catch {}
      }, fadeDuration * 1000 + 20);
    } catch {}
    singleVoiceTrackers.delete(id);
    activeSounds.delete(existing);
  }
}

/**
 * Memuat file audio dari URL ke AudioBuffer secara aman tanpa crash jika 404
 */
export async function fetchAudioBuffer(
  ctx: AudioContext,
  url: string
): Promise<AudioBuffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    return await ctx.decodeAudioData(arrayBuffer);
  } catch {
    return null;
  }
}

/**
 * Memainkan AudioBuffer dengan fade out lembut
 */
export function playAudioBuffer(
  ctx: AudioContext,
  buffer: AudioBuffer,
  decaySeconds: number = 2.5,
  soundId?: string
): void {
  try {
    if (soundId) {
      stopSpecificSound(soundId, 0.08);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    const now = ctx.currentTime;

    gainNode.gain.setValueAtTime(0.95, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + decaySeconds);

    // Hubungkan ke masterGainNode agar volume slider dan mute berfungsi
    source.connect(gainNode);
    if (masterGainNode) {
      gainNode.connect(masterGainNode);
    } else {
      gainNode.connect(ctx.destination);
    }

    source.start(now);
    source.stop(now + decaySeconds + 0.1);

    const activeItem: ActiveSound = {
      id: soundId,
      source,
      gainNode,
      stopTime: now + decaySeconds,
    };
    activeSounds.add(activeItem);
    if (soundId) {
      singleVoiceTrackers.set(soundId, activeItem);
    }

    setTimeout(() => {
      activeSounds.delete(activeItem);
      if (soundId && singleVoiceTrackers.get(soundId) === activeItem) {
        singleVoiceTrackers.delete(soundId);
      }
    }, (decaySeconds + 0.2) * 1000);
  } catch (error) {
    console.warn("Gagal memutar audio buffer:", error);
  }
}

/**
 * Generator Suara Gamelan Sintetis (Cadangan untuk Saron & Bonang)
 */
export function playSynthesizedGamelan(
  ctx: AudioContext,
  frequency: number = 320,
  decaySeconds: number = 2.2,
  soundId?: string
): void {
  try {
    if (soundId) {
      stopSpecificSound(soundId, 0.08);
    }

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.85, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + decaySeconds);

    if (masterGainNode) {
      gainNode.connect(masterGainNode);
    } else {
      gainNode.connect(ctx.destination);
    }

    // Nada fundamental
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(frequency, now);

    // Nada harmonik metalik gamelan
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(frequency * 2.76, now);

    const harmGain = ctx.createGain();
    harmGain.gain.setValueAtTime(0.35, now);
    harmGain.gain.exponentialRampToValueAtTime(0.001, now + decaySeconds * 0.45);

    osc1.connect(gainNode);
    osc2.connect(harmGain);
    harmGain.connect(gainNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + decaySeconds + 0.1);
    osc2.stop(now + decaySeconds + 0.1);

    const activeItem: ActiveSound = { id: soundId, source: osc1, gainNode, stopTime: now + decaySeconds };
    activeSounds.add(activeItem);
    if (soundId) singleVoiceTrackers.set(soundId, activeItem);

    setTimeout(() => {
      activeSounds.delete(activeItem);
    }, (decaySeconds + 0.2) * 1000);
  } catch (error) {
    console.warn("Gagal memainkan synthesizer gamelan:", error);
  }
}

/**
 * Generator Suara Gong Sintetis (Sub-Bass dalam & getaran panjang)
 */
export function playSynthesizedGong(
  ctx: AudioContext,
  frequency: number = 55,
  decaySeconds: number = 4.5,
  soundId?: string
): void {
  try {
    if (soundId) {
      stopSpecificSound(soundId, 0.1);
    }

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.95, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + decaySeconds);

    if (masterGainNode) {
      gainNode.connect(masterGainNode);
    } else {
      gainNode.connect(ctx.destination);
    }

    // Nada dasar dentum sub-bass
    const subOsc = ctx.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(frequency, now);

    // Beating frequency (ombak khas dengung gong ageng)
    const beatOsc = ctx.createOscillator();
    beatOsc.type = "sine";
    beatOsc.frequency.setValueAtTime(frequency + 1.8, now);

    subOsc.connect(gainNode);
    beatOsc.connect(gainNode);

    subOsc.start(now);
    beatOsc.start(now);
    subOsc.stop(now + decaySeconds + 0.1);
    beatOsc.stop(now + decaySeconds + 0.1);

    const activeItem: ActiveSound = { id: soundId, source: subOsc, gainNode, stopTime: now + decaySeconds };
    activeSounds.add(activeItem);
    if (soundId) singleVoiceTrackers.set(soundId, activeItem);

    setTimeout(() => {
      activeSounds.delete(activeItem);
    }, (decaySeconds + 0.2) * 1000);
  } catch (error) {
    console.warn("Gagal memainkan synthesizer gong:", error);
  }
}

/**
 * Generator Suara Kendang Sintetis (Membran dinamis pitch-drop envelope)
 */
export function playSynthesizedKendang(
  ctx: AudioContext,
  jenis: "dung" | "tak" | "tung" | "dah",
  decaySeconds: number = 0.7,
  soundId?: string
): void {
  try {
    const now = ctx.currentTime;
    const gainNode = ctx.createGain();

    if (masterGainNode) {
      gainNode.connect(masterGainNode);
    } else {
      gainNode.connect(ctx.destination);
    }

    const osc = ctx.createOscillator();

    if (jenis === "dah") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.18);
      gainNode.gain.setValueAtTime(0.9, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc.start(now);
      osc.stop(now + 1.0);
    } else if (jenis === "dung") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
      gainNode.gain.setValueAtTime(0.85, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (jenis === "tak") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
      gainNode.gain.setValueAtTime(0.7, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);
      gainNode.gain.setValueAtTime(0.75, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.5);
    }

    const activeItem: ActiveSound = { id: soundId, source: osc, gainNode, stopTime: now + decaySeconds };
    activeSounds.add(activeItem);

    setTimeout(() => {
      activeSounds.delete(activeItem);
    }, (decaySeconds + 0.2) * 1000);
  } catch (error) {
    console.warn("Gagal memainkan synthesizer kendang:", error);
  }
}

/**
 * Memainkan suara cuplikan singkat (preview) untuk tiap instrumen di galeri pendopo
 */
export function playInstrumentPreview(slug: string): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  if (slug === "saron") {
    playSynthesizedGamelan(ctx, 320, 2.0, "preview-saron");
  } else if (slug === "bonang") {
    playSynthesizedGamelan(ctx, 640, 1.8, "preview-bonang");
  } else if (slug === "gong") {
    playSynthesizedGong(ctx, 55, 3.8, "preview-gong");
  } else if (slug === "kendang") {
    playSynthesizedKendang(ctx, "dah", 0.9, "preview-kendang");
  }
}
