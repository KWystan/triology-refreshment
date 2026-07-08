/**
 * InquiryForm — contact/inquiry form used on Party Packs and Events pages.
 *
 * Props:
 *   title     — form heading (default "Send us a message")
 *   subtitle  — optional subtitle
 *   fields    — custom field array override
 *   buttonText — submit button label
 *   onSubmit  — async submit handler (default: logs to console)
 *   className — additional classes
 */
import { useState } from 'react';
import Button from './Button';

const defaultFields = [
  { name: 'name', label: 'Your Name', type: 'text', required: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel' },
  { name: 'message', label: 'Message', type: 'textarea', required: true },
];

export default function InquiryForm({
  title = "Send us a message",
  subtitle,
  fields = defaultFields,
  buttonText = 'Send Message',
  onSubmit,
  className = '',
}) {
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default: simulate send
        await new Promise((r) => setTimeout(r, 1000));
        console.log('Inquiry:', formData);
      }
      setStatus('done');
      setFormData({});
    } catch {
      setStatus('error');
    }
  };

  const inputBase = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    color: 'var(--color-on-surface)',
    background: 'var(--color-surface-container-low)',
    border: '1px solid var(--color-outline-variant)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    transition: 'var(--transition-default)',
  };

  return (
    <div
      className={className}
      style={{
        background: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        border: '1px solid var(--color-surface-container-high)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--color-on-surface)',
          marginBottom: subtitle ? '0.5rem' : '1.5rem',
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--color-on-surface-variant)',
            marginBottom: '1.5rem',
          }}
        >
          {subtitle}
        </p>
      )}

      {status === 'done' ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 48, color: 'var(--color-primary-container)', display: 'block', marginBottom: '1rem' }}
          >
            check_circle
          </span>
          <p style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
            Message sent successfully!
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-on-surface-variant)', marginTop: '0.5rem' }}>
            We&rsquo;ll get back to you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={`field-${field.name}`}
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-on-surface)',
                  marginBottom: '0.375rem',
                }}
              >
                {field.label}
                {field.required && (
                  <span style={{ color: 'var(--color-error)' }}> *</span>
                )}
              </label>
              {field.type === 'select' ? (
                <select
                  id={`field-${field.name}`}
                  name={field.name}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  style={{
                    ...inputBase,
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23707973' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem',
                    cursor: 'pointer',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary-container)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45, 106, 79, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-outline-variant)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select...</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={`field-${field.name}`}
                  name={field.name}
                  rows={4}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  style={inputBase}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary-container)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45, 106, 79, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-outline-variant)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              ) : (
                <input
                  id={`field-${field.name}`}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  style={inputBase}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary-container)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45, 106, 79, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-outline-variant)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              )}
            </div>
          ))}

          {status === 'error' && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-error)' }}>
              Something went wrong. Please try again.
            </p>
          )}

          <Button
            variant="primary"
            size="lg"
            icon={status === 'sending' ? 'hourglass_top' : 'send'}
            disabled={status === 'sending'}
            style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
          >
            {status === 'sending' ? 'Sending...' : buttonText}
          </Button>
        </form>
      )}
    </div>
  );
}
