import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
	@IsString()
	@IsOptional()
	firstName: string;

	@IsString()
	@IsOptional()
	lastName: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
