import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'

export default function useImageDropzone() {
    const [imgSrc, setImgSrc] = useState<string>();

    const onDrop = useCallback(function (acceptedFiles) {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = e => {
        // @ts-ignore
        if (typeof (e.target.result) === 'string') {
          // @ts-ignore
          setImgSrc(e.target.result);
        }
      };
      reader.readAsDataURL(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true })
  
    return { imgSrc, getRootProps, getInputProps };
}