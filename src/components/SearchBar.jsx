function SearchBar(props) {
    return (
        <div className="search-bar">
          <input 
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)} 
          />
           <button onClick={props.handleSearch}>
              Search
            </button>
        </div>
    );



}
export default SearchBar;