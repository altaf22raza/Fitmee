import * as THREE from 'three';
import { ClothingCategory } from '../../types';

// Cache procedural canvas fabric textures
let _fabricTextureCache: Record<string, THREE.CanvasTexture> = {};

export function createProceduralFabricTexture(type: 'cotton' | 'denim' | 'linen' | 'wool' | 'silk'): THREE.CanvasTexture {
  if (_fabricTextureCache[type]) {
    return _fabricTextureCache[type];
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;

    if (type === 'denim') {
      // Diagonal twill weave pattern
      for (let i = -256; i < 512; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 256, 256);
        ctx.stroke();
      }
    } else if (type === 'linen') {
      // Slub cross weave
      for (let x = 0; x < 256; x += 6) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 256);
        ctx.stroke();
      }
      for (let y = 0; y < 256; y += 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }
    } else if (type === 'wool') {
      // Knitted micro-dots
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      for (let x = 0; x < 256; x += 4) {
        for (let y = 0; y < 256; y += 4) {
          if ((x + y) % 8 === 0) {
            ctx.fillRect(x, y, 2, 2);
          }
        }
      }
    } else {
      // Cotton fine weave
      for (let i = 0; i < 256; i += 3) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 256);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  _fabricTextureCache[type] = texture;
  return texture;
}

