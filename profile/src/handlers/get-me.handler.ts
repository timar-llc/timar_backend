import { IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import { GetMeQuery } from '../queries/get-me.query';
import { Profile } from '../entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute(query: GetMeQuery): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { userUuid: query.userUuid },
    });
    if (!profile) {
      throw new RpcException('Profile not found');
    }
    return profile;
  }
}
