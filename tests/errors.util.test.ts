import { getErrorMessage } from '@/lib/errors';

describe('getErrorMessage', () => {
  it('handles Error instances', () => {
    expect(getErrorMessage(new Error('Boom'))).toBe('Boom');
  });
  it('handles string values', () => {
    expect(getErrorMessage('oops')).toBe('oops');
  });
  it('serializes non-string objects', () => {
    expect(getErrorMessage({ a: 1 })).toBe(JSON.stringify({ a: 1 }));
  });
});
