import { TelegramAuthDto } from 'src/dto/telegram-auth.dto';

export class TelegramAuthCommand {
  constructor(public readonly telegramAuthDto: TelegramAuthDto) {}
}
