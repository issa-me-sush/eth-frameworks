import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { isXmtpFrameRequest, getXmtpFrameMessage } from '@coinbase/onchainkit/xmtp'; 
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { base ,sepolia , baseSepolia} from 'viem/chains';
import AdContractABI from '../../_contracts/AdContractABI';
import { AD_CONTRACT_ADDR } from '../../config'; 
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  let isValid = false;
   // Check if it's an XMTP frame request and handle accordingly
   if (isXmtpFrameRequest(body)) {
    const xmtpResponse = await getXmtpFrameMessage(body); 
    isValid = xmtpResponse.isValid;
  
  } else {
    // Handle regular frame request
    const frameResponse = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
    isValid = frameResponse.isValid;
   
  }
  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  // Encode the function call to the createAd function of your contract
  const data = encodeFunctionData({
    abi: AdContractABI,
    functionName: 'createAd',
    args: [ "ad name", "0x56923048bf8A5f9C5d96Be2182D57F207895eCEd" , parseEther( "0.0001"), parseEther( "0.0002"), `https://test-frame-two.vercel.app/park-3.png`],
  });


  const txData: FrameTransactionResponse = {
    chainId: `eip155:${baseSepolia.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: AdContractABI,
      data,
      to: AD_CONTRACT_ADDR,

      value: "100000000000000", 
    },
  };
  console.log(data)
  console.log(txData)
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
