const SkipText = ({ count }) => {

    const roomText = count > 1 ? 'votes' : 'vote';

    return (
        <div className="w-1/2 text-center">
            <p className="font-teko text-3xl">SKIP RULE: <span className="text-blue-600">&#123;</span> {count} <span className="text-blue-600">&#125;</span> {roomText} will skip the song</p>
        </div>
    );
}

export default SkipText;