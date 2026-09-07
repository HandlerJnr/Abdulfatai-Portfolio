import type { Project } from "@/data/projects";

type Props = { project: Project; className?: string; priority?: boolean };

/**
 * Art-directed, generated cover artwork for each project — a stylised
 * interface composition rendered as inline SVG. Swap for real screenshots
 * by placing images in /public/projects/<slug>.jpg and rendering <Image/>.
 */
export function ProjectArt({ project, className = "" }: Props) {
  const { hue, accent, kind } = project.art;
  const id = `g-${project.slug}`;
  return (
    <svg
      viewBox="0 0 1200 800"
      role="img"
      aria-label={`${project.title} — ${project.category} interface preview`}
      className={`block h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hue} />
          <stop offset="1" stopColor="#05050C" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.8" cy="0.2" r="0.8">
          <stop offset="0" stopColor={accent} stopOpacity="0.28" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#fff" strokeOpacity="0.05" />
        </pattern>
      </defs>
      <rect width="1200" height="800" fill={`url(#${id})`} />
      <rect width="1200" height="800" fill={`url(#${id}-grid)`} />
      <rect width="1200" height="800" fill={`url(#${id}-glow)`} />

      {kind === "health" && <Health accent={accent} />}
      {kind === "workflow" && <Workflow accent={accent} />}
      {kind === "booking" && <Booking accent={accent} />}
      {kind === "web3" && <Web3 accent={accent} />}
      {kind === "fashion" && <Fashion accent={accent} />}
      {kind === "banking" && <Banking accent={accent} />}

      <text
        x="60"
        y="740"
        fill="#fff"
        fillOpacity="0.5"
        fontFamily="var(--font-display), Impact, sans-serif"
        fontSize="28"
        letterSpacing="4"
      >
        {project.title.toUpperCase()} — {project.year}
      </text>
    </svg>
  );
}

/* ---------- Compositions ---------- */

const Frame = ({ x, y, w, h, r = 18 }: { x: number; y: number; w: number; h: number; r?: number }) => (
  <>
    <rect x={x} y={y} width={w} height={h} rx={r} fill="#0B0B14" stroke="#fff" strokeOpacity="0.14" />
  </>
);

const Line = ({ x, y, w, o = 0.35 }: { x: number; y: number; w: number; o?: number }) => (
  <rect x={x} y={y} width={w} height="8" rx="4" fill="#fff" fillOpacity={o} />
);

function Health({ accent }: { accent: string }) {
  return (
    <g>
      {/* Desktop dashboard */}
      <Frame x={120} y={110} w={760} h={480} />
      <rect x={120} y={110} width={200} height={480} rx="18" fill="#fff" fillOpacity="0.03" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Line key={i} x={150} y={170 + i * 44} w={i === 1 ? 120 : 90} o={i === 1 ? 0.8 : 0.3} />
      ))}
      <rect x={150} y={204} width={140} height={28} rx="6" fill={accent} fillOpacity="0.25" />
      <Line x={360} y={150} w={220} o={0.85} />
      <Line x={360} y={172} w={140} o={0.3} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={360 + i * 170} y={210} width={150} height={100} rx="12" fill="#fff" fillOpacity="0.05" stroke="#fff" strokeOpacity="0.1" />
          <Line x={380 + i * 170} y={232} w={70} o={0.3} />
          <text x={380 + i * 170} y={288} fill="#fff" fontSize="34" fontFamily="var(--font-display), Impact" letterSpacing="1">
            {["12", "04", "98%"][i]}
          </text>
        </g>
      ))}
      {/* pulse line */}
      <path
        d="M360 470 h60 l20 -60 l20 100 l20 -70 l20 30 h60 l20 -40 l20 60 l20 -30 h60 l20 -50 l20 80 l20 -40 h80"
        fill="none"
        stroke={accent}
        strokeWidth="3"
      />
      <rect x={360} y={340} width={500} height={200} rx="12" fill="none" stroke="#fff" strokeOpacity="0.1" />
      {/* Phone */}
      <Frame x={900} y={160} w={200} h={420} r={28} />
      <rect x={920} y={190} width={160} height="110" rx="14" fill={accent} fillOpacity="0.9" />
      <Line x={935} y={210} w={80} o={0.9} />
      <Line x={935} y={232} w={110} o={0.5} />
      <rect x={935} y={262} width={70} height="24" rx="12" fill="#05050C" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={920} y={320 + i * 70} width={160} height="56" rx="12" fill="#fff" fillOpacity="0.05" />
          <circle cx={946} cy={348 + i * 70} r="12" fill="#fff" fillOpacity="0.2" />
          <Line x={968} y={340 + i * 70} w={80} o={0.5} />
          <Line x={968} y={356 + i * 70} w={50} o={0.2} />
        </g>
      ))}
    </g>
  );
}

