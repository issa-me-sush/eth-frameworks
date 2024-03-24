import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { isXmtpFrameRequest, getXmtpFrameMessage } from '@coinbase/onchainkit/xmtp'; 
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function collectEthAmount(req: NextRequest): Promise<NextResponse> {
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
  // const state = JSON.parse(message?.state.serialized || "");
  console.log(JSON.parse(decodeURIComponent(message?.state.serialized || "")))
  const adName = JSON.parse(decodeURIComponent(message?.state.serialized || "")).adName
  if (!isValid) {
    return new NextResponse('Message not valid', { status: 400 });
  }

  
  const uri = message.input; 



  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        action: 'post',
        label: 'Submit ETH Amount',
        target: `${NEXT_PUBLIC_URL}/api/collect-premint-amount`, // Next step to collect pre-mint ad amount
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/park-1.png`, // Placeholder image for this step
      aspectRatio: '1:1',
    },
    input: {
      text: "eth amount", // Pass the concatenated data for the next step
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    state:{
      adName: JSON.parse(decodeURIComponent(message?.state.serialized || "")).adName,
      imageUri: uri
    }
  }));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return collectEthAmount(req);
}

export const dynamic = 'force-dynamic';
