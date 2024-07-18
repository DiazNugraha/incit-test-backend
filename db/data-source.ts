import { config } from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

const filePathPattern = path.join(
  'dist',
  'src',
  'modules',
  '**',
  '*.entity{.ts,.js}',
);

const fileCommonPattern = path.join('dist', 'src', '**', '*.entity{.ts,.js}');

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASS || 'postgres',
  database: process.env.PG_DATA || 'incit_db',
  entities: [filePathPattern, fileCommonPattern],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
