/**
 * Audio Engine berbasis Web Audio API murni.
 * Dirancang untuk latensi ultra-rendah, multi-touch responsif tanpa delay,
 * dan dukungan polifoni tumpuk suara dengan fade-out peredaman halus.
 */

// Simpan instance global AudioContext
let audioContextInstance: AudioContext | null = null;

/**
 * Mengambil atau membuat instance AudioContext tunggal.
 * Mendukung browser modern maupun Safari versi lama (webkitAudioContext).
 */
export function getAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    // Lingkungan SSR / build
    return null as unknown as AudioContext;
  }

  if (!audioContextInstance) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContextInstance = new AudioContextClass();
  }

  // Jika browser menangguhkan AudioContext (kebijakan Autoplay browser), aktifkan kembali
  if (audioContextInstance.state === "suspended") {
    audioContextInstance.resume();
  }

  return audioContextInstance;
}

/**
 * Memastikan AudioContext aktif saat pengguna berinteraksi pertama kali
 * (sangat penting untuk perangkat mobile seperti iOS Safari / Android)
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
 * Memuat file audio dari URL dan mengubahnya menjadi AudioBuffer.
 * Jika file belum ada (404), fungsi ini TIDAK akan melempar error,
 * melainkan mengembalikan null secara aman.
 */
export async function fetchAudioBuffer(
  ctx: AudioContext,
  url: string
): Promise<AudioBuffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // File audio asli belum ditaruh di folder
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    // decodeAudioData mengubah data biner suara menjadi AudioBuffer siap main
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch {
    // Tangani jika koneksi gagal atau format belum didukung browser
    return null;
  }
}

/**
 * Memainkan AudioBuffer menggunakan AudioBufferSourceNode + GainNode.
 * Setiap kali dipanggil, sebuah node baru dibuat sehingga suara bisa dipukul
 * bertubi-tubi tanpa jeda dan saling bertumpuk secara alami.
 */
export function playAudioBuffer(
  ctx: AudioContext,
  buffer: AudioBuffer,
  decaySeconds: number = 2.5
): void {
  try {
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // GainNode untuk mengontrol volume dan fade out halus
    const gainNode = ctx.createGain();
    const now = ctx.currentTime;

    // Volume awal penuh, lalu meluruh (decay) perlahan mirip getaran bilah logam
    gainNode.gain.setValueAtTime(0.9, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + decaySeconds);

    // Sambungkan jalur audio: Source -> Gain -> Speaker
    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Mulai seketika
    source.start(now);

    // Hentikan sumber setelah suara habis memudar agar hemat memori
    source.stop(now + decaySeconds + 0.1);
  } catch (error) {
    console.warn("Gagal memainkan AudioBuffer:", error);
  }
}

/**
 * Generator Suara Gamelan Sintetis (Cadangan / Fallback).
 * Jika file .webm belum dimasukkan oleh pengguna ke folder public/audio,
 * fungsi ini mensintesis suara denting perunggu gamelan Jawa menggunakan
 * osilator harmonik dan selubung amplitudo (bell envelope).
 */
export function playSynthesizedGamelan(
  ctx: AudioContext,
  frequency: number = 320,
  decaySeconds: number = 2.2
): void {
  try {
    const now = ctx.currentTime;

    // Master Gain untuk suara sintetis
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.8, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + decaySeconds);
    masterGain.connect(ctx.destination);

    // Nada fundamental (dasar bilah perunggu)
    const oscFundamental = ctx.createOscillator();
    oscFundamental.type = "sine";
    oscFundamental.frequency.setValueAtTime(frequency, now);

    // Nada overtone atas (karakter denting metalik gamelan)
    const oscOvertone = ctx.createOscillator();
    oscOvertone.type = "triangle";
    // Rasio overtone khas gamelan perunggu ~ 2.76x
    oscOvertone.frequency.setValueAtTime(frequency * 2.76, now);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.4, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + (decaySeconds * 0.4));

    // Sambungkan osilator
    oscFundamental.connect(masterGain);
    oscOvertone.connect(overtoneGain);
    overtoneGain.connect(masterGain);

    oscFundamental.start(now);
    oscOvertone.start(now);

    oscFundamental.stop(now + decaySeconds + 0.1);
    oscOvertone.stop(now + decaySeconds + 0.1);
  } catch (error) {
    console.warn("Gagal memainkan synthesizer gamelan:", error);
  }
}
