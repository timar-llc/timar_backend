import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { QueryBus } from '@nestjs/cqrs';
import { GetCountriesQuery } from './queries/get-countries.query';
import { OnModuleInit } from '@nestjs/common';
import { countries } from './seed/countries.seed';
import { Country } from './entities/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly logger: LokiLoggerService,
    private readonly queryBus: QueryBus,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    if ((await this.countryRepository.count()) === 0) {
      this.logger.info('Seeding countries');
      const countriesList = countries.map((country) => {
        return this.countryRepository.create({
          code: country.code,
        });
      });
      await this.countryRepository.save(countriesList);
      this.logger.info('Countries seeded successfully');
    }
  }

  @MessagePattern('geolocation.get_countries')
  async getCountries(@Payload('lang') lang: string): Promise<Country[]> {
    try {
      this.logger.info('Getting countries');
      const cacheKey = `countries:${lang}`;

      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        this.logger.info('Returning cached countries');
        return cached as Country[];
      }

      const countries = await this.queryBus.execute(
        new GetCountriesQuery(lang),
      );

      await this.cacheManager.set(cacheKey, countries, 60 * 60 * 24);

      return countries as Country[];
    } catch (error) {
      this.logger.error('Error getting countries', error);
      throw new RpcException(error.message as Error);
    }
  }
}
