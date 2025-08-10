# 🎮 3D Object Playground

A modern web application for creating, viewing, and manipulating 3D objects in real-time. Built with React, Three.js, and Material-UI.

![3D Playground Demo](https://img.shields.io/badge/Status-Development-orange)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.179.1-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

## ✨ Features

- **🎯 Interactive 3D Scene**: Real-time 3D rendering with orbit controls
- **📁 Model Upload**: Support for GLB, GLTF, and OBJ file formats
- **💡 Dynamic Lighting**: Adjustable ambient and directional lighting
- **🔧 Shape Creation**: Add basic geometric shapes (cube, sphere, cone)
- **📸 Screenshot**: Capture high-quality screenshots of your 3D scene
- **💾 Export**: Export your scene as GLB files
- **📥 Import Scene**: Import previously exported scene files (JSON format)
- **🌙 Dark Theme**: Modern dark UI with Material-UI components
- **📱 Responsive**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hoangtrongtra-dev/3d-object-playground.git
   cd 3d-object-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI framework
- **TypeScript 5.8.3** - Type safety
- **Vite 7.1.0** - Build tool and dev server

### 3D Graphics
- **Three.js 0.179.1** - 3D graphics library
- **@react-three/fiber 9.3.0** - React renderer for Three.js
- **@react-three/drei 10.6.1** - Useful helpers for React Three Fiber

### UI Components
- **Material-UI 7.3.1** - Component library
- **@emotion/react & @emotion/styled** - CSS-in-JS styling

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📁 Project Structure

```
3d-object-playground/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Scene3D.tsx    # 3D canvas and scene setup
│   │   ├── Model.tsx      # 3D model loading and rendering
│   │   ├── Lighting.tsx   # Lighting configuration
│   │   └── ControlPanel.tsx # UI controls
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🎮 Usage

### Basic Controls

1. **Camera Navigation**
   - **Left Click + Drag**: Rotate the camera around the scene
   - **Right Click + Drag**: Pan the camera
   - **Scroll**: Zoom in/out

2. **Adding Shapes**
   - Click the shape buttons in the control panel
   - Available shapes: Cube, Sphere, Cone

3. **Scene Management**
   - **Export Scene**: Save your current scene as a JSON file
   - **Import Scene**: Load previously exported scene files
   - **Clear Scene**: Remove all objects from the scene

3. **Uploading Models**
   - Click "Upload 3D Model" button
   - Select GLB, GLTF, or OBJ files
   - Models will automatically load and display

4. **Adjusting Lighting**
   - Use the sliders to control ambient and directional light intensity
   - Changes are applied in real-time

### Advanced Features

- **Screenshot**: Capture the current view of your 3D scene
- **Export GLB**: Save your scene as a GLB file for use in other applications

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Adding New Features

1. **New 3D Shapes**: Add shape components in `src/components/`
2. **Custom Materials**: Extend the Material system in `Model.tsx`
3. **Additional Controls**: Add UI components to `ControlPanel.tsx`

## 🎨 Customization

### Themes
The application uses Material-UI's theming system. Modify the theme in `App.tsx`:

```typescript
const customTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#your-color',
    },
  },
});
```

### 3D Scene Settings
Adjust camera, lighting, and environment settings in `Scene3D.tsx`:

```typescript
<Canvas
  camera={{
    position: [5, 5, 5],
    fov: 45
  }}
>
  <Environment preset="studio" />
</Canvas>
```

## 📦 Supported File Formats

- **GLB** (.glb) - Binary glTF format
- **GLTF** (.gltf) - JSON-based 3D format
- **OBJ** (.obj) - Wavefront OBJ format
- **JSON** (.json) - Scene configuration files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code formatting
- Add proper type definitions
- Test your changes thoroughly

## 🐛 Known Issues

- Large model files may take time to load
- Some complex GLTF animations might not render correctly
- Mobile performance may vary based on device capabilities

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [Material-UI](https://mui.com/) - React component library
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/hoangtrongtra-dev/3d-object-playground/issues) page
2. Create a new issue with detailed information
3. Include browser console logs and error messages

---

**Made with ❤️ by hoangtrongtra-dev using React, Three.js, and TypeScript**
