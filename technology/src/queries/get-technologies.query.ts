import { TechnologyParams } from 'src/params/technology.params';

export class GetTechnologiesQuery {
  constructor(public readonly params: TechnologyParams) {}
}
