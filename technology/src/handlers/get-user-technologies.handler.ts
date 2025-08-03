import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserTechnologiesQuery } from '../queries/get-users-technologies.query';
import { Technology } from '../entities/technology.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTechnology } from '../entities/userTechnology.entity';

@QueryHandler(GetUserTechnologiesQuery)
export class GetUserTechnologiesHandler
  implements IQueryHandler<GetUserTechnologiesQuery>
{
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
    @InjectRepository(UserTechnology)
    private readonly userTechnologyRepository: Repository<UserTechnology>,
  ) {}

  async execute(query: GetUserTechnologiesQuery): Promise<Technology[]> {
    const { userUuid } = query;
    const userTechnologies = await this.userTechnologyRepository.find({
      where: { userUuid },
    });
    return await Promise.all(
      userTechnologies.map(async (userTechnology) => {
        const technology = await this.technologyRepository.findOne({
          where: { uuid: userTechnology.technologyUuid },
        });
        return technology;
      }),
    ).then((technologies) =>
      technologies.filter((technology) => technology !== null),
    );
  }
}
