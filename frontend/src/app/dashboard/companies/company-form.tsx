"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyFormValues, COMPANY_SIZES, COMPANY_STATUSES, INDUSTRIES } from "./types";

interface CompanyFormProps {
  initialData?: Partial<CompanyFormValues>;
  onSubmit: (data: CompanyFormValues) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
  loading?: boolean;
}

export default function CompanyForm({
  initialData = {},
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false
}: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormValues>({
    name: initialData.name || '',
    industry: initialData.industry || '',
    size: initialData.size || '1-10',
    revenue: initialData.revenue || '',
    website: initialData.website || '',
    status: initialData.status || 'active',
    phone: initialData.phone || '',
    email: initialData.email || '',
    address: initialData.address || '',
    city: initialData.city || '',
    country: initialData.country || '',
    postal_code: initialData.postal_code || '',
    description: initialData.description || '',
    logo_url: initialData.logo_url || '',
    founded_year: initialData.founded_year || undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate required fields
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    // Email validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Website validation if provided
    if (formData.website && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.website.replace(/^https?:\/\//, ''))) {
      newErrors.website = 'Please enter a valid website (e.g., example.com)';
    }

    // Founded year validation if provided
    if (formData.founded_year && (formData.founded_year < 1800 || formData.founded_year > new Date().getFullYear())) {
      newErrors.founded_year = 'Please enter a valid year';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Clean the data before submitting
      const cleanData = { ...formData };
      if (!cleanData.founded_year) {
        delete cleanData.founded_year;
      }
      
      await onSubmit(cleanData);
    } catch (error) {
      console.error('Form submission error:', error);
      
      let errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      // Handle specific RLS errors with helpful guidance
      if (errorMessage.includes('Database security policy violation') || 
          errorMessage.includes('Row Level Security')) {
        errorMessage = `Database Permission Error: Unable to create company due to security settings. This typically means you need to configure database permissions. Please contact your administrator or run the RLS fix script (companies-rls-fix.sql).`;
      }
      
      setErrors({ general: errorMessage });
    }
  };

  const updateField = (field: keyof CompanyFormValues, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Company' : 'Add New Company'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {errors.general}
            </div>
          )}
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Company Name - Required */}
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Acme Corporation"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => updateField('industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Size */}
            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Select value={formData.size} onValueChange={(value) => updateField('size', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Revenue */}
            <div className="space-y-2">
              <Label htmlFor="revenue">Annual Revenue</Label>
              <Input
                id="revenue"
                value={formData.revenue}
                onChange={(e) => updateField('revenue', e.target.value)}
                placeholder="$1.2M"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="example.com"
                className={errors.website ? "border-red-500" : ""}
              />
              {errors.website && <p className="text-sm text-red-600">{errors.website}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1-555-0123"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contact@company.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Founded Year */}
            <div className="space-y-2">
              <Label htmlFor="founded_year">Founded Year</Label>
              <Input
                id="founded_year"
                type="number"
                value={formData.founded_year || ''}
                onChange={(e) => updateField('founded_year', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="2020"
                min="1800"
                max={new Date().getFullYear()}
                className={errors.founded_year ? "border-red-500" : ""}
              />
              {errors.founded_year && <p className="text-sm text-red-600">{errors.founded_year}</p>}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="New York"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => updateField('country', e.target.value)}
                placeholder="United States"
              />
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => updateField('postal_code', e.target.value)}
                placeholder="10001"
              />
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          {/* Logo URL - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              value={formData.logo_url}
              onChange={(e) => updateField('logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Description - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Brief description of the company..."
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update Company' : 'Add Company')}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}