import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";

import UserCard from "./components/UserCard";
import UserDetails from "./components/UserDetails";
import type { User } from "./types/user";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load people. Server returned ${response.status}.`,
          );
        }

        const data: User[] = await response.json();

        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the directory.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      controller.abort();
    };
  }, [refreshKey]);

  const query = search.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.address.city.toLowerCase().includes(query) ||
      user.company.name.toLowerCase().includes(query)
    );
  });

  const handleRefresh = () => {
    setRefreshKey((current) => current + 1);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f8f4] text-[#303a2d]">
      {/* Navigation */}
      <header className="border-b border-[#e5e8df] bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[#354b31] text-white">
              <Users size={21} />
            </div>

            <div>
              <p className="font-serif text-2xl leading-none tracking-tight">
                People Atlas
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#8b9283]">
                A directory for people
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-xs text-[#737d6d] sm:flex">
            <span className="size-2 rounded-full bg-[#7d9a6e]" />
            React Hooks · Day 15
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-12">
        {/* Intro */}
        <section className="grid gap-8 border-b border-[#e3e6dc] py-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#738466]">
              People make the place
            </p>

            <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] tracking-[-0.04em] sm:text-7xl">
              Meet the people
              <br />
              <span className="italic text-[#819474]">
                behind the work.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#7b8275]">
              One place to explore people, discover their work, and
              find the right contact. A little more human, a little
              less searching.
            </p>
          </div>

          <div className="flex items-center gap-3 border border-[#e3e6dc] bg-white p-4 sm:min-w-[210px]">
            <div className="grid size-11 place-items-center rounded-full bg-[#edf1e9] text-[#526c49]">
              <Users size={21} />
            </div>

            <div>
              <p className="text-2xl font-semibold">
                {loading ? "—" : users.length}
              </p>
              <p className="mt-1 text-xs text-[#8b9283]">
                People in directory
              </p>
            </div>
          </div>
        </section>

        {/* Directory heading */}
        <section className="pt-9">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#8b9283]">
                Your network
              </p>

              <h2 className="font-serif text-3xl">
                The directory
                {!loading && !error && (
                  <span className="ml-3 font-sans text-sm font-normal text-[#8b9283]">
                    {filteredUsers.length}{" "}
                    {filteredUsers.length === 1 ? "person" : "people"}
                  </span>
                )}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start border border-[#dfe3d8] bg-white px-4 py-3 text-xs font-semibold transition hover:border-[#aebda3] hover:bg-[#f1f4ed] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
              {loading ? "Loading people..." : "Refresh directory"}
            </button>
          </div>

          {/* Search */}
          <div className="mt-7 flex items-center gap-3 border-y border-[#e3e6dc] py-4">
            <Search size={18} className="shrink-0 text-[#899181]" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, city, or company..."
              aria-label="Search people"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3a99b]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="text-[#899181] hover:text-[#354b31]"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </section>

        {/* Main content */}
        <section className="mt-7 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            {/* Loading state */}
            {loading && (
              <div
                role="status"
                aria-live="polite"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="animate-pulse border border-[#e9e8e1] bg-white p-5"
                  >
                    <div className="size-14 rounded-2xl bg-[#edf0e9]" />
                    <div className="mt-6 h-4 w-2/3 bg-[#edf0e9]" />
                    <div className="mt-3 h-3 w-1/3 bg-[#f1f2ed]" />
                    <div className="mt-7 border-t border-[#efeee8] pt-4">
                      <div className="h-3 w-full bg-[#f1f2ed]" />
                      <div className="mt-4 h-3 w-2/3 bg-[#f1f2ed]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div
                role="alert"
                className="border border-[#ead8d0] bg-[#fff8f4] p-8 sm:p-10"
              >
                <div className="grid size-12 place-items-center rounded-full bg-[#f4e5de] text-[#a65e43]">
                  <AlertCircle size={22} />
                </div>

                <h3 className="mt-5 font-serif text-2xl text-[#573b30]">
                  We couldn't load the directory.
                </h3>

                <p className="mt-3 max-w-lg break-words text-sm leading-6 text-[#946f61]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={handleRefresh}
                  className="mt-6 inline-flex items-center gap-2 bg-[#354b31] px-5 py-3 text-xs font-semibold text-white hover:bg-[#496443]"
                >
                  <RefreshCw size={14} />
                  Try again
                </button>
              </div>
            )}

            {/* Success state */}
            {!loading && !error && (
              <>
                {filteredUsers.length > 0 ? (
                  <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredUsers.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        onSelect={setSelectedUser}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid min-h-[280px] place-items-center border border-dashed border-[#d9ded2] bg-white p-8 text-center">
                    <div>
                      <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#edf1e9] text-[#607752]">
                        <Search size={20} />
                      </div>

                      <h3 className="mt-4 font-serif text-2xl">
                        No people found.
                      </h3>

                      <p className="mt-2 text-sm text-[#858b7c]">
                        Try another name, city, email, or company.
                      </p>

                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="mt-5 border-b border-[#607752] pb-1 text-xs font-semibold text-[#526c49]"
                      >
                        Clear search
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Profile panel */}
          <div className="xl:sticky xl:top-6">
            <UserDetails
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 flex flex-col justify-between gap-3 border-t border-[#e3e6dc] pt-6 text-xs text-[#8b9283] sm:flex-row">
          <p className="font-serif text-lg italic text-[#526448]">
            Better connections start here.
          </p>

          <p className="self-start sm:self-center">
            PEOPLE ATLAS · BUILT WITH REACT + TYPESCRIPT
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;