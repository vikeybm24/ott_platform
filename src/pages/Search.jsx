import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { movieApi } from '../services/movieApi';
import MovieCard from '../components/MovieCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) return;

      setLoading(true);
      try {
        const response = await movieApi.searchMovies(query);
        setMovies(response.results);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  return (
    <div className="bg-black min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <SearchIcon className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold text-white">
            {query ? `Search results for "${query}"` : 'Search Movies'}
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-white text-xl">Searching...</div>
          </div>
        ) : movies.length > 0 ? (
          <>
            <p className="text-gray-400 mb-8">{movies.length} results found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="medium" />
              ))}
            </div>
          </>
        ) : query ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No movies found for "{query}"</p>
            <p className="text-gray-500 mt-2">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">Start typing to search for movies</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;