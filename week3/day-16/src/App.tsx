import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Check,
  Compass,
  Leaf,
  Moon,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  X,
} from "lucide-react";

import PlaceCard from "./components/PlaceCard";
import { places, type Place, type PlaceCategory } from "./data/places";
import { usePreferences } from "./context/PreferencesContext";

type View = "discover" | "saved";
type SortOption = "featured" | "rating" | "name";

const categories: Array<"All" | PlaceCategory> = [
  "All",
  "Cafes",
  "Nature",
  "Culture",
  "Food",
  "Creative",
];

function App() {
  const { theme, toggleTheme, savedIds, toggleSaved } =
    usePreferences();

  const [view, setView] = useState<View>("discover");
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<"All" | PlaceCategory>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [selectedPlace, setSelectedPlace] =
    useState<Place | null>(places[0]);

  const searchRef = useRef<HTMLInputElement>(null);

  // Press "/" to focus the search field.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        searchRef.current?.blur();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = places.filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(query) ||
        place.location.toLowerCase().includes(query) ||
        place.category.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || place.category === category;

      const matchesView =
        view === "discover" || savedIds.includes(place.id);

      return matchesSearch && matchesCategory && matchesView;
    });

    return result.sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      // Featured places first, then highest-rated places.
      return (
        Number(Boolean(b.featured)) -
          Number(Boolean(a.featured)) ||
        b.rating - a.rating
      );
    });
  }, [search, category, view, savedIds, sortBy]);

  const handleSelectPlace = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleToggleSaved = useCallback(
    (id: number) => {
      toggleSaved(id);
    },
    [toggleSaved],
  );

  const handleViewChange = (nextView: View) => {
    setView(nextView);
    setSelectedPlace(null);
  };

  const savedCount = savedIds.length;

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-[#f8f6f0] text-[#30352d] transition-colors duration-300 dark:bg-[#22251f] dark:text-[#eee9de]">
        {/* Top navigation */}
        <header className="border-b border-[#e6e1d6] dark:border-[#3c4037]">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
            <button
              type="button"
              onClick={() => handleViewChange("discover")}
              className="flex items-center gap-3"
              aria-label="Offbeat home"
            >
              <span className="grid size-10 place-items-center rounded-full bg-[#424a38] text-[#f8f6f0]">
                <Compass size={20} />
              </span>

              <span className="text-left">
                <span className="block font-serif text-2xl leading-none tracking-tight">
                  offbeat
                </span>
                <span className="mt-1 block text-[9px] uppercase tracking-[0.24em] text-[#858174]">
                  The city, differently
                </span>
              </span>
            </button>

            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-7 md:flex"
            >
              <button
                type="button"
                onClick={() => handleViewChange("discover")}
                className={`text-sm transition ${
                  view === "discover"
                    ? "font-semibold"
                    : "text-[#858174] hover:text-[#30352d] dark:hover:text-white"
                }`}
              >
                Discover
              </button>

              <button
                type="button"
                onClick={() => handleViewChange("saved")}
                className={`flex items-center gap-2 text-sm transition ${
                  view === "saved"
                    ? "font-semibold"
                    : "text-[#858174] hover:text-[#30352d] dark:hover:text-white"
                }`}
              >
                Saved places
                <span className="grid size-5 place-items-center rounded-full bg-[#e8e5db] text-[10px] text-[#424a38] dark:bg-[#3c4037] dark:text-[#eee9de]">
                  {savedCount}
                </span>
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === "light"
                    ? "Switch to dark theme"
                    : "Switch to light theme"
                }
                className="grid size-10 place-items-center rounded-full border border-[#e2ded3] transition hover:bg-[#eeebe2] dark:border-[#45493e] dark:hover:bg-[#35392f]"
              >
                {theme === "light" ? (
                  <Moon size={17} />
                ) : (
                  <Sun size={17} />
                )}
              </button>

              <span className="hidden text-xs text-[#858174] sm:block">
                A little less ordinary.
              </span>
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="flex gap-6 border-t border-[#e6e1d6] px-5 py-3 md:hidden dark:border-[#3c4037]">
            <button
              type="button"
              onClick={() => handleViewChange("discover")}
              className={`text-sm ${
                view === "discover" ? "font-semibold" : "text-[#858174]"
              }`}
            >
              Discover
            </button>

            <button
              type="button"
              onClick={() => handleViewChange("saved")}
              className={`flex items-center gap-2 text-sm ${
                view === "saved" ? "font-semibold" : "text-[#858174]"
              }`}
            >
              Saved places ({savedCount})
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-12">
          {/* Editorial hero */}
          <section className="grid gap-8 border-b border-[#e6e1d6] py-12 sm:py-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:py-20 dark:border-[#3c4037]">
            <div>
              <p className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#81866a]">
                <Sparkles size={14} />
                A guide for the curious
              </p>

              <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[88px]">
                Find your
                <br />
                <span className="italic text-[#858a69]">
                  kind of place.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-[#77766b] sm:text-base dark:text-[#b1afa4]">
                The little corners, lovely detours, and places that
                make a city feel like your own. Start somewhere
                unexpected.
              </p>
            </div>

            <div className="relative min-h-[180px] overflow-hidden bg-[#e6e2d5] sm:min-h-[220px] lg:ml-auto lg:w-full">
              <img
                src="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85"
                alt="A quiet street surrounded by trees"
                className="absolute inset-0 size-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 text-white">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/75">
                  A reminder
                </p>
                <p className="mt-1 font-serif text-2xl italic">
                  Take the longer way.
                </p>
              </div>

              <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/50 text-white">
                <ArrowUpRight size={19} />
              </span>
            </div>
          </section>

          {/* Discovery heading */}
          <section className="pt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#858174]">
                  {view === "discover"
                    ? "Handpicked for wandering"
                    : "Your personal collection"}
                </p>

                <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
                  {view === "discover"
                    ? "The good places"
                    : "Saved for later"}
                  <span className="ml-3 font-sans text-sm font-normal text-[#858174]">
                    ({filteredPlaces.length})
                  </span>
                </h2>
              </div>

              {view === "saved" && (
                <button
                  type="button"
                  onClick={() => handleViewChange("discover")}
                  className="flex items-center gap-2 text-xs font-semibold text-[#77766b] hover:text-[#424a38] dark:hover:text-white"
                >
                  <ArrowLeft size={14} />
                  Back to discover
                </button>
              )}
            </div>

            {/* Search and sorting */}
            <div className="mt-8 flex flex-col gap-4 border-y border-[#e6e1d6] py-4 sm:flex-row sm:items-center dark:border-[#3c4037]">
              <div className="relative w-full sm:max-w-sm">
                <Search
                  size={17}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-[#858174]"
                />

                <input
                  ref={searchRef}
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Find a place, neighbourhood..."
                  aria-label="Search places"
                  className="w-full bg-transparent py-2 pl-7 pr-10 text-sm outline-none placeholder:text-[#aaa597] focus:border-b focus:border-[#858a69]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#858174]"
                  >
                    <X size={15} />
                  </button>
                )}

                {!search && (
                  <span className="absolute right-0 top-1/2 hidden -translate-y-1/2 border border-[#ded9cd] px-2 py-1 text-[10px] text-[#858174] sm:block dark:border-[#45493e]">
                    /
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 sm:ml-auto">
                <label
                  htmlFor="sort-places"
                  className="flex items-center gap-2 text-xs text-[#858174]"
                >
                  <SlidersHorizontal size={14} />
                  Sort
                </label>

                <select
                  id="sort-places"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as SortOption)
                  }
                  className="max-w-full border-0 bg-transparent py-2 text-xs font-semibold outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Top rated</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>
            </div>

            {/* Category filters */}
            <div className="flex gap-2 overflow-x-auto py-5">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`shrink-0 border px-4 py-2 text-xs transition ${
                    category === item
                      ? "border-[#424a38] bg-[#424a38] text-white dark:border-[#d5d1bd] dark:bg-[#d5d1bd] dark:text-[#252820]"
                      : "border-[#e2ded3] text-[#77766b] hover:border-[#a3a18e] dark:border-[#45493e] dark:text-[#b1afa4]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          {/* Place cards and details */}
          <section className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              {filteredPlaces.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      saved={savedIds.includes(place.id)}
                      onSelect={handleSelectPlace}
                      onToggleSaved={handleToggleSaved}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid min-h-[300px] place-items-center border border-dashed border-[#d8d3c7] px-6 text-center dark:border-[#45493e]">
                  <div>
                    <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#eeebe2] text-[#77766b] dark:bg-[#35392f]">
                      {view === "saved" ? (
                        <Bookmark size={19} />
                      ) : (
                        <Search size={19} />
                      )}
                    </span>

                    <h3 className="mt-4 font-serif text-2xl">
                      {view === "saved"
                        ? "Nothing saved just yet."
                        : "No places found."}
                    </h3>

                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#858174]">
                      {view === "saved"
                        ? "When a place catches your eye, bookmark it and it will live here."
                        : "Try a different search or category. Your next favourite might be one filter away."}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setCategory("All");
                        if (view === "saved") setView("discover");
                      }}
                      className="mt-5 border-b border-[#858a69] pb-1 text-xs font-semibold"
                    >
                      Reset discovery
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Selected place detail panel */}
            <aside className="self-start xl:sticky xl:top-6">
              {selectedPlace ? (
                <div className="border-t-2 border-[#424a38] pt-4 dark:border-[#a9ae8b]">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#858174]">
                      A closer look
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedPlace(null)}
                      aria-label="Close place details"
                      className="p-1 text-[#858174] hover:text-[#30352d] dark:hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <img
                    src={selectedPlace.image}
                    alt={selectedPlace.name}
                    className="aspect-[5/3] w-full object-cover"
                  />

                  <div className="mt-5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#858174]">
                        {selectedPlace.category}
                      </p>
                      <h3 className="mt-2 font-serif text-3xl leading-tight">
                        {selectedPlace.name}
                      </h3>
                    </div>

                    <span className="flex items-center gap-1 pt-1 text-xs">
                      <Star
                        size={13}
                        fill="currentColor"
                        className="text-[#a58a51]"
                      />
                      {selectedPlace.rating.toFixed(1)}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[#77766b] dark:text-[#b1afa4]">
                    {selectedPlace.description}
                  </p>

                  <div className="mt-5 space-y-3 border-y border-[#e6e1d6] py-4 text-xs dark:border-[#3c4037]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#858174]">Neighbourhood</span>
                      <span className="text-right">
                        {selectedPlace.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#858174]">Hours</span>
                      <span className="text-right">
                        {selectedPlace.hours}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#858174]">Price guide</span>
                      <span>{selectedPlace.price}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleSaved(selectedPlace.id)}
                    className={`mt-5 flex w-full items-center justify-center gap-2 border px-4 py-3 text-xs font-semibold transition ${
                      savedIds.includes(selectedPlace.id)
                        ? "border-[#424a38] bg-[#424a38] text-white dark:border-[#d5d1bd] dark:bg-[#d5d1bd] dark:text-[#252820]"
                        : "border-[#424a38] hover:bg-[#eeebe2] dark:border-[#777e65] dark:hover:bg-[#35392f]"
                    }`}
                  >
                    {savedIds.includes(selectedPlace.id) ? (
                      <>
                        <Check size={15} />
                        Saved to your collection
                      </>
                    ) : (
                      <>
                        <Bookmark size={15} />
                        Save this place
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-[10px] leading-5 text-[#999587]">
                    Demonstration content — confirm venue details before visiting.
                  </p>
                </div>
              ) : (
                <div className="border-t-2 border-[#424a38] py-8 dark:border-[#a9ae8b]">
                  <Leaf size={20} className="text-[#858a69]" />
                  <h3 className="mt-4 font-serif text-2xl">
                    Follow your curiosity.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#858174]">
                    Select any place to get a closer look at what makes it
                    interesting.
                  </p>
                </div>
              )}
            </aside>
          </section>

          {/* Footer */}
          <footer className="mt-20 flex flex-col justify-between gap-4 border-t border-[#e6e1d6] pt-6 text-xs text-[#858174] sm:flex-row dark:border-[#3c4037]">
            <p className="font-serif text-lg italic text-[#424a38] dark:text-[#d5d1bd]">
              Go somewhere unexpected.
            </p>
            <p>OFFBEAT · A CITY GUIDE CONCEPT</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;