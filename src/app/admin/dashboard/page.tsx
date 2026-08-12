import { ShipmentTable } from "@/components/admin/ShipmentTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipment Deals</h2>
          <p className="text-sm text-gray-500">Manage all shipments, view profit margins, and update statuses.</p>
        </div>
      </div>
      
      <ShipmentTable />
    </div>
  );
}
