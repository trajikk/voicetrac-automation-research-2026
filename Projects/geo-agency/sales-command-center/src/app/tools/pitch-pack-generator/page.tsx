import { tools } from "@/lib/mock-data";
import { toolIcons } from "@/lib/tool-icons";
import { ToolPlaceholder } from "@/components/glass/tool-placeholder";

export default function PitchPackGeneratorPage() {
  const tool = tools.find((t) => t.id === "tl-001")!;
  return (
    <ToolPlaceholder
      name={tool.name}
      description={tool.description}
      icon={toolIcons[tool.icon]}
      accent={tool.accent}
      status={tool.status}
    />
  );
}
