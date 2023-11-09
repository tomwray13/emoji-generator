import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class EmojiValidationPipe implements PipeTransform {
  transform(value?: string) {
    if (!value) return;
    console.log(`Pipe: pre-validation value: ${value}`);
    const index = parseInt(value, 10);

    if (isNaN(index)) {
      throw new BadRequestException('Emoji index must be a number.');
    }

    if (index < 0 || index >= 14) {
      // As there are 14 emojis in your list.
      throw new BadRequestException('Emoji index out of range.');
    }
    console.log(`Pipe: post-validation value: ${value}`);
    return index;
  }
}
