import { ConnectButton } from '@rainbow-me/rainbowkit';

import AdminView from "./components/AdminView"; 
import RewardClaimerView from "./components/RewardClaimerView";
import CurrentEpoch from "./components/CurrentEpoch";

function App() {

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-4 bg-white border-b shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">Airdrop System</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ConnectButton />
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl mt-10 px-4 sm:px-6 lg:px-8">

        <CurrentEpoch/>
        <AdminView/>
        <RewardClaimerView/>

      </main>
    </>
  );

}

export default App
