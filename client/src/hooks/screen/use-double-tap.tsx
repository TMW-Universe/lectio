import { useEffect, useRef } from "react";

type Options = {
  onDoubleTap: () => void;
};

export function useDoubleTap({ onDoubleTap }: Options) {
  const lastTapRef = useRef(0);

  useEffect(() => {
    const handleTouchStart = () => {
      const now = Date.now();
      const timeDiff = now - lastTapRef.current;

      if (timeDiff < 300 && timeDiff > 0) {
        onDoubleTap();
      }

      lastTapRef.current = now;
    };

    // Attach touch event listener
    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      // Clean up: remove touch event listener
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, [onDoubleTap]);
  return null;
}
