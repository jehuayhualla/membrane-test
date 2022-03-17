import { useEffect, useState } from 'react';
import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import type { MetaMask as Mtm } from '@web3-react/metamask';
import type { Web3ReactHooks } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import quizABI from '../abi/quiz.abi.json';

const tokenAddress = '0x74f0b668ea3053052deaa5eedd1815f579f0ee03';

export const tokenSymbol = '$QUIZ';

export const [metaMask, hooks] = initializeConnector<MetaMask>(
  actions => new MetaMask(actions),
);

export const connectMetamask = (connector: Mtm) => {
  connector.activate(3);
};

export const disconnectMetamask = (connector: Mtm) => {
  connector.deactivate();
};

const parseToken = (amount: any): Number => {
  return amount / Math.pow(10, 18);
};

export const useBalance = (
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  accounts?: string[],
): Number => {
  const [balance, setBalance] = useState<Number>(0);

  const updateBalance = async () => {
    if (provider && accounts?.length) {
      const contract = new Contract(tokenAddress, quizABI, provider);
      const signerAddress = await provider.getSigner().getAddress();

      setBalance(parseToken(await contract.balanceOf(signerAddress)));

      const filter = contract.filters.Transfer(null, signerAddress);
      contract.on(filter, async (from, to, amount, event) => {
        setBalance(parseToken(await contract.balanceOf(signerAddress)));
      });

      return () => {
        setBalance(0);
        contract.off(filter, () => {});
      };
    }
  };

  useEffect(() => {
    updateBalance();
  }, [provider, accounts]);

  return balance;
};

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const sendAnswers = async (
  answers?: number[],
  provider?: ReturnType<Web3ReactHooks['useProvider']>,
  accounts?: string[],
) => {
  if (provider && accounts?.length) {
    const contract = new Contract(tokenAddress, quizABI, provider.getSigner());
    await contract.submit(randomIntFromInterval(0, 99999), answers, {
      gasLimit: 100000,
    });
  }
};
