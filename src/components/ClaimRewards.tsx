import { useEffect, useState } from "react";
import { useAccount, useBalance, useWriteContract, useReadContract } from "wagmi";
import { Address, formatEther  } from "viem";
import {watchContractEvent, waitForTransactionReceipt } from "@wagmi/core";
import { useSelector } from 'react-redux';

import { abi, CONTRACT_ADDRESS } from "../constants/contract";
import wagmiConfig from "../wagmi.config";
import { RootState } from '../store';
import SignMessage from "./SignMessage";

const ClaimRewards = () => {
  const currentEpoch = useSelector((state: RootState) => state.epochRewards.currentEpoch);

  const account = useAccount();

  const { data: userEpochRewardFromContract, refetch: refetchEpochRewardFromContract } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getUserEpochReward",
    args: [Number(currentEpoch), account ? account.address : "0x0"],
  });

  const { data: hash, writeContractAsync } = useWriteContract();

  const handleClaimRewards = async () => {
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "claimReward",
      args: [],
    });

    if (hash) {
      await waitForTransactionReceipt(wagmiConfig, {
        confirmations: 2,
        hash: hash as Address,
      });
    }
  };

  const [connectedUserHasRewards, setConnectedUserHasRewards] = useState<boolean>(false);
  const [connectedUserHasClaimedRewards, setConnectedUserHasClaimedRewards] = useState<boolean>(false);
  const [connectedUserRewardAmount, setConnectedUserRewardAmount] = useState<number | null>(null);

  useEffect(() => {
    if (account) {
      console.log(account);
      console.log(userEpochRewardFromContract);
      refetchEpochRewardFromContract();
    }
  }, [account]);

  useEffect(() => {
    if (userEpochRewardFromContract) {
      const _userEpochRewardFromContract = userEpochRewardFromContract as [bigint, boolean, boolean, bigint]
      console.log(_userEpochRewardFromContract)
      setConnectedUserRewardAmount(parseFloat(formatEther(_userEpochRewardFromContract[3])));
      if (
        _userEpochRewardFromContract[1] === false &&
        _userEpochRewardFromContract[2] === true) {
        console.log("user can claim");
        setConnectedUserHasRewards(true);
      }
      if (
        _userEpochRewardFromContract[1] === true &&
        _userEpochRewardFromContract[2] === true) {
        console.log("user has already claimed");
        setConnectedUserHasClaimedRewards(true);
      }
    }
  }, [userEpochRewardFromContract]);


  const postSigAndMessageToServerToCheckEligibility = (
    signature: string,
    signingMessage: string,
  ): void => {
    console.log({ signature, signingMessage });

    // TODO :: post request to server with signature and signingMessage to recover account from and check eligibility
  };

  return (
    <section className="mb-8">
      <h5 className="font-semibold mb-4">Claim Rewards</h5>
      {connectedUserHasRewards || connectedUserHasClaimedRewards ? (
        <>
          <section className="mb-8">

            {
              !connectedUserHasClaimedRewards &&
                <>
                  <p className="mb-4"> <em>Rewards: {connectedUserRewardAmount} ETH</em> </p>
                  <button
                    onClick={handleClaimRewards}
                    className="border rounded px-2 py-1"
                  >
                    Claim Rewards
                  </button>
                </>
            }

            {
              connectedUserHasClaimedRewards &&
                <p><em> Rewards already claimed this epoch </em></p>
            }

          </section>
        </>
      ) : (
        <>
          <section className="mb-8">
            <SignMessage
              signMessageCallback={postSigAndMessageToServerToCheckEligibility}
            />
          </section>
        </>
      )}
    </section>
  );
};

export default ClaimRewards;
