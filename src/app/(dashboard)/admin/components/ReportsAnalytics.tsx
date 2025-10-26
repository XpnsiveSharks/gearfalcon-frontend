import React from 'react';
import { Download } from 'lucide-react';

const ReportsAnalytics: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        
        <button className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <Download size={18} />
          Export All Reports
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Report */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Report</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-base font-semibold text-gray-900">N/A</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Month</span>
              <span className="text-base font-semibold text-gray-900">N/A</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600">Growth</span>
              <span className="text-base font-semibold text-green-600">N/A</span>
            </div>
          </div>
        </div>

        {/* Service Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Service Performance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-base font-semibold text-gray-900">N/A</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Rating</span>
              <span className="text-base font-semibold text-gray-900">N/A</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-base font-semibold text-gray-900">N/A</span>
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Metrics</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Customers</span>
              <span className="text-base font-semibold text-gray-900">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New This Month</span>
              <span className="text-base font-semibold text-gray-900">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Retention Rate</span>
              <span className="text-base font-semibold text-gray-900">N/A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Detailed Analytics</h2>
          <p className="text-sm text-gray-500">Comprehensive business insights and performance metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Categories Performance */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Service Categories Performance</h3>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center py-4">No performance data available.</p>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center py-4">No geographic data available.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;