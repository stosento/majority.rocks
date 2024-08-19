const VoteButton = ({ voteCb, disableVote }) => {

    return (
        <div className="grid-flow-col grid-cols-2 flex">
            <button 
                className="w-full h-24 my-4 mx-1 font-bold rounded bg-orange-500 text-xl hover:bg-orange-700 disabled:bg-orange-950"
                onClick={voteCb}
                disabled={disableVote}
            >
                Vote
            </button>
        </div>
    );
}

export default VoteButton;