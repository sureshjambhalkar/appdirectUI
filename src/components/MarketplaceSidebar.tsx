import React from 'react';
import { Box, Text, Stack, Button, Divider } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';

interface MarketplaceSidebarProps {
  /** Base path for this flow (e.g. /adobe-action-center) */
  basePath?: string;
}

const MarketplaceSidebar = ({ basePath = '/adobe-action-center' }: MarketplaceSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdobeActionCenter = location.pathname.startsWith(basePath);

  const menuSections = [
    {
      title: 'HOME',
      items: [
        { label: 'Overview', path: null },
        { label: 'Users', path: null },
        { label: 'Companies', path: null },
        { label: 'Pending Companies', path: null },
        { label: 'Leads', path: null },
        { label: 'Opportunities', path: null },
        { label: 'Bulk Creation', path: null },
        { label: 'Reviews & Questions', path: null },
      ],
    },
    {
      title: 'BILLING',
      items: [
        { label: 'Orders', path: null },
        { label: 'Invoices', path: null },
        { label: 'Payments', path: null },
        { label: 'Quotes', path: null },
        { label: 'Metered Usage', path: null },
      ],
    },
    {
      title: 'EVENTS',
      items: [
        { label: 'Event Logs', path: null },
        { label: 'App Usage Logs', path: null },
        { label: 'Admin Logs', path: null },
      ],
    },
    {
      title: 'ADMIN TASKS',
      items: [
        { label: 'Microsoft', path: null },
        { label: 'Adobe Action Center', path: basePath },
      ],
    },
  ];

  return (
    <Box
      bg="#f5f5f5"
      style={{
        width: '280px',
        minHeight: '100%',
        borderRight: '1px solid #e5e7eb',
        padding: '16px 0',
      }}
    >
      <Stack gap="md">
        {menuSections.map((section, sectionIndex) => (
          <Box key={section.title}>
            <Text
              size="xs"
              fw={600}
              c="#6b7280"
              px="md"
              mb="xs"
              style={{ letterSpacing: '0.05em' }}
            >
              {section.title}
            </Text>
            <Stack gap="xs">
              {section.items.map((item) => {
                const active = item.path === basePath && isAdobeActionCenter;
                return (
                  <Button
                    key={item.label}
                    variant="subtle"
                    justify="flex-start"
                    color={active ? 'white' : 'gray'}
                    style={{
                      backgroundColor: active ? '#0891b2' : 'transparent',
                      color: active ? 'white' : '#374151',
                      borderRadius: 0,
                      padding: '8px 16px',
                      height: 'auto',
                      fontWeight: active ? 500 : 400,
                    }}
                    styles={{
                      root: {
                        '&:hover': {
                          backgroundColor: active ? '#0891b2' : '#e5e7eb',
                        },
                      },
                    }}
                    onClick={() => item.path && navigate(item.path)}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
            {sectionIndex < menuSections.length - 1 && (
              <Divider my="md" color="#e5e7eb" />
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default MarketplaceSidebar;
