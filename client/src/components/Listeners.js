const Listeners = ({ users }) => {

    return (
        <div className="flex">
            <h2 className="font-teko text-3xl mr-4">Listeners:</h2>
            {users.map((user) => (
                <div className="rounded-lg p-1 mr-2" style={{backgroundColor: user.color}}>
                    {user.userName}
                </div>
            ))}
    </div>
    );
}

export default Listeners;