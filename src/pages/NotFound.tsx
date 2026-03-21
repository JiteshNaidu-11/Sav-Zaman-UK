import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Sav Zaman UK — Page not found");

  return (
    <main className="page-shell flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="outline-panel max-w-xl rounded-[32px] p-8 text-center md:p-10">
        <p className="section-kicker">404</p>
        <h1 className="mt-4 font-heading text-4xl text-foreground md:text-5xl">This page does not exist.</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
          The page you tried to open is unavailable or may have moved.
        </p>
        <Link to="/" className="btn-primary mt-8 inline-flex px-6 py-3 text-sm">
          Return home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
