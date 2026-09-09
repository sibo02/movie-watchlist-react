function MovieCard({ show, addToWatchlist, isAdded}) {
  return (
    <div className="movie-card">
      <img
        className="movie-poster"
        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
        alt={show.name}
      />

      <h3>{show.name}</h3>
      <p>{show.first_air_date}</p>

      <button
       onClick={() => addToWatchlist(show)}
       disabled={isAdded}
      >
       {isAdded ? "✓ Added" : "+ Add to Watchlist"}
      </button>
    </div>
  );
}

export default MovieCard;