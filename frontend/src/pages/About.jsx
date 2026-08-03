import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            About DevBoard
          </h1>

          <div className="space-y-6 text-gray-600 leading-8">
            <p>
              DevBoard is a modern job platform created for software developers
              and technology companies.
            </p>

            <p>
              Developers can create professional profiles, discover new
              opportunities, and manage their careers in one place.
            </p>

            <p>
              Companies can publish job openings, manage applications, and
              connect with talented engineers.
            </p>

            <p>
              This project was built using the MERN Stack (MongoDB, Express.js,
              React and Node.js) with JWT Authentication, Refresh Tokens,
              Role-Based Authorization and Responsive UI.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
