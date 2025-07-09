import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { QueryBus } from '@nestjs/cqrs';
import { GetCountriesQuery } from './queries/get-countries.query';
import { OnModuleInit } from '@nestjs/common';
import { countries, countryTranslations } from './seed/countries.seed';
import { Country } from './entities/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly logger: LokiLoggerService,
    private readonly queryBus: QueryBus,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async onModuleInit() {
    if ((await this.countryRepository.count()) === 0) {
      this.logger.info('Seeding countries');
      const countriesList = countries.map((country) => {
        return this.countryRepository.create({
          name: countryTranslations[country.name] || country.name,
          code: country.code,
        });
      });
      await this.countryRepository.save(countriesList);
      this.logger.info('Countries seeded successfully');
    }
  }

  @MessagePattern('geolocation.get_countries')
  @CacheTTL(60 * 60 * 24)
  async getCountries(): Promise<Country[]> {
    try {
      this.logger.info('Getting countries');
      return await this.queryBus.execute(new GetCountriesQuery());
    } catch (error) {
      this.logger.error('Error getting countries', error);
      throw new RpcException(error.message as Error);
    }
  }
}
