import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "ton-core";
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("0QB5XpMm7aD7QB2UbSjSD3j3wPxsZEcHI7GRaUc-cDZnTKYD") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    ...contractData,
  };
}
export function useCounterContract() {

    // ... variables definitions
    const { sender } = useTonConnect();
    
    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
    
    // ... mainContract definition
    
    useEffect(() => {
        async function getValue() {
    
          // ... previous getValue code

          await sleep(5000); // sleep 5 seconds and poll value again
          getValue();
        }
        getValue();
    }, [counterContract]);


    return {
        value: val,
        address: counterContract?.address.toString(),
        sendIncrement: () => {
          return mainContract?.sendIncrement(sender, toNano(0.05), 3);
        },
    };
}