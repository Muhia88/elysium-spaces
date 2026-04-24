'use client';

import { useRef, useMemo } from 'react';
import { useGLTF, TransformControls } from '@react-three/drei';
import { RoomObject, useRoomStore } from '@/store/useRoomStore';
import * as THREE from 'three';

export default function DynamicModel({ id, modelUrl, position, rotation }: RoomObject) {
  // The core of the dynamic loading system.
  // useGLTF handles caching and deduplication of standard .glb/.gltf assets automatically.
  const { scene } = useGLTF(modelUrl);
  
  // Clone scene so we can share the same geometry/materials if we add multiple of the same object
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const groupRef = useRef<THREE.Group>(null as any);

  const selectedObjectId = useRoomStore((state) => state.selectedObjectId);
  const setSelectedObject = useRoomStore((state) => state.setSelectedObject);
  const updateObject = useRoomStore((state) => state.updateObject);
  const transformMode = useRoomStore((state) => state.transformMode);

  const isSelected = selectedObjectId === id;

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setSelectedObject(id);
  };

  const handleDragEnd = () => {
    if (groupRef.current) {
      const pos = groupRef.current.position;
      const rot = groupRef.current.rotation;
      
      // Basic AABB check: Restrict dragging outside floor plane [-15, 15]
      // Assume max furniture size is around 1 unit for bounds check buffer.
      const boundary = 14; 
      const x = Math.max(-boundary, Math.min(boundary, pos.x));
      const z = Math.max(-boundary, Math.min(boundary, pos.z));
      
      // Force constraints back onto the actual object in case it overshot
      groupRef.current.position.set(x, pos.y, z);

      updateObject(id, { 
        position: [x, pos.y, z],
        // Save the rotation. We only allow Y rotation, so x and z should be 0.
        rotation: [0, rot.y, 0] 
      });
    }
  };

  return (
    <>
      <group 
        ref={groupRef}
        position={position}
        rotation={rotation}
        onPointerDown={handlePointerDown}
      >
        <primitive 
          object={clonedScene} 
          // Attach the ID into userData for other potential uses
          userData={{ id }}
        />
      </group>
      {isSelected && (
        <TransformControls
          object={groupRef}
          mode={transformMode}
          // Restrict translation to X and Z
          showY={transformMode === 'translate' ? false : undefined}
          // Restrict rotation to Y axis
          showX={transformMode === 'rotate' ? false : undefined}
          showZ={transformMode === 'rotate' ? false : undefined}
          onMouseUp={handleDragEnd}
        />
      )}
    </>
  );
}

// Preloading open-source placeholder assets for demonstration
// In production, these would be your real Elysium Spaces .glb urls
useGLTF.preload('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Flamingo.glb');
useGLTF.preload('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Parrot.glb');
useGLTF.preload('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Stork.glb');
