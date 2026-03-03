import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Title,
  Text,
  Group,
  Card,
  Button,
  Stack,
  Grid,
  Badge,
  ActionIcon,
  Modal,
  Menu,
  Progress,
  Divider,
  ThemeIcon,
  Anchor,
  Tabs,
  Table,
  Tooltip,
  Alert,
  Timeline,
  Checkbox,
  Breadcrumbs
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconX,
  IconChevronDown,
  IconInfoCircle,
  IconCheck,
  IconBolt,
  IconArrowUp,
  IconRotateClockwise,
  IconAlertTriangle,
  IconClock,
  IconArrowLeft,
  IconDots,
  IconSettings,
  IconHistory,
  IconQuestionMark
} from '@tabler/icons-react';
import AppDirectHeader from './AppDirectHeader';
import AppDirectSecondaryNav from './AppDirectSecondaryNav';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Subscription {
  id: string;
  name: string;
  productId: string;
  edition: string;
  owner: string;
  quantity: number;
  usedQuantity: number;
  upgradeStatus: 'original' | 'partially-upgraded' | 'upgraded-replaced' | 'derived';
  purchaseType: 'assisted-sales' | 'self-serve';
  orderId: string;
  serviceEnd: string;
  contractEnd: string;
  frequency: string;
  totalFee: string;
  status: 'active' | 'canceled';
}

interface UpgradeEvent {
  id: string;
  date: Date;
  type: 'upgrade' | 'revert';
  description: string;
  subscriptions: string[];
}

interface UpgradeHistory {
  originalSubscription: Subscription;
  upgradeDate: Date;
  derivedSubscriptions: Subscription[];
  events: UpgradeEvent[];
  daysRemaining: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Calculate days remaining in grace period (can be negative if expired)
const calculateDaysRemaining = (upgradeDate: Date): number => {
  const now = new Date();
  const expirationDate = new Date(upgradeDate);
  expirationDate.setDate(expirationDate.getDate() + 14);
  const diffTime = expirationDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Check if within grace period
const isWithinGracePeriod = (upgradeDate: Date): boolean => {
  return calculateDaysRemaining(upgradeDate) > 0;
};

// Format date for display
const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Calculate expiration date (upgrade date + 14 days)
const calculateExpirationDate = (upgradeDate: Date): Date => {
  const expiration = new Date(upgradeDate);
  expiration.setDate(expiration.getDate() + 14);
  return expiration;
};

// ============================================================================
// DEMO DATA
// ============================================================================

// Assisted Sales Upgrade History
const assistedSalesUpgradeHistory: UpgradeHistory = {
  originalSubscription: {
    id: 'sub-a',
    name: 'Adobe Creative Cloud All Apps for teams',
    productId: '385998',
    edition: 'Adobe Creative Cloud All Apps',
    owner: 'John Doe',
    quantity: 5,
    usedQuantity: 1,
    upgradeStatus: 'partially-upgraded',
    purchaseType: 'assisted-sales',
    orderId: '10872185',
    serviceEnd: '10/30/26',
    contractEnd: '10/30/26',
    frequency: 'Monthly',
    totalFee: '$26.45',
    status: 'active'
  },
  upgradeDate: new Date('2026-01-12'),
  derivedSubscriptions: [
    {
      id: 'sub-b',
      name: 'Adobe Photoshop for teams',
      productId: '385999',
      edition: 'Photoshop Standard subscription, annual',
      owner: 'John Doe',
      quantity: 3,
      usedQuantity: 0,
      upgradeStatus: 'derived',
      purchaseType: 'assisted-sales',
      orderId: '10872187',
      serviceEnd: '10/30/26',
      contractEnd: '10/30/26',
      frequency: 'Monthly',
      totalFee: '$225.00',
      status: 'active'
    },
    {
      id: 'sub-c',
      name: 'Adobe Illustrator for teams',
      productId: '386000',
      edition: 'Illustrator Standard subscription, annual',
      owner: 'John Doe',
      quantity: 2,
      usedQuantity: 0,
      upgradeStatus: 'derived',
      purchaseType: 'assisted-sales',
      orderId: '10872186',
      serviceEnd: '10/30/26',
      contractEnd: '10/30/26',
      frequency: 'Monthly',
      totalFee: '$150.00',
      status: 'active'
    }
  ],
  events: [
    {
      id: 'event-1',
      date: new Date('2026-01-12'),
      type: 'upgrade',
      description: 'Upgrade performed (A → B:3, C:2)',
      subscriptions: ['sub-a', 'sub-b', 'sub-c']
    }
  ],
  daysRemaining: calculateDaysRemaining(new Date('2026-01-12'))
};

// Self Serve Upgrade History (expired example)
const selfServeUpgradeHistory: UpgradeHistory = {
  originalSubscription: {
    id: 'sub-a-ss',
    name: 'Adobe Acrobat Standard for Enterprise (NA)',
    productId: '385997',
    edition: 'Standard subscription, annual',
    owner: 'Suresh Jambhalkar',
    quantity: 11,
    usedQuantity: 1,
    upgradeStatus: 'partially-upgraded',
    purchaseType: 'self-serve',
    orderId: '10872184',
    serviceEnd: '10/14/26',
    contractEnd: '10/14/26',
    frequency: 'Annual',
    totalFee: '$1,100.00',
    status: 'active'
  },
  upgradeDate: new Date('2025-12-01'),
  derivedSubscriptions: [
    {
      id: 'sub-b-ss',
      name: 'Adobe Acrobat Pro for Enterprise (NA)',
      productId: '385996',
      edition: 'Pro subscription, annual',
      owner: 'Suresh Jambhalkar',
      quantity: 5,
      usedQuantity: 0,
      upgradeStatus: 'derived',
      purchaseType: 'self-serve',
      orderId: '10872183',
      serviceEnd: '10/14/26',
      contractEnd: '10/14/26',
      frequency: 'Annual',
      totalFee: '$750.00',
      status: 'active'
    }
  ],
  events: [
    {
      id: 'event-1-ss',
      date: new Date('2025-12-01'),
      type: 'upgrade',
      description: 'Upgrade performed (A → B:5)',
      subscriptions: ['sub-a-ss', 'sub-b-ss']
    },
    {
      id: 'event-2-ss',
      date: new Date('2025-12-16'),
      type: 'revert',
      description: 'Revert no longer available (14-day limit exceeded)',
      subscriptions: ['sub-a-ss', 'sub-b-ss']
    }
  ],
  daysRemaining: calculateDaysRemaining(new Date('2025-12-01'))
};

// All subscriptions for list view
const allSubscriptions: Subscription[] = [
  assistedSalesUpgradeHistory.originalSubscription,
  ...assistedSalesUpgradeHistory.derivedSubscriptions,
  selfServeUpgradeHistory.originalSubscription,
  ...selfServeUpgradeHistory.derivedSubscriptions
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MidTermUpgradesFlow: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ManageAppsListView />} />
      <Route path="/subscription/:id" element={<SubscriptionDetailsPage />} />
      <Route path="/upgrade-history/:id" element={<UpgradeHistoryPage />} />
    </Routes>
  );
};

