import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route ,Routes } from "react-router";
// import HomePage from "./routes/homePage/HomePage.jsx";
// import CreatePage from './routes/createPage/CreatePage.jsx';
// import PostPage from './routes/postPage/PostPage.jsx';
// import AuthPage from './routes/authPage/AuthPage.jsx';
// import SearchPage from './routes/searchPage/SearchPage.jsx';
// import ProfilePage from './routes/profilePage/ProfilePage.jsx';

import MainLayout from './routes/layouts/mainLayout.jsx';


import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const HomePage = React.lazy(()=>import("./routes/homePage/HomePage.jsx"))
const CreatePage = React.lazy(()=>import("./routes/createPage/CreatePage.jsx"))
const PostPage = React.lazy(()=>import("./routes/postPage/PostPage.jsx"))
const AuthPage = React.lazy(()=>import("./routes/authPage/AuthPage.jsx"))
const SearchPage = React.lazy(()=>import("./routes/searchPage/SearchPage.jsx"))
const ProfilePage = React.lazy(()=>import("./routes/profilePage/ProfilePage.jsx"))




const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
  


  <StrictMode>
    <QueryClientProvider client={queryClient}>
   <BrowserRouter>
   <Routes>
    <Route element={<MainLayout/>}>
    <Route path="/" element={<HomePage />} />
     <Route path="/create" element={<CreatePage />} />
      <Route path="/pins/:id" element={<PostPage />} />
      
        <Route path="/:userName" element={<ProfilePage />} />
         <Route path="/search" element={<SearchPage />} />
         </Route>
          <Route path="/auth" element={<AuthPage type="login" />} />
          <Route path="/register" element={<AuthPage tupe ="register" />} />

   </Routes>
  </BrowserRouter>
  </QueryClientProvider>
  </StrictMode>,
)
