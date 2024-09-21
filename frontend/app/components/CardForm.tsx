import React, { useState, ChangeEvent, FormEvent } from 'react';
import { uploadJSONToIPFS, uploadFileToIPFS } from "../utils/Pinata";
import {
    handleNameChange as handleNameChangeFromUtils,
    handlePhoneNumberChange as handlePhoneNumberChangeFromUtils, handlePhoneNumberBlur,
    validateUrls
} from "../utils/Utils";
import { compressImage } from "../utils/CompressImage";
// import { handlePhoneNumberChange as handlePhoneNumberChangeFromUtils } from "../utils/Utils";
import { CardData } from '../../types';

// interface PrivateInfo {
//     telefono: string;
//     email: string;
//   }
// interface CardData {
//     name: string;
//     position: string;
//     urls: string;
//     // privateInfoUrl: string;
//     telefono: string;
//     email: string;
//   }

interface CardFormProps {
    onSubmit: (data: CardData, fileURL: string | null) => void;
}

const CardForm: React.FC<CardFormProps> = ({ onSubmit }) => {
    const [cancelProcess, setCancelProcess] = useState(false);
    const [formParams, updateFormParams] = useState<CardData>({
        name: '',
        position: '',
        urls: '',
        //   privateInfoUrl: '',
        telefono: '+',
        email: '',
    });
    // const [privateInfo, updatePrivateInfo] = useState<PrivateInfo>({
    //     telefono: '',
    //     email: '',
    //   });

    const [message, updateMessage] = useState('');
    const [fileURL, setFileURL] = useState<string | null>(null);
    // const [formParams, updateFormParams] = useState({ name: '', cargo: '', descripcion: '', telefono: '+', email: ''});
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [compressedPreviewUrl, setCompressedPreviewUrl] = useState<string | null>(null);

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e: React.FormEvent<HTMLInputElement>) {
        try {
            const fileInput = e.target as HTMLInputElement; // Afirmación de tipo
            const file = fileInput.files?.[0]; // Usa el operador de encadenamiento opcional
            // console.log("file en inicio de OnChangeFile: ", file)

            //check for file extension
            try {
                //upload the file to IPFS
                // disableButton();
                if (!file) return;
                const compressedImage = await compressImage(file, 1200, 1200);
                // console.log("compressedImage: ", compressedImage)
                console.log("Tamaño original:", file.size, "bytes");
                console.log("Tamaño comprimido:", compressedImage.size, "bytes");

                //ELIMINAR, comprobaciones de prueba
                // const originalUrl = URL.createObjectURL(file);
                // setOriginalUrl(originalUrl);
                const compressedUrl = URL.createObjectURL(compressedImage);
                setCompressedPreviewUrl(compressedUrl);

                // console.log("URL imagen original:", originalUrl);
                console.log("URL imagen comprimida:", compressedUrl);

                updateMessage("Uploading image.. please dont click anything!")
                if (file) {
                    //   const response = await uploadFileToIPFS(compressedImage);//DESACTIVADO durante el desarrollo
                    const response = {
                        success: true,
                        pinataURL: "https://gateway.pinata.cloud/ipfs/QmSRkTj5rrUUJcPPFcVrRMgdKKtdikkgZ4igVLe6i3dNXy",
                    };
                    if (response.success === true) {
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
            catch (e) {
                console.log("Error during file upload", e);
                updateMessage("Error uploading image")
            }
        } catch (error) {
            console.error("Error en OnChangeFile:", error);
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        handleNameChangeFromUtils(e, formParams, updateFormParams, updateMessage);
    };


    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhoneNumber = e.target.value;
        handlePhoneNumberChangeFromUtils(e, formParams, updateFormParams, updateMessage);
    };

    const handleCancel = () => {
        // e.preventDefault();
        setCancelProcess(true);
        // updateFormParams({ name: '', position: '', urls: '', privateInfoUrl: ''});
        updateFormParams({ name: '', position: '', urls: '', telefono: '+', email: '' });
        // updatePrivateInfo({telefono: '', email: ''});
        setFileURL('');
        updateMessage("");
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // const {telefono, email} = privateInfo;
        // if(!telefono || !email)
        //     {
        //         updateMessage("Please fill all the fields!")
        //         return;
        //     }
        //     const privateInfoJSON = {
        //         telefono, email
        //     }
        console.log("formparams y fileurl en CardForm", formParams, fileURL);
        const { isValid, invalidUrls } = validateUrls(formParams.urls);
        console.log("isValid, invalidUrls ", isValid, invalidUrls);
        if (!isValid) {
            updateMessage(`Las siguientes URLs no son válidas: ${invalidUrls.join(', ')}`);
            return;
        }
        try {
            //upload the metadata JSON to IPFS
            // const response = await uploadJSONToIPFS(privateInfoJSON);//DESACTIVADO TEMPORALMENTE
            // const response = { success: true, pinataURL: "https://gateway.pinata.cloud/ipfs/Qmds1TGp6kRiqpD8qp9Z67TSmqs5nqBk5bmbNDjSskmziW" };
            // if(response.success === true){
            //     console.log("Uploaded private JSON to Pinata: ", response);
            //     console.log("Uploaded private JSON PinataURL: ", response.pinataURL);
            //     // Actualizar formParams con la URL de la información privada
            //     updateFormParams(prev => ({
            //         ...prev,
            //         privateInfoUrl: response.pinataURL || ''
            //     }));
            //     // Esperar un momento para asegurarse de que el estado se haya actualizado
            // await new Promise(resolve => setTimeout(resolve, 0));
            // }

            // onSubmit({ ...formParams}, {...privateInfo}, fileURL );
            onSubmit({ ...formParams }, fileURL);
        }
        catch (e) {
            console.log("error uploading JSON metadata:", e);
            updateMessage("Error uploading private JSON metadata");
        }
    };
    //   const handlePrivateInfoChange = (field: keyof PrivateInfo, value: string) => {
    //     updatePrivateInfo(prev => ({ ...prev, [field]: value }));
    //   };

    return (
        <div className="flex flex-col place-items-center mt-10" id="nftForm">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4 text-blue-500">
                {/* <h3 className="text-center font-bold mb-8">Upload your Card to the APP</h3> */}
                <h3 className="text-center font-bold mb-8 text-xl md:text-2xl">Sube tu card a la DAPP</h3>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="name">Nombre</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name" type="text" name="name" placeholder="Tu nombre" required minLength={10}
                        maxLength={100} onChange={handleNameChange} value={formParams.name}></input>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="name">Posicion</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="position" type="text" name="position" placeholder="Tu posicion" required minLength={10}
                        maxLength={50} onChange={e => updateFormParams({ ...formParams, position: e.target.value })} value={formParams.position}></input>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2" htmlFor="urls">Urls</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        cols={40} rows={5} id="urls" name="urls" placeholder="Urls" onChange={e => updateFormParams({ ...formParams, urls: e.target.value })} value={formParams.urls}></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="telefono">Teléfono</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        // id="telefono" type="tel" name="telefono" placeholder="+34 555 555 555" required onChange={handlePhoneNumberChange} value={privateInfo.telefono}></input>
                        id="telefono" type="text" name="telefono" placeholder="+123 456 789 ó +12 34567890" required onChange={handlePhoneNumberChange} value={formParams.telefono}
                        onBlur={() => handlePhoneNumberBlur(formParams.telefono, updateFormParams, updateMessage)}></input>
                    {/* // id="telefono" type="tel" name="telefono" placeholder="+34 555 555 555" required onChange={e => updateFormParams({...formParams, telefono: e.target.value})} value={formParams.telefono}></input> */}

                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        // id="email" type="email" name="email" placeholder="tunombre@loquesea.com" required onChange={e => handlePrivateInfoChange("email",e.target.value)} value={privateInfo.email}></input>
                        id="email" type="email" name="email" placeholder="ejemplo@dominio.com" required minLength={20}
                        maxLength={100} onChange={e => updateFormParams({ ...formParams, email: e.target.value })} value={formParams.email}></input>
                </div>
                {/* <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
                </div> */}
                {/* <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="Cuenta">Cuenta</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="cuenta" type="text" name="cuenta" placeholder="Número de cuenta" required onChange={e => updateFormParams({...formParams, cuenta: e.target.value})} value={formParams.cuenta}></input>
                </div> */}
                <div>
                    <label className="block text-sm font-bold mb-2" htmlFor="image">Subir imagen (&lt;500 KB)</label>
                    <input type={"file"} onChange={OnChangeFile}></input>
                </div>
                <br></br>
                <div className="text-red-500 text-center">{message}</div>
                <div className="flex gap-2 text-sm md:text-lg">
                    <button type="submit" disabled={!formParams || !fileURL}
                        className="font-bold mt-10 w-4/5 bg-blue-500 text-white rounded p-2 shadow-lg" id="list-button">
                        Crear Card
                    </button>
                    <button onClick={handleCancel} className="font-bold mt-10 w-1/5 bg-red-600 text-white rounded p-2 shadow-lg" id="list-button">
                        Cancelar
                    </button>
                </div>
                {/* <button onClick={mintCard} className="font-bold mt-10 w-full bg-blue-500 text-white rounded p-2 shadow-lg" id="list-button">
                    Crear Card
                </button> */}
            </form>
            <div className="flex flex-col justify-center text-center font-bold mt-4 gap-2">
                {compressedPreviewUrl && (
                    <>
                        <h3>Vista previa de la imagen comprimida</h3>
                        <img src={compressedPreviewUrl} alt="Vista previa comprimida" style={{ width: 'auto' }} />
                    </>
                )}
            </div>
        </div>
    );
}
export default CardForm
