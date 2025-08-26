import { useState } from "react";

const CoachForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    user: initialData?.user || "",
    bio: initialData?.bio || "",
    specialties: initialData?.specialties || [],
    certifications: initialData?.certifications || [],
    yearsOfExperience: initialData?.yearsOfExperience || "",
    isAvailable: initialData?.isAvailable ?? true,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (name, value) => {
    if (typeof value === 'string') {
      setForm({ ...form, [name]: value.split(",").map((v) => v.trim()) });
    } else {
      setForm({ ...form, [name]: [] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-dark-gray">Coach</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ID utilisateur (user)</label>
        <input name="user" value={form.user} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Spécialités (séparées par des virgules)</label>
        <input name="specialties" value={form.specialties.join(", ")} onChange={e => handleArrayChange("specialties", e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Certifications (séparées par des virgules)</label>
        <input name="certifications" value={form.certifications.join(", ")} onChange={e => handleArrayChange("certifications", e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
        <input name="yearsOfExperience" type="number" value={form.yearsOfExperience} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label className="inline-flex items-center mt-2">
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Disponible</span>
        </label>
      </div>
      <button type="submit" className="w-full bg-amber-400 hover:bg-amber-500 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200">Enregistrer</button>
    </form>
  );
};

export default CoachForm;
