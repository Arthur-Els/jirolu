"use client";

import React from "react";

export interface ScrollIndicatorAnimation {
  name?: string;
  duration?: string;
  iteration?: string;
}

export interface ScrollIndicatorIcon {
  type?: "chevron-down" | string;
  size?: string | number;
  color?: string;
  animation?: ScrollIndicatorAnimation;
}

export interface ScrollIndicatorAction {
  type?: "scroll_to_section" | string;
  target?: string;
  behavior?: ScrollBehavior;
}

export interface ScrollIndicatorProperties {
  text?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  icon?: ScrollIndicatorIcon;
  action?: ScrollIndicatorAction;
}

export interface ScrollIndicatorProps {
  position?: "bottom-center" | "bottom-left" | "bottom-right" | "relative" | string;
  text?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  icon?: ScrollIndicatorIcon;
  action?: ScrollIndicatorAction;
  properties?: ScrollIndicatorProperties;
  className?: string;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const DEFAULT_PROPERTIES: Required<Omit<ScrollIndicatorProperties, "icon" | "action">> & {
  icon: Required<Omit<ScrollIndicatorIcon, "animation">> & {
    animation: Required<ScrollIndicatorAnimation>;
  };
  action: Required<ScrollIndicatorAction>;
} = {
  text: "",
  textColor: "#A1A1AA",
  fontSize: "14px",
  fontFamily: "sans-serif",
  icon: {
    type: "chevron-down",
    size: "24px",
    color: "#FBBF24",
    animation: {
      name: "bounce",
      duration: "1.5s",
      iteration: "infinite",
    },
  },
  action: {
    type: "scroll_to_section",
    target: "#koleksi-alat",
    behavior: "smooth",
  },
};

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  position = "bottom-center",
  text: propText,
  textColor: propTextColor,
  fontSize: propFontSize,
  fontFamily: propFontFamily,
  icon: propIcon,
  action: propAction,
  properties,
  className = "",
  id = "scroll-indicator",
  onClick,
}) => {
  // Gabungkan konfigurasi: props langsung > properties object > defaults
  const activeText =
    propText ?? properties?.text ?? DEFAULT_PROPERTIES.text;
  const activeTextColor =
    propTextColor ?? properties?.textColor ?? DEFAULT_PROPERTIES.textColor;
  const activeFontSize =
    propFontSize ?? properties?.fontSize ?? DEFAULT_PROPERTIES.fontSize;
  const activeFontFamily =
    propFontFamily ?? properties?.fontFamily ?? DEFAULT_PROPERTIES.fontFamily;

  const iconConfig = propIcon ?? properties?.icon;
  const activeIconType = iconConfig?.type ?? DEFAULT_PROPERTIES.icon.type;
  const activeIconSize = iconConfig?.size ?? DEFAULT_PROPERTIES.icon.size;
  const activeIconColor = iconConfig?.color ?? DEFAULT_PROPERTIES.icon.color;
  const activeIconAnim = {
    name:
      iconConfig?.animation?.name ??
      DEFAULT_PROPERTIES.icon.animation.name,
    duration:
      iconConfig?.animation?.duration ??
      DEFAULT_PROPERTIES.icon.animation.duration,
    iteration:
      iconConfig?.animation?.iteration ??
      DEFAULT_PROPERTIES.icon.animation.iteration,
  };

  const actionConfig = propAction ?? properties?.action;
  const activeAction = {
    type: actionConfig?.type ?? DEFAULT_PROPERTIES.action.type,
    target: actionConfig?.target ?? DEFAULT_PROPERTIES.action.target,
    behavior: (actionConfig?.behavior ??
      DEFAULT_PROPERTIES.action.behavior) as ScrollBehavior,
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
      if (e.defaultPrevented) return;
    }

    if (activeAction.type === "scroll_to_section" && activeAction.target) {
      e.preventDefault();
      const targetSelector = activeAction.target;
      const targetId = targetSelector.replace(/^#/, "");

      // Cari elemen target utama (#koleksi-alat) dengan fallback ke galeri atau features jika diperlukan
      const targetEl =
        document.getElementById(targetId) ||
        document.querySelector(targetSelector) ||
        document.getElementById("koleksi-alat") ||
        document.getElementById("galeri") ||
        document.getElementById("features_showcase");

      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: activeAction.behavior || "smooth",
          block: "start",
        });

        if (typeof window !== "undefined" && window.history) {
          window.history.pushState(null, "", targetSelector);
        }
      }
    }
  };

  const positionClasses: Record<string, string> = {
    "bottom-center": "absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20",
    "bottom-left": "absolute bottom-6 sm:bottom-8 left-6 sm:left-8 z-20",
    "bottom-right": "absolute bottom-6 sm:bottom-8 right-6 sm:right-8 z-20",
    "relative": "relative mx-auto",
  };

  const posClass = positionClasses[position] ?? position;

  return (
    <button
      type="button"
      id={id}
      onClick={handleClick}
      aria-label={activeText || "Gulir ke bawah untuk jelajahi"}
      className={`group flex flex-col items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full p-2.5 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer select-none ${posClass} ${className}`}
    >
      {/* Teks Petunjuk Gulir (Hanya tampil jika ada teks) */}
      {activeText ? (
        <span
          className="tracking-wide transition-colors duration-200 group-hover:text-white"
          style={{
            color: activeTextColor,
            fontSize: activeFontSize,
            fontFamily: activeFontFamily,
          }}
        >
          {activeText}
        </span>
      ) : null}

      {/* Ikon Panah Beranimasi */}
      <span className="flex items-center justify-center">
        {activeIconType === "chevron-down" && (
          <svg
            width={activeIconSize}
            height={activeIconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke={activeIconColor}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="scroll-indicator-icon transition-transform duration-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)] group-hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
            style={{
              animation: `${activeIconAnim.name} ${activeIconAnim.duration} ${activeIconAnim.iteration}`,
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </span>
    </button>
  );
};
