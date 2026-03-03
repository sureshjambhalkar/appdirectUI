import React from 'react';
import { Drawer, Stack, Text, Group, Button, Box, Divider } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import type { ActionCenterSubscriptionRow } from '../types/adobeActionCenter';

interface SubscriptionDetailsDrawerProps {
  opened: boolean;
  onClose: () => void;
  row: ActionCenterSubscriptionRow | null;
  onReactivate?: (row: ActionCenterSubscriptionRow) => void;
}

const LabelValue = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <Box>
    <Text size="xs" c="#6b7280" mb={4}>{label}</Text>
    <Text size="sm" fw={500} c="#374151">{value ?? '—'}</Text>
  </Box>
);

export default function SubscriptionDetailsDrawer({
  opened,
  onClose,
  row,
  onReactivate,
}: SubscriptionDetailsDrawerProps) {
  if (!row) return null;

  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      title={null}
      size="md"
      withCloseButton={false}
      styles={{
        body: { padding: 0 },
        header: { marginBottom: 0 },
      }}
    >
      <Box p="lg">
        <Group justify="flex-end" mb="md">
          <Button variant="subtle" color="gray" size="sm" leftSection={<IconX size={16} />} onClick={onClose}>
            Close
          </Button>
        </Group>
        <Text fw={600} size="lg" c="#374151" mb="lg">Subscription details</Text>
        <Stack gap="lg">
          <LabelValue label="Company name" value={row.companyName} />
          <Divider />
          <LabelValue label="Subscription ID" value={row.subscriptionId} />
          <LabelValue label="Anniversary date" value={row.anniversaryDate} />
          <LabelValue label="Product name" value={row.product} />
          <LabelValue label="Product edition" value={row.productEdition} />
          <LabelValue label="Licenses" value={row.licensesCount != null ? `${row.licensesCount}` : undefined} />
          <LabelValue label="Licenses status" value={row.licensesStatus} />
        </Stack>
        {row.status === 'Suspended' && onReactivate && (
          <Button
            fullWidth
            mt="xl"
            color="#0891b2"
            onClick={() => onReactivate(row)}
          >
            Reactivate subscription
          </Button>
        )}
      </Box>
    </Drawer>
  );
}
