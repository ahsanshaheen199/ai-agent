import { Message, Role } from '@/database/entities/message.entity';
import { Repository } from 'typeorm';
import { appDataSource } from '@/config/database.config';
import { Service } from 'typedi';
import { NotFoundError } from 'routing-controllers';
import { ChatService } from './chat.service';
import { UIMessage } from 'ai';

@Service()
export class MessageService {
	private messageRepository: Repository<Message>;
	constructor(private readonly chatService: ChatService) {
		this.messageRepository = appDataSource.getRepository(Message);
	}

	async findAllMessagesByChatId(chatId: string) {
		return await this.messageRepository.find({
			where: { chat: { id: chatId } },
			order: { createdAt: 'DESC' },
		});
	}

	async createMessage(message: UIMessage, chatId: string) {
		const chat = await this.chatService.findChatById(chatId);
		if (!chat) {
			throw new NotFoundError('Chat not found');
		}

		const newMessage = this.messageRepository.create({
			parts: JSON.parse(JSON.stringify(message.parts)),
			role: message.role as Role,
			chat,
		});
		return await this.messageRepository.save(newMessage);
	}
}