// ============================================================================
// BADGE HELPER FUNCTION
// ============================================================================

const getBadgeForSubscription = (sub: Subscription, daysRemaining: number) => {
  const canRevertSub = daysRemaining > 0;
  
  switch (sub.upgradeStatus) {
    case 'partially-upgraded':
      return (
        <Group gap={4}>
          <IconArrowUp size={16} color="#f59e0b" />
          <Badge color="orange" variant="light" leftSection={<IconBolt size={12} />}>
            Partially Upgraded
          </Badge>
        </Group>
      );
    case 'upgraded-replaced':
      return (
        <Group gap={4}>
          <IconArrowUp size={16} color="#ef4444" />
          <Badge color="red" variant="light" leftSection={<IconBolt size={12} />}>
            Upgraded & Replaced
          </Badge>
        </Group>
      );
    case 'derived':
      return (
        <Group gap={4}>
          <IconArrowUp size={16} color="#0891b2" />
          <Badge color="blue" variant="light">
            Derived from Upgrade
          </Badge>
          {canRevertSub && (
            <Tooltip label="Revert available within 14-day grace period">
              <IconRotateClockwise size={16} color="#22c55e" style={{ cursor: 'help' }} />
            </Tooltip>
          )}
        </Group>
      );
    default:
      return null;
  }
};

// ============================================================================
// MANAGE APPS LIST VIEW
// ============================================================================

