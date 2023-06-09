import { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

const PlayerWrapper = ({playback, spotifyApi, spotifyToken, updatePlayback}) => {

    const [loaded, setLoaded] = useState(false);
    const [currentDevice, setCurrentDevice] = useState("");

    useEffect(() => {
        console.log("playerwrapper useEffect");
        setupPlayer();
    }, [loaded])

    const setupPlayer = () => {
        console.log("setupPlayer method");
        spotifyApi.getMyDevices().then((result) => {
            console.log("avaialbledevices in player", result);
        });
    }

    const getWebPlayer = (state) => {
        const devices = state.devices;
        console.log("devices", devices);
        const device = devices.filter(item => item.name === 'MajorityRocks')[0];
        return device;
    }

    const handlePlayerChange = (state) => {
        console.log("player changed", state);
        console.log("playback", playback);

        if (playback.text === '') {
            spotifyApi.getMyCurrentPlayingTrack().then((result) => {
                updatePlayback(result.item);                           
            });
        }

        if (state.type === 'track_update') {
            console.log("Player track change");
            setTimeout(() => {
                console.log("within timeout");
                spotifyApi.getMyCurrentPlayingTrack().then((result) => {
                    updatePlayback(result.item);                           
                });
            }, 500);
        }

        if (currentDevice !== "MajorityRocks" && state.status !== 'INITIALIZING') {
            console.log("webPlayer state", state);
            const webPlayer = getWebPlayer(state);
            console.log("webPlayer.id", [webPlayer.id]);
            spotifyApi.transferMyPlayback([webPlayer.id]).then((result) => {
                console.log("transferring the playback")
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