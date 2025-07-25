const TabNavigation: React.FC<{
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  showCreateTab: boolean;
  setCreateTab: (value: boolean) => void;
}> = ({ tabs, activeTab, onTabChange, showCreateTab, setCreateTab }) => {
  return (
    <nav className="border-b border-gray-200 max-w-7xl mx-auto px-6 mt-4">
      <ul className="flex flex-row space-x-6 text-sm font-medium text-gray-600">
        {tabs.map((tab) => (
          <li key={tab}>
            <button
              onClick={() => onTabChange(tab)}
              className={`pb-2 border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          </li>
        ))}
        <button
          onClick={() => {
            setCreateTab(true);
          }}
          className={
            showCreateTab
              ? 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'
              : 'hidden'
          }
        >
          + Create
        </button>
      </ul>
    </nav>
  );
};

export default TabNavigation;
