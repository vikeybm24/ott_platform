import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';
import { movieApi } from '../services/movieApi';

const MovieCard = ({ movie, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-32 sm:w-40',
    medium: 'w-40 sm:w-48',
    large: 'w-48 sm:w-56'
  };

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
    <Link 
      to={`/movie/${movie.id}/${urlTitle}`}
      className={`${sizeClasses[size]} flex-shrink-0 group cursor-pointer transition-transform duration-300 hover:scale-105`}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-900">
        {/* Movie Poster */}
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster_path ? movieApi.getImageUrl(movie.poster_path) : '/placeholder-movie.jpg'}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              {movie.vote_average > 0 && (
                <div className="flex items-center space-x-2 text-xs text-yellow-400 mb-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(movie.release_date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
            {movie.overview || 'No description available.'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;