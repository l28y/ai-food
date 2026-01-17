import React from 'react';
import { Leaf, Scale } from 'lucide-react';

const SuggestionSection = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;
  
  return (
    <section className="mb-10 bg-white rounded-2xl shadow-sm border border-[#e0e0e0] p-6">
      <h2 className="text-2xl font-bold text-[#333333] mb-6">个性化饮食建议</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="flex items-start p-5 rounded-xl border border-[#e0e0e0] hover:shadow-sm transition-shadow"
          >
            <div className="mr-4 mt-1">
              {suggestion.type === 'substitute' ? (
                <div className="p-2 bg-[#f0f7f4] rounded-lg">
                  <Leaf className="text-[#40c080]" size={24} />
                </div>
              ) : (
                <div className="p-2 bg-[#f0f7f4] rounded-lg">
                  <Scale className="text-[#40c080]" size={24} />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {suggestion.type === 'substitute' ? '替代建议' : '摄入指导'}
              </h3>
              <p className="text-[#666666]">{suggestion.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuggestionSection;