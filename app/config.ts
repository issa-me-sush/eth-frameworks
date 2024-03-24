// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://test-frame-two.vercel.app';
export const AD_CONTRACT_ADDR = '0xa325c801638126E3112358C989E16cDE015314a7';
