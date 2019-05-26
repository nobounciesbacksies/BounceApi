import { Module } from '@nestjs/common';
import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';
import { FirestoreService } from '../../services/firestore.service';

@Module({
  controllers: [BlacklistController],
  providers: [BlacklistService, FirestoreService],
})
export class BlacklistModule {}
