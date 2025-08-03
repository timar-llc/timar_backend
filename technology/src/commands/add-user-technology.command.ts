import { AddUserTechnologyParams } from 'src/params/add-user-technology.params';

export class AddUserTechnologyCommand {
  constructor(public readonly params: AddUserTechnologyParams) {}
}
