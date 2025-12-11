import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LeadsInquiriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Leads & Inquiries</h1>

      {/* Tabs */}
      <div className="flex space-x-3 mb-4">
        <Button className="px-6 py-2">Product Quotations</Button>
        <Button variant="outline" className="px-6 py-2">
          Service Appointments
        </Button>
      </div>

      {/* Product Quotations Table */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Product Quotations</h2>

          <table className="w-full border rounded-lg overflow-hidden text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Inquiry ID</th>
                <th className="p-3">Buyer Pincode</th>
                <th className="p-3">Product</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Validity</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">#Q1025</td>
                <td className="p-3">7****</td>
                <td className="p-3">Cement</td>
                <td className="p-3">50 Bags</td>
                <td className="p-3">2 Hours Left</td>
                <td className="p-3 text-yellow-600">Pending</td>
                <td className="p-3 space-x-2">
                  <Button size="sm">View</Button>
                  <Button size="sm">Send Quote</Button>
                  <Button size="sm" variant="outline">
                    Reject
                  </Button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3">#Q1098</td>
                <td className="p-3">6****</td>
                <td className="p-3">Steel Rod</td>
                <td className="p-3">120 pcs</td>
                <td className="p-3">6 Hours Left</td>
                <td className="p-3 text-green-600">Active</td>
                <td className="p-3 space-x-2">
                  <Button size="sm">View</Button>
                  <Button size="sm">Modify</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
