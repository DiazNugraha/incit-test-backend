import { PostgresqlConfig } from './postgresql.config';
import { MailerConfig } from './mailer.config';

export default () => ({
  postgresql: {
    ...PostgresqlConfig(),
  },
  mailer: {
    ...MailerConfig(),
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
  },
});
