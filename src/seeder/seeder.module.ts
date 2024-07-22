import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'config/app.config';
import { dataSourceOptions } from 'db/data-source';
import { ProviderEntity } from 'src/provider/entity/provider.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig] }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      entities: [ProviderEntity],
    }),
  ],
  providers: [SeederService],
})
export class SeederModule {}
