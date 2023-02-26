import { Injectable } from '@nestjs/common';
import { Event } from '@prisma/client';
import { Context, offerMachineConfig } from '../offer.machine';
import { AnyEventObject, createMachine, StateMachine } from 'xstate';
import { PrismaService } from 'src/prisma';

@Injectable()
export class IndexerServiceService {
    constructor(
        private readonly prismaService: PrismaService,
      ){}

    async processOfferEvents(events: Event[]){
        const fsmMap: Record<string, StateMachine<Context, any, AnyEventObject>> = {};
        events.map((event)=> {
            fsmMap[(event.payload as any[])[1]?.toString()] ??= createMachine(offerMachineConfig, 
                  {
    guards: {
      isCanceled: (context) => context.canceled,
    },
  }
                );
            return event;
        })
        .map(async (event)=>{
            const fsm = fsmMap[(event.payload as any[])[1]?.toString()];
            console.log({oldState: fsm.initialState.value});
            const newState = fsm.transition(fsm.initialState, {type: event.eventName});
            console.log({newState: newState.value});

            // await this.prismaService.create({

            // })
            // return
        })
        // Fill Offers (Rental)
        // Fetch Meta
        // Remove Delisted
    }
}
