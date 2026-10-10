
import { useEffect } from "react";

const AD_SCRIPT =
  "https://ensueddenied.com/a436a060c14c4dc6d568e3a5423113fa/invoke.js";

const AD_CONTAINER_ID = "container-a436a060c14c4dc6d568e3a5423113fa";

export default function AdBanner() {
  useEffect(() => {
    const container = document.getElementById(AD_CONTAINER_ID);

    if (!container) return;

    // Prevent loading the same ad script more than once.
    const existingScript = document.querySelector(
      `script[src="${AD_SCRIPT}"]`
    );

    if (existingScript) {
      console.info("Noor Islamic: Adsterra banner script already exists.");
      return;
    }

    const script = document.createElement("script");

    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = AD_SCRIPT;

    script.onload = () => {
      console.info("Noor Islamic: Adsterra banner script loaded.");
    };

    script.onerror = () => {
      console.error(
        "Noor Islamic: Adsterra banner failed to load. Check the ad code and network."
      );
    };

    container.appendChild(script);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div
        id={AD_CONTAINER_ID}
        className="mx-auto min-h-[100px] w-full max-w-full"
      />
    </div>
  );
}