const VoteText = ({ count }) => {

    const roomText = count > 1 ? 'votes' : 'vote';

    return (
        <div className="w-5/6 md:w-1/2 text-center">
            <p className="font-teko text-3xl">VOTE RULE: <span className="text-blue-600">&#123;</span> {count} <span className="text-blue-600">&#125;</span> {roomText} will trigger the notification</p>
        </div>
    );
}

export default VoteText;