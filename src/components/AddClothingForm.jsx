import { useState } from "react";

export default function AddClothingForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    item: "",
    price: "",
    washed: false,
    paid: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.item || !formData.price) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newOrder = {
      id: `CMD-${Math.floor(Math.random() * 10000)}`,
      ...formData,
      price: `${formData.price}€`,
    };

    onSubmit(newOrder);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Ajouter un nouveau vêtement
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            Fermer
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom du client */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom du client *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jean Dupont"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description du vêtement */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description du vêtement *
            </label>
            <input
              type="text"
              name="item"
              value={formData.item}
              onChange={handleChange}
              placeholder="Ex: Costume 3 pièces, Robe de soirée..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prix (€) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="25,00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* État du lavage */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="washed"
              name="washed"
              checked={formData.washed}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="washed" className="text-sm text-gray-700">
              Vêtement lavé
            </label>
          </div>

          {/* État du paiement */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="paid"
              name="paid"
              checked={formData.paid}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="paid" className="text-sm text-gray-700">
              Paiement effectué
            </label>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-colors"
            >
              Ajouter le vêtement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
