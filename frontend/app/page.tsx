/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */

"use client";

import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import './globals.css';
import { Contract, ethers, JsonRpcProvider, Provider, Signer, Wallet } from "ethers";
import { businessCardABI } from "./assets/abis/businessCardABI";
import { CONTRACT_ADDRESS } from "./assets/constants/index";

import { uploadJSONToIPFS, uploadFileToIPFS } from "./utils/Pinata";
import { useRouter } from 'next/navigation';

// IMP START - Quick Start
import { Web3Auth } from "@web3auth/modal";
import { useEffect, useState } from "react";
// IMP END - Quick Start

// IMP START - Blockchain Calls
import RPC from "./ethersRPC";
// import RPC from "./viemRPC";
// import RPC from "./web3RPC";
// IMP END - Blockchain Calls

// IMP START - Dashboard Registration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Chain Config
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};
// IMP END - Chain Config

// IMP START - SDK Initialization
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
});
// IMP END - SDK Initialization

function App() {
  // const [provider, setProvider] = useState<IProvider | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [web3authProvider, setWeb3authProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [message, updateMessage] = useState('');
  const [formParams, updateFormParams] = useState({ name: '', cargo: '', descripcion: '', telefono: '+', email: ''});
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [] = useState();


  useEffect(() => {
    const init = async () => {
      try {
        // IMP START - SDK Initialization
        await web3auth.initModal();
        // IMP END - SDK Initialization
        // setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    // IMP START - Login
    const web3authProvider = await web3auth.connect();
    // IMP END - Login
    setWeb3authProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
      // setTimeout(() => {
      //   router.push('/dashboard');
      // }, 100);
    }
  };

  const getUserInfo = async () => {
    // IMP START - Get User Information
    const user = await web3auth.getUserInfo();
    // IMP END - Get User Information
    uiConsole(user);
  };

  const logout = async () => {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    setWeb3authProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  // IMP START - Blockchain Calls
  // // Check the RPC file for the implementation
  // const getAccounts = async () => {
  //   if (!web3authProvider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const address = await RPC.getAccounts(web3authProvider);
  //   uiConsole(address);
  // };

  // const getBalance = async () => {
  //   if (!web3authProvider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const balance = await RPC.getBalance(web3authProvider);
  //   uiConsole(balance);
  // };

  const signMessage = async () => {
    if (!web3authProvider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(web3authProvider);
    uiConsole(signedMessage);
  };

  // const sendTransaction = async () => {
  //   if (!web3authProvider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   uiConsole("Sending Transaction...");
  //   const transactionReceipt = await RPC.sendTransaction(web3authProvider);
  //   uiConsole(transactionReceipt);
  // };
  // IMP END - Blockchain Calls

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        // IMP START - SDK Initialization
        // Verificar si el web3auth ya está conectado
        if (!web3auth.connected && !web3auth.provider) {
          await web3auth.initModal();
          // setWeb3authProvider(web3auth.provider);
        }
        // Verificar si provider está inicializado
        if (web3auth.provider) {
          // setWeb3authProvider(web3auth.provider);
          // const user: Partial<UserInfo> = await web3auth.getUserInfo();
          // console.log("USER", user);
          // setUser(user);

          // const w3aProvider: ethers.BrowserProvider = new ethers.BrowserProvider(
          //   web3auth.provider
          // );
          // console.log("w3aProvider", w3aProvider);

          // const w3aSigner: ethers.JsonRpcSigner = await w3aProvider.getSigner();
          // setWeb3authSigner(w3aSigner);
          // console.log("w3aSigner", w3aSigner);
          // console.log("Web3authProvider", web3authProvider);

          // const web3 = new Web3(web3auth.provider as any);
          // console.log("web3", web3);
;
          // let initAddress: any = await web3.eth.getAccounts();
          // initAddress = initAddress[0];

          // console.log("initAddress", initAddress);
          // setAddress(initAddress);

          if (web3auth.connected) {
            setLoggedIn(true);
          }

          // const provider: JsonRpcProvider = new JsonRpcProvider(
          //   process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL
          // );
          ////////////////////BORRAR; ES PARA PRUEBAS LOCALES CON ANVIL SOLO///////////////
          // const provider: JsonRpcProvider = new JsonRpcProvider('http://localhost:8545');
          const provider: JsonRpcProvider = new JsonRpcProvider('http://localhost:8545', {
            chainId: 31337,
            name: 'anvil'
          });
          provider? setProvider(provider) : setProvider(null);
          console.log("APP provider", provider);
          //////////////////////////////////
          // const signer: ethers.Wallet = new Wallet(
          //   process.env.REACT_APP_WALLET_PRIVATE_KEY || "",
          //   provider
          // );
          ////////////////////BORRAR; ES PARA PRUEBAS LOCALES CON ANVIL SOLO///////////////
          setAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
          const signer: ethers.Wallet = new Wallet(
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            provider
          );
          //////////////////////////////////
          setSigner(signer);
          console.log("Signer APP", signer);
          
          // const initContract = new Contract(CONTRACT_ADDRESS, businessCardABI, signer);
          ////////////////////BORRAR; ES PARA PRUEBAS LOCALES CON ANVIL SOLO///////////////
          const initContract = new Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", businessCardABI, signer);
          //////////////////////////////////
          setContract(initContract);
          // console.log("ContractAPP", initContract);

          

          setIsLoading(false);
        } else {
          throw new Error("Provider not initialized");
        }

        // setEth(
        //   web3.utils.fromWei(
        //     await web3.eth.getBalance(initAddress as string), // Balance is in wei
        //     "ether"
        //   )
        // );

        // setBalanceOf(await initContract.balanceOf(initAddress));

        // setAllowance(
        //   await initContract.allowance(
        //     initAddress,
        //     "0xD96B642Ca70edB30e58248689CEaFc6E36785d68"
        //   )
        // );

      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  async function uploadMetadataToIPFS() {
    const {name, cargo, descripcion, telefono, email} = formParams;
    //Make sure that none of the fields are empty
    if( !name || !cargo || !descripcion || !telefono || !email || !fileURL)
    {
        updateMessage("Please fill all the fields!")
        return -1;
    }

    const nftJSON = {
        name, cargo, descripcion, telefono, email, image: fileURL
    }

    try {
        //upload the metadata JSON to IPFS
        const response = await uploadJSONToIPFS(nftJSON);
        if(response.success === true){
            console.log("Uploaded JSON to Pinata: ", response);
            console.log("Uploaded JSON PinataURL: ", response.pinataURL);
            return response.pinataURL;
        }
    }
    catch(e) {
        console.log("error uploading JSON metadata:", e)
    }
}

async function mintCard(e: React.FormEvent<HTMLButtonElement>) {
    console.log("Minting card");
    e.preventDefault();

    //Upload data to IPFS
    try {
        const metadataURL = await uploadMetadataToIPFS();
        if(metadataURL === -1)
            return;
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        // const provider = new ethers.Web3Provider(window.ethereum);
        // const signer = provider.getSigner();
        // disableButton();
        updateMessage("Uploading NFT(takes 5 mins).. please dont click anything!");

        //massage the params to be sent to the create NFT request
        // const price = ethers.parseUnits(formParams.price, 'ether');
        // let listingPrice = await contract.getListPrice();
        // listingPrice = listingPrice.toString();

        //actually create the Card
        if (contract){
          // let transaction = await contract.createToken(metadataURL, price, { value: listingPrice });
          // await transaction.wait();
        }

        alert("Successfully listed your NFT!");
        // enableButton();
        updateMessage("");
        updateFormParams({ name: '', cargo: '', descripcion: '', telefono: '+', email: ''});
        window.location.replace("/")
    }
    catch(e) {
        alert( "Upload error"+e )
    }
}
    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e: React.FormEvent<HTMLInputElement>) {
      const fileInput = e.target as HTMLInputElement; // Afirmación de tipo
    const file = fileInput.files?.[0]; // Usa el operador de encadenamiento opcional
      //check for file extension
      try {
          //upload the file to IPFS
          // disableButton();
          updateMessage("Uploading image.. please dont click anything!")
          if(file){
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
              // enableButton();
              updateMessage("")
              console.log("Uploaded image to Pinata: ", response.pinataURL)
              // Verifica que response.pinataURL no sea undefined
              if (response.pinataURL) {
                setFileURL(response.pinataURL);
                console.log("fileURL updated:", response.pinataURL);
            }
          }
      }
    }
      catch(e) {
          console.log("Error during file upload", e);
      }
  }
  

  const loggedInView = (
    <>
      {/* <div className="flex-container"> */}
      <div className="flex flex-col">
      <div className="flex justify-center bg-blue-500 p-4 rounded-lg">
        <h2 className="bg-blue-500 text-white">BUSINESS CARD</h2>
      </div>
        {/* <div>
          <button onClick={getUserInfo} className="card">
            Get User Info XX
          </button>
        </div> */}
        {/* <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div> */}
        {/* <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div> */}
        {/* <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div> */}
        {/* <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div> */}

        <div className="flex mt-10">
          {/* <button onClick={logout} className="card"> */}
          <button onClick={logout} className="w-full p-4 bg-stone-200 flex justify-center mt-10 text-stone-800 text-2xl font-bold rounded-md">
            Log Out
          </button>
        </div>
        <div className="flex flex-col place-items-center mt-10" id="nftForm">
            <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4 text-blue-500">
            <h3 className="text-center font-bold mb-8">Upload your Card to the APP</h3>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="name">Nombre</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="name" type="text" name="name" placeholder="Tu nombre" required onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="name">Cargo</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="cargo" type="text" name="cargo" placeholder="Tu cargo" required onChange={e => updateFormParams({...formParams, cargo: e.target.value})} value={formParams.cargo}></input>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2" htmlFor="description">Descripción</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    cols={40} rows={5} id="descripcion" name="descripcion" required placeholder="Descripción" value={formParams.descripcion} onChange={e => updateFormParams({...formParams, descripcion: e.target.value})}></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="telefono">Teléfono</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="telefono" type="tel" name="telefono" placeholder="+34 555 555 555" required onChange={e => updateFormParams({...formParams, telefono: e.target.value})} value={formParams.telefono}></input>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="email" type="email" name="email" placeholder="tunombre@loquesea.com" required onChange={e => updateFormParams({...formParams, email: e.target.value})} value={formParams.email}></input>
                </div>
                {/* <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
                </div> */}
                <div>
                    <label className="block text-sm font-bold mb-2" htmlFor="image">Subir imagen (&lt;500 KB)</label>
                    <input type={"file"} onChange={OnChangeFile}></input>
                </div>
                <br></br>
                <div className="text-red-500 text-center">{message}</div>
                <button onClick={listNFT} className="font-bold mt-10 w-full bg-blue-500 text-white rounded p-2 shadow-lg" id="list-button">
                    Crear Card
                </button>
            </form>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <div className="flex flex-col place-items-center mt-10 gap-12 bg-stone-100 p-20 rounded-xl">
    <div className="w-1/4">
    {/* <button  onClick={login} className="card"> */}
    <button onClick={login} className="w-full p-4 border-2 border-blue-500 rounded-xl bg-stone-200 text-xl text-blue-700 font-bold hover:scale-105">
      Login
    </button>
    </div>
    <img className="rounded-lg" src="professional_digital_identification.png" alt="Logo de una tarjeta de identificación digital profesional" />
    <h1 className="text-blue-800 text-5xl text-center font-bold m-4 w-full">
    El nuevo modo de identificacion profesional</h1>
    <h2 className="text-blue-700 text-4xl text-center font-bold">
    El futuro de las relaciones laborales</h2>
    </div>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web-Labs.tech{" "}
        </a>
        - Business Card
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/quick-starts/nextjs-modal-quick-start"
          target="_blank"
          rel="noopener noreferrer"
        >
          ENLACE A Source code (Quitar)
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-modal-sdk%2Fquick-starts%2Fnextjs-modal-quick-start&project-name=w3a-nextjs-modal&repository-name=w3a-nextjs-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
          ENLACE a Vercel (Quitar)
        </a>
      </footer>
    </div>
  );
}

export default App;
