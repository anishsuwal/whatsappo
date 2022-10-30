import QRcode from "qrcode.react"


export default function QrCodeScan(qrCode) {

    return (
        <>

            <div className="m-32 flex flex-row justify-between items-center  bg-white shadow-2xl border p-10 ml-80 mr-80 ">

                <div className="m-10">
                    <p>
                        1. Open WhatsApp on your computer
                    </p>

                    <p className="mt-5">
                        2. Tap <strong>Menu </strong> : or <strong> Settings </strong>and select <strong> Linked Devices</strong>
                    </p>
                    <p className="mt-5">
                        3. Point your phone to this screen to capture the code
                    </p>
                </div>

                <div className=" m-10">
                    <div> <QRcode value={qrCode.data} />
                    </div>
                </div>
            </div>
        </>
    )
}