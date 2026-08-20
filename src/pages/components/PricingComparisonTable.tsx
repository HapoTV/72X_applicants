import React from 'react';
import { comparisonRows } from '../pricingHelpers';

const PricingComparisonTable: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">Compare plans and features</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Grow your audience</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Start-up</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Essential</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 px-4 text-sm text-gray-700">{row.feature}</td>
                  <td className="py-2.5 px-4 text-center text-sm text-gray-700">{row.a}</td>
                  <td className="py-2.5 px-4 text-center text-sm text-gray-700">{row.b}</td>
                  <td className="py-2.5 px-4 text-center text-sm text-gray-700">{row.c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PricingComparisonTable;
