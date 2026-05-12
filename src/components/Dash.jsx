import { useState } from "react";
import AddClothingForm from "./AddClothingForm";
import Orders from "./Orders";
import Clients from "./Clients";
import Statistics from "./Statistics";
import Settings from "./Settings";

const orders = [
  {
    id: "CMD-8231",
    name: "Jean-Marc Dupont",
    item: "Costume 3 pièces",
    price: "25,00 €",
    washed: true,
    paid: false,
  },
  {
    id: "CMD-8229",
    name: "Sophie Martin",
    item: "Robe de soirée",
    price: "42,00 €",
    washed: false,
    paid: true,
  },
  {
    id: "CMD-8225",
    name: "Marc Lefebvre",
    item: "5 Chemises Coton",
    price: "15,50 €",
    washed: true,
    paid: true,
  },
  {
    id: "CMD-8224",
    name: "Hélène Richard",
    item: "Manteau Laine",
    price: "30,00 €",
    washed: false,
    paid: false,
  },
];

const navItems = [
  { label: "Tableau de bord", active: true },
  { label: "Commandes", active: false },
  { label: "Clients", active: false },
  { label: "Statistiques", active: false },
  { label: "Paramètres", active: false },
];

export default function Dash() {
  const [activeNav, setActiveNav] = useState("Tableau de bord");
  const [search, setSearch] = useState("");
  const [allOrders, setAllOrders] = useState(orders);
  const [showForm, setShowForm] = useState(false);

  const handleAddClothing = (newOrder) => {
    setAllOrders([newOrder, ...allOrders]);
    setShowForm(false);
  };

  const filtered = allOrders.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-48 bg-white flex flex-col shadow-sm shrink-0">
        {/* Logo */}
        <div className="px-5 py-6">
          <div className="text-2xl font-black leading-none text-gray-900">
            PRESSING
          </div>
          <div className="text-lg font-bold text-emerald-500 leading-none">
            APP
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                activeNav === item.label
                  ? "bg-emerald-400 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div className="p-4">
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            Nouvelle Commande
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white px-6 py-3 flex items-center gap-4 shadow-sm shrink-0">
          {activeNav === "Tableau de bord" && (
            <>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Rechercher une commande..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                + Ajouter une commande
              </button>
            </>
          )}
          {activeNav === "Commandes" && (
            <h2 className="text-lg font-semibold text-gray-800 flex-1">Toutes les commandes</h2>
          )}
          {activeNav === "Clients" && (
            <h2 className="text-lg font-semibold text-gray-800 flex-1">Gestion des clients</h2>
          )}
          {activeNav === "Statistiques" && (
            <h2 className="text-lg font-semibold text-gray-800 flex-1">Statistiques</h2>
          )}
          {activeNav === "Paramètres" && (
            <h2 className="text-lg font-semibold text-gray-800 flex-1">Paramètres</h2>
          )}
          
          <div className="w-8 h-8 rounded-full bg-blue-700 text-white text-sm font-bold flex items-center justify-center">
            A
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeNav === "Tableau de bord" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <StatCard label="Commandes du jour" value="24" />
                <StatCard label="Lavage en attente" value="12" />
                <StatCard label="Impayés" value="4 250 €" />
              </div>

              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-800">
                    Commandes Récentes
                  </h2>
                  <button className="text-sm text-blue-600 hover:underline font-medium">
                    Voir tout
                  </button>
                </div>

                <div className="space-y-2">
                  {filtered.length === 0 ? (
                    <div className="text-center text-gray-400 py-10 text-sm">
                      Aucune commande trouvée.
                    </div>
                  ) : (
                    filtered.map((order) => (
                      <OrderRow key={order.id} order={order} />
                    ))
                  )}
                </div>
              </section>
            </div>
          )}
          {activeNav === "Commandes" && <Orders orders={allOrders} />}
          {activeNav === "Clients" && <Clients orders={allOrders} />}
          {activeNav === "Statistiques" && <Statistics orders={allOrders} />}
          {activeNav === "Paramètres" && <Settings />}
        </main>
      </div>

      {/* Add Clothing Form Modal */}
      {showForm && (
        <AddClothingForm
          onSubmit={handleAddClothing}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
      <div>
        <div className="text-xs text-gray-500 font-medium">{label}</div>
        <div className="text-2xl font-extrabold text-gray-800">{value}</div>
      </div>
    </div>
  );
}

function OrderRow({ order }) {
  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center gap-4">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800 truncate">
          {order.name}{" "}
          <span className="text-gray-400 font-normal text-xs">
            • #{order.id}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {order.item} • {order.price}
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2 shrink-0">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            order.washed
              ? "bg-emerald-100 text-emerald-600"
              : "bg-orange-100 text-orange-500"
          }`}
        >
          {order.washed ? "Lavé" : "Non Lavé"}
        </span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            order.paid
              ? "bg-emerald-100 text-emerald-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {order.paid ? "Payé" : "Non Payé"}
        </span>
      </div>


    </div>
  );
}