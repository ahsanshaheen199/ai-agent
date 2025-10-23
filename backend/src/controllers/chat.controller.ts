import {
	BadRequestError,
	Controller,
	Get,
	NotFoundError,
	Param,
	Post,
	UseBefore,
} from 'routing-controllers';
import { Response } from 'express';
import { Res, Body, Req } from 'routing-controllers';
import { Service } from 'typedi';
import { type UIMessage, type UIMessagePart, type UITools } from 'ai';
import { authCheckMiddleware } from '@/middlewares/auth-check.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { CreateChatDto } from '@/dtos/create-chat.dto';
import { ChatService } from '@/services/chat.service';
import { LLMService } from '@/services/llm.service';
import { User } from '@/database/entities/user.entity';
import { MessageService } from '@/services/message.service';
import { generateUlid } from '@/utlis';

@Service()
@Controller('/chats')
@UseBefore(authCheckMiddleware)
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly llmService: LLMService,
		private readonly messageService: MessageService
	) {}

	@Post('/')
	@UseBefore(validationMiddleware(CreateChatDto))
	async createChat(
		@Body() body: CreateChatDto,
		@Req() req: Request & { user: User },
		@Res() res: Response
	) {
		const { message, selectedModelId, selectedToolName, id } = body;

		try {
			const chat = await this.chatService.findChatById(id);

			if (!chat) {
				const title =
					await this.llmService.generateTitleForNewChat(message);

				await this.chatService.createChat(id, title, req.user);
			}

			const messages =
				await this.messageService.findAllMessagesByChatId(id);
			const uiMessages: UIMessage[] = messages.map((m) => ({
				id: m.id,
				role: m.role as 'user' | 'assistant' | 'system',
				parts: m.parts as unknown as UIMessagePart<UITools, UITools>[],
				metadata: {
					createdAt: m.createdAt,
				},
			}));

			await this.messageService.createMessage(message, id);

			const result = this.llmService.generateMessagesStream(
				selectedModelId,
				[...uiMessages, message],
				req.user,
				selectedToolName
			);

			result.pipeUIMessageStreamToResponse(res, {
				generateMessageId: () => generateUlid(),
				onFinish: ({ messages }) => {
					messages.forEach(async (message) => {
						await this.messageService.createMessage(message, id);
					});
				},
				sendSources: true,
			});
		} catch (error) {
			throw new BadRequestError(error);
		}
	}

	@Get('/')
	async getChats(@Req() req: Request & { user: User }, @Res() res: Response) {
		const chats = await this.chatService.findAllChatsByUserId(req.user.id);
		return res.status(200).json({
			message: 'Chats fetched successfully',
			data: {
				chats,
			},
		});
	}

	@Get('/:id')
	async getChatById(@Param('id') id: string, @Res() res: Response) {
		const chat = await this.chatService.findChatById(id);
		if (!chat) {
			throw new NotFoundError('Chat not found');
		}
		return res.status(200).json({
			message: 'Chat fetched successfully',
			data: {
				chat,
			},
		});
	}
}
