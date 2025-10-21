import { User } from '@/database/entities/user.entity';
import { Service } from 'typedi';
import { appConfig } from '@/config/app.config';
import jwt from 'jsonwebtoken';

@Service()
export class JwtService {
	async generateJwtToken(user: User) {
		return jwt.sign({ id: user.id }, appConfig.JWT_SECRET, {
			expiresIn: '7d',
		});
	}
}
