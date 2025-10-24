import { LucideFilePlus, LucideIcon, LucideSearch } from "lucide-react";

export const ToolNameEnum = {
  CreateNote: "createNote",
  SearchNote: "searchNote",
} as const;

export type ToolNameType = (typeof ToolNameEnum)[keyof typeof ToolNameEnum];

export const ToolTypeEnum = {
  CreateNote: "tool-createNote",
  SearchNote: "tool-searchNote",
} as const;

export type ToolType = (typeof ToolTypeEnum)[keyof typeof ToolTypeEnum];

export interface AvailableToolType {
  toolName: ToolNameType;
  type: ToolType;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const availableTools: AvailableToolType[] = [
  {
    toolName: ToolNameEnum.CreateNote,
    type: ToolTypeEnum.CreateNote,
    name: "Create Note",
    description: "Create a new note with a title and content",
    icon: LucideFilePlus,
  },
  {
    toolName: ToolNameEnum.SearchNote,
    type: ToolTypeEnum.SearchNote,
    name: "Search Note",
    description: "Search your saved notes for relevant information",
    icon: LucideSearch,
  },
];
