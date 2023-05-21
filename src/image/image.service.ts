import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { Image } from './entities/image.entity';
import { ConfigService } from '@nestjs/config';
import { unlink } from 'node:fs/promises';
@Injectable()
export class ImageService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;
  async create({ originalName }: CreateImageDto) {
    const image = new Image();
    image.originalName = originalName;
    const savedImage = await image.save();
    savedImage.filePath = `/${savedImage.id}/${originalName}`;
    return savedImage.save();
  }
  async findOne(id: string) {
    const foundImage = await Image.findOneBy({ id });
    console.log(foundImage);
    if (!foundImage)
      throw new NotFoundException(`Image with #${id} id not found`);
    return foundImage;
  }
  async remove(id: string) {
    const foundImage = await this.findOne(id);
    const uploadDir = this.configService.get('UPLOAD_DIR').replace(/\/$/, '');
    try {
      await unlink(`${uploadDir}${foundImage.filePath}`);
      await foundImage.remove();
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete the file: ${error.message}`,
      );
    }
    return foundImage;
  }
}
