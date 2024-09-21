import { CardData } from "@/types";

const isValidUrl = (url: string): boolean => {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocolo
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // nombre de dominio
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // O dirección IP (v4)
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // puerto y path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(url) && (url.startsWith('http://') || url.startsWith('https://'));
};

export const validateUrls = (text: string): { isValid: boolean; invalidUrls: string[] } => {
  const urls = text.split('\n').map(url => url.trim()).filter(url => url !== '');
  const invalidUrls = urls.filter(url => !isValidUrl(url));
  return {
    isValid: invalidUrls.length === 0,
    invalidUrls
  };
};

export function validateName(name: string): boolean {
  return /^[a-zA-Z\s]*$/.test(name);
}
  
  export const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    formData: CardData,
    updateFormParams: React.Dispatch<React.SetStateAction<CardData>>,
    updateMessage: (message: string) => void
  ): void => {
    const newName = e.target.value;
    // No actualizamos el estado aquí
    
    // Validación inmediata
    if (!validateName(newName)) {
      updateMessage("El nombre solo puede contener letras y espacios");
    } else {
      updateFormParams(prev => ({ ...prev, name: newName }));
      // Limpiar el mensaje de error si es válido
      updateMessage("");
    }
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    // Permitir +, espacios y números
    const regex = /^\+?[\d\s]{10,15}$/;
    return regex.test(phoneNumber);
  };
  
  const formatPhoneNumber = (phoneNumber: string): string => {
    // Eliminar todos los caracteres no numéricos excepto '+'
    return phoneNumber.replace(/[^\d+]/g, '');
  };
  
  export const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    formData: CardData,
    updateFormParams: React.Dispatch<React.SetStateAction<CardData>>,
    updateMessage: (message: string) => void
  ): void => {
    const newPhoneNumber = e.target.value;
    
    // Permitir la entrada de '+', espacios y números
    if (!/^[\d\s+]*$/.test(newPhoneNumber)) {
      return; // No actualizar si contiene caracteres no permitidos
    }
  
    updateFormParams({
      ...formData,
      telefono: newPhoneNumber
    });
  
    // Validación en tiempo real
    if (newPhoneNumber.length > 0 && !validatePhoneNumber(newPhoneNumber)) {
      updateMessage("Formato: +123 456 789 (10-15 dígitos)");
    } else {
      updateMessage("");
    }
  };
  
  // Función para manejar la pérdida de foco (opcional)
  export const handlePhoneNumberBlur = (
    phoneNumber: string,
    updateFormParams: React.Dispatch<React.SetStateAction<CardData>>,
    updateMessage: (message: string) => void
  ): void => {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    updateFormParams(prevState => ({
      ...prevState,
      telefono: formattedNumber
    }));
  
    if (!validatePhoneNumber(formattedNumber)) {
      updateMessage("Número de teléfono inválido. Debe tener entre 10 y 15 dígitos.");
    } else {
      updateMessage("");
    }
  };
  