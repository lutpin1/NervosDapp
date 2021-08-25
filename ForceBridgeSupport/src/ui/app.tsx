import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import './app.scss';
import 'react-toastify/dist/ReactToastify.css';
import { PolyjuiceHttpProvider } from '@polyjuice-provider/web3';
import { AddressTranslator } from 'nervos-godwoken-integration';

import { IncrementorDecrementorWrapper } from '../lib/contracts/IncrementorDecrementorWrapper';
import { CONFIG } from '../config';
import {ERC20Wrapper} from "../lib/contracts/ERC20Wrapper";


async function createWeb3() {
    // Modern dapp br/owsers...
    if ((window as any).ethereum) {
        const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
        const providerConfig = {
            rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
            ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
            web3Url: godwokenRpcUrl
        };

        const provider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);
        const web3 = new Web3(provider || Web3.givenProvider);

        try {
            // Request account access if needed
            await (window as any).ethereum.enable();
        } catch (error) {
            // User denied account access...
        }

        return web3;
    }

    console.log('Non-Ethereum br/owser detected. You should consider trying MetaMask!');
    return null;
}

export function App() {
    const [web3, setWeb3] = useState<Web3>(null);
    const [contract, setContract] = useState<IncrementorDecrementorWrapper>();
    const [accounts, setAccounts] = useState<string[]>();
    const [layer2Bal, setlayer2Bal] = useState<bigint>();
    const [existingContractAlive, setexistingContractAlive] = useState<string>();
    const [currentNumber, setCurrentNumber] = useState<number | undefined>();
    const [deployTxHash, setDeployTxHash] = useState<string | undefined>();
    const [polyjuiceAddress, setPolyjuiceAddress] = useState<string | undefined>();
    const [txAwaiting, settxAwaiting] = useState(false);
    const toastId = React.useRef(null);
    const [polyjuiceBalance, setPolyjuiceBalance] = useState<string>();
    const [ETHContract, setETHContract] = useState<ERC20Wrapper>();
    const [depoAddy, setDepoAddy] = useState<string | undefined>();

    useEffect(() => {
        if (accounts?.[0]) {
            const addressTranslator = new AddressTranslator();
            setPolyjuiceAddress(addressTranslator.ethAddressToGodwokenShortAddress(accounts?.[0]));
        } else {
            setPolyjuiceAddress(undefined);
        }
    }, [accounts?.[0]]);

    useEffect(() => {
        if (txAwaiting && !toastId.current) {
            toastId.current = toast.info(
                'Transaction in progress. Confirm MetaMask signing dialog and please wait...',
                {
                    position: 'top-right',
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    closeButton: false
                }
            );
        } else if (!txAwaiting && toastId.current) {
            toast.dismiss(toastId.current);
            toastId.current = null;
        }
    }, [txAwaiting, toastId.current]);

    const account = accounts?.[0];

    async function deployContract() {
        const _contract = new IncrementorDecrementorWrapper(web3);

        try {
            setDeployTxHash(undefined);
            settxAwaiting(true);

            const transactionHash = await _contract.deploy(account);

            setDeployTxHash(transactionHash);
            setExistingContractAddress(_contract.address);
            toast(
                'Successfully deployed a smart-contract. You can now proceed to get or set the value in a smart contract.',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'There was an error sending your transaction. Please check developer console.'
            );
        } finally {
            settxAwaiting(false);
        }
    }

    async function returnResult() {
        const value = await contract.result(account);
        toast('Successfully read latest stored value.', { type: 'success' });

        setCurrentNumber(value);
    }

    async function setExistingContractAddress(contractAddress: string) {
        const _contract = new IncrementorDecrementorWrapper(web3);
        const _ETHContract = new ERC20Wrapper(web3);
        const addressTranslator = new AddressTranslator();

        _contract.useDeployed(contractAddress.trim());
        _ETHContract.useDeployed("0x03d0D651Cf20B3D23e8141B320b01dB07806a845");

        const depoAddy = await addressTranslator.getLayer2DepositAddress(web3, account);
        setContract(_contract);
        setCurrentNumber(undefined);
        setETHContract(_ETHContract);
        setDepoAddy(depoAddy.addressString);

        const updateBal = async()=> {
            const _ETHBalance = await _ETHContract.balanceOf(polyjuiceAddress, account);
            setPolyjuiceBalance(_ETHBalance.toString());
            setTimeout(updateBal,10000);
        }

        updateBal();
    }

    async function increment1() {
        try {
            settxAwaiting(true);
            await contract.increment1(account);
            toast(
                'Increment by 1 Successful!',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'Error! Something wrong :('
            );
        } finally {
            settxAwaiting(false);
        }
    }

    async function increment10() {
        try {
            settxAwaiting(true);
            await contract.increment10(account);
            toast(
                'Increment by 10 Successful!',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'Error! Something wrong :('
            );
        } finally {
            settxAwaiting(false);
        }
    }

    async function increment100() {
        try {
            settxAwaiting(true);
            await contract.increment100(account);
            toast(
                'Increment by 100 Successful!',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'Error! Something wrong :('
            );
        } finally {
            settxAwaiting(false);
        }
    }

    async function increment1000() {
        try {
            settxAwaiting(true);
            await contract.increment1000(account);
            toast(
                'Increment by 1000 Successful!',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'Error! Something wrong :('
            );
        } finally {
            settxAwaiting(false);
        }
    }

    async function decrement1() {
        try {
            settxAwaiting(true);
            await contract.decrement1(account);
            toast(
                'Decrement by 1 Successful!',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'Error! Something wrong :('
            );
        } finally {
            settxAwaiting(false);
        }
    }

    async function decrement10() {
        try {
            settxAwaiting(true);
            await contract.decrement10(account);
            toast(
                'Decrement by 10 Successful!',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'Error! Something wrong :('
            );
        } finally {
            settxAwaiting(false);
        }
    }

    async function decrement100() {
        try {
            settxAwaiting(true);
            await contract.decrement100(account);
            toast(
                'Decrement by 100 Successful!',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'Error! Something wrong :('
            );
        } finally {
            settxAwaiting(false);
        }
    }

    async function decrement1000() {
        try {
            settxAwaiting(true);
            await contract.decrement1000(account);
            toast(
                'Decrement by 1000 Successful!',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'Error! Something wrong :('
            );
        } finally {
            settxAwaiting(false);
        }
    }

    useEffect(() => {
        if (web3) {
            return;
        }

        (async () => {
            const _web3 = await createWeb3();
            setWeb3(_web3);

            const _accounts = [(window as any).ethereum.selectedAddress];
            setAccounts(_accounts);
            console.log({ _accounts });

            if (_accounts && _accounts[0]) {
                const _layer2Bal = BigInt(await _web3.eth.getBalance(_accounts[0]));
                setlayer2Bal(_layer2Bal);

            }
        })();
    });

    const LoadingIndicator = () => <span className="rotating-icon">⚙️</span>;

    return (
        <div>
        <span className="begin">
        This is just a test DApp for Godwoken and Polyjuice for the Nervos Ecosystem.
        </span>
        <br/>
        <span className="step">
        Step 1:
        </span>
        <span className="words">
        First of all you have to deploy our contract that will work with this ui. In our case
        we have a smart contract that will allow you to increment a number by either
        1, 10, 100 or 1000 you can also decrement the number by these values as well.
        </span>
        <br/>
        <br/>
        <span className="deploy">
        DEPLOY THE CONTRACT!
        <br/>
        <button onClick={deployContract} disabled={!layer2Bal}>
                Deploy contract
        </button>
        </span>
        <br/>
        <br/>
        <br/>
        Or if you already have your contract made you can input it here:
        <input
            placeholder="Contract that was made"
            onChange={e => setexistingContractAlive(e.target.value)}
        />
        <button
            disabled={!existingContractAlive || !layer2Bal}
            onClick={() => setExistingContractAddress(existingContractAlive)}>
        Use existing contract 
        </button>
        <br/>
        <br/>
        <br/>
        <span className="words">
        Make sure to save your Contract address as we will need it to increment and decrement numbers
        for fun!
        <br/>
        Now on to the good stuff, you can view the current result of your increments
        and decrements here. Don't go to overboard!
        </span>
        <br/>
        <button onClick={returnResult} disabled={!contract}>
            Return the result of your calculation
        </button>
        <br/>
        {currentNumber ? <>&nbsp;&nbsp;Wacky Result: ${currentNumber.toString()}</> : null}
        <br/>
        <br/>
        <span className="words">
        Below will have all the buttons you need to mash to make number go up!
        </span>
        <br/>
        <span className="words">
        Or make number go down! Go Wild!
        </span>
        <br/>
        <br/>
        <span className="buttons">
        <table>
        <tr>
        <button onClick={increment1} disabled={!contract}>
        Increment by One
        </button>
        <button onClick={increment10} disabled={!contract}>
        Increment by Ten
        </button>
        <button onClick={increment100} disabled={!contract}>
        Increment by One Hundo
        </button>
        <button onClick={increment1000} disabled={!contract}>
        Increment by a Grand!
        </button>
        </tr>
        <tr>
        <button onClick={decrement1} disabled={!contract}>
        Decrement by One
        </button>
        <button onClick={decrement10} disabled={!contract}>
        Decrement by Ten
        </button>
        <button onClick={decrement100} disabled={!contract}>
        Decrement by One Hundo
        </button>
        <button onClick={decrement1000} disabled={!contract}>
        Decrement by a Grand!
        </button>
        </tr>
        </table>
        </span>
        <span className="words">
        Go to the Force Bridge here: <a href="https://force-bridge-test.ckbapp.dev/bridge/Ethereum/Nervos"> Force Bridge</a>
        You can set your "Layer 2 Deposit Address" as the receiver and then deposit some eth!.
        <br />
        Oh yeah your Polyjuice and Eth account details as well as your contract address!
        <br/>
        Check this snippet Here!
        </span>
        <div className="details">
        ETH address: <b>{accounts?.[0]}</b>
        <br  />
        Polyjuice address: <b>{polyjuiceAddress|| ' - '}</b>
        <br />
        Amount of ETH Available to Degen: <b>{parseInt(polyjuiceBalance) / 1000000000000000000 || ' - '}</b>
        <br  />
        Contract address: <b>{contract?.address || '-'}</b>
        <br/>
        The Transaction Hash: <b>{deployTxHash || '-'}</b>
        <br/>
        Layer 2 balance:{' '}
            <b>{layer2Bal ? (layer2Bal / 10n ** 8n).toString() : <LoadingIndicator />} CKB</b>
        <br/>
        Layer 2 Deposit Address:{' '}
            <b>{depoAddy || ' - '}</b>
        <br/>
        </div>
            <ToastContainer />
        </div>
    );
}