import React from 'react'

function Comment({comm}) {
  return (
    <div className='mb-2 p-1.5 overflow-y-auto'>
    <div className='flex items-start gap-2'>
        <img width={20} className=' inline aspect-square rounded-full h-5' src={comm?.author?.profilePic}/>
        <span>{comm?.author?.username}: <span className='text-start text-gray-700 text-sm'>{comm?.text}</span> </span>
    </div>
        
    </div>
  )
}

export default Comment
