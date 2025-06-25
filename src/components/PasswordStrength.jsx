import React from 'react';

const PasswordStrength = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { strength: '', score: 0 };
    
    let score = 0;
    const checks = {
      length: password.length >= 6,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score < 3) return { strength: 'weak', score, checks };
    if (score < 4) return { strength: 'medium', score, checks };
    return { strength: 'strong', score, checks };
  };

  const { strength, checks } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className={`password-strength ${strength}`}>
      <div className="strength-indicator">
        Password strength: <span className={`strength-text ${strength}`}>
          {strength.charAt(0).toUpperCase() + strength.slice(1)}
        </span>
      </div>
      <div className="strength-requirements">
        <small>
          {checks && (
            <>
              <div className={checks.length ? 'requirement-met' : 'requirement-unmet'}>
                ✓ At least 6 characters
              </div>
              <div className={checks.lowercase ? 'requirement-met' : 'requirement-unmet'}>
                ✓ One lowercase letter
              </div>
              <div className={checks.uppercase ? 'requirement-met' : 'requirement-unmet'}>
                ✓ One uppercase letter
              </div>
              <div className={checks.number ? 'requirement-met' : 'requirement-unmet'}>
                ✓ One number
              </div>
            </>
          )}
        </small>
      </div>
    </div>
  );
};

export default PasswordStrength;
