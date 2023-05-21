import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ImageModule } from '../image/image.module';
@Module({
  imports: [ImageModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
