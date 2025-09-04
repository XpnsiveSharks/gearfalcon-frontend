"use client";

import React, { useState, useEffect } from 'react';
import { 
  validatePasswordStrength, 
  generateSecurePassword, 
  PasswordStrength,
  PasswordRequirements,
  UserType
} from '../lib/validators/passwordValidator';
import { Eye, EyeOff, RefreshCw, Check, X, AlertTriangle } from 'lucide-react';

export interface PasswordStrengthIndicatorProps {
  password: string  ;
  onPasswordChange: (password: string) => void;
  placeholder?: string;
  label?: string;
  showGenerator?: boolean;
  showRequirements?: boolean;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  userType?: UserType;
  validationOptions?: Partial<PasswordRequirements>;
  // Standard input props
  id?: string;
  name?: string;
  autoComplete?: string;
  'aria-describedby'?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  onPasswordChange, 
  placeholder = "Enter your password",
  label = "Password",
  showGenerator = true,
  showRequirements = true,
  className = "",
  required = false,
  disabled = false,
  userType,
  validationOptions,
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validation, setValidation] = useState<ReturnType<typeof validatePasswordStrength> | null>(null);
  const [focused, setFocused] = useState<boolean>(false);

  // Determine validation options based on userType or explicit options
  const resolvedOptions = React.useMemo(() => {
    if (validationOptions) return validationOptions;
    if (userType) {
      // Import PASSWORD_CONFIGS here or define inline
      const configs = {
        customer: { minLength: 8 },
        admin: { minLength: 12 },
        technician: { minLength: 12 },
        supervisor: { minLength: 12 },
        manager: { minLength: 12 }
      };
      return configs[userType];
    }
    return {};
  }, [userType, validationOptions]);

  useEffect(() => {
    if (password !== undefined && password !== '') {
      const result = validatePasswordStrength(password, resolvedOptions);
      setValidation(result);
    } else {
      setValidation(null);
    }
  }, [password, resolvedOptions]);

  const handlePasswordGenerate = (): void => {
    const newPassword = generateSecurePassword();
    onPasswordChange(newPassword);
  };

  const getStrengthColor = (strength: PasswordStrength): string => {
    switch (strength) {
      case 'very-strong': return 'bg-green-500';
      case 'strong': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'weak': return 'bg-orange-500';
      case 'very-weak': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthText = (strength: PasswordStrength): string => {
    switch (strength) {
      case 'very-strong': return 'Very Strong';
      case 'strong': return 'Strong';
      case 'medium': return 'Medium';
      case 'weak': return 'Weak';
      case 'very-weak': return 'Very Weak';
      default: return '';
    }
  };

  const getStrengthTextColor = (strength: PasswordStrength): string => {
    switch (strength) {
      case 'very-strong': return 'text-green-600';
      case 'strong': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      case 'weak': return 'text-orange-600';
      case 'very-weak': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const inputId = inputProps.id || `password-${Math.random().toString(36).substr(2, 9)}`;
  const strengthMeterId = `${inputId}-strength`;
  const requirementsId = `${inputId}-requirements`;

  return (
    <div className={`w-full ${className}`}>
      {/* Password Input Field */}
      <div className="mb-2">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {userType && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {userType}
            </span>
          )}
        </label>
        
        <div className="relative">
          <input
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            value={password || ''}
            onChange={(e) => onPasswordChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-describedby={`${strengthMeterId} ${requirementsId} ${inputProps['aria-describedby'] || ''}`.trim()}
            className={`
              w-full px-4 py-3 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              transition-colors duration-200 text-sm
              ${validation && !validation.isValid ? 'border-red-300' : 'border-gray-300'}
              ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
            `}
            {...inputProps}
          />
          
          {/* Password visibility toggle */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          
          {/* Password generator */}
          {showGenerator && (
            <button
              type="button"
              onClick={handlePasswordGenerate}
              disabled={disabled}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 disabled:opacity-50"
              title="Generate secure password"
              aria-label="Generate secure password"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Strength Indicator Bar */}
      {password && validation && (
        <div id={strengthMeterId} className="mb-3" aria-live="polite">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Password Strength</span>
            <span className={`text-xs font-medium ${getStrengthTextColor(validation.strength)}`}>
              {getStrengthText(validation.strength)}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" 
               aria-valuenow={validation.score} aria-valuemin={0} aria-valuemax={100}>
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(validation.strength)}`}
              style={{ width: `${Math.min(validation.score, 100)}%` }}
            />
          </div>
          
          {validation.score > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Score: {validation.score}/100
            </div>
          )}
        </div>
      )}

      {/* Requirements Checklist */}
      {showRequirements && password && validation && (focused || !validation.isValid) && (
        <div id={requirementsId} className="mb-4" aria-live="polite">
          <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
          <ul className="space-y-1" role="list">
            {validation.requirements.map((req) => (
              <li key={req.id} className="flex items-center text-sm" role="listitem">
                {req.met ? (
                  <Check 
                    className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" 
                    aria-hidden="true"
                  />
                ) : (
                  <X 
                    className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" 
                    aria-hidden="true"
                  />
                )}
                <span className={req.met ? 'text-green-700' : 'text-red-700'}>
                  {req.label}
                </span>
                <span className="sr-only">{req.met ? 'Met' : 'Not met'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Feedback Messages */}
      {password && validation && validation.feedback.length > 0 && (
        <div className="mb-4" role="alert" aria-live="assertive">
          {validation.feedback.map((message, index) => {
            const isWarning = message.startsWith('⚠️');
            const isSuccess = validation.isValid && message.includes('meets all requirements');
            
            return (
              <div 
                key={index} 
                className={`flex items-start text-sm p-2 rounded-md mb-1 ${
                  isSuccess 
                    ? 'bg-green-50 text-green-800' 
                    : isWarning 
                      ? 'bg-yellow-50 text-yellow-800'
                      : 'bg-red-50 text-red-800'
                }`}
                role={isSuccess ? 'status' : 'alert'}
              >
                {isSuccess ? (
                  <Check className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" aria-hidden="true" />
                ) : isWarning ? (
                  <AlertTriangle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <X className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" aria-hidden="true" />
                )}
                <span>{message.replace('⚠️ ', '')}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Help Text */}
      {!password && (
        <p className="text-xs text-gray-500 mt-1" id={`${inputId}-help`}>
          Create a strong password with at least {resolvedOptions.minLength || 8} characters, 
          including uppercase, lowercase, numbers, and special characters.
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;