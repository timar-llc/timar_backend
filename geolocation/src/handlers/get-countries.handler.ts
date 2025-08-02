import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../entities/country.entity';
import { Repository } from 'typeorm';
import { GetCountriesQuery } from 'src/queries/get-countries.query';
import { I18nService } from 'nestjs-i18n';

@QueryHandler(GetCountriesQuery)
export class GetCountriesHandler implements IQueryHandler<GetCountriesQuery> {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly i18n: I18nService,
  ) {}

  async execute(query: GetCountriesQuery): Promise<Country[]> {
    const countries = await this.countryRepository.find();
    return countries.map((country) => ({
      ...country,
      name: this.i18n.translate(`countries.${country.code}`, {
        lang: query.lang,
      }),
    }));
  }
}
