"use client";

import { useEffect } from "react";

const UPDATE_INTERVAL_MS = 60_000;

export const ServiceWorkerUpdater = () => {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const registerAndUpdate = async () => {
      const registration = await navigator.serviceWorker.register("/sw.js");
      await registration.update();

      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    };

    const onControllerChange = () => {
      window.location.reload();
    };

    void registerAndUpdate();
    const intervalId = window.setInterval(registerAndUpdate, UPDATE_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void registerAndUpdate();
      }
    };

    window.addEventListener("focus", registerAndUpdate);
    document.addEventListener("visibilitychange", onVisibilityChange);
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", registerAndUpdate);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
    };
  }, []);

  return null;
};
