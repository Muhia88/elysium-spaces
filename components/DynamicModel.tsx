'use client';

import { useGLTF } from '@react-three/drei';
import { RoomObject } from '@/store/useRoomStore';

export default function DynamicModel({ id, modelUrl, position, rotation }: RoomObject) {
  // The core of the dynamic loading system.
  // useGLTF handles caching and deduplication of standard .glb/.gltf assets automatically.
  const { scene } = useGLTF(modelUrl);

  return (
    <primitive 
      object={scene.clone()} 
      position={position} 
      rotation={rotation} 
      // Attach the ID into userData to identify it later during raycasting
      userData={{ id }}
    />
  );
}

// Preloading open-source placeholder luxury assets for demonstration
// In production, these would be your real Elysium Spaces .glb urls
useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bench-2/model.gltf');
useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/chair-wood/model.gltf');
useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/table-wood/model.gltf');
