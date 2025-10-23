import { type UIMessage } from 'ai';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ValidateUIMessage } from '@/decorators/validate-ui-message.decorator';
import { chatModelOptions } from '@/lib/models';

export class CreateChatDto {
	@IsString()
	@IsNotEmpty()
	id: string;

	@ValidateUIMessage()
	message: UIMessage;

	@IsString()
	@IsIn(chatModelOptions.map((model) => model.value), {
		message: 'Invalid model',
	})
	@IsNotEmpty()
	selectedModelId: string;

	@IsString()
	@IsOptional()
	selectedToolName?: string;
}
