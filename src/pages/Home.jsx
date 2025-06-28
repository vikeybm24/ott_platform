import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieSlider from '../components/MovieSlider';
import { movieApi } from '../services/movieApi';

const Home = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching movies...');
        
        // Fetch trending and popular movies
        const [trendingResponse, popularResponse] = await Promise.all([
          movieApi.getTrending(),
          movieApi.getPopular()
        ]);

        console.log('Trending movies:', trendingResponse.results.length);
        console.log('Popular movies:', popularResponse.results.length);

        const trending = trendingResponse.results;
        const popular = popularResponse.results;

        setTrendingMovies(trending);
        setPopularMovies(popular);
        
        // Set hero movie to the first trending or popular movie
        const heroMovieCandidate = trending[0] || popular[0];
        if (heroMovieCandidate) {
          setHeroMovie(heroMovieCandidate);
        }
        
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading amazing content...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {heroMovie && <Hero movie={heroMovie} />}
      
      <div className="relative z-10 -mt-32 bg-gradient-to-t from-black to-transparent pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {trendingMovies.length > 0 && (
            <MovieSlider title="Trending Now" movies={trendingMovies} size="large" />
          )}
          {popularMovies.length > 0 && (
            <MovieSlider title="Popular Movies" movies={popularMovies} size="medium" />
          )}
          
          {trendingMovies.length === 0 && popularMovies.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-xl">No movies available at the moment</div>
              <p className="text-gray-500 mt-2">Please check back later</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;