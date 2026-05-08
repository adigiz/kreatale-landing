import { cn } from "@/lib/utils";
import type { MaximaConfig } from "./maxima-config";
import "./maxima-design-tokens.css";
import MaximaDemoShell from "./MaximaDemoShell";

export default function MaximaTemplate({ config }: { config?: MaximaConfig }) {
  return (
    <div className={cn("maxima-demo-root min-h-screen")}>
      <MaximaDemoShell config={config} />
    </div>
  );
}
