import events from './events';
import errorLogger from './errorLogger';

export default [
  errorLogger(),
  events,
];
