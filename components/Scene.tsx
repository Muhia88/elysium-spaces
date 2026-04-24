'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Placeholder for the baked environment.
// The prompt states: "Assume the room environment (walls, floors) is loaded via useGLTF 
// and already has baked lighting... use MeshBasicMaterial for the baked shell."
function RoomShell() {
  // Real implementation would look like:
  // const { nodes, materials } = useGLTF('/models/room-baked.glb');
  // return <primitive object={nodes.Scene} ... />

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial color="#0d0d0d" />
      </mesh>
      
      {/* Structural visual grid for scale */}
      <gridHelper args={[30, 30, '#b76e79', '#222']} position={[0, -1.99, 0]} />

      {/* Decorative Stealth Luxury Walls (Left, Right, Back) */}
      <mesh position={[0, 3, -15]}>
        <boxGeometry args={[30, 10, 0.5]} />
        <meshBasicMaterial color="#121212" />
      </mesh>
      <mesh position={[-15, 3, 0]}>
        <boxGeometry args={[0.5, 10, 30]} />
        <meshBasicMaterial color="#121212" />
      </mesh>
      <mesh position={[15, 3, 0]}>
        <boxGeometry args={[0.5, 10, 30]} />
        <meshBasicMaterial color="#121212" />
      </mesh>
    </group>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          antialias: true,
        }}
        camera={{ position: [0, 2, 8], fov: 45 }}
      >
        <Suspense fallback={null}>
          {/* HDR Environment for realistic reflections on luxury models */}
          <Environment preset="apartment" />
          
          <RoomShell />
        </Suspense>

        {/* First-Person / Orbit simulation */}
        <OrbitControls 
          target={[0, 0, 0]}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from clipping exactly under the floor
          minDistance={2}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}
