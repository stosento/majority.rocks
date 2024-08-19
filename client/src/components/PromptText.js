import { PencilIcon } from '@heroicons/react/24/solid'

const PromptText = ({ text, textCb, isHost }) => {

    return (
        <div>
            <p className="pl-3 text-left font-teko text-xl">Prompt</p>
            { isHost ? <PencilIcon className='text-sky-100 h-6 w-6 inline-block float-right -mt-2 -mr-2 hover:text-blue-600 cursor-pointer' onClick={textCb}/>  
            : <></>}               
            <div className="border-dashed border-x-2 border-y-2 border-sky-100 rounded-lg"> 
                <p className="mx-4 font-teko text-3xl pt-2 pb-1">{text}</p>            
            </div>
        </div>
    );
}

export default PromptText;