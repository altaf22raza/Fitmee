import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AvatarConfig, ClothingCategory, GarmentItem } from '../../types';
import { createGarmentGroup } from './proceduralGarments';
import { RotateCw, Eye, ZoomIn, ZoomOut, Maximize2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface Avatar3DViewerProps {
  avatarConfig: AvatarConfig;
  selectedTop?: GarmentItem & { selectedColor: string };
  selectedBottom?: GarmentItem & { selectedColor: string };
  selectedOuterwear?: GarmentItem & { selectedColor: string };
  height?: string | number;
  showControls?: boolean;
  autoRotateDefault?: boolean;
}

export const Avatar3DViewer: React.FC<Avatar3DViewerProps> = ({
  avatarConfig,
  selectedTop,
  selectedBottom,
  selectedOuterwear,
  height = '560px',
  showControls = true,
  autoRotateDefault = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const garmentsGroupRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number>(0);

  // Interaction & camera angles
  const [cameraView, setCameraView] = useState<'front' | 'side' | 'back' | 'custom'>('front');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [autoRotate, setAutoRotate] = useState<boolean>(autoRotateDefault);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Orbital angles
  const orbitState = useRef({
    theta: 0, // horizontal rotation angle
    targetTheta: 0,
    phi: 1.5, // vertical angle (around chest level)
    targetPhi: 1.5,
    distance: 3.2,
    targetDistance: 3.2,
    prevPointerX: 0,
    prevPointerY: 0,
    isPointerDown: false
  });

  // Build the anatomical human avatar mesh
  const buildHumanMesh = useCallback(
    (config: AvatarConfig) => {
      const group = new THREE.Group();
      group.name = 'human_avatar';

      const skinMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.skinTone),
        roughness: 0.52,
        metalness: 0.04
      });

      const hairMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.hairColor),
        roughness: 0.38,
        metalness: 0.1
      });

      const underwearMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.defaultUnderwearColor || '#101C3A'),
        roughness: 0.7
      });

      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.1
      });

      const lipMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.skinTone).multiplyScalar(0.85),
        roughness: 0.45
      });

      const { chestScale, waistScale, hipScale, shoulderRatio, armScale } = config;

      // 1. Head & Face
      const headGroup = new THREE.Group();
      headGroup.position.y = 1.62;

      // Cranium / Face
      const craniumGeo = new THREE.SphereGeometry(0.12, 32, 32);
      craniumGeo.scale(0.88, 1.15, 0.95);
      const cranium = new THREE.Mesh(craniumGeo, skinMat);
      headGroup.add(cranium);

      // Chin / Jaw
      const jawGeo = new THREE.ConeGeometry(0.08, 0.1, 16);
      jawGeo.rotateX(Math.PI);
      const jaw = new THREE.Mesh(jawGeo, skinMat);
      jaw.position.set(0, -0.06, 0.04);
      headGroup.add(jaw);

      // Eyes
      [-0.045, 0.045].forEach((x) => {
        const eyeGeo = new THREE.SphereGeometry(0.014, 16, 16);
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(x, 0.015, 0.10);
        headGroup.add(eye);
      });

      // Lips
      const lipGeo = new THREE.BoxGeometry(0.038, 0.01, 0.012);
      const lips = new THREE.Mesh(lipGeo, lipMat);
      lips.position.set(0, -0.05, 0.10);
      headGroup.add(lips);

      // Stylized Hairstyles
      if (config.hairStyle !== 'buzz') {
        const hairGeo = new THREE.SphereGeometry(0.13, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6);
        hairGeo.scale(0.92, 1.05, 0.98);
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.y = 0.04;
        headGroup.add(hair);

        if (config.hairStyle === 'parted' || config.hairStyle === 'short') {
          const fringeGeo = new THREE.BoxGeometry(0.12, 0.04, 0.04);
          const fringe = new THREE.Mesh(fringeGeo, hairMat);
          fringe.position.set(0.02, 0.08, 0.09);
          fringe.rotation.z = -0.15;
          headGroup.add(fringe);
        } else if (config.hairStyle === 'ponytail') {
          const tailGeo = new THREE.ConeGeometry(0.05, 0.22, 16);
          tailGeo.rotateX(-0.5);
          const tail = new THREE.Mesh(tailGeo, hairMat);
          tail.position.set(0, 0.02, -0.16);
          headGroup.add(tail);
        } else if (config.hairStyle === 'long' || config.hairStyle === 'bob') {
          [-0.11, 0.11].forEach((side) => {
            const sideHairGeo = new THREE.CylinderGeometry(0.03, 0.04, config.hairStyle === 'long' ? 0.32 : 0.16, 16);
            const sideHair = new THREE.Mesh(sideHairGeo, hairMat);
            sideHair.position.set(side, -0.06, 0);
            headGroup.add(sideHair);
          });
        }
      }

      group.add(headGroup);

      // 2. Neck
      const neckGeo = new THREE.CylinderGeometry(0.055 * shoulderRatio, 0.065 * shoulderRatio, 0.12, 24);
      const neck = new THREE.Mesh(neckGeo, skinMat);
      neck.position.y = 1.48;
      group.add(neck);

      // 3. Torso / Upper Chest (scaled by chestScale, shoulderRatio)
      const chestGeo = new THREE.CylinderGeometry(
        0.25 * chestScale * shoulderRatio,
        0.22 * waistScale,
        0.36,
        32
      );
      chestGeo.scale(1, 1, 0.75); // Flatter depth
      const chest = new THREE.Mesh(chestGeo, skinMat);
      chest.position.y = 1.25;
      chest.castShadow = true;
      group.add(chest);

      // 4. Abdomen / Waist
      const abdomenGeo = new THREE.CylinderGeometry(
        0.22 * waistScale,
        0.24 * hipScale,
        0.24,
        32
      );
      abdomenGeo.scale(1, 1, 0.74);
      const abdomen = new THREE.Mesh(abdomenGeo, skinMat);
      abdomen.position.y = 0.96;
      group.add(abdomen);

      // 5. Pelvis / Hips (fitted with subtle underwear)
      const pelvisGeo = new THREE.CylinderGeometry(
        0.24 * hipScale,
        0.21 * hipScale,
        0.22,
        32
      );
      pelvisGeo.scale(1, 1, 0.78);
      const pelvis = new THREE.Mesh(pelvisGeo, underwearMat);
      pelvis.position.y = 0.76;
      group.add(pelvis);

      // 6. Shoulders & Arms (Dual symmetrically positioned)
      [-1, 1].forEach((side) => {
        // Shoulder joint
        const shoulderGeo = new THREE.SphereGeometry(0.075 * armScale, 20, 20);
        const shoulder = new THREE.Mesh(shoulderGeo, skinMat);
        shoulder.position.set(side * 0.28 * shoulderRatio, 1.34, 0);
        group.add(shoulder);

        // Upper arm (biceps/triceps)
        const upperArmGeo = new THREE.CylinderGeometry(0.065 * armScale, 0.055 * armScale, 0.28, 20);
        const upperArm = new THREE.Mesh(upperArmGeo, skinMat);
        upperArm.position.set(side * 0.31 * shoulderRatio, 1.18, 0);
        upperArm.rotation.z = side * -0.18;
        group.add(upperArm);

        // Elbow joint
        const elbowGeo = new THREE.SphereGeometry(0.052 * armScale, 16, 16);
        const elbow = new THREE.Mesh(elbowGeo, skinMat);
        elbow.position.set(side * 0.34 * shoulderRatio, 1.02, 0);
        group.add(elbow);

        // Forearm
        const forearmGeo = new THREE.CylinderGeometry(0.052 * armScale, 0.044 * armScale, 0.28, 20);
        const forearm = new THREE.Mesh(forearmGeo, skinMat);
        forearm.position.set(side * 0.36 * shoulderRatio, 0.86, 0);
        forearm.rotation.z = side * -0.14;
        group.add(forearm);

        // Hand
        const handGeo = new THREE.BoxGeometry(0.045, 0.08, 0.025);
        const hand = new THREE.Mesh(handGeo, skinMat);
        hand.position.set(side * 0.38 * shoulderRatio, 0.69, 0);
        group.add(hand);
      });

      // 7. Legs & Feet
      [-1, 1].forEach((side) => {
        // Upper thigh
        const thighGeo = new THREE.CylinderGeometry(0.105 * hipScale, 0.08, 0.40, 24);
        const thigh = new THREE.Mesh(thighGeo, skinMat);
        thigh.position.set(side * 0.11, 0.48, 0);
        group.add(thigh);

        // Knee joint
        const kneeGeo = new THREE.SphereGeometry(0.072, 16, 16);
        const knee = new THREE.Mesh(kneeGeo, skinMat);
        knee.position.set(side * 0.11, 0.26, 0.01);
        group.add(knee);

        // Calf / Shin
        const calfGeo = new THREE.CylinderGeometry(0.075, 0.055, 0.40, 24);
        const calf = new THREE.Mesh(calfGeo, skinMat);
        calf.position.set(side * 0.11, 0.04, 0);
        group.add(calf);

        // Foot
        const footGeo = new THREE.BoxGeometry(0.075, 0.05, 0.18);
        const foot = new THREE.Mesh(footGeo, skinMat);
        foot.position.set(side * 0.11, -0.15, 0.04);
        group.add(foot);
      });

      return group;
    },
    []
  );

  // Initialize Three.js Scene and Renderer
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software GL per Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xF5F7FC); // Neutral warm canvas matching FitMe background
    scene.fog = new THREE.Fog(0xF5F7FC, 6, 14);

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      20
    );
    camera.position.set(0, 1.0, 3.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.8);
    keyLight.position.set(2.5, 4.0, 3.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce8ff, 0.9);
    fillLight.position.set(-2.5, 2.0, 2.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.1);
    rimLight.position.set(0, 3.0, -3.0);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd0d7e6, 0.6);
    scene.add(hemiLight);

    // Contact Ground Shadow & Minimalist Fashion Atelier Pedestal
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.16,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.18;
    scene.add(shadowPlane);

    // Subtle runway pedestal ring
    const pedestalGeo = new THREE.CylinderGeometry(0.9, 0.94, 0.03, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.1
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.195;
    scene.add(pedestal);

    // Garment group container
    const garmentsGroup = new THREE.Group();
    garmentsGroup.name = 'garments_container';
    scene.add(garmentsGroup);
    garmentsGroupRef.current = garmentsGroup;

    // Pointer events for orbit rotation & pan
    const handlePointerDown = (e: PointerEvent) => {
      orbitState.current.isPointerDown = true;
      orbitState.current.prevPointerX = e.clientX;
      orbitState.current.prevPointerY = e.clientY;
      setIsDragging(true);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!orbitState.current.isPointerDown) return;
      const dx = e.clientX - orbitState.current.prevPointerX;
      const dy = e.clientY - orbitState.current.prevPointerY;
      orbitState.current.prevPointerX = e.clientX;
      orbitState.current.prevPointerY = e.clientY;

      orbitState.current.targetTheta -= dx * 0.008;
      orbitState.current.targetPhi = Math.max(
        0.4,
        Math.min(Math.PI * 0.75, orbitState.current.targetPhi - dy * 0.005)
      );
      setCameraView('custom');
    };

    const handlePointerUp = () => {
      orbitState.current.isPointerDown = false;
      setIsDragging(false);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Render loop with exponential damping
    const clock = new THREE.Clock();
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Auto rotation if active
      if (autoRotate && !orbitState.current.isPointerDown) {
        orbitState.current.targetTheta += delta * 0.35;
      }

      // Smooth camera position damping
      const os = orbitState.current;
      os.theta = THREE.MathUtils.damp(os.theta, os.targetTheta, 8, delta);
      os.phi = THREE.MathUtils.damp(os.phi, os.targetPhi, 8, delta);
      os.distance = THREE.MathUtils.damp(os.distance, os.targetDistance, 8, delta);

      const targetLookY = 0.88; // chest/mid-torso center
      const sinPhiRadius = Math.sin(os.phi) * os.distance;
      camera.position.x = sinPhiRadius * Math.sin(os.theta);
      camera.position.z = sinPhiRadius * Math.cos(os.theta);
      camera.position.y = targetLookY + Math.cos(os.phi) * os.distance;
      camera.lookAt(0, targetLookY, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      resizeObserver.disconnect();
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.dispose();
      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
    };
  }, []);

  // Update Avatar Model when config changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (avatarGroupRef.current) {
      scene.remove(avatarGroupRef.current);
    }

    const newAvatarGroup = buildHumanMesh(avatarConfig);
    scene.add(newAvatarGroup);
    avatarGroupRef.current = newAvatarGroup;
  }, [avatarConfig, buildHumanMesh]);

  // Update 3D Garments overlay when selections change
  useEffect(() => {
    const garmentsGroup = garmentsGroupRef.current;
    if (!garmentsGroup) return;

    // Clear existing garments
    while (garmentsGroup.children.length > 0) {
      garmentsGroup.remove(garmentsGroup.children[0]);
    }

    const proportions = {
      chestScale: avatarConfig.chestScale,
      waistScale: avatarConfig.waistScale,
      hipScale: avatarConfig.hipScale,
      shoulderRatio: avatarConfig.shoulderRatio
    };

    if (selectedTop) {
      const topMesh = createGarmentGroup(selectedTop.category, selectedTop.selectedColor, proportions);
      garmentsGroup.add(topMesh);
    }

    if (selectedBottom) {
      const bottomMesh = createGarmentGroup(selectedBottom.category, selectedBottom.selectedColor, proportions);
      garmentsGroup.add(bottomMesh);
    }

    if (selectedOuterwear) {
      const outerwearMesh = createGarmentGroup(selectedOuterwear.category, selectedOuterwear.selectedColor, proportions);
      garmentsGroup.add(outerwearMesh);
    }
  }, [selectedTop, selectedBottom, selectedOuterwear, avatarConfig]);

  // View angle preset handlers
  const handleViewPreset = (view: 'front' | 'side' | 'back') => {
    setCameraView(view);
    setAutoRotate(false);
    if (view === 'front') {
      orbitState.current.targetTheta = 0;
      orbitState.current.targetPhi = 1.5;
    } else if (view === 'side') {
      orbitState.current.targetTheta = Math.PI / 2;
      orbitState.current.targetPhi = 1.5;
    } else if (view === 'back') {
      orbitState.current.targetTheta = Math.PI;
      orbitState.current.targetPhi = 1.5;
    }
  };

  const handleZoom = (factor: number) => {
    const newDist = Math.max(1.8, Math.min(5.0, orbitState.current.targetDistance * factor));
    orbitState.current.targetDistance = newDist;
    setZoomLevel(Math.round((3.2 / newDist) * 100) / 100);
  };

  const resetView = () => {
    orbitState.current.targetTheta = 0;
    orbitState.current.targetPhi = 1.5;
    orbitState.current.targetDistance = 3.2;
    setCameraView('front');
    setZoomLevel(1);
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-[#F5F7FC] border border-[#E4E9F2] shadow-sm select-none"
      style={{ height }}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing ${isDragging ? 'cursor-grabbing' : ''}`}
        title="Click and drag to rotate 3D avatar"
      />

      {/* Top Spec / Angle Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E4E9F2] shadow-xs text-xs font-medium text-[#101C3A] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3569FF]" />
          <span>Interactive 3D Body Model</span>
          <span className="text-[#66738D]">·</span>
          <span className="capitalize text-[#66738D]">{cameraView} View</span>
        </div>
      </div>

      {/* Top-Right Quick Reset */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-lg text-xs font-medium transition-colors border shadow-xs ${
            autoRotate
              ? 'bg-[#3569FF] text-white border-[#3569FF]'
              : 'bg-white/90 text-[#15213D] border-[#E4E9F2] hover:bg-slate-50'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={resetView}
          className="p-2 rounded-lg text-xs font-medium bg-white/90 text-[#15213D] border border-[#E4E9F2] hover:bg-slate-50 shadow-xs"
          title="Reset Camera View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Ergonomic Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pointer-events-auto transition-transform duration-300">
          <div className="bg-white/95 backdrop-blur-md border border-[#E4E9F2] rounded-xl shadow-lg p-2.5">
            {/* Dock Header with Collapse toggle */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F1F4F9] text-xs">
              <span className="font-semibold text-[#101C3A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3569FF]" />
                Perspective & Camera Controls
              </span>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-[#66738D] hover:text-[#101C3A] flex items-center gap-1 text-[11px]"
              >
                {isCollapsed ? (
                  <>
                    <span>Show Dock</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Hide</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {!isCollapsed && (
              <div className="flex items-center justify-between gap-3">
                {/* View Angle Presets */}
                <div className="flex items-center gap-1 bg-[#F5F7FC] p-1 rounded-lg">
                  <button
                    onClick={() => handleViewPreset('front')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      cameraView === 'front'
                        ? 'bg-white text-[#101C3A] shadow-xs'
                        : 'text-[#66738D] hover:text-[#101C3A]'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => handleViewPreset('side')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      cameraView === 'side'
                        ? 'bg-white text-[#101C3A] shadow-xs'
                        : 'text-[#66738D] hover:text-[#101C3A]'
                    }`}
                  >
                    Side
                  </button>
                  <button
                    onClick={() => handleViewPreset('back')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      cameraView === 'back'
                        ? 'bg-white text-[#101C3A] shadow-xs'
                        : 'text-[#66738D] hover:text-[#101C3A]'
                    }`}
                  >
                    Back
                  </button>
                </div>

                {/* Zoom Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleZoom(0.85)}
                    className="p-1.5 text-xs text-[#101C3A] bg-[#F5F7FC] hover:bg-[#E4E9F2] rounded-md transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-[#66738D] w-10 text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => handleZoom(1.15)}
                    className="p-1.5 text-xs text-[#101C3A] bg-[#F5F7FC] hover:bg-[#E4E9F2] rounded-md transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
