import { useState, useCallback } from 'react';
import { Shape, SceneState, LightSettings } from '../types';

const initialSceneState: SceneState = {
  shapes: [],
  selectedShapeId: null,
  cameraPosition: [5, 5, 5],
  cameraTarget: [0, 0, 0],
};

const initialLightSettings: LightSettings = {
  ambientIntensity: 0.4,
  directionalIntensity: 0.8,
  pointLightIntensity: 0.5,
  pointLightPosition: [5, 5, 5],
};

export const useSceneState = () => {
  const [sceneState, setSceneState] = useState<SceneState>(initialSceneState);
  const [lightSettings, setLightSettings] = useState<LightSettings>(initialLightSettings);

  const addShape = useCallback((type: string) => {
    const newShape: Shape = {
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#6366f1',
    };

    setSceneState(prev => ({
      ...prev,
      shapes: [...prev.shapes, newShape],
    }));

    return newShape;
  }, []);

  const selectShape = useCallback((shapeId: string | null) => {
    setSceneState(prev => ({
      ...prev,
      selectedShapeId: shapeId,
    }));
  }, []);

  const updateShape = useCallback((shapeId: string, updates: Partial<Shape>) => {
    setSceneState(prev => ({
      ...prev,
      shapes: prev.shapes.map(shape =>
        shape.id === shapeId ? { ...shape, ...updates } : shape
      ),
    }));
  }, []);

  const deleteShape = useCallback((shapeId: string) => {
    setSceneState(prev => ({
      ...prev,
      shapes: prev.shapes.filter(shape => shape.id !== shapeId),
      selectedShapeId: prev.selectedShapeId === shapeId ? null : prev.selectedShapeId,
    }));
  }, []);

  const updateCamera = useCallback((position: [number, number, number], target: [number, number, number]) => {
    setSceneState(prev => ({
      ...prev,
      cameraPosition: position,
      cameraTarget: target,
    }));
  }, []);

  const updateLightSettings = useCallback((settings: Partial<LightSettings>) => {
    setLightSettings(prev => ({
      ...prev,
      ...settings,
    }));
  }, []);

  const clearScene = useCallback(() => {
    setSceneState(initialSceneState);
  }, []);

  const duplicateShape = useCallback((shapeId: string) => {
    const shapeToDuplicate = sceneState.shapes.find(shape => shape.id === shapeId);
    if (!shapeToDuplicate) return;

    const duplicatedShape: Shape = {
      ...shapeToDuplicate,
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: [
        shapeToDuplicate.position[0] + 1,
        shapeToDuplicate.position[1],
        shapeToDuplicate.position[2]
      ],
    };

    setSceneState(prev => ({
      ...prev,
      shapes: [...prev.shapes, duplicatedShape],
    }));

    return duplicatedShape;
  }, [sceneState.shapes]);

  const getSelectedShape = useCallback(() => {
    return sceneState.shapes.find(shape => shape.id === sceneState.selectedShapeId) || null;
  }, [sceneState.shapes, sceneState.selectedShapeId]);

  return {
    sceneState,
    lightSettings,
    addShape,
    selectShape,
    updateShape,
    deleteShape,
    updateCamera,
    updateLightSettings,
    clearScene,
    duplicateShape,
    getSelectedShape,
  };
};
