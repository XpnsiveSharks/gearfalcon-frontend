import React, { useState } from 'react';
import PasswordStrengthIndicator from './PasswordStrenghtIndicator';
import { usePasswordForm, useAdminPasswordValidation, useCustomerPasswordValidation } from '../hooks/usePasswordValidation';
import { User, Mail, Phone, Shield, AlertCircle, CheckCircle } from 'lucide-react';

// Type definitions
interface BaseFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface CustomerFormData extends BaseFormData {
  firstName: string;
  lastName: string;
  phone: string;
}

interface AdminFormData extends BaseFormData {
  username: string;
  role: 'technician' | 'supervisor' | 'manager' | 'admin';
}

interface SubmitMessage {
  type: 'success' | 'error';
  text: string;
}

// Customer Registration Form
const CustomerRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);

  // Use the customer-specific password validation hook
  const passwordValidation = useCustomerPasswordValidation(formData.password, formData.confirmPassword);

  const handleInputChange = <K extends keyof CustomerFormData>(
    field: K, 
    value: CustomerFormData[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!passwordValidation.canSubmit) {
      setSubmitMessage({ type: 'error', text: 'Please fix password errors before submitting.' });
      return;
    }

    // Basic form validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const submissionData = {
        ...formData,
        ...passwordValidation.getSubmissionData(),
        accountType: 'customer' as const
      };
      
      console.log('Customer Registration Data:', submissionData);
      setSubmitMessage({ 
        type: 'success', 
        text: 'Account created successfully! Please check your email for verification.' 
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitMessage({ type: 'error', text: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Customer Account</h2>
        <p className="text-gray-600">Join GEARFALCON for easy booking and service tracking</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter first name"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0939-XXX-XXXX"
              autoComplete="tel"
            />
          </div>
        </div>

        {/* Password with Strength Indicator */}
        <PasswordStrengthIndicator
          password={formData.password}
          onPasswordChange={(value) => handleInputChange('password', value)}
          label="Password"
          placeholder="Create a secure password"
          required
          showGenerator={true}
          showRequirements={true}
          userType="customer"
          autoComplete="new-password"
        />

        {/* Password Confirmation */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              passwordValidation.confirmation.hasError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
          {/* Confirmation feedback */}
          {formData.confirmPassword && passwordValidation.confirmation.message && (
            <div className={`mt-1 text-sm flex items-center ${
              passwordValidation.confirmation.isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {passwordValidation.confirmation.isValid ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-1" />
              )}
              {passwordValidation.confirmation.message}
            </div>
          )}
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`p-3 rounded-md flex items-center ${
            submitMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {submitMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            )}
            {submitMessage.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !passwordValidation.canSubmit}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isSubmitting || !passwordValidation.canSubmit
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
          }`}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Customer Account'}
        </button>
      </form>

      {/* Help Text */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        By creating an account, you agree to GEARFALCON's terms of service and privacy policy.
      </p>
    </div>
  );
};

// Admin Registration Form (Higher security requirements)
const AdminRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<AdminFormData>({
    username: '',
    email: '',
    role: 'technician',
    password: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);

  // Use the admin-specific password validation hook
  const passwordValidation = useAdminPasswordValidation(formData.password, formData.confirmPassword);

  const handleInputChange = <K extends keyof AdminFormData>(
    field: K, 
    value: AdminFormData[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!passwordValidation.canSubmit) {
      setSubmitMessage({ type: 'error', text: 'Please ensure password meets all security requirements.' });
      return;
    }

    // Additional check for admin - require strong password
    if (!passwordValidation.password.isVeryStrong && !passwordValidation.password.isStrong) {
      setSubmitMessage({ type: 'error', text: 'Admin accounts require a strong or very strong password.' });
      return;
    }

    // Basic form validation
    if (!formData.username.trim() || !formData.email.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const submissionData = {
        ...formData,
        ...passwordValidation.getSubmissionData(),
        accountType: 'admin' as const
      };
      
      console.log('Admin Registration Data:', submissionData);
      setSubmitMessage({ 
        type: 'success', 
        text: 'Admin account created successfully! Access credentials will be sent to the provided email.' 
      });
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        role: 'technician',
        password: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Admin registration error:', error);
      setSubmitMessage({ type: 'error', text: 'Admin registration failed. Please contact system administrator.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-400">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <Shield className="w-8 h-8 text-yellow-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Create Admin Account</h2>
        </div>
        <p className="text-gray-600">Enhanced security for GEARFALCON staff access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Work Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="adminEmail"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="admin@gearfalcon.com"
              autoComplete="work email"
            />
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            required
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value as AdminFormData['role'])}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="technician">Technician</option>
            <option value="supervisor">Supervisor</option>
            <option value="manager">Manager</option>
            <option value="admin">System Administrator</option>
          </select>
        </div>

        {/* Enhanced Password Field */}
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="w-4 h-4 text-yellow-600 mr-1" />
            <span className="text-sm font-medium text-yellow-800">Enhanced Security Required</span>
          </div>
          <PasswordStrengthIndicator
            password={formData.password}
            onPasswordChange={(value) => handleInputChange('password', value)}
            label="Admin Password"
            placeholder="Create a very secure password (min 12 chars)"
            required
            showGenerator={true}
            showRequirements={true}
            userType="admin"
            autoComplete="new-password"
          />
        </div>

        {/* Password Confirmation */}
        <div>
          <label htmlFor="adminConfirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            id="adminConfirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              passwordValidation.confirmation.hasError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
          {formData.confirmPassword && passwordValidation.confirmation.message && (
            <div className={`mt-1 text-sm flex items-center ${
              passwordValidation.confirmation.isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {passwordValidation.confirmation.isValid ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-1" />
              )}
              {passwordValidation.confirmation.message}
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Admin Security Requirements:</p>
              <ul className="text-xs space-y-1">
                <li>• Minimum 12 character password</li>
                <li>• Strong password strength required</li>
                <li>• Regular password updates enforced</li>
                <li>• Two-factor authentication will be enabled</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`p-3 rounded-md flex items-center ${
            submitMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {submitMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            )}
            {submitMessage.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !passwordValidation.canSubmit || (!passwordValidation.password.isStrong && !passwordValidation.password.isVeryStrong)}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isSubmitting || !passwordValidation.canSubmit || (!passwordValidation.password.isStrong && !passwordValidation.password.isVeryStrong)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-4 focus:ring-yellow-200'
          }`}
        >
          {isSubmitting ? 'Creating Admin Account...' : 'Create Admin Account'}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-500 text-center">
        Admin accounts require approval from system administrator before activation.
      </p>
    </div>
  );
};

// Demo Component to show both forms
const RegistrationFormExample: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'customer' | 'admin'>('customer');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">GEARFALCON Registration System</h1>
          <p className="text-gray-600 mb-6">Password strength validation for customer and admin accounts</p>
          
          {/* Form Toggle */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setActiveForm('customer')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeForm === 'customer'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Customer Registration
            </button>
            <button
              onClick={() => setActiveForm('admin')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeForm === 'admin'
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Admin Registration
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex justify-center">
          {activeForm === 'customer' ? <CustomerRegistrationForm /> : <AdminRegistrationForm />}
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormExample;