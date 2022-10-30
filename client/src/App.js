import axios from "axios";
import {useEffect,useState} from "react";
import QrCodeScan from "./QrCodeScan";
import Loader from "./loader";
import SendMessage from "./SendMessage";



export default function App() {
  const [qrCode, setQrCode] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
   async function getQrPost() {
      const response = await axios.get("/api",'anish');
      setQrCode(response.data["qr"]);
      setIsLoading(true)
    }
    getQrPost();
  }, []);

  useEffect(() =>{
    async function getStatus() {
    const resposne = await axios.get("/getStatus");
    setStatus(resposne)
    setLoginStatus(true)
    console.log(status)
  }
  getStatus();
  },[status])

 // if (!qrCode) return "Unable to Connect to Server.....Please refresh the page"

  return (
    <>        
   
{!isLoading ?
       <div className="flex place-content-center mt-40 items-center">
      <Loader/>
    </div>
    
    :
    isLoading && qrCode && !loginStatus ? (
    <QrCodeScan data = {qrCode}/>
    ):       
      <SendMessage/>
    }
    </>
  )
}