function Workflow({ accent }: { accent: string }) {
  const nodes = [
    [160, 300],
    [420, 200],
    [420, 420],
    [700, 300],
    [960, 300],
  ];
  return (
    <g>
      <Frame x={80} y={90} w={1040} h={560} r={22} />
      <rect x={80} y={90} width={1040} height="52" rx="22" fill="#fff" fillOpacity="0.04" />
      <Line x={110} y={112} w={90} o={0.7} />
      <Line x={220} y={112} w={60} o={0.3} />
      <rect x={990} y={104} width={100} height="26" rx="13" fill={accent} />
      {/* connections */}
      <path d="M300 330 C 360 330, 360 230, 420 230" fill="none" stroke={accent} strokeWidth="2" strokeOpacity="0.7" />
      <path d="M300 330 C 360 330, 360 450, 420 450" fill="none" stroke={accent} strokeWidth="2" strokeOpacity="0.7" />
      <path d="M560 230 C 630 230, 630 330, 700 330" fill="none" stroke="#fff" strokeWidth="2" strokeOpacity="0.3" />
      <path d="M560 450 C 630 450, 630 330, 700 330" fill="none" stroke="#fff" strokeWidth="2" strokeOpacity="0.3" />
      <path d="M840 330 H 960" fill="none" stroke="#fff" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="6 8" />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="140" height="60" rx="12" fill="#0B0B14" stroke={i === 0 ? accent : "#fff"} strokeOpacity={i === 0 ? 1 : 0.2} />
          <circle cx={x + 22} cy={y + 30} r="8" fill={i === 0 ? accent : "#fff"} fillOpacity={i === 0 ? 1 : 0.4} />
          <Line x={x + 40} y={y + 20} w={70} o={0.7} />
          <Line x={x + 40} y={y + 36} w={45} o={0.25} />
        </g>
      ))}
      {/* side panel */}
      <rect x={860} y={160} width={230} height="480" rx="14" fill="#fff" fillOpacity="0.035" stroke="#fff" strokeOpacity="0.1" />
      <Line x={884} y={190} w={110} o={0.8} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <Line x={884} y={230 + i * 62} w={60} o={0.3} />
          <rect x={884} y={246 + i * 62} width="180" height="28" rx="6" fill="#fff" fillOpacity="0.06" stroke="#fff" strokeOpacity="0.12" />
        </g>
      ))}
      <rect x={884} y={560} width="180" height="40" rx="8" fill={accent} />
    </g>
  );
}