const ManageAppsListView: React.FC = () => {
  const navigate = useNavigate();
  const [revertAllModalOpened, setRevertAllModalOpened] = useState(false);
  const [selectedUpgradeHistory, setSelectedUpgradeHistory] = useState<UpgradeHistory | null>(null);

  // Group subscriptions by purchase type
  const assistedSalesSubs = allSubscriptions.filter(s => s.purchaseType === 'assisted-sales');
  const selfServeSubs = allSubscriptions.filter(s => s.purchaseType === 'self-serve');

  const getUpgradeHistoryForSubscription = (sub: Subscription): UpgradeHistory | null => {
    if (sub.id === assistedSalesUpgradeHistory.originalSubscription.id || 
        assistedSalesUpgradeHistory.derivedSubscriptions.some(d => d.id === sub.id)) {
      return assistedSalesUpgradeHistory;
    }
    if (sub.id === selfServeUpgradeHistory.originalSubscription.id || 
        selfServeUpgradeHistory.derivedSubscriptions.some(d => d.id === sub.id)) {
      return selfServeUpgradeHistory;
    }
    return null;
  };

  const renderSubscriptionCard = (sub: Subscription) => {
    const upgradeHistory = getUpgradeHistoryForSubscription(sub);
    const daysRemaining = upgradeHistory ? upgradeHistory.daysRemaining : 0;
    const canRevert = sub.upgradeStatus === 'derived' && daysRemaining > 0;

    return (
      <Card key={sub.id} shadow="sm" padding="md" radius="md" withBorder mb="md">
        <Group justify="space-between" align="flex-start">
          <Group gap="md" style={{ flex: 1 }}>
            <ThemeIcon size={48} radius="md" color="red">
              <Text size="xs" fw={700} c="white">A</Text>
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
              <Group gap="md" align="center" mb="xs">
                <Text fw={600} size="md">{sub.name}</Text>
                {getBadgeForSubscription(sub, daysRemaining)}
              </Group>
              <Group gap="lg">
                <Text size="sm" c="dimmed">Edition: {sub.edition}</Text>
                <Text size="sm" c="dimmed">Owner: <Anchor size="sm" c="#0891b2">{sub.owner}</Anchor></Text>
                <Text size="sm" c="dimmed">Usage: {sub.usedQuantity} OUT OF {sub.quantity} USERS</Text>
              </Group>
            </Box>
          </Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" rightSection={<IconChevronDown size={14} />}>
                Manage
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {sub.upgradeStatus === 'derived' && (
                <Menu.Item
                  disabled={!canRevert}
                  onClick={() => {
                    if (canRevert && upgradeHistory) {
                      setSelectedUpgradeHistory(upgradeHistory);
                      setRevertAllModalOpened(true);
                    }
                  }}
                >
                  {canRevert ? 'Revert Upgrade' : (
                    <Tooltip label="Revert is no longer available (14-day limit exceeded)">
                      <Text c="dimmed">Revert Upgrade</Text>
                    </Tooltip>
                  )}
                </Menu.Item>
              )}
              <Menu.Item onClick={() => navigate(`upgrade-history/${sub.id}`)}>
                View Upgrade History
              </Menu.Item>
              <Menu.Item onClick={() => navigate(`subscription/${sub.id}`)}>
                View Details
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card>
    );
  };

  const renderSubscriptionSection = (subscriptions: Subscription[], title: string, upgradeHistory: UpgradeHistory) => {
    const daysRemaining = upgradeHistory.daysRemaining;
    const canRevertAll = daysRemaining > 0;

    return (
      <Box mb="xl">
        <Group justify="space-between" align="center" mb="md">
          <Title order={2} size="h3" fw={600}>{title}</Title>
          {canRevertAll && (
            <Button
              variant="outline"
              leftSection={<IconRotateClockwise size={16} />}
              onClick={() => {
                setSelectedUpgradeHistory(upgradeHistory);
                setRevertAllModalOpened(true);
              }}
            >
              Revert All Upgrades
            </Button>
          )}
        </Group>
        {subscriptions.map(sub => renderSubscriptionCard(sub))}
      </Box>
    );
  };

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <AppDirectHeader />
      <AppDirectSecondaryNav activeTab="dashboard" />
      
      <Container size="xl" py="xl">
        <Title order={1} size="h1" fw={600} mb="xl">Manage Apps</Title>
        
        {renderSubscriptionSection(assistedSalesSubs, 'Assisted Sales', assistedSalesUpgradeHistory)}
        {renderSubscriptionSection(selfServeSubs, 'Self Serve Purchase', selfServeUpgradeHistory)}
      </Container>

      {/* Revert All Modal */}
      {selectedUpgradeHistory && (
        <RevertAllModal
          opened={revertAllModalOpened}
          onClose={() => {
            setRevertAllModalOpened(false);
            setSelectedUpgradeHistory(null);
          }}
          upgradeHistory={selectedUpgradeHistory}
        />
      )}
    </Box>
  );
};

// ============================================================================
// REVERT ALL MODAL
// ============================================================================

