export default function Statistics({ orders }) {
  const total = orders.length;
  const washed = orders.filter((o) => o.washed).length;
  const paid = orders.filter((o) => o.paid).length;
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.price.replace(" €", "")), 0);
  const unpaid = orders.filter((o) => !o.paid).reduce((sum, o) => sum + parseFloat(o.price.replace(" €", "")), 0);
  const pending = orders.filter((o) => !o.washed).length;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Statistiques</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-sm text-gray-500 mb-1">Commandes totales</div>
          <div className="text-4xl font-extrabold text-blue-600">{total}</div>
          <div className="text-xs text-gray-400 mt-2">Toutes les commandes</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-sm text-gray-500 mb-1">Revenu total</div>
          <div className="text-4xl font-extrabold text-emerald-600">{totalRevenue.toFixed(2)}€</div>
          <div className="text-xs text-gray-400 mt-2">Somme de tous les prix</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-sm text-gray-500 mb-1">Commandes lavées</div>
          <div className="text-4xl font-extrabold text-emerald-600">{washed}</div>
          <div className="text-xs text-gray-400 mt-2">{((washed / total) * 100).toFixed(0)}% du total</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-sm text-gray-500 mb-1">Commandes payées</div>
          <div className="text-4xl font-extrabold text-emerald-600">{paid}</div>
          <div className="text-xs text-gray-400 mt-2">{((paid / total) * 100).toFixed(0)}% du total</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-sm text-gray-500 mb-1">En attente de lavage</div>
          <div className="text-4xl font-extrabold text-orange-500">{pending}</div>
          <div className="text-xs text-gray-400 mt-2">{((pending / total) * 100).toFixed(0)}% du total</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-sm text-gray-500 mb-1">Montant impayé</div>
          <div className="text-4xl font-extrabold text-red-600">{unpaid.toFixed(2)}€</div>
          <div className="text-xs text-gray-400 mt-2">À récupérer</div>
        </div>
      </div>
    </div>
  );
}
