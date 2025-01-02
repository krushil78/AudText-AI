import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AiLesioner from './AiLesioner.jsx'
import AiUploader from './AiUploader.jsx'
import Chatbot  from './Chatbot.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
  <Routes>
    <Route path="/" element={<App />} >
    <Route path="ailesioner" element={<AiLesioner />}/>
    <Route path="aiuploader" element={<AiUploader />}/>
    <Route path="chatbot" element={<Chatbot/>}/>
    </Route>
   </Routes>
  </StrictMode>,
  </BrowserRouter>
)
