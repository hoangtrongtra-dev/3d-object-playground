interface LightingProps {
  ambientIntensity: number;
  directionalIntensity: number;
  pointLightIntensity: number;
  pointLightPosition: [number, number, number];
}

const Lighting = ({ 
  ambientIntensity, 
  directionalIntensity, 
  pointLightIntensity,
  pointLightPosition 
}: LightingProps) => {
  return (
    <>
      {/* Ambient light for general scene illumination */}
      <ambientLight 
        intensity={ambientIntensity} 
        color="#ffffff"
      />
      
      {/* Directional light for shadows and highlighting */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={directionalIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#ffffff"
      />
      
      {/* Point light for additional illumination */}
      <pointLight
        position={pointLightPosition}
        intensity={pointLightIntensity}
        distance={20}
        decay={2}
        color="#6366f1"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Fill light for reducing harsh shadows */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={directionalIntensity * 0.3}
        color="#f0f0f0"
      />
    </>
  );
};

export default Lighting;
