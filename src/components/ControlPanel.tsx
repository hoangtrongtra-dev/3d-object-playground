import { useState } from 'react';
import {
  Box,
  Button,
  Slider,
  Typography,
  Paper,
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
  Chip,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  Visibility,
  VisibilityOff,
  Lightbulb,
  CameraAlt,
  Transform,
  Palette,
  Settings,
  GridOn,
  GridOff,
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

interface ControlPanelProps {
  onAddShape: (type: string) => void;
  onLightingChange: (settings: any) => void;
  onUploadModel: (file: File) => void;
  onExport: () => void;
  onScreenshot: () => void;
  sceneState: SceneState;
  onShapeSelect: (shapeId: string | null) => void;
  onShapeUpdate: (shapeId: string, updates: Partial<Shape>) => void;
  onShapeDelete: (shapeId: string) => void;
  lightSettings: any;
}

const ControlPanel = ({
  onAddShape,
  onLightingChange,
  onUploadModel,
  onExport,
  onScreenshot,
  sceneState,
  onShapeSelect,
  onShapeUpdate,
  onShapeDelete,
  lightSettings,
}: ControlPanelProps) => {
  const [showGrid, setShowGrid] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const handleLightingChange = (type: string, value: number | [number, number, number]) => {
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

  const handleShapePropertyChange = (shapeId: string, property: string, value: any) => {
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
                    selected={sceneState.selectedShapeId === shape.id}
                    onClick={() => onShapeSelect(shape.id)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 1,
                      mb: 0.5,
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
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Upload sx={{ mr: 1 }} />
            <Typography>File Operations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box>
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
                  >
                    Upload 3D Model
                  </Button>
                </label>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<Screenshot />}
                  onClick={onScreenshot}
                  fullWidth
                >
                  Screenshot
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={onExport}
                  fullWidth
                >
                  Export GLB
                </Button>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Box>
  );
};

export default ControlPanel;
