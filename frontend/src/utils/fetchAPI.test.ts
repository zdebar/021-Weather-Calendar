// convertToDegrees.test.ts
import { describe, it, expect } from 'vitest';
import { convertToDegrees } from './fetchAPI';

describe('convertToDegrees', () => {
  it('should convert 12:00 AM to 0 degrees', () => {
    expect(convertToDegrees('12:00 AM')).toBe(0);
  });

  it('should convert 1:00 AM to 15 degrees', () => {
    expect(convertToDegrees('1:00 AM')).toBe(15);
  });

  it('should convert 12:00 PM to 720 degrees', () => {
    expect(convertToDegrees('12:00 PM')).toBe(180);
  });

  it('should convert 1:00 PM to 735 degrees', () => {
    expect(convertToDegrees('1:00 PM')).toBe(195);
  });

  it('should convert 3:15 PM to 945 degrees', () => {
    expect(convertToDegrees('3:15 PM')).toBe(228.75);
  });

  it('should convert 6:30 AM to 97.5 degrees', () => {
    expect(convertToDegrees('6:30 AM')).toBe(97.5);
  });
});
