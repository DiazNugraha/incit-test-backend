import { PostgresqlConfig } from './postgresql.config';
import { MailerConfig } from './mailer.config';

export default () => ({
  postgresql: {
    ...PostgresqlConfig(),
  },
  mailer: {
    ...MailerConfig(),
  },
});
