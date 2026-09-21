import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle, Package, Phone, Sparkles, User } from 'lucide-react';
import { TicketFormData, TicketFormErrors } from '../types/ticket';

interface TicketFormProps {
  onSubmit: (formData: TicketFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TicketForm({ onSubmit, onCancel, isSubmitting = false }: TicketFormProps) {
  const [formData, setFormData] = useState<TicketFormData>({
    customerName: '',
    orderNumber: '',
    phoneNumber: '',
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState<TicketFormErrors>({});
  const [touched, setTouched] = useState<Record<keyof TicketFormData, boolean>>({
    customerName: false,
    orderNumber: false,
    phoneNumber: false,
    title: false,
    description: false,
  });

  const validateField = (field: keyof TicketFormData, value: string): string | undefined => {
    const trimmed = value.trim();
    switch (field) {
      case 'customerName':
        if (!trimmed) return 'Customer name is required';
        if (trimmed.length < 2) return 'Customer name must be at least 2 characters';
        return undefined;
      case 'orderNumber':
        if (!trimmed) return 'Order number is required';
        if (trimmed.length < 3) return 'Please enter a valid order number (e.g. ORD-1029)';
        return undefined;
      case 'phoneNumber':
        if (!trimmed) return 'Phone number is required';
        if (trimmed.replace(/[^0-9+]/g, '').length < 7) {
          return 'Please provide a valid contact phone number';
        }
        return undefined;
      case 'title':
        if (!trimmed) return 'Ticket title is required';
        if (trimmed.length < 4) return 'Title should be at least 4 characters';
        return undefined;
      case 'description':
        if (!trimmed) return 'Issue description is required';
        if (trimmed.length < 10) {
          return 'Please provide more details (at least 10 characters)';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof TicketFormData;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    if (touched[fieldName]) {
      const errorMsg = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof TicketFormData;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const errorMsg = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched: Record<keyof TicketFormData, boolean> = {
      customerName: true,
      orderNumber: true,
      phoneNumber: true,
      title: true,
      description: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const newErrors: TicketFormErrors = {};
    let hasErrors = false;

    (Object.keys(formData) as (keyof TicketFormData)[]).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  // Helper to fill sample data for quick test
  const handleFillQuickDemo = () => {
    setFormData({
      customerName: 'Maya Lin',
      orderNumber: 'ORD-72091',
      phoneNumber: '+1 (555) 349-8812',
      title: 'Wrong color variant received in delivery',
      description:
        'Customer ordered the Midnight Navy colorway, but package arrived with Arctic White. Customer requested a prepaid return label and priority replacement.',
    });
    setErrors({});
  };

  return (
    <form id="create-ticket-form" onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Quick Demo Pre-fill helper banner */}
      <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-600">
        <span>Need sample details to test quickly?</span>
        <button
          type="button"
          id="btn-fill-demo-data"
          onClick={handleFillQuickDemo}
          className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Auto-fill sample data
        </button>
      </div>

      {/* Customer Identification Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-semibold text-slate-900">Customer Identification</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Contact information of the customer requesting assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Customer Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="customerName"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Customer Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <input
                id="customerName"
                name="customerName"
                type="text"
                value={formData.customerName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Sarah Jenkins"
                className={`block w-full rounded-lg border pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                  errors.customerName
                    ? 'border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
                }`}
                aria-invalid={!!errors.customerName}
                aria-describedby={errors.customerName ? 'customerName-error' : undefined}
                required
              />
            </div>
            {errors.customerName && (
              <p id="customerName-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.customerName}</span>
              </p>
            )}
          </div>

          {/* Order Number */}
          <div>
            <label
              htmlFor="orderNumber"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Order Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Package className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <input
                id="orderNumber"
                name="orderNumber"
                type="text"
                value={formData.orderNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. ORD-45892"
                className={`block w-full rounded-lg border pl-9 pr-3 py-2 text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                  errors.orderNumber
                    ? 'border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
                }`}
                aria-invalid={!!errors.orderNumber}
                aria-describedby={errors.orderNumber ? 'orderNumber-error' : undefined}
                required
              />
            </div>
            {errors.orderNumber && (
              <p id="orderNumber-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.orderNumber}</span>
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. +1 (555) 019-2834"
                className={`block w-full rounded-lg border pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                  errors.phoneNumber
                    ? 'border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
                }`}
                aria-invalid={!!errors.phoneNumber}
                aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
                required
              />
            </div>
            {errors.phoneNumber && (
              <p id="phoneNumber-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.phoneNumber}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Information Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-semibold text-slate-900">Ticket Information</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Summarize the issue clearly so agents can review and resolve quickly.
          </p>
        </div>

        {/* Short Title */}
        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Short Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Package damaged during shipping"
            className={`block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
              errors.title
                ? 'border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
            }`}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
            required
          />
          {errors.title && (
            <p id="title-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Issue Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe the customer's issue in detail, including key context, tracking status, or requested resolution..."
            className={`block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition resize-y ${
              errors.description
                ? 'border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
            }`}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
            required
          />
          {errors.description && (
            <p id="description-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          id="btn-cancel-ticket-creation"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 transition cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="btn-submit-ticket"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 transition cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Creating Ticket...</span>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" aria-hidden="true" />
              <span>Create Ticket</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
