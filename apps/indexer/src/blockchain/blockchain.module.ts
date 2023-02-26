import { Module } from '@nestjs/common';
import { IndexerServiceService } from './indexer.service';
import { HistoryReplayService } from './history-replay.service';
import { HistoryReplayCommand } from './history-replay.command';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  providers: [HistoryReplayCommand, IndexerServiceService, HistoryReplayService]
})
export class BlockchainModule {}
