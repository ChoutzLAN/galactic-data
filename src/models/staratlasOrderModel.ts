// src/models/staratlasOrderModel.ts
import { Schema, model } from 'mongoose';

interface StarAtlasOrder {
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
}

const starAtlasOrderSchema = new Schema<StarAtlasOrder>({
  publicKey: { type: String, required: true },
  account: {
    orderInitializerPubkey: { type: String, required: true },
    currencyMint: { type: String, required: true },
    assetMint: { type: String, required: true },
    initializerCurrencyTokenAccount: { type: String, required: true },
    initializerAssetTokenAccount: { type: String, required: true },
    orderSide: { sell: Object, buy: Object },
    price: { type: String, required: true },
    orderOriginationQty: { type: String, required: true },
    orderRemainingQty: { type: String, required: true },
    createdAtTimestamp: { type: String, required: true },
  }
});

const StarAtlasOrderModel = model<StarAtlasOrder>('StarAtlasOrder', starAtlasOrderSchema);
export default StarAtlasOrderModel;