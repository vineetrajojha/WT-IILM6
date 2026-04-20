import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP state
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast.error('EmailJS credentials are not configured.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: email,
            to_name: fullName,
            otp: otp,
            message: `Your verification code is: ${otp}`
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP verification email.');
      }

      setGeneratedOtp(otp);
      setIsOtpSent(true);
      toast.success('An OTP has been sent to your email.');
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (userOtpInput !== generatedOtp) {
      toast.error('Invalid OTP. Please try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;

      toast.success('Successfully signed up!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box glass-card">
        <div className="auth-header">
          <i className="ph-fill ph-graduation-cap logo-icon" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
          <h2>Create an account</h2>
          <p className="text-muted">Or <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>sign in to your existing account</Link></p>
        </div>

        {!isOtpSent ? (
          <form className="form-group mt-6" onSubmit={handleSendOtp}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Jane Doe"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-4">
              {isSubmitting ? 'Sending OTP...' : 'Continue to verify email'}
            </button>
          </form>
        ) : (
          <form className="form-group mt-6" onSubmit={handleVerifyOtp}>
            <div className="input-group">
              <label>Enter 6-digit OTP</label>
              <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>We sent a code to {email}</p>
              <input
                type="text"
                className="form-input text-center flex"
                placeholder="000000"
                maxLength={6}
                style={{ letterSpacing: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}
                required
                value={userOtpInput}
                onChange={(e) => setUserOtpInput(e.target.value)}
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-4">
              {isSubmitting ? 'Verifying & Signing up...' : 'Verify OTP and Sign Up'}
            </button>
            <button
              type="button"
              className="btn mt-2 w-full pt-4 font-semibold text-center"
              style={{ background: 'transparent', color: 'var(--text-secondary)' }}
              onClick={() => setIsOtpSent(false)}
            >
              Back to edit details
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
