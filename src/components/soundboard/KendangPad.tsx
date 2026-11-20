"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ItemSuara } from "@/types/instrumen";
import { KeyboardHint } from "./KeyboardHint";

interface KendangPadProps {
  daftarSuara: ItemSuara[];
  activeKeyId?: string | null;
  onPlay: (item: ItemSuara) => void;
}

export const KendangPad: React.FC<KendangPadProps> = ({
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

  // Simpan onPlay dan daftarSuara dalam ref agar scene Three.js tidak pernah re-mount saat keyboard ditekan
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

  // Memicu aksi visual 3D saat ada masukan keyboard komputer dari luar
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
  // INISIALISASI THREE.JS SCENE (HANYA SEKALI, TIDAK PERNAH DI-RESET SAAT MAIN)
  // =========================================================================
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // 1. SCENE, KAMERA & RENDERER
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    // Posisi kamera sedikit serong atas-depan agar kedua tebokan & bodi terlihat jelas
    camera.position.set(0.2, 1.4, 3.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. ORBIT CONTROLS (BISA DI-ORBIT 360 DERAJAT)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 6.0;
    // Batas sudut vertikal agar tidak terbalik ke bawah lantai
    controls.maxPolarAngle = Math.PI / 2 + 0.12;
    controls.minPolarAngle = Math.PI / 8;
    controls.target.set(0, 0, 0);

    // 3. TATA CAHAYA PANGGUNG MEWAH (STUDIO GAMELAN WARM SPOTLIGHT)
    const ambientLight = new THREE.AmbientLight(0xffeedb, 1.1);
    scene.add(ambientLight);

    // Key Light hangat dari atas
    const keySpot = new THREE.SpotLight(0xfff5e6, 3.2);
    keySpot.position.set(1.5, 4.2, 3.2);
    keySpot.angle = Math.PI / 4.2;
    keySpot.penumbra = 0.6;
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    scene.add(keySpot);

    // Rim Light emas dari belakang untuk memunculkan kilau tali kulit janget & bodi
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.0);
    rimLight.position.set(-2.8, 2.5, -2.5);
    scene.add(rimLight);

    // Fill Light lembut dari bawah-depan
    const fillLight = new THREE.DirectionalLight(0x8a5d35, 0.85);
    fillLight.position.set(0, -2, 2.5);
    scene.add(fillLight);

    // 4. GENERATOR TEKSTUR REALISTIS MENGACU FOTO KENDANG ASLI
    // A. Tekstur Kayu Nangka/Jati Berpelitur Glossy & Ukiran Tumpal
    const createWoodTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;

      // Gradasi warna kayu karamel/amber khas kendang gamelan
      const grad = ctx.createLinearGradient(0, 0, 1024, 0);
      grad.addColorStop(0, "#4a2411");
      grad.addColorStop(0.2, "#733c1a");
      grad.addColorStop(0.5, "#914f24");
      grad.addColorStop(0.8, "#6e3919");
      grad.addColorStop(1, "#3d1c0c");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Guratan serat kayu halus horizontal
      ctx.fillStyle = "rgba(40, 18, 8, 0.15)";
      for (let y = 0; y < 512; y += 2) {
        if (Math.random() > 0.35) {
          ctx.fillRect(0, y, 1024, 1 + Math.random() * 2);
        }
      }

      // Motif ukiran segitiga tumpal/flora Jawa di dekat kedua ujung
      ctx.fillStyle = "rgba(45, 20, 8, 0.28)";
      ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
      ctx.lineWidth = 2;
      // Ukiran dekat ujung kiri (Bem)
      for (let y = 30; y < 512; y += 64) {
        ctx.beginPath();
        ctx.moveTo(100, y);
        ctx.lineTo(220, y + 32);
        ctx.lineTo(100, y + 64);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      // Ukiran dekat ujung kanan (Kempyang)
      for (let y = 30; y < 512; y += 64) {
        ctx.beginPath();
        ctx.moveTo(924, y);
        ctx.lineTo(804, y + 32);
        ctx.lineTo(924, y + 64);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    // B. Tekstur Kulit Kerbau Otentik (Patina Bekas Tabuhan di Tengah)
    const createLeatherTexture = (isBem: boolean) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;

      // Gradasi kulit kerbau alami: cokelat muda di tengah, patina gelap ke tepi
      const radGrad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
      if (isBem) {
        radGrad.addColorStop(0, "#eedcc2");
        radGrad.addColorStop(0.45, "#dabf98");
        radGrad.addColorStop(0.75, "#b59468");
        radGrad.addColorStop(1, "#664724");
      } else {
        radGrad.addColorStop(0, "#f8ecd8");
        radGrad.addColorStop(0.5, "#e5d1b1");
        radGrad.addColorStop(0.8, "#c2a377");
        radGrad.addColorStop(1, "#734e29");
      }
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 512, 512);

      // Pori-pori dan serat bintik kulit
      for (let i = 0; i < 1500; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        if (Math.hypot(x - 256, y - 256) < 246) {
          ctx.fillStyle = `rgba(${70 + Math.random() * 40}, ${40 + Math.random() * 20}, 20, ${0.04 + Math.random() * 0.08})`;
          ctx.beginPath();
          ctx.arc(x, y, 1 + Math.random() * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Lingkaran jejak pukulan jari di pusat tebokan
      const strikeAreaGrad = ctx.createRadialGradient(256, 256, 10, 256, 256, 110);
      strikeAreaGrad.addColorStop(0, "rgba(100, 65, 30, 0.18)");
      strikeAreaGrad.addColorStop(1, "transparent");
      ctx.fillStyle = strikeAreaGrad;
      ctx.beginPath();
      ctx.arc(256, 256, 110, 0, Math.PI * 2);
      ctx.fill();

      // Cincin halus penanda zona
      ctx.strokeStyle = "rgba(110, 70, 35, 0.25)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(256, 256, 130, 0, Math.PI * 2);
      ctx.stroke();

      return new THREE.CanvasTexture(canvas);
    };

    const woodTexture = createWoodTexture();
    const leatherBemTexture = createLeatherTexture(true);
    const leatherKempyangTexture = createLeatherTexture(false);

    // 5. PEMBUATAN STRUKTUR 3D KENDANG YANG UTUH & SOLID
    const kendangMasterGroup = new THREE.Group();
    scene.add(kendangMasterGroup);

    // Group untuk getaran tabung drum saat dipukul
    const drumVibeGroup = new THREE.Group();
    kendangMasterGroup.add(drumVibeGroup);

    // DIMENSI GEOMETRI KENDANG JAWA (ASIMETRIS CEMBUNG)
    const length = 2.4; // Panjang drum horizontal (sumbu X)
    const halfLen = length / 2; // 1.2
    const rBem = 0.74; // Radius tebokan besar di x = -1.2
    const rKempyang = 0.52; // Radius tebokan kecil di x = +1.2

    // =========================================================================
    // A. TABUNG BADAN KAYU UTUH 360 DERAJAT (DEFORMASI CYLINDER SEMPURNA)
    // =========================================================================
    // Gunakan CylinderGeometry bersegmen tinggi lalu deformasi kurva cembung
    // Ini menjamin tabung 100% tertutup rapat, normal wajah sempurna, tanpa lubang/terbelah!
    const radialSegs = 48;
    const heightSegs = 32;
    const barrelCylinder = new THREE.CylinderGeometry(
      rKempyang, // Top radius (y = +halfLen)
      rBem,      // Bottom radius (y = -halfLen)
      length,    // Height
      radialSegs,
      heightSegs,
      true       // Open ended karena kedua ujung ditutup membran kulit
    );

    const posAttr = barrelCylinder.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const t = (y + halfLen) / length; // 0 (Bem) s.d 1 (Kempyang)
      const baseR = THREE.MathUtils.lerp(rBem, rKempyang, t);
      // Kurva cembung gentong asimetris (puncak cembung sedikit condong ke Bem)
      const bulge = Math.sin(Math.PI * Math.pow(t, 0.82)) * 0.32;
      const curR = Math.hypot(posAttr.getX(i), posAttr.getZ(i));
      if (curR > 0.001) {
        const targetR = baseR + bulge;
        const scale = targetR / curR;
        posAttr.setX(i, posAttr.getX(i) * scale);
        posAttr.setZ(i, posAttr.getZ(i) * scale);
      }
    }
    barrelCylinder.computeVertexNormals();

    // Rotasi agar tabung mendatar sepanjang sumbu X:
    // y = -halfLen (Bem) mengarah ke X = -halfLen
    // y = +halfLen (Kempyang) mengarah ke X = +halfLen
    barrelCylinder.rotateZ(-Math.PI / 2);

    const woodMaterial = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.28,
      metalness: 0.04,
      side: THREE.DoubleSide, // Mencegah culling jika dilihat dari sudut mana pun
    });

    const barrelMesh = new THREE.Mesh(barrelCylinder, woodMaterial);
    barrelMesh.castShadow = true;
    barrelMesh.receiveShadow = true;
    drumVibeGroup.add(barrelMesh);

    // =========================================================================
    // B. CINCIN WENGKU BIBIR KULIT TEBAL PADA KEDUA UJUNG TABUNG
    // =========================================================================
    const wengkuMaterial = new THREE.MeshStandardMaterial({
      color: 0x472d1a,
      roughness: 0.55,
      metalness: 0.08,
    });

    // Wengku Kiri (Bem) di x = -halfLen
    const wengkuBemGeo = new THREE.TorusGeometry(rBem + 0.018, 0.046, 16, 48);
    wengkuBemGeo.rotateY(Math.PI / 2);
    const wengkuBem = new THREE.Mesh(wengkuBemGeo, wengkuMaterial);
    wengkuBem.position.set(-halfLen, 0, 0);
    wengkuBem.castShadow = true;
    drumVibeGroup.add(wengkuBem);

    // Wengku Kanan (Kempyang) di x = +halfLen
    const wengkuKempyangGeo = new THREE.TorusGeometry(rKempyang + 0.016, 0.042, 16, 48);
    wengkuKempyangGeo.rotateY(Math.PI / 2);
    const wengkuKempyang = new THREE.Mesh(wengkuKempyangGeo, wengkuMaterial);
    wengkuKempyang.position.set(halfLen, 0, 0);
    wengkuKempyang.castShadow = true;
    drumVibeGroup.add(wengkuKempyang);

    // =========================================================================
    // C. TALI KULIT JANGET 3D POLA V MENYILANG (RAPAT MENGIKUTI BODI TABUNG)
    // =========================================================================
    const cordMaterial = new THREE.MeshStandardMaterial({
      color: 0xeddcc4,
      roughness: 0.45,
      metalness: 0.04,
    });
    const simpayMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5ead8,
      roughness: 0.35,
      metalness: 0.08,
    });

    const strapPoints = 16;
    for (let i = 0; i < strapPoints; i++) {
      const angleBem = (i / strapPoints) * Math.PI * 2;
      const angleKempyang = ((i + 0.5) / strapPoints) * Math.PI * 2;

      // Titik janget di bibir wengku kiri dan kanan
      const p1 = new THREE.Vector3(-halfLen, Math.cos(angleBem) * rBem, Math.sin(angleBem) * rBem);
      const p2 = new THREE.Vector3(halfLen, Math.cos(angleKempyang) * rKempyang, Math.sin(angleKempyang) * rKempyang);

      // Titik lengkung tengah rapat pada permukaan cembung perut kendang
      const midAngle = (angleBem + angleKempyang) / 2;
      // Radius tengah: baseR_at_0 + bulge_at_0 + sedikit offset ketebalan tali (0.015)
      const rMidBarrel = THREE.MathUtils.lerp(rBem, rKempyang, 0.5) + Math.sin(Math.PI * Math.pow(0.5, 0.82)) * 0.32;
      const pMid = new THREE.Vector3(0, Math.cos(midAngle) * (rMidBarrel + 0.018), Math.sin(midAngle) * (rMidBarrel + 0.018));

      const curve = new THREE.QuadraticBezierCurve3(p1, pMid, p2);
      const tubeGeo = new THREE.TubeGeometry(curve, 14, 0.013, 6, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, cordMaterial);
      tubeMesh.castShadow = true;
      drumVibeGroup.add(tubeMesh);

      // Cincin simpay kulit pengatur tegangan nada pada tali janget
      if (i % 2 === 0) {
        const ringGeo = new THREE.TorusGeometry(0.04, 0.016, 8, 14);
        const simpay = new THREE.Mesh(ringGeo, simpayMaterial);
        simpay.position.copy(pMid);
        simpay.lookAt(0, 0, 0);
        drumVibeGroup.add(simpay);
      }
    }

    // =========================================================================
    // D. DUDUKAN PLANGKAN KAYU JATI BERUKIR MEWAH DENGAN PRADA EMAS
    // =========================================================================
    const plangkanGroup = new THREE.Group();
    kendangMasterGroup.add(plangkanGroup);

    const plangkanWoodMat = new THREE.MeshStandardMaterial({
      color: 0x24140b,
      roughness: 0.38,
      metalness: 0.08,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.28,
      metalness: 0.8,
    });

    // 1. Balok palangan horizontal bawah
    const baseBarGeo = new THREE.BoxGeometry(2.3, 0.12, 0.45);
    const baseBar = new THREE.Mesh(baseBarGeo, plangkanWoodMat);
    baseBar.position.set(0, -0.98, 0);
    baseBar.castShadow = true;
    plangkanGroup.add(baseBar);

    // List emas pada balok palang
    const goldStripGeo = new THREE.BoxGeometry(2.32, 0.03, 0.47);
    const goldStrip = new THREE.Mesh(goldStripGeo, goldMat);
    goldStrip.position.set(0, -0.98, 0);
    plangkanGroup.add(goldStrip);

    // 2. Kaki Plangkan Kiri & Kanan (Cradle U-Penyangga yang Kokoh di Bidang YZ)
    [-halfLen * 0.65, halfLen * 0.65].forEach((posX, idx) => {
      // Penyangga U melengkung pas di bawah drum dari depan ke belakang (bidang YZ)
      const cradleR = idx === 0 ? 0.82 : 0.68;
      const cradleGeo = new THREE.TorusGeometry(cradleR, 0.065, 14, 36, Math.PI);
      // Lengkungan U ke bawah
      cradleGeo.rotateZ(Math.PI);
      // Putar 90 derajat mengitari sumbu Y agar berada di bidang YZ (cradling depan-bawah-belakang)
      cradleGeo.rotateY(Math.PI / 2);

      const cradle = new THREE.Mesh(cradleGeo, plangkanWoodMat);
      const cradlePosY = idx === 0 ? -0.06 : -0.16;
      cradle.position.set(posX, cradlePosY, 0);
      cradle.castShadow = true;
      plangkanGroup.add(cradle);

      // Ornamen ukiran emas pada ujung lengkungan U (depan & belakang)
      [-cradleR, cradleR].forEach((posZ) => {
        const tipGeo = new THREE.SphereGeometry(0.062, 12, 12);
        const tip = new THREE.Mesh(tipGeo, goldMat);
        tip.position.set(posX, cradlePosY, posZ);
        plangkanGroup.add(tip);
      });

      // Kaki ukir bawah
      const footGeo = new THREE.CylinderGeometry(0.14, 0.2, 0.42, 8);
      const foot = new THREE.Mesh(footGeo, plangkanWoodMat);
      foot.position.set(posX, -1.18, 0);
      foot.castShadow = true;
      plangkanGroup.add(foot);

      // Cincin emas ukir pada kaki
      const footRingGeo = new THREE.TorusGeometry(0.17, 0.03, 8, 16);
      footRingGeo.rotateX(Math.PI / 2);
      const footRing = new THREE.Mesh(footRingGeo, goldMat);
      footRing.position.set(posX, -1.08, 0);
      plangkanGroup.add(footRing);
    });

    // =========================================================================
    // E. MEMBRAN KULIT TEBOKAN (RAPAT & TEPAT DI KEDUA LUBANG BUKAAN TABUNG)
    // =========================================================================
    const interactiveMeshes: THREE.Mesh[] = [];

    // Wadah Tebokan Kiri (Bem) tepat di x = -halfLen
    const headBemGroup = new THREE.Group();
    headBemGroup.position.set(-halfLen - 0.003, 0, 0);
    drumVibeGroup.add(headBemGroup);

    // Wadah Tebokan Kanan (Kempyang) tepat di x = +halfLen
    const headKempyangGroup = new THREE.Group();
    headKempyangGroup.position.set(halfLen + 0.003, 0, 0);
    drumVibeGroup.add(headKempyangGroup);

    // 1. TEBOKAN BESAR (KIRI / BEM)
    // Normal menghadap ke luar kiri (-X)
    const bemInnerR = rBem * 0.54;

    // A. ZONA DUNG [X] (Lingkaran Tengah)
    const dungGeo = new THREE.CircleGeometry(bemInnerR, 36);
    dungGeo.rotateY(-Math.PI / 2); // Menghadap ke arah kiri (-X)
    const dungMat = new THREE.MeshStandardMaterial({
      map: leatherBemTexture,
      roughness: 0.52,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    const dungMesh = new THREE.Mesh(dungGeo, dungMat);
    dungMesh.userData = { soundId: "dung" };
    headBemGroup.add(dungMesh);
    interactiveMeshes.push(dungMesh);

    // B. ZONA DAH [Z] (Cincin Tepi Luar)
    const dahGeo = new THREE.RingGeometry(bemInnerR, rBem, 36);
    dahGeo.rotateY(-Math.PI / 2); // Menghadap ke arah kiri (-X)
    const dahMat = new THREE.MeshStandardMaterial({
      map: leatherBemTexture,
      roughness: 0.55,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    const dahMesh = new THREE.Mesh(dahGeo, dahMat);
    dahMesh.userData = { soundId: "dah" };
    headBemGroup.add(dahMesh);
    interactiveMeshes.push(dahMesh);

    // 2. TEBOKAN KECIL (KANAN / KEMPYANG)
    // Normal menghadap ke luar kanan (+X)
    const kempyangInnerR = rKempyang * 0.55;

    // C. ZONA TAK [N] (Lingkaran Tengah)
    const takGeo = new THREE.CircleGeometry(kempyangInnerR, 36);
    takGeo.rotateY(Math.PI / 2); // Menghadap ke arah kanan (+X)
    const takMat = new THREE.MeshStandardMaterial({
      map: leatherKempyangTexture,
      roughness: 0.48,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    const takMesh = new THREE.Mesh(takGeo, takMat);
    takMesh.userData = { soundId: "tak" };
    headKempyangGroup.add(takMesh);
    interactiveMeshes.push(takMesh);

    // D. ZONA TUNG [M] (Cincin Tepi Luar)
    const tungGeo = new THREE.RingGeometry(kempyangInnerR, rKempyang, 36);
    tungGeo.rotateY(Math.PI / 2); // Menghadap ke arah kanan (+X)
    const tungMat = new THREE.MeshStandardMaterial({
      map: leatherKempyangTexture,
      roughness: 0.52,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    const tungMesh = new THREE.Mesh(tungGeo, tungMat);
    tungMesh.userData = { soundId: "tung" };
    headKempyangGroup.add(tungMesh);
    interactiveMeshes.push(tungMesh);

    // RIAK AKUSTIK EMAS 3D (RIPPLE EFFECT)
    const createRipple = (radius: number, faceLeft: boolean) => {
      const geo = new THREE.RingGeometry(radius * 0.7, radius * 0.88, 36);
      if (faceLeft) {
        geo.rotateY(-Math.PI / 2);
      } else {
        geo.rotateY(Math.PI / 2);
      }
      const mat = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      // Geser tipis ke luar agar tidak z-fighting dengan kulit
      mesh.position.x = faceLeft ? -0.015 : 0.015;
      return mesh;
    };

    const rippleBem = createRipple(rBem, true);
    headBemGroup.add(rippleBem);

    const rippleKempyang = createRipple(rKempyang, false);
    headKempyangGroup.add(rippleKempyang);

    // =========================================================================
    // F. FISIKA GETARAN REALISTIS & PEMICU VISUAL 3D
    // =========================================================================
    const vibeBem = { intensity: 0, decay: 0.89 };
    const vibeKempyang = { intensity: 0, decay: 0.87 };
    const vibeWood = { intensity: 0, decay: 0.9 };
    let rippleBemTime = 0;
    let rippleKempyangTime = 0;

    const trigger3DVisual = (soundId: string) => {
      setActiveSoundId(soundId);
      setTimeout(() => setActiveSoundId(null), 180);

      if (soundId === "dah" || soundId === "dung") {
        vibeBem.intensity = soundId === "dah" ? 0.075 : 0.052;
        vibeWood.intensity = 0.032;
        rippleBemTime = 1.0;
        dungMat.emissive.setHex(soundId === "dung" ? 0x85641e : 0x221708);
        dahMat.emissive.setHex(soundId === "dah" ? 0x85641e : 0x221708);
        setTimeout(() => {
          dungMat.emissive.setHex(0x000000);
          dahMat.emissive.setHex(0x000000);
        }, 120);
      } else {
        vibeKempyang.intensity = soundId === "tak" ? 0.065 : 0.048;
        vibeWood.intensity = 0.024;
        rippleKempyangTime = 1.0;
        takMat.emissive.setHex(soundId === "tak" ? 0x85641e : 0x221708);
        tungMat.emissive.setHex(soundId === "tung" ? 0x85641e : 0x221708);
        setTimeout(() => {
          takMat.emissive.setHex(0x000000);
          tungMat.emissive.setHex(0x000000);
        }, 120);
      }

      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate?.(soundId === "dah" ? 30 : 15);
        } catch {}
      }
    };

    trigger3DVisualRef.current = trigger3DVisual;

    // =========================================================================
    // G. RAYCASTING CERDAS (MEMBEDAKAN DRAG ORBIT VS KETUKAN DRUM)
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      // Jika digeser lebih dari 6px, anggap sebagai drag orbit kamera
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
    // H. RENDER LOOP DENGAN ANIMASI GETARAN FISIK
    // =========================================================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      controls.update();

      // Getaran Tebokan Kiri (Bem)
      if (vibeBem.intensity > 0.001) {
        headBemGroup.position.x = -halfLen - 0.003 + Math.sin(time * 65) * vibeBem.intensity;
        vibeBem.intensity *= vibeBem.decay;
      } else {
        headBemGroup.position.x = -halfLen - 0.003;
      }

      // Getaran Tebokan Kanan (Kempyang)
      if (vibeKempyang.intensity > 0.001) {
        headKempyangGroup.position.x = halfLen + 0.003 + Math.sin(time * 75) * vibeKempyang.intensity;
        vibeKempyang.intensity *= vibeKempyang.decay;
      } else {
        headKempyangGroup.position.x = halfLen + 0.003;
      }

      // Getaran Bodi Kayu di atas Plangkan
      if (vibeWood.intensity > 0.001) {
        drumVibeGroup.position.y = Math.sin(time * 50) * vibeWood.intensity;
        drumVibeGroup.rotation.z = Math.sin(time * 45) * (vibeWood.intensity * 0.35);
        vibeWood.intensity *= vibeWood.decay;
      } else {
        drumVibeGroup.position.y = 0;
        drumVibeGroup.rotation.z = 0;
      }

      // Gelombang Akustik Bem
      if (rippleBemTime > 0) {
        rippleBemTime -= delta * 1.8;
        const scale = 1.0 + (1.0 - rippleBemTime) * 0.85;
        rippleBem.scale.set(scale, scale, 1);
        (rippleBem.material as THREE.MeshBasicMaterial).opacity = Math.max(0, rippleBemTime * 0.8);
      } else {
        (rippleBem.material as THREE.MeshBasicMaterial).opacity = 0;
      }

      // Gelombang Akustik Kempyang
      if (rippleKempyangTime > 0) {
        rippleKempyangTime -= delta * 2.2;
        const scale = 1.0 + (1.0 - rippleKempyangTime) * 0.75;
        rippleKempyang.scale.set(scale, scale, 1);
        (rippleKempyang.material as THREE.MeshBasicMaterial).opacity = Math.max(0, rippleKempyangTime * 0.9);
      } else {
        (rippleKempyang.material as THREE.MeshBasicMaterial).opacity = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    // CLEANUP SAAT UNMOUNT SAJA
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
      barrelCylinder.dispose();
      woodMaterial.dispose();
      woodTexture.dispose();
      leatherBemTexture.dispose();
      leatherKempyangTexture.dispose();
    };
  }, []); // Empty dependency array: tidak pernah ter-reset saat bermain!

  const dahItem = getSuaraById("dah");
  const dungItem = getSuaraById("dung");
  const takItem = getSuaraById("tak");
  const tungItem = getSuaraById("tung");

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
          ? "fixed inset-0 z-50 bg-[#0c0704] p-4 sm:p-8 justify-between overflow-hidden"
          : "space-y-4 py-2 px-1 sm:px-3"
      }`}
    >
      {/* ========================================================= */}
      {/* 1. HINT MODE LANDSCAPE (OTOMATIS DI SMARTPHONE)           */}
      {/* ========================================================= */}
      {showLandscapeHint && (
        <div className="w-full max-w-4xl flex items-center justify-between bg-gradient-to-r from-emas/15 via-arang/90 to-emas/15 border border-emas/30 rounded-xl px-3 py-1.5 text-xs text-gading/85 shadow-sm sm:hidden">
          <div className="flex items-center gap-2">
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
              💡 <strong>Tips:</strong> Putar ke <em>mode landscape</em> untuk jangkauan tabuhan kendang terbaik.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowLandscapeHint(false)}
            className="text-gading/60 hover:text-white p-1 text-sm leading-none"
            title="Tutup tips"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. AREA STAGE 3D THREE.JS DENGAN ORBIT & TOMBOL FULLSCREEN*/}
      {/* ========================================================= */}
      <div
        className={`relative w-full rounded-2xl bg-gradient-to-b from-[#1b120a] via-[#110a05] to-[#070402] border border-perunggu/35 shadow-2xl overflow-hidden ${
          isFullscreen ? "flex-1 my-2" : "h-[380px] sm:h-[440px] md:h-[480px]"
        }`}
      >
        {/* Spotlight Ambient Belakang */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Petunjuk Posisi & Orbit */}
        <div className="absolute top-3 left-4 z-10 pointer-events-none flex items-center gap-2">
          <span className="text-[11px] font-serif uppercase tracking-widest text-emas font-bold drop-shadow-md">
            Kendang 3D
          </span>
          <span className="hidden sm:inline text-[10px] text-gading/50 italic">
            &bull; Drag untuk orbit 360°, klik langsung kulit kendang untuk menabuh
          </span>
        </div>

        {/* Tombol Fullscreen */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Keluar Layar Penuh (Esc)" : "Mode Layar Penuh (Fullscreen)"}
          className="absolute top-3 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-emas/20 border border-perunggu/40 hover:border-emas text-gading text-xs transition-colors cursor-pointer"
        >
          {isFullscreen ? (
            <>
              <svg className="w-3.5 h-3.5 text-emas" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-[11px]">Tutup Layar Penuh</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-emas" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="text-[11px]">Layar Penuh</span>
            </>
          )}
        </button>

        {/* Kanvas Three.js */}
        <div ref={canvasContainerRef} className="w-full h-full" />
      </div>

      {/* ========================================================= */}
      {/* 3. DEDICATED UI DECK TOMBOL PUKUL (RINGKAS & TEPAT SASARAN)*/}
      {/* ========================================================= */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full">
          {/* Tombol 1: DAH */}
          {dahItem && (
            <button
              type="button"
              onClick={() => handleStrike(dahItem)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-[background-color,border-color,color,transform] cursor-pointer active:scale-95 ${
                activeSoundId === "dah"
                  ? "bg-emas text-tinta border-emas scale-102"
                  : "bg-gradient-to-b from-[#2b190f] to-[#170e08] border-perunggu/35 text-gading hover:border-emas/50 hover:bg-[#341f13]"
              }`}
            >
              <div className="text-left flex flex-col">
                <span className="font-serif font-bold text-sm sm:text-base">Dah</span>
                <span className="text-[10px] opacity-75">Tebokan Kiri</span>
              </div>
              <KeyboardHint shortcutKey={dahItem.key} />
            </button>
          )}

          {/* Tombol 2: DUNG */}
          {dungItem && (
            <button
              type="button"
              onClick={() => handleStrike(dungItem)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-[background-color,border-color,color,transform] cursor-pointer active:scale-95 ${
                activeSoundId === "dung"
                  ? "bg-emas text-tinta border-emas scale-102"
                  : "bg-gradient-to-b from-[#2b190f] to-[#170e08] border-perunggu/35 text-gading hover:border-emas/50 hover:bg-[#341f13]"
              }`}
            >
              <div className="text-left flex flex-col">
                <span className="font-serif font-bold text-sm sm:text-base">Dung</span>
                <span className="text-[10px] opacity-75">Tebokan Kiri</span>
              </div>
              <KeyboardHint shortcutKey={dungItem.key} />
            </button>
          )}

          {/* Tombol 3: TAK */}
          {takItem && (
            <button
              type="button"
              onClick={() => handleStrike(takItem)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-[background-color,border-color,color,transform] cursor-pointer active:scale-95 ${
                activeSoundId === "tak"
                  ? "bg-emas text-tinta border-emas scale-102"
                  : "bg-gradient-to-b from-[#2b190f] to-[#170e08] border-perunggu/35 text-gading hover:border-emas/50 hover:bg-[#341f13]"
              }`}
            >
              <div className="text-left flex flex-col">
                <span className="font-serif font-bold text-sm sm:text-base">Tak</span>
                <span className="text-[10px] opacity-75">Tebokan Kanan</span>
              </div>
              <KeyboardHint shortcutKey={takItem.key} />
            </button>
          )}

          {/* Tombol 4: TUNG */}
          {tungItem && (
            <button
              type="button"
              onClick={() => handleStrike(tungItem)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-[background-color,border-color,color,transform] cursor-pointer active:scale-95 ${
                activeSoundId === "tung"
                  ? "bg-emas text-tinta border-emas scale-102"
                  : "bg-gradient-to-b from-[#2b190f] to-[#170e08] border-perunggu/35 text-gading hover:border-emas/50 hover:bg-[#341f13]"
              }`}
            >
              <div className="text-left flex flex-col">
                <span className="font-serif font-bold text-sm sm:text-base">Tung</span>
                <span className="text-[10px] opacity-75">Tebokan Kanan</span>
              </div>
              <KeyboardHint shortcutKey={tungItem.key} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
