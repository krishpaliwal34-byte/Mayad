'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  FileText,
  IndianRupee,
  Receipt,
  Search,
  XCircle,
} from 'lucide-react';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type PaymentStatus = 'success' | 'pending' | 'failed';

interface Payment {
  _id?: string;
  id?: string;
  amount?: number;
  currency?: string;
  status?: PaymentStatus | string;
  paymentMethod?: string;
  method?: string;
  transactionId?: string;
  orderId?: string;
  description?: string;
  title?: string;
  createdAt?: string;
  date?: string;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | PaymentStatus>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('mayad_token');

      if (!token) {
        setError('Please login to view your payment history.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/payments/history`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load payment history.');
      }

      const paymentList = Array.isArray(data)
        ? data
        : Array.isArray(data.payments)
        ? data.payments
        : [];

      setPayments(paymentList);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load payment history.'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const status = normalizeStatus(payment.status);

      const matchesFilter =
        filter === 'all' || status === filter;

      const searchableText = [
        payment.title,
        payment.description,
        payment.transactionId,
        payment.orderId,
        payment.paymentMethod,
        payment.method,
        status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [payments, search, filter]);

  const totalPaid = useMemo(() => {
    return payments
      .filter(
        (payment) =>
          normalizeStatus(payment.status) === 'success'
      )
      .reduce((total, payment) => total + Number(payment.amount || 0), 0);
  }, [payments]);

  const successfulPayments = payments.filter(
    (payment) =>
      normalizeStatus(payment.status) === 'success'
  ).length;

  const pendingPayments = payments.filter(
    (payment) =>
      normalizeStatus(payment.status) === 'pending'
  ).length;

  return (
    <main className="min-h-screen bg-[#020506] text-white">
      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-yellow-500/[0.06] blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-amber-400/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* BACK */}

        <Link
          href="/account-setting"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-mayad-gold"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Account Settings
        </Link>

        {/* HEADER */}

        <section className="mb-8 overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#151915] via-[#0b0f0e] to-[#050708] p-6 shadow-2xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-mayad-gold/20 bg-mayad-gold/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-mayad-gold">
                <Receipt className="h-4 w-4" />
                Transactions
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Payment History
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                View all your MAYAD payments, transactions, amounts and
                payment statuses in one place.
              </p>
            </div>

            <div className="hidden h-24 w-24 items-center justify-center rounded-3xl border border-mayad-gold/20 bg-mayad-gold/[0.05] lg:flex">
              <CreditCard className="h-10 w-10 text-mayad-gold" />
            </div>
          </div>
        </section>

        {/* STATS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<IndianRupee className="h-5 w-5" />}
            label="Total Paid"
            value={`₹${totalPaid.toLocaleString('en-IN')}`}
          />

          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Successful Payments"
            value={successfulPayments.toString()}
          />

          <StatCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Pending Payments"
            value={pendingPayments.toString()}
          />
        </div>

        {/* SEARCH + FILTER */}

        <section className="mb-6 rounded-[24px] border border-white/[0.08] bg-[#0b0f0e]/90 p-4 shadow-xl sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transaction..."
                className="h-11 w-full rounded-full border border-white/[0.08] bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-mayad-gold/40 focus:ring-1 focus:ring-mayad-gold/10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                All
              </FilterButton>

              <FilterButton
                active={filter === 'success'}
                onClick={() => setFilter('success')}
              >
                Successful
              </FilterButton>

              <FilterButton
                active={filter === 'pending'}
                onClick={() => setFilter('pending')}
              >
                Pending
              </FilterButton>

              <FilterButton
                active={filter === 'failed'}
                onClick={() => setFilter('failed')}
              >
                Failed
              </FilterButton>
            </div>
          </div>
        </section>

        {/* PAYMENTS */}

