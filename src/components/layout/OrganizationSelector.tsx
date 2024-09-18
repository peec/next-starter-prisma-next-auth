"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Organization } from "@prisma/client";
import AddOrganizationForm from "@/components/forms/add-organization-form/AddOrganizationForm";

export default function OrganizationSelector({
  organization,
  organizations,
}: {
  organization: Organization;
  organizations: Organization[];
}) {
  const router = useRouter();
  const [newOrgName, setNewOrgName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectOrg = (slug: string) => {
    router.push(`/dashboard/${slug}`);
  };

  const handleAddOrg = () => {
    if (newOrgName.trim()) {
    }
  };

  return (
    <div className="space-y-4 w-full max-w-[200px]">
      <Select value={organization.slug} onValueChange={handleSelectOrg}>
        <SelectTrigger>
          <SelectValue placeholder="Select organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.slug}>
              {org.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Organization
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Organization</DialogTitle>
          </DialogHeader>
          <AddOrganizationForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
