import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

function Part({ node, isSelected, onSelect }) {
  return (
    <mesh
      position={node.position}
      castShadow
      receiveShadow
      onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
    >
      <boxGeometry args={node.size} />
      <meshStandardMaterial
        color={node.color || '#6485b3'}
        roughness={0.3}
        metalness={0.0}
        emissive={isSelected ? '#1a5276' : '#000000'}
        emissiveIntensity={isSelected ? 0.4 : 0}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...node.size)]} />
          <lineBasicMaterial color="#00d4ff" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}

function SceneParts({ node, selectedId, onSelect }) {
  const parts = [];
  const collect = (n) => {
    if (n.className === 'Part') {
      parts.push(n);
    }
    if (n.children) {
      n.children.forEach(collect);
    }
  };
  collect(node);

  return (
    <>
      {parts.map(part => (
        <Part
          key={part.id}
          node={part}
          isSelected={part.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export default function Viewport({ tree, selectedId, onSelect }) {
  return (
    <div className="viewport">
      <Canvas
        shadows
        camera={{ position: [30, 30, 30], fov: 60, near: 0.1, far: 10000 }}
        onClick={() => onSelect(null)}
      >
        <color attach="background" args={['#87CEEB']} />

        {/* Roblox-style lighting */}
        <ambientLight intensity={0.15} />
        <hemisphereLight
          skyColor="#a6c8ff"
          groundColor="#595e54"
          intensity={0.5}
        />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-camera-far={200}
        />

        <OrbitControls makeDefault />

        {/* Grid overlay at baseplate surface (y=0) */}
        <Grid
          position={[0, 0.01, 0]}
          args={[512, 512]}
          cellSize={4}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={20}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={200}
          infiniteGrid={false}
        />

        {/* Render all parts from the scene tree */}
        <SceneParts node={tree} selectedId={selectedId} onSelect={onSelect} />
      </Canvas>
    </div>
  );
}
