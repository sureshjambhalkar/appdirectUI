import React, { useState, useMemo } from 'react';
import {
  Box,
  Group,
  Title,
  Button,
  Text,
  Tabs,
  Anchor,
  Breadcrumbs,
  Alert,
  ActionIcon,
} from '@mantine/core';
import { IconChevronRight, IconInfoCircle, IconDownload, IconX } from '@tabler/icons-react';
import {
  ADOBE_ACTION_CENTER_CATEGORIES,
  getCategoryById,
} from '../config/adobeActionCenterCategories';
import AdobeActionCenterTable from '../components/AdobeActionCenterTable';
import SubscriptionDetailsDrawer from '../components/SubscriptionDetailsDrawer';
import EndCustomerActionCenterView from './EndCustomerActionCenterView';
import {
  MOCK_BY_CATEGORY,
  getMockRowsForCompany,
} from '../data/adobeActionCenterMockData';
import type { ActionCenterSubscriptionRow } from '../types/adobeActionCenter';

interface AdobeActionCenterPageProps {
  /** Marketplace manager view: show all data and company column. False = end customer (company-scoped). */
  managerView?: boolean;
  /** For end-customer view: scope rows to this company id */
  companyId?: string;
  /** Breadcrumb parent (e.g. "Admin Tasks" for manager, "Company Settings" for customer) */
  breadcrumbParent?: string;
  /** Hide the top info banner */
  hideInfoBanner?: boolean;
}

export default function AdobeActionCenterPage({
  managerView = true,
  companyId,
  breadcrumbParent = 'Admin Tasks',
  hideInfoBanner = false,
}: AdobeActionCenterPageProps) {
  const [activeCategory, setActiveCategory] = useState(ADOBE_ACTION_CENTER_CATEGORIES[0].id);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [detailsDrawerRow, setDetailsDrawerRow] = useState<ActionCenterSubscriptionRow | null>(null);
  const [sectionMode, setSectionMode] = useState<'manager' | 'customer'>('manager');

  const category = getCategoryById(activeCategory);
  const getRowsForCategory = (categoryId: string): ActionCenterSubscriptionRow[] => {
    if (managerView) return MOCK_BY_CATEGORY[categoryId] ?? [];
    if (companyId) return getMockRowsForCompany(categoryId, companyId);
    return [];
  };

  const showBanner = !hideInfoBanner && !bannerDismissed;
  const showSectionSwitch = managerView && !companyId;

  const handleRowAction = (row: ActionCenterSubscriptionRow, action: string) => {
    if (action === 'view') setDetailsDrawerRow(row);
  };

  const handleReactivate = (row: ActionCenterSubscriptionRow) => {
    setDetailsDrawerRow(null);
    // In real app: call API then show success
  };

  const handleAutoRenewalToggle = (row: ActionCenterSubscriptionRow, enabled: boolean) => {
    // In real app: call API to update auto-renewal
  };

  return (
    <Box>
      {showSectionSwitch && (
        <Tabs value={sectionMode} onChange={(v) => setSectionMode((v as 'manager' | 'customer') ?? 'manager')} color="#0891b2" mb="lg">
          <Tabs.List>
            <Tabs.Tab value="manager" fw={500}>Marketplace manager</Tabs.Tab>
            <Tabs.Tab value="customer" fw={500}>End customer</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      )}

      {showSectionSwitch && sectionMode === 'customer' ? (
        <EndCustomerActionCenterView />
      ) : (
        <>
      <Breadcrumbs separator={<IconChevronRight size={14} />} mb="md">
        <Anchor size="sm" c="#0891b2" href="#">
          {breadcrumbParent}
        </Anchor>
        <Text size="sm" c="#374151">
          Adobe Action Center
        </Text>
      </Breadcrumbs>

      {showBanner && (
        <Alert
          icon={<IconInfoCircle size={18} />}
          color="blue"
          variant="light"
          mb="lg"
          style={{ position: 'relative' }}
        >
          <Group justify="space-between">
            <Text size="sm">
              This section is updated periodically and may not contain the most up-to-date information.
            </Text>
            <ActionIcon variant="subtle" size="sm" onClick={() => setBannerDismissed(true)}>
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </Alert>
      )}

      <Group justify="space-between" mb="lg">
        <Title order={2} c="#374151" fw={600} size="24px">
          Adobe Action Center
        </Title>
        {category?.reportLabel && managerView && (
          <Button
            variant="outline"
            color="gray"
            leftSection={<IconDownload size={16} />}
          >
            {category.reportLabel}
          </Button>
        )}
      </Group>

      <Tabs value={activeCategory} onChange={(v) => setActiveCategory(v ?? activeCategory)} color="#0891b2">
        <Tabs.List bg="white" style={{ borderBottom: '1px solid #e5e7eb' }}>
          {ADOBE_ACTION_CENTER_CATEGORIES.map((cat) => (
            <Tabs.Tab key={cat.id} value={cat.id} fw={500}>
              {cat.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {ADOBE_ACTION_CENTER_CATEGORIES.map((cat) => (
          <Tabs.Panel key={cat.id} value={cat.id} pt="md">
            <AdobeActionCenterTable
              rows={getRowsForCategory(cat.id)}
              searchPlaceholder={cat.searchPlaceholder}
              managerView={managerView}
              categoryId={cat.id}
              onRowAction={handleRowAction}
              onAutoRenewalToggle={handleAutoRenewalToggle}
            />
          </Tabs.Panel>
        ))}
      </Tabs>

      <SubscriptionDetailsDrawer
        opened={detailsDrawerRow != null}
        onClose={() => setDetailsDrawerRow(null)}
        row={detailsDrawerRow}
        onReactivate={handleReactivate}
      />
        </>
      )}
    </Box>
  );
}
