import { EditAvatarDto } from '../dto/edit-avatar.dto';

export class EditAvatarCommand {
  constructor(public readonly dto: EditAvatarDto) {}
}
