import { Body, Controller, Get, Logger, Param, Post, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ImmutableX, Config, UnsignedMintRequest, UnsignedTransferRequest, UpdateCollectionRequest } from '@imtbl/core-sdk';
import { generateWalletConnection } from './libs/walletConnection';
import { MintInfo, TransferInfo } from './mint-info';
import { log } from 'node:console';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    Logger.log("hello");

    return this.appService.getHello();
  }

  @Post('mint')
  async mint(@Body() mintInfo: MintInfo): Promise<any> {
    const walletConnection = await generateWalletConnection('goerli');
    const tokenId: string = mintInfo.tokenId;
    const userAddress: string = mintInfo.userAddress;
    Logger.log('mint info', mintInfo);
    const imxClient = new ImmutableX(Config.SANDBOX);

    const copy = { ...mintInfo };
    delete copy.userAddress;

    const mintParams: UnsignedMintRequest = {
      contract_address: '0x685576c3a592088ea9ca528b342d05087a64b6e7',
      users: [
        {
          tokens: [{ id: tokenId, blueprint: JSON.stringify(copy) }],
          user: userAddress,
        },
      ],
    };

    let result: any;

    try {
      const mintResponse = await imxClient.mint(
        walletConnection.ethSigner,
        mintParams,
      );
      result = mintResponse;
      console.log('mintResponse', JSON.stringify(mintResponse));
    } catch (error) {
      console.error(error);
    }
    return result;
  }

  @Post('transfer')
  async transfer(@Body() transferInfo: TransferInfo): Promise<any> {
    const walletConnection = await generateWalletConnection('goerli');

    const imxClient = new ImmutableX(Config.SANDBOX);

    const transferParams: UnsignedTransferRequest = {
      tokenAddress: '0x685576c3a592088ea9ca528b342d05087a64b6e7',
      tokenId: transferInfo.tokenId,
      receiver: transferInfo.receiverAddress,
      type: 'ERC721'
    };

    let result: any;
    try {
      const mintResponse = await imxClient.transfer(
        walletConnection,
        transferParams,
      );
      result = mintResponse;
      console.log('mintResponse', JSON.stringify(mintResponse));
    } catch (error) {
      console.error(error);
    }
    return result;
  }

  // @Get('update')
  // async update(): Promise<any> {
  //   const walletConnection = await generateWalletConnection('goerli');

  //   const imxClient = new ImmutableX(Config.SANDBOX);

  //   let result: any;
  //   try {
  //     const updateParams: UpdateCollectionRequest = {
  //       name: 'Illumon Hackathon',
  //       collection_image_url: 'https://imxserver.azurewebsites.net/api/nft/image/',
  //       description: 'Illumon nft for the illumon game on Imx Hackathon',
  //       icon_url: 'https://imxserver.azurewebsites.net/api/nft/image/1',
  //       metadata_api_url: 'https://imxserver.azurewebsites.net/api/nft/'
  //     };

  //     const mintResponse = imxClient.updateCollection(walletConnection.ethSigner, '0x685576c3a592088ea9ca528b342d05087a64b6e7', updateParams);
  //     result = mintResponse;
  //     console.log('mintResponse', JSON.stringify(mintResponse));
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   return result;
  // }
}
