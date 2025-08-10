import React, { useState, useCallback, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, AppBar, Toolbar, Typography, IconButton, Drawer, useMediaQuery, Fab, Snackbar, Alert } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, Settings as SettingsIcon } from '@mui/icons-material';
import Scene3D from './components/Scene3D';
import ControlPanel from './components/ControlPanel';
import * as THREE from 'three';

// Create a modern dark theme with better colors
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899', // Pink
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#0f0f23',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

interface LightSettings {
  ambientIntensity: number;
  directionalIntensity: number;
  pointLightIntensity: number;
  pointLightPosition: [number, number, number];
}

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

function App() {
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modelUrl, setModelUrl] = useState<string>();
  const [lightSettings, setLightSettings] = useState<LightSettings>({
    ambientIntensity: 0.4,
    directionalIntensity: 0.8,
    pointLightIntensity: 0.5,
    pointLightPosition: [5, 5, 5] as [number, number, number],
  });
  const [sceneState, setSceneState] = useState<SceneState>({
    shapes: [],
    selectedShapeId: null,
    cameraPosition: [5, 5, 5],
    cameraTarget: [0, 0, 0],
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const sceneRef = useRef<{ scene: THREE.Scene; domElement: HTMLCanvasElement } | null>(null);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleAddShape = useCallback((type: string) => {
    const newShape: Shape = {
      id: `shape-${Date.now()}`,
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
    
    showSnackbar(`${type} added to scene`, 'success');
  }, [showSnackbar]);

  const handleUploadModel = useCallback((file: File) => {
    try {
      // Validate file type
      const allowedTypes = ['.glb', '.gltf', '.obj'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExtension)) {
        showSnackbar(`Unsupported file type: ${fileExtension}. Please use GLB, GLTF, or OBJ files.`, 'error');
        return;
      }
      
      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        showSnackbar('File too large. Maximum size is 50MB.', 'error');
        return;
      }
      
      // Show loading message
      showSnackbar(`Uploading ${file.name}...`, 'info');
      
      // Create object URL and set model
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      
      // Clean up previous model URL if exists
      setModelUrl(prevUrl => {
        if (prevUrl && prevUrl.startsWith('blob:')) {
          URL.revokeObjectURL(prevUrl);
        }
        return url;
      });
      
      showSnackbar(`Model "${file.name}" uploaded successfully!`, 'success');
      
      // Log upload info
      console.log('Model uploaded:', {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type || fileExtension,
        url: url
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      showSnackbar(`Failed to upload model: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  }, [showSnackbar]);

  const handleExport = useCallback(() => {
    try {
      if (sceneRef.current?.scene) {
        const scene = sceneRef.current.scene;
        const filename = `3d-scene-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.glb`;
        
        // Use GLTFExporter to export the scene
        import('three/examples/jsm/exporters/GLTFExporter.js').then(({ GLTFExporter }) => {
          const exporter = new GLTFExporter();
          
          exporter.parseAsync(scene, {
            binary: true,
            includeCustomExtensions: true,
          }).then((result) => {
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
              showSnackbar(`Scene exported as ${filename}`, 'success');
            } else {
              showSnackbar('Export failed: Invalid result format', 'error');
            }
          }).catch((error) => {
            console.error('Export error:', error);
            showSnackbar('Failed to export scene', 'error');
          });
        }).catch((error) => {
          console.error('Failed to load GLTFExporter:', error);
          showSnackbar('Export module not available', 'error');
        });
      } else {
        showSnackbar('Scene not ready for export', 'warning');
      }
    } catch (error) {
      console.error('Export error:', error);
      showSnackbar('Failed to export scene', 'error');
    }
  }, [showSnackbar]);

  const handleScreenshot = useCallback(() => {
    try {
      if (sceneRef.current) {
        const canvas = sceneRef.current.domElement;
        if (canvas) {
          const filename = `3d-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
          
          // Get the canvas data
          const dataURL = canvas.toDataURL('image/png');
          
          // Create download link
          const link = document.createElement('a');
          link.href = dataURL;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          showSnackbar(`Screenshot saved as ${filename}`, 'success');
        } else {
          showSnackbar('Canvas not available for screenshot', 'warning');
        }
      } else {
        showSnackbar('Scene not ready for screenshot', 'warning');
      }
    } catch (error) {
      console.error('Screenshot error:', error);
      showSnackbar('Failed to capture screenshot', 'error');
    }
  }, [showSnackbar]);

  const handleShapeSelect = useCallback((shapeId: string | null) => {
    setSceneState(prev => ({
      ...prev,
      selectedShapeId: shapeId,
    }));
  }, []);

  const handleShapeUpdate = useCallback((shapeId: string, updates: Partial<Shape>) => {
    setSceneState(prev => ({
      ...prev,
      shapes: prev.shapes.map(shape => 
        shape.id === shapeId ? { ...shape, ...updates } : shape
      ),
    }));
  }, []);

  const handleShapeDelete = useCallback((shapeId: string) => {
    setSceneState(prev => ({
      ...prev,
      shapes: prev.shapes.filter(shape => shape.id !== shapeId),
      selectedShapeId: prev.selectedShapeId === shapeId ? null : prev.selectedShapeId,
    }));
    showSnackbar('Shape deleted', 'info');
  }, [showSnackbar]);

  const handleImportScene = useCallback((sceneData: unknown) => {
    try {
      // Validate scene data structure
      if (!sceneData || typeof sceneData !== 'object') {
        throw new Error('Invalid scene data format');
      }

      // Extract scene information
      const { scene, lightSettings: importedLightSettings, metadata } = sceneData as {
        scene?: SceneState;
        lightSettings?: LightSettings;
        metadata?: unknown;
      };
      
      if (scene && typeof scene === 'object') {
        // Validate and import shapes
        if (Array.isArray(scene.shapes)) {
          const validatedShapes = scene.shapes.filter((shape: unknown) => {
            return shape && 
                   typeof shape === 'object' &&
                   'id' in shape && typeof (shape as Shape).id === 'string' &&
                   'type' in shape && typeof (shape as Shape).type === 'string' &&
                   'position' in shape && Array.isArray((shape as Shape).position) && (shape as Shape).position.length === 3 &&
                   'rotation' in shape && Array.isArray((shape as Shape).rotation) && (shape as Shape).rotation.length === 3 &&
                   'scale' in shape && Array.isArray((shape as Shape).scale) && (shape as Shape).scale.length === 3 &&
                   'color' in shape && typeof (shape as Shape).color === 'string';
          });

          if (validatedShapes.length > 0) {
            setSceneState(prev => ({
              ...prev,
              shapes: validatedShapes,
              selectedShapeId: scene.selectedShapeId || null,
              cameraPosition: scene.cameraPosition || prev.cameraPosition,
              cameraTarget: scene.cameraTarget || prev.cameraTarget,
            }));

            showSnackbar(`Imported ${validatedShapes.length} objects from scene`, 'success');
          } else {
            showSnackbar('No valid shapes found in scene file', 'warning');
          }
        }

        // Import light settings if available
        if (importedLightSettings && typeof importedLightSettings === 'object') {
          const validLightSettings: LightSettings = {
            ambientIntensity: typeof importedLightSettings.ambientIntensity === 'number' 
              ? importedLightSettings.ambientIntensity : lightSettings.ambientIntensity,
            directionalIntensity: typeof importedLightSettings.directionalIntensity === 'number' 
              ? importedLightSettings.directionalIntensity : lightSettings.directionalIntensity,
            pointLightIntensity: typeof importedLightSettings.pointLightIntensity === 'number' 
              ? importedLightSettings.pointLightIntensity : lightSettings.pointLightIntensity,
            pointLightPosition: Array.isArray(importedLightSettings.pointLightPosition) && 
                               importedLightSettings.pointLightPosition.length === 3
              ? importedLightSettings.pointLightPosition as [number, number, number]
              : lightSettings.pointLightPosition,
          };

          setLightSettings(validLightSettings);
        }

        // Log import information
        if (metadata) {
          console.log('Scene imported with metadata:', metadata);
        }

        showSnackbar('Scene imported successfully!', 'success');
      } else {
        throw new Error('Scene data is missing or invalid');
      }
    } catch (error) {
      console.error('Import error:', error);
      showSnackbar(`Failed to import scene: ${error instanceof Error ? error.message : 'Invalid file format'}`, 'error');
    }
  }, [lightSettings, showSnackbar]);

  const handleCameraUpdate = useCallback((position: [number, number, number], target: [number, number, number]) => {
    setSceneState(prev => ({
      ...prev,
      cameraPosition: position,
      cameraTarget: target,
    }));
  }, []);

  const handleLightingChange = useCallback((settings: LightSettings) => {
    setLightSettings(settings);
  }, []);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const drawerWidth = 320;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              🎮 3D Object Playground
            </Typography>
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            height: '100vh',
            pt: '64px', // AppBar height
          }}
        >
          {/* 3D Scene */}
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <Scene3D
              ref={sceneRef}
              modelUrl={modelUrl}
              lightSettings={lightSettings}
              sceneState={sceneState}
              onShapeSelect={handleShapeSelect}
              onShapeUpdate={handleShapeUpdate}
              onCameraUpdate={handleCameraUpdate}
            />
            
            {/* Floating Action Button for mobile */}
            {isMobile && (
              <Fab
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  zIndex: 1000,
                }}
              >
                <MenuIcon />
              </Fab>
            )}
          </Box>

          {/* Control Panel - Desktop */}
          {!isMobile && (
            <Box
              sx={{
                width: drawerWidth,
                borderLeft: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <ControlPanel
                onAddShape={handleAddShape}
                onLightingChange={handleLightingChange}
                onUploadModel={handleUploadModel}
                onExport={handleExport}
                onScreenshot={handleScreenshot}
                onImportScene={handleImportScene}
                sceneState={sceneState}
                onShapeSelect={handleShapeSelect}
                onShapeUpdate={handleShapeUpdate}
                onShapeDelete={handleShapeDelete}
                lightSettings={lightSettings}
              />
            </Box>
          )}
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.paper',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Controls</Typography>
              <IconButton onClick={toggleDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <ControlPanel
            onAddShape={handleAddShape}
            onLightingChange={handleLightingChange}
            onUploadModel={handleUploadModel}
            onExport={handleExport}
            onScreenshot={handleScreenshot}
            onImportScene={handleImportScene}
            sceneState={sceneState}
            onShapeSelect={handleShapeSelect}
            onShapeUpdate={handleShapeUpdate}
            onShapeDelete={handleShapeDelete}
            lightSettings={lightSettings}
          />
        </Drawer>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
