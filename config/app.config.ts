import { PostgresqlConfig } from './postgresql.config';

export default () => ({
  postgresql: {
    ...PostgresqlConfig(),
  },
});
