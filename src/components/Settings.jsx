import { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    appName: "LNDRY Command",
    businessName: "Ma Blanchisserie",
    email: "contact@blanchisserie.fr",
    phone: "+33 1 23 45 67 89",
    theme: "light",
    notifications: true,
    autoBackup: false,
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    alert("Paramètres sauvegardés");
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
      </div>

      <div className="space-y-4">
        {/* Général */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Informations générales</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'application</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleChange("appName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du commerce</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Préférences */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Préférences</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thème</label>
              <select
                value={settings.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange("notifications", e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Sauvegarde automatique</label>
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => handleChange("autoBackup", e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg"
          >
            Sauvegarder
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
