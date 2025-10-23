export type Model = {
	id: string;
	name: string;
	description: string;
};

export const chatModels = [
	{
		id: 'anthropic/claude-sonnet-4',
		name: 'Claude Sonnet 4',
		description: "Anthropic's flagship model for advanced conversations",
	},
	{
		id: 'xai/grok-4', // Updated to actual available model
		name: 'Grok 4',
		description:
			"xAI's most intelligent model with tool use and real-time search",
	},
	{
		id: 'openai/gpt-4.1',
		name: 'GPT-4 Chat',
		description: 'Latest OpenAI GPT-5 optimized for dialogue and reasoning',
	},
	{
		id: 'google/gemini-2.5-flash',
		name: 'Gemini 2.5 Flash',
		description: "Google's fast experimental multimodal reasoning model",
	},
];

export const chatModelOptions = chatModels.map((model) => ({
	label: model.name,
	value: model.id,
}));
