const WideButton = ({ text, onClick }) => {

    return (
        <div className="grid grid-cols-1 mt-8">
            <button 
                className="h-24 m-4 px-4 py-8 font-bold rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xl"
                onClick={onClick}
            >
                {text}
            </button>
        </div>
    );

}

export default WideButton;