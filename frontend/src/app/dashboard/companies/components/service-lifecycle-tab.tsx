"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Play, Users, Heart, Star } from "lucide-react";
import { format } from "date-fns";

interface ServiceStage {
  id: string;
  company_id: string;
  stage: string;
  details: string;
  created_at: string;
  updated_at: string;
}

interface ServiceLifecycleTabProps {
  companyId: string;
}

const stages = [
  { id: "onboarding", name: "Onboarding", icon: Play, description: "Initial setup and introduction" },
  { id: "engagement", name: "Engagement", icon: Users, description: "Active usage and participation" },
  { id: "retention", name: "Retention", icon: Heart, description: "Long-term commitment and loyalty" },
  { id: "advocacy", name: "Advocacy", icon: Star, description: "Promotion and referral activities" }
];

export function ServiceLifecycleTab({ companyId }: ServiceLifecycleTabProps) {
  const [serviceStages, setServiceStages] = useState<ServiceStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<ServiceStage | null>(null);
  const [editDetails, setEditDetails] = useState("");

  // Fetch service lifecycle data
  const fetchServiceLifecycle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/extended/service/${companyId}`);
      const data = await response.json();
      
      if (data.success) {
        setServiceStages(data.data);
      }
    } catch (error) {
      console.error("Error fetching service lifecycle:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchServiceLifecycle();
    }
  }, [companyId]);

  const handleUpdateStage = async (stageId: string) => {
    try {
      const response = await fetch(`/api/extended/service/${companyId}/${stageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ details: editDetails }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsDialogOpen(false);
        setEditingStage(null);
        setEditDetails("");
        fetchServiceLifecycle();
      }
    } catch (error) {
      console.error("Error updating stage:", error);
    }
  };

  const getCurrentStageIndex = () => {
    if (serviceStages.length === 0) return -1;
    
    const currentStage = serviceStages.reduce((latest, stage) => {
      if (!latest) return stage;
      return new Date(stage.created_at) > new Date(latest.created_at) ? stage : latest;
    }, serviceStages[0]);
    
    return stages.findIndex(s => s.id === currentStage.stage);
  };

  const getStageStatus = (stageId: string) => {
    const stage = serviceStages.find(s => s.stage === stageId);
    return stage ? "completed" : "pending";
  };

  const handleEditStage = (stageId: string) => {
    const stage = serviceStages.find(s => s.stage === stageId);
    if (stage) {
      setEditingStage(stage);
      setEditDetails(stage.details || "");
      setIsDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const currentStageIndex = getCurrentStageIndex();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Service Lifecycle</h3>
        <p className="text-sm text-muted-foreground">
          Track the customer journey through different service stages
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Journey Progress</CardTitle>
          <CardDescription>
            Current stage: {currentStageIndex >= 0 ? stages[currentStageIndex].name : "Not started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 transform -translate-y-1/2">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${currentStageIndex >= 0 ? (currentStageIndex / (stages.length - 1)) * 100 : 0}%` }}
              ></div>
            </div>
            
            {stages.map((stage, index) => {
              const status = getStageStatus(stage.id);
              const isCompleted = index <= currentStageIndex;
              const Icon = stage.icon;
              
              return (
                <div key={stage.id} className="flex flex-col items-center">
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    isCompleted 
                      ? "bg-blue-500 border-blue-500 text-white" 
                      : "bg-white border-gray-300 text-gray-400"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${
                      isCompleted ? "text-blue-600" : "text-gray-500"
                    }`}>
                      {stage.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stage.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stages.map((stage) => {
          const stageData = serviceStages.find(s => s.stage === stage.id);
          const Icon = stage.icon;
          
          return (
            <Card key={stage.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${
                      stageData 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{stage.name}</CardTitle>
                      <CardDescription>{stage.description}</CardDescription>
                    </div>
                  </div>
                  {stageData && (
                    <Badge variant="secondary">
                      {format(new Date(stageData.created_at), "MMM d, yyyy")}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {stageData ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-muted-foreground">
                        {stageData.details || "No details provided"}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditStage(stage.id)}
                      >
                        Edit Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-muted-foreground">Stage not reached</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled
                    >
                      Add Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingStage(null);
          setEditDetails("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStage ? `Edit ${stages.find(s => s.id === editingStage.stage)?.name} Details` : "Add Stage Details"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                value={editDetails}
                onChange={(e) => setEditDetails(e.target.value)}
                placeholder="Enter details about this stage..."
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={() => editingStage && handleUpdateStage(editingStage.stage)}
                disabled={!editDetails.trim()}
              >
                Save Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}