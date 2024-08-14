import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {

    const navigate = useNavigate();

    return (
        <div className="w-full md:w-2/3 grid grid-flow-col auto-cols-max my-3 ">
            <div className="mr-3">
                <h1 onClick={() => {navigate("/");}}  className="text-left cursor-pointer font-teko text-5xl text-blue-600 hover:text-blue-700">&#8592;</h1>
            </div>
            <div className="self-center">
                <h1 className="text-center font-teko text-7xl">{title}</h1>
            </div>
        </div>
    );
}

export default Header;