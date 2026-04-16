import type { CSSProperties } from "react";
import type { BeddingConfig } from "./bedding-config";
import "./bedding-demo.css";
import { BeddingFontWrapper } from "./BeddingFontWrapper";
import { BeddingHomeView } from "./BeddingHomeView";

export default function BeddingTemplate({
  config,
}: {
  config?: BeddingConfig;
}) {
  const accent = config?.primaryColor ?? "#29378c";
  const rootStyle = {
    "--bedding-accent": accent,
    fontFamily: "var(--font-bedding-body), system-ui, sans-serif",
  } as CSSProperties;
  return (
    <BeddingFontWrapper className="min-h-screen overflow-x-hidden antialiased">
      <div className="bedding-demo-root min-h-screen" style={rootStyle}>
        <BeddingHomeView config={config} />
      </div>
    </BeddingFontWrapper>
  );
}
