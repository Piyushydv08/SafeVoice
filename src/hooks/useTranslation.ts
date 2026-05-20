import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string): string => {
    const currentLanguage =
      translations[language as keyof typeof translations];

    if (
      currentLanguage &&
      key in currentLanguage
    ) {
      return currentLanguage[
        key as keyof typeof currentLanguage
      ];
    }

    return translations.en[
      key as keyof typeof translations.en
    ] || key;
  };

  return {
    t,
    language,
  };
};