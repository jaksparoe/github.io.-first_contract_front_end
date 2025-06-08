import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useMainContract } from "./hooks/useMainContract";

function App() {
  // Only destructure what your hook actually returns
  const { contract_address, counter_value } = useMainContract();

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
      </div>
    </div>
  );
}

export default App;