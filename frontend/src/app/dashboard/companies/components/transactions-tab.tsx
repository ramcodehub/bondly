"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowUpCircle, ArrowDownCircle, Repeat2 } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  company_id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

interface TransactionsTabProps {
  companyId: string;
}

export function TransactionsTab({ companyId }: TransactionsTabProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    type: "",
    description: ""
  });

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/extended/accounts/${companyId}/transactions`);
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchTransactions();
    }
  }, [companyId]);

  const handleCreateTransaction = async () => {
    try {
      const response = await fetch(`/api/extended/accounts/${companyId}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(newTransaction.amount),
          type: newTransaction.type,
          description: newTransaction.description
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsDialogOpen(false);
        setNewTransaction({ amount: "", type: "", description: "" });
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "invoice":
        return <ArrowUpCircle className="h-4 w-4" />;
      case "payment":
        return <ArrowDownCircle className="h-4 w-4" />;
      case "refund":
        return <Repeat2 className="h-4 w-4" />;
      default:
        return <ArrowUpCircle className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "invoice":
        return "bg-red-100 text-red-800";
      case "payment":
        return "bg-green-100 text-green-800";
      case "refund":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Transactions</h3>
          <p className="text-sm text-muted-foreground">
            Track all financial transactions for this company
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={newTransaction.type} 
                  onValueChange={(value) => setNewTransaction({...newTransaction, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  placeholder="Enter transaction details..."
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCreateTransaction}>Save Transaction</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <ArrowUpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first transaction for this company
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${getTransactionColor(transaction.type)}`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <CardTitle className="text-base capitalize">
                        {transaction.type}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(transaction.created_at), "MMM d, yyyy")}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      transaction.type === 'payment' ? 'text-green-600' : 
                      transaction.type === 'refund' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'payment' ? '+' : ''}{formatCurrency(transaction.amount)}
                    </div>
                    <Badge className={getTransactionColor(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {transaction.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}