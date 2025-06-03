import { Address, beginCell, Cell, contractAddress, type Sender, SendMode } from "@ton/core";
import type { Contract, ContractProvider } from "@ton/core";
// ... library imports

export type MainContractConfig = {
  number: number;
  address: Address;
  owner_address: Address;
};
// ... library imports

// ... MainContractConfig type

export function mainContractConfigToCell(config: MainContractConfig): Cell {
  return beginCell().storeUint(config.number, 32).storeAddress(config.address).storeAddress(config.owner_address).endCell();
}
//... contact wrapper class

export class MainContract implements Contract {
  address: Address;
  init?: { code: Cell; data: Cell };

  constructor(
    address: Address,
    init?: { code: Cell; data: Cell }
  ) {
    this.address = address;
    this.init = init;
  }

  static createFromConfig(config: MainContractConfig, code: Cell, workchain = 0) {
    const data = mainContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new MainContract(address, init);
  }

  async sendIncrement(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    increment_by: number
  ) {
    const msg_body = beginCell()
      .storeUint(1, 32) // OP code
      .storeUint(increment_by, 32) // increment_by value
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }
  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_the_latest_sender", []);
    return {
      number: stack.readNumber(),
      recent_sender: stack.readAddress(),
      owner_address: stack.readAddress(),
    };
  }
  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);
    return {
      number: stack.readNumber(),
    };
}
async sendDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
    const msg_body = beginCell()
      .storeUint(2, 32) // OP code
      .endCell(); 
      await provider.internal(sender, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: msg_body,
      });
}
async sendNoCodeDeposit(
    provider: ContractProvider,
    sender: Sender,
    value: bigint
  ) {
    const msg_body = beginCell().endCell();
    
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
}
async sendWithdrawalRequest(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    withdrawAmount: bigint // <-- new argument

  ) {
    const msg_body = beginCell()
      .storeUint(3, 32) // OP code
      .storeUint(withdrawAmount, 64) // store the withdraw amount
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

}