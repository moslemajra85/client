import { useState, useEffect, useMemo } from "react";
import "../App.css"



const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/filmMaker/api";

const MoviePage = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        const loadData = async () => {
            setLoading(true);
            setError("");
            try {
                const [moviesRes, genresRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/movies`),
                    fetch(`${API_BASE_URL}/genres`),
                ]);

                if (!moviesRes.ok) throw new Error("Failed to load movies");
                if (!genresRes.ok) throw new Error("Failed to load genres");

                const [moviesData, genresData] = await Promise.all([
                    moviesRes.json(),
                    genresRes.json(),
                ]);

                if (!ignore) {
                    setMovies(moviesData);
                    setGenres(genresData);
                }
            } catch (err) {
                if (!ignore) setError(err.message || "Something went wrong");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        loadData();
        return () => {
            ignore = true;
        };
    }, []);

    const genreMap = useMemo(() => {
        const map = new Map();
        genres.forEach((genre) => {
            if (genre?._id) map.set(genre._id, genre.name);
        });
        return map;
    }, [genres]);

    const filteredMovies =
        selectedGenre === "all"
            ? movies
            : movies.filter((movie) => {
                const genreValue = movie.genre;
                if (!genreValue) return false;
                if (typeof genreValue === "string") return genreValue === selectedGenre;
                if (genreValue?._id) return genreValue._id === selectedGenre;
                return false;
            });

    const getGenreName = (movie) => {
        if (!movie.genre) return "Unknown genre";
        if (typeof movie.genre === "string") {
            return genreMap.get(movie.genre) || "Unknown genre";
        }
        return movie.genre.name || "Unknown genre";
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "—";
        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) return "—";
        return date.toLocaleDateString();
    };

    return (
        <div className="page">
            <div className="header">
                <div>
                    <p className="eyebrow">FilmMaker</p>
                    <h1>Movies Catalog</h1>
                    <p className="lede">
                        Browse your collection and filter by genre. Data loads from the
                        running server API.
                    </p>
                </div>
                <div className="badge">
                    <span className="dot" />
                    Connected to API
                </div>
            </div>

            <div className="layout">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h2>Genres</h2>
                        <p className="muted">{genres.length} total</p>
                    </div>
                    <div className="genre-list">
                        <button
                            className={`genre-button ${selectedGenre === "all" ? "active" : ""
                                }`}
                            onClick={() => setSelectedGenre("all")}
                        >
                            <span>All</span>
                            <span className="pill">{movies.length}</span>
                        </button>
                        {genres.map((genre) => (
                            <button
                                key={genre._id}
                                className={`genre-button ${selectedGenre === genre._id ? "active" : ""
                                    }`}
                                onClick={() => setSelectedGenre(genre._id)}
                            >
                                <span>{genre.name}</span>
                                <span className="pill">
                                    {
                                        movies.filter((m) => {
                                            if (!m.genre) return false;
                                            if (typeof m.genre === "string") return m.genre === genre._id;
                                            return m.genre?._id === genre._id;
                                        }).length
                                    }
                                </span>
                            </button>
                        ))}
                    </div>
                </aside>

                <main className="content">
                    {loading && <div className="status">Loading movies…</div>}
                    {error && !loading && <div className="status error">{error}</div>}
                    {!loading && !error && filteredMovies.length === 0 && (
                        <div className="status">No movies found for this genre.</div>
                    )}

                    {!loading && !error && filteredMovies.length > 0 && (
                        <div className="grid">
                            {filteredMovies.map((movie) => (
                                <article key={movie._id} className="card">
                                    <div className="card-top">
                                        <div className="genre-tag">{getGenreName(movie)}</div>
                                        <p className="meta">Released {formatDate(movie.releaseDate)}</p>
                                    </div>
                                    <h3>{movie.title || "Untitled"}</h3>
                                    <p className="director">
                                        {movie.director ? `Directed by ${movie.director}` : "Director TBD"}
                                    </p>
                                    <div className="card-footer">
                                        <div>
                                            <p className="meta">Price</p>
                                            <p className="price">
                                                {typeof movie.price === "number"
                                                    ? `$${movie.price.toFixed(2)}`
                                                    : "—"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="meta">ID</p>
                                            <p className="id">{movie._id?.slice(-6) || "—"}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default MoviePage