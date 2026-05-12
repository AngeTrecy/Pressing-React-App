import { useState } from "react";

export default function Orders({ orders }) {
  const [search, setSearch] = useState("");

  const filtered = orders.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Commandes</h1>
        <p className="text-sm text-gray-500 mt-1">Total: {orders.length} commandes</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher une commande..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-10">Aucune commande trouvée.</div>
        ) : (
          filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{order.name}</div>
                <div className="text-sm text-gray-500">{order.item}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold">{order.price}</div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${order.washed ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-500"}`}>
                  {order.washed ? "Lavé" : "Non Lavé"}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${order.paid ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                  {order.paid ? "Payé" : "Non Payé"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
