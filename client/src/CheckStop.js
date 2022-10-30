


import {useRef,useState, useEffect, React } from 'react';



export default function CheckStop() {

    const [isDisabled, setIsDisabled] = useState(false);
    const [isStop, setIsStop] = useState(false);
    const stopBtn = useRef();


    async function forLoop(){
        for (var i = 0; i < 5; i++) {            
            console.log(i,isDisabled,isStop,stopBtn.current)
            if (stopBtn.current === true) {
                break;
              }
            await timeout(3000); //for 10 sec delay
        }
        setIsDisabled(false)
        setIsStop(false)
    }

    async function changeBool(){
        setIsDisabled(true)
        setIsStop(true)
        stopBtn.current = isStop
        console.log("BOOL",isDisabled,isStop,stopBtn.current)
    }
    useEffect(() => {
        stopBtn.current = isStop
      }, [isStop]);

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    return (
    <>
        <div className="justify-center items-center  text-bold px-5 xl:ml-10 xl:mr-10    mt-5  ">
            <div className="  p-3   items-center justify-center text-center mt-10">
                <button onClick={forLoop} className="border p-5 md:text-2xl font-bold bg-green-600">Check </button>                                
            </div>
            <div className="  p-3   items-center justify-center text-center mt-10">
                <button onClick={changeBool} className="border p-5 md:text-2xl font-bold bg-red-600">bool </button>                                
            </div>
        </div>
    </>
    )
}