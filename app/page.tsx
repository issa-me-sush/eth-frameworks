import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import { isXmtpFrameRequest, getXmtpFrameMessage } from '@coinbase/onchainkit/xmtp'; 
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';



const frameMetadata = getFrameMetadata({
  buttons: [
    {
      action: 'post',
      label: 'Enter Ad Name',
      target: `${NEXT_PUBLIC_URL}/api/collect-image-uri`,
    },
    {
            action: 'tx',
            label: 'MINT AD NFT',
            target: `${NEXT_PUBLIC_URL}/api/tx`,
            postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
          },
  ],
  image: {
    src: `https://media.discordapp.net/attachments/1220970553448468560/1221314905068666910/ethtaipei.png?ex=66122124&is=65ffac24&hm=25d88f74de6a01e547c4d2b45ff3dc4669385675bd6a0dc67dfa847d9c0f1de0&=&format=webp&quality=lossless&width=1170&height=1170`, // Placeholder image
    aspectRatio: '1:1',
  },
  input: {
    text: 'Enter Ad Name',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,

});


export const metadata: Metadata = {
  title: 'Ad Creation',
  description: 'Enter Ad Name',
  openGraph: {
    title: 'Ad Creation',
    description: 'Enter Ad Name',
    images: [`https://media.discordapp.net/attachments/1220970553448468560/1221314905068666910/ethtaipei.png?ex=66122124&is=65ffac24&hm=25d88f74de6a01e547c4d2b45ff3dc4669385675bd6a0dc67dfa847d9c0f1de0&=&format=webp&quality=lossless&width=1170&height=1170`],
  },
  other: {
    ...frameMetadata,
  },
};


export default function Page() {
  return (
    <>
      <h1>AD creation</h1>
    </>
  );
}
