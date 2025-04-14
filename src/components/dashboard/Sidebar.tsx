import { 
  ChartBarIcon, 
  KeyIcon, 
  CreditCardIcon, 
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  sidebarCollapsed, 
  setSidebarCollapsed 
}: SidebarProps) {
  return (
    <div className={`fixed top-0 left-0 z-10 bg-gradient-to-b from-blue-900 to-indigo-900 text-white transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} h-screen`}>
      <div className="p-4 flex items-center justify-between">
        {!sidebarCollapsed && <h1 className="text-xl font-bold">VertexAI</h1>}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1 rounded-full hover:bg-blue-800"
        >
          {sidebarCollapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
        </button>
      </div>
      <nav className="mt-8">
        <div 
          className={`flex items-center px-4 py-3 ${activeTab === 'analytics' ? 'bg-blue-800' : 'hover:bg-blue-800'} cursor-pointer`}
          onClick={() => setActiveTab('analytics')}
        >
          <ChartBarIcon className="h-6 w-6" />
          {!sidebarCollapsed && <span className="ml-3">Usage Analytics</span>}
        </div>
        <div 
          className={`flex items-center px-4 py-3 ${activeTab === 'apikeys' ? 'bg-blue-800' : 'hover:bg-blue-800'} cursor-pointer`}
          onClick={() => setActiveTab('apikeys')}
        >
          <KeyIcon className="h-6 w-6" />
          {!sidebarCollapsed && <span className="ml-3">My API Keys</span>}
        </div>
        <div 
          className={`flex items-center px-4 py-3 ${activeTab === 'billing' ? 'bg-blue-800' : 'hover:bg-blue-800'} cursor-pointer`}
          onClick={() => setActiveTab('billing')}
        >
          <CreditCardIcon className="h-6 w-6" />
          {!sidebarCollapsed && <span className="ml-3">Billing & Invoices</span>}
        </div>
        <div 
          className={`flex items-center px-4 py-3 ${activeTab === 'models' ? 'bg-blue-800' : 'hover:bg-blue-800'} cursor-pointer`}
          onClick={() => setActiveTab('models')}
        >
          <BookmarkIcon className="h-6 w-6" />
          {!sidebarCollapsed && <span className="ml-3">Saved Models</span>}
        </div>
      </nav>
    </div>
  );
}