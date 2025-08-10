import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface Shape {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

interface ShapeProps {
  shape: Shape;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (updates: Partial<Shape>) => void;
}

const ShapeComponent = ({ shape, isSelected, onClick, onUpdate }: ShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Handle shape type rendering
  const renderShape = () => {
    const { type, color } = shape;
    
    switch (type.toLowerCase()) {
      case 'cube':
        return (
          <boxGeometry args={[1, 1, 1]} />
        );
      case 'sphere':
        return (
          <sphereGeometry args={[0.5, 32, 32]} />
        );
      case 'cone':
        return (
          <coneGeometry args={[0.5, 1, 32]} />
        );
      case 'cylinder':
        return (
          <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        );
      case 'torus':
        return (
          <torusGeometry args={[0.5, 0.2, 16, 32]} />
        );
      case 'plane':
        return (
          <planeGeometry args={[2, 2]} />
        );
      default:
        return (
          <boxGeometry args={[1, 1, 1]} />
        );
    }
  };

  // Animation for selected shapes
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  // Handle click events
  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick();
  };

  // Handle pointer events for hover effects
  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: any) => {
    event.stopPropagation();
    document.body.style.cursor = 'default';
  };

  return (
    <group
      ref={groupRef}
      position={shape.position}
      rotation={shape.rotation}
      scale={shape.scale}
    >
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {renderShape()}
        <meshStandardMaterial 
          color={shape.color}
          metalness={0.1}
          roughness={0.5}
          transparent={isSelected}
          opacity={isSelected ? 0.8 : 1}
        />
      </mesh>

      {/* Selection indicator */}
      {isSelected && (
        <>
          {/* Wireframe outline */}
          <mesh>
            {renderShape()}
            <meshBasicMaterial 
              color="#6366f1" 
              wireframe 
              transparent 
              opacity={0.8}
            />
          </mesh>
          
          {/* Selection label */}
          <Html position={[0, 1.5, 0]} center>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {shape.type} - {shape.id.slice(-4)}
            </div>
          </Html>
        </>
      )}
    </group>
  );
};

export default ShapeComponent;
