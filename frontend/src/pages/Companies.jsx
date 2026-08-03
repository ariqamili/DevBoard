import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Companies() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-6xl mb-6">🏢</div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Companies</h1>

          <p className="text-lg text-gray-500 mb-10">
            Browse companies hiring talented developers.
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              Coming Soon
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Company profiles, reviews, hiring information, and open positions
              will be available in a future version of DevBoard.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
