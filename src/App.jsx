import { useState } from "react";
import './App.css';
import SearchBar from './components/SearchBar';
import MovieCard from'./components/MovieCard';

function App() {
  const [search , setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  

  const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
  
  
  
  async function handleSearch() {
    setQuery(search);

       const url = `https://api.themoviedb.org/3/search/tv?query=${search}`;

       const response = await fetch(url, {
         headers: {
           Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  console.log(data);

  setResults(data.results);
}


  return (
    <div>
      <header>
        <h1>Drama & Movie Watchlist</h1>
        <p>Find something to watch 🍿</p>
      </header>

      <main>
          
          <SearchBar
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
          />
          <p>Search result: {query}</p>
         <div movie-grid>
             {results.map((show) => (
             <MovieCard key={show.id} show={show} />

             
            ))}
          </div>
        
      </main>
    </div>
  );
}

export default App;