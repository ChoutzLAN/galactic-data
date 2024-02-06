// src/services/galacticMarketplace.ts
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import dotenv from 'dotenv'; // Make sure to import dotenv
dotenv.config(); // Load environment variables
import { GALACTIC_MARKETPLACE_IDL, Order as OrderType } from '@staratlas/galactic-marketplace';
import StarAtlasOrderModel from '../models/staratlasOrderModel';

// Use environment variables directly
if (!process.env.GALACTIC_MARKETPLACE_PROGRAM_ID) {
    throw new Error('GALACTIC_MARKETPLACE_PROGRAM_ID is not defined in .env');
}

const GALACTIC_MARKETPLACE_PROGRAM_ID = new PublicKey(process.env.GALACTIC_MARKETPLACE_PROGRAM_ID);
console.log("Program ID:", GALACTIC_MARKETPLACE_PROGRAM_ID.toString());

const NODE_RPC_HOST = process.env.NODE_RPC_HOST || clusterApiUrl('mainnet-beta');
console.log("Connected RPC Host:", NODE_RPC_HOST);
const connection = new Connection(NODE_RPC_HOST, 'confirmed');

// Assuming SDU_TOKEN_ADDRESS is set in your .env
const sduTokenAddress = process.env.SDU_TOKEN_ADDRESS;
console.log("SDU Token Address:", sduTokenAddress);

const provider = new AnchorProvider(connection, {} as any, { commitment: 'confirmed' });

/**
 * Fetches order accounts from the Galactic Marketplace Program and updates them in MongoDB.
 */
export async function fetchAndUpsertOrderAccounts(): Promise<void> {
    const galacticMarketplaceProgram = new Program<typeof GALACTIC_MARKETPLACE_IDL>(GALACTIC_MARKETPLACE_IDL, GALACTIC_MARKETPLACE_PROGRAM_ID, provider);

    try {
        const programAccounts = await galacticMarketplaceProgram.account.orderAccount.all();
        
        for (const account of programAccounts) {
            const orderData = {
                publicKey: account.publicKey.toString(), // Convert PublicKey to string
                account: {
                    orderInitializerPubkey: account.account.orderInitializerPubkey.toString(),
                    currencyMint: account.account.currencyMint.toString(),
                    assetMint: account.account.assetMint.toString(),
                    initializerCurrencyTokenAccount: account.account.initializerCurrencyTokenAccount.toString(),
                    initializerAssetTokenAccount: account.account.initializerAssetTokenAccount.toString(),
                    orderSide: account.account.orderSide, // Direct use, assuming appropriate conversion
                    price: account.account.price.toString(),
                    orderOriginationQty: account.account.orderOriginationQty.toString(),
                    orderRemainingQty: account.account.orderRemainingQty.toString(),
                    createdAtTimestamp: account.account.createdAtTimestamp.toString(),
                }
            };

            await StarAtlasOrderModel.findOneAndUpdate({ publicKey: orderData.publicKey }, orderData, { upsert: true, new: true });
        }

        console.log('Order data has been successfully updated in MongoDB.');
    } catch (error) {
        console.error("Error during the process:", error);
    }
}