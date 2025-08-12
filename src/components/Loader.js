import React from 'react';
import logoGif from '../assets/logo.gif';

/**
 * Fullscreen overlay loader that shows the animated logo.
 * Props:
 * - show: boolean — whether to render the overlay
 */
export default function Loader({ show = false }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <img
        src={logoGif}
        alt="Loading"
        className="w-28 h-28 md:w-36 md:h-36 object-contain animate-pulse drop-shadow-lg"
        loading="eager"
      />
    </div>
  );
}
