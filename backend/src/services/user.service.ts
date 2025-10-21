import { appDataSource } from '@/config/database.config';
import { User } from '@/database/entities/user.entity';
import { RegisterDto } from '@/dtos/register.dto';
import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Subscription } from '@/database/entities/subscription.entity';
import bcrypt from 'bcrypt';
import { LoginDto } from '@/dtos/login.dto';

@Service()
export class UserService {
	private userRepository: Repository<User>;
	constructor() {
		this.userRepository = appDataSource.getRepository(User);
	}

	async createUser(registerDto: RegisterDto) {
		const existingUser = await this.userRepository.findOne({
			where: { email: registerDto.email },
		});

		if (existingUser) {
			throw new BadRequestError('User already exists');
		}

		const queryRunner = appDataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const userRepository = queryRunner.manager.getRepository(User);
			const subscriptionRepository =
				queryRunner.manager.getRepository(Subscription);

			const newUser = userRepository.create({
				email: registerDto.email,
				firstName: registerDto.firstName,
				lastName: registerDto.lastName,
				password: registerDto.password,
			});
			const savedUser = await userRepository.save(newUser);

			const subscription = subscriptionRepository.create({
				planName: 'free',
				status: 'active',
				user: savedUser,
			});

			await subscriptionRepository.save(subscription);

			await userRepository.save(savedUser);

			await queryRunner.commitTransaction();
			return savedUser;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new BadRequestError(error);
		} finally {
			await queryRunner.release();
		}
	}

	async loginUser(loginDto: LoginDto) {
		const user = await this.userRepository.findOne({
			where: { email: loginDto.email },
		});

		if (!user) {
			throw new BadRequestError('Invalid email or password');
		}

		const isPasswordValid = await bcrypt.compare(
			loginDto.password,
			user.password
		);

		if (!isPasswordValid) {
			throw new BadRequestError('Invalid email or password');
		}

		return user;
	}
}
