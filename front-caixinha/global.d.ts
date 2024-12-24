declare global {
    namespace NodeJS {
      interface ProcessEnv {
        AUTH_SECRET: string;
        theme: any;
      }
    }
  }