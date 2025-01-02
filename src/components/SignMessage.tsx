import React, { useState } from 'react';
import { signMessage } from '@wagmi/core';
import wagmiConfig from '../wagmi.config';

interface Props {
  signMessageCallback: (signature: string, signingMessage: string) => void;
}

type HexString = `0x${string}`;

const SignMessage: React.FC<Props> = (props: Props) => {

  const signingMessage = 'Please sign this message to confirm your identity.';

  const [signature, setSignature] = useState<HexString | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignMessage = async () => {
    setIsLoading(true);
    try {
      const result = await signMessage(wagmiConfig, { message: signingMessage});
      console.log(result)
      setSignature(result!);
      props.signMessageCallback(String(signature), signingMessage);
    } catch (err) {
      console.log(err);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  // const handleRecoverAccount = async () => {
  //   console.log(signingMessage)
  //   console.log(signature)
  //   if (signature !== null ){
  //     const address = await recoverMessageAddress({message: signingMessage, signature })
  //     setRecoveredAddress(address);
  //     console.log({address})
  //   }
  // }

  return (
    <div>
      {
        !signature &&
        <button onClick={handleSignMessage} disabled={isLoading} className="border rounded px-2 py-1">
          {isLoading ? 'Checking Eligibility...' : 'Check Eligibility'}
        </button>
      }
      {signature && <div>Signature: {signature}</div>}
    </div>
  );
};

export default SignMessage;

