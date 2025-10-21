import { UserService } from '@/services/user.service';
import { Controller, Post, UseBefore } from 'routing-controllers';
import { Response } from 'express';
import { Body, Res } from 'routing-controllers';
import { Service } from 'typedi';
import { RegisterDto } from '@/dtos/register.dto';
import { LoginDto } from '@/dtos/login.dto';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { JwtService } from '@/services/jwt.service';

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
}
