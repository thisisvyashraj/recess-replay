// Tiny sound-effect engine using Web Audio. No dependencies, no asset loading.
let ctx: AudioContext | null = null;
let muted = (() => { try { return localStorage.getItem("sfx_muted") === "1"; } catch { return false; } })();

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

function tone(freq: number, dur = 0.12, type: OscillatorType = "sine", gain = 0.08, attack = 0.005) {
  if (muted) return;
  const a = ac(); if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type; o.frequency.value = freq;
  o.connect(g); g.connect(a.destination);
  const t = a.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t); o.stop(t + dur + 0.02);
}

export const sfx = {
  tap:    () => tone(880, 0.05, "triangle", 0.04),
  ok:     () => { tone(660, 0.08, "sine", 0.08); setTimeout(() => tone(990, 0.12, "sine", 0.08), 70); },
  err:    () => tone(180, 0.22, "sawtooth", 0.07),
  tick:   () => tone(1200, 0.03, "square", 0.03),
  whoosh: () => { tone(300, 0.18, "sine", 0.06); setTimeout(() => tone(180, 0.18, "sine", 0.05), 40); },
  win:    () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.18, "triangle", 0.1), i * 110)); },
  crown:  () => { [392, 523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => tone(f, 0.22, "triangle", 0.11), i * 130)); },
  countdown: () => tone(440, 0.08, "square", 0.05),
};

export function setMuted(m: boolean) { muted = m; try { localStorage.setItem("sfx_muted", m ? "1" : "0"); } catch {} }
export function isMuted() { return muted; }
