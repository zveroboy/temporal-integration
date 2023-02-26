import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma';
import { IndexerServiceService as IndexerService } from './indexer.service';

const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "previousAdmin",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "beacon",
        "type": "address"
      }
    ],
    "name": "BeaconUpgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "OfferCanceled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "OfferFinished",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "TokenDelisted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "TokenListed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "TokenRented",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
];

const BenanceTestNetwork = {
  name: 'Binance Smart Chain Testnet',
  chain: 'BSC',
  rpc: [
    'https://data-seed-prebsc-1-s1.binance.org:8545/',
  ],
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
    decimals: 18,
  },
  chainId: 97,
  networkId: 97,
};

export const createJrpcProvider = () => {
  return new ethers.providers.JsonRpcProvider(
    BenanceTestNetwork.rpc.find((url) => url.startsWith('http')),
    {
      chainId: BenanceTestNetwork.chainId,
      name: BenanceTestNetwork.name,
    },
  );
};

@Injectable()
export class HistoryReplayService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly indexerService: IndexerService,
  ){}

  async executeFilter(){

    const provider = createJrpcProvider();

    const marketplaceV2ContractReadonly = new ethers.Contract(
      '0xC122A7135282Adb40F2826E6D522240464Fd3DF6',
      abi,
      provider
    );

    const listed = marketplaceV2ContractReadonly.filters.TokenListed();
    const listedLogs = await marketplaceV2ContractReadonly.queryFilter(listed, 27511112, 27511182);

    const listedLogDesc = listedLogs.map((log) => marketplaceV2ContractReadonly.interface.parseLog(log));

    const event = await this.prismaService.event.create({
      data: {
        chainId: BenanceTestNetwork.chainId.toString(),
        collectionAddress: listedLogDesc[0].args[0],
        eventName: listedLogDesc[0].name,
        payload: listedLogDesc[0].args
      }
    })
    
    console.log({event})

    // console.dir({listedLogDesc: JSON.stringify(listedLogDesc[0]['args'])})
    // process.stdout.write('aaaa');
  }

  async execute(){
    const events = await this.prismaService.event.findMany();
    await this.indexerService.processOfferEvents(events);
  }
}
