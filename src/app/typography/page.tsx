import {
  DM_Mono,
  DM_Sans,
  DM_Serif_Display,
  Fira_Code,
  Geist_Mono,
  IBM_Plex_Mono,
  Inter,
  JetBrains_Mono,
  Manrope,
  Playfair_Display,
  Raleway,
  Source_Sans_3,
  Space_Grotesk,
} from "next/font/google";
import TypographyShowcase, { type TypeSet } from "./TypographyShowcase";

// ----- Current site fonts -----
const inter = Inter({ subsets: ["latin"], display: "swap" });
const raleway = Raleway({ subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap" });

// ----- Editorial -----
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });
const interEditorial = Inter({ subsets: ["latin"], display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

// ----- Tech-forward -----
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap" });
const interTech = Inter({ subsets: ["latin"], display: "swap" });
const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// ----- Cohesive DM -----
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap" });
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// ----- Corporate -----
const manrope = Manrope({ subsets: ["latin"], display: "swap" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], display: "swap" });
const firaCode = Fira_Code({ subsets: ["latin"], display: "swap" });

const SETS: TypeSet[] = [
  {
    id: "current",
    name: "Current",
    tagline: "Modern · approachable",
    description:
      "What the Intrastack site uses today. Inter brings precision to headings; Raleway adds breathing room in body copy.",
    heading: { family: inter.style.fontFamily, label: "Inter" },
    sans: { family: raleway.style.fontFamily, label: "Raleway" },
    mono: { family: geistMono.style.fontFamily, label: "Geist Mono" },
  },
  {
    id: "editorial",
    name: "Editorial",
    tagline: "Refined · authoritative",
    description:
      "Serif headings signal craft and longevity. Pairs Playfair Display with Inter body — magazine-grade typesetting for a tech consultancy.",
    heading: { family: playfair.style.fontFamily, label: "Playfair Display" },
    sans: { family: interEditorial.style.fontFamily, label: "Inter" },
    mono: { family: jetbrains.style.fontFamily, label: "JetBrains Mono" },
  },
  {
    id: "tech",
    name: "Tech-forward",
    tagline: "Geometric · engineered",
    description:
      "Space Grotesk gives engineered, slightly futurist headings. Inter keeps reading effortless. IBM Plex Mono cements the engineering credibility.",
    heading: { family: spaceGrotesk.style.fontFamily, label: "Space Grotesk" },
    sans: { family: interTech.style.fontFamily, label: "Inter" },
    mono: { family: ibmPlex.style.fontFamily, label: "IBM Plex Mono" },
  },
  {
    id: "dm",
    name: "DM Family",
    tagline: "Cohesive · sophisticated",
    description:
      "One designer, one system. The DM Serif/Sans/Mono trio is engineered to feel like a single voice across every weight.",
    heading: { family: dmSerif.style.fontFamily, label: "DM Serif Display" },
    sans: { family: dmSans.style.fontFamily, label: "DM Sans" },
    mono: { family: dmMono.style.fontFamily, label: "DM Mono" },
  },
  {
    id: "corporate",
    name: "Corporate",
    tagline: "Clean · enterprise",
    description:
      "Manrope's quiet confidence in headings, Source Sans 3 for dense paragraphs, Fira Code for any technical detail. Reads well in boardrooms.",
    heading: { family: manrope.style.fontFamily, label: "Manrope" },
    sans: { family: sourceSans.style.fontFamily, label: "Source Sans 3" },
    mono: { family: firaCode.style.fontFamily, label: "Fira Code" },
  },
];

export default function TypographyPage() {
  return <TypographyShowcase sets={SETS} />;
}
