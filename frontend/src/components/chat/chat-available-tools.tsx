import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { PromptInputButton } from "../ai-elements/prompt-input";
import { LucideSettings2 } from "lucide-react";
import { availableTools, AvailableToolType } from "@/lib/tools";
import { useState } from "react";

export const ChatAvailableTools = ({
  onSelectTool,
}: {
  onSelectTool: (tool: AvailableToolType) => void;
}) => {
  const [toolsOpen, setToolsOpen] = useState<boolean>(false);

  return (
    <Popover open={toolsOpen} onOpenChange={setToolsOpen}>
      <PopoverTrigger asChild>
        <PromptInputButton
          className="text-muted-foreground"
          size="sm"
          variant="outline"
        >
          <LucideSettings2 size={16} />
          Tools
        </PromptInputButton>
      </PopoverTrigger>
      <PopoverContent className="w-48 px-1.5 py-2 drop-shadow-sm" align="start">
        <ul className="space-y-px">
          {availableTools?.map((tool) => {
            const Icon = tool.icon;
            return (
              <li key={tool.type}>
                <button
                  className="w-full flex items-center gap-1 p-2 rounded-md hover:bg-accent text-left text-sm transition-colors "
                  onClick={() => {
                    onSelectTool(tool);
                    setToolsOpen(false);
                  }}
                >
                  <Icon size={14} className="text-muted-foreground" />
                  {tool.name}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
