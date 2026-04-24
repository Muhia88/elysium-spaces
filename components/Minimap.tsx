'use client';

import { useRoomStore } from '@/store/useRoomStore';

export default function Minimap() {
  const cameraPosition = useRoomStore((state) => state.cameraPosition);
  
  // The room is 30x30, from -15 to 15. The minimap is 100% width/height of its container.
  // We want to map [-15, 15] to [0%, 100%].
  const mapCoordinate = (val: number) => {
    // clamp between -15 and 15
    const clamped = Math.max(-15, Math.min(15, val));
    // map it to 0-100%
    return ((clamped + 15) / 30) * 100;
  };

  const left = `${mapCoordinate(cameraPosition[0])}%`;
  const top = `${mapCoordinate(cameraPosition[1])}%`;

  return (
    <div className="absolute top-8 right-8 w-40 h-40 bg-[#0d0d0d] border border-white/10 p-2 shadow-2xl hidden lg:block z-10 pointer-events-none">
      <div className="w-full h-full bg-white/[0.02] relative">
        <div className="absolute w-20 h-2 bg-white/10 top-4 left-4"></div>
        <div className="absolute w-2 h-20 bg-white/10 top-4 left-4"></div>
        
        {/* Player Position Indicator */}
        <div 
          className="absolute w-3 h-3 bg-elysium-rosegold rounded-full shadow-[0_0_10px_#b76e79] transition-all duration-100"
          style={{ top, left, transform: 'translate(-50%, -50%)' }}
        ></div>
        
        <div className="absolute top-1 right-2 text-[8px] text-gray-500 uppercase tracking-tighter font-mono">
          Floor 24
        </div>
      </div>
      <div className="absolute -bottom-6 left-0 text-[9px] uppercase tracking-widest text-gray-500">
        Top-down Minimap
      </div>
    </div>
  );
}
