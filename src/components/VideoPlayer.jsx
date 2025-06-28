import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings,
  Minimize,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoPlayer = ({ src, title, movieId }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    // Handle fullscreen change
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    let timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  const handleBackClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Try to go back to previous page first
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback: go to movie details page if no history
      if (movieId && title) {
        const urlTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        navigate(`/movie/${movieId}/${urlTitle}`);
      } else {
        // Last resort: go to home
        navigate('/');
      }
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  // Handle video area click (only for the video itself, not controls)
  const handleVideoAreaClick = (e) => {
    // Only toggle play if clicking directly on the video area, not on controls
    if (e.target === e.currentTarget) {
      togglePlay();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value) / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const changePlaybackRate = (rate) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const volumePercentage = isMuted ? 0 : volume * 100;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element - Only this area toggles play/pause when clicked */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={handleVideoAreaClick}
      >
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain pointer-events-none"
          preload="metadata"
          autoPlay
        />
      </div>

      {/* Controls Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Top Header with Back Button - Always clickable */}
        <div className="absolute top-0 left-0 right-0 p-6 z-50">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-white hover:text-red-400 transition-all group bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600 hover:border-red-500 hover:bg-black/70 cursor-pointer z-50"
              style={{ pointerEvents: 'auto' }}
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="text-white text-xl font-semibold bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 pointer-events-none">
              {title}
            </div>
          </div>
        </div>

        {/* Play/Pause Button in Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={togglePlay}
            className="bg-black/50 hover:bg-black/70 rounded-full p-6 transition-all transform hover:scale-110 border border-gray-600 hover:border-red-500 pointer-events-auto cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="h-12 w-12 text-white fill-current" />
            ) : (
              <Play className="h-12 w-12 text-white fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
          <div className="pointer-events-auto">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="relative">
                {/* Background track */}
                <div className="w-full h-2 bg-gray-600 rounded-lg">
                  {/* Red progress fill */}
                  <div 
                    className="h-full bg-red-600 rounded-lg transition-all duration-150"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {/* Invisible input for interaction */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercentage}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                />
                {/* Red dot/thumb */}
                <div 
                  className="absolute top-1/2 w-4 h-4 bg-red-600 rounded-full transform -translate-y-1/2 transition-all duration-150 hover:scale-125 shadow-lg pointer-events-none"
                  style={{ left: `calc(${progressPercentage}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-300 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600">
              {/* Left Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-red-400 transition-colors p-1 rounded cursor-pointer"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>

                <button
                  onClick={() => skip(-10)}
                  className="text-white hover:text-red-400 transition-colors p-1 rounded cursor-pointer"
                >
                  <SkipBack className="h-6 w-6" />
                </button>

                <button
                  onClick={() => skip(10)}
                  className="text-white hover:text-red-400 transition-colors p-1 rounded cursor-pointer"
                >
                  <SkipForward className="h-6 w-6" />
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-red-400 transition-colors p-1 rounded cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </button>
                  <div className="relative w-20">
                    {/* Volume track */}
                    <div className="w-full h-1 bg-gray-600 rounded-lg">
                      {/* White volume fill */}
                      <div 
                        className="h-full bg-white rounded-lg transition-all duration-150"
                        style={{ width: `${volumePercentage}%` }}
                      />
                    </div>
                    {/* Invisible input for interaction */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volumePercentage}
                      onChange={handleVolumeChange}
                      className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
                    />
                    {/* White dot/thumb */}
                    <div 
                      className="absolute top-1/2 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 transition-all duration-150 hover:scale-125 shadow-lg pointer-events-none"
                      style={{ left: `calc(${volumePercentage}% - 6px)` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:text-red-400 transition-colors p-1 rounded cursor-pointer"
                  >
                    <Settings className="h-6 w-6" />
                  </button>

                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-3 min-w-32 border border-gray-700 z-50">
                      <div className="text-white text-sm font-semibold mb-2">Speed</div>
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`block w-full text-left px-2 py-1 text-sm transition-colors rounded cursor-pointer ${
                            playbackRate === rate 
                              ? 'text-red-400 bg-red-400/10' 
                              : 'text-gray-300 hover:text-white hover:bg-gray-700'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-red-400 transition-colors p-1 rounded cursor-pointer"
                >
                  {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;