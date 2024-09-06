import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ErrorPage from "./pages/error"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<>hello</>} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
