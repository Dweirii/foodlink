"use client";

import { useEffect } from "react";

export default function PWAClient() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // next-pwa will generate /sw.js on build
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // swallow registration errors silently
      });
    }
  }, []);

  return null;
}
