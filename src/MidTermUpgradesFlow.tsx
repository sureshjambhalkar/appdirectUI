import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
  Radio,
  Anchor
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconX,
  IconChevronDown,
  IconInfoCircle,
  IconCheck,
  IconBolt
} from '@tabler/icons-react';
import AppDirectHeader from './AppDirectHeader';
import AppDirectSecondaryNav from './AppDirectSecondaryNav';

const MidTermUpgradesFlow: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<MidTermUpgradesMain />} />
    </Routes>
  );
};

// Revert Order Modal Component
interface RevertOrderModalProps {
  opened: boolean;
  onClose: () => void;
  scenario: 'partial' | 'full';
}

const RevertOrderModal: React.FC<RevertOrderModalProps> = ({ opened, onClose, scenario }) => {
  const isPartial = scenario === 'partial';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isPartial ? 'Revert Partial Switch' : 'Revert Full Switch'}
      size="md"
      centered
      styles={{
        title: { fontWeight: 600, fontSize: '18px' },
        body: { padding: '24px' }
      }}
    >
      <Stack gap="lg">
        {/* Intro Text */}
        <Text size="sm" c="dimmed">
          {isPartial
            ? 'You are about to revert a partial switch. This action will cancel all related subscriptions from the original switch and add their quantities back to the original subscription.'
            : 'You are about to revert a full switch. This action will cancel the current subscription and restore the original subscription.'}
        </Text>

        {isPartial ? (
          <>
            {/* Subscriptions to be Canceled */}
            <Box>
              <Text fw={600} size="sm" mb="md" c="red">
                The following subscriptions will be CANCELED:
              </Text>
              <Stack gap="md">
                {/* Subscription 1 */}
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Group align="flex-start" mb="xs">
                    <ThemeIcon color="red" size={40} radius="md">
                      <Text size="xs" fw={700} c="white">Ps</Text>
                    </ThemeIcon>
                    <Box style={{ flex: 1 }}>
                      <Text fw={500} size="sm">Adobe Photoshop for teams</Text>
                      <Group gap={4} align="center">
                        <Text size="xs" c="dimmed">(Order B -</Text>
                        <Anchor 
                          size="xs" 
                          c="#0891b2" 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert('Navigate to Order #10872187');
                          }}
                        >
                          #10872187
                        </Anchor>
                        <Text size="xs" c="dimmed">)</Text>
                      </Group>
                    </Box>
                  </Group>
                  <Stack gap={4} mt="xs">
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Quantity:</Text>
                      <Text size="xs" fw={500}>3</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Service End:</Text>
                      <Text size="xs" fw={500}>10/30/26</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Price:</Text>
                      <Text size="xs" fw={500}>$225.00</Text>
                    </Group>
                  </Stack>
                </Card>

                {/* Subscription 2 */}
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Group align="flex-start" mb="xs">
                    <ThemeIcon color="orange" size={40} radius="md">
                      <Text size="xs" fw={700} c="white">Ai</Text>
                    </ThemeIcon>
                    <Box style={{ flex: 1 }}>
                      <Text fw={500} size="sm">Adobe Illustrator for teams</Text>
                      <Group gap={4} align="center">
                        <Text size="xs" c="dimmed">(Order C -</Text>
                        <Anchor 
                          size="xs" 
                          c="#0891b2" 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert('Navigate to Order #10872186');
                          }}
                        >
                          #10872186
                        </Anchor>
                        <Text size="xs" c="dimmed">)</Text>
                      </Group>
                    </Box>
                  </Group>
                  <Stack gap={4} mt="xs">
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Quantity:</Text>
                      <Text size="xs" fw={500}>2</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Service End:</Text>
                      <Text size="xs" fw={500}>10/30/26</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Price:</Text>
                      <Text size="xs" fw={500}>$150.00</Text>
                    </Group>
                  </Stack>
                </Card>
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
                    <Text size="xs" fw={700} c="white">CC</Text>
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text fw={500} size="sm">Adobe Creative Cloud All Apps for teams</Text>
                    <Group gap={4} align="center">
                      <Text size="xs" c="dimmed">(Order A -</Text>
                      <Anchor 
                        size="xs" 
                        c="#0891b2" 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Navigate to Order #10872185');
                        }}
                      >
                        #10872185
                      </Anchor>
                      <Text size="xs" c="dimmed">)</Text>
                    </Group>
                  </Box>
                </Group>
                <Stack gap={4} mt="xs">
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Current Quantity:</Text>
                    <Text size="xs" fw={500}>5</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed" fw={600}>New Quantity after Revert:</Text>
                    <Text size="xs" fw={600} c="green">10</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Service End:</Text>
                    <Text size="xs" fw={500}>10/30/26</Text>
                  </Group>
                  {/* Pricing with 3YC Discount Indicator */}
                  <Divider my="xs" />
                  <Box>
                    <Group gap={4} mb={4}>
                      <Text size="xs" td="line-through" c="dimmed">$75.00 / User / year</Text>
                    </Group>
                    <Group gap={4} align="center">
                      <Text size="xs" fw={600} c="#0891b2">$56.25 / User / year</Text>
                      <IconBolt size={12} color="#0891b2" />
                      <Text size="xs" c="#0891b2">3-year Commit pricing applied</Text>
                    </Group>
                    <Text size="xs" c="dimmed" mt={4}>Total: $562.50</Text>
                  </Box>
                </Stack>
              </Card>
            </Box>
          </>
        ) : (
          <>
            {/* Subscription to be Canceled */}
            <Box>
              <Text fw={600} size="sm" mb="md" c="red">
                This subscription will be CANCELED:
              </Text>
              <Card shadow="xs" padding="md" radius="md" withBorder>
                <Group align="flex-start">
                  <Radio checked disabled />
                  <ThemeIcon color="red" size={40} radius="md" ml="xs">
                    <Text size="xs" fw={700} c="white">Ps</Text>
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text fw={500} size="sm">Adobe Photoshop for teams</Text>
                    <Group gap={4} align="center" mt={4}>
                      <Text size="xs" c="dimmed">(Order B -</Text>
                      <Anchor 
                        size="xs" 
                        c="#0891b2" 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Navigate to Order #10872187');
                        }}
                      >
                        #10872187
                      </Anchor>
                      <Text size="xs" c="dimmed">)</Text>
                    </Group>
                    <Stack gap={4} mt="xs">
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">Quantity:</Text>
                        <Text size="xs" fw={500}>10</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">Service End:</Text>
                        <Text size="xs" fw={500}>10/30/26</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">Price:</Text>
                        <Text size="xs" fw={500}>$750.00</Text>
                      </Group>
                    </Stack>
                  </Box>
                </Group>
              </Card>
            </Box>

            {/* Original Subscription to be Restored */}
            <Box>
              <Text fw={600} size="sm" mb="md" c="green">
                The following subscription will be RESTORED:
              </Text>
              <Card shadow="xs" padding="md" radius="md" withBorder style={{ borderColor: '#22c55e' }}>
                <Group align="flex-start" mb="xs">
                  <ThemeIcon color="blue" size={40} radius="md">
                    <Text size="xs" fw={700} c="white">CC</Text>
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text fw={500} size="sm">Adobe Creative Cloud All Apps for teams</Text>
                    <Text size="xs" c="dimmed" mt={4}>(New Order - Will be created)</Text>
                  </Box>
                </Group>
                <Stack gap={4} mt="xs">
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Quantity:</Text>
                    <Text size="xs" fw={500}>10</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Term:</Text>
                    <Text size="xs" fw={500}>Annual</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Service End:</Text>
                    <Text size="xs" fw={500}>10/30/26</Text>
                  </Group>
                  {/* Pricing with Volume Discount Indicator */}
                  <Divider my="xs" />
                  <Box>
                    <Group gap={4} mb={4}>
                      <Text size="xs" td="line-through" c="dimmed">$100.00 / User / year</Text>
                    </Group>
                    <Group gap={4} align="center">
                      <Text size="xs" fw={600} c="#22c55e">$85.00 / User / year</Text>
                      <Badge size="xs" color="green" variant="light">Volume</Badge>
                      <Text size="xs" c="#22c55e">Volume pricing applied</Text>
                    </Group>
                    <Text size="xs" c="dimmed" mt={4}>Total: $850.00</Text>
                  </Box>
                </Stack>
              </Card>
            </Box>
          </>
        )}

        {/* Action Buttons */}
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="#0891b2"
            onClick={() => {
              // Handle submit action
              alert('Revert action submitted!');
              onClose();
            }}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