interface RevertAllModalProps {
  opened: boolean;
  onClose: () => void;
  upgradeHistory: UpgradeHistory;
}

const RevertAllModal: React.FC<RevertAllModalProps> = ({ opened, onClose, upgradeHistory }) => {
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<Set<string>>(
    new Set(upgradeHistory.derivedSubscriptions.map(sub => sub.id))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleSubscription = (subId: string) => {
    const newSelected = new Set(selectedSubscriptions);
    if (newSelected.has(subId)) {
      newSelected.delete(subId);
    } else {
      newSelected.add(subId);
    }
    setSelectedSubscriptions(newSelected);
  };

  const selectedSubs = upgradeHistory.derivedSubscriptions.filter(sub => selectedSubscriptions.has(sub.id));
  const totalQuantityToRevert = selectedSubs.reduce((sum, sub) => sum + sub.quantity, 0);
  const newQuantityForOriginal = upgradeHistory.originalSubscription.quantity + totalQuantityToRevert;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Revert action submitted successfully!');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Revert All Upgrades"
      size="lg"
      centered
      styles={{
        title: { fontWeight: 600, fontSize: '18px' },
        body: { padding: '24px' }
      }}
    >
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Select which subscriptions to revert. Selected subscriptions will be canceled and their licenses will be returned to the original subscription.
        </Text>

        {/* Subscriptions to be Canceled */}
        <Box>
          <Text fw={600} size="sm" mb="md" c="red">
            Select subscriptions to CANCEL:
          </Text>
          <Stack gap="md">
            {upgradeHistory.derivedSubscriptions.map(sub => (
              <Card key={sub.id} shadow="xs" padding="md" radius="md" withBorder>
                <Group align="flex-start">
                  <Checkbox
                    checked={selectedSubscriptions.has(sub.id)}
                    onChange={() => handleToggleSubscription(sub.id)}
                    mt={4}
                  />
                  <ThemeIcon color="red" size={40} radius="md" ml="xs">
                    <Text size="xs" fw={700} c="white">B</Text>
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text fw={500} size="sm">{sub.name}</Text>
                    <Group gap={4} align="center" mt={4}>
                      <Text size="xs" c="dimmed">(Order -</Text>
                      <Anchor size="xs" c="#0891b2" href="#">#{sub.orderId}</Anchor>
                      <Text size="xs" c="dimmed">)</Text>
                    </Group>
                    <Stack gap={4} mt="xs">
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">Quantity:</Text>
                        <Text size="xs" fw={500}>{sub.quantity}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">Service End:</Text>
                        <Text size="xs" fw={500}>{sub.serviceEnd}</Text>
                      </Group>
                    </Stack>
                  </Box>
                </Group>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* Original Subscription to be Updated */}
        <Box>
          <Text fw={600} size="sm" mb="md" c="green">
            The following subscription will be UPDATED:
          </Text>
          <Card shadow="xs" padding="md" radius="md" withBorder style={{ borderColor: '#22c55e' }}>
            <Group align="flex-start" mb="xs">
              <ThemeIcon color="blue" size={40} radius="md">
                <Text size="xs" fw={700} c="white">A</Text>
              </ThemeIcon>
              <Box style={{ flex: 1 }}>
                <Text fw={500} size="sm">{upgradeHistory.originalSubscription.name}</Text>
                <Group gap={4} align="center" mt={4}>
                  <Text size="xs" c="dimmed">(Order -</Text>
                  <Anchor size="xs" c="#0891b2" href="#">#{upgradeHistory.originalSubscription.orderId}</Anchor>
                  <Text size="xs" c="dimmed">)</Text>
                </Group>
                <Stack gap={4} mt="xs">
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Current Quantity:</Text>
                    <Text size="xs" fw={500}>{upgradeHistory.originalSubscription.quantity}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed" fw={600}>New Quantity after Revert:</Text>
                    <Text size="xs" fw={600} c="green">{newQuantityForOriginal}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Service End:</Text>
                    <Text size="xs" fw={500}>{upgradeHistory.originalSubscription.serviceEnd}</Text>
                  </Group>
                </Stack>
              </Box>
            </Group>
          </Card>
        </Box>

        {/* Action Buttons */}
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            color="#0891b2"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={selectedSubscriptions.size === 0}
          >
            Revert Selected Upgrades
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

// ============================================================================
// SUBSCRIPTION DETAILS PAGE
// ============================================================================

const SubscriptionDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subscriptionId = location.pathname.split('/').pop() || '';
  const [activeTab, setActiveTab] = useState('overview');
  const [revertAllModalOpened, setRevertAllModalOpened] = useState(false);

  const subscription = allSubscriptions.find(s => s.id === subscriptionId);
  if (!subscription) {
    return <Box>Subscription not found</Box>;
  }

  const upgradeHistory = subscription.id === assistedSalesUpgradeHistory.originalSubscription.id || 
    assistedSalesUpgradeHistory.derivedSubscriptions.some(d => d.id === subscription.id)
    ? assistedSalesUpgradeHistory
    : subscription.id === selfServeUpgradeHistory.originalSubscription.id || 
      selfServeUpgradeHistory.derivedSubscriptions.some(d => d.id === subscription.id)
    ? selfServeUpgradeHistory
    : null;

  const daysRemaining = upgradeHistory ? upgradeHistory.daysRemaining : 0;
  const canRevert = upgradeHistory && daysRemaining > 0;

  // Render Assisted Sales Layout
  if (subscription.purchaseType === 'assisted-sales') {
    return (
      <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <AppDirectHeader />
        <AppDirectSecondaryNav activeTab="dashboard" />
        
        <Container size="xl" py="xl">
          {/* Header */}
          <Group justify="space-between" align="center" mb="xl">
            <Group>
              <Text size="sm" c="dimmed" fw={500}>Overview</Text>
              <Text size="sm" c="dimmed">/</Text>
              <Title order={1} size="h2" fw={600}>{subscription.name}</Title>
            </Group>
            <Group>
              <Badge color="green" variant="light">Active</Badge>
              <Button variant="outline" size="xs" color="red">Cancel Subscription</Button>
              <ActionIcon variant="subtle" size="lg">
                <IconX size={20} />
              </ActionIcon>
            </Group>
          </Group>

          {/* Three Column Layout */}
          <Grid gutter="lg" mb="xl">
            {/* Customer Column */}
            <Grid.Col span={4}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fw={600} size="sm" mb="md" c="dimmed">Customer</Text>
                <Stack gap="sm">
                  <Box>
                    <Text size="xs" c="dimmed">Company</Text>
                    <Text size="sm" fw={500}>Adobe Revert Order</Text>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed">Company ID</Text>
                    <Text size="sm" fw={500}>5689505</Text>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed">Owner</Text>
                    <Text size="sm" fw={500}>{subscription.owner}</Text>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed">Phone Number</Text>
                    <Text size="sm" fw={500}>6503212121</Text>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed">Email</Text>
                    <Text size="sm" fw={500}>john.doe@example.com</Text>
                  </Box>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Sales Agent Column */}
            <Grid.Col span={4}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fw={600} size="sm" mb="md" c="dimmed">Sales Agent</Text>
                <Stack gap="sm">
                  <Box>
                    <Text size="xs" c="dimmed">Sales Agent</Text>
                    <Text size="sm" fw={500}>No associated sales agent</Text>
                  </Box>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Active Order Column */}
            <Grid.Col span={4}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" align="center" mb="md">
                  <Text fw={600} size="sm" c="dimmed">Active Order</Text>
                  <Button variant="outline" size="xs">Add</Button>
                </Group>
                <Text size="sm" fw={600} mb="lg">Active Order #{subscription.orderId}</Text>
                <Grid gutter="sm" mb="md">
                  <Grid.Col span={12}>
                    <Box>
                      <Text size="xs" c="dimmed">Edition</Text>
                      <Text size="sm" fw={500}>{subscription.edition}</Text>
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Box>
                      <Text size="xs" c="dimmed">Product ID</Text>
                      <Text size="sm" fw={500} c="#0891b2">{subscription.productId}</Text>
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Box>
                      <Text size="xs" c="dimmed" mb="xs">Usage</Text>
                      <Progress
                        value={(subscription.usedQuantity / subscription.quantity) * 100}
                        color="#0891b2"
                        size="sm"
                        radius="xl"
                        style={{ marginBottom: '4px' }}
                      />
                      <Text size="xs" c="dimmed">{subscription.usedQuantity} OUT OF {subscription.quantity} USERS</Text>
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Box>
                      <Text size="xs" c="dimmed">Frequency</Text>
                      <Text size="sm" fw={500}>{subscription.frequency}</Text>
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Box>
                      <Text size="xs" c="dimmed">Total Fee</Text>
                      <Text size="sm" fw={500}>{subscription.totalFee}</Text>
                    </Box>
                  </Grid.Col>
                </Grid>
                <Divider my="md" />
                <Grid gutter="xs">
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Created</Text>
                    <Text size="xs">10/30/25</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Next Invoice</Text>
                    <Text size="xs">11/30/25</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap={4}>
                      <Text size="xs" c="dimmed">Service Start</Text>
                      <ActionIcon variant="subtle" size={12}>
                        <IconInfoCircle size={10} />
                      </ActionIcon>
                    </Group>
                    <Text size="xs">10/30/25</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap={4}>
                      <Text size="xs" c="dimmed">Service End</Text>
                      <ActionIcon variant="subtle" size={12}>
                        <IconInfoCircle size={10} />
                      </ActionIcon>
                    </Group>
                    <Text size="xs">{subscription.serviceEnd}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Billing Start</Text>
                    <Text size="xs">10/30/25</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Billing End</Text>
                    <Text size="xs">{subscription.serviceEnd}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap={4}>
                      <Text size="xs" c="dimmed">Contract Start</Text>
                      <ActionIcon variant="subtle" size={12}>
                        <IconInfoCircle size={10} />
                      </ActionIcon>
                    </Group>
                    <Text size="xs">10/30/25</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap={4}>
                      <Text size="xs" c="dimmed">Contract End</Text>
                      <ActionIcon variant="subtle" size={12}>
                        <IconInfoCircle size={10} />
                      </ActionIcon>
                    </Group>
                    <Text size="xs">{subscription.contractEnd}</Text>
                  </Grid.Col>
                </Grid>
                <Divider my="md" />
                <Text size="sm" c="#0891b2" style={{ cursor: 'pointer' }} mb="md">More Details »</Text>
                <Box mb="md">
                  <Text size="xs" c="dimmed" mb="xs">Account manager</Text>
                  <Button variant="outline" size="xs" fullWidth>Admin Tools</Button>
                </Box>
                <Button variant="outline" size="xs" fullWidth rightSection={<IconChevronDown size={14} />}>
                  Advanced Actions
                </Button>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Tabs */}
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')}>
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="settings">Settings</Tabs.Tab>
                <Tabs.Tab value="users">Users</Tabs.Tab>
                <Tabs.Tab value="update-subscription">Update Subscription</Tabs.Tab>
                <Tabs.Tab value="order-history">Order History</Tabs.Tab>
                <Tabs.Tab value="upgrade-history">Upgrade History</Tabs.Tab>
                <Tabs.Tab value="consumption">Consumption</Tabs.Tab>
                <Tabs.Tab value="download-files">Download Files</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="md">
                <Text>Overview content</Text>
              </Tabs.Panel>

              <Tabs.Panel value="upgrade-history" pt="md">
                {upgradeHistory && (
                  <UpgradeHistoryTabContent
                    upgradeHistory={upgradeHistory}
                    onRevertAllClick={() => setRevertAllModalOpened(true)}
                  />
                )}
              </Tabs.Panel>

              <Tabs.Panel value="settings" pt="md">
                <Text>Settings content</Text>
              </Tabs.Panel>

              <Tabs.Panel value="users" pt="md">
                <Text>Users content</Text>
              </Tabs.Panel>

              <Tabs.Panel value="update-subscription" pt="md">
                <Text>Update Subscription content</Text>
              </Tabs.Panel>

              <Tabs.Panel value="order-history" pt="md">
                <Text>Order History content</Text>
              </Tabs.Panel>

              <Tabs.Panel value="consumption" pt="md">
                <Text>Consumption content</Text>
              </Tabs.Panel>

              <Tabs.Panel value="download-files" pt="md">
                <Text>Download Files content</Text>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Container>

        {/* Revert All Modal */}
        {upgradeHistory && (
          <RevertAllModal
            opened={revertAllModalOpened}
            onClose={() => setRevertAllModalOpened(false)}
            upgradeHistory={upgradeHistory}
          />
        )}
      </Box>
    );
  }

  // Render Self Serve Layout
  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <AppDirectHeader />
      <AppDirectSecondaryNav activeTab="applications" />
      
      <Container size="xl" py="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs mb="md">
          <Anchor onClick={() => navigate('')}>Manage Apps</Anchor>
          <Text>{subscription.name}</Text>
        </Breadcrumbs>

        {/* Product Header */}
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
          <Group justify="space-between" align="flex-start">
            <Group gap="lg" style={{ flex: 1 }}>
              <ThemeIcon size={80} radius="md" color="red">
                <Text size="lg" fw={700} c="white">A</Text>
              </ThemeIcon>
              <Box style={{ flex: 1 }}>
                <Group gap="md" align="center" mb="xs">
                  <Title order={1} size="h2" fw={600}>{subscription.name}</Title>
                  {getBadgeForSubscription(subscription, daysRemaining)}
                </Group>
                <Text size="sm" c="dimmed" mb="md">Discover all the things your PDF can do. by Adobe</Text>
                <Stack gap="xs">
                  <Text size="sm"><strong>Edition:</strong> {subscription.edition}</Text>
                  <Text size="sm"><strong>Owner:</strong> <Anchor size="sm" c="#0891b2">{subscription.owner}</Anchor></Text>
                  <Box>
                    <Text size="sm" mb="xs"><strong>Usage:</strong></Text>
                    <Progress
                      value={(subscription.usedQuantity / subscription.quantity) * 100}
                      color="#0891b2"
                      size="md"
                      radius="xl"
                      style={{ marginBottom: '4px' }}
                    />
                    <Text size="sm" c="dimmed">{subscription.usedQuantity} OUT OF {subscription.quantity} USERS</Text>
                  </Box>
                  <Text size="sm"><strong>Contract:</strong> Contract ends on {subscription.contractEnd} and will renew with 1 Year Contract</Text>
                </Stack>
              </Box>
            </Group>
            <Group>
              <ActionIcon variant="subtle" size="lg">
                <IconQuestionMark size={20} />
              </ActionIcon>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" size="lg">
                    <IconSettings size={20} />
                    <IconChevronDown size={14} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>Take Ownership</Menu.Item>
                  <Menu.Item color="red">Cancel Subscription</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Card>

        {/* Tabs */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')}>
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="settings">Settings</Tabs.Tab>
              <Tabs.Tab value="users">Users</Tabs.Tab>
              <Tabs.Tab value="update-subscription">Update Subscription</Tabs.Tab>
              <Tabs.Tab value="order-history">Order History</Tabs.Tab>
              <Tabs.Tab value="upgrade-history">Upgrade History</Tabs.Tab>
              <Tabs.Tab value="consumption">Consumption</Tabs.Tab>
              <Tabs.Tab value="download-files">Download Files</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="overview" pt="md">
              <Stack gap="md">
                <Box>
                  <Text fw={600} size="md" mb="sm">Description</Text>
                  <Text size="sm" c="dimmed" mb="sm">
                    Adobe Acrobat DC helps you keep business moving. Convert, edit, share, and sign PDFs. It keeps you connected to your team with simple workflows across desktop, mobile, and web — no matter where you're working.
                  </Text>
                  <Anchor size="sm" c="#0891b2">Go to Product Profile</Anchor>
                </Box>
                <Divider />
                <Box>
                  <Text fw={600} size="md" mb="sm">Support</Text>
                  <Anchor size="sm" c="#0891b2">Go to Knowledge Base</Anchor>
                </Box>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="upgrade-history" pt="md">
              {upgradeHistory && (
                <UpgradeHistoryTabContent
                  upgradeHistory={upgradeHistory}
                  onRevertAllClick={() => setRevertAllModalOpened(true)}
                />
              )}
            </Tabs.Panel>

            <Tabs.Panel value="settings" pt="md">
              <Text>Settings content</Text>
            </Tabs.Panel>

            <Tabs.Panel value="users" pt="md">
              <Text>Users content</Text>
            </Tabs.Panel>

            <Tabs.Panel value="update-subscription" pt="md">
              <Text>Update Subscription content</Text>
            </Tabs.Panel>

            <Tabs.Panel value="order-history" pt="md">
              <Text>Order History content</Text>
            </Tabs.Panel>

            <Tabs.Panel value="consumption" pt="md">
              <Text>Consumption content</Text>
            </Tabs.Panel>

            <Tabs.Panel value="download-files" pt="md">
              <Text>Download Files content</Text>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Container>

      {/* Revert All Modal */}
      {upgradeHistory && (
        <RevertAllModal
          opened={revertAllModalOpened}
          onClose={() => setRevertAllModalOpened(false)}
          upgradeHistory={upgradeHistory}
        />
      )}
    </Box>
  );
};

