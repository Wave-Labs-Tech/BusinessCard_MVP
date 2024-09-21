// export function compressImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
//Estaba devolviendo un string en formado base64 y no me sirve para un NFT
export function compressImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Cuando la lectura se completa
        reader.onload = function (e: ProgressEvent<FileReader>) {
            const img = new Image();

            // Cuando la imagen se carga
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    reject(new Error("No se pudo obtener el contexto del canvas"));
                    return;
                }

                // Calcular las nuevas dimensiones manteniendo la proporción original
                let newWidth: number, newHeight: number;
                if (img.width > img.height) {
                    newWidth = maxWidth;
                    newHeight = (maxWidth / img.width) * img.height;
                } else {
                    newHeight = maxHeight;
                    newWidth = (maxHeight / img.height) * img.width;
                }

                // Establecer el tamaño del canvas a las nuevas dimensiones
                canvas.width = newWidth;
                canvas.height = newHeight;

                // Dibujar la imagen en el canvas con las nuevas dimensiones
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                //En formato base 64 no sirve para un NFT
                // // Obtener el contenido del canvas como una imagen en formato base64
                // const compressedImageData = canvas.toDataURL("image/jpeg", 0.9); // 0.9 es la calidad de compresión

                // // Resolver la promesa con la imagen comprimida
                // resolve(compressedImageData);
                
                  // Convertir el contenido del canvas a un archivo blob comprimido
                  canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject("Error al comprimir la imagen");
                            return;
                        }

                        // Crear un archivo a partir del blob comprimido
                        const compressedFile = new File([blob], file.name, { type: file.type });

                        // Resolver la promesa con el archivo comprimido
                        resolve(compressedFile);
                    },
                    "image/jpeg", // Tipo de imagen
                    0.9 // Calidad de compresión (entre 0 y 1)
                );
            
            };

            // Establecer la fuente de la imagen como la URL de datos del archivo
            if (e.target && e.target.result) {
                img.src = e.target.result as string;
            } else {
                reject(new Error("Error al cargar la imagen"));
            }
        };

        // Leer el contenido del archivo como una URL de datos
        reader.readAsDataURL(file);

        // Manejar errores de lectura
        reader.onerror = function (error) {
            reject(error);
        };
    });
}
