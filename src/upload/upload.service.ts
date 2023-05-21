import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';
import { ImageService } from '../image/image.service';

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

  @Inject(ImageService)
  private readonly imageService: ImageService;

  async uploadFile({
    mimetype,
    originalname: originalName,
    buffer,
  }: Express.Multer.File) {
    if (!AllowedMimeTypes.includes(mimetype)) {
      throw new ConflictException(`File type ${mimetype} not allowed`);
    }

    // Check if the upload directory   has  '/' at the end if exists remove it
    const uploadDir = this.configService.get('UPLOAD_DIR').replace(/\/$/, '');
    const { filePath, id } = await this.imageService.create({ originalName });

    try {
      await mkdir(`${uploadDir}/${id}`, { recursive: true });
      await writeFile(`${uploadDir}${filePath}`, buffer);
    } catch (error) {
      await this.imageService.remove(id);
      throw new ConflictException(
        `Failed to upload the file: ${error.message}`,
      );
    }
    return this.imageService.findOne(id);
  }
}
