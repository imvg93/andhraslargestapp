import { useState } from 'react';

export default function ArrivedConfirmationModal({ isOpen, bookingId, onConfirm, onCancel, isLoading }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fade-in 0.2s var(--ease)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--surface)',
          borderRadius: '24px 24px 0 0',
          zIndex: 1000,
          boxShadow: 'var(--shadow-xl)',
          animation: 'slide-up 0.3s var(--ease)',
          maxHeight: '85vh',
          overflow: 'auto',
        }}
      >
        <div style={{ padding: '32px 24px 40px' }}>
          {/* Header icon */}
          <div style={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 32,
          }}>
            🏨
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--text)',
            textAlign: 'center',
            marginBottom: 12,
            lineHeight: 1.3,
          }}>
            Important Information
          </h2>

          {/* Subtitle */}
          <p style={{
            fontSize: 14,
            color: 'var(--text-3)',
            textAlign: 'center',
            marginBottom: 28,
            lineHeight: 1.6,
          }}>
            Please read before confirming your booking
          </p>

          {/* Info box */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 16,
            padding: '20px 16px',
            marginBottom: 28,
          }}>
            <p style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: 16,
              lineHeight: 1.6,
            }}>
              After you arrive at Rayudu Hotel:
            </p>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 24, flex: 'none' }}>1️⃣</span>
              <div>
                <p style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 4,
                  margin: 0,
                }}>
                  Please Cooperate
                </p>
                <p style={{
                  fontSize: 13,
                  color: 'var(--text-3)',
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  Be ready when our staff calls your booking reference
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 24, flex: 'none' }}>⏱️</span>
              <div>
                <p style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 4,
                  margin: 0,
                }}>
                  Wait 10-15 Minutes
                </p>
                <p style={{
                  fontSize: 13,
                  color: 'var(--text-3)',
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  Our staff needs time to arrange and prepare your table
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 24, flex: 'none' }}>✨</span>
              <div>
                <p style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 4,
                  margin: 0,
                }}>
                  Table Will Be Ready
                </p>
                <p style={{
                  fontSize: 13,
                  color: 'var(--text-3)',
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  We will provide your table after preparation
                </p>
              </div>
            </div>
          </div>

          {/* Booking reference */}
          <div style={{
            background: 'var(--bg)',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 28,
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-4)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 6,
            }}>
              Your Booking Reference
            </p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text)',
              margin: 0,
            }}>
              {bookingId}
            </p>
          </div>

          {/* Checkbox acknowledgement */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg)',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 28,
            cursor: 'pointer',
            border: isChecked ? '2px solid var(--primary)' : '1px solid var(--border)',
            transition: 'all 0.3s ease',
          }}
            onClick={() => setIsChecked(!isChecked)}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              style={{
                width: 20,
                height: 20,
                cursor: 'pointer',
                accentColor: 'var(--primary)',
                flex: 'none',
              }}
            />
            <label style={{
              fontSize: 14,
              color: isChecked ? 'var(--primary)' : 'var(--text-2)',
              cursor: 'pointer',
              flex: 1,
              margin: 0,
              fontWeight: isChecked ? 600 : 400,
              transition: 'all 0.3s ease',
            }}>
              I understand and agree to cooperate and wait 10-15 minutes
            </label>
            {isChecked && <span style={{ fontSize: 20, flex: 'none' }}>✓</span>}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
            <button
              onClick={handleConfirm}
              disabled={!isChecked || isLoading}
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 12,
                border: 'none',
                background: isLoading ? '#94a3b8' : (isChecked ? '#10B981' : '#e5e7eb'),
                color: isLoading ? 'white' : (isChecked ? 'white' : '#9ca3af'),
                cursor: (isChecked && !isLoading) ? 'pointer' : 'not-allowed',
                boxShadow: (isChecked && !isLoading) ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                transition: 'all 0.3s ease',
                transform: (isChecked && !isLoading) ? 'translateY(0)' : 'translateY(0)',
              }}
            >
              {isLoading ? '⏳ Processing...' : 'Confirm Booking'}
            </button>
            <button
              onClick={onCancel}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-2)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
