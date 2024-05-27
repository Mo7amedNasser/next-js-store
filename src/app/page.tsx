import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center mt-5 mb-5">
      <div>
        <h2>Welcome to our store | Home page</h2>
      </div>

      <div className="mt-4">
          <Link href="/products" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300">
              Go To Product List
          </Link>
      </div>
    </div>
  );
}
