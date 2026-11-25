"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Nada, Laras } from "@/types/instrumen";
import { KeyboardHint } from "./KeyboardHint";
import { updateResponsivePerspectiveCamera } from "@/lib/three/responsiveCamera";

interface Bonang3DPadProps {
  laras: Laras;
  daftarNada: Nada[];
  activeKeyId?: string | null;
  targetLearnNote?: string | null;
  wrongFeedbackNote?: string | null;
  onPlay: (nada: Nada) => void;
}

// =============================================================================
// TEKSTUR PROSEDURAL REALISTIS (PERUNGGU/GANGSA EMAS, KAYU JATI, & UKIRAN)
// =============================================================================

/** Tekstur Perunggu Gangsa dengan guratan serat kuas metalik halus */
function createBronzeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Latar gradasi perunggu hangat berkilau
  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
  grad.addColorStop(0, "#f7df9e");
  grad.addColorStop(0.25, "#d6a953");
  grad.addColorStop(0.65, "#a8782a");
  grad.addColorStop(1, "#5a3a0e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Guratan melingkar bubut tempa tradisional (circular lathed micro-grooves)
  ctx.strokeStyle = "rgba(255, 245, 220, 0.09)";
  ctx.lineWidth = 1.2;
  for (let r = 20; r < 256; r += 4) {
    ctx.beginPath();
    ctx.arc(256, 256, r + (Math.random() - 0.5) * 1.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Bintik mikro tembaga & timah alami
  ctx.fillStyle = "rgba(70, 40, 10, 0.05)";
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const s = Math.random() * 2 + 0.5;
    ctx.fillRect(x, y, s, s);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Tekstur Kayu Jati Tua (Rancakan Kotak Gamelan) */
function createTeakWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dasar cokelat kayu jati berpelitur tua
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, "#2b160b");
  grad.addColorStop(0.25, "#3b1e0f");
  grad.addColorStop(0.5, "#4a2815");
  grad.addColorStop(0.75, "#331a0d");
  grad.addColorStop(1, "#261309");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Serat kayu alami horizontal
  for (let y = 0; y < 512; y += 3) {
    const alpha = (Math.sin(y * 0.12) + Math.cos(y * 0.05)) * 0.08 + 0.12;
    ctx.fillStyle = `rgba(18, 8, 4, ${Math.max(0.04, alpha)})`;
    ctx.fillRect(0, y, 512, 2.5);
  }

  // Kilau pernis kayu
  const varnish = ctx.createLinearGradient(0, 0, 0, 512);
  varnish.addColorStop(0, "rgba(212, 175, 55, 0.08)");
  varnish.addColorStop(0.5, "rgba(255, 255, 255, 0.04)");
  varnish.addColorStop(1, "rgba(0, 0, 0, 0.25)");
  ctx.fillStyle = varnish;
  ctx.fillRect(0, 0, 512, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Tekstur Ukiran Klasik Jawa (Relief Lung-lungan Berwarna Emas Prada) */
function createCarvingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Latar kayu jati pekat
  ctx.fillStyle = "#221208";
  ctx.fillRect(0, 0, 512, 128);

  // Garis tepi bingkai ukir emas
  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, 500, 116);
  ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(12, 12, 488, 104);

  // Motif sulur gelombang bunga ukiran Jawa
  ctx.strokeStyle = "#e8c558";
  ctx.fillStyle = "rgba(212, 175, 55, 0.85)";
  ctx.lineWidth = 2.5;

  for (let x = 32; x < 500; x += 64) {
    // Daun sulur atas
    ctx.beginPath();
    ctx.arc(x, 44, 18, 0, Math.PI, false);
    ctx.stroke();

    // Daun sulur bawah
    ctx.beginPath();
    ctx.arc(x + 32, 84, 18, Math.PI, 0, false);
    ctx.stroke();

    // Bunga kuncup pusat
    ctx.beginPath();
    ctx.arc(x + 16, 64, 7, 0, Math.PI * 2);
    ctx.fill();

    // Titik aksen
    ctx.fillStyle = "#fff4bd";
    ctx.beginPath();
    ctx.arc(x + 16, 64, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(212, 175, 55, 0.85)";
  }

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/** Geometri Pencon Bonang Otentik Jawa menggunakan Lathe (Profil Cembung & Pencu Tengah) */
function createPenconGeometry(radius: number, height: number): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const rRim = radius * 0.92;
  const rBelly = radius * 1.0;
  const rShoulder = radius * 0.88;
  const rPencuBase = radius * 0.32;
  const hKettle = height * 0.68;
  const hPencu = height * 0.42;

  // 1. Bibir bawah bagian dalam (lubang resonator bawah)
  points.push(new THREE.Vector2(rRim * 0.84, 0));
  // 2. Bibir bawah bagian luar
  points.push(new THREE.Vector2(rRim, 0.015));
  // 3. Dinding cembung melengkung ke luar (dhadha/bau pencon)
  points.push(new THREE.Vector2(rBelly, hKettle * 0.45));
  // 4. Bahu atas (rai)
  points.push(new THREE.Vector2(rShoulder, hKettle));
  // 5. Permukaan datar menuju poros pencu
  points.push(new THREE.Vector2(rPencuBase, hKettle));
  // 6. Tonjolan bundar poros tengah (pencu / knob)
  const segments = 10;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * (Math.PI / 2);
    const px = Math.cos(angle) * rPencuBase;
    const py = hKettle + Math.sin(angle) * hPencu;
    points.push(new THREE.Vector2(px, py));
  }

  const geo = new THREE.LatheGeometry(points, 32);
  geo.computeVertexNormals();
  return geo;
}

export const Bonang3DPad: React.FC<Bonang3DPadProps> = ({
  laras,
  daftarNada,
  activeKeyId,
  targetLearnNote,
  wrongFeedbackNote,
  onPlay,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [activeKeyString, setActiveKeyString] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLandscapeHint, setShowLandscapeHint] = useState(true);

  // Trigger visual aksi pencon 3D tanpa me-reset kamera Three.js
  const trigger3DVisualRef = useRef<((key: string) => void) | null>(null);

  // Ref stabil agar listener Three.js selalu memegang nilai terbaru tanpa re-mount
  const onPlayRef = useRef(onPlay);
  useEffect(() => {
    onPlayRef.current = onPlay;
  }, [onPlay]);

  const daftarNadaRef = useRef(daftarNada);
  useEffect(() => {
    daftarNadaRef.current = daftarNada;
  }, [daftarNada]);

  const targetLearnNoteRef = useRef(targetLearnNote);
  useEffect(() => {
    targetLearnNoteRef.current = targetLearnNote;
  }, [targetLearnNote]);

  const wrongFeedbackNoteRef = useRef(wrongFeedbackNote);
  useEffect(() => {
    wrongFeedbackNoteRef.current = wrongFeedbackNote;
  }, [wrongFeedbackNote]);

  // Tangani input keyboard atau event luar
  useEffect(() => {
    if (activeKeyId && trigger3DVisualRef.current) {
      trigger3DVisualRef.current(activeKeyId.toLowerCase());
    }
  }, [activeKeyId]);

  // Pantau status fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!panelRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await panelRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen toggle error:", err);
    }
  };

  // =========================================================================
  // INISIALISASI THREE.JS SCENE BONANG (DUA BARIS PENCON LENGKAP & OTENTIK)
  // =========================================================================
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // 1. SCENE, KAMERA & RENDERER
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    updateResponsivePerspectiveCamera(
      camera,
      container.clientWidth,
      container.clientHeight,
      40,
      1.7
    );
    // Posisi kamera: Sudut pandang pemain bonang (melihat kedua baris pencon dari depan atas)
    camera.position.set(0, 2.1, 2.6);
    camera.lookAt(0, -0.05, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. ORBIT CONTROLS (360 DERAJAT ROTASI BEBAS)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.8;
    controls.maxDistance = 5.2;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minPolarAngle = Math.PI / 10;
    controls.target.set(0, 0, 0);

    // 3. TATA CAHAYA PANGGUNG REALISTIS
    const ambientLight = new THREE.AmbientLight(0xffeedb, 1.3);
    scene.add(ambientLight);

    // Key Light spotlight atas mengarah ke kedua deretan pencon
    const keySpot = new THREE.SpotLight(0xfffaed, 2.9);
    keySpot.position.set(1.5, 4.8, 2.0);
    keySpot.angle = Math.PI / 3.6;
    keySpot.penumbra = 0.6;
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    scene.add(keySpot);

    // Fill Light lembut keemasan dari depan kiri
    const fillLight = new THREE.DirectionalLight(0xd4af37, 1.15);
    fillLight.position.set(-3.0, 2.8, 2.2);
    scene.add(fillLight);

    // Rim Light hangat dari belakang agar lekukan pencon berkilau
    const rimLight = new THREE.DirectionalLight(0xff9933, 0.95);
    rimLight.position.set(0, 2.0, -3.0);
    scene.add(rimLight);

    // 4. LANTAI PANGGUNG BAYANGAN
    const shadowPlaneGeo = new THREE.PlaneGeometry(6.5, 6.5);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.52;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 5. TEKSTUR & MATERIAL BERSAMA
    const bronzeTexture = createBronzeTexture();
    const woodTexture = createTeakWoodTexture();
    const carvingTexture = createCarvingTexture();

    const woodMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.5,
      metalness: 0.12,
    });

    const carvingMat = new THREE.MeshStandardMaterial({
      map: carvingTexture,
      roughness: 0.4,
      metalness: 0.35,
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xdfb46c,
      roughness: 0.28,
      metalness: 0.88,
    });

    const cordMat = new THREE.MeshStandardMaterial({
      color: 0x1f1710, // Tali pluntur tebal gelap
      roughness: 0.95,
      metalness: 0.05,
    });

    // Lampu Kilat Sentuhan Emas (Impact Flash Point Light)
    const impactFlash = new THREE.PointLight(0xffea88, 0, 2.6);
    scene.add(impactFlash);

    // =========================================================================
    // 6. MEMBANGUN RANCAKAN (RANGKA KAYU JATI DUA BARIS DENGAN TALI PLUNTUR)
    // =========================================================================
    const bonangGroup = new THREE.Group();
    scene.add(bonangGroup);

    // Dimensi keseluruhan rancakan Bonang
    const rWidth = 2.44;
    const rDepth = 1.05;
    const rHeight = 0.38;
    const frameY = -0.16;
    const wallThick = 0.06;

    // A. Dinding Depan & Belakang Rangka Berukir
    const wallFrontGeo = new THREE.BoxGeometry(rWidth, rHeight, wallThick);
    const wallFront = new THREE.Mesh(wallFrontGeo, woodMat);
    wallFront.position.set(0, frameY, rDepth / 2 - wallThick / 2);
    wallFront.castShadow = true;
    wallFront.receiveShadow = true;
    bonangGroup.add(wallFront);

    // Panel Ukir Depan (Plakat ukiran lung-lungan emas)
    const plaqueGeo = new THREE.PlaneGeometry(rWidth * 0.88, rHeight * 0.52);
    const plaqueFront = new THREE.Mesh(plaqueGeo, carvingMat);
    plaqueFront.position.set(0, frameY, rDepth / 2 + 0.002);
    bonangGroup.add(plaqueFront);

    // Dinding Belakang
    const wallBack = new THREE.Mesh(wallFrontGeo, woodMat);
    wallBack.position.set(0, frameY, -rDepth / 2 + wallThick / 2);
    wallBack.castShadow = true;
    wallBack.receiveShadow = true;
    bonangGroup.add(wallBack);

    // Panel Ukir Belakang
    const plaqueBack = new THREE.Mesh(plaqueGeo, carvingMat);
    plaqueBack.position.set(0, frameY, -rDepth / 2 - 0.002);
    plaqueBack.rotation.y = Math.PI;
    bonangGroup.add(plaqueBack);

    // Dasar Rongga Bawah Rangka
    const floorGeo = new THREE.BoxGeometry(rWidth, 0.035, rDepth);
    const floorMesh = new THREE.Mesh(floorGeo, woodMat);
    floorMesh.position.set(0, frameY - rHeight / 2 + 0.02, 0);
    floorMesh.receiveShadow = true;
    bonangGroup.add(floorMesh);

    // B. Papan Sisi Kiri & Kanan (Tebokan Kepala Rancakan)
    const createEndCap = (isLeft: boolean) => {
      const capGroup = new THREE.Group();
      const capWidth = wallThick * 1.5;
      const capDepth = rDepth + 0.06;
      const capHeight = rHeight + 0.14;

      const capGeo = new THREE.BoxGeometry(capWidth, capHeight, capDepth);
      const capMesh = new THREE.Mesh(capGeo, woodMat);
      capMesh.castShadow = true;
      capMesh.receiveShadow = true;
      capGroup.add(capMesh);

      // Puncak mahkota melengkung (Top arch)
      const archGeo = new THREE.CylinderGeometry(capDepth * 0.48, capDepth * 0.48, capWidth, 24);
      archGeo.rotateZ(Math.PI / 2);
      const archMesh = new THREE.Mesh(archGeo, woodMat);
      archMesh.position.set(0, capHeight / 2, 0);
      archMesh.castShadow = true;
      capGroup.add(archMesh);

      // Aksen ornamen cincin emas
      const sideTrimGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
      sideTrimGeo.rotateZ(Math.PI / 2);
      const sideTrim = new THREE.Mesh(sideTrimGeo, goldTrimMat);
      sideTrim.position.set(isLeft ? -capWidth / 2 - 0.01 : capWidth / 2 + 0.01, 0.08, 0);
      capGroup.add(sideTrim);

      capGroup.position.set(
        isLeft ? -rWidth / 2 - capWidth / 2 : rWidth / 2 + capWidth / 2,
        frameY + 0.04,
        0
      );
      return capGroup;
    };

    bonangGroup.add(createEndCap(true));
    bonangGroup.add(createEndCap(false));

    // C. Kaki-kaki Penyangga Kokoh Berukir (Sikilan 4 Sudut)
    const legPositions = [
      [-rWidth / 2 + 0.22, frameY - rHeight / 2 - 0.07, rDepth / 2 - 0.1],
      [rWidth / 2 - 0.22, frameY - rHeight / 2 - 0.07, rDepth / 2 - 0.1],
      [-rWidth / 2 + 0.22, frameY - rHeight / 2 - 0.07, -rDepth / 2 + 0.1],
      [rWidth / 2 - 0.22, frameY - rHeight / 2 - 0.07, -rDepth / 2 + 0.1],
    ];

    legPositions.forEach(([lx, ly, lz]) => {
      const legGroup = new THREE.Group();
      const legBaseGeo = new THREE.BoxGeometry(0.18, 0.08, 0.18);
      const legBase = new THREE.Mesh(legBaseGeo, woodMat);
      legBase.castShadow = true;
      legGroup.add(legBase);

      const legColGeo = new THREE.CylinderGeometry(0.065, 0.09, 0.12, 16);
      const legCol = new THREE.Mesh(legColGeo, woodMat);
      legCol.position.y = 0.08;
      legCol.castShadow = true;
      legGroup.add(legCol);

      const legRingGeo = new THREE.TorusGeometry(0.08, 0.015, 12, 24);
      legRingGeo.rotateX(Math.PI / 2);
      const legRing = new THREE.Mesh(legRingGeo, goldTrimMat);
      legRing.position.y = 0.08;
      legGroup.add(legRing);

      legGroup.position.set(lx, ly, lz);
      bonangGroup.add(legGroup);
    });

    // D. Sekat Pemisah Tengah Antara Baris 1 & Baris 2
    const centerDividerGeo = new THREE.BoxGeometry(rWidth * 0.94, 0.04, 0.05);
    const centerDivider = new THREE.Mesh(centerDividerGeo, woodMat);
    centerDivider.position.set(0, frameY + rHeight / 2 - 0.02, 0);
    centerDivider.castShadow = true;
    bonangGroup.add(centerDivider);

    // E. Bentangan Tali Pluntur (Cords grid tempat pencon bertengger)
    const cordZ1 = -rDepth * 0.23; // Baris atas (nada tinggi)
    const cordZ2 = rDepth * 0.23;  // Baris bawah (nada rendah)

    // Tali memanjang horizontal baris 1 & 2
    [-0.07, 0.07].forEach((off) => {
      const cordGeo = new THREE.CylinderGeometry(0.005, 0.005, rWidth * 0.94, 8);
      cordGeo.rotateZ(Math.PI / 2);

      const c1 = new THREE.Mesh(cordGeo, cordMat);
      c1.position.set(0, frameY + rHeight / 2 + 0.01, cordZ1 + off);
      bonangGroup.add(c1);

      const c2 = new THREE.Mesh(cordGeo, cordMat);
      c2.position.set(0, frameY + rHeight / 2 + 0.01, cordZ2 + off);
      bonangGroup.add(c2);
    });

    // =========================================================================
    // 7. MEMBANGUN DUA DERETAN PENCON BONANG (INTERAKTIF & AKURAT)
    // =========================================================================
    const penconGroup = new THREE.Group();
    bonangGroup.add(penconGroup);

    interface PenconData {
      mesh: THREE.Mesh;
      floatingTorus: THREE.Mesh;
      baseY: number;
      nadaSymbol: string;
      label: string;
      key: string;
      baris: number;
      vibe: { intensity: number; decay: number };
      waveTime: number;
      originalColor: number;
    }

    const penconRecords: PenconData[] = [];
    const interactiveMeshes: THREE.Mesh[] = [];

    const buildPenconSet = () => {
      // Hapus pencon lama jika ada
      while (penconGroup.children.length > 0) {
        const obj = penconGroup.children[0];
        penconGroup.remove(obj);
      }
      penconRecords.length = 0;
      interactiveMeshes.length = 0;

      const currentNadaList = daftarNadaRef.current;
      if (currentNadaList.length === 0) return;

      const row1Items = currentNadaList.filter((n) => n.baris === 1);
      const row2Items = currentNadaList.filter((n) => n.baris === 2);

      const countPerRow = Math.max(row1Items.length, row2Items.length);
      const totalSpan = rWidth * 0.88;
      const stepX = totalSpan / countPerRow;
      const startX = -totalSpan / 2 + stepX / 2;

      const bronzeMat = new THREE.MeshStandardMaterial({
        map: bronzeTexture,
        color: 0xdfb46c,
        roughness: 0.28,
        metalness: 0.92,
        emissive: 0x000000,
        emissiveIntensity: 0.0,
      });

      // Fungsi per baris
      const populateRow = (items: Nada[], rowZ: number, isHighRow: boolean) => {
        items.forEach((item, idx) => {
          // Gradasi ukuran pencon: nada rendah sedikit lebih besar dari nada tinggi
          const prog = idx / Math.max(1, items.length - 1);
          const baseRadius = isHighRow
            ? 0.11 - prog * 0.018 // Baris atas (nada tinggi)
            : 0.125 - prog * 0.022; // Baris bawah (nada rendah)
          const baseHeight = isHighRow ? 0.09 : 0.105;

          const penconGeo = createPenconGeometry(baseRadius, baseHeight);
          // Klon material agar emissive flash bilah independen
          const penconMat = bronzeMat.clone();

          const penconMesh = new THREE.Mesh(penconGeo, penconMat);
          const posX = startX + idx * stepX;
          const posY = frameY + rHeight / 2 + 0.01;
          const posZ = rowZ;

          penconMesh.position.set(posX, posY, posZ);
          penconMesh.castShadow = true;
          penconMesh.receiveShadow = true;

          penconMesh.userData = {
            nadaSymbol: item.nada,
            label: item.label,
            key: item.key.toLowerCase(),
            baris: item.baris,
          };

          penconGroup.add(penconMesh);
          interactiveMeshes.push(penconMesh);

          // Cincin Sonic Torus Kuning Emas Mengambang ke Udara (Floating Halo Wave)
          const torusGeo = new THREE.TorusGeometry(baseRadius * 0.85, 0.012, 12, 28);
          torusGeo.rotateX(Math.PI / 2);
          const torusMat = new THREE.MeshBasicMaterial({
            color: 0xffd700, // Warna kuning emas murni karawitan
            transparent: true,
            opacity: 0,
          });
          const floatingTorus = new THREE.Mesh(torusGeo, torusMat);
          floatingTorus.position.set(posX, posY + baseHeight + 0.01, posZ);
          penconGroup.add(floatingTorus);

          penconRecords.push({
            mesh: penconMesh,
            floatingTorus,
            baseY: posY,
            nadaSymbol: item.nada,
            label: item.label,
            key: item.key.toLowerCase(),
            baris: item.baris || (isHighRow ? 1 : 2),
            vibe: { intensity: 0, decay: 0.86 },
            waveTime: 0,
            originalColor: 0xdfb46c,
          });
        });
      };

      // Buat Baris 1 (Belakang - Nada Tinggi) & Baris 2 (Depan - Nada Rendah)
      populateRow(row1Items, cordZ1, true);
      populateRow(row2Items, cordZ2, false);
    };

    buildPenconSet();

    // =========================================================================
    // 8. LOGIKA VISUAL KETUKAN: KILATAN EMAS, GETARAN & GELOMBANG KUNING
    // =========================================================================
    const triggerVisualStrike = (targetKeyOrSymbol: string) => {
      const searchKey = targetKeyOrSymbol.toLowerCase();
      setActiveKeyString(searchKey);
      setTimeout(() => setActiveKeyString(null), 180);

      // Cari berdasarkan key shortcut (karena nada bisa sama antara baris 1 dan baris 2)
      const target =
        penconRecords.find((p) => p.key === searchKey) ||
        penconRecords.find((p) => p.nadaSymbol === searchKey);

      if (!target) return;

      const hitX = target.mesh.position.x;
      const hitY = target.baseY + 0.1;
      const hitZ = target.mesh.position.z;

      // 1. Kilatan Cahaya Panggung Terarah (Impact Light Flash)
      impactFlash.position.set(hitX, hitY + 0.22, hitZ);
      impactFlash.intensity = 5.5;

      // 2. Getaran Fisik & Penurunan Dinamis Pencon di atas tali
      target.vibe.intensity = 0.034;
      target.waveTime = 1.0;

      // Reset posisi cincin sonic kuning ke atas puncak pencu
      target.floatingTorus.position.y = hitY;

      // 3. Kilatan Emas Panas Metalik (High-intensity Emissive Flash)
      const mat = target.mesh.material as THREE.MeshStandardMaterial;
      mat.emissive.setHex(0xfff4aa);
      mat.emissiveIntensity = 1.35;
    };

    trigger3DVisualRef.current = triggerVisualStrike;

    // =========================================================================
    // 9. DETEKSI KLIK & SENTUHAN MENGGUNAKAN RAYCASTER (ZERO LATENCY)
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      // Jika digeser lebih dari 6px, anggap sebagai rotasi orbit kamera
      if (dist > 6) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const keyVal = hit.userData.key as string;
        if (keyVal) {
          triggerVisualStrike(keyVal);
          const item = daftarNadaRef.current.find((n) => n.key.toLowerCase() === keyVal);
          if (item) {
            onPlayRef.current?.(item);
          }
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);
      renderer.domElement.style.cursor = intersects.length > 0 ? "pointer" : "grab";
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);

    // =========================================================================
    // 10. RENDER LOOP DENGAN SIMULASI GETARAN & DENYUT MODE BELAJAR
    // =========================================================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      controls.update();

      // A. Redam Kilatan Cahaya Panggung
      if (impactFlash.intensity > 0.01) {
        impactFlash.intensity = Math.max(0, impactFlash.intensity - delta * 14);
      }

      // B. Animasi Per Pencon Bonang
      const currentLearn = targetLearnNoteRef.current;
      const currentWrong = wrongFeedbackNoteRef.current;

      for (let i = 0; i < penconRecords.length; i++) {
        const item = penconRecords[i];
        const mat = item.mesh.material as THREE.MeshStandardMaterial;

        // Simulasi Getaran Multi-Harmonik & Penurunan Fisik Saat Ditabuh
        if (item.vibe.intensity > 0.0005) {
          const osc =
            Math.sin(time * 95) * (item.vibe.intensity * 0.75) +
            Math.sin(time * 48) * (item.vibe.intensity * 0.25);
          item.mesh.position.y = item.baseY - Math.abs(osc);
          item.vibe.intensity *= item.vibe.decay;

          // Redam emissive pukulan kembali normal secara halus
          mat.emissiveIntensity = Math.max(0, mat.emissiveIntensity - delta * 5.2);
        } else {
          item.mesh.position.y = item.baseY;

          // Visual Feedback Mode Belajar: Denyut Lembut Emas khusus baris 2 (baris bawah)
          if (currentLearn === item.nadaSymbol && item.baris === 2) {
            const learnPulse = Math.sin(time * 4.5) * 0.35 + 0.45;
            mat.emissive.setHex(0xd4af37);
            mat.emissiveIntensity = learnPulse;
          } else if (currentWrong === item.nadaSymbol) {
            // Feedback salah: Kedipan merah tegas
            mat.emissive.setHex(0xff3333);
            mat.emissiveIntensity = 0.85;
            item.mesh.position.x += Math.sin(time * 90) * 0.005;
          } else {
            mat.emissiveIntensity = 0;
          }
        }

        // Gelombang Resonansi Akustik (Hanya Cincin Halo Kuning Emas Mengambang ke Udara)
        if (item.waveTime > 0) {
          item.waveTime -= delta * 2.2;
          const prog = 1.0 - item.waveTime;

          const scaleHalo = 1.0 + prog * 2.4;
          item.floatingTorus.scale.set(scaleHalo, scaleHalo, scaleHalo);
          item.floatingTorus.position.y += delta * 0.42; // Melayang ke atas
          (item.floatingTorus.material as THREE.MeshBasicMaterial).opacity = Math.max(
            0,
            item.waveTime * 0.85
          );
        } else {
          (item.floatingTorus.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(() => {
      if (!container || container.clientWidth === 0 || container.clientHeight === 0) return;
      updateResponsivePerspectiveCamera(
        camera,
        container.clientWidth,
        container.clientHeight,
        40,
        1.7
      );
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    // CLEANUP SAAT UNMOUNT
    return () => {
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bronzeTexture.dispose();
      woodTexture.dispose();
      carvingTexture.dispose();
    };
  }, [laras]);

  const handleStrike = (item: Nada) => {
    if (trigger3DVisualRef.current) {
      trigger3DVisualRef.current(item.key.toLowerCase());
    }
    onPlay(item);
  };

  const row1Items = daftarNada.filter((n) => n.baris === 1);
  const row2Items = daftarNada.filter((n) => n.baris === 2);

  return (
    <div
      ref={panelRef}
      className={`w-full flex flex-col items-center select-none ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-[#0c0704] p-3 sm:p-8 justify-between overflow-y-auto sm:overflow-hidden gap-2"
          : "space-y-3 sm:space-y-4 py-1"
      }`}
    >
      {/* ========================================================= */}
      {/* 1. HINT MODE LANDSCAPE (OTOMATIS DI LAYAR PONSEL)        */}
      {/* ========================================================= */}
      {showLandscapeHint && (
        <div className="w-full max-w-4xl flex items-center justify-between gap-2 bg-gradient-to-r from-emas/15 via-arang/90 to-emas/15 border border-emas/30 rounded-xl px-3 py-1.5 text-[11px] leading-snug text-gading/85 shadow-sm sm:hidden">
          <div className="flex items-center gap-2 min-w-0">
            <svg
              className="w-4 h-4 text-emas animate-pulse flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <span>
              💡 <strong>Tips:</strong> Putar ponsel ke <em>mode landscape</em> untuk jangkauan tabuhan dua baris terbaik.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowLandscapeHint(false)}
            className="text-gading/60 hover:text-white p-1 text-sm leading-none shrink-0"
            title="Tutup tips"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CARD BONANG VIRTUAL 3D DENGAN ORBIT & FULLSCREEN       */}
      {/* ========================================================= */}
      <div
        className={`relative w-full rounded-2xl bg-gradient-to-b from-[#1c120a] via-[#120a05] to-[#070402] border border-perunggu/35 shadow-2xl overflow-hidden ${
          isFullscreen ? "flex-1 min-h-[200px] my-1 sm:my-2" : "h-[260px] sm:h-[460px] md:h-[500px]"
        }`}
      >
        {/* Spotlight Ambient Emas */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Header Overlay: Petunjuk Posisi & Tombol Fullscreen (anti-tabrakan di mobile) */}
        <div className="absolute top-2.5 inset-x-3 sm:top-3 sm:inset-x-4 z-20 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 min-w-0 pt-1">
            <span className="text-[10px] sm:text-[11px] font-serif uppercase tracking-wider sm:tracking-widest text-emas font-bold drop-shadow-md truncate">
              Bonang 3D &bull; {laras === "pelog" ? "Pelog (14 Pencon)" : "Slendro (10 Pencon)"}
            </span>
            <span className="hidden md:inline text-[10px] text-gading/50 italic shrink-0">
              &bull; Drag untuk orbit 360°, klik langsung pencon untuk menabuh
            </span>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Keluar Layar Penuh (Esc)" : "Mode Layar Penuh (Fullscreen)"}
            className="pointer-events-auto shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-black/60 hover:bg-emas/20 border border-perunggu/40 hover:border-emas text-gading text-xs transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <svg className="w-3.5 h-3.5 text-emas" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden sm:inline text-[11px]">Tutup Layar Penuh</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-emas" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="hidden sm:inline text-[11px]">Layar Penuh</span>
              </>
            )}
          </button>
        </div>

        {/* Kanvas Three.js */}
        <div ref={canvasContainerRef} className="w-full h-full" />
      </div>

      {/* ========================================================= */}
      {/* 3. DEDICATED UI DECK TOMBOL TABUHAN BONANG (DUA BARIS)    */}
      {/* ========================================================= */}
      <div className="w-full flex flex-col items-center gap-2.5 sm:gap-3">
        {/* Baris 1: Nada Tinggi (Baris Atas / Belakang) */}
        <div className="w-full space-y-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-emas/90">
              Baris Atas (Nada Tinggi)
            </span>
            <span className="hidden sm:inline text-[10px] text-gading/40 italic">
              Tombol [{row1Items[0]?.key.toUpperCase()} - {row1Items[row1Items.length - 1]?.key.toUpperCase()}]
            </span>
          </div>
          <div
            className={`grid gap-1 sm:gap-3 w-full ${
              row1Items.length === 5
                ? "grid-cols-5"
                : "grid-cols-7"
            }`}
          >
            {row1Items.map((item) => {
              const isTarget = targetLearnNote === item.nada && item.baris === 2;
              const isWrong = wrongFeedbackNote === item.nada;
              const isActive = activeKeyString === item.key.toLowerCase();
              const shortLabel = item.label.replace(" (tinggi)", "");

              return (
                <button
                  key={`bonang-deck-r1-${laras}-${item.nada}-${item.key}`}
                  type="button"
                  onClick={() => handleStrike(item)}
                  style={{ touchAction: "manipulation" }}
                  className={`px-0.5 py-2 sm:p-3 rounded-lg sm:rounded-xl border flex flex-col items-center justify-center sm:justify-between transition-[background-color,border-color,color,transform] cursor-pointer active:scale-95 min-h-[52px] sm:min-h-[70px] min-w-0 ${
                    isActive
                      ? "bg-emas text-tinta border-emas scale-102"
                      : isTarget
                      ? "bg-gradient-to-b from-[#dfb962] to-[#805a1d] text-gading border-emas ring-2 ring-emas/80 animate-pulse"
                      : isWrong
                      ? "bg-red-900/60 border-red-500 text-red-200"
                      : "bg-gradient-to-b from-[#2b190f] to-[#170e08] border-perunggu/35 text-gading hover:border-emas/50 hover:bg-[#341f13]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-0 sm:gap-1 max-w-full">
                    <span className="font-serif font-bold text-sm sm:text-lg leading-tight">
                      {item.nada}
                    </span>
                    <span className="text-[9px] sm:text-xs opacity-75 italic leading-tight truncate max-w-full">
                      <span className="sm:hidden">{shortLabel}</span>
                      <span className="hidden sm:inline">({shortLabel})</span>
                    </span>
                  </div>
                  <KeyboardHint shortcutKey={item.key} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Baris 2: Nada Rendah (Baris Bawah / Depan) */}
        <div className="w-full space-y-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-emas/90">
              Baris Bawah (Nada Rendah)
            </span>
            <span className="hidden sm:inline text-[10px] text-gading/40 italic">
              Tombol [{row2Items[0]?.key.toUpperCase()} - {row2Items[row2Items.length - 1]?.key.toUpperCase()}]
            </span>
          </div>
          <div
            className={`grid gap-1 sm:gap-3 w-full ${
              row2Items.length === 5
                ? "grid-cols-5"
                : "grid-cols-7"
            }`}
          >
            {row2Items.map((item) => {
              const isTarget = targetLearnNote === item.nada && (item.baris === 2 || !item.baris);
              const isWrong = wrongFeedbackNote === item.nada;
              const isActive = activeKeyString === item.key.toLowerCase();
              const shortLabel = item.label.replace(" (tinggi)", "");

              return (
                <button
                  key={`bonang-deck-r2-${laras}-${item.nada}-${item.key}`}
                  type="button"
                  onClick={() => handleStrike(item)}
                  style={{ touchAction: "manipulation" }}
                  className={`px-0.5 py-2 sm:p-3 rounded-lg sm:rounded-xl border flex flex-col items-center justify-center sm:justify-between transition-[background-color,border-color,color,transform] cursor-pointer active:scale-95 min-h-[52px] sm:min-h-[70px] min-w-0 ${
                    isActive
                      ? "bg-emas text-tinta border-emas scale-102"
                      : isTarget
                      ? "bg-gradient-to-b from-[#dfb962] to-[#805a1d] text-gading border-emas ring-2 ring-emas/80 animate-pulse"
                      : isWrong
                      ? "bg-red-900/60 border-red-500 text-red-200"
                      : "bg-gradient-to-b from-[#2b190f] to-[#170e08] border-perunggu/35 text-gading hover:border-emas/50 hover:bg-[#341f13]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-0 sm:gap-1 max-w-full">
                    <span className="font-serif font-bold text-sm sm:text-lg leading-tight">
                      {item.nada}
                    </span>
                    <span className="text-[9px] sm:text-xs opacity-75 italic leading-tight truncate max-w-full">
                      <span className="sm:hidden">{shortLabel}</span>
                      <span className="hidden sm:inline">({shortLabel})</span>
                    </span>
                  </div>
                  <KeyboardHint shortcutKey={item.key} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
