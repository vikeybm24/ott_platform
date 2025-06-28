import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { movieApi } from '../services/movieApi';

const Hero = ({ movie }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.getFullYear();
    } catch {
      return dateString;
    }
  };

  // Create URL-friendly title
  const urlTitle = movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div className="relative h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop_path ? movieApi.getBackdropUrl(movie.backdrop_path) : '/placeholder-backdrop.jpg'}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {movie.title}
          </h1>
          
          <div className="flex items-center space-x-4 mb-6">
            {movie.vote_average > 0 && (
              <div className="flex items-center space-x-1 text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
            <span className="text-gray-300">
              {formatDate(movie.release_date)}
            </span>
            {movie.runtime && (
              <span className="text-gray-300">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            )}
          </div>

          <p className="text-gray-200 text-lg mb-8 leading-relaxed line-clamp-3">
            {movie.overview}
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to={`/watch/${movie.id}/${urlTitle}`}
              className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>Watch Movie</span>
            </Link>
            
            <Link
              to={`/movie/${movie.id}/${urlTitle}`}
              className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <Info className="h-5 w-5" />
              <span>More Info</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;