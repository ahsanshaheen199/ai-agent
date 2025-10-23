import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUIMessage', async: false })
export class IsUIMessageConstraint implements ValidatorConstraintInterface {
	validate(value: unknown): boolean {
		// Check if value is an object
		if (typeof value !== 'object' || value === null) {
			return false;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const val = value as any;

		// Check required properties
		if (!('id' in val) || typeof val.id !== 'string') {
			return false;
		}

		if (
			!('role' in val) ||
			!['system', 'user', 'assistant'].includes(val.role)
		) {
			return false;
		}

		if (!('parts' in val) || !Array.isArray(val.parts)) {
			return false;
		}

		// Validate parts array
		if (val.parts.length === 0) {
			return false;
		}

		// Validate each part
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		for (const part of val.parts as any[]) {
			if (typeof part !== 'object' || part === null) {
				return false;
			}

			if (!('type' in part) || typeof part.type !== 'string') {
				return false;
			}

			// Validate based on part type
			switch (part.type) {
				case 'text':
					if (!('text' in part) || typeof part.text !== 'string') {
						return false;
					}
					if (
						part.state &&
						!['streaming', 'done'].includes(part.state)
					) {
						return false;
					}
					break;

				case 'reasoning':
					if (!('text' in part) || typeof part.text !== 'string') {
						return false;
					}
					if (
						part.state &&
						!['streaming', 'done'].includes(part.state)
					) {
						return false;
					}
					break;

				case 'file':
					if (
						!('mediaType' in part) ||
						typeof part.mediaType !== 'string'
					) {
						return false;
					}
					if (!('url' in part) || typeof part.url !== 'string') {
						return false;
					}
					break;

				case 'source-url':
					if (
						!('sourceId' in part) ||
						typeof part.sourceId !== 'string'
					) {
						return false;
					}
					if (!('url' in part) || typeof part.url !== 'string') {
						return false;
					}
					break;

				case 'source-document':
					if (
						!('sourceId' in part) ||
						typeof part.sourceId !== 'string'
					) {
						return false;
					}
					if (
						!('mediaType' in part) ||
						typeof part.mediaType !== 'string'
					) {
						return false;
					}
					if (!('title' in part) || typeof part.title !== 'string') {
						return false;
					}
					break;

				case 'step-start':
					// No additional validation needed
					break;

				default:
					// For tool and data parts, check the dynamic naming convention
					if (part.type.startsWith('tool-')) {
						if (
							!('toolCallId' in part) ||
							typeof part.toolCallId !== 'string'
						) {
							return false;
						}
						if (
							!('state' in part) ||
							![
								'input-streaming',
								'input-available',
								'output-available',
								'output-error',
							].includes(part.state)
						) {
							return false;
						}
					} else if (part.type.startsWith('data-')) {
						if (!('data' in part) || part.data === undefined) {
							return false;
						}
					} else {
						// Unknown part type
						return false;
					}
			}
		}

		// Optional: validate metadata if present
		if (
			'metadata' in val &&
			val.metadata !== undefined &&
			typeof val.metadata !== 'object'
		) {
			return false;
		}

		return true;
	}

	defaultMessage(args: ValidationArguments): string {
		return `${args.property} must be a valid UIMessage with required properties: id (string), role ('system' | 'user' | 'assistant'), and parts (array of valid UIMessagePart)`;
	}
}

/**
 * Decorator to validate UIMessage type from Vercel AI SDK
 *
 * @example
 * ```typescript
 * import { ValidateUIMessage } from '@/decorators/validate-ui-message.decorator';
 *
 * export class CreateChatDto {
 *   @IsString()
 *   @IsNotEmpty()
 *   id: string;
 *
 *   @ValidateUIMessage()
 *   message: UIMessage;
 * }
 * ```
 */
export function ValidateUIMessage(
	validationOptions?: ValidationOptions
): PropertyDecorator {
	return function (target: object, propertyKey: string | symbol | undefined) {
		registerDecorator({
			target: target.constructor,
			propertyName: propertyKey as string,
			constraints: [],
			options: validationOptions,
			validator: IsUIMessageConstraint,
		});
	};
}
