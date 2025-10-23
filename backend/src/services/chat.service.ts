import { Chat } from '@/database/entities/chat.entity';
import { Repository } from 'typeorm';
import { appDataSource } from '@/config/database.config';
import { Service } from 'typedi';
import { User } from '@/database/entities/user.entity';

@Service()
export class ChatService {
	private chatRepository: Repository<Chat>;
	constructor() {
		this.chatRepository = appDataSource.getRepository(Chat);
	}

	async findChatById(id: string) {
		return await this.chatRepository.findOne({
			where: { id },
			relations: {
				messages: true,
			},
		});
	}

	async createChat(id: string, title: string, user: User) {
		const chat = this.chatRepository.create({
			id: id,
			title: title,
			user: user,
		});
		return this.chatRepository.save(chat);
	}

	async findAllChatsByUserId(userId: string) {
		return await this.chatRepository.find({
			where: { user: { id: userId } },
			order: { createdAt: 'DESC' },
		});
	}
}
