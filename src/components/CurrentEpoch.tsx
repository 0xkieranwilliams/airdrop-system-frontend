import {useState, useEffect} from "react";
import wagmiConfig from "../wagmi.config";
import { watchContractEvent } from '@wagmi/core';
import { CONTRACT_ADDRESS, abi } from "../constants/contract";
import { useReadContract } from 'wagmi';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setCurrentEpoch } from '../features/epochRewardsSlice';



const CurrentEpoch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentEpoch = useSelector((state: RootState) => state.epochRewards.currentEpoch);

  const { data: currentEpochFromContract, refetch: refetchCurrentEpochFromContract } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 's_currentEpoch',
    args: [],
  });

  watchContractEvent(wagmiConfig, {
    abi,
    eventName: 'OwnershipTransferred',
    onLogs() {
      refetchCurrentEpochFromContract();
    }
  });

  useEffect(() => {
    if (currentEpochFromContract !== null || currentEpochFromContract !== undefined) {
      dispatch(setCurrentEpoch(String(currentEpochFromContract)));
    }
  }, [currentEpochFromContract, dispatch])

  return (
    <>
      {/* Current Epoch */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold">Current Epoch: {currentEpoch}</h2>
      </section>
    </>
  );
};

export default CurrentEpoch;