export function createGarmentGroup(
  category: ClothingCategory,
  colorHex: string,
  proportions: {
    chestScale: number;
    waistScale: number;
    hipScale: number;
    shoulderRatio: number;
  }
): THREE.Group {
  const group = new THREE.Group();
  group.name = `garment_${category}`;

  const fabricTexture = createProceduralFabricTexture(
    category === 'jeans' ? 'denim' : category === 'jackets' || category === 'formal' ? 'wool' : 'cotton'
  );

  const garmentMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness: category === 'formal' ? 0.35 : 0.65,
    metalness: 0.05,
    bumpMap: fabricTexture,
    bumpScale: 0.015,
    side: THREE.DoubleSide
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex).multiplyScalar(0.85),
    roughness: 0.7,
    metalness: 0.1
  });

  const metalButtonMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xd4af37), // Subtle brass / horn button
    metalness: 0.85,
    roughness: 0.2
  });

  const { chestScale, waistScale, hipScale, shoulderRatio } = proportions;

  switch (category) {
    case 't-shirts': {
      // Torso main body
      const torsoGeo = new THREE.CylinderGeometry(
        0.28 * chestScale * shoulderRatio,
        0.26 * waistScale,
        0.58,
        32
      );
      const torso = new THREE.Mesh(torsoGeo, garmentMaterial);
      torso.position.y = 1.05;
      torso.castShadow = true;
      group.add(torso);

      // Ribbed crewneck collar
      const collarGeo = new THREE.TorusGeometry(0.12 * shoulderRatio, 0.02, 16, 32);
      collarGeo.rotateX(Math.PI / 2);
      const collar = new THREE.Mesh(collarGeo, accentMaterial);
      collar.position.y = 1.34;
      group.add(collar);

      // Short Sleeves
      [-1, 1].forEach((side) => {
        const sleeveGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.24, 24);
        const sleeve = new THREE.Mesh(sleeveGeo, garmentMaterial);
        sleeve.position.set(side * 0.31 * shoulderRatio, 1.22, 0);
        sleeve.rotation.z = side * -0.55;
        group.add(sleeve);

        // Sleeve cuff rim
        const cuffGeo = new THREE.TorusGeometry(0.085, 0.012, 12, 24);
        cuffGeo.rotateX(Math.PI / 2);
        const cuff = new THREE.Mesh(cuffGeo, accentMaterial);
        cuff.position.set(side * 0.37 * shoulderRatio, 1.13, 0);
        cuff.rotation.z = side * -0.55;
        group.add(cuff);
      });
      break;
    }

    case 'shirts': {
      // Tailored shirt torso
      const shirtGeo = new THREE.CylinderGeometry(
        0.29 * chestScale * shoulderRatio,
        0.27 * waistScale,
        0.65,
        32
      );
      const shirt = new THREE.Mesh(shirtGeo, garmentMaterial);
      shirt.position.y = 1.02;
      shirt.castShadow = true;
      group.add(shirt);

      // Folded dress shirt collar
      const collarGeo = new THREE.ConeGeometry(0.14 * shoulderRatio, 0.09, 32, 1, true);
      collarGeo.rotateX(Math.PI);
      const collar = new THREE.Mesh(collarGeo, accentMaterial);
      collar.position.y = 1.35;
      group.add(collar);

      // Vertical button placket strip
      const placketGeo = new THREE.BoxGeometry(0.035, 0.65, 0.01);
      const placket = new THREE.Mesh(placketGeo, accentMaterial);
      placket.position.set(0, 1.02, 0.28 * chestScale);
      group.add(placket);

      // Placket buttons
      for (let b = 0; b < 5; b++) {
        const btnGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.004, 16);
        btnGeo.rotateX(Math.PI / 2);
        const btn = new THREE.Mesh(btnGeo, metalButtonMaterial);
        btn.position.set(0, 1.25 - b * 0.11, 0.285 * chestScale);
        group.add(btn);
      }

      // Long sleeves with cuffs
      [-1, 1].forEach((side) => {
        const sleeveGeo = new THREE.CylinderGeometry(0.09, 0.065, 0.52, 24);
        const sleeve = new THREE.Mesh(sleeveGeo, garmentMaterial);
        sleeve.position.set(side * 0.33 * shoulderRatio, 1.06, 0);
        sleeve.rotation.z = side * -0.25;
        group.add(sleeve);

        // Wrist cuff
        const cuffGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.06, 24);
        const cuff = new THREE.Mesh(cuffGeo, accentMaterial);
        cuff.position.set(side * 0.39 * shoulderRatio, 0.81, 0);
        cuff.rotation.z = side * -0.25;
        group.add(cuff);
      });
      break;
    }

    case 'jackets':
    case 'formal': {
      // Structured suit jacket / blazer torso
      const jacketGeo = new THREE.CylinderGeometry(
        0.31 * chestScale * shoulderRatio,
        0.30 * waistScale,
        0.72,
        32
      );
      const jacket = new THREE.Mesh(jacketGeo, garmentMaterial);
      jacket.position.y = 0.98;
      jacket.castShadow = true;
      group.add(jacket);

      // Notch lapels
      [-1, 1].forEach((side) => {
        const lapelGeo = new THREE.BoxGeometry(0.08 * shoulderRatio, 0.34, 0.02);
        const lapel = new THREE.Mesh(lapelGeo, accentMaterial);
        lapel.position.set(side * 0.11 * shoulderRatio, 1.20, 0.29 * chestScale);
        lapel.rotation.z = side * -0.22;
        group.add(lapel);
      });

      // Front welt pockets
      [-1, 1].forEach((side) => {
        const pocketGeo = new THREE.BoxGeometry(0.09, 0.015, 0.01);
        const pocket = new THREE.Mesh(pocketGeo, accentMaterial);
        pocket.position.set(side * 0.15, 0.82, 0.29 * waistScale);
        group.add(pocket);
      });

      // Formal horn buttons
      for (let b = 0; b < 2; b++) {
        const btnGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.006, 16);
        btnGeo.rotateX(Math.PI / 2);
        const btn = new THREE.Mesh(btnGeo, metalButtonMaterial);
        btn.position.set(0.01, 1.02 - b * 0.14, 0.305 * chestScale);
        group.add(btn);
      }

      // Structured sleeves with shoulder pads
      [-1, 1].forEach((side) => {
        const shoulderPadGeo = new THREE.SphereGeometry(0.11, 16, 16);
        shoulderPadGeo.scale(1, 0.6, 1);
        const pad = new THREE.Mesh(shoulderPadGeo, garmentMaterial);
        pad.position.set(side * 0.35 * shoulderRatio, 1.30, 0);
        group.add(pad);

        const sleeveGeo = new THREE.CylinderGeometry(0.095, 0.075, 0.54, 24);
        const sleeve = new THREE.Mesh(sleeveGeo, garmentMaterial);
        sleeve.position.set(side * 0.35 * shoulderRatio, 1.04, 0);
        sleeve.rotation.z = side * -0.22;
        group.add(sleeve);
      });
      break;
    }

    case 'hoodies': {
      // Relaxed hoodie torso
      const hoodieGeo = new THREE.CylinderGeometry(
        0.32 * chestScale * shoulderRatio,
        0.30 * waistScale,
        0.66,
        32
      );
      const hoodie = new THREE.Mesh(hoodieGeo, garmentMaterial);
      hoodie.position.y = 1.02;
      group.add(hoodie);

      // Kangaroo pouch pocket
      const pouchGeo = new THREE.BoxGeometry(0.24 * waistScale, 0.18, 0.04);
      const pouch = new THREE.Mesh(pouchGeo, accentMaterial);
      pouch.position.set(0, 0.86, 0.29 * waistScale);
      group.add(pouch);

      // Relaxed hood behind the neck
      const hoodGeo = new THREE.SphereGeometry(0.18, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7);
      const hood = new THREE.Mesh(hoodGeo, garmentMaterial);
      hood.position.set(0, 1.32, -0.08);
      hood.rotation.x = 0.4;
      group.add(hood);

      // Ribbed bottom hem
      const hemGeo = new THREE.CylinderGeometry(0.28 * waistScale, 0.28 * waistScale, 0.08, 32);
      const hem = new THREE.Mesh(hemGeo, accentMaterial);
      hem.position.y = 0.67;
      group.add(hem);

      // Relaxed dropped-shoulder sleeves
      [-1, 1].forEach((side) => {
        const sleeveGeo = new THREE.CylinderGeometry(0.11, 0.08, 0.53, 24);
        const sleeve = new THREE.Mesh(sleeveGeo, garmentMaterial);
        sleeve.position.set(side * 0.36 * shoulderRatio, 1.04, 0);
        sleeve.rotation.z = side * -0.28;
        group.add(sleeve);

        // Ribbed sleeve cuffs
        const cuffGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.07, 24);
        const cuff = new THREE.Mesh(cuffGeo, accentMaterial);
        cuff.position.set(side * 0.42 * shoulderRatio, 0.79, 0);
        cuff.rotation.z = side * -0.28;
        group.add(cuff);
      });
      break;
    }

    case 'jeans':
    case 'trousers': {
      // Pelvis / waist band
      const waistGeo = new THREE.CylinderGeometry(
        0.27 * waistScale,
        0.29 * hipScale,
        0.24,
        32
      );
      const waist = new THREE.Mesh(waistGeo, garmentMaterial);
      waist.position.y = 0.76;
      group.add(waist);

      // Belt loops
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const loopGeo = new THREE.BoxGeometry(0.015, 0.06, 0.01);
        const loop = new THREE.Mesh(loopGeo, accentMaterial);
        loop.position.set(
          Math.sin(angle) * 0.275 * waistScale,
          0.84,
          Math.cos(angle) * 0.275 * waistScale
        );
        loop.rotation.y = angle;
        group.add(loop);
      }

      // Back patch if jeans
      if (category === 'jeans') {
        const patchGeo = new THREE.BoxGeometry(0.08, 0.04, 0.005);
        const patchMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 }); // leather patch
        const patch = new THREE.Mesh(patchGeo, patchMat);
        patch.position.set(0.14 * waistScale, 0.85, -0.27 * waistScale);
        group.add(patch);
      }

      // Left & Right trouser legs
      [-1, 1].forEach((side) => {
        // Upper thigh
        const upperLegGeo = new THREE.CylinderGeometry(0.13 * hipScale, 0.10, 0.42, 24);
        const upperLeg = new THREE.Mesh(upperLegGeo, garmentMaterial);
        upperLeg.position.set(side * 0.13, 0.46, 0);
        group.add(upperLeg);

        // Lower shin / calf
        const lowerLegGeo = new THREE.CylinderGeometry(0.10, 0.085, 0.42, 24);
        const lowerLeg = new THREE.Mesh(lowerLegGeo, garmentMaterial);
        lowerLeg.position.set(side * 0.13, 0.12, 0);
        group.add(lowerLeg);

        // Leg hem cuff
        const hemGeo = new THREE.TorusGeometry(0.088, 0.01, 12, 24);
        hemGeo.rotateX(Math.PI / 2);
        const hem = new THREE.Mesh(hemGeo, accentMaterial);
        hem.position.set(side * 0.13, -0.09, 0);
        group.add(hem);
      });
      break;
    }

    case 'dresses': {
      // Elegant A-line dress
      const bodiceGeo = new THREE.CylinderGeometry(
        0.28 * chestScale * shoulderRatio,
        0.24 * waistScale,
        0.48,
        32
      );
      const bodice = new THREE.Mesh(bodiceGeo, garmentMaterial);
      bodice.position.y = 1.08;
      group.add(bodice);

      // Flared flowy skirt
      const skirtGeo = new THREE.ConeGeometry(0.48 * hipScale, 0.72, 32, 1, true);
      skirtGeo.rotateX(Math.PI);
      const skirt = new THREE.Mesh(skirtGeo, garmentMaterial);
      skirt.position.y = 0.48;
      group.add(skirt);

      // Waist sash belt
      const sashGeo = new THREE.CylinderGeometry(0.245 * waistScale, 0.245 * waistScale, 0.05, 32);
      const sash = new THREE.Mesh(sashGeo, accentMaterial);
      sash.position.y = 0.84;
      group.add(sash);
      break;
    }

    case 'traditional': {
      // Elegant tailored tunic / Kurta with mandarin collar
      const kurtaGeo = new THREE.CylinderGeometry(
        0.29 * chestScale * shoulderRatio,
        0.33 * hipScale,
        0.88,
        32
      );
      const kurta = new THREE.Mesh(kurtaGeo, garmentMaterial);
      kurta.position.y = 0.88;
      group.add(kurta);

      // Mandarin standing collar
      const mandarinGeo = new THREE.CylinderGeometry(0.11 * shoulderRatio, 0.12 * shoulderRatio, 0.04, 32, 1, true);
      const collar = new THREE.Mesh(mandarinGeo, accentMaterial);
      collar.position.y = 1.34;
      group.add(collar);

      // Front embroidered placket
      const placketGeo = new THREE.BoxGeometry(0.04, 0.38, 0.01);
      const placket = new THREE.Mesh(placketGeo, accentMaterial);
      placket.position.set(0, 1.14, 0.295 * chestScale);
      group.add(placket);

      // Sleeves
      [-1, 1].forEach((side) => {
        const sleeveGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.52, 24);
        const sleeve = new THREE.Mesh(sleeveGeo, garmentMaterial);
        sleeve.position.set(side * 0.33 * shoulderRatio, 1.06, 0);
        sleeve.rotation.z = side * -0.24;
        group.add(sleeve);
      });
      break;
    }
  }

  return group;
}
