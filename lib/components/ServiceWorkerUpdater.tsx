"use client";

import { useEffect, useRef } from "react";

const UPDATE_INTERVAL_MS = 60_000;

export const ServiceWorkerUpdater = () => {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").then((reg) => {
      if (reg.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && reg.waiting) {
            reg.waiting!.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });

      const checkForUpdate = async () => {
        await reg.update();
        if (reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      };

      const onControllerChange = () => window.location.reload();
      const onVisibilityChange = () => {
        if (document.visibilityState === "visible") void checkForUpdate();
      };

      const intervalId = window.setInterval(checkForUpdate, UPDATE_INTERVAL_MS);
      window.addEventListener("focus", checkForUpdate);
      document.addEventListener("visibilitychange", onVisibilityChange);
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        onControllerChange,
      );

      cleanupRef.current = () => {
        window.clearInterval(intervalId);
        window.removeEventListener("focus", checkForUpdate);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          onControllerChange,
        );
      };
    });

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return null;
};