const MidTermUpgradesMain: React.FC = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [modalScenario, setModalScenario] = useState<'partial' | 'full'>('partial');
  const [advancedActionsOpen, setAdvancedActionsOpen] = useState(false);

  // Toggle between partial and full scenarios for demo purposes
  // In production, this would be determined by the actual order data
  const [isPartialScenario, setIsPartialScenario] = useState(true);

  const handleOpenModal = () => {
    // Determine scenario based on toggle state
    setModalScenario(isPartialScenario ? 'partial' : 'full');
    setModalOpened(true);
    setAdvancedActionsOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
  };

  const handleScenarioToggle = () => {
    setIsPartialScenario(!isPartialScenario);
  };

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* AppDirect Header */}
      <AppDirectHeader />

      {/* Secondary Navigation */}
      <AppDirectSecondaryNav activeTab="dashboard" />

      {/* Main Content */}
      <Container size="xl" py="xl">
        {/* Page Header */}
        <Group justify="space-between" align="center" mb="xl">
          <Title order={1} size="h2" fw={600}>
            Adobe Creative Cloud All Apps for teams
          </Title>
          <Group>
            <Button variant="outline" leftSection={<IconEdit size={16} />}>
              Edit
            </Button>
            <Button variant="outline" color="red" leftSection={<IconTrash size={16} />}>
              Remove
            </Button>
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
              <Text fw={600} size="sm" mb="md" c="dimmed">
                Customer
              </Text>
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
                  <Text size="sm" fw={500}>John Doe</Text>
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
              <Text fw={600} size="sm" mb="md" c="dimmed">
                Sales Agent
              </Text>
              <Stack gap="sm">
                <Box>
                  <Text size="xs" c="dimmed">Company</Text>
                  <Text size="sm" fw={500}>AppDistribution</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">Company ID</Text>
                  <Text size="sm" fw={500}>2198892</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">Owner</Text>
                  <Text size="sm" fw={500}>Jane Smith</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">Phone Number</Text>
                  <Text size="sm" fw={500}>6175474800</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">Email</Text>
                  <Text size="sm" fw={500}>jane.smith@example.com</Text>
                </Box>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Active Order Column */}
          <Grid.Col span={4}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" align="center" mb="md">
                <Text fw={600} size="sm" c="dimmed">
                  Active Order
                </Text>
                <Group>
                  <Badge color="green" variant="light">
                    Active
                  </Badge>
                  <Button variant="outline" size="xs" color="red">
                    Cancel Subscription
                  </Button>
                  <Button variant="outline" size="xs">
                    Add Charge
                  </Button>
                </Group>
              </Group>

              <Text size="sm" fw={600} mb="lg">
                Active Order #11132330
              </Text>

              <Grid gutter="sm" mb="md">
                <Grid.Col span={12}>
                  <Box>
                    <Text size="xs" c="dimmed">Edition</Text>
                    <Text size="sm" fw={500}>Adobe Creative Cloud All Apps</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Box>
                    <Text size="xs" c="dimmed">Product ID</Text>
                    <Text size="sm" fw={500} c="#0891b2">
                      385998
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Box>
                    <Text size="xs" c="dimmed" mb="xs">Usage</Text>
                    <Progress
                      value={10}
                      color="#0891b2"
                      size="sm"
                      radius="xl"
                      style={{ marginBottom: '4px' }}
                    />
                    <Text size="xs" c="dimmed">
                      1 OUT OF 10 USERS
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text size="xs" c="dimmed">Frequency</Text>
                    <Text size="sm" fw={500}>Monthly</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text size="xs" c="dimmed">Total Fee</Text>
                    <Text size="sm" fw={500}>$26.45</Text>
                  </Box>
                </Grid.Col>
              </Grid>

              <Divider my="md" />

              {/* Order Dates */}
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
                  <Text size="xs">10/30/26</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="xs" c="dimmed">Billing Start</Text>
                  <Text size="xs">10/30/25</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="xs" c="dimmed">Billing End</Text>
                  <Text size="xs">10/30/26</Text>
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
                  <Text size="xs">10/30/26</Text>
                </Grid.Col>
              </Grid>

              <Divider my="md" />

              <Text size="sm" c="#0891b2" style={{ cursor: 'pointer' }} mb="md">
                More Details »
              </Text>

              <Box mb="md">
                <Text size="xs" c="dimmed" mb="xs">
                  Account manager
                </Text>
                <Button variant="outline" size="xs" fullWidth>
                  Admin Tools
                </Button>
              </Box>

              {/* Advanced Actions Dropdown */}
              <Menu
                shadow="md"
                width={200}
                position="bottom-end"
                opened={advancedActionsOpen}
                onChange={setAdvancedActionsOpen}
              >
                <Menu.Target>
                  <Button variant="outline" size="xs" fullWidth rightSection={<IconChevronDown size={14} />}>
                    Advanced Actions
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item>Agenzia</Menu.Item>
                  <Menu.Item>Codice Comm</Menu.Item>
                  <Menu.Item>CIG</Menu.Item>
                  <Menu.Item>Coterm at Renewal</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item onClick={handleOpenModal}>
                    Revert Switched Order
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              
              {/* Demo Toggle - Remove in production */}
              <Button
                variant="subtle"
                size="xs"
                mt="xs"
                onClick={handleScenarioToggle}
                style={{ fontSize: '10px', padding: '2px 8px' }}
              >
                Demo: {isPartialScenario ? 'Partial Switch' : 'Full Switch'}
              </Button>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Navigation Tabs */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group gap="lg">
            <Text size="sm" fw={500} style={{ cursor: 'pointer' }}>
              Order History
            </Text>
            <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>
              Update Subscription
            </Text>
            <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>
              Activity
            </Text>
            <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>
              Users
            </Text>
            <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>
              Consumption
            </Text>
          </Group>
        </Card>
      </Container>

      {/* Revert Order Modal */}
      <RevertOrderModal
        opened={modalOpened}
        onClose={handleCloseModal}
        scenario={modalScenario}
      />
    </Box>
  );
};

export default MidTermUpgradesFlow;

