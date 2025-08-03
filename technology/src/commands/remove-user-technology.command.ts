import { ToggleUserTechnologyParams } from 'src/params/remove-user-technology.params';

export class RemoveUserTechnologyCommand {
  constructor(public readonly params: ToggleUserTechnologyParams) {}
}
