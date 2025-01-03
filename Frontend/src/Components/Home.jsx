import React from 'react'
import LeftSidebar from './LeftSidebar'
import Feed from './Feed'
import UseGetAllPosts from '../hooks/UseGetAllPosts'
import UserGetSuggestedUser from '../hooks/UserGetSuggestedUser';

function Home() {
  UseGetAllPosts();
  UserGetSuggestedUser();
  return (
    <div>
      <LeftSidebar/>
      <Feed/>
    </div>
  )
}

export default Home
