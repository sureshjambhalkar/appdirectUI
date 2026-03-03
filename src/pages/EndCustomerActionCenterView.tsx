import React from 'react';
import { Box, Text, Stack, Button, Divider, Paper, Group, SimpleGrid } from '@mantine/core';
import { IconDots, IconRefresh, IconEdit } from '@tabler/icons-react';
import { ActionIcon, Menu } from '@mantine/core';
import AdobeActionCenterPage from './AdobeActionCenterPage';

/**
 * End-customer view for Adobe Action Center (per second screenshot).
 * Sidebar: Company Settings, Vendor Information (Adobe, Microsoft), main content: vendor profile + action center.
 */
export default function EndCustomerActionCenterView() {
  return (
    <Group align="flex-start" gap={0} style={{ minHeight: '400px' }}>
      {/* Left sidebar – Company Settings / Vendor Information */}
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
          <Box>
            <Text size="xs" fw={600} c="#6b7280" px="md" mb="xs" style={{ letterSpacing: '0.05em' }}>
              COMPANY SETTINGS
            </Text>
            <Stack gap="xs">
              <Button variant="subtle" justify="flex-start" color="gray" style={{ borderRadius: 0, padding: '8px 16px', height: 'auto', fontWeight: 400, color: '#374151' }}>
                Company Settings
              </Button>
            </Stack>
          </Box>
          <Divider color="#e5e7eb" />
          <Box>
            <Text size="xs" fw={600} c="#6b7280" px="md" mb="xs" style={{ letterSpacing: '0.05em' }}>
              VENDOR INFORMATION
            </Text>
            <Stack gap="xs">
              <Button variant="filled" justify="flex-start" style={{ backgroundColor: '#0891b2', color: 'white', borderRadius: 0, padding: '8px 16px', height: 'auto', fontWeight: 500 }}>
                Adobe
              </Button>
              <Button variant="subtle" justify="flex-start" color="gray" style={{ borderRadius: 0, padding: '8px 16px', height: 'auto', fontWeight: 400, color: '#374151' }}>
                Microsoft
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Main content – Adobe title, vendor profile card, then action center */}
      <Box style={{ flex: 1, padding: '24px' }}>
        <Text fw={600} size="xl" c="#374151" mb="lg">Adobe</Text>

        {/* Vendor profile card (from end-customer screenshot) */}
        <Paper withBorder p="lg" radius="md" mb="lg">
          <Group justify="space-between" mb="md">
            <Group>
              <Box bg="#e53e3e" c="white" p="sm" style={{ borderRadius: '4px', fontSize: '18px', fontWeight: 700, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                A
              </Box>
              <Box>
                <Text fw={600} size="lg" c="#374151">Adobe Commercial SJ</Text>
                <Text size="sm" c="#6b7280">P1005273249</Text>
              </Box>
            </Group>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray"><IconDots size={16} /></ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconRefresh size={16} />}>Refresh</Menu.Item>
                <Menu.Item leftSection={<IconEdit size={16} />}>Update company profile</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Text size="sm" c="#6b7280" mb="xs">Contact</Text>
          <Text size="sm" c="#374151">Suresh Jambhalkar Updated, 123 Amen Corner, Raleigh, NC 27607, US</Text>
          <SimpleGrid cols={2} mt="md" spacing="lg">
            <Box>
              <Text size="sm" c="#6b7280" mb="xs">Current discount levels - licenses</Text>
              <Text size="sm" fw={500} c="#374151">Level 12</Text>
            </Box>
            <Box>
              <Text size="sm" c="#6b7280" mb="xs">Current discount levels - consumables</Text>
              <Text size="sm" fw={500} c="#374151">Tier TB</Text>
            </Box>
            <Box>
              <Text size="sm" c="#6b7280" mb="xs">Preferred language</Text>
              <Text size="sm" fw={500} c="#374151">English (US)</Text>
            </Box>
            <Box>
              <Text size="sm" c="#6b7280" mb="xs">Market segment</Text>
              <Text size="sm" fw={500} c="#374151">Commercial</Text>
            </Box>
            <Box>
              <Text size="sm" c="#6b7280" mb="xs">Anniversary date</Text>
              <Text size="sm" fw={500} c="#374151">10/14/26</Text>
            </Box>
            <Box>
              <Text size="sm" c="#6b7280" mb="xs">Global customer</Text>
              <Text size="sm" fw={500} c="#374151">No</Text>
            </Box>
          </SimpleGrid>
        </Paper>

        {/* Action center – company-scoped */}
        <AdobeActionCenterPage
          managerView={false}
          companyId="P1005273249"
          breadcrumbParent="Company Settings"
          hideInfoBanner
        />
      </Box>
    </Group>
  );
}
