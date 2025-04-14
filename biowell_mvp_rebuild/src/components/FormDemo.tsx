import React, { useState } from 'react';
import { Form, FormField, FormSection } from './Form';
import Input from './Input';
import Button from './Button';
import { Mail, Lock, User, Phone } from 'lucide-react';

export default function FormDemo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success
    setSuccess('Form submitted successfully!');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Form
        title="Registration Form"
        subtitle="Please fill in your information to create an account"
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        success={success}
        actions={
          <>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Submit
            </Button>
          </>
        }
      >
        <FormSection title="Personal Information" description="Enter your basic details">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" required>
              <Input
                placeholder="John"
                leftIcon={<User className="w-4 h-4" />}
                required
              />
            </FormField>
            <FormField label="Last Name" required>
              <Input
                placeholder="Doe"
                leftIcon={<User className="w-4 h-4" />}
                required
              />
            </FormField>
          </div>

          <FormField label="Email" required>
            <Input
              type="email"
              placeholder="john@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
          </FormField>

          <FormField label="Phone Number" helper="Optional but recommended">
            <Input
              type="tel"
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </FormField>
        </FormSection>

        <FormSection title="Security" description="Set up your account security">
          <FormField label="Password" required>
            <Input
              type="password"
              placeholder="Enter your password"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
          </FormField>

          <FormField label="Confirm Password" required>
            <Input
              type="password"
              placeholder="Confirm your password"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
          </FormField>
        </FormSection>
      </Form>
    </div>
  );
}