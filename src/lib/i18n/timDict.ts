import type { TeamMember } from "@/lib/tim";
import type { Locale } from "./types";

interface TeamMemberTranslation {
  jabatan?: string;
  kontribusi: string;
}

export const TIM_EN_DICT: Record<string, TeamMemberTranslation> = {
  arthur: {
    jabatan: "Project Lead & Lead Web Developer",
    kontribusi:
      "Led the development direction of Jirolu while building the core web architecture, the Web Audio API sound simulation engine, and the integration of all gamelan instrument pages.",
  },
  gevin: {
    jabatan: "Web Developer",
    kontribusi:
      "Supported web interface development, page component implementation, and technical refinement and responsiveness so Jirolu runs smoothly across screen sizes.",
  },
  fakirah: {
    jabatan: "UI/UX Designer",
    kontribusi:
      "Crafted the visual identity, interface composition, and user experience blending the atmosphere of a Javanese karawitan museum with warm, approachable web interactions.",
  },
  alvano: {
    jabatan: "System Analyst & Information Architect",
    kontribusi:
      "Designed user journeys, navigation structure, and system mapping so learning and playing gamelan from the home page to each instrument feels cohesive.",
  },
};

export function getLocalizedTeamMember(
  member: TeamMember,
  locale: Locale
): TeamMember {
  if (locale === "id") {
    return member;
  }

  const translation = TIM_EN_DICT[member.id];
  if (!translation) {
    return member;
  }

  return {
    ...member,
    jabatan: translation.jabatan ?? member.jabatan,
    kontribusi: translation.kontribusi,
  };
}
