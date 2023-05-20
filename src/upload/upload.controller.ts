import {
  Controller,
  FileTypeValidator,
  Inject,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  @Inject(UploadService)
  private readonly uploadService: UploadService;

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(jpeg|png|jpg|webp|gif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.uploadFile(file);
  }
}
