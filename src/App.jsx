import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import VideoPlayer from './pages/VideoPlayer';
import Search from './pages/Search';
import Movies from './pages/Movies';
import Trending from './pages/Trending';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Routes>
          {/* Routes without navbar (video player) */}
          <Route path="/watch/:id/:title" element={<VideoPlayer />} />
          
          {/* Routes with navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/movie/:id/:title" element={<MovieDetails />} />
                <Route path="/search" element={<Search />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/trending" element={<Trending />} />
                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;