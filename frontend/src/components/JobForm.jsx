import { useState } from "react";

const EMPLOYMENT_TYPES = ["full-time", "part-time", "contract", "internship"];
const EXPERIENCE_LEVELS = ["junior", "mid", "senior", "lead"];

// Converts a comma-separated string into a clean array — same pattern used
// in Onboarding/Profile for skills, applied consistently here too.
const parseList = (text) =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export default function JobForm({ initialData, onSubmit, submitLabel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "Remote",
    employmentType: initialData?.employmentType || "full-time",
    experienceLevel: initialData?.experienceLevel || "junior",
    minSalary: initialData?.salary?.min ?? "",
    maxSalary: initialData?.salary?.max ?? "",
  });

  const [requiredSkillsText, setRequiredSkillsText] = useState(
    (initialData?.requiredSkills || []).join(", "),
  );
  const [niceToHaveText, setNiceToHaveText] = useState(
    (initialData?.niceToHaveSkills || []).join(", "),
  );
  const [benefitsText, setBenefitsText] = useState(
    (initialData?.benefits || []).join(", "),
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      employmentType: formData.employmentType,
      experienceLevel: formData.experienceLevel,
      requiredSkills: parseList(requiredSkillsText),
      niceToHaveSkills: parseList(niceToHaveText),
      benefits: parseList(benefitsText),
      salary: {
        min: formData.minSalary === "" ? undefined : Number(formData.minSalary),
        max: formData.maxSalary === "" ? undefined : Number(formData.maxSalary),
      },
    };

    try {
      setSaving(true);
      await onSubmit(payload);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save this job posting.",
      );
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6"
    >
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <fieldset disabled={saving} className="space-y-6">
        <Input
          label="Job Title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
        />

        <Textarea
          label="Description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
        />

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Employment Type
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type
                    .split("-")
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join("-")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level[0].toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Required Skills (comma separated)"
          value={requiredSkillsText}
          onChange={(e) => setRequiredSkillsText(e.target.value)}
          placeholder="React, Node, MongoDB"
        />

        <Input
          label="Nice to Have Skills (comma separated)"
          value={niceToHaveText}
          onChange={(e) => setNiceToHaveText(e.target.value)}
          placeholder="GraphQL, Docker"
        />

        <Input
          label="Benefits (comma separated)"
          value={benefitsText}
          onChange={(e) => setBenefitsText(e.target.value)}
          placeholder="Remote work, Health insurance"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Minimum Salary"
            name="minSalary"
            type="number"
            value={formData.minSalary}
            onChange={handleChange}
          />
          <Input
            label="Maximum Salary"
            name="maxSalary"
            type="number"
            value={formData.maxSalary}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 transition"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
      </fieldset>
    </form>
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
        rows={6}
        {...props}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none"
      />
    </div>
  );
}
