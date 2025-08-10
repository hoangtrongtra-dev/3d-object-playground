import { useEffect, useMemo, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';

interface ModelProps {
  url?: string;
}

const DefaultCube = () => (
  <mesh castShadow receiveShadow>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="gray" />
  </mesh>
);

const LoadedModel = ({ url }: { url: string }) => {
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setError(null);
        
        // Determine file type from URL
        const fileExtension = url.split('.').pop()?.toLowerCase();
        
        let loadedModel: THREE.Group;
        
        switch (fileExtension) {
          case 'glb':
          case 'gltf':
            // Setup DRACO loader for compressed models
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/draco/');
            
            const gltfLoader = new GLTFLoader();
            gltfLoader.setDRACOLoader(dracoLoader);
            
            const gltf = await new Promise<THREE.GLTF>((resolve, reject) => {
              gltfLoader.load(url, resolve, undefined, reject);
            });
            
            loadedModel = gltf.scene;
            break;
            
          case 'obj':
            const objLoader = new OBJLoader();
            loadedModel = await new Promise<THREE.Group>((resolve, reject) => {
              objLoader.load(url, resolve, undefined, reject);
            });
            
            // Apply default material to OBJ models
            loadedModel.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0xcccccc,
                  metalness: 0.1,
                  roughness: 0.8,
                });
              }
            });
            break;
            
          default:
            throw new Error(`Unsupported file format: ${fileExtension}`);
        }
        
        // Apply default settings to all models
        loadedModel.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Center the model
        loadedModel.position.sub(center);
        
        // Scale to fit in a reasonable size
        const maxDimension = Math.max(size.x, size.y, size.z);
        if (maxDimension > 5) {
          const scale = 5 / maxDimension;
          loadedModel.scale.setScalar(scale);
        }
        
        setModel(loadedModel);
        
      } catch (err) {
        console.error('Error loading model:', err);
        setError(err instanceof Error ? err.message : 'Failed to load model');
      }
    };
    
    if (url) {
      loadModel();
    }
  }, [url]);

  if (error) {
    console.error('Model loading error:', error);
    return <DefaultCube />;
  }

  if (!model) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.5} />
      </mesh>
    );
  }

  return <primitive object={model} />;
};

const Model = ({ url }: ModelProps) => {
  const Component = useMemo(() => {
    return url ? () => <LoadedModel url={url} /> : DefaultCube;
  }, [url]);

  return <Component />;
};

export default Model;
