import { Injectable } from '@nestjs/common';
import { ProviderEntity } from 'src/provider/entity/provider.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(private readonly dataSource: DataSource) {}
  async seed() {
    await this.OauthProvider();
  }

  async OauthProvider() {
    try {
      const repository = this.dataSource.getRepository(ProviderEntity);
      let query = repository.create({
        id: 1,
        name: 'MANUAL',
      });

      await repository.save(query);

      query = repository.create({
        id: 2,
        name: 'GOOGLE',
      });

      await repository.save(query);

      query = repository.create({
        id: 3,
        name: 'FACEBOOK',
      });

      await repository.save(query);

      console.log('Seed OauthProvider Success');
    } catch (error) {
      console.log('Seed OauthProvider Error: ', error.message);
    }
  }
}
