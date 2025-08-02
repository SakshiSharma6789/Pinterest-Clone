import React from 'react'
import { IKImage } from 'imagekitio-react';
function Image({path ,src, alt, className , w, h}) {
  return (
    
      <IKImage
          urlEndpoint={import.meta.env.VITE_URL_IK_ENDPOINT}
          path={path}
          src={src} // not 'src' here!
        transformation={[{ width: w , height: h}]}
       lqip={{ active: true, quality: 20 }}
      loading="lazy"
      alt={alt}
       className={className}
    />
    
  )
}

export default Image
