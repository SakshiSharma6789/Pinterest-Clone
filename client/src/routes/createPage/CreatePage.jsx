import  { useEffect, useState, useRef } from 'react';
import './CreatePage.css';
import IKImage from '../../components/Image/Image';
import UseAuthStore from '../../utils/authStore';
import { useNavigate } from "react-router";
import Editor from '../../components/editor/editor';
import UseEditStore from '../../utils/editorStore';
import apiRequest from "../../utils/apiRequest";

import {useMutation , useQuery} from "@tanstack/react-query"



function CreatePage() {
  const { currentUser } = UseAuthStore();
  const navigate = useNavigate();
  const formRef = useRef();
  const { textOptions, canvasOptions } = UseEditStore();

  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImg, setPreviewImg] = useState({
    url: "",
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setPreviewImg({
          url: URL.createObjectURL(file),
          width: img.width,
          height: img.height
        });
      };
    }
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [navigate, currentUser]);

 // In your handleSubmit function:
const handleSubmit = async () => {
  if (isEditing) {
    setIsEditing(false);
    return;
  }
  else{
    const formData = new FormData(formRef.current);
    formData.append("media" , file);
    formData.append("textOptions" , JSON.stringify(textOptions));
    formData.append("canvasOptions" , JSON.stringify(canvasOptions));
     try{
      const res = await apiRequest.post("/pins" , formData , {
        headers:{
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/pins/${res.data._id}`);


     }catch(err){
      console.log(err)
     }

  }

  
};

  return (
    <div className='createpage'>
      <div className="createTop">
        <h1>{isEditing ? "Design your pin" : "Create Pin"}</h1>
        {file && (
          <button className='topBtn' onClick={handleSubmit}>
            {isEditing ? "Done" : "Publish"}
          </button>
        )}
      </div>

      {isEditing ? (
        <Editor previewImg={previewImg} />
      ) : (
        <div className="createBottom">
          {previewImg.url ? (
            <div className='preview'>
              <img src={previewImg.url} alt='Preview' />
              <div className='editIcon' onClick={() => setIsEditing(true)}>
                <IKImage path="/general/edit.svg" alt="Edit" />
              </div>
            </div>
          ) : (
            <div className="upload">
              <label htmlFor="file" className="uploadTitle">
                <IKImage path="/general/upload.svg" alt="Upload" />
                <span>Choose a file or drag and drop it here</span>
                <input
                  className='uploading'
                  id='file'
                  onChange={handleFileChange}
                  type='file'
                  accept='image/*'
                  required
                />
              </label>
            </div>
          )}

          <form className='createForm' ref={formRef}>
            <div className="createFormItem formTitle">
              <label htmlFor='title'>Title*</label>
              <input
                className='inputTitle'
                type='text'
                placeholder='Add a title'
                name='title'
                id='title'
                required
              />
            </div>
            
            <div className="createFormItem">
              <label htmlFor='description'>Description*</label>
              <textarea
                placeholder='Add a detailed description'
                name='description'
                id='description'
                rows="4"
                required
              ></textarea>
            </div>
            
            <div className="createFormItem">
              <label htmlFor='link'>Link</label>
              <input
                type='text'
                placeholder='Add link'
                name='link'
                id='link'
              />
            </div>
            
            <div className="createFormItem">
              <label htmlFor='board'>Board*</label>
              <select name='board' id='board' required>
                <option value="">Select a board</option>
                <option value="1">Board 1</option>
                <option value="2">Board 2</option>
                <option value="3">Board 3</option>
              </select>
            </div>
            
            <div className="createFormItem">
              <label htmlFor='tags'>Tagged topics</label>
              <input
                type='text'
                placeholder='Search for a tag'
                name='tags'
                id='tags'
              />
              <small>Don't worry, people won't see your tags</small>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreatePage;