import React, { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = '0xc8BAdFBD7db6f183e74C37875a7547b98860e2F3';

function App() {
  const [greeting, setGreetingValue] = useState('');

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setGreetingValue(data);
        console.log('data: ', data);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function setGreeting(value) {
    if (!value) return;
    if (!typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(value);
      await transaction.wait();
      fetchGreeting();
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await setGreeting(event.target.greetingInput.value);
    setGreetingValue(event.target.greetingInput.value);
    event.target.greetingInput.value = '';
  }

  return (
    <div className="grid h-screen place-items-center bg-slate-50">
      <div className="max-w-lg container bg-white shadow rounded-lg px-8 pb-4">
        <div className="text-gray-600 font-bold text-xl mt-6 mb-4">
          React Ethereum Dapp
        </div>
        <div className="w-full border p-4 mb-4 rounded border-slate-200">
          <div className="text-gray-600 font-bold text-md mb-2">
            Fetch Greeting Message From Smart Contract
          </div>
          <div className="flex ">
            <button
              className="bg-slate-100 hover:bg-slate-200 text-gray-600 font-semibold py-2 px-4 rounded"
              onClick={fetchGreeting}
            >
              Fetch Greeting
            </button>
          </div>
        </div>
        <div className="w-full border p-4 mb-4 rounded border-slate-200">
          <div className="text-gray-600 font-bold text-md mb-2">
            Set Greeting Message On Smart Contract
          </div>
          <form
            className="flex items-center justify-between"
            onSubmit={(event) => handleSubmit(event)}
          >
            <input
              className="grow border border-slate-200 rounded py-[0.6rem] px-2 mr-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="greetingInput"
            />
            <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded">
              Set Greeting
            </button>
          </form>
        </div>
        <div className="w-full border p-4 mb-4 rounded border-slate-200">
          <div className="text-gray-600 font-bold text-md py-1">
            Greeting Message
          </div>
          <p>{greeting}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
