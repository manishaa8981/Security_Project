import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { MovieDetailsSkeleton } from "@/components/skeletons/movie";
import { useFetchMovieBySlug } from "@/api/movieApi";
import { useParams } from "react-router-dom";
import { decodeHTMLEntities } from "@/utils/htmlDecoder";
import { useFetchScreeningsByMovie } from "@/api/screeningApi";
import SeatBooking from "@/components/pageComponents/booking/SeatBooking";

export default function MovieDetails() {
  const { slug } = useParams();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const playerRef = useRef<YT.Player | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [showSeats, setShowSeats] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTheatreId, setSelectedTheatreId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedHallId, setSelectedHallId] = useState<string | null>(null);
  const [selectedScreeningId, setSelectedScreeningId] = useState<string | null>(null);
  const [showTheatreDropdown, setShowTheatreDropdown] = useState<boolean>(false);
  const [showHallDropdown, setShowHallDropdown] = useState<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const hasInteracted = useRef<boolean>(false);

  const { data: movie, isLoading: isMovieLoading } = useFetchMovieBySlug(slug || "");
  const { data: screenings, isLoading: isScreeningsLoading } = useFetchScreeningsByMovie(movie?._id || "");

  useEffect(() => {
    if (screenings && screenings.length > 0) {
      const firstDate = new Date(screenings[0].startTime).toDateString();
      setSelectedDate(firstDate);
      setSelectedTheatreId(null);
      setSelectedTime(null);
      setSelectedHallId(null);
      setSelectedScreeningId(null);
    }
  }, [screenings]);

  useEffect(() => {
    if (selectedDate) {
      setSelectedTheatreId(null);
      setSelectedTime(null);
      setSelectedHallId(null);
      setSelectedScreeningId(null);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTheatreId) {
      setSelectedTime(null);
      setSelectedHallId(null);
      setSelectedScreeningId(null);
    }
  }, [selectedTheatreId]);

  useEffect(() => {
    if (selectedTime) {
      setSelectedHallId(null);
      setSelectedScreeningId(null);
    }
  }, [selectedTime]);

  useEffect(() => {
    if (selectedDate && selectedTheatreId && selectedTime && selectedHallId && screenings) {
      const screening = screenings.find(
        (s) =>
          new Date(s.startTime).toDateString() === selectedDate &&
          s.theatreId._id === selectedTheatreId &&
          formatTime(s.startTime) === selectedTime &&
          s.hallId._id === selectedHallId
      );

      if (screening) {
        setSelectedScreeningId(screening._id);
      }
    }
  }, [selectedDate, selectedTheatreId, selectedTime, selectedHallId, screenings]);

  useEffect(() => {
    if (!movie?.trailerURL) return;

    let isApiLoaded = false;

    const initializePlayer = () => {
      const videoId = getYouTubeVideoId(movie.trailerURL!);
      if (!videoId || !playerContainerRef.current) return;

      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 0,
          rel: 0,
          showinfo: 0,
          mute: 1,
          enablejsapi: 1,
          loop: 1,
        },
        events: {
          onReady: (event) => {
            setIsPlayerReady(true);
            event.target.playVideo();
            setIsPlaying(true);
            if (hasInteracted.current) {
              event.target.unMute();
              setIsMuted(false);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      if (!isApiLoaded) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          isApiLoaded = true;
          initializePlayer();
        };
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        setIsPlayerReady(false);
      }
    };
  }, [movie?.trailerURL]);

  useEffect(() => {
    const handleInteraction = () => {
      hasInteracted.current = true;
      if (playerRef.current && isPlayerReady && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [isPlayerReady, isMuted]);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShowVideo = window.scrollY === 0;
      setShowVideo(shouldShowVideo);

      if (playerRef.current && isPlayerReady) {
        if (shouldShowVideo) {
          playerRef.current.playVideo();
          setIsPlaying(true);
        } else {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPlayerReady]);

  const toggleMute = () => {
    if (playerRef.current && isPlayerReady) {
      if (isMuted) {
        playerRef.current.unMute();
        hasInteracted.current = true;
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current && isPlayerReady) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const decodedUrl = decodeHTMLEntities(url);
    const urlParams = new URLSearchParams(new URL(decodedUrl).search);
    return urlParams.get("v");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatScreeningDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const day = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];

    return {
      dayOfWeek: day,
      date: `${dayOfMonth} ${month}`,
      dateString: date.toDateString(),
    };
  };

  const getUniqueDates = () => {
    if (!screenings || screenings.length === 0) return [];

    const uniqueDates = new Map();

    screenings.forEach((screening) => {
      const date = new Date(screening.startTime);
      const dateKey = date.toDateString();

      if (!uniqueDates.has(dateKey)) {
        const formatted = formatScreeningDate(screening.startTime);
        uniqueDates.set(dateKey, {
          dayOfWeek: formatted.dayOfWeek,
          date: formatted.date,
          dateString: formatted.dateString,
        });
      }
    });

    return Array.from(uniqueDates.values());
  };

  const getTheatresForSelectedDate = () => {
    if (!selectedDate || !screenings) return [];

    const theatres = new Map();

    screenings.forEach((screening) => {
      if (new Date(screening.startTime).toDateString() === selectedDate) {
        theatres.set(screening.theatreId._id, screening.theatreId);
      }
    });

    return Array.from(theatres.values());
  };

  const getTimesForSelectedTheatre = () => {
    if (!selectedDate || !selectedTheatreId || !screenings) return [];

    const times = new Set<string>();

    screenings.forEach((screening) => {
      if (
        new Date(screening.startTime).toDateString() === selectedDate &&
        screening.theatreId._id === selectedTheatreId
      ) {
        times.add(formatTime(screening.startTime));
      }
    });

    return Array.from(times).sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a}`);
      const timeB = new Date(`1970/01/01 ${b}`);
      return timeA.getTime() - timeB.getTime();
    });
  };

  const getHallsForSelectedTime = () => {
    if (!selectedDate || !selectedTheatreId || !selectedTime || !screenings) return [];

    const halls = new Map();

    screenings.forEach((screening) => {
      if (
        new Date(screening.startTime).toDateString() === selectedDate &&
        screening.theatreId._id === selectedTheatreId &&
        formatTime(screening.startTime) === selectedTime
      ) {
        halls.set(screening.hallId._id, screening.hallId);
      }
    });

    return Array.from(halls.values());
  };

  const getSelectedScreeningDetails = () => {
    if (!selectedScreeningId || !screenings) return null;

    return screenings.find((screening) => screening._id === selectedScreeningId);
  };

  const isLoading = isMovieLoading || isScreeningsLoading;

  if (isLoading) {
    return <MovieDetailsSkeleton />;
  }

  if (!movie) {
    return <div className="text-center text-white">Movie not found</div>;
  }

  const uniqueDates = getUniqueDates();
  const availableTheatres = getTheatresForSelectedDate();
  const availableTimes = getTimesForSelectedTheatre();
  const availableHalls = getHallsForSelectedTime();
  const selectedScreening = getSelectedScreeningDetails();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className="relative h-[87vh] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {showVideo && movie.trailerURL ? (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background w-full h-full"
            >
              <div ref={playerContainerRef} className="w-full h-full" />
            </motion.div>
          ) : (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={movie.posterURL?.lg || "/kanathara.png"}
              alt={movie.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent">
          <div className="absolute bottom-8 left-24 px-8">
            <motion.h1
              className="text-6xl font-bold mb-4"
              animate={{ scale: isHovered ? 1.12 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {movie.name || "Unknown Movie"}
            </motion.h1>
            <div className="flex gap-4 mt-8">
              <Button variant="default" size="lg">
                Take a seat
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-secondary-foreground"
                onClick={togglePlayPause}
              >
                <Play className="w-4 h-4 mr-2" />
                {isPlaying ? "Pause trailer" : "Play trailer"}
              </Button>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-10 bg-background/50 hover:bg-background/70"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 pt-4 pb-12">
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <div>
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground">
              {movie.description || "No description available."}
            </p>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Select Date</h2>
              {uniqueDates.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-4">
                  {uniqueDates.map((dateInfo) => (
                    <Button
                      key={dateInfo.dateString}
                      variant={
                        selectedDate === dateInfo.dateString
                          ? "default"
                          : "outline"
                      }
                      className="flex-col py-8"
                      onClick={() => setSelectedDate(dateInfo.dateString)}
                    >
                      <span className="text-sm">{dateInfo.dayOfWeek}</span>
                      <span className="text-lg font-semibold">
                        {dateInfo.date.split(" ")[0]}
                      </span>
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No screenings available for this movie.
                </p>
              )}
            </div>

            {selectedDate && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Select Cinema</h2>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setShowTheatreDropdown(!showTheatreDropdown)}
                  >
                    {selectedTheatreId
                      ? availableTheatres.find(
                          (t) => t._id === selectedTheatreId
                        )?.name
                      : "Select a cinema"}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>

                  {showTheatreDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-background border border-border rounded-md shadow-lg">
                      {availableTheatres.map((theatre) => (
                        <Button
                          key={theatre._id}
                          variant="ghost"
                          className="w-full justify-start rounded-none hover:bg-accent"
                          onClick={() => {
                            setSelectedTheatreId(theatre._id);
                            setShowTheatreDropdown(false);
                          }}
                        >
                          {theatre.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTheatreId && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Select Time</h2>
                {availableTimes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No times available for the selected cinema.
                  </p>
                )}
              </div>
            )}

            {selectedTime && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Select Hall</h2>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setShowHallDropdown(!showHallDropdown)}
                  >
                    {selectedHallId
                      ? availableHalls.find((h) => h._id === selectedHallId)
                          ?.name
                      : "Select a hall"}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>

                  {showHallDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-background border border-border rounded-md shadow-lg">
                      {availableHalls.map((hall) => (
                        <Button
                          key={hall._id}
                          variant="ghost"
                          className="w-full justify-start rounded-none hover:bg-accent"
                          onClick={() => {
                            setSelectedHallId(hall._id);
                            setShowHallDropdown(false);
                          }}
                        >
                          {hall.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedScreeningId && (
              <div className="mt-8 p-4 border border-border rounded-md bg-background">
                <h2 className="font-semibold mb-2">Booking Summary</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Date:</div>
                  <div>
                    {new Date(
                      selectedScreening!.startTime
                    ).toLocaleDateString()}
                  </div>
                  <div className="text-muted-foreground">Time:</div>
                  <div>{formatTime(selectedScreening!.startTime)}</div>
                  <div className="text-muted-foreground">Cinema:</div>
                  <div>{selectedScreening!.theatreId.name}</div>
                  <div className="text-muted-foreground">Hall:</div>
                  <div>{selectedScreening!.hallId.name}</div>
                  <div className="text-muted-foreground">Price:</div>
                  <div>₹{selectedScreening!.finalPrice.toFixed(2)}</div>
                </div>
                <Button
                  variant="default"
                  className="w-full mt-4"
                  onClick={() => {
                    setShowSeats(true);
                  }}
                >
                  Proceed to Booking
                </Button>

                {showSeats && <SeatBooking screeningId={selectedScreeningId} />}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">Released Year</h3>
              <p>{new Date(movie.releaseDate).getFullYear() || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">
                Available Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {[movie.language || "English"].map((lang: string) => (
                  <span key={lang} className="text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">Ratings</h3>
              <div className="flex gap-8">
                <div>
                  <div className="font-semibold">IMDb</div>
                  <div className="flex items-center gap-1">
                    {"★★★★☆".split("").map((star, i) => (
                      <span key={i} className="text-yellow-500">
                        {star}
                      </span>
                    ))}
                    <span className="ml-1">4.5</span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Streamvibe</div>
                  <div className="flex items-center gap-1">
                    {"★★★★☆".split("").map((star, i) => (
                      <span key={i} className="text-yellow-500">
                        {star}
                      </span>
                    ))}
                    <span className="ml-1">4</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">Genres</h3>
              <div className="flex gap-2">
                <span className="text-sm">Action</span>
                <span className="text-sm">Adventure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}