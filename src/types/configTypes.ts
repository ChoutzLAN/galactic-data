// configTypes.ts
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
  
  export interface Config {
    [x: string]: any;
    apiConfig: ApiConfig;
    caching: Omit<CachingConfig, '_comment'>;
    tokenAddresses: Omit<TokenAddresses, '_comment'>;
    suppressWarnings: boolean;
  }
  