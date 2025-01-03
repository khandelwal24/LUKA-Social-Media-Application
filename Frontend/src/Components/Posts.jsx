import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'
import store from '../Redux/Store'

function Posts() {
  const {posts} = useSelector(store=>store.post)
  

  return (
    <div className='max-w-[400px] px-3'>
      {
        posts?.map((post)=><Post key={post._id} post={post}/>)
      }
    </div>
  )
}

export default Posts
