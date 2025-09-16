import React, { createContext, useState, useEffect } from 'react';

export const FunnelContext = createContext();

export const FunnelProvider = ({ children }) => {
  // Step navigation
  const [activeStep, setActiveStep] = useState(0);
  const [activeSubStep, setActiveSubStep] = useState(0);
  
  // Content management
  const [funnelContent, setFunnelContent] = useState({
    discover: [],
    resonate: [],
    envision: [],
    trust: [],
    authority: []
  });
  
  const [contentLibrary, setContentLibrary] = useState([]);
  const [marketingCopy, setMarketingCopy] = useState('');
  const [gapAnalysis, setGapAnalysis] = useState([]);
  
  // UI states
  const [showGapModal, setShowGapModal] = useState(false);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  
  // Personas from Step 1
  const [personas, setPersonas] = useState([]);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const savedContentLibrary = localStorage.getItem('step2_contentLibrary');
    const savedFunnelContent = localStorage.getItem('step2_funnelContent');
    const savedMarketingCopy = localStorage.getItem('step2_marketingCopy');
    const savedPersonas = localStorage.getItem('step1_personas');
    
    if (savedContentLibrary) {
      setContentLibrary(JSON.parse(savedContentLibrary));
    }
    if (savedFunnelContent) {
      setFunnelContent(JSON.parse(savedFunnelContent));
    }
    if (savedMarketingCopy) {
      setMarketingCopy(savedMarketingCopy);
    }
    if (savedPersonas) {
      setPersonas(JSON.parse(savedPersonas));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('step2_contentLibrary', JSON.stringify(contentLibrary));
  }, [contentLibrary]);

  useEffect(() => {
    localStorage.setItem('step2_funnelContent', JSON.stringify(funnelContent));
  }, [funnelContent]);

  useEffect(() => {
    localStorage.setItem('step2_marketingCopy', marketingCopy);
  }, [marketingCopy]);

  // Helper functions
  const addToFunnelStage = (content, stage) => {
    setFunnelContent(prev => ({
      ...prev,
      [stage]: [...prev[stage], content]
    }));
  };

  const removeFromFunnelStage = (contentId, stage) => {
    setFunnelContent(prev => ({
      ...prev,
      [stage]: prev[stage].filter(item => item.id !== contentId)
    }));
  };

  const removeFromContentLibrary = (contentId) => {
    setContentLibrary(prev => prev.filter(item => item.id !== contentId));
    
    // Also remove from funnel content if it was placed
    const updatedFunnelContent = { ...funnelContent };
    Object.keys(updatedFunnelContent).forEach(stage => {
      updatedFunnelContent[stage] = updatedFunnelContent[stage].filter(item => item.id !== contentId);
    });
    setFunnelContent(updatedFunnelContent);
  };

  const getTotalContentCount = () => {
    return Object.values(funnelContent).reduce((total, stageContent) => total + stageContent.length, 0);
  };

  const getStageContentCount = (stage) => {
    return funnelContent[stage]?.length || 0;
  };

  return (
    <FunnelContext.Provider value={{
      // Navigation state
      activeStep,
      setActiveStep,
      activeSubStep,
      setActiveSubStep,
      
      // Content state
      funnelContent,
      setFunnelContent,
      contentLibrary,
      setContentLibrary,
      marketingCopy,
      setMarketingCopy,
      gapAnalysis,
      setGapAnalysis,
      
      // UI state
      showGapModal,
      setShowGapModal,
      showAddContentModal,
      setShowAddContentModal,
      
      // Personas
      personas,
      setPersonas,
      
      // Helper functions
      addToFunnelStage,
      removeFromFunnelStage,
      removeFromContentLibrary,
      getTotalContentCount,
      getStageContentCount
    }}>
      {children}
    </FunnelContext.Provider>
  );
};

