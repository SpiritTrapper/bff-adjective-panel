import type { Metric } from "web-vitals";

export function reportWebVitals(onReport: (metric: Metric) => void): void {
  import("web-vitals").then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS(onReport);
    onFCP(onReport);
    onLCP(onReport);
    onTTFB(onReport);
    onINP(onReport);
  });
}
