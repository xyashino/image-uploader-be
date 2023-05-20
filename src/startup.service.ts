import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, stat } from 'node:fs/promises';

@Injectable()
export class StartupService implements OnModuleInit {
  async onModuleInit() {
    await this.createUploadDirectory();
  }

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  private async createUploadDirectory() {
    const albumDir = this.configService.get('UPLOAD_DIR');
    try {
      await stat(albumDir);
    } catch (e) {
      await mkdir(albumDir, { recursive: true });
    }
  }
}
