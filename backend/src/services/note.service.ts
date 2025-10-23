import { appDataSource } from '@/config/database.config';
import { Note } from '@/database/entities/note.entity';
import { User } from '@/database/entities/user.entity';
import { CreateNoteDto } from '@/dtos/create-note.dto';
import { UpdateNoteDto } from '@/dtos/update-note.dto';
import { PaginationDto } from '@/dtos/pagination.dto';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { Service } from 'typedi';
import { ILike, Repository } from 'typeorm';

@Service()
export class NoteService {
	private noteRepository: Repository<Note>;
	private userRepository: Repository<User>;
	constructor() {
		this.noteRepository = appDataSource.getRepository(Note);
		this.userRepository = appDataSource.getRepository(User);
	}

	async createNote(createNoteDto: CreateNoteDto, user: User) {
		const existingUser = await this.userRepository.findOne({
			where: { id: user.id },
		});

		if (!existingUser) {
			throw new NotFoundError('User not found.');
		}

		try {
			const newNote = this.noteRepository.create({
				title: createNoteDto.title,
				content: createNoteDto.content,
				user: user,
			});

			const savedNote = await this.noteRepository.save(newNote);
			return savedNote;
		} catch (error) {
			throw new BadRequestError(error);
		}
	}

	async updateNote(id: string, updateNoteDto: UpdateNoteDto, user: User) {
		const note = await this.noteRepository.findOne({
			where: { id },
			relations: ['user'],
		});

		if (!note) {
			throw new NotFoundError('Note not found.');
		}

		if (note.user.id !== user.id) {
			throw new BadRequestError(
				'You are not authorized to update this note.'
			);
		}

		try {
			if (updateNoteDto.title !== undefined) {
				note.title = updateNoteDto.title;
			}
			if (updateNoteDto.content !== undefined) {
				note.content = updateNoteDto.content;
			}

			const updatedNote = await this.noteRepository.save(note);
			return updatedNote;
		} catch (error) {
			throw new BadRequestError(error);
		}
	}

	async getNoteById(id: string, user: User) {
		const note = await this.noteRepository.findOne({
			where: { id },
			relations: ['user'],
		});

		if (!note) {
			throw new NotFoundError('Note not found.');
		}

		if (note.user.id !== user.id) {
			throw new BadRequestError(
				'You are not authorized to access this note.'
			);
		}

		return note;
	}

	async getAllNotes(user: User, paginationDto: PaginationDto) {
		const page = paginationDto.page || 1;
		const limit = paginationDto.limit || 10;
		const skip = (page - 1) * limit;

		try {
			const [notes, total] = await this.noteRepository.findAndCount({
				where: { user: { id: user.id } },
				order: { createdAt: 'DESC' },
				skip,
				take: limit,
			});

			return {
				notes,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			};
		} catch (error) {
			throw new BadRequestError(error);
		}
	}

	async deleteNote(id: string, user: User) {
		const note = await this.noteRepository.findOne({
			where: { id },
			relations: ['user'],
		});

		if (!note) {
			throw new NotFoundError('Note not found.');
		}

		if (note.user.id !== user.id) {
			throw new BadRequestError(
				'You are not authorized to delete this note.'
			);
		}

		try {
			await this.noteRepository.remove(note);
			return { message: 'Note deleted successfully' };
		} catch (error) {
			throw new BadRequestError(error);
		}
	}

	async searchNotes(query: string, limit: number, user: User) {
		return await this.noteRepository.find({
			where: [
				{ user: { id: user.id } },
				{ title: ILike(`%${query}%`), content: ILike(`%${query}%`) },
			],
			order: { createdAt: 'DESC' },
			take: limit,
			select: {
				id: true,
				title: true,
				content: true,
				createdAt: true,
			},
		});
	}
}
