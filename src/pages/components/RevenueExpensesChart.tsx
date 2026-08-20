import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { analyticsService } from '../../services/AnalyticsService';
import type { RevenuePoint } from '../analyticsHelpers';

interface RevenueExpensesChartProps {
  revenueData: RevenuePoint[];
}

const RevenueExpensesChart: React.FC<RevenueExpensesChartProps> = ({ revenueData }) => {
  if (revenueData.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue vs Expenses</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" stroke="#6b7280" />
            <YAxis 
              stroke="#6b7280"
              tickFormatter={(value) => analyticsService.formatCurrency(value).replace('R', '')}
            />
            <Tooltip 
              formatter={(value) => [analyticsService.formatCurrency(Number(value)), '']}
              labelFormatter={(label) => `Period: ${label}`}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="revenue" fill="#0ea5e9" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueExpensesChart;
