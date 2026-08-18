import { describe, it, expect } from 'vitest';
import { getTranslation, LOCALES, SupportedLocale } from '../../src/i18n/index.js';

describe('Internationalization (i18n) Engine', () => {
  const supportedLocales: SupportedLocale[] = ['en', 'es', 'zh', 'ja', 'de', 'hi'];

  it('should support all 6 global languages', () => {
    for (const locale of supportedLocales) {
      expect(LOCALES[locale]).toBeDefined();
      expect(LOCALES[locale].tagline).toBeDefined();
      expect(LOCALES[locale].initSuccess).toBeDefined();
    }
  });

  it('should return correct translation by locale', () => {
    expect(getTranslation('tagline', 'en')).toBe('Make the code fit the project.');
    expect(getTranslation('tagline', 'es')).toContain('código');
    expect(getTranslation('tagline', 'zh')).toContain('代码');
    expect(getTranslation('tagline', 'ja')).toContain('コード');
    expect(getTranslation('tagline', 'de')).toContain('Code');
    expect(getTranslation('tagline', 'hi')).toContain('कोड');
  });

  it('should fallback gracefully to English for unknown locales', () => {
    const res = getTranslation('tagline', 'fr' as any);
    expect(res).toBe('Make the code fit the project.');
  });
});
