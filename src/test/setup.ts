// Browser globals shim for Leaflet in Vitest node environment
if (typeof window === 'undefined') {
  (globalThis as any).window = {
    requestAnimationFrame: (cb: any) => setTimeout(cb, 16),
    cancelAnimationFrame: (id: any) => clearTimeout(id),
    devicePixelRatio: 1,
  };
  (globalThis as any).document = {
    documentElement: { style: {} },
    createElement: () => ({ style: {} }),
  };
}
