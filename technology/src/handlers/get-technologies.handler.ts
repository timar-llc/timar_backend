import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Technology } from '../entities/technology.entity';
import { Like, Repository } from 'typeorm';
import { GetTechnologiesQuery } from 'src/queries/get-technologies.query';
import { normalizeTechnologyName } from 'src/utils/normalizeTechnology.utils';

@QueryHandler(GetTechnologiesQuery)
export class GetTechnologiesHandler
  implements IQueryHandler<GetTechnologiesQuery>
{
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) {}

  async execute(query: GetTechnologiesQuery): Promise<Technology[]> {
    const search = normalizeTechnologyName(query.params.search || '');
    console.log(search);
    const technologies = await this.technologyRepository.find({
      where: {
        slug: Like(`%${search}%`),
      },
    });
    return technologies;
  }
}
