import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Chat from "./pages/Chat.jsx";
import Upload from "./pages/Upload.jsx";

function BrandMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v18M6 7l-3 6a3 3 0 0 0 6 0l-3-6Zm12 0l-3 6a3 3 0 0 0 6 0l-3-6ZM4 21h16M4 7h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? "text-ink" : "text-ink/55 hover:text-ink"
    } after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[2px] after:rounded-full after:bg-brass after:transition-opacity ${
      isActive ? "after:opacity-100" : "after:opacity-0"
    }`;

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/chat" className={linkClass} onClick={() => setOpen(false)}>
        Ask
      </NavLink>
      <NavLink to="/upload" className={linkClass} onClick={() => setOpen(false)}>
        Upload
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/85 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-3 sm:px-6">
        <span className="mr-2 flex items-center gap-2 text-moss">
          <BrandMark />
          <span className="font-serif text-lg text-ink">Sahayak</span>
        </span>

        <div className="hidden items-center gap-1 sm:flex">{links}</div>

        <button
          type="button"
          className="ml-auto rounded-md p-2 text-ink/70 hover:bg-ink/5 sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-nav" className="flex flex-col gap-1 border-t border-ink/10 px-4 pb-3 pt-2 sm:hidden">{links}</div>
      )}
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-moss focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <NavBar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>
    </div>
  );
}
