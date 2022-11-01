import {useEffect,useState} from "react";
import QrCodeScan from "./QrCodeScan";
import Loader from "./loader";
import SendMessage from "./SendMessage";
import axios from "axios";



export default function App() {
  const [qrCode, setQrCode] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

/*useEffect(() => {
   async function getQrPost() {
      const response = await axios.get("/api/qrcode",'anish');
      qrco = response.data
      if(qrCo!="")
      {
        setQrCode(qrCode);
        setIsLoading(true)
      }
    }
    getQrPost();
  }, []);*/

  useEffect(() =>{
    async function getStatus() {
    const resposne = await axios.get("api/getStatus");
    
    if(resposne!="")
    {
      setStatus(resposne)
      setLoginStatus(true)
    }
    //console.log(status)
  }
  getStatus();
  },[status])

  const getQRCode = async () => {
    const response = await axios.post("/api/qrcode", "start" );
    setQrCode(response.data["qr"]);
    setIsLoading(true);
  };


 // if (!qrCode) return "Unable to Connect to Server.....Please refresh the page"

  return (
    <>        

    <button onClick={getQRCode}>Get QRCode</button>

      {!isLoading ?
        <div className="flex place-content-center mt-40 items-center">
          <Loader />
        </div>

        :
        isLoading && qrCode && !loginStatus ? (
          <QrCodeScan data={qrCode} />
        ) :
          <SendMessage />
      }
    </>
  )
}