import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Download, BarChart3, TrendingUp, Gem, Calendar, ArrowUpRight, PieChart } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { orders, products, customers, showToast } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('Current FY 2026-27');

  const totalVolume = orders.reduce((sum, o) => sum + o.totalQuantity, 0);
  const totalDispatched = orders.reduce((sum, o) => sum + o.dispatchedQuantity, 0);
  const totalPending = orders.reduce((sum, o) => sum + o.pendingQuantity, 0);
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Model-wise statistics
  const modelStats: Record<string, { model: string; name: string; qty: number; value: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!modelStats[item.modelNumber]) {
        modelStats[item.modelNumber] = {
          model: item.modelNumber,
          name: item.productName,
          qty: 0,
          value: 0
        };
      }
      modelStats[item.modelNumber].qty += item.quantity;
      modelStats[item.modelNumber].value += item.quantity * item.price;
    });
  });

  const topModels = Object.values(modelStats)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Monthly Sales trend mock data
  const monthlyData = [
    { month: 'Apr 26', orders: 12, value: 4200000 },
    { month: 'May 26', orders: 15, value: 5800000 },
    { month: 'Jun 26', orders: 18, value: 7200000 },
    { month: 'Jul 26', orders: 22, value: 9100000 },
    { month: 'Aug 26', orders: 28, value: 13500000 },
    { month: 'Sep 26', orders: 34, value: 18450000 }
  ];

  const handleExport = () => {
    showToast('Report Generated', 'success', 'Downloaded wholesale analytics report in PDF format');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Business & Production Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Wholesale turnover, party-wise distribution, model velocities, and factory capacity metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
          >
            <option>Current FY 2026-27</option>
            <option>Q2 (Jul - Sep 2026)</option>
            <option>Last 30 Days</option>
          </select>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download Report
          </Button>
        </div>
      </div>

      {/* KPI Top Row */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-soft p-3.5 sm:p-4 bg-white border border-slate-200">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total B2B Turnover
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {formatCurrency(totalSales, true)}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +28.4% vs last quarter
          </div>
        </div>

        <div className="card-soft p-3.5 sm:p-4 bg-white border border-slate-200">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Pieces Booked
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {totalVolume} pcs
          </div>
          <div className="text-xs text-slate-500 mt-1">Across 10 verified party networks</div>
        </div>

        <div className="card-soft p-3.5 sm:p-4 bg-white border border-slate-200">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Dispatched via Armoured Cargo
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1 font-mono">
            {totalDispatched} pcs
          </div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">
            {Math.round((totalDispatched / (totalVolume || 1)) * 100)}% Fulfilled
          </div>
        </div>

        <div className="card-soft p-3.5 sm:p-4 bg-white border border-slate-200">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Work in Progress (Factory)
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-1 font-mono">
            {totalPending} pcs
          </div>
          <div className="text-xs text-amber-700 mt-1 font-medium">Casting & Finishing queue</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend Visual Bar Chart */}
        <div className="lg:col-span-2 card-soft p-4 sm:p-5 bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Monthly Wholesale Turnover (₹)
              </h3>
              <p className="text-xs text-slate-500">Gross order booking volume through current fiscal year</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 self-start sm:self-auto">
              Avg ₹97.8 L / month
            </span>
          </div>

          {/* Custom SVG Bar Chart with internal controlled overflow */}
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <div className="h-56 min-w-[280px] flex items-end justify-between gap-3 pt-6 px-2">
              {monthlyData.map((d) => {
                const maxVal = 20000000;
                const heightPercent = Math.round((d.value / maxVal) * 100);

                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-mono font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(d.value / 100000).toFixed(0)}L
                    </span>
                    <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden h-40 flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-[#0b1e36] to-blue-600 group-hover:to-amber-500 rounded-t-lg transition-all duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top 5 High Velocity Models */}
        <div className="card-soft p-4 sm:p-5 bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Top Selling Models
            </h3>
            <span className="text-xs text-slate-400 font-semibold">By Pieces</span>
          </div>

          <div className="space-y-3">
            {topModels.map((m, idx) => {
              const maxPcs = topModels[0]?.qty || 1;
              const width = Math.round((m.qty / maxPcs) * 100);

              return (
                <div key={m.model} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono font-bold text-slate-900">
                      #{idx + 1} {m.model}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{m.qty} pcs</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{m.name}</div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${width}%` }}
                      className="h-full bg-[#0b1e36] rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Party-Wise Performance Table */}
      <div className="card-soft overflow-hidden bg-white border border-slate-200 shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Party-Wise Order Summary & Outstanding Aging
            </h3>
            <p className="text-xs text-slate-500">Retailer procurement totals and payment status</p>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Party Name</th>
                <th className="py-3 px-3">City</th>
                <th className="py-3 px-3 text-center">Orders</th>
                <th className="py-3 px-3 text-center">Total Pcs</th>
                <th className="py-3 px-3 text-right">Turnover</th>
                <th className="py-3 px-3 text-right">Outstanding Due</th>
                <th className="py-3 px-4 text-center">Payment Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => {
                const cOrders = orders.filter((o) => o.customerId === c.id || o.customerName === c.partyName);
                const cPcs = cOrders.reduce((sum, o) => sum + o.totalQuantity, 0);
                const cVal = cOrders.reduce((sum, o) => sum + o.totalAmount, 0);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.partyName}</td>
                    <td className="py-3 px-3 text-slate-600">{c.city}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                      {cOrders.length}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-blue-900">
                      {cPcs} pcs
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(cVal, true)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-700">
                      {formatCurrency(c.outstanding, true)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Good Standing
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards View */}
        <div className="md:hidden divide-y divide-slate-100">
          {customers.map((c) => {
            const cOrders = orders.filter((o) => o.customerId === c.id || o.customerName === c.partyName);
            const cPcs = cOrders.reduce((sum, o) => sum + o.totalQuantity, 0);
            const cVal = cOrders.reduce((sum, o) => sum + o.totalAmount, 0);

            return (
              <div key={c.id} className="p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs truncate">{c.partyName}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex-shrink-0">
                    Good Standing
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">{c.city} • {cOrders.length} Orders ({cPcs} pcs)</div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Turnover</span>
                    <span className="font-bold text-slate-900">{formatCurrency(cVal, true)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Due</span>
                    <span className="font-bold text-rose-700">{formatCurrency(c.outstanding, true)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
