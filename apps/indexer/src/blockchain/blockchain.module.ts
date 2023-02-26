import { Module } from '@nestjs/common';
import { IndexerServiceService } from './indexer-service.service';
import { HistoryReplayServiceService } from './history-replay-service.service';
import { HistoryReplayCommand } from './history-replay.command';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  providers: [HistoryReplayCommand, IndexerServiceService, HistoryReplayServiceService]
})
export class BlockchainModule {}