function Booking({ accent }: { accent: string }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${140 + i * 300} ${140 + (i === 1 ? -30 : 0)})`}>
          <Frame x={0} y={0} w={240} h={500} r={30} />
          <rect x={16} y={16} width="208" height="220" rx="20" fill="#fff" fillOpacity={0.08 + i * 0.04} />
          <rect x={16} y={16} width="208" height="220" rx="20" fill={accent} fillOpacity={i === 1 ? 0.5 : 0.15} />
          <rect x={32} y={32} width="70" height="22" rx="11" fill="#05050C" fillOpacity="0.7" />
          <Line x={32} y={260} w={140} o={0.85} />
          <Line x={32} y={282} w={90} o={0.35} />
          <Line x={32} y={304} w={120} o={0.35} />
          {[0, 1, 2, 3, 4].map((s) => (
            <rect key={s} x={32 + s * 16} y={330} width="10" height="10" fill={accent} />
          ))}
          <rect x={32} y={366} width="176" height="1" fill="#fff" fillOpacity="0.15" />
          <text x={32} y={412} fill="#fff" fontSize="36" fontFamily="var(--font-display), Impact" letterSpacing="1">
            {["₦85K", "₦120K", "₦64K"][i]}
          </text>
          <rect x={32} y={436} width="176" height="40" rx="20" fill={i === 1 ? accent : "#fff"} fillOpacity={i === 1 ? 1 : 0.12} />
        </g>
      ))}
    </g>
  );
}

function Web3({ accent }: { accent: string }) {
  return (
    <g>
      <Frame x={130} y={120} w={640} h={520} r={22} />
      <Line x={170} y={170} w={160} o={0.85} />
      <Line x={170} y={194} w={90} o={0.3} />
      <text x={170} y={290} fill="#fff" fontSize="84" fontFamily="var(--font-display), Impact" letterSpacing="2">
        24,860.42
      </text>
      <rect x={170} y={312} width="120" height="26" rx="13" fill={accent} fillOpacity="0.2" stroke={accent} />
      <path d="M170 560 L 250 520 L 330 540 L 410 470 L 490 490 L 570 420 L 650 440 L 730 380" fill="none" stroke={accent} strokeWidth="3" />
      <path d="M170 560 L 250 520 L 330 540 L 410 470 L 490 490 L 570 420 L 650 440 L 730 380 V 600 H 170 Z" fill={accent} fillOpacity="0.08" />
      {/* confirm sheet */}
      <Frame x={820} y={200} w={260} h={440} r={28} />
      <Line x={850} y={240} w={120} o={0.85} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Line x={850} y={290 + i * 54} w={70} o={0.3} />
          <Line x={980} y={290 + i * 54} w={70} o={0.7} />
          <rect x={850} y={312 + i * 54} width="200" height="1" fill="#fff" fillOpacity="0.12" />
        </g>
      ))}
      <rect x={850} y={560} width="200" height="44" rx="22" fill={accent} />
      <rect x={850} y={510} width="200" height="34" rx="8" fill="#fff" fillOpacity="0.06" stroke={accent} strokeOpacity="0.5" />
    </g>
  );
}

function Fashion({ accent }: { accent: string }) {
  return (
    <g>
      <Frame x={100} y={100} w={600} h={540} r={22} />
      <rect x={100} y={100} width="600" height="52" rx="22" fill="#fff" fillOpacity="0.04" />
      <Line x={130} y={122} w={80} o={0.7} />
      <rect x={130} y={190} width="260" height="420" rx="16" fill="#fff" fillOpacity="0.05" stroke="#fff" strokeOpacity="0.12" />
      {/* silhouette-ish shapes */}
      <path d="M260 230 c-40 0 -70 40 -70 90 v 240 h 140 v -240 c 0 -50 -30 -90 -70 -90z" fill={accent} fillOpacity="0.55" />
      <path d="M200 420 h120 v 150 h -120z" fill="#05050C" fillOpacity="0.4" />
      <rect x={420} y={190} width="250" height="120" rx="14" fill={accent} fillOpacity="0.15" stroke={accent} strokeOpacity="0.6" />
      <Line x={440} y={214} w={120} o={0.85} />
      <Line x={440} y={236} w={190} o={0.35} />
      <Line x={440} y={256} w={150} o={0.35} />
      <rect x={440} y={280} width="90" height="18" rx="9" fill={accent} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={420} y={330 + i * 90} width="250" height="74" rx="12" fill="#fff" fillOpacity="0.05" />
          <rect x={436} y={344 + i * 90} width="46" height="46" rx="8" fill="#fff" fillOpacity="0.15" />
          <Line x={498} y={354 + i * 90} w={110} o={0.6} />
          <Line x={498} y={372 + i * 90} w={70} o={0.25} />
        </g>
      ))}
      <Frame x={780} y={140} w={280} h={480} r={30} />
      <rect x={800} y={170} width="240" height="300" rx="18" fill="#fff" fillOpacity="0.05" />
      <path d="M920 210 c-50 0 -80 50 -80 100 v 140 h 160 v -140 c 0 -50 -30 -100 -80 -100z" fill={accent} fillOpacity="0.75" />
      <Line x={800} y={500} w={140} o={0.8} />
      <Line x={800} y={522} w={90} o={0.3} />
      <rect x={800} y={550} width="240" height="44" rx="22" fill="#fff" fillOpacity="0.92" />
    </g>
  );
}

function Banking({ accent }: { accent: string }) {
  return (
    <g>
      <Frame x={90} y={110} w={720} h={520} r={22} />
      <rect x={90} y={110} width="180" height="520" rx="22" fill="#fff" fillOpacity="0.03" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Line key={i} x={120} y={170 + i * 42} w={i === 0 ? 100 : 80} o={i === 0 ? 0.85 : 0.3} />
      ))}
      <Line x={310} y={150} w={200} o={0.85} />
      <rect x={310} y={190} width="220" height="130" rx="16" fill={accent} fillOpacity="0.92" />
      <text x={330} y={270} fill="#05050C" fontSize="40" fontFamily="var(--font-display), Impact" letterSpacing="1">
        •••• 4921
      </text>
      <rect x={550} y={190} width="230" height="130" rx="16" fill="#fff" fillOpacity="0.06" stroke="#fff" strokeOpacity="0.14" />
      <Line x={570} y={216} w={90} o={0.3} />
      <text x={570} y={280} fill="#fff" fontSize="40" fontFamily="var(--font-display), Impact" letterSpacing="1">
        ₦1,240,500
      </text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={310} y={350 + i * 62} width="470" height="1" fill="#fff" fillOpacity="0.12" />
          <circle cx={328} cy={378 + i * 62} r="12" fill="#fff" fillOpacity="0.2" />
          <Line x={356} y={368 + i * 62} w={140} o={0.6} />
          <Line x={356} y={386 + i * 62} w={80} o={0.25} />
          <Line x={700} y={374 + i * 62} w={70} o={0.7} />
        </g>
      ))}
      {/* USSD feature phone screen */}
      <Frame x={870} y={180} w={220} h={380} r={20} />
      <rect x={890} y={200} width="180" height="240" rx="8" fill="#101a10" stroke={accent} strokeOpacity="0.3" />
      {["*565#", "1. Balance", "2. Transfer", "3. Airtime", "4. Bills"].map((t, i) => (
        <text key={t} x={904} y={232 + i * 34} fill={accent} fontSize="18" fontFamily="ui-monospace, monospace" fillOpacity={i === 0 ? 1 : 0.7}>
          {t}
        </text>
      ))}
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={900 + c * 56} y={460 + r * 28} width="44" height="18" rx="4" fill="#fff" fillOpacity="0.1" />
        )),
      )}
    </g>
  );
}
