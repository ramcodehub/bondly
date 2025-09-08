'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  Plus,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useLeadNurturingStore } from '@/lib/store/lead-nurturing-store';
import { LeadNurturingAction } from '../types';

interface NurturingTabProps {
  leadId: string;
}

export function NurturingTab({ leadId }: NurturingTabProps) {
  const {
    nurturingActions,
    loading,
    error,
    fetchNurturingActions,
    addNurturingAction,
    updateNurturingAction
  } = useLeadNurturingStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newAction, setNewAction] = useState({
    action_type: 'email',
    notes: '',
    status: 'pending'
  });
  const [editAction, setEditAction] = useState<Partial<LeadNurturingAction> | null>(null);

  useEffect(() => {
    if (leadId) {
      fetchNurturingActions(leadId);
    }
  }, [leadId, fetchNurturingActions]);

  const handleAddAction = async () => {
    if (!newAction.action_type || !newAction.notes) return;
    
    await addNurturingAction(leadId, {
      ...newAction,
      action_date: new Date().toISOString()
    });
    setNewAction({
      action_type: 'email',
      notes: '',
      status: 'pending'
    });
    setIsAdding(false);
  };

  const handleEditAction = (action: LeadNurturingAction) => {
    setEditingId(action.id);
    setEditAction({
      action_type: action.action_type,
      notes: action.notes,
      status: action.status
    });
  };

  const handleSaveEdit = async () => {
    if (editingId && editAction) {
      await updateNurturingAction(editingId, editAction);
      setEditingId(null);
      setEditAction(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAction(null);
  };

  const actions = nurturingActions[leadId] || [];

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'follow-up': return <Clock className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lead Nurturing</CardTitle>
          <CardDescription>
            Track all interactions and activities with this lead
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Nurturing Timeline</h3>
            <Button onClick={() => setIsAdding(!isAdding)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </div>

          {isAdding && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Action Type</Label>
                    <Select 
                      value={newAction.action_type} 
                      onValueChange={(value) => setNewAction({...newAction, action_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="note">Note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={newAction.status} 
                      onValueChange={(value) => setNewAction({...newAction, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{format(new Date(), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Add details about this interaction..."
                    value={newAction.notes}
                    onChange={(e) => setNewAction({...newAction, notes: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAction} disabled={!newAction.notes.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {loading[leadId] ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error[leadId] ? (
            <div className="text-center py-8 text-destructive">
              Error loading nurturing actions: {error[leadId]}
            </div>
          ) : actions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No nurturing actions yet</p>
              <p className="text-sm mt-2">Add your first interaction with this lead</p>
            </div>
          ) : (
            <div className="space-y-4">
              {actions.map((action) => (
                <Card key={action.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {editingId === action.id && editAction ? (
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Action Type</Label>
                            <Select 
                              value={editAction.action_type || action.action_type} 
                              onValueChange={(value) => setEditAction({...editAction, action_type: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select action type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="call">Call</SelectItem>
                                <SelectItem value="follow-up">Follow-up</SelectItem>
                                <SelectItem value="meeting">Meeting</SelectItem>
                                <SelectItem value="note">Note</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select 
                              value={editAction.status || action.status} 
                              onValueChange={(value) => setEditAction({...editAction, status: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {format(new Date(action.action_date), 'MMM d, yyyy h:mm a')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea
                            placeholder="Add details about this interaction..."
                            value={editAction.notes || action.notes || ''}
                            onChange={(e) => setEditAction({...editAction, notes: e.target.value})}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleSaveEdit}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 rounded-full bg-primary/10">
                              {getActionIcon(action.action_type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium capitalize">{action.action_type}</h4>
                                {getStatusBadge(action.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {format(new Date(action.action_date), 'MMM d, yyyy h:mm a')}
                              </p>
                              {action.notes && (
                                <p className="mt-2 text-sm">{action.notes}</p>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditAction(action)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}