import { useState, ChangeEvent } from "react";
import { Card } from "@/components/shadcn/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/shadcn/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/shadcn/select";
import { Loader } from "lucide-react";
// Import your data-fetching hook for payments
import { useFetchAllPayments } from "@/api/paymentApi";
import { Payment } from "@/interfaces/IPayments";

type PaymentModeFilter = "all" | "DIRECT" | "KHALTI";

const PaymentTable: React.FC = () => {
  const [modeFilter, setModeFilter] = useState<PaymentModeFilter>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: payments = [], isLoading, error } = useFetchAllPayments();

  // Filter payments based on payment mode and search by payment id (pidx)
  const filteredPayments = payments.filter((payment: Payment) => {
    const matchesMode =
      modeFilter === "all" || payment.modeOfPayment === modeFilter;
    const paymentId = payment.pidx || "";
    const matchesSearch = paymentId
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesMode && matchesSearch;
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading payments. Please try again.</p>
      </div>
    );
  }

  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="flex items-center gap-4">
          <Select
            value={modeFilter}
            onValueChange={(value) => setModeFilter(value as PaymentModeFilter)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Payment Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="DIRECT">
                DIRECT
              </SelectItem>
              <SelectItem value="KHALTI">
                
                <span className="flex items-center gap-1">
                  <img
                    src="/public/marquee_Images/khalti.png" 
                    alt="Khalti"
                    className="size-4 rounded-full overflow-hidden"
                  />
                  KHALTI
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by Payment ID"
            className="border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Read-Only Table */}
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center font-bold">SN</TableHead>
            <TableHead className="font-bold">Payment ID</TableHead>
            <TableHead className="font-bold">User ID</TableHead>
            <TableHead className="font-bold">Mode of Payment</TableHead>
            <TableHead className="font-bold">Screening ID</TableHead>
            <TableHead className="font-bold">Amount</TableHead>
            <TableHead className="font-bold">Refund State</TableHead>
            <TableHead className="font-bold">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments.map((payment: Payment, index: number) => (
            <TableRow key={payment._id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{payment.pidx || "N/A"}</TableCell>
              <TableCell>{payment.userId}</TableCell>
              <TableCell>
                {payment.modeOfPayment === "KHALTI" ? (
                  <span className="flex items-center gap-1">
                    <img
                      src="/public/marquee_Images/khalti.png" 
                      alt="Khalti Icon"
                      className="size-5 rounded-full overflow-hidden"
                    />
                    KHALTI
                  </span>
                ) : (
                  "DIRECT"
                )}
              </TableCell>
              <TableCell>{payment.screeningId}</TableCell>
              <TableCell>{payment.amount.toFixed(2)}</TableCell>
              <TableCell>{payment.refundState}</TableCell>
              <TableCell>
                {new Date(payment.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default PaymentTable;
