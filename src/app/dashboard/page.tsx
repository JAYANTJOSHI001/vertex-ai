"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import ApiKeysTab from '@/components/dashboard/tabs/ApiKeysTab';
import AnalyticsTab from '@/components/dashboard/tabs/AnalyticsTab';
import BillingTab from '@/components/dashboard/tabs/BillingTab';
import ModelsTab from '@/components/dashboard/tabs/ModelsTab';
import { authService } from '@/services/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          // Redirect to login if no token
          router.push('/login');
          return;
        }
        
        // Verify token by getting user profile
        const response = await authService.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error('Authentication error:', error);
        // Token might be invalid or expired
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'apikeys':
        return <ApiKeysTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'billing':
        return <BillingTab />;
      case 'models':
        return <ModelsTab />;
      default:
        return <div>Select a tab</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        
        {/* Main content */}
        <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
          {/* Header */}
          <Header 
            sidebarCollapsed={sidebarCollapsed} 
            // user={user}
          />
          
          {/* Page content */}
          <main className="p-6">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
}