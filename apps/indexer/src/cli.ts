import { CommandFactory } from 'nest-commander';

import { CliAppModule } from './cli-app.module';

async function bootstrap() {
  await CommandFactory.run(CliAppModule, ['error']);
}

bootstrap().catch(error => {
  console.error(error);
  process.exit(1);
});
