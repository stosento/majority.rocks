const TextInput = ({ id, label, placeholder, value, length, onValueChange, error }) => {

    return (
        <div className="pt-4 pb-4">
            <label className="w-full block pb-1" htmlFor={id}> 
                {label}
            </label>
            <input 
                className={`w-full p-2 uppercase bg-gray-900 border ${error ? 'border-red-400' : 'border-gray-400'} rounded-md transition duration-300 ease-in-out hover:border-blue-700 focus:outline-none focus:border-blue-700`}
                type="text"
                maxLength={length ? length : null}
                placeholder={placeholder}
                id={id}
                value={value}
                onChange={onValueChange}
            ></input>
            {error && <p className="text-red-500">Please enter a valid value.</p>}
        </div>
    );
}

export default TextInput;