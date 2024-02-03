// galacticMarketplace.ts
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import * as dotenv from 'dotenv';
import { GALACTIC_MARKETPLACE_IDL, Order as OrderType } from '@staratlas/galactic-marketplace';
dotenv.config();
import { Config } from './types/configTypes.js';
import * as fs from 'fs/promises'; // Use fs/promises for asynchronous file operations
import { fileURLToPath } from 'url';
import * as path from 'path';

// Dynamic import of JSON file
const configModule = await import('../config.json', { assert: { type: 'json' } });
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

export async function fetchOrderAccounts() {
    const galacticMarketplaceProgram = new Program<typeof GALACTIC_MARKETPLACE_IDL>(GALACTIC_MARKETPLACE_IDL, GALACTIC_MARKETPLACE_PROGRAM_ID, provider);

    try {
        const programAccounts = await galacticMarketplaceProgram.account.orderAccount.all();
        if (programAccounts.length > 0) {
            console.log("Sample fetched account data:", JSON.stringify(programAccounts[0], null, 2));
        }

        // Convert the fetched data to a JSON string
        const dataString = JSON.stringify(programAccounts, null, 2); // Use programAccounts directly if it contains all necessary info

        // Define the path for the output file
        const dataDirPath = path.join(__dirname, 'data');
        const outputPath = path.join(dataDirPath, 'rawOrderAccountData.json');

        // Ensure the 'data' directory exists
        await fs.mkdir(dataDirPath, { recursive: true });

        // Write the data to the file
        await fs.writeFile(outputPath, dataString);

        console.log('Order data has been successfully written to file.');
    } catch (error) {
        console.error("Error during fetching or writing OrderAccounts:", error);
    }
}
