import { Body, Controller, Get, Logger, Param, Post, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ImmutableX, Config, UnsignedMintRequest } from '@imtbl/core-sdk';
import { generateWalletConnection } from './libs/walletConnection';
import { MintInfo } from './mint-info';
import { log } from 'node:console';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    Logger.log("hello");

    return "toto";
    //Òreturn this.appService.getHello();
  }

  @Post('mint')
  async mint(@Body() mintInfo: MintInfo): Promise<any> {
    const walletConnection = await generateWalletConnection('goerli');
    const tokenId: string = mintInfo.tokenId;
    const userAddress: string = mintInfo.userAddress;
    Logger.log('mint info', mintInfo);
    const imxClient = new ImmutableX(Config.SANDBOX);

    const mintParams: UnsignedMintRequest = {
      contract_address: '0x685576c3a592088ea9ca528b342d05087a64b6e7',
      users: [
        {
          tokens: [{ id: tokenId, blueprint: tokenId }],
          user: userAddress,
        },
      ],
    };

    let result: any;

    try {
      const mintResponse = await imxClient.mint(walletConnection, mintParams);
      result = mintResponse;
      console.log('mintResponse', JSON.stringify(mintResponse));
    } catch (error) {
      console.error(error);
    }
    return result;
  }
}
