import * as THREE from "three";

/**
 * Menyesuaikan FOV kamera perspektif secara otomatis saat rasio aspek kanvas sempit (misalnya portrait di mobile),
 * sehingga lebar horizontal objek 3D tetap terlihat utuh tanpa terpotong di tepi kiri/kanan.
 */
export function updateResponsivePerspectiveCamera(
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number,
  baseFovDeg: number,
  referenceAspect = 1.65
): void {
  if (width <= 0 || height <= 0) return;

  const aspect = width / height;
  camera.aspect = aspect;

  if (aspect < referenceAspect) {
    const baseHalfVRad = THREE.MathUtils.degToRad(baseFovDeg / 2);
    const targetHalfHRad = Math.atan(Math.tan(baseHalfVRad) * referenceAspect);
    const adjustedVRad = 2 * Math.atan(Math.tan(targetHalfHRad) / Math.max(aspect, 0.55));
    camera.fov = Math.min(THREE.MathUtils.radToDeg(adjustedVRad), 74);
  } else {
    camera.fov = baseFovDeg;
  }

  camera.updateProjectionMatrix();
}
