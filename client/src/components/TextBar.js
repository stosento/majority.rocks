const TextBar = ({ id, label, placeholder, value, cb }) => {

    return (
        <div className="pt-4 pb-4">
            <label className="w-full block pb-1" for={id}> 
                {label}
            </label>
            <input 
                className="w-full p-2 uppercase bg-gray-900 border border-gray-400 rounded-md transition duration-300 ease-in-out hover:border-blue-700 focus:outline-none focus:border-blue-700"
                type="text"
                placeholder={placeholder}
                id={id}
                value={value}
                onChange={(e) => cb(e.target.value.toUpperCase())}
            ></input>
        </div>
    );
}

export default TextBar;