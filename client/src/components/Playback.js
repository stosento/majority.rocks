const Playback = ({ playback }) => {

    return (
        <>
        {playback != null && playback.text != null ? 
            <div className="flex flex-col justify-center items-center">
                <img className="h-52" src={playback.img}/>
                <p>{playback.text}</p>
            </div>
        : <></>}
        </>
    );
}

export default Playback;