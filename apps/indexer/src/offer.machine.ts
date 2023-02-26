import { createMachine, assign, send } from "xstate";

interface Context {
  lender: string;
  tokenId: number;
  price: number;
  currency: string;
  minDays: number;
  maxDays: number;
  canceled: boolean;
}

const offerMachine = createMachine<Context>(
  {
    id: "Token Offer",
    context: {
      lender: "0x000…",
      tokenId: 0,
      price: 0,
      currency: "0x000…",
      minDays: 4,
      maxDays: 10,
      canceled: false,
    },
    initial: "Undefined",
    states: {
      Undefined: {
        id: "Offer is not created",
        on: {
          OfferListed: "Pending",
        },
      },
      Pending: {
        id: "Waiting for rental",
        always: [{ target: "Canceled", cond: "isCanceled" }],
        on: {
          TokenRented: "Rental",
          OfferCanceled: {
            target: "Delisted",
            actions: assign({
              canceled: true,
            } as Pick<Context, "canceled">),
          },
        },
      },
      Rental: {
        id: "Token rental",
        on: {
          OfferCanceled: {
            actions: assign({
              canceled: true,
            } as Pick<Context, "canceled">),
          },
          EXPIRE: { target: "Pending" },
        },
      },
      Canceled: {
        id: "Canceled by user",
        on: {
          OfferDelisted: "Delisted",
        },
      },
      Delisted: {
        id: "Delisted",
        type: "final",
      },
    },
  },
  {
    // String delays configured here
    delays: {
      EXPIRE: 2_000, // static value
    },
    guards: {
      isCanceled: (context) => context.canceled,
    },
  }
);

const undefinedState = offerMachine.initialState;

const pendingState = offerMachine.transition(undefinedState, {
  type: "OfferListed",
});

const delistedState = offerMachine.transition(pendingState, {
  type: "OfferCanceled",
});
console.log(JSON.stringify(delistedState));

// event OfferListed(address indexed collectionAddress, uint256 indexed tokenId, address lender);
// event OfferCanceled(address indexed collectionAddress, uint256 indexed tokenId, address lender);
// event OfferDelisted(address indexed collectionAddress, uint256 indexed tokenId, address lender);
// event TokenRented(address indexed collectionAddress, uint256 indexed tokenId, address renter, uint64 expires);
