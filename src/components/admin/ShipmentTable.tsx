"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X, MessageCircle } from "lucide-react";

type Shipment = {
  id: string;
  ownerName: string;
  ownerPhone: string;
  vehicleNo: string;
  driverPhone: string;
  pickupLocation: string;
  dropLocation: string;
  offeredAmount: number;
  shipperQuote: number;
  status: string;
  botState?: string | null;
  createdAt: string;
};

const STATUS_OPTIONS = ["OFFER_SENT", "ACCEPTED", "IN_TRANSIT", "COMPLETED", "CANCELLED"];

export function ShipmentTable() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [botLoading, setBotLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [formData, setFormData] = useState<Partial<Shipment>>({});

  const [clients, setClients] = useState<any[]>([]);

  async function fetchShipments() {
    try {
      const res = await fetch("/api/shipments");
      const data = await res.json();
      setShipments(data);
    } catch (err) {
      console.error("Failed to fetch shipments", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchClients() {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  }

  useEffect(() => {
    fetchShipments();
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return;
    try {
      await fetch(`/api/shipments/${id}`, { method: "DELETE" });
      setShipments(shipments.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleTriggerBot = async (id: string) => {
    setBotLoading(id);
    try {
      const res = await fetch(`/api/shipments/${id}/whatsapp`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json();
        setShipments(shipments.map(s => s.id === updated.id ? updated : s));
        alert("WhatsApp message sent successfully via Bot!");
      } else {
        alert("Failed to send WhatsApp message.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending message.");
    } finally {
      setBotLoading(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let savedShipment = null;
      if (editingShipment) {
        // Update
        const res = await fetch(`/api/shipments/${editingShipment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updated = await res.json();
        setShipments(shipments.map(s => s.id === updated.id ? updated : s));
        savedShipment = updated;
      } else {
        // Create
        // ensure required fields are present if not filled yet (they will be filled via bot)
        const payload = {
          ...formData,
          vehicleNo: formData.vehicleNo || "TBD",
          driverPhone: formData.driverPhone || "TBD"
        };
        const res = await fetch("/api/shipments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setShipments([created, ...shipments]);
        savedShipment = created;
      }
      
      setIsModalOpen(false);
      
      // If we just created it and it's a new offer, ask to send whatsapp
      if (!editingShipment && confirm("Offer created! Do you want to send the WhatsApp message now?")) {
         handleTriggerBot(savedShipment.id);
      }
      
    } catch (err) {
      console.error("Failed to save", err);
    }
  };

  const openModal = (shipment: Shipment | null = null) => {
    if (shipment) {
      setEditingShipment(shipment);
      setFormData(shipment);
    } else {
      setEditingShipment(null);
      setFormData({ status: "OFFER_SENT", offeredAmount: 0, shipperQuote: 0 });
    }
    setIsModalOpen(true);
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = 
      s.vehicleNo.toLowerCase().includes(search.toLowerCase()) || 
      s.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? s.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Vehicle or Name..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt.replace("_", " ")}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => openModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Shipment
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Owner & Vehicle</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3 text-right">Quote</th>
              <th className="px-4 py-3 text-right">Offered</th>
              <th className="px-4 py-3 text-right">Margin</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">Loading shipments...</td>
              </tr>
            ) : filteredShipments.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">No shipments found.</td>
              </tr>
            ) : (
              filteredShipments.map((s) => {
                const margin = s.shipperQuote - s.offeredAmount;
                const marginColor = margin > 0 ? "text-green-600" : margin < 0 ? "text-red-600" : "text-gray-500";
                
                let statusColor = "bg-gray-100 text-gray-700";
                if (s.status === "ACCEPTED") statusColor = "bg-blue-100 text-blue-700";
                if (s.status === "IN_TRANSIT") statusColor = "bg-yellow-100 text-yellow-700";
                if (s.status === "COMPLETED") statusColor = "bg-green-100 text-green-700";
                if (s.status === "CANCELLED") statusColor = "bg-red-100 text-red-700";

                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs" title={s.id}>{s.id.substring(0, 8)}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{s.ownerName}</div>
                      <div className="text-xs text-gray-500">{s.vehicleNo}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{s.pickupLocation}</div>
                      <div className="text-xs text-gray-400">to {s.dropLocation}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">₹{s.shipperQuote.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-500">₹{s.offeredAmount.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-right font-bold ${marginColor}`}>
                      ₹{margin.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                        {s.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openModal(s)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {s.botState ? (
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded uppercase font-bold" title={s.botState}>
                            Bot Active
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleTriggerBot(s.id)}
                            disabled={botLoading === s.id}
                            className={`p-1.5 rounded-md transition-colors ${botLoading === s.id ? "text-gray-400" : "text-green-500 hover:text-green-700 hover:bg-green-50"}`}
                            title="Start WhatsApp Bot Flow"
                          >
                            <MessageCircle className={`h-4 w-4 ${botLoading === s.id ? "animate-pulse" : ""}`} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">{editingShipment ? "Edit Shipment" : "Create New WhatsApp Offer"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Select Client (Owner)</label>
                  <select 
                    required 
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
                    value={clients.find(c => c.phone === formData.ownerPhone)?.id || ""}
                    onChange={e => {
                      const selected = clients.find(c => c.id === e.target.value);
                      if (selected) {
                        setFormData({
                          ...formData, 
                          ownerName: selected.name, 
                          ownerPhone: selected.phone,
                          vehicleNo: selected.truckNumber || ""
                        });
                      }
                    }}
                  >
                    <option value="" disabled>-- Select a Client --</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} ({client.phone})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Fallbacks in case client isn't fully set up or we want to override manually */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Owner Name</label>
                  <input required type="text" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-gray-50" 
                    value={formData.ownerName || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Owner Phone (WhatsApp)</label>
                  <input required type="text" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-gray-50" 
                    value={formData.ownerPhone || ""} readOnly />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Vehicle Number (Optional)</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
                    value={formData.vehicleNo || ""} onChange={e => setFormData({...formData, vehicleNo: e.target.value})} 
                    placeholder="TBD (Bot will ask)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Driver Phone (Optional)</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
                    value={formData.driverPhone || ""} onChange={e => setFormData({...formData, driverPhone: e.target.value})} 
                    placeholder="TBD (Bot will ask)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Pickup Location</label>
                  <input required type="text" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
                    value={formData.pickupLocation || ""} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Drop Location</label>
                  <input required type="text" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
                    value={formData.dropLocation || ""} onChange={e => setFormData({...formData, dropLocation: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Offered Amount (₹)</label>
                  <input required type="number" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
                    value={formData.offeredAmount || ""} onChange={e => setFormData({...formData, offeredAmount: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Shipper Quote (₹)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
                    value={formData.shipperQuote || ""} onChange={e => setFormData({...formData, shipperQuote: Number(e.target.value)})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.status || "OFFER_SENT"} onChange={e => setFormData({...formData, status: e.target.value})}>
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  {editingShipment ? "Update Shipment" : "Create Shipment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
