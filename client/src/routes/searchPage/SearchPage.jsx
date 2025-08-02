import React from 'react'
import './SearchPage.css'
import Gallery from '../../components/gallery/gallery'
import { useSearchParams } from 'react-router'


function SearchPage() {

  let [searchParams]=useSearchParams()
  const search = searchParams.get("search")
  const boardId = searchParams.get("boardId")
  return (
    
      <Gallery search={search} boardId={boardId} />
    
  )
}

export default SearchPage
