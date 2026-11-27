"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ItemSuara } from "@/types/instrumen";
import { KeyboardHint } from "./KeyboardHint";
import { updateResponsivePerspectiveCamera } from "@/lib/three/responsiveCamera";

interface GongPadProps {
  daftarSuara: ItemSuara[];
  activeKeyId?: string | null;
  onPlay: (item: ItemSuara) => void;
}

// =============================================================================
// TEKSTUR PROSEDURAL REALISTIS (PERUNGGU TEMPA GONG, KAYU JATI & UKIRAN GAYOR)
// =============================================================================

/** Tekstur Perunggu Tempa Concentric untuk Bodi Gong Jawa (UV Lathe: v=1 pusat muka, v=0 bibir belakang) */
function createGongBronzeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Gradasi vertikal dari muka tengah gong (y=0 / v=1) ke bahu & bibir belakang patina gelap (y=512 / v=0)
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#f5d784");
  grad.addColorStop(0.22, "#c6963f");
  grad.addColorStop(0.45, "#6b4a19");
  grad.addColorStop(0.72, "#2c1d0b");
  grad.addColorStop(1, "#180f05");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Guratan melingkar hasil bubut tradisional (garis horizontal di kanvas = cincin konsentris di LatheGeometry)
  ctx.fillStyle = "rgba(255, 240, 190, 0.08)";
  for (let y = 8; y < 504; y += 5) {
    ctx.fillRect(0, y, 512, 1.2);
  }

  // Jejak palu tempa mikro (hammered dimples) di area bahu & bangkekan gong
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 512;
    const y = 90 + Math.random() * 380;
    ctx.fillStyle =
      Math.random() > 0.5 ? "rgba(255, 228, 150, 0.05)" : "rgba(18, 10, 4, 0.14)";
    ctx.beginPath();
    ctx.arc(x, y, 2 + Math.random() * 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** Tekstur Kayu Jati Tua Berpelitur untuk Rangka Gayor */
function createTeakWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, "#261208");
  grad.addColorStop(0.25, "#3c1e0f");
  grad.addColorStop(0.5, "#4d2916");
  grad.addColorStop(0.75, "#361b0d");
  grad.addColorStop(1, "#221007");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 3) {
    const alpha = (Math.sin(y * 0.11) + Math.cos(y * 0.04)) * 0.08 + 0.12;
    ctx.fillStyle = `rgba(15, 6, 3, ${Math.max(0.04, alpha)})`;
    ctx.fillRect(0, y, 512, 2.5);
  }

  const varnish = ctx.createLinearGradient(0, 0, 0, 512);
  varnish.addColorStop(0, "rgba(212, 175, 55, 0.08)");
  varnish.addColorStop(0.5, "rgba(255, 255, 255, 0.04)");
  varnish.addColorStop(1, "rgba(0, 0, 0, 0.28)");
  ctx.fillStyle = varnish;
  ctx.fillRect(0, 0, 512, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Tekstur Ukiran Lung-lungan Emas Prada pada Palang & Mahkota Gayor */
function createGayorCarvingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#221208";
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, 500, 116);
  ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(12, 12, 488, 104);

  ctx.strokeStyle = "#e8c558";
  ctx.fillStyle = "rgba(212, 175, 55, 0.85)";
  ctx.lineWidth = 2.5;

  for (let x = 32; x < 500; x += 64) {
    ctx.beginPath();
    ctx.arc(x, 44, 18, 0, Math.PI, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + 32, 84, 18, Math.PI, 0, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + 16, 64, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff4bd";
    ctx.beginPath();
    ctx.arc(x + 16, 64, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(212, 175, 55, 0.85)";
  }

  return new THREE.CanvasTexture(canvas);
}

/**
 * Geometri Badan Gong Jawa (Bangkekan/Sisi, Bahu Cembung, Muka Datar)
 * Menggunakan LatheGeometry dan dirotasi agar menghadap ke pemain (+Z).
 */
function createGongBodyGeometry(radius: number, depth: number): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [];
  const pencuRadius = radius * 0.22;

  // 1. Bibir belakang dalam (rim belakang melengkung masuk)
  pts.push(new THREE.Vector2(radius * 0.84, -depth));
  // 2. Dinding samping (bangkekan) menuju bahu depan
  pts.push(new THREE.Vector2(radius * 0.96, -depth * 0.72));
  pts.push(new THREE.Vector2(radius, -depth * 0.15));
  // 3. Bahu gong melengkung ke muka depan
  pts.push(new THREE.Vector2(radius * 0.92, depth * 0.12));
  pts.push(new THREE.Vector2(radius * 0.72, depth * 0.24));
  // 4. Muka (rai) gong sedikit cekung sebelum pangkal pencu
  pts.push(new THREE.Vector2(pencuRadius * 1.18, depth * 0.21));
  pts.push(new THREE.Vector2(pencuRadius, depth * 0.2));

  const geo = new THREE.LatheGeometry(pts, 48);
  geo.rotateX(Math.PI / 2); // Sumbu Y menjadi +Z (menghadap ke depan)
  geo.computeVertexNormals();
  return geo;
}

