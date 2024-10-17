import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Üdvözöljük a legjobb szállásfoglaló weboldalon!';
  }
}
