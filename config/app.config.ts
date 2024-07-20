import { PostgresqlConfig } from './postgresql.config';
import { MailerConfig } from './mailer.config';
import { OauthConfig } from './oauth.config';

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
  oauth: {
    ...OauthConfig(),
  },
});
