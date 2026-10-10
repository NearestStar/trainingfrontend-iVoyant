import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  LayoutDashboard,
  LogIn,
  LogOut,
  Search,
  GraduationCap,
  Clock3,
} from "lucide-react";

// Course data
const courses = [
  {
    id: "1",
    title: "React Fundamentals",
    category: "Frontend",
    duration: "6 weeks",
    level: "Beginner",
    description:
      "Learn components, props, state, hooks, and the fundamentals of building React applications.",
  },
  {
    id: "2",
    title: "TypeScript Essentials",
    category: "Programming",
    duration: "4 weeks",
    level: "Beginner",
    description:
      "Write safer JavaScript with types, interfaces, unions, and practical TypeScript patterns.",
  },
  {
    id: "3",
    title: "Advanced CSS",
    category: "Frontend",
    duration: "3 weeks",
    level: "Intermediate",
    description:
      "Build responsive layouts using Flexbox, Grid, animations, and reusable styling techniques.",
  },
  {
    id: "4",
    title: "Node.js Basics",
    category: "Backend",
    duration: "5 weeks",
    level: "Beginner",
    description:
      "Explore server-side JavaScript, HTTP APIs, modules, and backend fundamentals.",
  },
];

type Course = (typeof courses)[number];

// Shared navigation
function Navbar({
  loggedIn,
  onLogout,
}: {
  loggedIn: boolean;
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/", { replace: true });
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon">
          <GraduationCap size={23} />
        </span>
        SkillPath
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/courses">
          Courses
        </NavLink>

        {loggedIn && (
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>
        )}
      </nav>

      {loggedIn ? (
        <button className="button button-outline" onClick={handleLogout}>
          <LogOut size={16} />
          Log out
        </button>
      ) : (
        <Link to="/login" className="button button-primary">
          <LogIn size={16} />
          Log in
        </Link>
      )}
    </header>
  );
}

// Home page
function Home() {
  return (
    <main>
      <section className="hero">
        <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
        <h1>
          Learn skills.
          <br />
          <span>Build your future.</span>
        </h1>
        <p>
          Practical courses to help you grow your skills,
          build projects, and move closer to your career goals.
        </p>

        <div className="hero-actions">
          <Link to="/courses" className="button button-primary">
            Explore courses <ArrowRight size={17} />
          </Link>
          <Link to="/dashboard" className="text-link">
            Student dashboard
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">START LEARNING</span>
            <h2>Explore our courses</h2>
          </div>
          <Link to="/courses" className="text-link">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="course-grid">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </main>
  );
}

// Reusable course card
function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card">
      <div className="course-card-top">
        <span className="course-icon">
          <BookOpen size={22} />
        </span>
        <span className="category">{course.category}</span>
      </div>

      <h3>{course.title}</h3>
      <p>{course.description}</p>

      <div className="course-meta">
        <span>
          <Clock3 size={15} /> {course.duration}
        </span>
        <span>{course.level}</span>
      </div>

      <Link to={`/courses/${course.id}`} className="course-link">
        View course <ArrowRight size={16} />
      </Link>
    </article>
  );
}

// Course listing with query-string search
function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") ?? "";

  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  function handleSearch(value: string) {
    const nextParams = new URLSearchParams(searchParams);

    if (value.trim()) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }

    setSearchParams(nextParams);
  }

  return (
    <main className="page">
      <section className="page-heading">
        <span className="eyebrow">THE COURSE LIBRARY</span>
        <h1>Find your next skill.</h1>
        <p>Explore courses and choose what you want to learn next.</p>
      </section>

      <label className="search-box">
        <Search size={19} />
        <input
          type="search"
          placeholder="Search courses or categories..."
          value={searchTerm}
          onChange={(event) => handleSearch(event.target.value)}
        />
      </label>

      <p className="result-count">
        {filteredCourses.length} courses found
      </p>

      {filteredCourses.length > 0 ? (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} />
          <h3>No courses found</h3>
          <p>Try another course name or category.</p>
        </div>
      )}
    </main>
  );
}

// Dynamic course details page
function CourseDetails() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courses.find((item) => item.id === courseId);

  if (!course) {
    return <NotFound />;
  }

  return (
    <main className="page">
      <Link to="/courses" className="back-link">
        ← Back to courses
      </Link>

      <section className="details-card">
        <span className="course-icon">
          <BookOpen size={25} />
        </span>
        <span className="eyebrow">{course.category}</span>
        <h1>{course.title}</h1>
        <p>{course.description}</p>

        <div className="details-meta">
          <span>{course.duration}</span>
          <span>{course.level}</span>
        </div>

        <Link to="/login" className="button button-primary">
          Start learning <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}

// Login page
function Login({
  onLogin,
}: {
  onLogin: () => void;
}) {
  const navigate = useNavigate();

  function handleLogin() {
    // Demo login only: no credentials are verified.
    onLogin();
    navigate("/dashboard", { replace: true });
  }

  return (
    <main className="login-wrap">
      <section className="login-card">
        <span className="course-icon">
          <GraduationCap size={25} />
        </span>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Continue your journey.</h1>
        <p>
          Sign in to open your student dashboard and view
          your learning space.
        </p>

        <button
          className="button button-primary full-width"
          onClick={handleLogin}
        >
          Demo login <ArrowRight size={17} />
        </button>

        <small>
          This is a demo login. It does not verify a password.
        </small>
      </section>
    </main>
  );
}

// Reusable protected-route guard
function ProtectedRoute({ loggedIn }: { loggedIn: boolean }) {
  return loggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

// Dashboard layout shared by nested pages
function DashboardLayout() {
  return (
    <main className="page">
      <section className="dashboard-header">
        <span className="eyebrow">YOUR LEARNING SPACE</span>
        <h1>Student dashboard</h1>
        <p>Keep track of your learning journey.</p>
      </section>

      <nav className="dashboard-tabs">
        <NavLink to="/dashboard" end>
          <LayoutDashboard size={17} /> Overview
        </NavLink>
        <NavLink to="/dashboard/courses">
          <BookOpen size={17} /> My courses
        </NavLink>
      </nav>

      <Outlet />
    </main>
  );
}

// Nested dashboard page: overview
function DashboardOverview() {
  return (
    <section className="dashboard-panel">
      <span className="course-icon">
        <GraduationCap size={24} />
      </span>
      <h2>Welcome, learner!</h2>
      <p>
        You're ready to keep learning. Explore the course
        library and choose your next topic.
      </p>
      <Link to="/courses" className="button button-primary">
        Browse courses <ArrowRight size={17} />
      </Link>
    </section>
  );
}

// Nested dashboard page: my courses
function MyCourses() {
  // Demo data: these are example enrolled courses.
  const enrolledCourses = courses.slice(0, 2);

  return (
    <section>
      <div className="section-heading">
        <div>
          <h2>My courses</h2>
          <p className="muted">Your current learning list.</p>
        </div>
      </div>

      <div className="course-grid">
        {enrolledCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}

// Fallback page for unknown URLs
function NotFound() {
  return (
    <main className="empty-state not-found">
      <span className="eyebrow">404 ERROR</span>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="button button-primary">
        Back home
      </Link>
    </main>
  );
}

// Main application
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    setLoggedIn(false);
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar loggedIn={loggedIn} onLogout={handleLogout} />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/courses/:courseId"
            element={<CourseDetails />}
          />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* Protected routes with nested dashboard pages */}
          <Route element={<ProtectedRoute loggedIn={loggedIn} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="courses" element={<MyCourses />} />
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="footer">
          <span>SkillPath</span>
          <span>Learn something useful every day.</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}