'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  membersApi,
  attendanceApi,
  transactionsApi,
  healthMetricsApi,
  Member,
  Attendance,
  Transaction,
  HealthMetric,
  PaginatedResponse,
} from '@/lib/api';
import SmsSendModal from '../../components/SmsSendModal';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default function MemberDetailPage({ params }: Props) {
  const { id, locale } = use(params);
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [attendance, setAttendance] = useState<PaginatedResponse<Attendance> | null>(null);
  const [transactions, setTransactions] = useState<PaginatedResponse<Transaction> | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<PaginatedResponse<HealthMetric> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'transactions' | 'health'>('overview');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchMemberData() {
      try {
        setIsLoading(true);
        const memberId = parseInt(id);
        const [memberData, attendanceData, transactionsData, healthMetricsData] = await Promise.all([
          membersApi.getOne(memberId),
          attendanceApi.getByMember(memberId, { limit: 10 }),
          transactionsApi.getByMember(memberId, { limit: 10 }),
          healthMetricsApi.getByMember(memberId, { limit: 10 }),
        ]);
        setMember(memberData);
        setAttendance(attendanceData);
        setTransactions(transactionsData);
        setHealthMetrics(healthMetricsData);
      } catch (err) {
        console.error('Failed to fetch member:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMemberData();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      frozen: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      expired: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border capitalize ${styles[status] || styles.inactive}`}>
        {status}
      </span>
    );
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(amount);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-surface-dark-lighter rounded w-48 animate-pulse" />
        <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="size-20 rounded-full bg-surface-dark-lighter" />
            <div className="space-y-2">
              <div className="h-6 bg-surface-dark-lighter rounded w-48" />
              <div className="h-4 bg-surface-dark-lighter rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined text-4xl text-white/40 mb-2">person_off</span>
        <p className="text-white/60">Member not found</p>
        <Link
          href={`/${locale}/admin/members`}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Back to Members
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span>Back to Members</span>
      </button>

      <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="size-20 rounded-full bg-customBlue/10 flex items-center justify-center text-customBlue">
            <span className="material-symbols-outlined text-4xl">person</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-white text-2xl font-bold">{member.fullName}</h1>
              {getStatusBadge(member.status)}
            </div>
            <p className="text-white/40 mt-1">Member ID: {member.memberId}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-surface-dark-lighter">
        <nav className="flex gap-6">
          {(['overview', 'attendance', 'transactions', 'health'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'text-customBlue border-customBlue' : 'text-white/60 border-transparent hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">contact_phone</span>
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="material-symbols-outlined text-white/40">phone</span>
                  <div>
                    <p className="text-white/40 text-xs">Phone</p>
                    <p className="text-white">{member.phone || '-'}</p>
                  </div>
                </div>
                {member.phone && (
                  <button
                    onClick={() => setIsSmsModalOpen(true)}
                    className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">sms</span>
                    Send SMS
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white/40">email</span>
                <div>
                  <p className="text-white/40 text-xs">Email</p>
                  <p className="text-white">{member.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white/40">emergency</span>
                <div>
                  <p className="text-white/40 text-xs">Emergency Contact</p>
                  <p className="text-white">{member.emergencyContact || '-'}</p>
                </div>
              </div>
              {member.telegramUsername && (
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-white/40">send</span>
                  <div>
                    <p className="text-white/40 text-xs">Telegram</p>
                    <p className="text-white">{member.telegramUsername}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">card_membership</span>
              Membership Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white/40">category</span>
                <div>
                  <p className="text-white/40 text-xs">Service Type</p>
                  <p className="text-white">{member.serviceType || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white/40">event</span>
                <div>
                  <p className="text-white/40 text-xs">Start Date</p>
                  <p className="text-white">{member.startDate ? formatDate(member.startDate) : '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white/40">event_busy</span>
                <div>
                  <p className="text-white/40 text-xs">End Date</p>
                  <p className="text-white">{member.endDate ? formatDate(member.endDate) : '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white/40">calendar_today</span>
                <div>
                  <p className="text-white/40 text-xs">Registered</p>
                  <p className="text-white">{formatDate(member.registrationDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter overflow-hidden">
          <div className="p-4 border-b border-surface-dark-lighter">
            <h2 className="text-white font-semibold">Recent Check-ins</h2>
            <p className="text-white/40 text-sm">{attendance?.meta.total || 0} total records</p>
          </div>
          <div className="divide-y divide-surface-dark-lighter">
            {attendance?.data.length === 0 ? (
              <div className="p-8 text-center text-white/40">
                <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">event_busy</span>
                No attendance records
              </div>
            ) : (
              attendance?.data.map((record) => (
                <div key={record.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <span className="material-symbols-outlined">login</span>
                    </div>
                    <div>
                      <p className="text-white">
                        {new Date(record.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-white/40 text-sm">
                        Check-in: {new Date(record.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter overflow-hidden">
          <div className="p-4 border-b border-surface-dark-lighter">
            <h2 className="text-white font-semibold">Transaction History</h2>
            <p className="text-white/40 text-sm">{transactions?.meta.total || 0} total transactions</p>
          </div>
          <div className="divide-y divide-surface-dark-lighter">
            {transactions?.data.length === 0 ? (
              <div className="p-8 text-center text-white/40">
                <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">receipt_long</span>
                No transactions
              </div>
            ) : (
              transactions?.data.map((transaction) => {
                const isInflow = transaction.type === 'income' || transaction.type === 'positive_return';
                return (
                  <div key={transaction.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center ${isInflow ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        <span className="material-symbols-outlined">{isInflow ? 'arrow_downward' : 'arrow_upward'}</span>
                      </div>
                      <div>
                        <p className="text-white">{transaction.description || transaction.category}</p>
                        <p className="text-white/40 text-sm">{formatDate(transaction.transactionDate)} • {transaction.paymentMethod || 'N/A'}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${isInflow ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isInflow ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter overflow-hidden">
          <div className="p-4 border-b border-surface-dark-lighter">
            <h2 className="text-white font-semibold">Health Metrics History</h2>
            <p className="text-white/40 text-sm">{healthMetrics?.meta.total || 0} total records</p>
          </div>
          <div className="divide-y divide-surface-dark-lighter">
            {healthMetrics?.data.length === 0 ? (
              <div className="p-8 text-center text-white/40">
                <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">monitoring</span>
                No health metrics recorded
              </div>
            ) : (
              healthMetrics?.data.map((metric) => (
                <div key={metric.id} className="p-6">
                  <p className="text-white font-medium mb-4">
                    {new Date(metric.measuredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {metric.weight != null && (
                      <div className="bg-surface-dark-lighter/30 rounded-lg p-3 border border-surface-dark-lighter/50">
                        <p className="text-white/40 text-xs mb-1">Weight</p>
                        <p className="text-white font-semibold">{metric.weight.toFixed(1)} kg</p>
                      </div>
                    )}
                    {metric.bmi != null && (
                      <div className="bg-surface-dark-lighter/30 rounded-lg p-3 border border-surface-dark-lighter/50">
                        <p className="text-white/40 text-xs mb-1">BMI</p>
                        <p className="text-white font-semibold">{metric.bmi.toFixed(1)}</p>
                      </div>
                    )}
                    {metric.bodyFatPercent != null && (
                      <div className="bg-surface-dark-lighter/30 rounded-lg p-3 border border-surface-dark-lighter/50">
                        <p className="text-white/40 text-xs mb-1">Body Fat</p>
                        <p className="text-white font-semibold">{metric.bodyFatPercent.toFixed(1)}%</p>
                      </div>
                    )}
                    {metric.muscleMass != null && (
                      <div className="bg-surface-dark-lighter/30 rounded-lg p-3 border border-surface-dark-lighter/50">
                        <p className="text-white/40 text-xs mb-1">Muscle Mass</p>
                        <p className="text-white font-semibold">{metric.muscleMass.toFixed(1)} kg</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <SmsSendModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        initialPhone={member.phone || ''}
        onSuccess={() => setIsSmsModalOpen(false)}
      />
    </div>
  );
}
