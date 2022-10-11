
import React from 'react';
import './styles/App.scss';

import { Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import Recommend from './pages/Recommend';
import Bookmark from './pages/Bookmark';
import NavBar from './components/Header/NavBar'
import Store from './pages/Store';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Mapdefault from './pages/Mapdefault';
import BmarkListDetail from './pages/BmarkListDetail';
import SearchResult from './pages/SearchResult';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route element={<NavBar />}>
        <Route path='/main' element={<Main />} />
        <Route path='/recommend' element={<Recommend />} />
        <Route path='/map' element={<Mapdefault/>} />
        <Route path='/bookmark' element={<Bookmark />} />
        <Route path='/bookmark/:bookListId' element={<BmarkListDetail />} />
        <Route path='/searchresult' element={<SearchResult />} />
      </Route>
      <Route path='/store/:storeId' element={<Store />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
