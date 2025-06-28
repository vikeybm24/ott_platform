import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Calendar, Clock, ArrowLeft, User, Award } from 'lucide-react';
import { movieApi } from '../services/movieApi';
import MovieSlider from '../components/MovieSlider';

const MovieDetails = () => {
  const { id, title } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        const [movieResponse, recommendationsResponse] = await Promise.all([
          movieApi.getMovieDetails(id),
          movieApi.getRecommendations(id)
        ]);

        setMovie(movieResponse);
        setRecommendations(recommendationsResponse.results);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.getFullYear();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Movie not found</div>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // Create URL-friendly title for watch link
  const urlTitle = movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen pt-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={movie.backdrop_path ? movieApi.getBackdropUrl(movie.backdrop_path) : '/placeholder-backdrop.jpg'}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Movie Content */}
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            {/* Movie Poster */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative group">
                <img
                  src={movie.poster_path ? movieApi.getImageUrl(movie.poster_path) : '/placeholder-movie.jpg'}
                  alt={movie.title}
                  className="w-64 md:w-80 rounded-lg shadow-2xl transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 max-w-4xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {movie.title}
              </h1>

              {/* Movie Stats */}
              <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-6">
                {movie.vote_average > 0 && (
                  <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold text-white">{movie.vote_average.toFixed(1)}</span>
                    {movie.vote_count > 0 && (
                      <span className="text-gray-300 text-sm">({movie.vote_count.toLocaleString()})</span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                  <Calendar className="h-4 w-4 text-gray-300" />
                  <span className="text-gray-300">{formatDate(movie.release_date)}</span>
                </div>

                {movie.runtime && (
                  <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                    <Clock className="h-4 w-4 text-gray-300" />
                    <span className="text-gray-300">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm text-gray-200 rounded-full text-sm font-medium border border-gray-700 hover:bg-gray-700/80 transition-colors"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
                <p className="text-gray-200 text-lg leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {movie.director && (
                  <div className="flex items-start space-x-3 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800">
                    <User className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-sm block">Director</span>
                      <span className="text-white font-medium">{movie.director}</span>
                    </div>
                  </div>
                )}
                
                {movie.actors && (
                  <div className="flex items-start space-x-3 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800">
                    <User className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-sm block">Cast</span>
                      <span className="text-white font-medium">{movie.actors}</span>
                    </div>
                  </div>
                )}
                
                {movie.country && (
                  <div className="flex items-start space-x-3 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800">
                    <Calendar className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-sm block">Country</span>
                      <span className="text-white font-medium">{movie.country}</span>
                    </div>
                  </div>
                )}
                
                {movie.language && (
                  <div className="flex items-start space-x-3 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800">
                    <User className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-sm block">Language</span>
                      <span className="text-white font-medium">{movie.language}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Awards */}
              {movie.awards && movie.awards !== 'N/A' && (
                <div className="mb-8 p-4 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 backdrop-blur-sm rounded-lg border border-yellow-800/30">
                  <div className="flex items-start space-x-3">
                    <Award className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-yellow-400 text-sm font-medium block">Awards & Recognition</span>
                      <span className="text-gray-200">{movie.awards}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Watch Button */}
              <Link
                to={`/watch/${movie.id}/${urlTitle}`}
                className="inline-flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
              >
                <Play className="h-6 w-6 fill-current" />
                <span>Watch Movie</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="bg-black/95 backdrop-blur-sm border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <MovieSlider title="More Like This" movies={recommendations} size="medium" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;