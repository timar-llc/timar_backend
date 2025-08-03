import { GetOrCreateTechnologyParams } from 'src/params/technology.params';

export class GetTechnologyQuery {
  constructor(public readonly params: GetOrCreateTechnologyParams) {}
}
