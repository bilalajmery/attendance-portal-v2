import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { addEmployee } from "../../../lib/firestore";
import { toast } from "sonner";
import { useSettings } from "../../../context/SettingsContext";
import { getAllEmployees } from "../../../lib/firestore";

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { currencySymbol } = useSettings();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    empId: "",
    designation: "",
    monthlySalary: "",
    cnic: "",
    address: "",
  });

  // Auto-generate Employee ID
  useEffect(() => {
    if (open && !formData.empId) {
      generateEmployeeId();
    }
  }, [open]);

  const generateEmployeeId = async () => {
    try {
      const employees = await getAllEmployees();
      const empNumbers = employees
        .map((emp) => {
          const match = emp.empId.match(/EMP(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter((num) => !isNaN(num));

      const nextNumber =
        empNumbers.length > 0 ? Math.max(...empNumbers) + 1 : 1;
      const newEmpId = `EMP${String(nextNumber).padStart(3, "0")}`;
      setFormData((prev) => ({ ...prev, empId: newEmpId }));
    } catch (error) {
      console.error("Error generating employee ID:", error);
      setFormData((prev) => ({ ...prev, empId: "EMP001" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validation
    if (
      !formData.email ||
      !formData.name ||
      !formData.empId ||
      !formData.designation ||
      !formData.monthlySalary
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const salary = parseFloat(formData.monthlySalary);
    if (isNaN(salary) || salary <= 0) {
      toast.error("Please enter a valid monthly salary");
      return;
    }

    try {
      setLoading(true);

      // Generate a UID from email (in production, this would be the Firebase Auth UID)
      const uid = formData.email.replace(/[^a-zA-Z0-9]/g, "_");

      await addEmployee(
        uid,
        formData.email,
        formData.name,
        formData.empId,
        salary,
        user.uid,
        formData.designation,
        formData.cnic || undefined,
        formData.address || undefined
      );

      toast.success("Employee added successfully");

      // Reset form
      setFormData({
        email: "",
        name: "",
        empId: "",
        designation: "",
        monthlySalary: "",
        cnic: "",
        address: "",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error adding employee:", error);
      toast.error(error.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      name: "",
      empId: "",
      designation: "",
      monthlySalary: "",
      cnic: "",
      address: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full dark:bg-slate-800 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            Add New Employee
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4 mt-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b dark:border-slate-700 pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-white">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value.toLowerCase(),
                    })
                  }
                  placeholder="employee@example.com"
                  className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-white">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empId" className="dark:text-white">
                  Employee ID *
                  <span className="text-xs text-muted-foreground dark:text-slate-400 ml-2">
                    (Auto-generated)
                  </span>
                </Label>
                <Input
                  id="empId"
                  value={formData.empId}
                  onChange={(e) =>
                    setFormData({ ...formData, empId: e.target.value })
                  }
                  placeholder="EMP001"
                  className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation" className="dark:text-white">
                  Designation *
                </Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  placeholder="Software Engineer"
                  className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b dark:border-slate-700 pb-2">
              Salary Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="salary" className="dark:text-white">
                Monthly Salary ({currencySymbol}) *
              </Label>
              <Input
                id="salary"
                type="number"
                value={formData.monthlySalary}
                onChange={(e) =>
                  setFormData({ ...formData, monthlySalary: e.target.value })
                }
                placeholder="50000"
                min="0"
                step="1"
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Optional Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b dark:border-slate-700 pb-2">
              Additional Information (Optional)
            </h3>

            <div className="space-y-2">
              <Label htmlFor="cnic" className="dark:text-white">
                CNIC / ID Number
              </Label>
              <Input
                id="cnic"
                value={formData.cnic}
                onChange={(e) =>
                  setFormData({ ...formData, cnic: e.target.value })
                }
                placeholder="12345-1234567-1"
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="dark:text-white">
                Address
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter complete address..."
                className="resize-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
