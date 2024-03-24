import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { isXmtpFrameRequest, getXmtpFrameMessage } from '@coinbase/onchainkit/xmtp'; 
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { base,sepolia  , baseSepolia } from 'viem/chains';
import AdContractABI from '../../_contracts/AdContractABI';
import { AD_CONTRACT_ADDR } from '../../config'; // Use your actual contract address


async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
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
    return new NextResponse('Message not valid', { status: 500 });
  }
  
  const state = JSON.parse(decodeURIComponent(message?.state.serialized || ""))
  console.log(state)
  // Decode the input to extract the necessary parameters
  const adName =state.adName;
  const imageUri = state.imageUri;
  const ethAmount = state.ethAmount;
  const preMintAdAmount = state.input;
  const tokenAddress = message.input

  // Encode the function call to the createAd function of your contract
  const data = encodeFunctionData({
    abi: AdContractABI,
    functionName: 'createAd',
    // @ts-ignore 
    args: [adName || "", tokenAddress , parseEther(ethAmount || "0"), parseInt(preMintAdAmount || "0"), imageUri],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${baseSepolia.id}`, // Adjust according to your network
    method: 'eth_sendTransaction',
    params: {
      abi: AdContractABI,
      data,
      to: AD_CONTRACT_ADDR,
    //   @ts-ignore 
      value: parseEther(ethAmount).toString(), // The ETH amount for the transaction
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