// ============================================================================
// UPGRADE HISTORY TAB CONTENT
// ============================================================================

interface UpgradeHistoryTabContentProps {
  upgradeHistory: UpgradeHistory;
  onRevertAllClick: () => void;
}

const UpgradeHistoryTabContent: React.FC<UpgradeHistoryTabContentProps> = ({
  upgradeHistory,
  onRevertAllClick
}) => {
  const daysRemaining = upgradeHistory.daysRemaining;
  const canRevert = daysRemaining > 0;
  const expirationDate = calculateExpirationDate(upgradeHistory.upgradeDate);

  return (
    <Stack gap="lg">
      {/* Summary Section */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} size="h4" fw={600} mb="md">Upgrade Summary</Title>
        <Grid>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Original Subscription</Text>
            <Text fw={500} size="md">{upgradeHistory.originalSubscription.name}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Upgrade Date</Text>
            <Text fw={500} size="md">{formatDate(upgradeHistory.upgradeDate)}</Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <Text size="sm" c="dimmed" mb="sm">Distribution Summary</Text>
            <Group gap="lg">
              {upgradeHistory.derivedSubscriptions.map(sub => (
                <Badge key={sub.id} size="lg" variant="light" color="blue">
                  {sub.name}: {sub.quantity} licenses
                </Badge>
              ))}
              <Badge size="lg" variant="light" color="green">
                {upgradeHistory.originalSubscription.name}: {upgradeHistory.originalSubscription.quantity} licenses retained
              </Badge>
            </Group>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Actions Section */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} size="h4" fw={600} mb="md">Actions</Title>
        {!canRevert && (
          <Alert icon={<IconAlertTriangle size={16} />} color="orange" mb="md">
            Upgrades can only be reverted within 14 days of the upgrade date. This upgrade is no longer eligible for return.
            The revert window expired on {formatDate(expirationDate)}.
          </Alert>
        )}
        <Group>
          {canRevert ? (
            <Button
              color="#0891b2"
              leftSection={<IconRotateClockwise size={16} />}
              onClick={onRevertAllClick}
            >
              Revert All Upgrades
            </Button>
          ) : (
            <Tooltip label="Revert unavailable – 14-day return window has expired">
              <Button
                variant="outline"
                leftSection={<IconRotateClockwise size={16} />}
                disabled
              >
                Revert All Upgrades
              </Button>
            </Tooltip>
          )}
        </Group>
      </Card>

      {/* Timeline Section */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} size="h4" fw={600} mb="md">Timeline</Title>
        <Timeline active={upgradeHistory.events.length - 1} bulletSize={24} lineWidth={2}>
          {upgradeHistory.events.map((event, index) => (
            <Timeline.Item
              key={event.id}
              bullet={event.type === 'upgrade' ? <IconArrowUp size={12} /> : <IconRotateClockwise size={12} />}
              title={formatDate(event.date)}
            >
              <Text size="sm" fw={500}>{event.description}</Text>
            </Timeline.Item>
          ))}
          {!canRevert && (
            <Timeline.Item
              bullet={<IconClock size={12} />}
              title={formatDate(expirationDate)}
              color="gray"
            >
              <Text size="sm" c="dimmed">Revert window expired</Text>
            </Timeline.Item>
          )}
        </Timeline>
      </Card>
    </Stack>
  );
};

