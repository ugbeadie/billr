import Link from "next/link";
import Wordmark from "./Wordmark";
import { REPO_URL } from "./data";

const linkClass =
  "rounded-sm text-sm text-[#6B7280] transition-colors hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A9AFF]/50";

export default function LandingFooter() {
  return (
    <footer className="overflow-x-clip border-t border-[#E5E7EB] bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid min-w-0 max-w-7xl gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-4">
          <Wordmark size="lg" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#6B7280]">
            A place to put the thirty jobs you applied to, so you stop losing
            track of them.
          </p>
        </div>

        <nav className="lg:col-span-2" aria-labelledby="footer-product">
          <h2
            id="footer-product"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827]"
          >
            Product
          </h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/register" className={linkClass}>
                Create an account
              </Link>
            </li>
            <li>
              <Link href="/login" className={linkClass}>
                Log in
              </Link>
            </li>
            <li>
              <Link href="#parser" className={linkClass}>
                The parser
              </Link>
            </li>
            <li>
              <Link href="#board" className={linkClass}>
                The board
              </Link>
            </li>
            <li>
              <Link href="#extension" className={linkClass}>
                The extension
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="lg:col-span-2" aria-labelledby="footer-project">
          <h2
            id="footer-project"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827]"
          >
            Project
          </h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Source on GitHub
              </a>
            </li>
            <li>
              <a
                href={`${REPO_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Report an issue
              </a>
            </li>
          </ul>
        </nav>

        <div className="min-w-0 lg:col-span-4">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827]">
            About this
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
            Trackr is a portfolio project, not a company. It is free, it is
            built and maintained by one person, and there is no team behind it.
            If something breaks, opening an issue is the fastest way to reach
            someone.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-[#E5E7EB] pt-6">
        <p className="text-sm text-[#9CA3AF]">© 2026 Trackr</p>
      </div>
    </footer>
  );
}
