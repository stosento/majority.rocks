import { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

const PlayerWrapper = ({spotifyApi, spotifyToken}) => {

    const [loaded, setLoaded] = useState(false);
    const [currentDevice, setCurrentDevice] = useState("");

    useEffect(() => {
        console.log("useEffect");
        spotifyApi.getMyCurrentPlaybackState().then((result) => {
            console.log("currentplayback in player", result);
        });
        spotifyApi.getMyDevices().then((result) => {
            console.log("avaialbledevices in player", result);
        });
    }, [loaded])

    const getWebPlayer = (state) => {
        const devices = state.devices;
        console.log("devices", devices);
        const device = devices.filter(item => item.name === 'MajorityRocks')[0];
        return device;
    }

    const handlePlayerChange = (state) => {
        console.log("wtf is state", state);
        if (currentDevice !== "MajorityRocks") {
            const webPlayer = getWebPlayer(state);
            console.log("webPlayer", webPlayer);
            spotifyApi.transferMyPlayback([webPlayer.id]).then((result) => {
                setCurrentDevice(webPlayer.name);
                setLoaded(true);     
            })
        }
    } 

    return (
        <SpotifyPlayer
        token={spotifyToken}
        name="MajorityRocks"
        callback={state => handlePlayerChange(state)}
        magnifySliderOnHover
        syncExternalDevice={loaded ? true : false}
        layout='responsive'
        styles={{
            bgColor: 'white'
        }}
    />
    );
}

export default PlayerWrapper;