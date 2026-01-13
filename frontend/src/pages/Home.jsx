import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Discover Your Campus <span className="text-secondary">Community</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Join clubs, attend events, and connect with peers. The University Club Hub is your gateway to student life.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/clubs"
            className="rounded-md bg-secondary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Explore Clubs
          </Link>
          <Link to="/login" className="text-sm font-semibold leading-6 text-white">
            Log in <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
