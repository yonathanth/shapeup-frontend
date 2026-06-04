'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { staffApi, Staff, StaffAttendance, PaginatedResponse } from '@/lib/api';
import DataTable, { Pagination, type Column } from '../components/DataTable';
import StatsCard from '../components/StatsCard';

function toDateOnly(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMonthRange() {
  const d = new Date();
  return {
    from: toDateOnly(new Date(d.getFullYear(), d.getMonth(), 1)),
    to: toDateOnly(new Date(d.getFullYear(), d.getMonth() + 1, 0)),
  };
}

function getWeekRange() {
  const d = new Date();
  const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
  const from = new Date(d.getFullYear(), d.getMonth(), diff);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  return { from: toDateOnly(from), to: toDateOnly(to) };
}

export default function StaffPage() {
  const [staff, setStaff] = useState<PaginatedResponse<Staff> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [dateInput, setDateInput] = useState(() => new Date().toISOString().slice(0, 10));
  const [dailyRecords, setDailyRecords] = useState<StaffAttendance[]>([]);
  const [dailyLoading, setDailyLoading] = useState(false);

  const [historyStaff, setHistoryStaff] = useState<Staff | null>(null);
  const [historyRangePreset, setHistoryRangePreset] = useState<'week' | 'month' | 'custom'>('month');
  const [historyFrom, setHistoryFrom] = useState(() => getMonthRange().from);
  const [historyTo, setHistoryTo] = useState(() => getMonthRange().to);
  const [historyRecords, setHistoryRecords] = useState<StaffAttendance[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await staffApi.getAll({ page, limit, search: search.trim() || undefined });
      setStaff(data);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  const fetchDailyLog = useCallback(async () => {
    if (!dateInput) return;
    setDailyLoading(true);
    try {
      const list = await staffApi.getAttendanceByDate(dateInput);
      setDailyRecords(list);
    } catch (err) {
      console.error('Failed to fetch daily log:', err);
      setDailyRecords([]);
    } finally {
      setDailyLoading(false);
    }
  }, [dateInput]);

  const fetchHistory = useCallback(async () => {
    if (!historyStaff) return;
    setHistoryLoading(true);
    try {
      const list = await staffApi.getAttendanceByStaff(historyStaff.id, historyFrom, historyTo);
      setHistoryRecords(list);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setHistoryRecords([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [historyStaff, historyFrom, historyTo]);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);
  useEffect(() => { fetchDailyLog(); }, [fetchDailyLog]);
  useEffect(() => { if (historyStaff) fetchHistory(); }, [historyStaff, historyFrom, historyTo, fetchHistory]);
  useEffect(() => {
    if (historyRangePreset === 'week') { const r = getWeekRange(); setHistoryFrom(r.from); setHistoryTo(r.to); }
    else if (historyRangePreset === 'month') { const r = getMonthRange(); setHistoryFrom(r.from); setHistoryTo(r.to); }
  }, [historyRangePreset]);

  const historyByDay = useMemo(() => {
    const map = new Map<string, StaffAttendance[]>();
    for (const r of historyRecords) {
      const day = r.scannedAt ? r.scannedAt.slice(0, 10) : '';
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(r);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [historyRecords]);

  const historyTotalDays = useMemo(() => {
    if (!historyFrom || !historyTo) return 0;
    return Math.max(0, Math.ceil((new Date(historyTo).getTime() - new Date(historyFrom).getTime()) / 86400000) + 1);
  }, [historyFrom, historyTo]);

  const formatTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '—' : d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const isToday = dateInput === new Date().toISOString().slice(0, 10);

  const columns: Column<Staff>[] = [
    {
      key: 'staff',
      header: 'Staff',
      render: (s: Staff) => (
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-lg">badge</span>
          </div>
          <div>
            <p className="text-white font-medium">{s.fullName}</p>
            <p className="text-white/40 text-xs">ID {s.localId}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (s: Staff) => s.role || '—' },
    { key: 'phone', header: 'Phone', render: (s: Staff) => s.phoneNumber || '—' },
    {
      key: 'actions',
      header: '',
      className: 'w-32 text-right',
      render: (s: Staff) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setHistoryStaff(s);
            setHistoryRangePreset('month');
            const r = getMonthRange();
            setHistoryFrom(r.from);
            setHistoryTo(r.to);
          }}
          className="text-primary hover:text-primary/80 text-sm font-medium"
        >
          Attendance history
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-white text-2xl font-bold">Staff</h1>
        <p className="text-white/60 mt-1">Staff list and attendance (synced from desktop app)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total Staff" value={staff?.meta?.total ?? 0} icon="group" color="blue" />
        <StatsCard title="Check-ins Today" value={isToday ? dailyRecords.length : '—'} icon="login" color="green" />
      </div>

      <div>
        <div className="mb-4">
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchStaff(); }} className="flex gap-2">
            <input
              type="text"
              placeholder="Search name, phone, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 px-4 bg-surface-dark-lighter border border-surface-dark-lighter rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 w-64"
            />
            <button type="submit" className="h-10 px-6 bg-primary text-black font-medium rounded-lg hover:bg-primary/90">Search</button>
          </form>
        </div>
        <DataTable<Staff>
          columns={columns}
          data={staff?.data ?? []}
          keyExtractor={(s) => s.id}
          isLoading={isLoading}
          emptyMessage="No staff found"
        />
        {staff && <Pagination currentPage={staff.meta.page} totalPages={staff.meta.totalPages} onPageChange={setPage} />}
      </div>

      <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter p-6">
        <h2 className="text-white font-semibold mb-4">Daily log (staff check-ins)</h2>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-white/60 text-sm">Date</label>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="h-10 px-4 bg-surface-dark-lighter border border-surface-dark-lighter rounded-lg text-white focus:outline-none focus:border-primary/50"
          />
        </div>
        {dailyLoading ? (
          <p className="text-white/60 py-4">Loading...</p>
        ) : dailyRecords.length === 0 ? (
          <p className="text-white/40 text-sm">No staff attendance for this date</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {dailyRecords.map((record) => (
              <div key={record.id} className="flex items-center gap-2 px-3 py-2 bg-surface-dark-lighter rounded-lg">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-sm">badge</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{record.staff?.fullName ?? 'Unknown'}</p>
                  <p className="text-white/40 text-xs">{formatTime(record.scannedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {historyStaff && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setHistoryStaff(null)}>
          <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter max-w-lg w-full max-h-[85vh] overflow-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-surface-dark-lighter flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Attendance history – {historyStaff.fullName}</h3>
              <button type="button" onClick={() => setHistoryStaff(null)} className="text-white/60 hover:text-white p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {(['week', 'month', 'custom'] as const).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setHistoryRangePreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${historyRangePreset === preset ? 'bg-primary text-black' : 'bg-surface-dark-lighter text-white/80 hover:text-white'}`}
                  >
                    {preset === 'week' ? 'This week' : preset === 'month' ? 'This month' : 'Custom'}
                  </button>
                ))}
                {historyRangePreset === 'custom' && (
                  <>
                    <input type="date" value={historyFrom} onChange={(e) => setHistoryFrom(e.target.value)} className="h-9 px-3 bg-surface-dark-lighter border border-surface-dark-lighter rounded-lg text-white text-sm" />
                    <span className="text-white/60 text-sm self-center">to</span>
                    <input type="date" value={historyTo} onChange={(e) => setHistoryTo(e.target.value)} className="h-9 px-3 bg-surface-dark-lighter border border-surface-dark-lighter rounded-lg text-white text-sm" />
                  </>
                )}
              </div>
              <p className="text-white/60 text-sm">
                <strong className="text-white">{historyByDay.length}</strong> / {historyTotalDays} days with attendance
              </p>
              {historyLoading ? (
                <p className="text-white/60 py-4">Loading...</p>
              ) : historyByDay.length === 0 ? (
                <p className="text-white/40 text-sm">No attendance in this range</p>
              ) : (
                <div className="space-y-3">
                  {historyByDay.map(([day, records]) => (
                    <div key={day} className="p-3 bg-surface-dark-lighter rounded-lg">
                      <p className="font-medium text-white text-sm mb-2">
                        {new Date(day).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      {records.map((r, idx) => (
                        <p key={r.id} className="text-white/70 text-xs">
                          {idx % 2 === 0 ? 'Check-in' : 'Check-out'} {formatTime(r.scannedAt)}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
