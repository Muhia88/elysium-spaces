'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Scene from '@/components/Scene';
import Minimap from '@/components/Minimap';
import { useRoomStore } from '@/store/useRoomStore';
import { saveConfigurationToSupabase, hydrateConfigurationFromSupabase } from '@/lib/supabaseMock';

export default function Page() {
  const objects = useRoomStore((state) => state.objects);
  const loadState = useRoomStore((state) => state.loadState);
  
  const addObject = useRoomStore((state) => state.addObject);
  const updateObject = useRoomStore((state) => state.updateObject);
  const selectedObjectId = useRoomStore((state) => state.selectedObjectId);

  const transformMode = useRoomStore((state) => state.transformMode);
  const setTransformMode = useRoomStore((state) => state.setTransformMode);
  const removeObject = useRoomStore((state) => state.removeObject);

  const [isSaving, setIsSaving] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const init = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const configId = urlParams.get('config');
      
      if (configId) {
        const loadedObjects = await hydrateConfigurationFromSupabase(configId);
        if (loadedObjects) {
          loadState(loadedObjects);
        }
      }
      setIsHydrating(false);
    };
    init();
  }, [loadState]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const configId = await saveConfigurationToSupabase(objects);
      const newUrl = `${window.location.origin}${window.location.pathname}?config=${configId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
      alert(`Configuration saved successfully! Link generated:\n\n${newUrl}`);
    } catch (e) {
      alert("Failed to save configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwapOrAddFurniture = (modelUrl: string) => {
    if (selectedObjectId) {
      updateObject(selectedObjectId, { modelUrl });
    } else {
      addObject({
        id: Math.random().toString(36).substring(7),
        modelUrl,
        position: [0, -2, 0], // Spawn at floor level
        rotation: [0, 0, 0],
      });
    }
  };

  return (
    <div className="w-full h-screen bg-elysium-black text-white font-sans overflow-hidden flex flex-col relative">
      {/* Header Navigation */}
      <header className="w-full py-6 px-6 md:px-10 flex justify-between items-center border-b border-white/5 z-20 bg-elysium-black">
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-elysium-rosegold"></div>
          <span className="text-xl md:text-2xl font-light tracking-[0.4em] uppercase">
            Elysium <span className="font-bold">Spaces</span>
          </span>
        </div>
        <nav className="hidden lg:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium opacity-60">
          <Link href="#" className="hover:text-elysium-rosegold transition-colors">The Collection</Link>
          <Link href="#" className="text-elysium-rosegold opacity-100 transition-colors">Design Studio</Link>
          <Link href="#" className="hover:text-elysium-rosegold transition-colors">Virtual Tour</Link>
          <Link href="mailto:contact@elysiumspaces.com" className="hover:text-elysium-rosegold transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave} 
            disabled={isSaving || isHydrating}
            className="hidden sm:block px-6 py-2 border border-elysium-rosegold text-elysium-rosegold text-[10px] uppercase tracking-widest hover:bg-elysium-rosegold hover:text-elysium-black transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
          <button className="px-6 py-2 bg-elysium-rosegold text-elysium-black text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors">
            Inquire
          </button>
        </div>
      </header>

      <main className="flex-1 flex relative overflow-hidden">
        {/* Sidebar: Furniture Customization */}
        <aside className="w-80 h-full border-r border-white/5 bg-[#0d0d0d] p-8 flex-col gap-8 z-10 flex overflow-y-auto hidden md:flex">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.25em] text-elysium-rosegold mb-4">Penthouse VII • Customizer</h2>
            <p className="text-xs text-gray-500 leading-relaxed">Configure your living space with our exclusive furniture partner collection.</p>
          </div>

          <div className="space-y-6 flex-1">
            <section>
              <h3 className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Select Category</h3>
              <div className="grid grid-cols-3 gap-2">
                <button className="h-10 bg-white/5 border border-elysium-rosegold flex items-center justify-center transition-colors">
                  <div className="w-3 h-3 border border-elysium-rosegold"></div>
                </button>
                <button className="h-10 bg-white/5 border border-white/10 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
                  <div className="w-3 h-3 rounded-full border border-white"></div>
                </button>
                <button className="h-10 bg-white/5 border border-white/10 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
                  <div className="w-3 h-3 rotate-45 border border-white"></div>
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Seating Solutions</h3>
              <div className="space-y-3">
                <div 
                  className="p-4 border border-elysium-rosegold bg-white/[0.02] flex justify-between items-center cursor-pointer hover:bg-white/[0.05] transition-colors"
                  onClick={() => handleSwapOrAddFurniture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Flamingo.glb')}
                >
                  <div>
                    <p className="text-[11px] font-bold">The Nero Sectional</p>
                    <p className="text-[9px] text-gray-500 uppercase mt-0.5">Leather / Obsidian</p>
                  </div>
                  <p className="text-[10px] text-elysium-rosegold font-mono">$12,400</p>
                </div>
                <div 
                  className="p-4 border border-white/5 bg-white/[0.01] flex justify-between items-center opacity-50 hover:opacity-100 cursor-pointer transition-opacity"
                  onClick={() => handleSwapOrAddFurniture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Parrot.glb')}
                >
                  <div>
                    <p className="text-[11px] font-bold">Elysium Lounge</p>
                    <p className="text-[9px] text-gray-500 uppercase mt-0.5">Velvet / Sage</p>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono">$8,900</p>
                </div>
                <div 
                  className="p-4 border border-white/5 bg-white/[0.01] flex justify-between items-center opacity-50 hover:opacity-100 cursor-pointer transition-opacity"
                  onClick={() => handleSwapOrAddFurniture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Stork.glb')}
                >
                  <div>
                    <p className="text-[11px] font-bold">Modular Sky Unit</p>
                    <p className="text-[9px] text-gray-500 uppercase mt-0.5">Fabric / Pearl</p>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono">$15,200</p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-auto border-t border-white/5 pt-6">
            <p className="italic text-[13px] text-gray-400 leading-relaxed">"The future of living is personal. Welcome to your vision."</p>
            <p className="text-[10px] uppercase tracking-widest text-elysium-rosegold mt-2">Daniel Muhia, MD</p>
          </div>
        </aside>

        {/* Main 3D Viewport Area */}
        <div className="flex-1 relative flex items-center justify-center">
          
          <Scene />

          <Minimap />

          {/* Viewport Controls */}
          <div className="absolute bottom-8 right-8 flex gap-4 hidden sm:flex z-10">
            {selectedObjectId && (
              <div className="flex flex-col items-end gap-1 mr-4 border-r border-white/10 pr-4">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Modify</span>
                <button 
                  onClick={() => removeObject(selectedObjectId)}
                  className="w-12 h-12 bg-white/5 border border-red-900/50 flex items-center justify-center text-[10px] font-bold text-red-500 hover:bg-red-900/20 transition-colors"
                >
                  DEL
                </button>
              </div>
            )}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Gizmo Mode</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTransformMode('translate')}
                  className={`w-12 h-12 bg-white/5 border flex items-center justify-center text-[10px] font-bold transition-all ${transformMode === 'translate' ? 'border-elysium-rosegold text-elysium-rosegold' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                >
                  MOVE
                </button>
                <button 
                  onClick={() => setTransformMode('rotate')}
                  className={`w-12 h-12 bg-white/5 border flex items-center justify-center text-[10px] font-bold transition-all ${transformMode === 'rotate' ? 'border-elysium-rosegold text-elysium-rosegold' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                >
                  TURN
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full h-12 px-6 md:px-10 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-600 uppercase tracking-widest bg-elysium-black z-20">
        <div>&copy; {new Date().getFullYear()} Elysium Spaces. All rights reserved.</div>
        <div className="hidden sm:flex gap-6">
          <span>contact@elysiumspaces.com</span>
          <span>New York | London | Dubai</span>
        </div>
      </footer>
    </div>
  );
}
