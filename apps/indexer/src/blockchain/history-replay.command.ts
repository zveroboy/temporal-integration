import { Command, CommandRunner } from 'nest-commander';

import { HistoryReplayService } from './history-replay.service';

@Command({
  name: 'history-replay',
})
export class HistoryReplayCommand extends CommandRunner {
  constructor(private readonly service: HistoryReplayService) {
    super();
  }

  async run(_inputs: string[]): Promise<void> {
    try {
      await this.service.execute();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
}
