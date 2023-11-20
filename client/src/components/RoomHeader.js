import { useNavigate } from "react-router-dom";
import QRButton from "./buttons/QRButton";

const RoomHeader = ({ code, leaveCb }) => {

    const codeElement = <span className="hover:text-gray-400 cursor-pointer" onClick={() =>
        navigator.clipboard.writeText(code)}>{code}</span>

    const left = <span className="text-blue-600">&#123;</span>
    const right = <span className="text-blue-600">&#125;</span>

    return (
        <div className="w-1/2 grid grid-flow-col auto-cols-max my-3 justify-center">
            <div className="mr-3">
                <h1 onClick={leaveCb}  className="text-left cursor-pointer font-teko text-5xl text-blue-600 hover:text-blue-700">&#8592;</h1>
            </div>
            <div className="self-center">
                <h1 className="text-center font-teko text-7xl">ROOM {left}{codeElement}{right} </h1>
            </div>
            <div className=" pl-3 columns-1 flex-col items-stretch">
                <button className="w-full my-1 font-bold text-m rounded bg-blue-500 hover:bg-blue-700 disabled:bg-blue-950">Copy</button>
                <QRButton roomId={code}/>
            </div>
        </div>
    );
}

export default RoomHeader;