import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./theme/component/home"
import MatchDetails from "./theme/component/MatchDetails"
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/MatchDetails" element={<MatchDetails/>} />

    </Routes>
  </BrowserRouter>
  );
}

export default App;
