const HostInfo = ({ host }) => {

    return (
        <div className="flex mb-3">
            <h2 className="font-teko text-3xl mr-4">Host:</h2>
            {host != null ? 
            <div className="rounded-lg p-1" style={{backgroundColor: host.color}}>
                <p>{host.userName}</p>
            </div>
            : <></>}
        </div>
    );
}

export default HostInfo;