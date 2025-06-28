const API_KEY = '1890ed6b';
const BASE_URL = 'https://www.omdbapi.com';

export const movieApi = {
  // Search for movies by title
  async searchMovies(query) {
    try {
      const response = await fetch(`${BASE_URL}/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
      const data = await response.json();
      
      if (data.Response === 'True') {
        return {
          results: data.Search.map((movie) => ({
            id: movie.imdbID,
            title: movie.Title,
            overview: '', // OMDb doesn't provide plot in search results
            poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
            backdrop_path: movie.Poster !== 'N/A' ? movie.Poster : null,
            release_date: movie.Year,
            vote_average: 0, // Will be fetched in details
            vote_count: 0
          }))
        };
      }
      return { results: [] };
    } catch (error) {
      console.error('Error searching movies:', error);
      return { results: [] };
    }
  },

  // Get popular movies (we'll use a predefined list of popular movie IDs)
  async getPopular() {
    const popularMovieIds = [
      'tt0111161', // The Shawshank Redemption
      'tt0068646', // The Godfather
      'tt0468569', // The Dark Knight
      'tt0071562', // The Godfather Part II
      'tt0050083', // 12 Angry Men
      'tt0108052', // Schindler's List
      'tt0167260', // The Lord of the Rings: The Return of the King
      'tt0110912', // Pulp Fiction
      'tt0060196', // The Good, the Bad and the Ugly
      'tt0137523'  // Fight Club
    ];

    const movies = [];
    for (const id of popularMovieIds) {
      try {
        const movie = await this.getMovieDetails(id);
        if (movie) {
          movies.push(movie);
        }
      } catch (error) {
        console.error(`Error fetching movie ${id}:`, error);
      }
    }

    return {
      results: movies
    };
  },

  // Get trending movies (we'll use another set of popular recent movies)
  async getTrending() {
    const trendingMovieIds = [
      'tt6751668', // Parasite
      'tt7286456', // Joker
      'tt4154756', // Avengers: Endgame
      'tt1825683', // Black Panther
      'tt3896198', // Guardians of the Galaxy Vol. 2
      'tt2250912', // Spider-Man: Homecoming
      'tt3501632', // Thor: Ragnarok
      'tt1211837', // Doctor Strange
      'tt3498820', // Captain America: Civil War
      'tt2395427'  // Avengers: Age of Ultron
    ];

    const movies = [];
    for (const id of trendingMovieIds) {
      try {
        const movie = await this.getMovieDetails(id);
        if (movie) {
          movies.push(movie);
        }
      } catch (error) {
        console.error(`Error fetching movie ${id}:`, error);
      }
    }

    return {
      results: movies
    };
  },

  // Get detailed movie information
  async getMovieDetails(id) {
    try {
      const response = await fetch(`${BASE_URL}/?i=${id}&apikey=${API_KEY}&plot=full`);
      const data = await response.json();
      
      if (data.Response === 'True') {
        return {
          id: data.imdbID,
          title: data.Title,
          overview: data.Plot !== 'N/A' ? data.Plot : 'No plot available.',
          poster_path: data.Poster !== 'N/A' ? data.Poster : null,
          backdrop_path: data.Poster !== 'N/A' ? data.Poster : null,
          release_date: data.Released !== 'N/A' ? data.Released : data.Year,
          vote_average: data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : 0,
          vote_count: data.imdbVotes !== 'N/A' ? parseInt(data.imdbVotes.replace(/,/g, '')) : 0,
          runtime: data.Runtime !== 'N/A' ? parseInt(data.Runtime.replace(' min', '')) : null,
          genres: data.Genre !== 'N/A' ? data.Genre.split(', ').map((name, index) => ({
            id: index,
            name: name
          })) : [],
          director: data.Director !== 'N/A' ? data.Director : null,
          actors: data.Actors !== 'N/A' ? data.Actors : null,
          country: data.Country !== 'N/A' ? data.Country : null,
          language: data.Language !== 'N/A' ? data.Language : null,
          awards: data.Awards !== 'N/A' ? data.Awards : null,
          year: data.Year !== 'N/A' ? data.Year : null
        };
      }
      throw new Error('Movie not found');
    } catch (error) {
      console.error(`Error fetching movie details for ${id}:`, error);
      throw error;
    }
  },

  // Get recommendations (we'll search for movies in the same genre)
  async getRecommendations(id) {
    try {
      const movie = await this.getMovieDetails(id);
      if (movie.genres && movie.genres.length > 0) {
        // Search for movies with similar genre
        const genre = movie.genres[0].name;
        const searchResults = await this.searchMovies(genre);
        // Filter out the current movie and return up to 10 recommendations
        const recommendations = searchResults.results
          .filter((rec) => rec.id !== id)
          .slice(0, 10);
        return { results: recommendations };
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
    return { results: [] };
  },

  // Helper functions for image URLs (OMDb provides direct URLs)
  getImageUrl: (path) => {
    return path || '/placeholder-movie.jpg';
  },

  getBackdropUrl: (path) => {
    return path || '/placeholder-backdrop.jpg';
  }
};