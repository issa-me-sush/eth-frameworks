import { FrameRequest, getFrameMessage, getFrameHtmlResponse ,getFrameMetadata} from '@coinbase/onchainkit/frame';
import { isXmtpFrameRequest, getXmtpFrameMessage } from '@coinbase/onchainkit/xmtp'
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function collectImageUri(req: NextRequest): Promise<NextResponse> {
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
//   console.log(JSON.parse(decodeURIComponent(message?.state.serialized || "")))
  if (!isValid) {
    return new NextResponse('Message not valid', { status: 400 });
  }

  // Assuming the ad name was passed to this step in the input
  const adname = message.input; 

 
//   const newData = `${previousData}&imageUri=`; // Placeholder for user input

  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        action: 'post',
        label: 'Submit Image URI',
        target: `${NEXT_PUBLIC_URL}/api/collect-eth-amount`, // Next step to collect ETH amount
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/park-1.png`, // Placeholder image for this step
      aspectRatio: '1:1',
    },
    input: {
      text: "image-uri", // Pass the concatenated data for the next step
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    state: {
        adName: adname
    }
  }));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return collectImageUri(req);
}

export const dynamic = 'force-dynamic';
