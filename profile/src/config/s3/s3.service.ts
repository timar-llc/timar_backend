import { Injectable } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class StorageService {
  private s3: S3;
  private endpoint: string;
  private accessKeyId: string;
  private secretAccessKey: string;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get('MINIO_ENDPOINT')!;
    this.accessKeyId = this.configService.get('MINIO_ACCESS_KEY')!;
    this.secretAccessKey = this.configService.get('MINIO_SECRET_KEY')!;
    this.bucketName = this.configService.get('MINIO_BUCKET')!;
    this.s3 = new S3({
      region: 'ru-1',
      endpoint: this.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    const fileKey = fileName.replace(
      `${this.endpoint}/${this.bucketName}/`,
      '',
    ); // Убираем базовый URL

    await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key: fileKey,
    });
  }

  async uploadFile(file: any): Promise<string> {
    // Проверяем, является ли это ссылкой на изображение
    if (!file.originalname) {
      console.log('Detected image URL, returning as is');
      return file as string; // Возвращаем ссылку как есть
    }

    // Если это base64 файл, загружаем в S3
    const buffer = Buffer.from(file.buffer, 'base64');

    const fileStream = Readable.from(buffer);
    const fileName = `${file.originalname}`;

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileStream,
        ContentType: file.mimetype,
      },
    });

    await upload.done();
    const fileUrl = `${this.endpoint}/${this.bucketName}/${fileName}`;
    return fileUrl;
  }

  async getFile(key: string): Promise<Readable> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    const { Body } = await this.s3.getObject(params);
    return Body as Readable;
  }
}
