import { useState, useEffect } from "react";
import './App.css';
import SearchBar from './components/SearchBar';
import MovieCard from'./components/MovieCard';

function App() {
  const [search , setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [watchlist, setWatchlist] = useState(() => {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
  });

  const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
  
  async function fetchTrending() {
    const url= `https://api.themoviedb.org/3/trending/tv/day`;

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
  console.log(data);

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
  const exists = watchlist.some(item => item.id === show.id);

  if (exists) return;

  const newItem = {
    id: show.id,
    title: show.name,
    poster: show.poster_path,
    year: show.first_air_date,
    seen: false,
    rating: null,
    status: "plan"
  };

  setWatchlist([...watchlist, newItem]);
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
            <p>{item.seen ? "✅ Seen" : "📌 Plan to Watch"}</p>
          </div>
        ))}
      </div>
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