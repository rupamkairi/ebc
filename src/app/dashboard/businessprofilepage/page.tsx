import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function BusinessProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Business Profile</h1>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Business Info */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Business Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Business Name</Label>
                <Input placeholder="Enter business name" />
              </div>
              <div>
                <Label>Business Category</Label>
                <Input placeholder="Eg: Cement Supplier" />
              </div>
              <div>
                <Label>Owner Name</Label>
                <Input placeholder="Enter owner name" />
              </div>
              <div>
                <Label>GST Number</Label>
                <Input placeholder="Enter GST Number" />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Contact Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone Number</Label>
                <Input placeholder="Enter phone number" />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input placeholder="Enter email address" />
              </div>
              <div className="col-span-2">
                <Label>Business Address</Label>
                <textarea placeholder="Full shop / office address" />
              </div>
            </div>
          </div>

          {/* Uploads */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Documents & Media</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Business Logo</Label>
                <Input type="file" />
              </div>
              <div>
                <Label>Shop/Office Photo</Label>
                <Input type="file" />
              </div>
            </div>
          </div>

          <Button className="w-full py-3 text-lg">Save Business Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
