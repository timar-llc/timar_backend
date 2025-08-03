import { EditBasicInfoDto } from 'src/dto/edit-basic-info.dto';

export class EditBasicInfoCommand {
  constructor(public readonly dto: EditBasicInfoDto) {}
}
