import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { isXmtpFrameRequest, getXmtpFrameMessage } from '@coinbase/onchainkit/xmtp'; 
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function collectPreMintAmount(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
 let isValid = false;
  let message = null;

  // Check if it's an XMTP frame request and handle accordingly
  if (isXmtpFrameRequest(body)) {
    const xmtpResponse = await getXmtpFrameMessage(body); 
    isValid = xmtpResponse.isValid;
    message = xmtpResponse.message;
  } else {
    // Handle regular frame request
    const frameResponse = await getFrameMessage(body, { neynarApiKey: 'YOUR_NEYNAR_ONCHAIN_KIT_API_KEY' });
    isValid = frameResponse.isValid;
    message = frameResponse.message;
  }

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 400 });
  }
  console.log(JSON.parse(decodeURIComponent(message?.state.serialized || "")))
  const imageUri = JSON.parse(decodeURIComponent(message?.state.serialized || "")).imageUri
  const ethAmt= message.input; 
  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        action: 'post',
        label: 'Submit Pre-Mint Amount',
        target: `${NEXT_PUBLIC_URL}/api/deploy-token`, // Next step for token deployment
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/park-1.png`, // Placeholder image for this step
      aspectRatio: '1:1',
    },
    input: {
      text: "pre mint eth amount", 
    },
    state:{
      adName: JSON.parse(decodeURIComponent(message?.state.serialized || "")).adName,
      imageUri: JSON.parse(decodeURIComponent(message?.state.serialized || "")).imageUri,
      ethAmount: ethAmt
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return collectPreMintAmount(req);
}

export const dynamic = 'force-dynamic';
