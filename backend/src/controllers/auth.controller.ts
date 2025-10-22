import { UserService } from '@/services/user.service';
import { Controller, Get, Post, Req, UseBefore } from 'routing-controllers';
import { Response } from 'express';
import { Body, Res } from 'routing-controllers';
import { Service } from 'typedi';
import { RegisterDto } from '@/dtos/register.dto';
import { LoginDto } from '@/dtos/login.dto';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { JwtService } from '@/services/jwt.service';
import { authCheckMiddleware } from '@/middlewares/auth-check.middleware';
import { User } from '@/database/entities/user.entity';

@Service()
@Controller('/auth')
export class AuthController {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	@Post('/register')
	@UseBefore(validationMiddleware(RegisterDto))
	async register(@Body() body: RegisterDto, @Res() res: Response) {
		const user = await this.userService.createUser(body);
		const token = await this.jwtService.generateJwtToken(user);
		return res.status(201).json({
			message: 'User created successfully',
			data: { user, token },
		});
	}

	@Post('/login')
	@UseBefore(validationMiddleware(LoginDto))
	async login(@Body() body: LoginDto, @Res() res: Response) {
		const user = await this.userService.loginUser(body);
		const token = await this.jwtService.generateJwtToken(user);
		return res.status(200).json({
			message: 'Login successful',
			data: { user, token },
		});
	}

	@Get('/me')
	@UseBefore(authCheckMiddleware)
	async forgotPassword(
		@Res() res: Response,
		@Req() req: Request & { user: User }
	) {
		const userId = req.user.id;
		const user = await this.userService.currentUser(userId);
		return res.status(200).json({
			message: 'User fetched successfully',
			data: { user },
		});
	}
}
