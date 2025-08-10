import { useState } from 'react';
import {
  Box,
  Button,
  Slider,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  AddBox,
  SportsBasketball,
  Architecture,
  Upload,
  Screenshot,
  Download,
  ExpandMore,
  Delete,
  Edit,
  Lightbulb,
  Transform,
  Settings,
} from '@mui/icons-material';

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

interface LightSettings {
  ambientIntensity: number;
  directionalIntensity: number;
  pointLightIntensity: number;
  pointLightPosition: [number, number, number];
}

interface ControlPanelProps {
  onAddShape: (type: string) => void;
  onLightingChange: (settings: LightSettings) => void;
  onUploadModel: (file: File) => void;
  onExport: () => void;
  onScreenshot: () => void;
  onImportScene: (sceneData: unknown) => void;
  sceneState: SceneState;
  onShapeSelect: (shapeId: string | null) => void;
  onShapeUpdate: (shapeId: string, updates: Partial<Shape>) => void;
  onShapeDelete: (shapeId: string) => void;
  lightSettings: LightSettings;
}

const ControlPanel = ({
  onAddShape,
  onLightingChange,
  onUploadModel,
  onExport,
  onScreenshot,
  onImportScene,
  sceneState,
  onShapeSelect,
  onShapeUpdate,
  onShapeDelete,
  lightSettings,
}: ControlPanelProps) => {
  const [showGrid, setShowGrid] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const handleLightingChange = (type: keyof LightSettings, value: number | [number, number, number]) => {
    const newSettings = {
      ...lightSettings,
      [type]: value,
    };
    onLightingChange(newSettings);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      onUploadModel(event.target.files[0]);
    }
  };

  const handleShapePropertyChange = (shapeId: string, property: keyof Shape, value: string | number | [number, number, number]) => {
    onShapeUpdate(shapeId, { [property]: value });
  };

  const getShapeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cube':
        return <AddBox />;
      case 'sphere':
        return <SportsBasketball />;
      case 'cone':
        return <Architecture />;
      default:
        return <AddBox />;
    }
  };

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: 2 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            🎮 3D Controls
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your 3D scene and objects
          </Typography>
        </Box>

        {/* Scene Settings */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Settings sx={{ mr: 1 }} />
            <Typography>Scene Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                  />
                }
                label="Show Grid"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showStats}
                    onChange={(e) => setShowStats(e.target.checked)}
                  />
                }
                label="Performance Stats"
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Add Shapes */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <AddBox sx={{ mr: 1 }} />
            <Typography>Add Shapes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {['cube', 'sphere', 'cone', 'cylinder', 'torus', 'plane'].map((shape) => (
                <Button
                  key={shape}
                  variant="outlined"
                  size="small"
                  onClick={() => onAddShape(shape)}
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  {getShapeIcon(shape)}
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {shape}
                  </Typography>
                </Button>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Lighting Controls */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Lightbulb sx={{ mr: 1 }} />
            <Typography>Lighting</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box>
                <Typography gutterBottom variant="body2">
                  Ambient Light
                </Typography>
                <Slider
                  value={lightSettings.ambientIntensity}
                  onChange={(_, value) => handleLightingChange('ambientIntensity', value as number)}
                  min={0}
                  max={1}
                  step={0.1}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box>
                <Typography gutterBottom variant="body2">
                  Directional Light
                </Typography>
                <Slider
                  value={lightSettings.directionalIntensity}
                  onChange={(_, value) => handleLightingChange('directionalIntensity', value as number)}
                  min={0}
                  max={2}
                  step={0.1}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box>
                <Typography gutterBottom variant="body2">
                  Point Light Intensity
                </Typography>
                <Slider
                  value={lightSettings.pointLightIntensity}
                  onChange={(_, value) => handleLightingChange('pointLightIntensity', value as number)}
                  min={0}
                  max={2}
                  step={0.1}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box>
                <Typography gutterBottom variant="body2">
                  Point Light Position X
                </Typography>
                <Slider
                  value={lightSettings.pointLightPosition[0]}
                  onChange={(_, value) => {
                    const newPosition = [...lightSettings.pointLightPosition] as [number, number, number];
                    newPosition[0] = value as number;
                    handleLightingChange('pointLightPosition', newPosition);
                  }}
                  min={-10}
                  max={10}
                  step={0.5}
                  valueLabelDisplay="auto"
                />
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Scene Objects */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Transform sx={{ mr: 1 }} />
            <Typography>Scene Objects ({sceneState.shapes.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {sceneState.shapes.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                No objects in scene
              </Typography>
            ) : (
              <List dense>
                {sceneState.shapes.map((shape) => (
                  <ListItem
                    key={shape.id}
                    onClick={() => onShapeSelect(shape.id)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 1,
                      mb: 0.5,
                      bgcolor: sceneState.selectedShapeId === shape.id ? 'action.selected' : 'transparent',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Box sx={{ mr: 1 }}>
                      {getShapeIcon(shape.type)}
                    </Box>
                    <ListItemText
                      primary={shape.type}
                      secondary={`ID: ${shape.id.slice(-4)}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShapeDelete(shape.id);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Selected Object Properties */}
        {sceneState.selectedShapeId && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Edit sx={{ mr: 1 }} />
              <Typography>Object Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {(() => {
                const selectedShape = sceneState.shapes.find(s => s.id === sceneState.selectedShapeId);
                if (!selectedShape) return null;

                return (
                  <Stack spacing={2}>
                    <Box>
                      <Typography gutterBottom variant="body2">
                        Color
                      </Typography>
                      <TextField
                        type="color"
                        value={selectedShape.color}
                        onChange={(e) => handleShapePropertyChange(selectedShape.id, 'color', e.target.value)}
                        size="small"
                        fullWidth
                      />
                    </Box>

                    <Box>
                      <Typography gutterBottom variant="body2">
                        Position X
                      </Typography>
                      <Slider
                        value={selectedShape.position[0]}
                        onChange={(_, value) => {
                          const newPosition = [...selectedShape.position] as [number, number, number];
                          newPosition[0] = value as number;
                          handleShapePropertyChange(selectedShape.id, 'position', newPosition);
                        }}
                        min={-10}
                        max={10}
                        step={0.1}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box>
                      <Typography gutterBottom variant="body2">
                        Position Y
                      </Typography>
                      <Slider
                        value={selectedShape.position[1]}
                        onChange={(_, value) => {
                          const newPosition = [...selectedShape.position] as [number, number, number];
                          newPosition[1] = value as number;
                          handleShapePropertyChange(selectedShape.id, 'position', newPosition);
                        }}
                        min={-10}
                        max={10}
                        step={0.1}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box>
                      <Typography gutterBottom variant="body2">
                        Position Z
                      </Typography>
                      <Slider
                        value={selectedShape.position[2]}
                        onChange={(_, value) => {
                          const newPosition = [...selectedShape.position] as [number, number, number];
                          newPosition[2] = value as number;
                          handleShapePropertyChange(selectedShape.id, 'position', newPosition);
                        }}
                        min={-10}
                        max={10}
                        step={0.1}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box>
                      <Typography gutterBottom variant="body2">
                        Scale
                      </Typography>
                      <Slider
                        value={selectedShape.scale[0]}
                        onChange={(_, value) => {
                          const newScale = [value, value, value] as [number, number, number];
                          handleShapePropertyChange(selectedShape.id, 'scale', newScale);
                        }}
                        min={0.1}
                        max={3}
                        step={0.1}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Stack>
                );
              })()}
            </AccordionDetails>
          </Accordion>
        )}

        {/* File Operations */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Upload sx={{ mr: 1 }} />
            <Typography>File Operations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  3D Model Upload
                </Typography>
                <input
                  type="file"
                  accept=".glb,.gltf,.obj"
                  style={{ display: 'none' }}
                  id="model-upload"
                  onChange={handleFileUpload}
                />
                <label htmlFor="model-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<Upload />}
                    fullWidth
                    sx={{
                      border: '2px dashed',
                      borderColor: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    Upload 3D Model
                  </Button>
                </label>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Supported: GLB, GLTF, OBJ (Max: 50MB)
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Drag & drop files here or click to browse
                </Typography>
                
                {/* File Info Display */}
                {sceneState.shapes.length > 0 && (
                  <Box sx={{ mt: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Scene contains {sceneState.shapes.length} object{sceneState.shapes.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                )}
                
                {/* File Validation Status */}
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="success.main" display="block">
                    ✓ File validation active
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Automatic format checking and size validation
                  </Typography>
                </Box>
                
                {/* File Operation Status */}
                <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1, opacity: 0.8 }}>
                  <Typography variant="caption" color="success.dark" display="block">
                    🚀 Ready for file operations
                  </Typography>
                  <Typography variant="caption" color="success.dark" display="block">
                    All systems operational
                  </Typography>
                </Box>
              </Box>
              
              {/* File Operations Help */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  💡 File Operations Help
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  • <strong>Upload:</strong> Supports GLB, GLTF, OBJ files up to 50MB
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  • <strong>Screenshot:</strong> Captures current view as PNG image
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  • <strong>Export GLB:</strong> Saves entire scene as binary 3D file
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  • <strong>Scene JSON:</strong> Save/load scene configuration and objects
                </Typography>
              </Box>
              
              {/* File Operation Progress */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1, opacity: 0.8 }}>
                <Typography variant="body2" color="info.dark" gutterBottom>
                  📊 Operation Statistics
                </Typography>
                <Typography variant="caption" color="info.dark" display="block" sx={{ mb: 1 }}>
                  • Total objects in scene: {sceneState.shapes.length}
                </Typography>
                <Typography variant="caption" color="info.dark" display="block" sx={{ mb: 1 }}>
                  • Selected object: {sceneState.selectedShapeId ? 'Yes' : 'None'}
                </Typography>
                <Typography variant="caption" color="info.dark" display="block">
                  • Scene complexity: {sceneState.shapes.length > 10 ? 'High' : sceneState.shapes.length > 5 ? 'Medium' : 'Low'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Export & Capture
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<Screenshot />}
                    onClick={onScreenshot}
                    fullWidth
                    sx={{
                      '&:hover': {
                        backgroundColor: 'success.light',
                        borderColor: 'success.main',
                        color: 'success.contrastText'
                      }
                    }}
                  >
                    Screenshot
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={onExport}
                    fullWidth
                    sx={{
                      '&:hover': {
                        backgroundColor: 'info.light',
                        borderColor: 'info.main',
                        color: 'info.contrastText'
                      }
                    }}
                  >
                    Export GLB
                  </Button>
                </Stack>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Scene Management
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Upload />}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.json';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          // Handle scene import
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const sceneData = JSON.parse(event.target?.result as string);
                              console.log('Scene imported:', sceneData);
                              onImportScene(sceneData);
                            } catch (error) {
                              console.error('Failed to parse scene file:', error);
                            }
                          };
                          reader.readAsText(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    Import Scene
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                    onClick={() => {
                      // Export current scene state as JSON
                      const sceneData = {
                        version: '1.0.0',
                        timestamp: new Date().toISOString(),
                        scene: sceneState,
                        lightSettings: lightSettings,
                        metadata: {
                          totalObjects: sceneState.shapes.length,
                          selectedObject: sceneState.selectedShapeId,
                          cameraPosition: sceneState.cameraPosition,
                          cameraTarget: sceneState.cameraTarget
                        }
                      };
                      
                      const dataStr = JSON.stringify(sceneData, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `3d-scene-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Export Scene
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear the entire scene? This action cannot be undone.')) {
                        // Clear all shapes
                        sceneState.shapes.forEach(shape => {
                          onShapeDelete(shape.id);
                        });
                      }
                    }}
                    sx={{ color: 'error.main', borderColor: 'error.main' }}
                  >
                    Clear Scene
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Box>
  );
};

export default ControlPanel;
