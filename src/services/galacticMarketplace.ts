// src/services/galacticMarketplace.ts
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import * as dotenv from 'dotenv';
import { GALACTIC_MARKETPLACE_IDL, Order as OrderType } from '@staratlas/galactic-marketplace';
dotenv.config();
import { Config } from '../types/configTypes.js';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';
import * as path from 'path';
import { resolve } from 'path';
import { OrderAccount, Orders } from '../types/staratlasOrdersTypes.js'; // Import the Orders type
import { BN } from 'bn.js'; // Ensure BN is imported from bn.js or another source

// Dynamic import of JSON file
const configModule = await import('../../config.json', { assert: { type: 'json' } });
const configuration: Config = (configModule as unknown as { default: Config }).default;

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Ensure __dirname is defined in ESM mode

if (!process.env.GALACTIC_MARKETPLACE_PROGRAM_ID) {
    throw new Error('GALACTIC_MARKETPLACE_PROGRAM_ID is not defined in .env');
}

const GALACTIC_MARKETPLACE_PROGRAM_ID = new PublicKey(process.env.GALACTIC_MARKETPLACE_PROGRAM_ID);
console.log("Program ID:", GALACTIC_MARKETPLACE_PROGRAM_ID.toString());

const NODE_RPC_HOST = process.env.NODE_RPC_HOST || clusterApiUrl('mainnet-beta');
console.log("Connected RPC Host:", NODE_RPC_HOST);
const connection = new Connection(NODE_RPC_HOST, 'confirmed');

const sduTokenAddress = configuration.StarAtlastokenAddresses.SDUtokenAddress;
console.log("SDU Token Address:", sduTokenAddress);

const provider = new AnchorProvider(connection, {} as any, { commitment: 'confirmed' });

/**
 * Fetches order accounts from the Galactic Marketplace Program and parses them in real-time.
 * @returns {Promise<Orders>} A promise that resolves to an array of structured order data.
 */
export async function fetchParseAndWriteOrderAccounts(): Promise<void> {
    const galacticMarketplaceProgram = new Program<typeof GALACTIC_MARKETPLACE_IDL>(GALACTIC_MARKETPLACE_IDL, GALACTIC_MARKETPLACE_PROGRAM_ID, provider);

    try {
        const programAccounts = await galacticMarketplaceProgram.account.orderAccount.all();
        const parsedOrders: Orders = programAccounts.map(account => ({
            publicKey: account.publicKey, // Assuming PublicKey handling is correct
            account: {
                orderInitializerPubkey: account.account.orderInitializerPubkey,
                currencyMint: account.account.currencyMint,
                assetMint: account.account.assetMint,
                initializerCurrencyTokenAccount: account.account.initializerCurrencyTokenAccount,
                initializerAssetTokenAccount: account.account.initializerAssetTokenAccount,
                orderSide: account.account.orderSide, // Assuming direct use or conversion as needed
                price: BigInt(account.account.price.toString()), // Convert BN to bigint
                orderOriginationQty: BigInt(account.account.orderOriginationQty.toString()),
                orderRemainingQty: BigInt(account.account.orderRemainingQty.toString()),
                createdAtTimestamp: BigInt(account.account.createdAtTimestamp.toString()),
            }
        }));
        
        // Convert and write the parsed data to JSON, handling bigint serialization
        const dataDirPath = path.join(__dirname, '..','..', 'data');
        const filePath = path.join(dataDirPath, 'staratlasOrderAccountData.json');
        await fs.mkdir(dataDirPath, { recursive: true }); // Ensure the directory exists
        const dataString = JSON.stringify(parsedOrders, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, 2); // Handle bigint
        await fs.writeFile(filePath, dataString);
        console.log('Parsed order data has been successfully written to file.');
    } catch (error) {
        console.error("Error during the process:", error);
    }
}
fetchParseAndWriteOrderAccounts().catch(console.error);