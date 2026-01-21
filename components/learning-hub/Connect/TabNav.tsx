import React from 'react';
import { Briefcase, Plane, TrendingUp, Users, Menu, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs = [
  { id: 'opportunities', label: 'Member Opportunities', icon: Briefcase, shortLabel: 'Opportunities' },
  { id: 'trips', label: 'Business Trips', icon: Plane, shortLabel: 'Trips' },
  { id: 'investments', label: 'Investment Opportunities', icon: TrendingUp, shortLabel: 'Investments' },
  { id: 'network', label: 'Connections', icon: Users, shortLabel: 'Network' },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  return (
    <>
    
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-[#9FC93B] text-[#9FC93B] bg-[#9FC93B]/5'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 md:hidden">
        <div className="px-4">
          
          <div className="flex items-center justify-between py-3">
           
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 text-gray-700 font-medium"
            >
              <Menu className="w-5 h-5" />
              <span className="text-sm">
                {tabs.find(tab => tab.id === activeTab)?.shortLabel || 'Menu'}
              </span>
            </button>
            
            {/* Active Tab Indicator */}
            <div className="flex items-center gap-2">
              {(() => {
                const activeTabData = tabs.find(tab => tab.id === activeTab);
                const Icon = activeTabData?.icon;
                return Icon ? <Icon className="w-5 h-5 text-[#9FC93B]" /> : null;
              })()}
              <span className="text-xs text-gray-500">Active</span>
            </div>
          </div>
          
          
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50"
            >
              <div className="py-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabChange(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-3 text-left transition-colors duration-200 ${
                        isActive
                          ? 'bg-[#9FC93B]/10 text-[#9FC93B]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#9FC93B]' : 'text-gray-500'}`} />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-[#9FC93B]" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
          
          
          <div className="flex gap-2 py-3 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#9FC93B] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  {tab.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}