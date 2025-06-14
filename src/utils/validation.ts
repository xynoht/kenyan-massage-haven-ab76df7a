
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Kenya phone number validation (supports both +254 and 07xx formats)
  const phoneRegex = /^(\+254|0)[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateBookingForm = (formData: {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  duration: number;
  branch: string;
}): ValidationResult => {
  const errors: string[] = [];

  // Name validation
  if (!formData.name || formData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // Phone validation
  if (!formData.phone) {
    errors.push('Phone number is required');
  } else if (!validatePhone(formData.phone)) {
    errors.push('Please enter a valid Kenya phone number (e.g., +254712345678 or 0712345678)');
  }

  // Email validation (optional but must be valid if provided)
  if (formData.email && !validateEmail(formData.email)) {
    errors.push('Please enter a valid email address');
  }

  // Date validation
  if (!formData.date) {
    errors.push('Date is required');
  } else {
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.push('Date cannot be in the past');
    }
  }

  // Time validation
  if (!formData.time) {
    errors.push('Time is required');
  }

  // Duration validation
  if (!formData.duration || formData.duration < 30) {
    errors.push('Service duration must be at least 30 minutes');
  }

  // Branch validation
  if (!formData.branch) {
    errors.push('Please select a branch');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateContactForm = (formData: {
  name: string;
  phone: string;
  message: string;
}): ValidationResult => {
  const errors: string[] = [];

  // Name validation
  if (!formData.name || formData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // Phone validation
  if (!formData.phone) {
    errors.push('Phone number is required');
  } else if (!validatePhone(formData.phone)) {
    errors.push('Please enter a valid Kenya phone number (e.g., +254712345678 or 0712345678)');
  }

  // Message validation
  if (!formData.message || formData.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateGiftVoucherForm = (formData: {
  senderName: string;
  recipientName: string;
  recipientPhone: string;
  amount: number;
  branch: string;
}): ValidationResult => {
  const errors: string[] = [];

  // Sender name validation
  if (!formData.senderName || formData.senderName.trim().length < 2) {
    errors.push('Sender name must be at least 2 characters long');
  }

  // Recipient name validation
  if (!formData.recipientName || formData.recipientName.trim().length < 2) {
    errors.push('Recipient name must be at least 2 characters long');
  }

  // Phone validation
  if (!formData.recipientPhone) {
    errors.push('Recipient phone number is required');
  } else if (!validatePhone(formData.recipientPhone)) {
    errors.push('Please enter a valid Kenya phone number for the recipient');
  }

  // Amount validation
  if (!formData.amount || formData.amount < 1000) {
    errors.push('Voucher amount must be at least KSh 1,000');
  } else if (formData.amount > 50000) {
    errors.push('Voucher amount cannot exceed KSh 50,000');
  }

  // Branch validation
  if (!formData.branch) {
    errors.push('Please select a branch');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
