'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';

export default function LoginModal() {
  const { isLoginOpen, closeLogin } = useApp();
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  if (!isLoginOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('otp');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    setTimeout(() => {
      closeLogin();
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '']);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLogin}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#0D1226] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 p-6 sm:p-8"
        >
          <button
            onClick={closeLogin}
            className="absolute top-4 right-4 text-mayad-muted hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="relative w-28 h-10 mx-auto mb-3">
              <Image
                src="/mayad.jpg"
                alt="MAYAD"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-bold text-white">Sign In to MAYAD</h3>
            <p className="text-xs text-mayad-muted mt-1">
              Watch endless Rajasthani movies, series & music.
            </p>
          </div>

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-semibold text-mayad-gold">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-[#050816] text-white placeholder-mayad-muted text-sm pl-14 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-mayad-gold focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-mayad-gold to-mayad-goldHover text-black font-bold text-sm rounded-xl shadow-glow-gold hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                Get OTP <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-mayad-muted">
                By continuing, you agree to MAYAD&apos;s Terms of Service & Privacy Policy.
              </p>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="text-center">
                <p className="text-xs text-slate-300 mb-3">
                  Enter 4-digit OTP sent to <span className="text-mayad-gold font-bold">+91 {phone}</span>
                </p>
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={otp[idx]}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newOtp = [...otp];
                        newOtp[idx] = val;
                        setOtp(newOtp);
                        if (val && e.target.nextElementSibling) {
                          (e.target.nextElementSibling as HTMLInputElement).focus();
                        }
                      }}
                      className="w-12 h-12 text-center text-lg font-bold text-white bg-[#050816] rounded-xl border border-white/10 focus:border-mayad-gold focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-mayad-gold to-mayad-goldHover text-black font-bold text-sm rounded-xl shadow-glow-gold hover:opacity-95 transition-all"
              >
                Verify & Continue
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3 animate-bounce" />
              <h4 className="text-lg font-bold text-white">Welcome to MAYAD!</h4>
              <p className="text-xs text-mayad-muted mt-1">Logged in successfully.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
