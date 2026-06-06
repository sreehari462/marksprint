import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle, Smartphone } from 'lucide-react';
import Galaxy from '../../../components/Galaxy';
import ClickSpark from '../../../components/ClickSpark';

// The Content Manager authentication is handled by the server API.
// The server must be configured with CONTENT_MANAGER_PASSWORD and will expose /api/auth/* endpoints.
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Device detection function
const isDesktopDevice = () => {
  // Check window width (tablets and phones are typically < 1024px)
  if (window.innerWidth < 1024) {
    return false;
  }

  // Check user agent for mobile/tablet indicators
  const userAgent = navigator.userAgent.toLowerCase();
  const mobilePatterns = [
    /android/,
    /webos/,
    /iphone/,
    /ipad/,
    /ipod/,
    /blackberry/,
    /iemobile/,
    /opera mini/,
    /mobile/,
    /tablet/,
    /kindle/,
    /playbook/,
  ];

  return !mobilePatterns.some(pattern => pattern.test(userAgent));
};

export default function PasswordGate({ onUnlock }) {
  const PASSWORD_LENGTH = 12;
  const [passwordInput, setPasswordInput] = useState(Array(PASSWORD_LENGTH).fill(''));
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [charValidation, setCharValidation] = useState(Array(PASSWORD_LENGTH).fill(null));
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);

  // Check if device is desktop/PC only
  useEffect(() => {
    const checkDevice = () => {
      const isDesktop = isDesktopDevice();
      setIsMobileDevice(!isDesktop);
      setIsLoading(false);
    };

    // Small delay to ensure window is fully loaded
    checkDevice();

    // Re-check on window resize
    const handleResize = () => {
      checkDevice();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for existing lockout in localStorage
  useEffect(() => {
    const storedLockout = localStorage.getItem('contentManagerLockout');
    if (storedLockout) {
      const lockoutEnd = parseInt(storedLockout);
      const now = Date.now();
      if (now < lockoutEnd) {
        setIsLocked(true);
        setLockoutTime(lockoutEnd);
      } else {
        localStorage.removeItem('contentManagerLockout');
        setAttempts(0);
      }
    }
  }, []);

  // Check server configuration & authentication status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/auth/status', { credentials: 'include' });
        if (res.status === 503) {
          setIsConfigured(false);
          setIsLoading(false);
          return;
        }
        if (res.status === 200) {
          const json = await res.json();
          if (json.authenticated) {
            onUnlock();
            return;
          }
        }
      } catch (e) {
        // If server is not reachable, assume configured (so UI shows login)
        console.warn('Auth server not reachable:', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, [onUnlock]);

  // Handle lockout timer countdown
  useEffect(() => {
    if (!lockoutTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= lockoutTime) {
        setIsLocked(false);
        setLockoutTime(null);
        setAttempts(0);
        setPasswordInput(Array(PASSWORD_LENGTH).fill(''));
        setCharValidation(Array(PASSWORD_LENGTH).fill(null));
        localStorage.removeItem('contentManagerLockout');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleCharInput = (index, value) => {
    // Only allow single character input
    const char = value.slice(-1);
    
    if (char === '') {
      // Allow backspace
      const newInput = [...passwordInput];
      newInput[index] = '';
      setPasswordInput(newInput);
      return;
    }

    // Update current position
    const newInput = [...passwordInput];
    newInput[index] = char;
    setPasswordInput(newInput);

    // Auto-move to next field if character entered
    if (char && index < PASSWORD_LENGTH - 1) {
      const nextInput = document.getElementById(`password-char-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Check if all fields are filled
    if (index === PASSWORD_LENGTH - 1 && char) {
      submitPassword(newInput.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newInput = [...passwordInput];
      newInput[index] = '';
      setPasswordInput(newInput);

      // Move to previous field
      if (index > 0) {
        const prevInput = document.getElementById(`password-char-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = document.getElementById(`password-char-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowRight' && index < PASSWORD_LENGTH - 1) {
      e.preventDefault();
      const nextInput = document.getElementById(`password-char-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const submitPassword = async (enteredPassword) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: enteredPassword })
      });

      if (res.status === 200) {
        setErrorMessage('');
        setAttempts(0);
        localStorage.removeItem('contentManagerLockout');
        setTimeout(() => onUnlock(), 300);
        return;
      }

      if (res.status === 423) {
        const lockoutEnd = Date.now() + LOCKOUT_DURATION;
        localStorage.setItem('contentManagerLockout', lockoutEnd.toString());
        setIsLocked(true);
        setLockoutTime(lockoutEnd);
        setErrorMessage('Too many incorrect attempts. Locked for 30 minutes.');
        return;
      }

      if (res.status === 401) {
        const json = await res.json();
        const remaining = json.remaining || (MAX_ATTEMPTS - (attempts + 1));
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setErrorMessage(`Incorrect password. ${remaining} attempts remaining.`);
      } else if (res.status === 503) {
        setIsConfigured(false);
      } else {
        setErrorMessage('Authentication failed.');
      }
    } catch (e) {
      console.error('Auth request failed', e);
      setErrorMessage('Auth server unreachable');
    } finally {
      // Reset inputs for next attempt
      setTimeout(() => {
        setPasswordInput(Array(PASSWORD_LENGTH).fill(''));
        setCharValidation(Array(PASSWORD_LENGTH).fill(null));
      }, 800);
    }
  };

  const getTimeRemaining = () => {
    if (!lockoutTime) return '';
    const now = Date.now();
    const remaining = Math.ceil((lockoutTime - now) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Loading state
  if (isLoading) {
    return (
      <ClickSpark isDark={true}>
        <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-[#0b1f2a] text-[#9fe3ff] p-4">
          <Galaxy isDark={true} />
          <div className="relative z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d2ff]"></div>
          </div>
        </div>
      </ClickSpark>
    );
  }

  // If the server reports the auth feature is not configured, show a safe message and disable the gate.
  if (isConfigured === false) {
    return (
      <ClickSpark isDark={true}>
        <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-[#0b1f2a] text-[#9fe3ff] p-4 overflow-hidden">
          <Galaxy isDark={true} />
          <div className="relative z-10 max-w-md w-full">
            <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-12 shadow-[0_0_20px_rgba(0,210,255,0.1)] text-center">
              <h1 className="text-2xl font-bold text-[#7fdfff] mb-4">Content Manager Unavailable</h1>
              <p className="text-[#9fe3ff] mb-6 leading-relaxed">
                The Content Manager is not configured on this deployment. For security, the administrative
                password must be provided via an environment variable and should never be committed to source.
              </p>
              <p className="text-xs text-[#2aa8d8]">Contact the site administrator to enable access.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="mt-6 w-full px-6 py-3 bg-[#2aa8d8] hover:bg-[#00d2ff] text-[#0b1f2a] font-semibold rounded-none transition-all duration-300 transform hover:scale-105"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </ClickSpark>
    );
  }

  // Mobile/Tablet device - show desktop-only message
  if (isMobileDevice) {
    return (
      <ClickSpark isDark={true}>
        <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-[#0b1f2a] text-[#9fe3ff] p-4 overflow-hidden">
          <Galaxy isDark={true} />
          
          <div className="relative z-10 max-w-md w-full">
            <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-12 shadow-[0_0_20px_rgba(0,210,255,0.1)] text-center">
              <div className="flex justify-center mb-6">
                <Smartphone size={56} className="text-[#ff6b6b]" />
              </div>

              <h1 className="text-2xl font-bold text-[#7fdfff] mb-4">
                Desktop Only
              </h1>
              
              <p className="text-[#9fe3ff] mb-6 leading-relaxed">
                The Content Manager is only available on desktop and laptop computers.
              </p>

              <div className="bg-[rgba(255,107,107,0.1)] border border-[#ff6b6b] rounded-none p-4 mb-6">
                <p className="text-[#ff9999] text-sm">
                  Please access this page from a desktop or laptop browser to continue.
                </p>
              </div>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg-[#2aa8d8] hover:bg-[#00d2ff] text-[#0b1f2a] font-semibold rounded-none transition-all duration-300 transform hover:scale-105"
              >
                Return to Home
              </button>

              <p className="text-xs text-[#2aa8d8] mt-6">
                If you believe this is an error, try opening this page on a desktop browser.
              </p>
            </div>
          </div>
        </div>
      </ClickSpark>
    );
  }

  // Desktop device - show password gate
  return (
    <ClickSpark isDark={true}>
      <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-[#0b1f2a] text-[#9fe3ff] p-4 overflow-hidden">
        <Galaxy isDark={true} />
        
        <style dangerouslySetInnerHTML={{ __html: `
          .password-input-box {
            width: 50px;
            height: 50px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            border: 2px solid #2aa8d8;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.05);
            color: #7fdfff;
            transition: all 0.3s ease;
          }
          .password-input-box:focus {
            outline: none;
            border-color: #00d2ff;
            box-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
            background: rgba(0, 210, 255, 0.1);
          }
          .password-input-box.correct {
            border-color: #00ff00;
            background: rgba(0, 255, 0, 0.1);
            color: #00ff00;
          }
          .password-input-box.incorrect {
            border-color: #ff0000;
            background: rgba(255, 0, 0, 0.1);
            color: #ff0000;
          }
        `}} />

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-12 shadow-[0_0_20px_rgba(0,210,255,0.1)]">
            <div className="flex justify-center mb-8">
              <Lock size={48} className="text-[#00d2ff]" />
            </div>

            <h1 className="text-3xl font-bold text-center text-[#7fdfff] mb-2">
              Content Manager
            </h1>
            <p className="text-center text-[#9fe3ff] mb-8">
              Enter the security password to access
            </p>

            {errorMessage && (
              <div className="mb-6 p-4 bg-[rgba(255,0,0,0.1)] border border-red-500 rounded-none flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{errorMessage}</p>
              </div>
            )}

            {isLocked && lockoutTime && (
              <div className="mb-6 p-4 bg-[rgba(255,165,0,0.1)] border border-orange-500 rounded-none text-center">
                <p className="text-orange-400 font-semibold">
                  Locked for: {getTimeRemaining()}
                </p>
              </div>
            )}

            <div className="mb-8">
              <label className="block text-center text-[#9fe3ff] mb-4 font-semibold">
                Password ({PASSWORD_LENGTH} characters)
              </label>
              <div className="flex justify-center gap-2 flex-wrap">
                {passwordInput.map((char, index) => (
                  <input
                    key={index}
                    id={`password-char-${index}`}
                    type="password"
                    maxLength="1"
                    value={char}
                    onChange={(e) => handleCharInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLocked}
                    className={`password-input-box ${
                      charValidation[index] === 'correct'
                        ? 'correct'
                        : charValidation[index] === 'incorrect'
                        ? 'incorrect'
                        : ''
                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <div className="text-center text-xs text-[#2aa8d8]">
              <p>Attempts: {attempts}/{MAX_ATTEMPTS}</p>
              <p className="mt-2">Green = Correct | Red = Incorrect</p>
            </div>
          </div>
        </div>
      </div>
    </ClickSpark>
  );
}
