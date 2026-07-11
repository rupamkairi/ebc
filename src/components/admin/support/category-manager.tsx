"use client";

import { useState } from "react";
import { useSupportCategoriesQuery, useCreateSupportCategoryMutation, useUpdateSupportCategoryMutation, useDeleteSupportCategoryMutation } from "@/queries/supportQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Pencil, Plus, Save, Settings2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export function SupportCategoryManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  const { data: categories, isLoading } = useSupportCategoriesQuery();
  const createMutation = useCreateSupportCategoryMutation();
  const updateMutation = useUpdateSupportCategoryMutation();
  const deleteMutation = useDeleteSupportCategoryMutation();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    try {
      await createMutation.mutateAsync({ name, description });
      toast.success("Category created successfully");
      setName("");
      setDescription("");
      setIsOpen(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create category");
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editName.trim()) return;
    try {
      await updateMutation.mutateAsync({ id: editingId, name: editName.trim(), description: editDescription });
      toast.success("Category updated successfully");
      setEditingId(null);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update category");
    }
  };

  const handleDelete = async (id: string, categoryName: string) => {
    if (!window.confirm(`Delete “${categoryName}”?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Category deleted successfully");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Settings2 className="h-4 w-4" />
          Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Support Categories</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Add New Category</h4>
            <div className="space-y-2">
              <Input 
                placeholder="Category Name (e.g. Account & Profile)" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea 
                placeholder="Description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button 
              className="w-full gap-2" 
              onClick={handleCreate}
              disabled={createMutation.isPending || !name.trim()}
            >
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create Category
            </Button>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Existing Categories</h4>
            {isLoading ? (
              <div className="flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : categories?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center bg-muted/30 py-6 rounded-lg border border-dashed">No categories found.</p>
            ) : (
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                {categories?.map((cat) => (
                  <div key={cat.id} className="p-3 bg-muted/50 rounded-md border text-sm">
                    {editingId === cat.id ? (
                      <div className="space-y-2">
                        <Input value={editName} onChange={(event) => setEditName(event.target.value)} placeholder="Category name" />
                        <Textarea value={editDescription} onChange={(event) => setEditDescription(event.target.value)} placeholder="Description" />
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                            <X className="h-4 w-4" /> Cancel
                          </Button>
                          <Button size="sm" onClick={handleUpdate} disabled={!editName.trim() || updateMutation.isPending}>
                            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="font-semibold text-primary">{cat.name}</span>
                          {cat.description && <span className="text-xs text-muted-foreground">{cat.description}</span>}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button variant="ghost" size="icon" aria-label={`Edit ${cat.name}`} onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditDescription(cat.description || ""); }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label={`Delete ${cat.name}`} disabled={deleteMutation.isPending} onClick={() => handleDelete(cat.id, cat.name)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
