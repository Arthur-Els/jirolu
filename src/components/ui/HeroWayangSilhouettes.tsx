"use client";

import React, { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const DESKTOP_DRAG_QUERY = "(min-width: 1024px) and (pointer: fine)";

function subscribeDesktopQuery(callback: () => void): () => void {
  const mediaQuery = window.matchMedia(DESKTOP_DRAG_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getDesktopSnapshot(): boolean {
  return window.matchMedia(DESKTOP_DRAG_QUERY).matches;
}

function getDesktopServerSnapshot(): boolean {
  return false;
}

interface DraggableWayangProps {
  src: string;
  alt: string;
  sizes: string;
  positionClassName: string;
  delay: number;
  isDesktop: boolean;
  shouldReduceMotion: boolean;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  bottomFadeMaskStyle: React.CSSProperties;
}

const DraggableWayang: React.FC<DraggableWayangProps> = ({
  src,
  alt,
  sizes,
  positionClassName,
  delay,
  isDesktop,
  shouldReduceMotion,
  constraintsRef,
  bottomFadeMaskStyle,
}) => {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring berbobot agar wayang terasa punya massa saat ditarik di belakang kursor
  const weightedSpring = { mass: 1.6, stiffness: 220, damping: 34 };
  const smoothX = useSpring(rawX, weightedSpring);
  const smoothY = useSpring(rawY, weightedSpring);
  const lagX = useTransform([smoothX, rawX], ([sx, rx]) => (sx as number) - (rx as number));
  const lagY = useTransform([smoothY, rawY], ([sy, ry]) => (sy as number) - (ry as number));

  // Efek miring lebih pelan dan mantap mengikuti kecepatan gerak berbobot
  const xVelocity = useVelocity(smoothX);
  const rawTilt = useTransform(xVelocity, [-1200, 0, 1200], [-6.5, 0, 6.5]);
  const smoothTilt = useSpring(rawTilt, { mass: 1.4, stiffness: 150, damping: 24 });

  const handleResetPosition = () => {
    if (!isDesktop) return;
    animate(rawX, 0, { type: "spring", stiffness: 190, damping: 28 });
    animate(rawY, 0, { type: "spring", stiffness: 190, damping: 28 });
  };

  return (
    <motion.div
      drag={isDesktop}
      dragConstraints={constraintsRef}
      dragElastic={0.06}
      dragMomentum={true}
      dragTransition={{
        power: 0.14,
        timeConstant: 190,
        bounceStiffness: 240,
        bounceDamping: 32,
      }}
      onDoubleClick={handleResetPosition}
      title={isDesktop ? "Geser wayang (klik dua kali untuk reset)" : undefined}
      style={{ x: rawX, y: rawY }}
      className={`${positionClassName} ${
        isDesktop
          ? "pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
          : "pointer-events-none"
      }`}
    >
      <motion.div
        style={{
          x: isDesktop && !shouldReduceMotion ? lagX : 0,
          y: isDesktop && !shouldReduceMotion ? lagY : 0,
          rotate: isDesktop && !shouldReduceMotion ? smoothTilt : 0,
          transformOrigin: "bottom center",
        }}
        className="w-full h-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
            delay,
          }}
          className="relative w-full h-full"
          style={bottomFadeMaskStyle}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            draggable={false}
            sizes={sizes}
            className="object-contain object-bottom brightness-0 opacity-30 sm:opacity-50 md:opacity-60 transition-opacity duration-300"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export const HeroWayangSilhouettes: React.FC = () => {
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useSyncExternalStore(
    subscribeDesktopQuery,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );
  const shouldReduceMotion = Boolean(useReducedMotion());

  const { scrollY } = useScroll();
  // Di perangkat mobile/tablet tetap memudar saat scroll; di PC tetap terlihat sampai batas denah panggung
  const mobileScrollOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const mobileScrollYParallax = useTransform(scrollY, [0, 400], [0, -70]);

  // Gaya visual gradient mask agar bagian bawah tubuh wayang melebur lembut ke dasar layar
  const bottomFadeMaskStyle: React.CSSProperties = {
    WebkitMaskImage:
      "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.85) 24%, black 36%, black 100%)",
    maskImage:
      "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.85) 24%, black 36%, black 100%)",
  };

  return (
    <motion.div
      ref={constraintsRef}
      style={
        isDesktop
          ? undefined
          : { opacity: mobileScrollOpacity, y: mobileScrollYParallax }
      }
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Jangkar posisi awal di viewport pembuka (min-h-dvh), sementara area drag meluas hingga batas denah panggung */}
      <div className="relative w-full h-dvh pointer-events-none">
        <DraggableWayang
          src="/background/wayang 2.png"
          alt="Siluet Wayang Penyambut Kiri"
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 40vw"
          positionClassName="absolute bottom-0 left-[-22%] sm:left-[-8%] md:left-[0%] lg:left-[2%] xl:left-[5%] h-[68vh] sm:h-[82vh] md:h-[90vh] lg:h-[95vh] max-h-[920px] aspect-[487/1080]"
          delay={0.15}
          isDesktop={isDesktop}
          shouldReduceMotion={shouldReduceMotion}
          constraintsRef={constraintsRef}
          bottomFadeMaskStyle={bottomFadeMaskStyle}
        />

        <DraggableWayang
          src="/background/wayang 1.png"
          alt="Siluet Wayang Penyambut Kanan"
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 40vw"
          positionClassName="absolute bottom-0 right-[-22%] sm:right-[-8%] md:right-[0%] lg:right-[2%] xl:right-[5%] h-[68vh] sm:h-[82vh] md:h-[90vh] lg:h-[95vh] max-h-[920px] aspect-[598/1080]"
          delay={0.28}
          isDesktop={isDesktop}
          shouldReduceMotion={shouldReduceMotion}
          constraintsRef={constraintsRef}
          bottomFadeMaskStyle={bottomFadeMaskStyle}
        />
      </div>
    </motion.div>
  );
};

export default HeroWayangSilhouettes;
