import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTechnologyQuery } from 'src/queries/get-technology.query';
import { Technology } from 'src/entities/technology.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { normalizeTechnologyName } from 'src/utils/normalizeTechnology.utils';

@QueryHandler(GetTechnologyQuery)
export class GetTechnologyHandler implements IQueryHandler<GetTechnologyQuery> {
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) {}

  async execute(query: GetTechnologyQuery): Promise<Technology> {
    const techName = normalizeTechnologyName(query.params.name);
    let technology = await this.technologyRepository.findOne({
      where: { slug: techName },
    });
    if (!technology) {
      technology = this.technologyRepository.create({
        name: query.params.name,
        slug: techName,
      });
      await this.technologyRepository.save(technology);
    }
    return technology;
  }
}
