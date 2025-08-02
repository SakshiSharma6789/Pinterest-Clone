import React from 'react'
import './galleryItem.css'
import { Link } from 'react-router'

import Image from '../Image/Image';


function GalleryItem({item}) {
  const optimizedHeight =(372 * item.height)/item.width
  return (
    <div className='galleryItem' style={{gridRowEnd:`span ${Math.ceil(item.height/100)}`}}>
      {/* <Image path={item.media} alt=''/> */}
      <Image path={item.media} w={372} h={optimizedHeight} alt="" />
    

      <Link to={`/pins/${item._id}`} className='overlay'/>
      <button className='saveButton'> Save </button>
      <div className="overlayIcons">
        <button>
          <Image path='/general/share.svg' alt='share'/>
        </button>
        <button>
          <Image path='/general/more.svg' alt='edit'/>
        </button>
      </div>
    </div>
  )
}

export default GalleryItem
