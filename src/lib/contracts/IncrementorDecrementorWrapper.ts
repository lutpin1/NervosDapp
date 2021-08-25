import Web3 from 'web3';
import * as IncrementorDecrementorJSON from '../../../build/contracts/IncrementorDecrementor.json';
import { IncrementorDecrementor } from '../../types/IncrementorDecrementor';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

export class IncrementorDecrementorWrapper {
    web3: Web3;

    contract: IncrementorDecrementor;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(IncrementorDecrementorJSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async result(fromAddress: string) {
        const num = await this.contract.methods.result().call({ from: fromAddress });

        return parseInt(num, 10);
    }

    async increment1(fromAddress: string) {
        const tx = await this.contract.methods.increment1().send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
        });
        return tx;
    }

    async increment10(fromAddress: string) {
        const tx = await this.contract.methods.increment10().send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
        });
        return tx;
    }

    async increment100(fromAddress: string) {
        const tx = await this.contract.methods.increment100().send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
        });
        return tx;
    }

    async increment1000(fromAddress: string) {
        const tx = await this.contract.methods.increment1000().send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
        });
        return tx;
    }

    async decrement1(fromAddress: string) {
        const tx = await this.contract.methods.decrement1().send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
        });
        return tx;
    }

    async decrement10(fromAddress: string) {
        const tx = await this.contract.methods.decrement10().send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
        });
        return tx;
    }

    async decrement100(fromAddress: string) {
        const tx = await this.contract.methods.decrement100().send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
        });
        return tx;
    }

    async decrement1000(fromAddress: string) {
        const tx = await this.contract.methods.decrement1000().send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
        });
        return tx;
    }

    async deploy(fromAddress: string) {
        const tx = this.contract
            .deploy({
                data: IncrementorDecrementorJSON.bytecode,
                arguments: []
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress
            });

        let transactionHash: string = null;
        tx.on('transactionHash', (hash: string) => {
            transactionHash = hash;
        });

        const contract = await tx;

        this.useDeployed(contract.options.address);

        return transactionHash;
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}
