import { SetAvatarDto } from '../dto/set-avatar.dto';

export class SetAvatarCommand {
  constructor(public readonly dto: SetAvatarDto) {}
}