        <section className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0b0f0e]/90 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-7">
            <div>
              <h2 className="text-lg font-bold text-white">
                All Transactions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredPayments.length} transaction
                {filteredPayments.length !== 1 ? 's' : ''}
              </p>
            </div>

            <button
              type="button"
              onClick={loadPayments}
              className="rounded-full border border-white/[0.08] px-4 py-2 text-xs font-bold text-slate-400 transition-colors hover:border-mayad-gold/30 hover:text-mayad-gold"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={loadPayments}
            />
          ) : filteredPayments.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {filteredPayments.map((payment, index) => (
                <PaymentRow
                  key={payment._id || payment.id || index}
                  payment={payment}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        @keyframes pageFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        main {
          animation: pageFade 0.45s ease-out;
        }
      `}</style>
    </main>
  );
}

/* ================================================================
   PAYMENT ROW
================================================================ */

function PaymentRow({ payment }: { payment: Payment }) {
  const status = normalizeStatus(payment.status);

  const dateValue =
    payment.createdAt || payment.date;

  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Date unavailable';

  const formattedTime = dateValue
    ? new Date(dateValue).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const amount = Number(payment.amount || 0);

  return (
    <div className="group px-5 py-5 transition-colors hover:bg-white/[0.02] sm:px-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-mayad-gold">
            <CreditCard className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-white sm:text-base">
              {payment.title ||
                payment.description ||
                'MAYAD Payment'}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>{formattedDate}</span>

              {formattedTime && (
                <>
                  <span className="text-slate-700">•</span>
                  <span>{formattedTime}</span>
                </>
              )}

              {(payment.paymentMethod || payment.method) && (
                <>
                  <span className="text-slate-700">•</span>
                  <span>
                    {payment.paymentMethod || payment.method}
                  </span>
                </>
              )}
            </div>

            {(payment.transactionId || payment.orderId) && (
              <p className="mt-2 truncate text-[11px] text-slate-600">
                {payment.transactionId
                  ? `Transaction ID: ${payment.transactionId}`
                  : `Order ID: ${payment.orderId}`}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 lg:justify-end">
          <div className="text-left lg:text-right">
            <p className="text-base font-black text-white">
              {payment.currency === 'USD'
                ? '$'
                : '₹'}
              {amount.toLocaleString('en-IN')}
            </p>

            <StatusBadge status={status} />
          </div>

          {status === 'success' && (
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03] text-slate-500 transition-all hover:border-mayad-gold/30 hover:text-mayad-gold"
              title="Download receipt"
              onClick={() => {
                alert(
                  'Receipt download will be connected to the payment backend.'
                );
              }}
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   STATUS
================================================================ */

function StatusBadge({ status }: { status: PaymentStatus }) {
  if (status === 'success') {
    return (
      <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Successful
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
        <Clock3 className="h-3.5 w-3.5" />
        Pending
      </span>
    );
  }

  return (
    <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-red-400">
      <XCircle className="h-3.5 w-3.5" />
      Failed
    </span>
  );
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b0f0e]/90 p-5 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mayad-gold/10 text-mayad-gold">
          {icon}
        </div>

        <p className="text-xs font-semibold text-slate-500">
          {label}
        </p>
      </div>

      <p className="mt-4 text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

/* ================================================================
   FILTER BUTTON
================================================================ */

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
        active
          ? 'bg-mayad-gold text-black shadow-glow-gold'
          : 'border border-white/[0.08] bg-white/[0.025] text-slate-500 hover:border-mayad-gold/20 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

/* ================================================================
   LOADING
================================================================ */

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-mayad-gold" />

      <p className="mt-5 text-sm font-semibold text-slate-400">
        Loading payment history...
      </p>
    </div>
  );
}

/* ================================================================
   ERROR
================================================================ */

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-400/10 text-red-400">
        <XCircle className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-white">
        Unable to load payments
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-gradient-to-r from-mayad-gold to-mayad-goldHover px-5 py-2.5 text-xs font-black text-black shadow-glow-gold transition-all hover:brightness-110"
      >
        Try Again
      </button>
    </div>
  );
}

/* ================================================================
   EMPTY
================================================================ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.035] text-slate-600">
        <FileText className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-white">
        No payment history
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Your MAYAD payments and transactions will appear here once
        you make a payment.
      </p>

      <Link
        href="/rent-videos"
        className="mt-5 rounded-full bg-gradient-to-r from-mayad-gold to-mayad-goldHover px-6 py-3 text-xs font-black text-black shadow-glow-gold transition-all hover:brightness-110"
      >
        Browse Videos
      </Link>
    </div>
  );
}

/* ================================================================
   HELPERS
================================================================ */

function normalizeStatus(status?: string): PaymentStatus {
  const value = String(status || '').toLowerCase();

  if (
    value === 'success' ||
    value === 'successful' ||
    value === 'paid' ||
    value === 'completed'
  ) {
    return 'success';
  }

  if (
    value === 'pending' ||
    value === 'processing' ||
    value === 'created'
  ) {
    return 'pending';
  }

  return 'failed';
}