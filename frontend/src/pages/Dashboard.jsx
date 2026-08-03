import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../context/UserContext";
import profileService from "../services/profileService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getMyProfile();
        setProfile(response.data); // null if not created yet — that's fine
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Welcome */}
        <section className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome back 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Here&apos;s an overview of your DevBoard account.
          </p>
        </section>

        {/* Account Card */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Account Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Role</p>
              <p className="mt-1 capitalize text-lg font-semibold text-indigo-600">
                {user?.role}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Status</p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-semibold text-green-700">
                  Logged In
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Card */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {user?.role === "company"
                ? "Company Profile"
                : "Developer Profile"}
            </h2>
            <Link
              to="/profile"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {profile ? "Edit Profile →" : "Complete Profile →"}
            </Link>
          </div>

          {loadingProfile && (
            <p className="text-sm text-gray-400">Loading profile...</p>
          )}

          {!loadingProfile && !profile && (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 mb-4">
                You haven&apos;t completed your profile yet.
              </p>
              <Link
                to="/profile"
                className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Complete Profile
              </Link>
            </div>
          )}

          {!loadingProfile && profile && user?.role === "developer" && (
            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Full Name" value={profile.fullName} />
              <Field label="Location" value={profile.location} />
              <Field
                label="Experience Level"
                value={profile.experienceLevel}
                capitalize
              />
              <Field label="GitHub" value={profile.githubUrl} isLink />
              <Field label="Portfolio" value={profile.portfolioUrl} isLink />

              {profile.bio && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-400">Bio</p>
                  <p className="mt-1 text-gray-700">{profile.bio}</p>
                </div>
              )}

              {profile.skills?.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loadingProfile && profile && user?.role === "company" && (
            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Company Name" value={profile.companyName} />
              <Field label="Industry" value={profile.industry} />
              <Field label="Location" value={profile.location} />
              <Field label="Website" value={profile.website} isLink />

              {profile.description && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="mt-1 text-gray-700">{profile.description}</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {user?.role === "developer" && (
              <>
                <Link
                  to="/jobs"
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-3xl mb-4">💼</div>
                  <h3 className="font-bold text-gray-900">Browse Jobs</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Explore all available developer positions.
                  </p>
                </Link>

                <Link
                  to="/applications"
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-3xl mb-4">📄</div>
                  <h3 className="font-bold text-gray-900">My Applications</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Track the status of jobs you&apos;ve applied to.
                  </p>
                </Link>
              </>
            )}

            {user?.role === "company" && (
              <>
                <Link
                  to="/jobs/new"
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-3xl mb-4">➕</div>
                  <h3 className="font-bold text-gray-900">Post a Job</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Create a new job listing.
                  </p>
                </Link>

                <Link
                  to="/company/applications"
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-3xl mb-4">📋</div>
                  <h3 className="font-bold text-gray-900">Applications</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Review and manage applicants.
                  </p>
                </Link>
              </>
            )}

            <Link
              to="/profile"
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="text-3xl mb-4">👤</div>
              <h3 className="font-bold text-gray-900">Edit Profile</h3>
              <p className="text-sm text-gray-500 mt-2">
                Update your information anytime.
              </p>
            </Link>

            <button
              onClick={handleLogout}
              className="text-left bg-white border border-red-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-red-200 transition"
            >
              <div className="text-3xl mb-4">🚪</div>
              <h3 className="font-bold text-red-600">Logout</h3>
              <p className="text-sm text-gray-500 mt-2">
                Sign out from your account securely.
              </p>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, value, isLink, capitalize }) {
  if (!value) return null;

  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block text-indigo-600 hover:text-indigo-700 font-semibold truncate"
        >
          {value}
        </a>
      ) : (
        <p
          className={`mt-1 text-gray-900 font-semibold ${capitalize ? "capitalize" : ""}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}
