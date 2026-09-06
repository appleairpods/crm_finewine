import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import './PhoneAuth.css';

export default function PhoneAuth() {
  const { authOpen, authStep, closeAuth, backToPhone, submitPhone, submitCode } = useAuth();
  const { t } = useLanguage();
  const [phone, setPhone] = useState('+7');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!authOpen) return null;

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/[^\d+]/g, '');
    if (!val.startsWith('+7')) val = '+7';
    if (val.length > 12) val = val.slice(0, 12);
    setPhone(val);
    setError('');
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    const result = submitPhone(phone);
    if (!result.ok) setError(t.auth.invalidPhone);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    const result = submitCode(code);
    if (!result.ok) setError(t.auth.invalidCode);
    else {
      setPhone('+7');
      setCode('');
      setError('');
    }
  };

  const handleClose = () => {
    closeAuth();
    setPhone('+7');
    setCode('');
    setError('');
  };

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={handleClose} aria-label="Close">
          ×
        </button>

        <h2 className="auth-modal__title">{t.auth.title}</h2>

        {authStep === 'phone' ? (
          <form onSubmit={handlePhoneSubmit}>
            <div className="form-group">
              <label className="label">{t.auth.phoneLabel}</label>
              <input
                className="input"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder={t.auth.phonePlaceholder}
                autoFocus
              />
              <p className="auth-hint">{t.auth.phoneHint}</p>
              {error && <p className="error-text">{error}</p>}
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              {t.auth.sendCode}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit}>
            <div className="form-group">
              <label className="label">{t.auth.codeLabel}</label>
              <input
                className="input auth-code-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                placeholder={t.auth.codePlaceholder}
                autoFocus
              />
              {error && <p className="error-text">{error}</p>}
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              {t.auth.verify}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-full"
              style={{ marginTop: 8 }}
              onClick={() => {
                setError('');
                backToPhone();
              }}
            >
              ← {t.auth.phoneLabel}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
