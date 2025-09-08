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
import { Plus, Calendar, Phone, Mail, MessageSquare, User } from "lucide-react";
import { format } from "date-fns";

interface Interaction {
  id: string;
  contact_id: number;
  type: string;
  description: string;
  created_at: string;
  created_by: string;
}

interface InteractionsTabProps {
  contactId: string;
}

export function InteractionsTab({ contactId }: InteractionsTabProps) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    type: "",
    description: ""
  });

  // Fetch interactions
  const fetchInteractions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/extended/contacts/${contactId}/interactions`);
      const data = await response.json();
      
      if (data.success) {
        setInteractions(data.data);
      }
    } catch (error) {
      console.error("Error fetching interactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contactId) {
      fetchInteractions();
    }
  }, [contactId]);

  const handleCreateInteraction = async () => {
    try {
      const response = await fetch(`/api/extended/contacts/${contactId}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInteraction),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsDialogOpen(false);
        setNewInteraction({ type: "", description: "" });
        fetchInteractions();
      }
    } catch (error) {
      console.error("Error creating interaction:", error);
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "call":
        return <Phone className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "meeting":
        return <User className="h-4 w-4" />;
      case "note":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "call":
        return "bg-blue-100 text-blue-800";
      case "email":
        return "bg-green-100 text-green-800";
      case "meeting":
        return "bg-purple-100 text-purple-800";
      case "note":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          <h3 className="text-lg font-medium">Interactions</h3>
          <p className="text-sm text-muted-foreground">
            Track all interactions with this contact
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Interaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Interaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={newInteraction.type} 
                  onValueChange={(value) => setNewInteraction({...newInteraction, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newInteraction.description}
                  onChange={(e) => setNewInteraction({...newInteraction, description: e.target.value})}
                  placeholder="Enter interaction details..."
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCreateInteraction}>Save Interaction</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {interactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No interactions yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first interaction with this contact
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Interaction
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {interactions.map((interaction) => (
            <Card key={interaction.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${getInteractionColor(interaction.type)}`}>
                      {getInteractionIcon(interaction.type)}
                    </div>
                    <div>
                      <CardTitle className="text-base capitalize">
                        {interaction.type}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(interaction.created_at), "MMM d, yyyy h:mm a")}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getInteractionColor(interaction.type)}>
                    {interaction.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {interaction.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}