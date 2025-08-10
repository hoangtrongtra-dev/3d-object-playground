export interface Shape {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

export interface SceneState {
  shapes: Shape[];
  selectedShapeId: string | null;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

export interface LightSettings {
  ambientIntensity: number;
  directionalIntensity: number;
  pointLightIntensity: number;
  pointLightPosition: [number, number, number];
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export type ShapeType = 'cube' | 'sphere' | 'cone' | 'cylinder' | 'torus' | 'plane';

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface SceneSettings {
  showGrid: boolean;
  showStats: boolean;
  shadows: boolean;
  antialias: boolean;
}
