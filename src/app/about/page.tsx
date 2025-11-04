import React from 'react';
import { Award, Target, Eye, Users } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl shadow-lg p-12 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Gearfalcon Electro-Mechanical Services</h1>
          <p className="text-xl text-blue-50 mb-2">Sole Proprietorship</p>
          <p className="text-lg text-blue-100">Excellence in HVAC, Electrical & Fire Protection Services Since 2005</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Our company was started in 2005 by Alberto R. Mabale as a one-man service. Only in 2014, it was fully made operational with over a thousand satisfied customers.
          </p>
          <p className="text-gray-700 leading-relaxed">
            GEARFALCON Electro-Mechanical Services has evolved into a company that truly puts the customer's needs first. We attribute our growth and success to repeat business and customer referrals. We offer a full range of high quality services, providing total home comfort. We are your local air conditioning, electrical, fire protection, CCTV, data cabling & control quality experts and we're proud to serve with our 100% satisfaction guarantee.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Target className="text-blue-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We are a growing team of experts passionately dedicated to identify our client's needs and provide the best solution in air conditioning, electrical, fire protection, data cabling & control.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Words like "efficient" and "reliable" have honest meaning beyond marketing.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Our people and their skills and experience to deliver the best solution for each project.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Offering only safe and environment friendly solutions in every condition.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Eye className="text-purple-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              GEARFALCON Electro-Mechanical Services vision is to be recognized as a company whose success is built upon quality service and continuous improvement. Our objective is to become the standard of excellence when it comes to providing total comfort.
            </p>
            <div className="mt-4 p-4 bg-purple-50 rounded-xl">
              <p className="text-sm font-semibold text-purple-900 mb-2">Core Values:</p>
              <p className="text-sm text-purple-800">Involvement, training, teamwork, trust and respect are an essential part of our vision.</p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-50 rounded-xl">
              <Award className="text-green-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              'Air Conditioning Installation',
              'HVAC Maintenance & Repair',
              'Electrical Services',
              'Fire Protection Systems',
              'CCTV Installation',
              'Data Cabling & Control',
              'VRF System Installation',
              'Ductwork & Air Balancing',
              'Preventive Maintenance'
            ].map((service, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <p className="text-sm font-medium text-gray-900">{service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Users className="text-yellow-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Leadership Team</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AM</span>
              </div>
              <h3 className="font-bold text-gray-900">Alberto R. Mabale</h3>
              <p className="text-sm text-gray-600">Proprietor</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">BM</span>
              </div>
              <h3 className="font-bold text-gray-900">Brenda P. Mabale</h3>
              <p className="text-sm text-gray-600">Payroll Officer</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">BD</span>
              </div>
              <h3 className="font-bold text-gray-900">Bertelyn Del Bulig</h3>
              <p className="text-sm text-gray-600">Accountant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;