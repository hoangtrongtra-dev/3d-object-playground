import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';

export const exportSceneAsGLB = async (scene: THREE.Scene, filename: string = 'scene.glb') => {
  try {
    const exporter = new GLTFExporter();
    
    const result = await exporter.parseAsync(scene, {
      binary: true,
      includeCustomExtensions: true,
    });

    if (result instanceof ArrayBuffer) {
      const blob = new Blob([result], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error exporting GLB:', error);
    throw error;
  }
};

export const takeScreenshot = (renderer: THREE.WebGLRenderer, filename: string = 'screenshot.png') => {
  try {
    // Render the scene to get the current view
    renderer.render(renderer.scene, renderer.camera);
    
    // Get the canvas data
    const canvas = renderer.domElement;
    const dataURL = canvas.toDataURL('image/png');
    
    // Create download link
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error taking screenshot:', error);
    throw error;
  }
};

export const exportSceneAsJSON = (sceneState: any, filename: string = 'scene.json') => {
  try {
    const sceneData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      scene: sceneState,
    };
    
    const dataStr = JSON.stringify(sceneData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error exporting JSON:', error);
    throw error;
  }
};

export const importSceneFromJSON = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const sceneData = JSON.parse(content);
        resolve(sceneData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};
