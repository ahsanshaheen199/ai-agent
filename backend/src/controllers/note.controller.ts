import { NoteService } from '@/services/note.service';
import {
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	QueryParams,
	Req,
	UseBefore,
} from 'routing-controllers';
import { Response } from 'express';
import { Body, Res } from 'routing-controllers';
import { Service } from 'typedi';
import { CreateNoteDto } from '@/dtos/create-note.dto';
import { UpdateNoteDto } from '@/dtos/update-note.dto';
import { PaginationDto } from '@/dtos/pagination.dto';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { authCheckMiddleware } from '@/middlewares/auth-check.middleware';
import { User } from '@/database/entities/user.entity';

@Service()
@Controller('/notes')
@UseBefore(authCheckMiddleware)
export class NoteController {
	constructor(private readonly noteService: NoteService) {}

	@Post('/')
	@UseBefore(validationMiddleware(CreateNoteDto))
	async createNote(
		@Body() body: CreateNoteDto,
		@Res() res: Response,
		@Req() req: Request & { user: User }
	) {
		const note = await this.noteService.createNote(body, req.user);
		return res.status(201).json({
			message: 'Note created successfully',
			data: { note },
		});
	}

	@Patch('/:id')
	@UseBefore(validationMiddleware(UpdateNoteDto))
	async updateNote(
		@Param('id') id: string,
		@Body() body: UpdateNoteDto,
		@Res() res: Response,
		@Req() req: Request & { user: User }
	) {
		const note = await this.noteService.updateNote(id, body, req.user);
		return res.status(200).json({
			message: 'Note updated successfully',
			data: { note },
		});
	}

	@Get('/')
	async getAllNotes(
		@Res() res: Response,
		@Req() req: Request & { user: User },
		@QueryParams() paginationDto: PaginationDto
	) {
		const result = await this.noteService.getAllNotes(
			req.user,
			paginationDto
		);
		return res.status(200).json({
			message: 'Notes fetched successfully',
			data: result,
		});
	}

	@Get('/:id')
	async getNoteById(
		@Param('id') id: string,
		@Res() res: Response,
		@Req() req: Request & { user: User }
	) {
		const note = await this.noteService.getNoteById(id, req.user);
		return res.status(200).json({
			message: 'Note fetched successfully',
			data: { note },
		});
	}

	@Delete('/:id')
	async deleteNote(
		@Param('id') id: string,
		@Res() res: Response,
		@Req() req: Request & { user: User }
	) {
		await this.noteService.deleteNote(id, req.user);
		return res.status(200).json({
			message: 'Note deleted successfully',
		});
	}
}