/** Geometri Pencu Tengah (Tonjolan Emas Mengkilap Tempat Tabuhan) */
function createGongPencuGeometry(radius: number, depth: number): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [];
  const pencuR = radius * 0.22;
  const pencuH = depth * 0.42;

  const segs = 14;
  for (let i = 0; i <= segs; i++) {
    const angle = (i / segs) * (Math.PI / 2);
    const px = Math.cos(angle) * pencuR;
    const py = depth * 0.2 + Math.sin(angle) * pencuH;
    pts.push(new THREE.Vector2(px, py));
  }

  const geo = new THREE.LatheGeometry(pts, 32);
  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

interface GongVisualState {
  id: string;
  pivotGroup: THREE.Group;
  bodyMat: THREE.MeshStandardMaterial;
  pencuMat: THREE.MeshStandardMaterial;
  rippleMesh: THREE.Mesh;
  swingTime: number;
  swingActive: boolean;
  swingAmp: number;
  swingFreq: number;
  swingDamp: number;
  glowTime: number;
  rippleTime: number;
}

export const GongPad: React.FC<GongPadProps> = ({
  daftarSuara,
  activeKeyId,
  onPlay,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLandscapeHint, setShowLandscapeHint] = useState(true);

  const trigger3DVisualRef = useRef<((id: string) => void) | null>(null);

  // Ref stabil agar listener Three.js tidak perlu re-mount saat props berubah
  const onPlayRef = useRef(onPlay);
  useEffect(() => {
    onPlayRef.current = onPlay;
  }, [onPlay]);

  const daftarSuaraRef = useRef(daftarSuara);
  useEffect(() => {
    daftarSuaraRef.current = daftarSuara;
  }, [daftarSuara]);

  const getSuaraById = useCallback(
    (id: string) => daftarSuara.find((s) => s.id === id),
    [daftarSuara]
  );

  // Memicu animasi 3D saat ada input keyboard atau playback luar
  useEffect(() => {
    if (activeKeyId && trigger3DVisualRef.current) {
      trigger3DVisualRef.current(activeKeyId);
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
  // INISIALISASI THREE.JS SCENE GAYOR & 3 GONG JAWA OTENTIK
  // =========================================================================
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const baseFov = 38;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      baseFov,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    updateResponsivePerspectiveCamera(
      camera,
      container.clientWidth,
      container.clientHeight,
      baseFov,
      1.75
    );
    camera.position.set(0.1, 0.45, 4.35);
    camera.lookAt(0, -0.05, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    container.appendChild(renderer.domElement);

    // ORBIT CONTROLS 360°
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.4;
    controls.maxDistance = 6.8;
    controls.maxPolarAngle = Math.PI / 2 + 0.06;
    controls.minPolarAngle = Math.PI / 10;
    controls.target.set(0, -0.05, 0);

    // TATA CAHAYA PANGGUNG HANGAT
    const ambientLight = new THREE.AmbientLight(0xffeedb, 1.25);
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xfff7e6, 3.4);
    keySpot.position.set(1.6, 4.4, 3.6);
    keySpot.angle = Math.PI / 3.4;
    keySpot.penumbra = 0.65;
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    scene.add(keySpot);

    const fillLight = new THREE.DirectionalLight(0xd4af37, 1.15);
    fillLight.position.set(-3.2, 2.2, 2.6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff9933, 1.1);
    rimLight.position.set(0, 1.8, -3.2);
    scene.add(rimLight);

    // LANTAI BAYANGAN
    const shadowPlaneGeo = new THREE.PlaneGeometry(8, 6);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.18;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // TEKSTUR & MATERIAL
    const gongBronzeTexture = createGongBronzeTexture();
    const woodTexture = createTeakWoodTexture();
    const carvingTexture = createGayorCarvingTexture();

    const woodMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.42,
      metalness: 0.08,
    });
    const carvingMat = new THREE.MeshStandardMaterial({
      map: carvingTexture,
      roughness: 0.48,
      metalness: 0.25,
    });
    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.26,
      metalness: 0.85,
    });
    const ropeMat = new THREE.MeshStandardMaterial({
      color: 0x7b1a14, // Tali pluntur merah marun keraton
      roughness: 0.78,
      metalness: 0.05,
    });

    // =========================================================================
    // RANGKA KAYU UKIR GAYOR (PENYANGGA GONG JAWA)
    // =========================================================================
    const gayorGroup = new THREE.Group();
    scene.add(gayorGroup);

    const disposableGeos: THREE.BufferGeometry[] = [shadowPlaneGeo];
    const disposableMats: THREE.Material[] = [
      shadowPlaneMat,
      woodMat,
      carvingMat,
      goldAccentMat,
      ropeMat,
    ];

    const pillarX = 1.82;
    const beamY = 1.06;
    const floorY = -1.18;
    const pillarHeight = beamY - floorY;

    // 2 Tiang Vertikal Kiri & Kanan beserta Kaki Penyokong
    [-pillarX, pillarX].forEach((px) => {
      const pillarGeo = new THREE.BoxGeometry(0.14, pillarHeight, 0.14);
      disposableGeos.push(pillarGeo);
      const pillar = new THREE.Mesh(pillarGeo, woodMat);
      pillar.position.set(px, floorY + pillarHeight / 2, 0);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      gayorGroup.add(pillar);

      // Kaki bawah melintang depan-belakang (Z)
      const footGeo = new THREE.BoxGeometry(0.24, 0.12, 0.88);
      disposableGeos.push(footGeo);
      const foot = new THREE.Mesh(footGeo, woodMat);
      foot.position.set(px, floorY + 0.06, 0);
      foot.castShadow = true;
      foot.receiveShadow = true;
      gayorGroup.add(foot);

      // Umpak (cincin penyangga emas/ukir di pangkal kaki tiang)
      const umpakGeo = new THREE.BoxGeometry(0.2, 0.14, 0.24);
      disposableGeos.push(umpakGeo);
      const umpak = new THREE.Mesh(umpakGeo, carvingMat);
      umpak.position.set(px, floorY + 0.18, 0);
      umpak.castShadow = true;
      gayorGroup.add(umpak);

      // Siku penyangga diagonal tiang ke palang atas
      const braceGeo = new THREE.BoxGeometry(0.08, 0.42, 0.09);
      disposableGeos.push(braceGeo);
      const brace = new THREE.Mesh(braceGeo, carvingMat);
      const sign = px < 0 ? 1 : -1;
      brace.position.set(px + sign * 0.15, beamY - 0.18, 0);
      brace.rotation.z = sign * (Math.PI / 4);
      brace.castShadow = true;
      gayorGroup.add(brace);
    });

    // Palang Atas Utama (Sunduk Gayor)
    const beamGeo = new THREE.BoxGeometry(4.0, 0.15, 0.16);
    disposableGeos.push(beamGeo);
    const topBeam = new THREE.Mesh(beamGeo, woodMat);
    topBeam.position.set(0, beamY, 0);
    topBeam.castShadow = true;
    topBeam.receiveShadow = true;
    gayorGroup.add(topBeam);

    // Papan Ukiran Prada Panjang di Atas Palang
    const friezeGeo = new THREE.BoxGeometry(3.72, 0.16, 0.08);
    disposableGeos.push(friezeGeo);
    const frieze = new THREE.Mesh(friezeGeo, carvingMat);
    frieze.position.set(0, beamY + 0.14, 0);
    frieze.castShadow = true;
    gayorGroup.add(frieze);

    // Ornamen Mahkota Ukir Tengah (Gunungan/Kala Kecil)
    const crestGeo = new THREE.ConeGeometry(0.22, 0.28, 4);
    disposableGeos.push(crestGeo);
    const crest = new THREE.Mesh(crestGeo, goldAccentMat);
    crest.rotation.y = Math.PI / 4;
    crest.scale.set(1.2, 1.0, 0.35);
    crest.position.set(0, beamY + 0.34, 0);
    crest.castShadow = true;
    gayorGroup.add(crest);

    // Ujung Tanduk Melengkung Kiri & Kanan Palang Atas
    [-2.02, 2.02].forEach((tx) => {
      const tipGeo = new THREE.ConeGeometry(0.1, 0.26, 8);
      disposableGeos.push(tipGeo);
      const tip = new THREE.Mesh(tipGeo, goldAccentMat);
      tip.position.set(tx, beamY + 0.12, 0);
      tip.rotation.z = tx < 0 ? Math.PI / 3.5 : -Math.PI / 3.5;
      tip.castShadow = true;
      gayorGroup.add(tip);
    });

    // =========================================================================
    // PEMBUATAN 3 GONG GANTUNG (SUWUKAN, GONG AGENG, KEMPUL)
    // =========================================================================
    const gongSpecs = [
      {
        id: "gong-suwukan",
        x: -1.16,
        centerY: -0.02,
        radius: 0.42,
        depth: 0.16,
        swingAmp: 0.12,
        swingFreq: 7.5,
        swingDamp: 1.5,
      },
      {
        id: "gong-ageng",
        x: 0.0,
        centerY: -0.14,
        radius: 0.62,
        depth: 0.22,
        swingAmp: 0.085,
        swingFreq: 5.0,
        swingDamp: 1.05,
      },
      {
        id: "kempul",
        x: 1.14,
        centerY: 0.06,
        radius: 0.33,
        depth: 0.13,
        swingAmp: 0.15,
        swingFreq: 9.5,
        swingDamp: 1.9,
      },
    ];

    const interactiveMeshes: THREE.Object3D[] = [];
    const gongStates: Record<string, GongVisualState> = {};

    gongSpecs.forEach((spec) => {
      // Pivot berada di palang atas Gayor agar gong berayun seperti bandul asli
      const pivotGroup = new THREE.Group();
      pivotGroup.position.set(spec.x, beamY - 0.06, 0);
      gayorGroup.add(pivotGroup);

      const hangDistance = beamY - 0.06 - spec.centerY;

      // Tali Pluntur Gantung Kiri & Kanan
      const ropeSpreadTop = spec.radius * 0.56;
      const ropeSpreadBottom = spec.radius * 0.38;
      const gongTopAttachY = -(hangDistance - spec.radius * 0.88);

      [-1, 1].forEach((side) => {
        const startVec = new THREE.Vector3(side * ropeSpreadTop, 0, 0);
        const endVec = new THREE.Vector3(side * ropeSpreadBottom, gongTopAttachY, -spec.depth * 0.3);
        const ropeVec = new THREE.Vector3().subVectors(endVec, startVec);
        const ropeLen = ropeVec.length();

        const ropeGeo = new THREE.CylinderGeometry(0.016, 0.016, ropeLen, 10);
        disposableGeos.push(ropeGeo);
        const rope = new THREE.Mesh(ropeGeo, ropeMat);
        rope.position.copy(startVec).addScaledVector(ropeVec, 0.5);
        rope.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ropeVec.clone().normalize());
        rope.castShadow = true;
        pivotGroup.add(rope);

        // Gelang simpul emas di pangkal gantungan palang
        const knotGeo = new THREE.TorusGeometry(0.032, 0.01, 8, 18);
        disposableGeos.push(knotGeo);
        const knot = new THREE.Mesh(knotGeo, goldAccentMat);
        knot.rotation.y = Math.PI / 2;
        knot.position.set(side * ropeSpreadTop, 0.04, 0);
        pivotGroup.add(knot);
      });

      // Grup Badan Gong + Pencu + Ripple
      const gongGroup = new THREE.Group();
      gongGroup.position.set(0, -hangDistance, 0);
      pivotGroup.add(gongGroup);

      // Material unik per gong agar kilau emisi saat dipukul independen
      const bodyMat = new THREE.MeshStandardMaterial({
        map: gongBronzeTexture,
        color: 0xe6c88a,
        roughness: 0.36,
        metalness: 0.78,
        side: THREE.DoubleSide,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0,
      });
      const pencuMat = new THREE.MeshStandardMaterial({
        color: 0xf4cf6b,
        roughness: 0.16,
        metalness: 0.94,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0,
      });
      disposableMats.push(bodyMat, pencuMat);

      const bodyGeo = createGongBodyGeometry(spec.radius, spec.depth);
      const pencuGeo = createGongPencuGeometry(spec.radius, spec.depth);
      disposableGeos.push(bodyGeo, pencuGeo);

      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      bodyMesh.userData = { soundId: spec.id };

      const pencuMesh = new THREE.Mesh(pencuGeo, pencuMat);
      pencuMesh.castShadow = true;
      pencuMesh.userData = { soundId: spec.id };

      gongGroup.add(bodyMesh);
      gongGroup.add(pencuMesh);
      interactiveMeshes.push(bodyMesh, pencuMesh);

      // Cincin Gelombang Akustik Emas 3D (Ripple saat Dipukul)
      const rippleGeo = new THREE.RingGeometry(spec.radius * 0.75, spec.radius * 0.9, 44);
      const rippleMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      disposableGeos.push(rippleGeo);
      disposableMats.push(rippleMat);

      const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
      rippleMesh.position.z = spec.depth * 0.45;
      gongGroup.add(rippleMesh);

      gongStates[spec.id] = {
        id: spec.id,
        pivotGroup,
        bodyMat,
        pencuMat,
        rippleMesh,
        swingTime: 0,
        swingActive: false,
        swingAmp: spec.swingAmp,
        swingFreq: spec.swingFreq,
        swingDamp: spec.swingDamp,
        glowTime: 0,
        rippleTime: 0,
      };
    });

    // =========================================================================
    // PEMICU ANIMASI PUKULAN GONG 3D
    // =========================================================================
    const trigger3DVisual = (soundId: string) => {
      setActiveSoundId(soundId);
      setTimeout(() => {
        setActiveSoundId((prev) => (prev === soundId ? null : prev));
      }, 420);

      const state = gongStates[soundId];
      if (state) {
        state.swingTime = 0;
        state.swingActive = true;
        state.glowTime = 1.0;
        state.rippleTime = 1.0;
      }

      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate?.(soundId === "gong-ageng" ? 40 : 20);
        } catch {}
      }
    };

    trigger3DVisualRef.current = trigger3DVisual;

    // =========================================================================
    // RAYCASTING CERDAS (MEMBEDAKAN DRAG ORBIT VS TABUHAN GONG)
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const soundId = hit.userData.soundId as string;
        if (soundId) {
          trigger3DVisual(soundId);
          const item = daftarSuaraRef.current.find((s) => s.id === soundId);
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
    // RENDER LOOP (AYUNAN BANDUL, GETARAN RESONANSI, KILAU & RIAK EMAS)
    // =========================================================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);

      controls.update();

      Object.values(gongStates).forEach((st) => {
        // 1. Ayunan bandul gong ke belakang lalu meredam alami
        if (st.swingActive) {
          st.swingTime += delta;
          const decayFactor = Math.exp(-st.swingTime * st.swingDamp);
          if (decayFactor < 0.008) {
            st.swingActive = false;
            st.pivotGroup.rotation.x = 0;
          } else {
            // Dorongan pertama mengayun ke belakang (-Z, yaitu rotasi +X), berosilasi lembut
            st.pivotGroup.rotation.x =
              Math.sin(st.swingTime * st.swingFreq) * st.swingAmp * decayFactor;
          }
        }

        // 2. Kilau emisi keemasan pada pencu & badan gong
        if (st.glowTime > 0) {
          st.glowTime = Math.max(0, st.glowTime - delta * 1.4);
          st.pencuMat.emissive.setHex(0xd4af37);
          st.pencuMat.emissiveIntensity = st.glowTime * 0.7;
          st.bodyMat.emissive.setHex(0x8a641b);
          st.bodyMat.emissiveIntensity = st.glowTime * 0.35;
        } else {
          st.pencuMat.emissiveIntensity = 0;
          st.bodyMat.emissiveIntensity = 0;
        }

        // 3. Cincin gelombang akustik mengembang keluar
        if (st.rippleTime > 0) {
          st.rippleTime = Math.max(0, st.rippleTime - delta * 0.95);
          const progress = 1.0 - st.rippleTime;
          const scale = 1.0 + progress * 0.95;
          st.rippleMesh.scale.set(scale, scale, 1);
          (st.rippleMesh.material as THREE.MeshBasicMaterial).opacity = st.rippleTime * 0.78;
        } else {
          (st.rippleMesh.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER RESPONSIF
    const resizeObserver = new ResizeObserver(() => {
      if (!container || container.clientWidth === 0 || container.clientHeight === 0) return;
      updateResponsivePerspectiveCamera(
        camera,
        container.clientWidth,
        container.clientHeight,
        baseFov,
        1.75
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
      disposableGeos.forEach((g) => g.dispose());
      disposableMats.forEach((m) => m.dispose());
      gongBronzeTexture.dispose();
      woodTexture.dispose();
      carvingTexture.dispose();
    };
  }, []);

  // Urutan tombol kiri-ke-kanan selaras dengan gantungannya di Gayor 3D
  const suwukanItem = getSuaraById("gong-suwukan");
  const agengItem = getSuaraById("gong-ageng");
  const kempulItem = getSuaraById("kempul");
  const orderedItems = [suwukanItem, agengItem, kempulItem].filter(
    (item): item is ItemSuara => Boolean(item)
  );

  const handleStrike = (item: ItemSuara) => {
    if (trigger3DVisualRef.current) {
      trigger3DVisualRef.current(item.id);
    }
    onPlay(item);
  };

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
      {/* 1. HINT MODE LANDSCAPE (OTOMATIS DI SMARTPHONE)           */}
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
              💡 <strong>Tips:</strong> Putar ke <em>mode landscape</em> untuk pandangan gayor dan gong yang lebih luas.
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
      {/* 2. CARD GONG & GAYOR 3D DENGAN ORBIT & FULLSCREEN         */}
      {/* ========================================================= */}
      <div
        className={`relative w-full rounded-2xl bg-gradient-to-b from-[#1b120a] via-[#110a05] to-[#070402] border border-perunggu/35 shadow-2xl overflow-hidden ${
          isFullscreen ? "flex-1 min-h-[220px] my-1 sm:my-2" : "h-[270px] sm:h-[440px] md:h-[480px]"
        }`}
      >
        {/* Spotlight Ambient Emas */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Header Overlay: Petunjuk Posisi & Tombol Fullscreen */}
        <div className="absolute top-2.5 inset-x-3 sm:top-3 sm:inset-x-4 z-20 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 min-w-0 pt-1">
            <span className="text-[10px] sm:text-[11px] font-serif uppercase tracking-wider sm:tracking-widest text-emas font-bold drop-shadow-md truncate">
              Gong Gayor 3D
            </span>
            <span className="hidden md:inline text-[10px] text-gading/50 italic shrink-0">
              &bull; Drag untuk orbit 360°, klik langsung piringan atau pencu gong untuk menabuh
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
      {/* 3. DEDICATED UI DECK 3 TOMBOL TABUHAN GONG                */}
      {/* ========================================================= */}
      <div className="w-full flex flex-col items-center gap-2.5">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
          {orderedItems.map((gong) => {
            const isActive = activeSoundId === gong.id;
            const subtitle =
              gong.id === "gong-ageng"
                ? "Nada Terdalam"
                : gong.id === "gong-suwukan"
                ? "Gong Sedang"
                : "Aksen Cerah";

            return (
              <button
                key={gong.id}
                type="button"
                onClick={() => handleStrike(gong)}
                style={{ touchAction: "manipulation" }}
                aria-label={`Pukul ${gong.nama}, tombol keyboard ${gong.key}`}
                className={`p-2.5 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 sm:gap-2 transition-[background-color,border-color,color,transform] cursor-pointer active:scale-95 min-h-[60px] min-w-0 ${
                  isActive
                    ? "bg-emas text-tinta border-emas scale-102"
                    : "bg-gradient-to-b from-[#2b190f] to-[#170e08] border-perunggu/35 text-gading hover:border-emas/50 hover:bg-[#341f13]"
                }`}
              >
                <div className="text-center sm:text-left flex flex-col min-w-0">
                  <span className="font-serif font-bold text-xs sm:text-base leading-tight truncate">
                    {gong.nama}
                  </span>
                  <span className="text-[10px] opacity-75 truncate">{subtitle}</span>
                </div>
                <KeyboardHint shortcutKey={gong.key} />
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gading/50 italic text-center px-2">
          <span className="sm:hidden">
            Ketuk langsung gong 3D atau tombol di atas untuk mendengarkan dengung agung gamelan.
          </span>
          <span className="hidden sm:inline">
            Tekan tombol angka <span className="text-emas font-semibold">[1, 2, 3]</span>, tombol di atas, atau klik langsung gong 3D untuk mendengarkan dengung gelombang agung gamelan.
          </span>
        </p>
      </div>
    </div>
  );
};
