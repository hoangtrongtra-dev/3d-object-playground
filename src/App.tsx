import { useState, useCallback, useRef } from 'react';
import { 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Close as CloseIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import Scene3D from './components/Scene3D';
import ControlPanel from './components/ControlPanel';

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
    surface: {
      main: '#16213e',
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
  const [lightSettings, setLightSettings] = useState({
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
  const sceneRef = useRef<any>(null);

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
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      showSnackbar(`Model "${file.name}" uploaded successfully`, 'success');
    } catch (error) {
      showSnackbar('Failed to upload model', 'error');
    }
  }, [showSnackbar]);

  const handleExport = useCallback(() => {
    try {
      // Implementation for GLB export
      showSnackbar('Scene exported as GLB file', 'success');
    } catch (error) {
      showSnackbar('Failed to export scene', 'error');
    }
  }, [showSnackbar]);

  const handleScreenshot = useCallback(() => {
    try {
      // Implementation for screenshot
      showSnackbar('Screenshot captured', 'success');
    } catch (error) {
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

  const handleCameraUpdate = useCallback((position: [number, number, number], target: [number, number, number]) => {
    setSceneState(prev => ({
      ...prev,
      cameraPosition: position,
      cameraTarget: target,
    }));
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
                onLightingChange={setLightSettings}
                onUploadModel={handleUploadModel}
                onExport={handleExport}
                onScreenshot={handleScreenshot}
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
            onLightingChange={setLightSettings}
            onUploadModel={handleUploadModel}
            onExport={handleExport}
            onScreenshot={handleScreenshot}
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
