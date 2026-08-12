import { tools } from "@/lib/mock-data";
import { ToolCard } from "@/components/glass/tool-card";

export default function ToolsHubPage() {
  const activeCount = tools.filter((t) => t.status === "active").length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Tools Hub</h2>
        <p className="text-sm text-muted-foreground">
          {activeCount} active tools to help you sell and deliver GEO / AI visibility faster.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
