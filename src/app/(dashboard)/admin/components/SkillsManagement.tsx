"use client";

import React from 'react';
import { Plus, Wrench, Loader2 } from 'lucide-react';
import { useSkills } from './Hooks/useSkills';

const SkillsManagement: React.FC = () => {
  const { skills, loading, error } = useSkills();

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Skills Management</h1>
        <button className="w-full md:w-auto justify-center px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
          <Plus size={18} />
          Add New Skill
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-18rem)]">
        <h2 className="text-lg font-bold text-gray-900 p-6 border-b border-gray-100">Available Skills</h2>
        <div className="space-y-4 overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 text-sm py-8">
              <p>{error}</p>
            </div>
          ) : skills.length > 0 ? (
            skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                  <p className="text-sm text-gray-600">{skill.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench size={20} className="text-gray-400" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No skills found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsManagement;