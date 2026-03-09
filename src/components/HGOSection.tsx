import React, { useState, useCallback } from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Anchor,
  Box,
  Alert,
  Select,
  Notification,
  TextInput,
} from '@mantine/core';
import { IconInfoCircle, IconCircleCheck, IconAlertCircle } from '@tabler/icons-react';

export const HGO_OFFER_TYPES = [
  { value: 'MOQ100', label: 'MOQ 100' },
  { value: 'MOQ250', label: 'MOQ 250' },
  { value: 'MOQ500', label: 'MOQ 500' },
];

export const HGO_SCHEDULE_OPTIONS = [
  { value: 'mid-term', label: 'Mid-Term' },
  { value: 'renewal', label: 'Renewal' },
];

const getOfferLabel = (value: string) => HGO_OFFER_TYPES.find((o) => o.value === value)?.label ?? value;
const getScheduleLabel = (value: string) => HGO_SCHEDULE_OPTIONS.find((s) => s.value === value)?.label ?? value;

type HGOStatus = 'none' | 'requested' | 'editing';
type NotificationType = { type: 'success' | 'error'; message: string } | null;

export default function HGOSection() {
  const [status, setStatus] = useState<HGOStatus>('none');
  const [offerType, setOfferType] = useState<string>('MOQ100');
  const [schedule, setSchedule] = useState<string>('mid-term');
  const [editOfferType, setEditOfferType] = useState<string>('MOQ100');
  const [editSchedule, setEditSchedule] = useState<string>('mid-term');
  const [applyOfferType, setApplyOfferType] = useState<string | null>(null);
  const [applySchedule, setApplySchedule] = useState<string | null>(null);
  const [applyNumberOfLicenses, setApplyNumberOfLicenses] = useState('');
  const [applyTileOpen, setApplyTileOpen] = useState(false);
  const [numberOfLicenses, setNumberOfLicenses] = useState('');
  const [editNumberOfLicenses, setEditNumberOfLicenses] = useState('');
  const [notification, setNotification] = useState<NotificationType>(null);

  const showSuccess = useCallback((message: string) => {
    setNotification({ type: 'success', message });
    setTimeout(() => setNotification(null), 5000);
  }, []);
  const showError = useCallback((message: string) => {
    setNotification({ type: 'error', message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // When integrating with API: on apply/update/cancel failure, call showError('...') instead of showSuccess.

  const handleApplyHGO = useCallback(
    (newOfferType: string, newSchedule: string, licenses: string = '') => {
      setOfferType(newOfferType);
      setSchedule(newSchedule);
      setEditOfferType(newOfferType);
      setEditSchedule(newSchedule);
      setNumberOfLicenses(newSchedule === 'renewal' ? licenses : '');
      setEditNumberOfLicenses(newSchedule === 'renewal' ? licenses : '');
      setStatus('requested');
      setApplyOfferType(null);
      setApplySchedule(null);
      setApplyNumberOfLicenses('');
      setApplyTileOpen(false);
      showSuccess('High Growth Offer requested successfully.');
    },
    [showSuccess]
  );

  const closeApplyTile = useCallback(() => {
    setApplyTileOpen(false);
    setApplyOfferType(null);
    setApplySchedule(null);
    setApplyNumberOfLicenses('');
  }, []);

  const handleCancelRequest = useCallback(() => {
    // In production: await cancelHGORequest(); then on success:
    setStatus('none');
    showSuccess('The requested High Growth Offer has been successfully cancelled.');
    // On API failure: showError('Failed to cancel the High Growth Offer. Please try again.');
  }, [showSuccess]);

  const handleEdit = useCallback(() => {
    setEditOfferType(offerType);
    setEditSchedule(schedule);
    setEditNumberOfLicenses(numberOfLicenses);
    setStatus('editing');
  }, [offerType, schedule, numberOfLicenses]);

  const handleUpdateHGO = useCallback(() => {
    setOfferType(editOfferType);
    setSchedule(editSchedule);
    setNumberOfLicenses(editSchedule === 'renewal' ? editNumberOfLicenses : '');
    setStatus('requested');
    showSuccess('High Growth Offer updated successfully.');
  }, [editOfferType, editSchedule, editNumberOfLicenses, showSuccess]);

  const handleCancelEdit = useCallback(() => {
    setStatus('requested');
  }, []);

  const updateEnabled =
    editOfferType !== offerType ||
    editSchedule !== schedule ||
    (editSchedule === 'renewal' && editNumberOfLicenses !== numberOfLicenses);

  // No HGO requested: blank initially; "Apply for HGO" opens the apply experience as a tile (modal as a tile)
  if (status === 'none') {
    const canApply =
      applyOfferType &&
      applySchedule &&
      (applySchedule !== 'renewal' || applyNumberOfLicenses.trim() !== '');
    return (
      <>
        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Title order={4}>High Growth Offers (HGO)</Title>
            <Anchor href="#" size="sm">Find out more</Anchor>
            {!applyTileOpen ? (
              <Box style={{ textAlign: 'center' }} />
            ) : (
              <>
                <Alert icon={<IconInfoCircle size={18} />} color="blue" variant="light" title="">
                  Enrollment in a High Growth Offers requires participation in the 3YC program.
                </Alert>
                {/* Modal as a tile: one tile with message + form (blank initially) */}
                <Paper withBorder p="lg" radius="md" style={{ backgroundColor: '#fafafa' }}>
                  <Stack gap="md">
                    <Text size="sm" c="dimmed">Customer does not have an active subscription.</Text>
                    <Box>
                      <Text size="sm" fw={500} c="#374151" mb={4}>HGO</Text>
                      <Select
                        placeholder="Select offer type"
                        data={HGO_OFFER_TYPES}
                        value={applyOfferType}
                        onChange={(v) => setApplyOfferType(v)}
                        clearable
                      />
                    </Box>
                    <Box>
                      <Text size="sm" fw={500} c="#374151" mb={4}>Schedule</Text>
                      <Select
                        placeholder="Select schedule option"
                        data={HGO_SCHEDULE_OPTIONS}
                        value={applySchedule}
                        onChange={(v) => {
                          setApplySchedule(v);
                          if (v !== 'renewal') setApplyNumberOfLicenses('');
                        }}
                        clearable
                      />
                    </Box>
                    {applySchedule === 'renewal' && (
                      <Box>
                        <Text size="sm" fw={500} c="#374151" mb={4}>Number of licenses</Text>
                        <TextInput
                          placeholder="Enter the number of licenses"
                          value={applyNumberOfLicenses}
                          onChange={(e) => setApplyNumberOfLicenses(e.currentTarget.value)}
                        />
                      </Box>
                    )}
                  </Stack>
                </Paper>
                <Group gap="sm">
                  <Button
                    type="button"
                    variant="filled"
                    style={{ backgroundColor: '#0891b2' }}
                    onClick={() => canApply && handleApplyHGO(applyOfferType, applySchedule, applyNumberOfLicenses)}
                    disabled={!canApply}
                  >
                    Apply for HGO
                  </Button>
                  <Anchor size="sm" c="dimmed" href="#" onClick={(e) => { e.preventDefault(); closeApplyTile(); }}>
                    Cancel
                  </Anchor>
                </Group>
              </>
            )}
            {!applyTileOpen && (
              <Button
                type="button"
                variant="filled"
                style={{ backgroundColor: '#0891b2' }}
                onClick={() => setApplyTileOpen(true)}
              >
                Apply for HGO
              </Button>
            )}
          </Stack>
        </Paper>
        {notification && (
          <Box style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
            <Notification
              icon={notification.type === 'success' ? <IconCircleCheck size={18} /> : <IconAlertCircle size={18} />}
              color={notification.type === 'success' ? 'green' : 'red'}
              title={notification.type === 'success' ? 'Success' : 'Error'}
              onClose={() => setNotification(null)}
              withCloseButton
            >
              {notification.message}
            </Notification>
          </Box>
        )}
      </>
    );
  }

  // Requested HGO: card with "Requested HGO", MOQ, Scheduled, Edit, Cancel — no product references
  if (status === 'requested') {
    return (
      <>
        <Paper withBorder p="lg" radius="md">
          <Stack gap="lg">
            <Title order={4}>High Growth Offers (HGO)</Title>
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <Text fw={600} size="md" c="#374151">Requested HGO</Text>
                <Group gap="xs">
                  <Box w={8} h={8} style={{ borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  <Text size="sm" c="#b45309">Requested HGO</Text>
                  <Anchor size="sm" c="#0891b2" href="#" onClick={(e) => { e.preventDefault(); handleCancelRequest(); }}>
                    Cancel
                  </Anchor>
                </Group>
              </Stack>
              <Button variant="subtle" size="xs" style={{ color: '#0891b2' }} onClick={handleEdit}>
                Edit
              </Button>
            </Group>
            <Group grow gap="xl" mt="md">
              <Box>
                <Text size="xs" c="#6b7280" mb={4}>HGO</Text>
                <Text size="lg" fw={600} c="#374151">{getOfferLabel(offerType)}</Text>
              </Box>
              <Box>
                <Text size="xs" c="#6b7280" mb={4}>Scheduled</Text>
                <Text size="lg" fw={600} c="#374151">{getScheduleLabel(schedule)}</Text>
              </Box>
              {schedule === 'renewal' && numberOfLicenses && (
                <Box>
                  <Text size="xs" c="#6b7280" mb={4}>Number of licenses</Text>
                  <Text size="lg" fw={600} c="#374151">{numberOfLicenses}</Text>
                </Box>
              )}
            </Group>
          </Stack>
        </Paper>
        {notification && (
          <Box style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
            <Notification
              icon={notification.type === 'success' ? <IconCircleCheck size={18} /> : <IconAlertCircle size={18} />}
              color={notification.type === 'success' ? 'green' : 'red'}
              title={notification.type === 'success' ? 'Success' : 'Error'}
              onClose={() => setNotification(null)}
              withCloseButton
            >
              {notification.message}
            </Notification>
          </Box>
        )}
      </>
    );
  }

  // Editing: header + 3YC banner + form with dropdowns, Update HGO, Cancel — no product references
  return (
    <>
      <Paper withBorder p="lg" radius="md">
        <Stack gap="lg">
          <Title order={4}>High Growth Offers (HGO)</Title>
          <Alert icon={<IconInfoCircle size={18} />} color="blue" variant="light" title="3YC participation required">
            Enrollment in a High Growth Offers requires participation in the 3YC program.
          </Alert>
          <Group gap="xs">
            <Box w={8} h={8} style={{ borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <Text size="sm" c="#b45309">Requested HGO</Text>
            <Anchor size="sm" c="#0891b2" href="#" onClick={(e) => { e.preventDefault(); handleCancelRequest(); }}>
              Cancel
            </Anchor>
          </Group>
          <Group grow align="flex-start">
            <Box>
              <Text size="sm" fw={500} c="#374151" mb={4}>HGO</Text>
              <Select
                data={HGO_OFFER_TYPES}
                value={editOfferType}
                onChange={(v) => v && setEditOfferType(v)}
              />
            </Box>
            <Box>
              <Text size="sm" fw={500} c="#374151" mb={4}>Schedule</Text>
              <Select
                data={HGO_SCHEDULE_OPTIONS}
                value={editSchedule}
                onChange={(v) => {
                  if (v) {
                    setEditSchedule(v);
                    if (v !== 'renewal') setEditNumberOfLicenses('');
                  }
                }}
              />
            </Box>
          </Group>
          {editSchedule === 'renewal' && (
            <Box>
              <Text size="sm" fw={500} c="#374151" mb={4}>Number of licenses</Text>
              <TextInput
                placeholder="Enter the number of licenses"
                value={editNumberOfLicenses}
                onChange={(e) => setEditNumberOfLicenses(e.currentTarget.value)}
              />
            </Box>
          )}
          <Group gap="sm">
            <Button variant="filled" style={{ backgroundColor: '#0891b2' }} onClick={handleUpdateHGO} disabled={!updateEnabled}>
              Update HGO
            </Button>
            <Button variant="subtle" color="gray" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Paper>
      {notification && (
        <Box style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
          <Notification
            icon={notification.type === 'success' ? <IconCircleCheck size={18} /> : <IconAlertCircle size={18} />}
            color={notification.type === 'success' ? 'green' : 'red'}
            title={notification.type === 'success' ? 'Success' : 'Error'}
            onClose={() => setNotification(null)}
            withCloseButton
          >
            {notification.message}
          </Notification>
        </Box>
      )}
    </>
  );
}
