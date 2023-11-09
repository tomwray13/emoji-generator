import { BadRequestException } from '@nestjs/common';
import { EmojiValidationPipe } from './emoji-validation.pipe';

describe('EmojiValidationPipe', () => {
  const emohiValidationPipe = new EmojiValidationPipe();
  it('should be defined', () => {
    expect(emohiValidationPipe).toBeDefined();
  });

  it(`should return undefined when no value is passed`, () => {
    const result = emohiValidationPipe.transform();
    expect(result).toBe(undefined);
  });

  it(`should throw error when no value is not a number`, () => {
    const result = () => emohiValidationPipe.transform(`string`);
    expect(result).toThrow(BadRequestException);
  });

  it(`should throw error when no value is outside of range`, () => {
    const result = () => emohiValidationPipe.transform(`99`);
    expect(result).toThrow(BadRequestException);
  });

  it(`should return number when value is valid`, () => {
    const result = emohiValidationPipe.transform(`5`);
    expect(result).toBe(5);
  });
});
