import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    'ru': 'Russian',
    'en': 'English',

    'speak-freely': 'Speak freely',
    'understand-instantly': 'Understand instantly',
    'create-meeting': 'Create a meeting',
    'join-meeting': 'Join a meeting',

    'join': 'Join',
    'enter': 'Enter',
    'create': 'Create',
    'enter-code': 'Enter meeting code',
    'enter-name': 'Enter your name',

    'users': 'Users',
    'chat': 'Chat',
    'message': 'Message',
    'broadcast': 'Broadcast'
  },
  ru: {
    'ru': 'Русский',
    'en': 'Английский',

    'speak-freely': 'Говори свободно',
    'understand-instantly': 'Понимай мгновенно',
    'create-meeting': 'Создать встречу',
    'join-meeting': 'Подключиться к встрече',

    'join': 'Подключиться',
    'enter': 'Войти',
    'create': 'Создать',
    'enter-code': 'Введите код встречи',
    'enter-name': 'Введите ваше имя',

    'users': 'Участники',
    'chat': 'Чат',
    'message': 'Сообщение',
    'broadcast': 'Транслировать',
  },
};

const i18n = createI18n({
  locale: 'ru',
  messages,
});

export default i18n;
