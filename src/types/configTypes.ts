// src/types/configTypes.ts
export interface ApiConfig {
    coingeckoApiUrl: string;
  }
  
export interface CachingConfig {
  cachePriceExpiry: number;
  cacheExpiryPermanent: number;
}

export interface TokenAddresses {
  atlasTokenAddress: string;
  polisTokenAddress: string;
  puriTokenAddress: string;
  bonkTokenAddress: string;
  usdcTokenAddress: string;
  solDexTokenAddress: string;
}

export interface StarAtlastokenAddresses {
  SDUtokenAddress: string;
}

export interface Config {
  [x: string]: any;
  apiConfig: ApiConfig;
  caching: Omit<CachingConfig, '_comment'>;
  tokenAddresses: Omit<TokenAddresses, '_comment'>;
  starAtlasTokenAddresses: Omit<StarAtlastokenAddresses, '_comment'>;
  suppressWarnings: boolean;
}
  
export interface OrderData {
  data: any[]; // Replace 'any' with a more specific type based on your data structure
  fileLastUpdated: string;
}

export interface PriceData {
  data: { [key: string]: any }; // Replace 'any' with a more specific type based on your data structure
  fileLastUpdated: string;
}