export default function Clients({ orders }) {
  const clients = Array.from(new Set(orders.map((o) => o.name))).map((name) => {
    const clientOrders = orders.filter((o) => o.name === name);
    const totalSpent = clientOrders.reduce((sum, o) => sum + parseFloat(o.price.replace(" €", "")), 0);
    const washed = clientOrders.filter((o) => o.washed).length;
    const paid = clientOrders.filter((o) => o.paid).length;

    return {
      name,
      totalOrders: clientOrders.length,
      totalSpent: totalSpent.toFixed(2),
      washed,
      paid,
    };
  });

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <p className="text-sm text-gray-500 mt-1">Total: {clients.length} clients</p>
      </div>

      <div className="space-y-2">
        {clients.map((client) => (
          <div key={client.name} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{client.name}</div>
                <div className="text-sm text-gray-500">{client.totalOrders} commande(s)</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Dépense</div>
                  <div className="font-semibold text-gray-800">{client.totalSpent}€</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Lavés</div>
                  <div className="font-semibold text-gray-800">{client.washed}/{client.totalOrders}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Payés</div>
                  <div className="font-semibold text-gray-800">{client.paid}/{client.totalOrders}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
