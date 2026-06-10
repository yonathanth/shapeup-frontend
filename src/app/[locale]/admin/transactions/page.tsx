'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
  transactionsApi,
  Transaction,
  TransactionType,
  PaginatedResponse,
} from '@/lib/api';
import DataTable, { Pagination, type Column } from '../components/DataTable';
import StatsCard from '../components/StatsCard';

function sanitizeText(s: string): string {
  return s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDateForExport(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 10);
}

function formatDateTimeForExport(d: Date): string {
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  income: 'Income',
  expense: 'Expense',
  positive_return: 'Positive Return',
  negative_return: 'Negative Return',
};

function isInflow(type: TransactionType): boolean {
  return type === 'income' || type === 'positive_return';
}

type DatePreset = 'daily' | 'this_week' | 'this_month' | 'this_year' | 'custom';

function toYmd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function startOfWeekMonday(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  const diff = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - diff);
  return copy;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<PaginatedResponse<Transaction> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [datePreset, setDatePreset] = useState<DatePreset>('daily');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [summaryTotals, setSummaryTotals] = useState({ income: 0, outflows: 0, net: 0 });
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const limit = 10;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(amount);

  const getEffectiveDateRange = useCallback((): { startDate?: string; endDate?: string } => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (datePreset === 'custom') return { startDate: customStartDate || undefined, endDate: customEndDate || undefined };
    if (datePreset === 'daily') { const ymd = toYmd(now); return { startDate: ymd, endDate: ymd }; }
    if (datePreset === 'this_week') { const start = startOfWeekMonday(now); return { startDate: toYmd(start), endDate: toYmd(now) }; }
    if (datePreset === 'this_month') { const start = new Date(now.getFullYear(), now.getMonth(), 1); return { startDate: toYmd(start), endDate: toYmd(now) }; }
    if (datePreset === 'this_year') { const start = new Date(now.getFullYear(), 0, 1); return { startDate: toYmd(start), endDate: toYmd(now) }; }
    return {};
  }, [customEndDate, customStartDate, datePreset]);

  const fetchAllForExport = useCallback(async (): Promise<Transaction[]> => {
    const all: Transaction[] = [];
    const pageLimit = 100;
    let pageNum = 1;
    let hasMore = true;
    const { startDate, endDate } = getEffectiveDateRange();
    while (hasMore) {
      const res = await transactionsApi.getAll({ page: pageNum, limit: pageLimit, transactionType: (typeFilter as TransactionType) || undefined, startDate, endDate });
      all.push(...res.data);
      hasMore = res.data.length === pageLimit && pageNum * pageLimit < res.meta.total;
      pageNum++;
    }
    return all;
  }, [typeFilter, getEffectiveDateRange]);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const { startDate, endDate } = getEffectiveDateRange();
      const data = await transactionsApi.getAll({ page, limit, transactionType: (typeFilter as TransactionType) || undefined, startDate, endDate });
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, typeFilter, getEffectiveDateRange]);

  const fetchSummaryTotals = useCallback(async () => {
    try {
      const allTx = await fetchAllForExport();
      const totals = allTx.reduce((acc, tx) => {
        if (isInflow(tx.type)) acc.income += tx.amount;
        else acc.outflows += tx.amount;
        return acc;
      }, { income: 0, outflows: 0, net: 0 });
      totals.net = totals.income - totals.outflows;
      setSummaryTotals(totals);
    } catch (err) {
      console.error('Failed to fetch summary totals:', err);
    }
  }, [fetchAllForExport]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
  useEffect(() => { fetchSummaryTotals(); }, [fetchSummaryTotals]);
  useEffect(() => { setPage(1); }, [datePreset]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const getTypeBadgeClass = (type: TransactionType) => {
    const map: Record<TransactionType, string> = {
      income: 'bg-emerald-500/10 text-emerald-400',
      expense: 'bg-red-500/10 text-red-400',
      positive_return: 'bg-teal-500/10 text-teal-400',
      negative_return: 'bg-amber-500/10 text-amber-400',
    };
    return map[type] || 'bg-gray-500/10 text-gray-400';
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'type',
      header: 'Type',
      render: (t: Transaction) => (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadgeClass(t.type)}`}>
          <span className="material-symbols-outlined text-sm">{isInflow(t.type) ? 'arrow_downward' : 'arrow_upward'}</span>
          {TRANSACTION_TYPE_LABELS[t.type] ?? t.type}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (t: Transaction) => (
        <div>
          <p className="text-white font-medium">{t.description || t.category}</p>
          {t.member && <p className="text-white/40 text-xs">{t.member.fullName}</p>}
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (t: Transaction) => <span className="text-white/80 capitalize">{t.category}</span> },
    { key: 'date', header: 'Date', render: (t: Transaction) => <span className="text-white/80">{formatDate(t.transactionDate)}</span> },
    { key: 'paymentMethod', header: 'Payment', render: (t: Transaction) => <span className="text-white/60 capitalize">{t.paymentMethod || 'N/A'}</span> },
    {
      key: 'amount',
      header: 'Amount',
      className: 'text-right',
      render: (t: Transaction) => (
        <span className={`font-semibold ${isInflow(t.type) ? 'text-emerald-400' : 'text-red-400'}`}>
          {isInflow(t.type) ? '+' : '-'}{formatCurrency(t.amount)}
        </span>
      ),
    },
    { key: 'actions', header: '', className: 'w-12 text-right', render: () => <span className="material-symbols-outlined text-white/40">chevron_right</span> },
  ];

  const handleExport = async (format: 'pdf' | 'excel') => {
    setExporting(true);
    setShowExportMenu(false);
    try {
      const allTx = await fetchAllForExport();
      const exportTotals = allTx.reduce((acc, tx) => {
        if (isInflow(tx.type)) acc.income += tx.amount;
        else acc.expense += tx.amount;
        return acc;
      }, { income: 0, expense: 0, net: 0 });
      exportTotals.net = exportTotals.income - exportTotals.expense;
      const now = new Date();
      const filenameBase = `finance-export-${now.toISOString().slice(0, 10)}`;

      if (format === 'excel') {
        const lines: string[] = [];
        lines.push('"FINANCIAL REPORT"');
        lines.push(`"Generated: ${formatDateTimeForExport(now)}"`);
        lines.push('');
        lines.push('"SUMMARY"');
        lines.push(`"Total Income","${exportTotals.income.toFixed(2)} ETB"`);
        lines.push(`"Total Expenses","${exportTotals.expense.toFixed(2)} ETB"`);
        lines.push(`"Net Profit","${exportTotals.net.toFixed(2)} ETB"`);
        lines.push('');
        lines.push('"Date","Type","Description","Member","Payment Method","Category","Amount (ETB)"');
        allTx.forEach((tx) => {
          const row = [
            formatDateForExport(tx.transactionDate),
            TRANSACTION_TYPE_LABELS[tx.type] ?? tx.type,
            tx.description || tx.category || '',
            tx.member?.fullName || '-',
            tx.paymentMethod || '-',
            tx.category || '-',
            (isInflow(tx.type) ? '+' : '-') + tx.amount.toFixed(2),
          ];
          lines.push(row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','));
        });
        const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/csv' });
        triggerDownload(blob, `${filenameBase}.csv`);
      } else {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        let page = pdfDoc.addPage([842, 595]);
        let y = 595 - 50;
        const margin = 50;

        const addLine = (text: string, bold = false, size = 10) => {
          if (y < margin + 14) { page = pdfDoc.addPage([842, 595]); y = 595 - margin; }
          page.drawText(sanitizeText(text), { x: margin, y, size, font: bold ? fontBold : font, color: rgb(0, 0, 0) });
          y -= 16;
        };

        addLine('Financial Report', true, 16);
        addLine(`Generated: ${formatDateTimeForExport(now)}`, false, 10);
        y -= 8;
        addLine(`Total Income: ${exportTotals.income.toFixed(2)} ETB`);
        addLine(`Total Expenses: ${exportTotals.expense.toFixed(2)} ETB`);
        addLine(`Net Profit: ${exportTotals.net.toFixed(2)} ETB`);
        y -= 8;
        allTx.forEach((tx) => {
          addLine(`${formatDateForExport(tx.transactionDate)} | ${TRANSACTION_TYPE_LABELS[tx.type]} | ${(tx.description || tx.category || '').substring(0, 30)} | ${(isInflow(tx.type) ? '+' : '-') + tx.amount.toFixed(2)} ETB`);
        });

        const blob = new Blob([await pdfDoc.save()], { type: 'application/pdf' });
        triggerDownload(blob, `${filenameBase}.pdf`);
      }
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (!showExportMenu) return;
    const handler = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) setShowExportMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showExportMenu]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Transactions</h1>
          <p className="text-white/60 mt-1">Manage income, outflows, and returns</p>
        </div>
        <div className="relative" ref={exportMenuRef}>
          <button
            type="button"
            onClick={() => setShowExportMenu((v) => !v)}
            disabled={exporting}
            className="h-10 px-4 flex items-center gap-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            {exporting ? 'Exporting...' : 'Export'}
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1 py-1 min-w-[160px] bg-surface-dark border border-surface-dark-lighter rounded-lg shadow-xl z-20">
              <button type="button" onClick={() => handleExport('pdf')} disabled={exporting} className="w-full px-4 py-2 text-left text-white hover:bg-surface-dark-lighter flex items-center gap-2 disabled:opacity-60">
                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>PDF
              </button>
              <button type="button" onClick={() => handleExport('excel')} disabled={exporting} className="w-full px-4 py-2 text-left text-white hover:bg-surface-dark-lighter flex items-center gap-2 disabled:opacity-60">
                <span className="material-symbols-outlined text-lg">table_chart</span>Excel (CSV)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter p-4">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchTransactions(); }} className="flex flex-col sm:flex-row gap-4">
          <select value={datePreset} onChange={(e) => setDatePreset(e.target.value as DatePreset)} className="h-10 px-4 bg-surface-dark-lighter border border-surface-dark-lighter rounded-lg text-white focus:outline-none focus:border-primary/50">
            <option value="daily">Daily</option>
            <option value="this_week">This week</option>
            <option value="this_month">This month</option>
            <option value="this_year">This year</option>
            <option value="custom">Custom</option>
          </select>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="h-10 px-4 bg-surface-dark-lighter border border-surface-dark-lighter rounded-lg text-white focus:outline-none focus:border-primary/50">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="positive_return">Positive Return</option>
            <option value="negative_return">Negative Return</option>
          </select>
          <input type="date" value={datePreset === 'custom' ? customStartDate : ''} onChange={(e) => { setDatePreset('custom'); setCustomStartDate(e.target.value); setPage(1); }} disabled={datePreset !== 'custom'} className="h-10 px-4 bg-surface-dark-lighter border border-surface-dark-lighter rounded-lg text-white focus:outline-none focus:border-primary/50 disabled:opacity-50" />
          <input type="date" value={datePreset === 'custom' ? customEndDate : ''} onChange={(e) => { setDatePreset('custom'); setCustomEndDate(e.target.value); setPage(1); }} disabled={datePreset !== 'custom'} className="h-10 px-4 bg-surface-dark-lighter border border-surface-dark-lighter rounded-lg text-white focus:outline-none focus:border-primary/50 disabled:opacity-50" />
          <button type="submit" className="h-10 px-6 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">Filter</button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total Income" value={formatCurrency(summaryTotals.income)} icon="trending_up" color="green" />
        <StatsCard title="Total Outflows" value={formatCurrency(summaryTotals.outflows)} icon="trending_down" color="red" />
        <StatsCard title="Net Profit" value={formatCurrency(summaryTotals.net)} icon="account_balance" color="primary" />
      </div>

      <div>
        <DataTable<Transaction>
          columns={columns}
          data={transactions?.data || []}
          keyExtractor={(t) => t.id}
          isLoading={isLoading}
          emptyMessage="No transactions found"
        />
        {transactions && (
          <Pagination currentPage={transactions.meta.page} totalPages={transactions.meta.totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
