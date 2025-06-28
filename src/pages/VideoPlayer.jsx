import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { movieApi } from '../services/movieApi';
import VideoPlayerComponent from '../components/VideoPlayer';

const VideoPlayer = () => {
  const { id, title } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample video URL - in a real app, this would come from your video streaming service
  const sampleVideoUrl = 'https://video.twimg.com/amplify_video/1938995906399137792/vid/avc1/1280x720/Jey86O-1zydAgl2z.mp4?tag=14';

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const movieResponse = await movieApi.getMovieDetails(id);
        setMovie(movieResponse);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Update document title to show movie name
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} - CineStream`;
    }
    return () => {
      document.title = 'CineStream';
    };
  }, [movie]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading player...</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Movie not found</div>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen fixed inset-0 z-[9999]">
      {/* Video Player - Full screen without navbar */}
      <VideoPlayerComponent src={sampleVideoUrl} title={movie.title} movieId={movie.id} />
    </div>
  );
};

export default VideoPlayer;