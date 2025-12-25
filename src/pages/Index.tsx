import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { CaseDetails } from '@/components/CaseDetails';
import { CaseList } from '@/components/CaseList';
import { KnowledgePanel } from '@/components/KnowledgePanel';
import { CustomerList } from '@/components/CustomerList';
import { DashboardCharts } from '@/components/DashboardCharts';
import { mockCases, mockPolicies, mockAlerts } from '@/data/mockData';
import { CaseData } from '@/types/case';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('cases');
  const [selectedCase, setSelectedCase] = useState<CaseData>(mockCases[0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleNavigate = (item: string) => {
    setActiveView(item);
  };

  const handleSelectCase = (caseData: CaseData) => {
    setSelectedCase(caseData);
    setActiveView('cases');
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
      case 'reports':
        return <DashboardCharts />;
      case 'customers':
        return (
          <CustomerList 
            onSelectCase={handleSelectCase} 
            selectedCaseId={selectedCase.id} 
          />
        );
      case 'cases':
      case 'queue':
      default:
        return (
          <>
            <CaseList 
              cases={mockCases} 
              selectedCaseId={selectedCase.id}
              onSelectCase={handleSelectCase}
            />
            <CaseDetails caseData={selectedCase} />
            <KnowledgePanel 
              policies={mockPolicies} 
              alerts={mockAlerts} 
              caseData={selectedCase}
              isLoading={isLoading}
            />
          </>
        );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      <Header 
        isRefreshing={isRefreshing} 
        onRefresh={handleRefresh}
        onSelectCase={(caseId) => {
          const found = mockCases.find((c) => c.id === caseId);
          if (found) {
            handleSelectCase(found);
          }
        }}
      />
      
      <div className="flex-1 flex min-h-0">
        <Sidebar activeItem={activeView} onNavigate={handleNavigate} />
        
        <main className="flex-1 flex min-w-0 min-h-0 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
