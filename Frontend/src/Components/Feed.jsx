import React from 'react'
import Posts from './Posts'
import Suggested_Users from './Suggested_Users'

function Feed() {
  return (
    <>

<div className='flex justify-center items-start w-full my-8 '>
  
    <div className='flex flex-col items-start md:items-center pl-[18%] md:pl-[2%]'>
      <Posts/>
    </div>
    
    <div className='hidden lg:block end-52 translate-x-40'>
      <Suggested_Users/>
    </div>
</div>
    </>
  )
}

export default Feed
