import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';

const AllowedMimeTypes = [
  'image/jpeg',
  'image/gif',
  'image/jpg',
  'image/png',
  'image/webp',
];

@Injectable()
export class UploadService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async uploadFile(file: Express.Multer.File) {
    if (!AllowedMimeTypes.includes(file.mimetype)) {
      throw new ConflictException(`File type ${file.mimetype} not allowed`);
    }

    const uploadDir = this.configService.get<string>('UPLOAD_DIR');
    const fileDirectory = randomUUID();

    try {
      await mkdir(`${uploadDir}/${fileDirectory}`, { recursive: true });
      await writeFile(
        `${uploadDir}/${fileDirectory}/${file.originalname}`,
        file.buffer,
      );
    } catch (error) {
      console.error(error);
      throw new ConflictException(
        `Failed to upload the file: ${error.message}`,
      );
    }

    const fileUrl = `${this.configService.get<string>(
      'PUBLIC_HOST_URL',
    )}/${fileDirectory}/${file.originalname}`;
    return {
      message: 'File uploaded successfully',
      fileUrl,
    };
  }
}
