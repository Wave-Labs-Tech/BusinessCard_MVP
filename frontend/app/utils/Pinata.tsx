import axios from 'axios';
import FormData from 'form-data';

const key = process.env.NEXT_PUBLIC_PINATA_KEY;
const secret = process.env.NEXT_PUBLIC_PINATA_SECRET;

/** Chckes is key and secret are valid */
if (!key || !secret) {
    throw new Error("API key and secret must be defined in environment variables");
}

/**
 * Interface for the IPFS response
 */interface IPFSResponse {
    success: boolean;
    pinataURL?: string;
    message?: string;
}


/**
 * Uploads a JSON object to IPFS using Pinata
 * 
 * @param JSONBody - The JSON object to be uploaded
 * @returns A promise that resolves to an IPFSResponse
 */
export const uploadJSONToIPFS = async (JSONBody: Record<string, unknown>): Promise<IPFSResponse> => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    //making axios POST request to Pinata ⬇️
    try {
        const response = await axios.post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        });
    // console.log("response.data.IpfsHash PINATA", response.data.IpfsHash);
        return {
            success: true,
            pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`, //Usando esto devuelve la url completa
            // pinataURL: response.data.IpfsHash, //Devuelve solo el cid, no la url completa, adapta el sistema a este caso concreto
        };
    } catch (error: any) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Uploads a file to IPFS using Pinata
 * 
 * @param file - The file to be uploaded
 * @returns A promise that resolves to an IPFSResponse
 */
export const uploadFileToIPFS = async (file: File): Promise<IPFSResponse> => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    //making axios POST request to Pinata ⬇️
    //console.log("File size:", file.size, "bytes");
    const data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    try {
        const response = await axios.post(url, data, {
            maxBodyLength: Infinity, // Usa el valor numérico en lugar de la cadena
            headers: {
                'Content-Type': `multipart/form-data; boundary=${(data as any)._boundary}`, 
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        });

        return {
            success: true,
            pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        };
    } catch (error: any) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

