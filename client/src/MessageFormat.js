

export default function MessageFormat() {
    return (
        <div className=' rounded-2xl border p-5'>
            <p className='text-center font-semibold border-b-2' >Please Input the Correct Phone Number In Range</p>
            <div className='flex flex-row items-center   gap-x-10'>
                <div>
                    <p>Country Code</p>
                    <input className=" border
                        rounded-lg   py-2 px-4  text-black  text-center text-sm w-32 mt-5" placeholder="+977"
                        id="age" type="number" name="femaleAge" />
                </div>
                <div className="flex flex-col  ">
                    <input className=" border
                        rounded-lg   py-2 px-4  text-black  text-center text-sm w-72 mt-5" placeholder="Start "
                        id="age" type="number" name="femaleAge" />

                    <input className=" border
                        rounded-lg   py-2 px-4  text-black  text-center text-sm w-72 mt-5" placeholder=" End"
                        id="age" type="number" name="femaleAge" />
                </div>
            </div>
        </div>
    )
}