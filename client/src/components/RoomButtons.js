const RoomButtons = ({ disableButtons, skipCb, disableSkip }) => {

    return (
        <div className="grid-flow-col grid-cols-2 flex">
            <button
                className="w-1/4 h-24 my-4 mx-1 font-bold text-xl rounded bg-blue-500 hover:bg-blue-700 disabled:bg-blue-950"
                disabled={disableButtons}
            >
                Save
            </button>
            <button 
                className="w-3/4 h-24 my-4 mx-1 font-bold rounded bg-orange-500 text-xl hover:bg-orange-700 disabled:bg-orange-950"
                onClick={skipCb}
                disabled={disableButtons || disableSkip}
            >
                Skip
            </button>
        </div>
    );
}

export default RoomButtons;