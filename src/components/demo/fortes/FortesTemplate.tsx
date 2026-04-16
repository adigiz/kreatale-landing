import type { FortesConfig } from "./fortes-config";
import "./fortes-demo.css";
import FortesDemoShell from "./FortesDemoShell";

export default function FortesTemplate({ config }: { config?: FortesConfig }) {
  return (
    <div className="fortes-demo-root min-h-screen overflow-x-clip">
      <FortesDemoShell config={config} />
    </div>
  );
}
