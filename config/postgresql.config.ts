export const PostgresqlConfig = () => ({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASS || 'postgres',
  database: process.env.PG_DATA || 'incit_db',
});