// ============================================================================
// UPGRADE HISTORY PAGE
// ============================================================================

const UpgradeHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subscriptionId = location.pathname.split('/').pop() || '';
  const [revertAllModalOpened, setRevertAllModalOpened] = useState(false);

  const subscription = allSubscriptions.find(s => s.id === subscriptionId);
  if (!subscription) {
    return <Box>Subscription not found</Box>;
  }

  const upgradeHistory = subscription.id === assistedSalesUpgradeHistory.originalSubscription.id || 
    assistedSalesUpgradeHistory.derivedSubscriptions.some(d => d.id === subscription.id)
    ? assistedSalesUpgradeHistory
    : subscription.id === selfServeUpgradeHistory.originalSubscription.id || 
      selfServeUpgradeHistory.derivedSubscriptions.some(d => d.id === subscription.id)
    ? selfServeUpgradeHistory
    : null;

  if (!upgradeHistory) {
    return <Box>Upgrade history not found</Box>;
  }

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <AppDirectHeader />
      <AppDirectSecondaryNav activeTab="dashboard" />
      
      <Container size="xl" py="xl">
        <Group mb="xl">
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate(`../subscription/${subscriptionId}`)}
          >
            Back to Subscription
          </Button>
        </Group>

        <Title order={1} size="h1" fw={600} mb="xl">Upgrade History</Title>

        <UpgradeHistoryTabContent
          upgradeHistory={upgradeHistory}
          onRevertAllClick={() => setRevertAllModalOpened(true)}
        />
      </Container>

      {/* Revert All Modal */}
      <RevertAllModal
        opened={revertAllModalOpened}
        onClose={() => setRevertAllModalOpened(false)}
        upgradeHistory={upgradeHistory}
      />
    </Box>
  );
};

export default MidTermUpgradesFlow;
