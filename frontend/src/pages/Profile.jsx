import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import { useUser } from "../context/UserContext";
import profileService from "../services/profileService";

export default function Profile() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({});
  // Skills kept as raw text while typing — see Onboarding.jsx for why
  // parsing on every keystroke breaks typing commas/spaces.
  const [skillsText, setSkillsText] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getMyProfile();
        // response = { success: true, data: profile | null } — the profile
        // fields themselves live in response.data, not on response directly.
        const profile = response.data;

        if (profile) {
          setFormData(profile);
          if (Array.isArray(profile.skills)) {
            setSkillsText(profile.skills.join(", "));
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (success) setSuccess("");
    if (error) setError("");
  };

  const handleSkillsChange = (e) => {
    setSkillsText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const response = await profileService.updateMyProfile(payload);
      setFormData(response.data);

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-3 text-green-700">
            {success}
          </div>
        )}

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
                  value={formData.fullName || ""}
                  onChange={handleChange}
                />

                <Textarea
                  label="Bio"
                  name="bio"
                  value={formData.bio || ""}
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
                  value={formData.location || ""}
                  onChange={handleChange}
                />

                <Input
                  label="GitHub URL"
                  name="githubUrl"
                  value={formData.githubUrl || ""}
                  onChange={handleChange}
                />

                <Input
                  label="Portfolio URL"
                  name="portfolioUrl"
                  value={formData.portfolioUrl || ""}
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
                  value={formData.companyName || ""}
                  onChange={handleChange}
                />

                <Textarea
                  label="Description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                />

                <Input
                  label="Industry"
                  name="industry"
                  value={formData.industry || ""}
                  onChange={handleChange}
                />

                <Input
                  label="Website"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleChange}
                />

                <Input
                  label="Location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                />

                <Input
                  label="Logo URL"
                  name="logoUrl"
                  value={formData.logoUrl || ""}
                  onChange={handleChange}
                />
              </>
            )}

            <button
              disabled={saving}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 font-semibold"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
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
        rows={5}
        {...props}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none"
      />
    </div>
  );
}
