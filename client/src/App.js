import { useEffect, useState } from "react";
import QrCodeScan from "./QrCodeScan";
import Loader from "./loader";
import SendMessage from "./SendMessage";
import axios from "axios";
import Disclaimer from "./Disclaimer";
import logo from "./logo.png"



export default function App() {
  const [qrCode, setQrCode] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isdisclaimer, setIsdisclaimer] = useState(false);


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

  useEffect(() => {
    async function getStatus() {
      const response = await axios.get("/getStatus");
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx",response.data)
      if (response.data === true) {
        console.log("inside")
        setStatus(response)
        setLoginStatus(true)
      }
      //console.log(status)
    }
    getStatus();
  }, [status])

  const getQRCode = async () => {
    setIsdisclaimer(true)
    const response = await axios.post("/qrcode", "start");
    setQrCode(response.data["qr"]);
    setIsLoading(true);
  };


  // if (!qrCode) return "Unable to Connect to Server.....Please refresh the page"

  return (
    <>
      <div className="ml-20 mr-20 mt-2">
        <img src={logo} alt="logo" height={90} width={250} />
        {!isdisclaimer ?
        <div className=" text-center">
          <Disclaimer />
          <button className=" mt-5 text-center
           bg-[#88c6bd] text-red-600 font-semibold hover:bg-[#50a79e] hover:text-red-300   rounded-2xl p-3 pl-10 pr-10" onClick={getQRCode}>I Agree</button>
        </div>
        :
        (!isLoading ?
          <div className="flex place-content-center mt-40 items-center">
            <Loader />
          </div>
          :
          isLoading && qrCode && !loginStatus ? (
            <QrCodeScan data={qrCode} />
          ) :
            <SendMessage />
        )
      }
      </div>

    </>
  )
}