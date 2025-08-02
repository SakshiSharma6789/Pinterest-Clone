import React from 'react'
import "./editor.css";
import Layers from './layer';
import Options from './Options';
import Workspace from './Workspace';


function Editor({previewImg}) {
  return (
    <div className='editor'>
      <Layers previewImg={previewImg}/>
      <Workspace previewImg={previewImg}/>
      <Options previewImg={previewImg}/>

    </div>
  )
}

export default Editor
