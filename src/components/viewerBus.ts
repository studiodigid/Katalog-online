/**
 * Hanya satu viewer 3D yang hidup pada satu waktu (satu WebGL context).
 * Halaman punya dua "slot" viewer (hero dan demo). Slot yang paling terlihat
 * di layar menjadi pemilik viewer; slot lain menampilkan kerangka kosong.
 */
export type Slot = 'hero' | 'demo';

const ratios: Record<Slot, number> = { hero: 0, demo: 0 };
let owner: Slot = 'hero';
let pinned: Slot | null = null;
const listeners = new Set<() => void>();

function recompute() {
  let next = owner;
  if (pinned) {
    next = pinned;
  } else if (ratios.hero > 0 || ratios.demo > 0) {
    next = ratios.demo > ratios.hero ? 'demo' : 'hero'; // seri -> hero
  }
  if (next !== owner) {
    owner = next;
    listeners.forEach((l) => l());
  }
}

export function reportVisibility(slot: Slot, ratio: number) {
  ratios[slot] = ratio;
  recompute();
}

/** Dipakai saat layar penuh agar viewer tidak berpindah pemilik. */
export function pinSlot(slot: Slot | null) {
  pinned = slot;
  recompute();
}

export const subscribeOwner = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getOwner = () => owner;
