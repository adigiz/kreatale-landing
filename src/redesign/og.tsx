import { ImageResponse } from "next/og";
import { OG_CHARS, OG_LOGO } from "./og-assets";

/** Social preview cards (Open Graph / Twitter) in the redesign's look. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BLUE = "#0061FF";
const INK = "#0A0A0A";
const PAPER = "#F3F6FF";

type Weight = 600 | 800;
const fontCache = new Map<Weight, Promise<ArrayBuffer | null>>();

/** Plus Jakarta Sans as TTF (what the image renderer needs). Falls back to the built-in font if offline. */
function jakarta(weight: Weight) {
  if (!fontCache.has(weight)) {
    fontCache.set(
      weight,
      (async () => {
        try {
          const css = await (
            await fetch(`https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@${weight}`)
          ).text();
          const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
          return url ? await (await fetch(url)).arrayBuffer() : null;
        } catch {
          return null;
        }
      })(),
    );
  }
  return fontCache.get(weight)!;
}

async function fonts() {
  const [bold, semi] = await Promise.all([jakarta(800), jakarta(600)]);
  return [
    ...(bold ? [{ name: "Jakarta", data: bold, weight: 800 as const, style: "normal" as const }] : []),
    ...(semi ? [{ name: "Jakarta", data: semi, weight: 600 as const, style: "normal" as const }] : []),
  ];
}

const SWIRL = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 640"><path d="M 300 -20 C 120 40, 60 200, 170 270 C 280 340, 330 200, 240 170 C 110 130, 20 300, 90 420 C 150 530, 300 510, 290 600 C 285 640, 260 660, 240 680" fill="none" stroke="${BLUE}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
).toString("base64")}`;

type CharName = keyof typeof OG_CHARS;

function Frame({ children, chars }: { children: React.ReactNode; chars: CharName[] }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: PAPER, fontFamily: "Jakarta", color: INK }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={SWIRL} width={260} height={520} style={{ position: "absolute", right: -40, top: 40 }} alt="" />
      <div style={{ position: "absolute", right: 48, bottom: 0, display: "flex", alignItems: "flex-end", gap: 6 }}>
        {chars.map((c) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={c} src={OG_CHARS[c].src} width={OG_CHARS[c].w * 0.86} height={OG_CHARS[c].h * 0.86} alt="" />
        ))}
      </div>
      <div style={{ position: "absolute", left: 64, top: 52, display: "flex", alignItems: "center", gap: 18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={OG_LOGO} width={98} height={62} alt="" />
      </div>
      <div style={{ position: "absolute", left: 64, bottom: 50, fontSize: 24, fontWeight: 600, color: "#4B5563", display: "flex" }}>
        kreatale.com
      </div>
      {children}
    </div>
  );
}

function Sticker({ text, dark = true, rotate = -6 }: { text: string; dark?: boolean; rotate?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        background: dark ? INK : BLUE,
        color: "#FFFFFF",
        fontSize: 26,
        fontWeight: 600,
        padding: "12px 24px",
        borderRadius: 999,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {text}
    </div>
  );
}

/** A main page: the page's headline, two lines, the second in blue. */
export async function pageCard(opts: { lines: [string, string]; sticker: string; chars?: CharName[] }) {
  const { lines, sticker, chars = ["dreamer", "maker"] } = opts;
  // fit the longest line on one row in ~640px (bold uppercase runs about 0.66em per character)
  const longest = Math.max(lines[0].length, lines[1].length);
  const size = Math.min(112, Math.floor(640 / (longest * 0.66)));
  return new ImageResponse(
    (
      <Frame chars={chars}>
        <div style={{ position: "absolute", left: 64, top: 180, width: 700, display: "flex", flexDirection: "column", gap: 26 }}>
          <Sticker text={sticker} />
          <div style={{ display: "flex", flexDirection: "column", fontWeight: 800, fontSize: size, lineHeight: 0.9, letterSpacing: "-0.06em", textTransform: "uppercase" }}>
            <span style={{ whiteSpace: "nowrap" }}>{lines[0]}</span>
            <span style={{ color: BLUE, whiteSpace: "nowrap" }}>{lines[1]}</span>
          </div>
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}

/** A blog post: its title, with the category as a sticker. */
export async function postCard(opts: { title: string; category?: string; date?: string }) {
  const { title, category, date } = opts;
  const size = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;
  return new ImageResponse(
    (
      <Frame chars={["dreamer"]}>
        <div style={{ position: "absolute", left: 64, top: 160, width: 820, display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Sticker text="Blog" rotate={-4} />
            {category ? <Sticker text={category} dark={false} rotate={3} /> : null}
          </div>
          <div style={{ display: "flex", fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.045em" }}>{title}</div>
          {date ? <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: "#4B5563" }}>{date}</div> : null}
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
