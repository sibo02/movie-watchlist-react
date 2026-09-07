function MovieCard(props) {
    return (
        <div className="movie-card">
          <h3>{props.show.name}</h3>
          <img
            className="movie-poster"
             src={`https://image.tmdb.org/t/p/w500${props.show.poster_path}`}
             alt={props.show.name}
           />
          
          <p>{props.show.first_air_date}</p>
        </div>
    );

}
export default MovieCard;