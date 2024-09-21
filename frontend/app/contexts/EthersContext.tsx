// ContractContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { businessCardABI } from '../assets/abis/businessCardABI';
import { CONTRACT_ADDRESS } from '../assets/constants';
// src\assets\constants\index.js

// type ContractContextType = ethers.Contract | null;

interface ContractContextType {
  contract: ethers.Contract | null;
  // contractB: ethers.Contract | null;
  address: string | null;
  isConnected: boolean;
  provider: any;
}

const EthersContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [provider, setProvider] = useState<any | null>(null);

  useEffect(() => {
    const initContracts = async () => {
      if (window.ethereum) {
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setProvider(provider);

            if (accounts.length === 0) {
              console.error("No hay cuentas disponibles. Asegúrate de que la wallet esté desbloqueada.");
              return;
            }
            
            const signer = await provider.getSigner();
            // const userAddress = accounts[0]; // Usa la cuenta obtenida
            const address = await signer.getAddress();
       
            // setAddress(userAddress);
            setAddress(address);
            setIsConnected(true);

            // Inicializar contrato 
            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, businessCardABI, signer);
            setContract(contractInstance);

            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                setAddress(accounts[0] || null);
                setIsConnected(accounts.length > 0);
            });
        } catch (error) {
            console.error("Error al conectar:", error);
        }
    } else {
        alert('Por favor, instala una wallet como MetaMask o Trust Wallet.');
    }
    };

    initContracts();
  }, []); // El array vacío asegura que esto se ejecute solo una vez cuando el componente se monta

  return (
    <EthersContext.Provider value={{ contract, address, isConnected, provider}}>
      {children}
    </EthersContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
export const useContract = () => {
  const context = useContext(EthersContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};