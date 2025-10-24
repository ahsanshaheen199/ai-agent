import { chatModelOptions } from "@/lib/models";
import {
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
} from "../ai-elements/prompt-input";

export const ModelSelector = ({
  selectedModelId,
  onSelect,
}: {
  selectedModelId: string;
  onSelect: (value: string) => void;
}) => {
  return (
    <PromptInputModelSelect
      value={selectedModelId}
      onValueChange={(value) => {
        onSelect(value);
      }}
    >
      <PromptInputModelSelectTrigger>
        <PromptInputModelSelectValue />
      </PromptInputModelSelectTrigger>
      <PromptInputModelSelectContent>
        {chatModelOptions.map((model) => (
          <PromptInputModelSelectItem key={model.value} value={model.value}>
            {model.label}
          </PromptInputModelSelectItem>
        ))}
      </PromptInputModelSelectContent>
    </PromptInputModelSelect>
  );
};
