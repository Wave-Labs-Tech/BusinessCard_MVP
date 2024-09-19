import React, { useState, ChangeEvent, FormEvent } from 'react';
import { uploadJSONToIPFS, uploadFileToIPFS } from "../utils/Pinata";

// uint256 cardId;
// uint16 companyId;
// string name;
// string photo; 
// string position;
// string[] urls;
interface CardData {
    name: string;
    position: string;
    urls: string;
  }

interface CardFormProps {
    onSubmit: (data: CardData, fileURL: string | null) => void;
    cardId: number | null;
    companyId: number | null;
  }

  const CardForm: React.FC<CardFormProps> = ({ onSubmit }) => {
    const [formParams, updateFormParams] = useState<CardData>({
        name: '',
        // photo: '',
      position: '',
      urls: '',
    //   telefono: '',
    //   email: '',
    });
    // const [fileURL, setFileURL] = useState(null);

    const [message, updateMessage] = useState('');
    const [fileURL, setFileURL] = useState<string | null>(null);
    // const [formParams, updateFormParams] = useState({ name: '', cargo: '', descripcion: '', telefono: '+', email: ''});
  
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
            //   const response = await uploadFileToIPFS(file);//DESACTIVADO durante el desarrollo
              const response =  {success: true,
                pinataURL: "https://gateway.pinata.cloud/ipfs/QmSRkTj5rrUUJcPPFcVrRMgdKKtdikkgZ4igVLe6i3dNXy",};
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
            updateMessage("Error uploading image")
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("formparams y fileurl en CardForm", formParams, fileURL);
        onSubmit({ ...formParams}, fileURL );
      };

  return(
      <div className="flex flex-col place-items-center mt-10" id="nftForm">
            <form onSubmit={handleSubmit}  className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4 text-blue-500">
            {/* <h3 className="text-center font-bold mb-8">Upload your Card to the APP</h3> */}
            <h3 className="text-center font-bold mb-8">Sube tu card a la DAPP</h3>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="name">Nombre</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="name" type="text" name="name" placeholder="Tu nombre" required onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="name">Posicion</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="position" type="text" name="position" placeholder="Tu posicion" required onChange={e => updateFormParams({...formParams, position: e.target.value})} value={formParams.position}></input>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2" htmlFor="urls">Urls</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    cols={40} rows={5} id="descripcion" name="urls" required placeholder="Urls" value={formParams.urls} onChange={e => updateFormParams({...formParams, urls: e.target.value})}></textarea>
                </div>
                {/* <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="telefono">Teléfono</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="telefono" type="tel" name="telefono" placeholder="+34 555 555 555" required onChange={e => updateFormParams({...formParams, telefono: e.target.value})} value={formParams.telefono}></input>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="email" type="email" name="email" placeholder="tunombre@loquesea.com" required onChange={e => updateFormParams({...formParams, email: e.target.value})} value={formParams.email}></input>
                </div> */}
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
                <button type="submit" className="font-bold mt-10 w-full bg-blue-500 text-white rounded p-2 shadow-lg" id="list-button">
                    Crear Card
                </button>
                {/* <button onClick={mintCard} className="font-bold mt-10 w-full bg-blue-500 text-white rounded p-2 shadow-lg" id="list-button">
                    Crear Card
                </button> */}
            </form>
        </div>
);
}
export default CardForm
