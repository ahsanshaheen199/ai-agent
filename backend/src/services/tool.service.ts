import { User } from '@/database/entities/user.entity';
import { tool } from 'ai';
import { z } from 'zod';
import { Service } from 'typedi';
import { NoteService } from './note.service';

@Service()
export class ToolService {
	constructor(private readonly noteService: NoteService) {}

	createNote(user: User) {
		return tool({
			inputSchema: z.object({
				title: z.string().describe('The title of the note'),
				content: z.string().describe('The content/body of the note'),
			}),
			execute: async ({ title, content }) => {
				try {
					const note = await this.noteService.createNote(
						{ title, content },
						user
					);
					return {
						success: true,
						message: `Note "${title}" created successfully with ID: ${note.id}`,
						noteId: note.id,
						title: note.title,
						content: note.content,
					};
				} catch (error) {
					return {
						success: false,
						message: 'Failed to create note..',
						error:
							error instanceof Error
								? error.message
								: 'Unknow error',
					};
				}
			},
			description:
				'Create a note or Save to Note with title and content .  Use this when the user asks to create, save, or make a note.',
		});
	}

	searchNotes(user: User) {
		return tool({
			description:
				"Search through the user's notes by keywords in title or content. Use this when the user asks to find or search or lookup notes.",
			inputSchema: z.object({
				query: z.string().describe('Search query to find in notes'),
				limit: z
					.number()
					.optional()
					.describe('Maximum number of resultes (default 10)'),
			}),
			execute: async ({ query, limit = 10 }) => {
				try {
					const notes = await this.noteService.searchNotes(
						query,
						limit,
						user
					);
					return {
						success: true,
						message: `Found ${notes.length} notes matching "${query}"`,
						notes: notes,
					};
				} catch (error) {
					return {
						success: false,
						message: 'Failed to search notes..',
						error:
							error instanceof Error
								? error.message
								: 'Unknown error',
					};
				}
			},
		});
	}
}
