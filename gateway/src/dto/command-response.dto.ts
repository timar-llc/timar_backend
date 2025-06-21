export class CommandResponseDto {
  message: string;
  result: {
    success: boolean;
    message: string;
  };
}
