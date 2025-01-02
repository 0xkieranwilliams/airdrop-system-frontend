import {useState, useEffect} from "react";
import { useBalance, useWriteContract, useReadContract } from 'wagmi';
import { watchContractEvent } from '@wagmi/core';
import {parseEther, Address} from 'viem';
import { waitForTransactionReceipt } from "@wagmi/core";

import { CONTRACT_ADDRESS, abi } from "../constants/contract";
import wagmiConfig from "../wagmi.config.ts"

const AdminView = () => {

  watchContractEvent(wagmiConfig, {
    abi,
    eventName: 'OwnershipTransferred',
    onLogs() {
      refetchCurrentOwnerFromContract();
    }
  });
  watchContractEvent(wagmiConfig, {
    abi,
    eventName: 'UserAddedToEpochRewards',
    onLogs(logs) {
      console.log("user added to the epoch rewards: ")
      console.log(logs)
    }
  });

  const {data: contractBalance, refetch: refetchContractBalance} = useBalance({address: CONTRACT_ADDRESS})

  const { data: currentOwnerFromContract, refetch: refetchCurrentOwnerFromContract} = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'owner',
    args: [],
  });

  const [currentContractOwner, setCurrentContractOwner] = useState<String>();
  const [currentContractBalance, setCurrentContractBalance] = useState<Object>();

  const {data: hash, writeContractAsync} = useWriteContract();
  
  const submitTransferOwnershipHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const address = formData.get('transferOwnershipAddress') as string;
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'transferOwnership',
      args: [address]
    })

    if (hash) {
      await waitForTransactionReceipt(wagmiConfig, { confirmations: 2, hash: hash as Address });
    }
  }

  const submitUpdateEpoch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const valueToTransferIntoContract = formData.get('valueToTransferIntoContract');
    const totalPointsThisEpoch = formData.get('pointsThisEpoch');

    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'updateEpoch',
      args: [totalPointsThisEpoch],
      value: parseEther(String(valueToTransferIntoContract))
    })

    if (hash) {
      await waitForTransactionReceipt(wagmiConfig, { confirmations: 2, hash: hash as Address });
    }
  }

  const submitAddUserToEpochRewards = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const userAddress = formData.get("userAddress");
    const poolPercentage = formData.get("poolPercentage");
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'addUserToEpochRewards',
      args: [userAddress, (Number(poolPercentage) * 10000)],
    })
  }

  useEffect(() => {
    if (currentOwnerFromContract) {
      setCurrentContractOwner(String(currentOwnerFromContract));
    }
    if (contractBalance) {
      console.log(contractBalance)
      setCurrentContractBalance(`${contractBalance.formatted} ${contractBalance.symbol}`);
    }
  }, [currentOwnerFromContract, contractBalance])

  return(<>
        <section className="mb-8">
          <hr className="mb-4" />
          <h2 className="text-3xl mb-4 font-semibold">Admin</h2>

          <div className="mb-6">
            <h5 className="font-semibold mb-4">Current Owner: <span className="font-normal">{currentContractOwner}</span></h5>
            <h5 className="font-semibold mb-8">Contract Balance: <span className="font-normal">{currentContractBalance}</span></h5>

            <h5 className="font-semibold">Transfer Ownership</h5>
            <form onSubmit={submitTransferOwnershipHandler} className="flex space-x-2 mt-2">
              <input
                name="transferOwnershipAddress"
                placeholder="Transfer ownership to..."
                required
                className="border border-gray-300 rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="mb-6">
            <h5 className="font-semibold">Update Epoch</h5>
            <form onSubmit={submitUpdateEpoch} className="flex space-x-2 mt-2">
              <input
                name="valueToTransferIntoContract"
                placeholder="Eth to fund the contract for next epoch"
                type="number"
                required
                step="any"
                className="border border-gray-300 rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="pointsThisEpoch"
                placeholder="Total points in next epoch"
                type="number"
                step="any"
                required
                className="border border-gray-300 rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>


          <div>
            <h5 className="font-semibold">Add User To Epoch Rewards</h5>
            <form onSubmit={submitAddUserToEpochRewards} className="flex space-x-2 mt-2">
              <input
                name="userAddress"
                placeholder="User address"
                required
                className="border border-gray-300 rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="poolPercentage"
                placeholder="Pool percentage to give user"
                type="number"
                min="0"
                max="100"
                step="any"
                required
                className="border border-gray-300 rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </section>
    </>)
}
export default AdminView;
