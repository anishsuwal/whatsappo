import { useState,useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";


const fileTypes = ["JPEG", "PNG", "GIF","MP4"];

export default function DragAndDrop() {
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);

  const handleChange = (file) => {
    setFile(file);
  };
  useEffect(() => {
    let fileReader, isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [file]);
  
  return (
    <div >
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
  {/*      <p>{file ? `File name: ${file.name}` : "no files uploaded yet"}</p> */}

      { file ?
      <img src={fileDataURL} alt={file.name} height={200} width={200}/>

      :""
      }
    </div>
  );
  
}
