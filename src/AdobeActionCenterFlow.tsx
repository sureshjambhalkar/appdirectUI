import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Group, Button } from '@mantine/core';
import AppDirectHeader from './AppDirectHeader';
import AppDirectSecondaryNav from './AppDirectSecondaryNav';
import MarketplaceSidebar from './components/MarketplaceSidebar';
import AdobeActionCenterPage from './pages/AdobeActionCenterPage';

const AdobeActionCenterFlow = () => {
  const navigate = useNavigate();

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Box style={{ backgroundColor: 'white', padding: '8px 16px', borderBottom: '1px solid #e0e0e0' }}>
        <Group>
          <Button onClick={() => navigate('/')} variant="outline" size="xs">
            🏠 Back to Home
          </Button>
        </Group>
      </Box>

      <AppDirectHeader />
      <AppDirectSecondaryNav activeTab="marketplace" />

      <Group align="flex-start" gap={0} style={{ minHeight: 'calc(100vh - 156px)' }}>
        <MarketplaceSidebar basePath="/adobe-action-center" />
        <Box style={{ flex: 1, padding: '24px' }}>
          <Routes>
            <Route path="/" element={<AdobeActionCenterPage managerView breadcrumbParent="Admin Tasks" />} />
            <Route path="/*" element={<AdobeActionCenterPage managerView breadcrumbParent="Admin Tasks" />} />
          </Routes>
        </Box>
      </Group>
    </Box>
  );
};

export default AdobeActionCenterFlow;
