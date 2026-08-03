import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import { useUser } from "../context/UserContext";
import profileService from "../services/profileService";

export default function Onboarding() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [checkingProfile, setCheckingProfile] = useState(true);
  const [formData, setFormData] = useState(() =>
    user?.role === "company"
      ? {
          companyName: "",
          description: "",
          industry: "",
          website: "",
          location: "",
          logoUrl: "",
        }
      : {
          fullName: "",
          bio: "",
          location: "",
          githubUrl: "",
          portfolioUrl: "",
          experienceLevel: "junior",
        },
  );
  // Skills is kept as raw text while the user types — parsing it into an
  // array on every keystroke (and filtering empty entries) made it
  // impossible to type a comma or trailing space, since the filtered
  // value would immediately snap back and erase what was just typed.
  const [skillsText, setSkillsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Don't let a user who already completed onboarding land here again —
  // hitting POST /profile a second time would 409 at best, or create a
  // duplicate at worst if that guard ever regresses server-side.
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await profileService.getMyProfile();
        if (response.data) {
          navigate("/dashboard", { replace: true });
          return;
        }
      } catch (err) {
        // getMyProfile returns 200 { data: null } when there's simply no
        // profile yet — that's not an error path at all. So anything that
        // lands here is a genuine, unexpected failure, and the user should
        // know why they're stuck rather than only the developer.
        setError(
          err.response?.data?.message ??
            "Unable to verify your profile. Please try again.",
        );
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setSkillsText(e.target.value);
  };

  const handleSkip = () => {
    navigate("/dashboard", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSaving(true);

      const payload =
        user?.role === "developer"
          ? {
              ...formData,
              skills: skillsText
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            }
          : formData;

      await profileService.createProfile(payload);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  // Belt-and-suspenders: onboarding is already wrapped in ProtectedRoute,
  // but guard here too in case that ever changes — user.role is read
  // below and would otherwise throw on a null user.
  if (!user) {
    return <Spinner />;
  }

  if (checkingProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Spinner />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to DevBoard 👋
          </h1>
          <p className="text-gray-500 mt-2">
            Let&apos;s set up your{" "}
            {user?.role === "company" ? "company" : "developer"} profile. You
            can always finish this later from your dashboard.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6"
        >
          <fieldset disabled={saving} className="space-y-6">
            {user?.role === "developer" && (
              <>
                <Input
                  label="Full Name"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <Textarea
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
                <Input
                  label="Skills (comma separated)"
                  name="skills"
                  value={skillsText}
                  onChange={handleSkillsChange}
                />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
                <Input
                  label="GitHub URL"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                />
                <Input
                  label="Portfolio URL"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                />
                <div>
                  <label className="block mb-2 text-sm font-semibold">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel || "junior"}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
              </>
            )}

            {user?.role === "company" && (
              <>
                <Input
                  label="Company Name"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                />
                <Textarea
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                <Input
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                />
                <Input
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
                <Input
                  label="Logo URL"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                />
              </>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSkip}
                disabled={saving}
                className="flex-1 rounded-xl border border-gray-300 text-gray-600 py-3 font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 font-semibold transition"
              >
                {saving ? "Saving..." : "Save & Continue"}
              </button>
            </div>
          </fieldset>
        </form>
      </main>

      <Footer />
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold">{label}</label>
      <textarea
        rows={4}
        {...props}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none"
      />
    </div>
  );
}
