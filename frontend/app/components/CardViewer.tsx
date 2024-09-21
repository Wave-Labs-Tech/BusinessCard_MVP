import React, { useEffect, useState } from 'react'
// import { ethers, JsonRpcProvider } from 'ethers';
import axios from 'axios'
import { abi721 } from '../assets/abis/erc721'
import { ethers } from 'ethers'
import { useContract } from '../ContractContext'
// import { CONTRACT_ADDRESS } from './constants';
// import { abi } from "./assets/abis/erc20";
// import { CONTRACT_ADDRESS } from "./assets/constants/index";

interface NFTData {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

//   const NFTViewer = () => {
function CardViewer(): JSX.Element {
  const {address, isConnected, provider } = useContract();
  // const [contractAddress, setContractAddress] = useState<Address | undefined>(undefined)
  const [contractAddress, setContractAddress] = useState<string | ''>('');
  const [tokenId, setTokenId] = useState('')
  const [nftData, setNftData] = useState<NFTData | null>(null)
  const [error, setError] = useState('')
  const [addressError, setAddressError] = useState('');
  // const [contract, setContract] = useState(null);

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  useEffect(() => {
    if (isConnected && address) {
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const contract = new ethers.Contract(contractAddress, ContractABI, provider);
        // setContract(contract);
        // provider.send("eth_requestAccounts", []).then(accounts => {
        //     setAddress(accounts[0]);
        //     setIsConnected(true);
        // }).catch(() => {
        //     setIsConnected(false);
        // });
        // contract.balanceOf(address, 1).then(result => {
        //     setBalance(result.toString());
        // });
    }
}, [address, isConnected]);


  // const {
  //   data: uri721,
  //   refetch: refetch721,
  //   isError: isError721,
  // } = useReadContract({
  //   address: contractAddress && isValidAddress(contractAddress) ? contractAddress : undefined,
  //   abi: abi721,
  //   functionName: 'tokenURI',
  //   args: [tokenId],
  // });

  // // Leer URI del contrato ERC-1155
  // const {
  //   data: uri1155,
  //   refetch: refetch1155,
  //   isError: isError1155,
  // } = useReadContract({
  //   address: contractAddress && isValidAddress(contractAddress) ? contractAddress : undefined,
  //   abi: abi1155,
  //   functionName: 'uri',
  //   args: [tokenId],
  // });

    const fetchNFTData = async () => {
      if (!contractAddress || !tokenId) {
        setError('Contract address and Token ID are required');
        return;
      }
      if (!isValidAddress(contractAddress)) {
        setError('Invalid contract address');
        return;
      }
      setError('');
      setNftData(null);

      const getERC721 = async (): Promise<string | undefined> => {
        if (contractAddress && isValidAddress(contractAddress)) {
          const contract = new ethers.Contract(contractAddress, abi721, provider);
          return await contract.tokenURI(tokenId);
        }
        return undefined;
      };
      
      const getERC1155 = async (): Promise<string | undefined> => {
        if (contractAddress && isValidAddress(contractAddress)) {
          const contract = new ethers.Contract(contractAddress, abi1155, provider);
          return await contract.uri(tokenId);
        }
        return undefined;
      };

      let uri: string | undefined
      try {
        // Attempt to fetch ERC-1155 data
        uri = await getERC1155();
        if (!uri) {
          // If ERC-1155 fails, try ERC-721
          uri = await getERC721();
        }
      } catch (err: unknown) {
        setError((err as { message: string }).message);
        console.error((err as { message: string }).message);
    }
  

      // await refetch721();
      // if (!isError721) {
      //   uri = uri721 as string;
      // } else {
      //   await refetch1155();
      //   if (!isError1155) {
      //     uri = uri1155 as string;
      //   }
      // }

      if (uri && typeof uri === 'string' && uri.startsWith('http')) {
        // const response = await axios.get(uri);
        console.log("URI", uri);

        const baseIpfsUrl = 'https://ipfs.io/ipfs/';
        // Verifica si el URI comienza con la URL base de IPFS
        console.log("baseIpfsUrl", baseIpfsUrl);
        if (uri.startsWith(baseIpfsUrl)) {
          let tempUri = uri.slice(baseIpfsUrl.length); // Retorna el URI sin la parte base
          uri = `https://gateway.pinata.cloud/ipfs/${tempUri}`;
        }
        console.log("URIDESP", uri);
        // const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${uri?.split('/').pop()}`);
        const response = await axios.get(uri);
        console.log("Responde", response);
        setNftData(response.data);
        console.log("Response.DATA", response.data);
      } else {
        setError('Invalid URI');
        console.error('Error fetching NFT data');
      }
    } 

  return (
    <>
      <Navbar></Navbar>
    <div  className="flex flex-col items-center p-12 w-full max-w-4xl mx-auto mt-20 text-white space-y-8">

      <h1 className="text-3xl font-bold">VISOR DE TARJETAS y NFTs</h1>
      <div className="flex w-full space-x-2">
      <input
        // className="flex-grow text-xl bg-zinc-400 bg-opacity-70 rounded-lg border-2 p-4"
        className={`w-full text-xl bg-zinc-400 bg-opacity-70 rounded-lg border-2 p-4 ${
          addressError ? 'border-red-500' : 'border-gray-300'
        }`}
        type="text"
        placeholder="Identificador de la tarjeta"
        value={contractAddress ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          setContractAddress(value);
          if (value && !isValidAddress(value)) {
            setAddressError('Dirección no válida');
          } else {
            setAddressError('');
          }
        }}
      />
      {addressError && (
        <p className="absolute text-red-500 text-sm mt-1 mb-2">{addressError}</p>
      )}
      
      <input
        // className="text-xl text-white break-word m-2 md:mx-20  md:w-2/5    bg-zinc-400 bg-opacity-70  space-y-8  shadow-2xl rounded-lg border-2 p-4 w-1/5 overflow-auto" 
        className="w-20 text-xl text-zinc-900 bg-zinc-400 bg-opacity-70 rounded-lg border-2 p-4" 
        type="number"
        placeholder="Numero del identicador"
        value={tokenId}
        min={1}
        step={1}
        onChange={(e) => setTokenId(e.target.value)}
      />
      </div>
      <button 
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={fetchNFTData}>Visualizar tarjeta</button>

      {nftData && (
        // <div className="nft-container">
        <div className="flex flex-col items-center space-y-4 w-full">
          <h2 className="text-2xl font-semibold">Address conectada: {address}</h2>
          <img src={nftData.image} alt={nftData.name} className="max-w-full h-auto" />
          <h2 className="text-2xl font-semibold text-center">Nombre de la tarjeta: {nftData.name}</h2>
          <p className="text-center">Descripción: {nftData.description}</p>
          {nftData?.attributes?.map((attr, idx) => (
            // <div className="attributes" key={idx}>
            <div  className="flex space-x-2 justify-center" key={idx}>
              <strong>{attr.trait_type}:</strong> {attr.value}
            </div>
          ))}
        </div>
      )}
    </div>
</>
  )
}

export default NFTViewer

function setNftData(data: any) {
  throw new Error('Function not implemented.')
}
