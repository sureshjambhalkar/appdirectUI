import React, { useState } from 'react';
import {
  Modal,
  Title,
  Text,
  Alert,
  Paper,
  Stack,
  Select,
  Group,
  Button,
  Box,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

const OFFER_TYPES = [
  { value: 'MOQ100', label: 'MOQ 100' },
  { value: 'MOQ250', label: 'MOQ 250' },
  { value: 'MOQ500', label: 'MOQ 500' },
];

const SCHEDULE_OPTIONS = [
  { value: 'mid-term', label: 'Mid Term' },
  { value: 'renewal', label: 'Renewal' },
];

interface HGORequestModalProps {
  opened: boolean;
  onClose: () => void;
  onApply?: (offerType: string, schedule: string) => void;
}

export default function HGORequestModal({ opened, onClose, onApply }: HGORequestModalProps) {
  const [offerType, setOfferType] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<string | null>(null);

  const handleApply = () => {
    if (offerType && schedule) {
      onApply?.(offerType, schedule);
      setOfferType(null);
      setSchedule(null);
      onClose();
    }
  };

  const handleClose = () => {
    setOfferType(null);
    setSchedule(null);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Request for High Growth Offers (HGO)"
      size="md"
    >
      <Stack gap="lg">
        <Alert
          icon={<IconInfoCircle size={18} />}
          color="blue"
          variant="light"
          title="3YC participation required"
        >
          Enrollment in High Growth Offers requires participation in the 3YC program.
        </Alert>

        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Box>
              <Text size="sm" fw={500} c="#374151" mb={4}>Offer type</Text>
              <Select
                placeholder="Select offer type"
                data={OFFER_TYPES}
                value={offerType}
                onChange={setOfferType}
                clearable
              />
            </Box>
            <Box>
              <Text size="sm" fw={500} c="#374151" mb={4}>Schedule</Text>
              <Select
                placeholder="Select schedule option"
                data={SCHEDULE_OPTIONS}
                value={schedule}
                onChange={setSchedule}
                clearable
              />
            </Box>
          </Stack>
        </Paper>

        <Group justify="flex-start" gap="sm">
          <Button color="#0891b2" onClick={handleApply} disabled={!offerType || !schedule}>
            Apply for HGO
          </Button>
          <Button variant="outline" color="gray" onClick={handleClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
