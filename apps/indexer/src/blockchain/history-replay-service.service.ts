import { Injectable } from '@nestjs/common';

@Injectable()
export class HistoryReplayServiceService {
  execute(){
    console.log('aaa');
    // process.stdout.write('aaaa');
  }
}
