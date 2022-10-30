


import { useRef, useState, useEffect, React } from 'react';
import { FileUploader } from "react-drag-drop-files";
import readXlsxFile from 'read-excel-file'
import { axiosInstance } from './config';

const fileTypes = ["JPEG", "JPG", "PNG", "GIF", "MP4"];
const xlFile = ["XLS", "XLSX"];

export default function SendMessage() {

    const [chooseMethod, setchooseMethod] = useState('')
    const [conCode, setConCode] = useState('')
    const [fNumber, setFnumber] = useState('')
    const [tNumber, setTnumber] = useState('')
    const [msg, setMsg] = useState('')
    const [fieldError, setFieldError] = useState(false)
    const [success, setSuccess] = useState([]);
    const [notRegister, setNotRegister] = useState([]);
    const form = useRef()
    const [file, setFile] = useState(null);
    const [fileExcel, setFileExcel] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isStop, setIsStop] = useState(false);
    const stopBtn = useRef();



    const handleChange = (file) => {
        setFile(file[0]);
    };
    const handleExcelChange = (fileExcel) => {
        setFileExcel(fileExcel);
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

    useEffect(() => {
        let fileReader, isCancel = false;
        if (fileExcel) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target;
                if (result && !isCancel) {
                    setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(fileExcel);
        }
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        }
    }, [fileExcel]);


    const callStop = async () => {
        // req code...
        setIsStop(true)
        setIsDisabled(false)
        stopBtn.current = isStop
        console.log("callStop", isDisabled, isStop, stopBtn.current)
    }

    useEffect(() => {
        stopBtn.current = isStop
    }, [isStop]);


    const sendMsg = async (e) => {
        setIsDisabled(true)
        e.preventDefault();
        if (chooseMethod === true) {
            if (conCode.length === 0 || fNumber.length === 0 || tNumber.length === 0) {
                setFieldError(true)
                return
            }
            else {
                if (msg.length === 0 && file === null)
                    alert("Please Write the Message or attahced the file...")
                else
                    if (file === null)
                        SendNow()
                    else
                        if (await uploadFile() === 200) {
                            console.log("Sending")
                            SendNow()
                        }
                        else
                            alert("Server Problem. Please check the connection")
            }
        }
        else if (chooseMethod === false) {
            console.log('bulk msg')
            if (msg.length === 0 && fileExcel === null) {
                setFieldError(true)
                return
            }
            else {
                if (file === null)
                    SendFromExcelNow()
                else
                    if (await uploadFile() === 200) {
                        console.log("Sending")
                        SendFromExcelNow()
                    }
                    else
                        alert("Server Problem. Please check the connection")
            }
        }
        else {
            alert("Please Select the Method")
        }
        setFieldError(false)
    };

    async function uploadFile() {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axiosInstance.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (res.status === 200)
            console.log("File Upload Success")
        return res.status
    }
    async function SendNow() {
        for (var i = fNumber; i <= tNumber; i++) {
            console.log("callStop", isDisabled, isStop, stopBtn.current)
            if (stopBtn.current === true) {
                break;
            }
            if (file === null) {
                await axiosInstance.post('/api/apiSendMessage', {
                    phone: "+" + conCode + String(i),
                    //phone: "+" + conCode + "984145315",
                    message: msg
                })
                    .then(function (response) {
                        setDeliveryStatus(response.data, i)
                    })
                    .catch(function (error) {
                        alert(error);
                    });
                await timeout(15000); //for 10 sec delay
            }

            else {
                await axiosInstance.post('/api/apiSendMessageWithAttachment', {
                    phone: "+" + conCode + String(i),
                    //phone: "+" + conCode + "9841453151",
                    message: msg,
                    fileName: file.name
                })
                    .then(function (response) {
                        setDeliveryStatus(response.data, i)
                    })
                    .catch(function (error) {
                        alert(error);
                    });
                await timeout(30000); //for 10 sec delay

            }
        }
        alert("Message sent to ALL")
        setIsStop(false)
        setIsDisabled(false)
    }

    async function SendFromExcelNow() {
        readXlsxFile(fileExcel).then(async function (rows) {
            const phone = rows
            for (var i = 0; i < phone.length; i++) {
                console.log("callStop", isDisabled, isStop, stopBtn.current)
                if (stopBtn.current === true) {
                    break;
                }
                if (file === null) {
                    await axiosInstance.post('/api/apiSendMessage', {
                        phone: String(phone[i]),
                        message: msg
                    })
                        .then(function (response) {
                            console.log(response);
                            setDeliveryStatus(response.data, phone[i])
                        })
                        .catch(function (error) {
                            alert(error);
                        });
                    await timeout(5000); //for 10 sec delay
                }

                else {

                    await axiosInstance.post('api/apiSendMessageWithAttachment', {
                        phone: String(phone[i]),
                        message: msg,
                        fileName: file.name
                    })
                        .then(function (response) {
                            console.log(response);
                            setDeliveryStatus(response.data, phone[i])
                        })
                        .catch(function (error) {
                            alert(error);
                        });
                    await timeout(10000); //for 10 sec delay
                }
            }
            alert("Message sent to ALL")
            setIsStop(false)
            setIsDisabled(false)
        })
    }

    function setDeliveryStatus(response, phNo) {
        if (response === 0) {
            setSuccess(success => [...success, phNo])
        }
        else
            setNotRegister(notRegister => [...notRegister, phNo])
    }

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }


    return (
        <>
            <div className="justify-center items-center  text-bold px-5 xl:ml-10 xl:mr-10    mt-5  ">
                <div className="  p-3   items-center justify-center text-center ">
                    <p className="text-xl md:text-2xl font-bold text-green-600">Your What'sApp Messages </p>
                </div>
                <div className='flex flex-col-3 justify-between  '>
                    <div className=' text-center rounded-lg shadow-2xl bg-green-900 text-black  p-3'>
                        <span className='text-orange-400 text-lg font-semibold'>Succefully Delivered</span>
                        <div className="overflow-y-auto bg-green-400 
                    p-5 h-[580px] w-52 text-justify rounded-3xl mt-5">
                            {success.map((link, index) => (
                                <p key={index} className=' font-medium text-center text-sm '>
                                    <span>({index + 1}) </span>
                                    <span className='ml-5'>{link}</span>
                                </p>))}
                        </div>
                    </div>
                    <div>
                        <div className=" items-center rounded-lg shadow-2xl bg-white  p-2 ">
                            <p className="md:text-xs xl:text-lg font-semibold p-5 shadow-lg mt-2 border-t rounded-lg text-center">Please Enter details</p>

                            <form ref={form} onSubmit={sendMsg} >
                                <div className="flex flex-row justify-between m-5 h-36  items-center ">
                                    <div className='p-5 rounded-2xl border mt-5'>
                                        <p className='text-center font-semibold border-b-2' >Select Your Option</p>
                                        <div className=" items-center mt-8">
                                            <input disabled={isDisabled} className="sr-only peer" type="radio" value="Yes" name="chooseMethod" id="Yes" />
                                            <label disabled={isDisabled} className=" rounded-full  p-2 w-5 h-5 text-xs
                                             bg-white border border-gray-300  
                                                cursor-pointer focus:outline-none  hover:bg-green-600 hover:text-white 
                                                peer-checked:bg-green-600 peer-checked:text-white  font-bold peer-checked:ring-1 
                                                peer-checked:border-transparent justify-center"
                                                htmlFor="Yes" onClick={() => {
                                                    setchooseMethod(true)
                                                }}>{"O"}</label> <span className='ml-2 text-sm'>Send Messages Individual</span>
                                        </div>
                                        <div className=" mt-8">
                                            <input disabled={isDisabled} className="sr-only peer" type="radio" value="No" name="chooseMethod" id="No" />
                                            <label disabled={isDisabled} className=" rounded-full p-2  w-5 h-5  justify-center  text-xs bg-white border border-gray-300  cursor-pointer focus:outline-none 
                           hover:bg-green-600 hover:text-white   peer-checked:bg-green-600 peer-checked:text-white  font-bold peer-checked:ring-1 peer-checked:border-transparent"
                                                htmlFor="No" onClick={() => {
                                                    setchooseMethod(false)
                                                }}>{"O"}</label>  <span className='ml-2 text-sm'>Send Bulk Messages From File </span>
                                        </div>
                                        {
                                            fieldError && chooseMethod.length === '' ?
                                                <p className=" mt-1 text-red-600 font-semibold text-xs ">*Please Select The Option</p>
                                                : ""
                                        }
                                    </div>
                                    {chooseMethod ?
                                        <div className=' rounded-2xl border p-5'>
                                            <p className='text-center font-semibold border-b-2' >Please Input the Correct Phone Number In Range</p>
                                            <div className='flex flex-row items-center   gap-x-10'>
                                                <div>
                                                    <p>Country Code</p>
                                                    <input disabled={isDisabled} className=" border
                        rounded-lg   py-2 px-4  text-black  text-center text-sm w-32 mt-5" placeholder="+977"
                                                        id="countryCode" type="number" name="contryCode" onChange={e => setConCode(e.target.value)} />
                                                </div>
                                                <div className="flex flex-col  ">
                                                    <input disabled={isDisabled} className=" border
                        rounded-lg   py-2 px-4  text-black  text-center text-sm w-72 mt-5" placeholder="Start "
                                                        id="fromNumber" type="number" name="fromNumber" onChange={e => setFnumber(e.target.value)} />

                                                    <input disabled={isDisabled} className=" border
                        rounded-lg   py-2 px-4  text-black  text-center text-sm w-72 mt-5" placeholder=" End"
                                                        id="toNumber" type="number" name="toNumber" onChange={e => setTnumber(e.target.value)} />
                                                </div>
                                            </div>
                                            {
                                                fieldError && (conCode === '' || fNumber === '' || tNumber === '') ?
                                                    <p className=" mt-5 text-red-600 font-semibold text-xs ">*Plese Enter the required Fileds</p>
                                                    : ""
                                            }
                                        </div>
                                        :
                                        <div className=' rounded-2xl border p-5 mt-5 w-[500px]'>
                                            <p className='text-center font-semibold border-b-2' >Please Upload the Correct Excel File</p>
                                            <div >
                                                <FileUploader
                                                    multiple={false}
                                                    handleChange={handleExcelChange}
                                                    name="file"
                                                    types={xlFile}
                                                    disabled={isDisabled}
                                                />
                                            </div>
                                            <div className='flex flex-row items-center justify-between mt-5'>
                                                <div>

                                                    {<p>{fileExcel ? `File name: ${fileExcel.name}` : "no files uploaded yet"}</p>}

                                                </div>
                                                <div>
                                                    {!isDisabled && fileExcel ?
                                                        <a onClick={() => { setFileExcel(null) }}
                                                            className='ml-6 pl-5 pr-5 border text-right p-2 bg-red-600 rounded-full  
                                        cursor-pointer  hover:bg-green-600 hover:text-red-600 text-white '>Delete
                                                        </a>
                                                        : ""}

                                                </div>
                                            </div>
                                            {
                                                fieldError && fileExcel == null ?
                                                    <p className=" mt-1 text-red-600 font-semibold text-xs ">*Plese Enter the required Fileds</p>
                                                    : ""
                                            }
                                        </div>

                                    }
                                </div>

                                <div className="flex flex-row justify-between   items-center ">
                                    <div className='m-5 p-5 rounded-2xl border h-80'>
                                        <p className='text-center font-semibold border-b-2' >Enter Your Message Here ::</p>
                                        <textarea disabled={isDisabled}
                                            rows="4"
                                            className="block p-2.5 
                                                        w-96
                                                        h-60
                                                        text-sm
                                                        bg-clip-padding 
                                                        transition
                                                        ease-in-out
                                                        rounded-lg
                                                        m-0
                                                        border-green-600 
                                                        border"
                                            placeholder="Enter Your Message Here"
                                            id="message" name='message' type="text" onChange={e => setMsg(e.target.value)} />
                                    </div>
                                    <div className='m-5 p-5 rounded-2xl border w-full h-80 '>
                                        <span className='text-center font-semibold border-b-2' >Attach Your Image of Video File Here::</span>
                                        <div >
                                            <FileUploader
                                                multiple={true}
                                                handleChange={handleChange}
                                                name="file"
                                                types={fileTypes}
                                                disabled={isDisabled}
                                            />
                                            {<p className='pt-2 pb-5'>{file ? `File name: ${file.name}` : "no files uploaded yet"}
                                            </p>}
                                        </div>
                                        <div className='flex flex-row items-center justify-between'>
                                            <div>
                                                {file ?
                                                    <img src={fileDataURL} alt={file.name} height={90} width={140} />
                                                    : ""
                                                }
                                            </div>
                                            <div>

                                                {!isDisabled && file ?
                                                    <a onClick={() => { setFileDataURL(null); setFile(null) }}
                                                        className='ml-6 pl-5 pr-5 border text-right p-2 bg-red-600 rounded-full  
		cursor-pointer  hover:bg-green-600 hover:text-red-600 text-white '>Delete
                                                    </a>
                                                    : ""}
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="flex  w-full  items-center justify-center text-center  ">
                                    {!isDisabled ?
                                        <button disabled={isDisabled} className=" border bg-green-600 
                                                        rounded-lg py-2 px-10  text-xs lg:text-sm text-white shadow-2xl
                                                        shadow-black hover:bg-green-300 hover:text-green-600 "
                                        >Send Message
                                        </button>
                                        :
                                        <a onClick={callStop}
                                            className=' pl-5 pr-5 border text-center p-2 w-32 bg-red-600 rounded-full  
                                    cursor-pointer  hover:bg-green-600 hover:text-red-600 text-white '>Stop
                                        </a>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className=' text-center rounded-lg shadow-2xl bg-black text-cyan-50  p-3 '>
                        <span className='text-red-700 text-lg font-semibold'>Not Registered</span>
                        <div className="overflow-y-auto bg-slate-800 
                                        p-3 h-[580px] w-52 text-justify rounded-3xl text-red-400 mt-5">
                            {notRegister.map((link, index) => (
                                <p key={index} className=' font-medium text-center text-sm '>
                                    <span>({index + 1}) : </span>
                                    <span className='ml-1'>{link}</span>
                                </p>))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}