import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'mr', label: 'Marathi' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'kn', label: 'Kannada' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'pa', label: 'Punjabi' },
];
const translations = {
  en: {
    home: 'Home',
    stories: 'Stories',
    shareStory: 'Share Story',
    resources: 'Resources',
    faqs: 'FAQs',
    about: 'About',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    admin: 'Admin',
    language: 'Language',
  },

  hi: {
    home: 'होम',
    stories: 'कहानियाँ',
    shareStory: 'अपनी कहानी साझा करें',
    resources: 'संसाधन',
    faqs: 'सवाल',
    about: 'हमारे बारे में',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    admin: 'एडमिन',
    language: 'भाषा',
  },

  bn: {
    home: 'হোম',
    stories: 'গল্পসমূহ',
    shareStory: 'গল্প শেয়ার করুন',
    resources: 'রিসোর্স',
    faqs: 'প্রশ্নাবলী',
    about: 'আমাদের সম্পর্কে',
    signIn: 'সাইন ইন',
    signOut: 'সাইন আউট',
    admin: 'অ্যাডমিন',
    language: 'ভাষা',
  },

  ta: {
    home: 'முகப்பு',
    stories: 'கதைகள்',
    shareStory: 'உங்கள் கதையை பகிரவும்',
    resources: 'வளங்கள்',
    faqs: 'கேள்விகள்',
    about: 'எங்களை பற்றி',
    signIn: 'உள்நுழைக',
    signOut: 'வெளியேறு',
    admin: 'நிர்வாகம்',
    language: 'மொழி',
  },

  te: {
    home: 'హోమ్',
    stories: 'కథలు',
    shareStory: 'మీ కథను పంచుకోండి',
    resources: 'వనరులు',
    faqs: 'ప్రశ్నలు',
    about: 'మా గురించి',
    signIn: 'సైన్ ఇన్',
    signOut: 'సైన్ అవుట్',
    admin: 'అడ్మిన్',
    language: 'భాష',
  },

  mr: {
    home: 'मुख्यपृष्ठ',
    stories: 'कथा',
    shareStory: 'तुमची कथा शेअर करा',
    resources: 'संसाधने',
    faqs: 'प्रश्न',
    about: 'आमच्याबद्दल',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    admin: 'अॅडमिन',
    language: 'भाषा',
  },

  gu: {
    home: 'હોમ',
    stories: 'કથાઓ',
    shareStory: 'તમારી વાર્તા શેર કરો',
    resources: 'સંસાધનો',
    faqs: 'પ્રશ્નો',
    about: 'અમારા વિશે',
    signIn: 'સાઇન ઇન',
    signOut: 'સાઇન આઉટ',
    admin: 'એડમિન',
    language: 'ભાષા',
  },

  kn: {
    home: 'ಮುಖಪುಟ',
    stories: 'ಕಥೆಗಳು',
    shareStory: 'ನಿಮ್ಮ ಕಥೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ',
    resources: 'ಸಂಪನ್ಮೂಲಗಳು',
    faqs: 'ಪ್ರಶ್ನೆಗಳು',
    about: 'ನಮ್ಮ ಬಗ್ಗೆ',
    signIn: 'ಸೈನ್ ಇನ್',
    signOut: 'ಸೈನ್ ಔಟ್',
    admin: 'ನಿರ್ವಹಣೆ',
    language: 'ಭಾಷೆ',
  },

  ml: {
    home: 'ഹോം',
    stories: 'കഥകൾ',
    shareStory: 'നിങ്ങളുടെ കഥ പങ്കിടുക',
    resources: 'വിഭവങ്ങൾ',
    faqs: 'ചോദ്യങ്ങൾ',
    about: 'ഞങ്ങളേക്കുറിച്ച്',
    signIn: 'സൈൻ ഇൻ',
    signOut: 'സൈൻ ഔട്ട്',
    admin: 'അഡ്മിൻ',
    language: 'ഭാഷ',
  },

  pa: {
    home: 'ਹੋਮ',
    stories: 'ਕਹਾਣੀਆਂ',
    shareStory: 'ਆਪਣੀ ਕਹਾਣੀ ਸਾਂਝੀ ਕਰੋ',
    resources: 'ਸਰੋਤ',
    faqs: 'ਸਵਾਲ',
    about: 'ਸਾਡੇ ਬਾਰੇ',
    signIn: 'ਸਾਇਨ ਇਨ',
    signOut: 'ਸਾਇਨ ਆਉਟ',
    admin: 'ਐਡਮਿਨ',
    language: 'ਭਾਸ਼ਾ',
  },
};
export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('safevoice-language');

    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('safevoice-language', lang);
  };

  return (
    <LanguageContext.Provider
     value={{
  language,
  setLanguage,
  t,
}}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider'
    );
  }

  return context;
};