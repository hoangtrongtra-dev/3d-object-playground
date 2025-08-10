import { forwardRef, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Stats } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import Model from './Model.tsx';
import Lighting from './Lighting.tsx';
import Shape from './Shape.tsx';

interface Shape {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

interface SceneState {
  shapes: Shape[];
  selectedShapeId: string | null;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

interface Scene3DProps {
  modelUrl?: string;
  lightSettings: {
    ambientIntensity: number;
    directionalIntensity: number;
    pointLightIntensity: number;
    pointLightPosition: [number, number, number];
  };
  sceneState: SceneState;
  onShapeSelect: (shapeId: string | null) => void;
  onShapeUpdate: (shapeId: string, updates: Partial<Shape>) => void;
  onCameraUpdate: (position: [number, number, number], target: [number, number, number]) => void;
}

// Camera controller component
const CameraController = ({ 
  onCameraUpdate 
}: { 
  onCameraUpdate: (position: [number, number, number], target: [number, number, number]) => void 
}) => {
  const { camera, controls } = useThree();
  
  useFrame(() => {
    if (camera && controls) {
      const position: [number, number, number] = [
        camera.position.x,
        camera.position.y,
        camera.position.z
      ];
      
      const target: [number, number, number] = [
        (controls as any).target.x,
        (controls as any).target.y,
        (controls as any).target.z
      ];
      
      onCameraUpdate(position, target);
    }
  });
  
  return null;
};

// Scene content component
const SceneContent = forwardRef<THREE.Group, Scene3DProps>((props, ref) => {
  const { 
    modelUrl, 
    lightSettings, 
    sceneState, 
    onShapeSelect, 
    onShapeUpdate 
  } = props;
  
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (ref) {
      (ref as any).current = groupRef.current;
    }
  }, [ref]);
  
  const handleShapeClick = (shapeId: string) => {
    onShapeSelect(shapeId);
  };
  
  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <Lighting {...lightSettings} />
      
      {/* Environment */}
      <Environment preset="studio" />
      
      {/* Grid for reference */}
      <Grid 
        args={[20, 20]} 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor="#6f6f6f" 
        sectionSize={5} 
        sectionThickness={1} 
        sectionColor="#9d4b4b" 
        fadeDistance={25} 
        fadeStrength={1} 
        followCamera={false} 
        infiniteGrid={true} 
      />
      
      {/* Uploaded Model */}
      {modelUrl && <Model url={modelUrl} />}
      
      {/* Dynamic Shapes */}
      {sceneState.shapes.map((shape) => (
        <Shape
          key={shape.id}
          shape={shape}
          isSelected={sceneState.selectedShapeId === shape.id}
          onClick={() => handleShapeClick(shape.id)}
          onUpdate={(updates) => onShapeUpdate(shape.id, updates)}
        />
      ))}
      
      {/* Camera Controller */}
      <CameraController onCameraUpdate={props.onCameraUpdate} />
    </group>
  );
});

SceneContent.displayName = 'SceneContent';

const Scene3D = forwardRef<any, Scene3DProps>((props, ref) => {
  return (
    <Canvas
      camera={{
        position: [5, 5, 5],
        fov: 45,
        near: 0.1,
        far: 1000
      }}
      style={{ width: '100%', height: '100%' }}
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }}
    >
      <Suspense fallback={null}>
        <SceneContent ref={ref} {...props} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.8}
          maxDistance={50}
          minDistance={0.5}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
      </Suspense>
      
      {/* Performance Stats (development only) */}
      {process.env.NODE_ENV === 'development' && <Stats />}
    </Canvas>
  );
});

Scene3D.displayName = 'Scene3D';

export default Scene3D;
