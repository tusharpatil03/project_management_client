import React from 'react';

interface TabNavigationProps {
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  showCreateTab: boolean;
  setCreateTab: (value: boolean) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  showCreateTab, 
  setCreateTab 
}) => {
  return (
    <div className="border-b border-gray-200 mx-auto px-6 mt-4">
      <div className="flex items-center justify-between">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </nav>
        
        {showCreateTab && (
          <button
            onClick={() => setCreateTab(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Sprint
          </button>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;