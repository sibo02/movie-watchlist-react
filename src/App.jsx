import { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";

function App() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [watchlist, setWatchlist] = useState(() => {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  });

  const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

  async function fetchTrending() {
    const url = "https://api.themoviedb.org/3/trending/tv/day";

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    setResults(data.results);
  }

  async function handleSearch() {
    if (!search.trim()) {
      fetchTrending();
      setQuery("");
      return;
    }

    setQuery(search);

    const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
      search
    )}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    setResults(data.results);
  }

  useEffect(() => {
    async function loadTrending() {
      const url = "https://api.themoviedb.org/3/trending/tv/day";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      setResults(data.results);
    }

    loadTrending();
  }, [accessToken]);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  function addToWatchlist(show) {
    const exists = watchlist.some((item) => item.id === show.id);

    if (exists) return;

    const newItem = {
      id: show.id,
      title: show.name,
      poster: show.poster_path,
      year: show.first_air_date?.slice(0, 4) || "Unknown",
      seen: false,
      rating: null,
      status: "plan",
    };

    setWatchlist([...watchlist, newItem]);
  }

  function removeFromWatchlist(id) {
    setWatchlist(watchlist.filter((item) => item.id !== id));
  }

  function setRating(id, rating) {
    setWatchlist(
      watchlist.map((item) =>
        item.id === id ? { ...item, rating } : item
      )
    );
  }

  function updateStatus(id, status) {
    setWatchlist(
      watchlist.map((item) =>
        item.id === id
          ? { ...item, status, seen: status === "completed" }
          : item
      )
    );
  }

  return (
    <div>
      <header>
        <div className="header-top">
          <h1>Drama & Movie Watchlist</h1>

          <button onClick={() => setShowWatchlist(true)}>
            📺 My Watchlist
          </button>
        </div>

        <p>Find something to watch 🍿</p>
      </header>

      <main>
        {showWatchlist ? (
          <>
            <button onClick={() => setShowWatchlist(false)}>
              🏠 Back to Home
            </button>

            <h2>📺 My Watchlist</h2>

            {watchlist.length === 0 ? (
              <p className="empty-watchlist">
                Your watchlist is empty. Start adding some dramas! 🍿
              </p>
            ) : (
              <div className="movie-grid">
                {watchlist.map((item) => (
                  <div className="movie-card" key={item.id}>
                    <img
                      className="movie-poster"
                      src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                      alt={item.title}
                    />

                    <h3>{item.title}</h3>
                    <p>{item.year}</p>

                    <div className="status-section">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateStatus(item.id, e.target.value)
                        }
                      >
                        <option value="plan">📌 Plan to Watch</option>
                        <option value="watching">▶️ Watching</option>
                        <option value="completed">✅ Completed</option>
                      </select>
                    </div>

                    {item.status === "completed" && (
                      <>
                        <p className="rating-text">
                          ⭐ Rate:{" "}
                          {item.rating ? `${item.rating}/10` : "Not rated"}
                        </p>

                        <div className="rating-buttons">
                          {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                            <button
                              key={num}
                              className={
                                item.rating === num
                                  ? "rating active"
                                  : "rating"
                              }
                              onClick={() =>
                                setRating(item.id, num)
                              }
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeFromWatchlist(item.id)
                      }
                    >
                      🗑 Remove from Watchlist
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <SearchBar
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
            />

            <h2>
              {query
                ? `Search Results: ${query}`
                : "🔥 Trending Now"}
            </h2>

            <div className="movie-grid">
              {results.map((show) => (
                <MovieCard
                  key={show.id}
                  show={show}
                  addToWatchlist={addToWatchlist}
                  isAdded={watchlist.some(
                    (item) => item.id === show.id
                  )}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;