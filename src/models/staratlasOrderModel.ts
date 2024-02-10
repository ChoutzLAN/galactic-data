// src/models/staratlasOrderModel.ts
export interface StarAtlasOrder {
  publicKey: string;
  account: {
    orderInitializerPubkey: string;
    currencyMint: string;
    assetMint: string;
    initializerCurrencyTokenAccount: string;
    initializerAssetTokenAccount: string;
    orderSide: {
      sell?: object;
      buy?: object;
    };
    price: string;
    orderOriginationQty: string;
    orderRemainingQty: string;
    createdAtTimestamp: string;
  };
  dbLastUpdated?: Date; // Add this line for the dbLastUpdated field
}

