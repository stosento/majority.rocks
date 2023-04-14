const Playback = ({ playback }) => {

    return (
        <>
        {playback != null && playback.song != null ? 
            <div className="flex flex-col justify-center items-center">
                <img className="h-52" src={playback.image}/>
                <p>{playback.artist} - {playback.song}</p>
            </div>
        : <></>}
        </>
    );
}

export default Playback;