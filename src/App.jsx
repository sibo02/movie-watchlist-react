import { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";

function App() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [watchlistSearch, setWatchlistSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingRating, setEditingRating] = useState({});

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

    const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(search)}`;

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

  const filteredWatchlist = watchlist.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(watchlistSearch.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalCount = watchlist.length;

  const planCount = watchlist.filter(
    (item) => item.status === "plan"
  ).length;

  const watchingCount = watchlist.filter(
    (item) => item.status === "watching"
  ).length;

  const completedCount = watchlist.filter(
    (item) => item.status === "completed"
  ).length;

  const ratedItems = watchlist.filter(
    (item) => item.rating !== null
  );

  const averageRating =
    ratedItems.length > 0
      ? (
          ratedItems.reduce((sum, item) => sum + item.rating, 0) /
          ratedItems.length
        ).toFixed(1)
      : "—";

  return (
    <div>
      <header>
        <div className="header-top">
          <h1>Drama & Movie Watchlist</h1>

          {!showWatchlist && (
            <button onClick={() => setShowWatchlist(true)}>
              📺 My Watchlist
            </button>
          )}
        </div>
      </header>

      <main>
        {showWatchlist ? (
          <>
            <div className="watchlist-header">
              <button
                className="back-btn"
                onClick={() => setShowWatchlist(false)}
              >
                ← Back
              </button>

              <h2>📺 My Watchlist</h2>
              <p>{totalCount} titles • Avg {averageRating}</p>
            </div>

            <div className="watchlist-stats">
              <div className="stat">
                <strong>{totalCount}</strong>
                <span>📚 Total</span>
              </div>

              <div className="stat">
                <strong>{averageRating}</strong>
                <span>⭐ Avg Rating</span>
              </div>

              <div className="stat">
                <strong>{planCount}</strong>
                <span>📌 Plan</span>
              </div>

              <div className="stat">
                <strong>{watchingCount}</strong>
                <span>▶️ Watching</span>
              </div>

              <div className="stat">
                <strong>{completedCount}</strong>
                <span>✅ Completed</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Search your watchlist..."
              value={watchlistSearch}
              onChange={(e) => setWatchlistSearch(e.target.value)}
              className="watchlist-search"
            />

            <div className="filter-buttons">
              <button
                className={statusFilter === "all" ? "filter active-filter" : "filter"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>

              <button
                className={statusFilter === "plan" ? "filter active-filter" : "filter"}
                onClick={() => setStatusFilter("plan")}
              >
                📌 Plan
              </button>

              <button
                className={statusFilter === "watching" ? "filter active-filter" : "filter"}
                onClick={() => setStatusFilter("watching")}
              >
                ▶️ Watching
              </button>

              <button
                className={statusFilter === "completed" ? "filter active-filter" : "filter"}
                onClick={() => setStatusFilter("completed")}
              >
                ✅ Completed
              </button>
            </div>

            {watchlist.length === 0 ? (
              <p className="empty-watchlist">
                Your watchlist is empty. Start adding some dramas! 🍿
              </p>
            ) : (
              <div className="movie-grid">
                {filteredWatchlist.map((item) => (
                  <div className="movie-card" key={item.id}>
                    <div className="poster-wrapper">
                      <img
                        className="movie-poster"
                        src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                        alt={item.title}
                      />

                      <select
                        className="status-badge"
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                      >
                        <option value="plan">📌 Plan</option>
                        <option value="watching">▶️ Watching</option>
                        <option value="completed">✅ Completed</option>
                      </select>
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.year}</p>

                    {item.status === "completed" && (
                      <>
                       {editingRating[item.id] || item.rating === null ? (
                         <>
                          <p className="rating-text">⭐ Rate this</p>

                             <div className="rating-buttons">
                                {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                                   <button
                                      key={num}
                                      className={item.rating === num ? "rating active" : "rating"}
                                      onClick={() => {
                                      setRating(item.id, num);
                                      setEditingRating({
                                       ...editingRating,
                                       [item.id]: false,
                                    });
                                        }}
                                     >
                                         {num}
                                     </button>
                                 ))}
                                </div>
                          </>
                         ) : (
                        <>
                         <p className="rating-text">⭐ {item.rating}/10</p>

                           <button
                            className="change-rating"
                            onClick={() =>
                             setEditingRating({
                              ...editingRating,
                              [item.id]: true,
                           })
                              }
                          >
                           Change Rating
                         </button>
                       </>
                        )}
                   </>
                  )}

                    <button
                      className="remove-btn"
                      onClick={() => removeFromWatchlist(item.id)}
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

            <h2>{query ? `Search Results: ${query}` : "🔥 Trending Now"}</h2>

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