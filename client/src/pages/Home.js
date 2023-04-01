const Home = () => {


    return (
        <div className="w-full grid grid-cols-1 justify-items-center">
            <h1 className="text-center text-4xl">MAJORITY.ROCKS</h1>
            <div className="w-1/2 pt-8 pb-4">
                <label className="w-full" for="name"> 
                    Enter your name: 
                </label>
                <input 
                    className="w-full px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring"
                    type="text"
                    placeholder="Name..."
                    id="name"
                ></input>
            </div>

            <div className="w-3/4 grid grid-cols-2">
                <div className="grid grid-cols-1">
                    <button className="h-24 m-4 px-4 py-8 font-bold text-white rounded bg-blue-500">
                        Create Room
                    </button>
                </div>
                <div className="grid grid-cols-1">
                    <button className="h-24 m-4 px-4 py-8 font-bold text-white rounded bg-blue-500">
                        Join Room
                    </button>
                    <input 
                        className="w-full px-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring"
                        type="text"
                        placeholder="Name..."
                        id="name"
                ></input>
                </div>
            </div>
        </div>
    );
  };
  
  export default Home;