import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Title, 
  Text, 
  Button, 
  Card, 
  Grid, 
  Group, 
  Stack, 
  Badge, 
  Alert,
  TextInput,
  NumberInput,
  ActionIcon,
  Tooltip,
  Table,
  Divider,
  Paper,
  ThemeIcon,
  Loader,
  Anchor,
  Tabs,
  Notification,
  SegmentedControl
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconEdit, 
  IconCopy, 
  IconTrash, 
  IconX, 
  IconRefresh,
  IconStar,
  IconMessageCircle,
  IconCreditCard,
  IconMapPin,
  IconPhone,
  IconCheck,
  IconAlertTriangle,
  IconLoader,
  IconBolt
} from '@tabler/icons-react';

const AdobeCheckoutSlownessFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorRef = useRef<HTMLDivElement>(null);
  
  // Determine active tab from location
  const getActiveTab = () => {
    const path = location.pathname;
    // Check for checkout specifically (not just containing '/checkout')
    if (path === '/adobe-checkout-slowness/checkout' || path.endsWith('/checkout')) {
      return 'checkout';
    }
    // Default to quotes for root path, /quotes, or anything else
    return 'quotes';
  };
  const activeTab = getActiveTab();
  
  // Redirect root path to /quotes on mount if needed
  useEffect(() => {
    if (location.pathname === '/adobe-checkout-slowness' || location.pathname === '/adobe-checkout-slowness/') {
      navigate('/adobe-checkout-slowness/quotes', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Add CSS for sliding notification animation from bottom-right
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Top Navigation Bar */}
      <Box style={{ backgroundColor: '#3c3c3c', padding: '0.75rem 0' }}>
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Group>
              <Text c="white" fw={600} size="lg">AppDirect</Text>
            </Group>
            <Group>
              <TextInput 
                placeholder="Search" 
                size="sm" 
                style={{ width: 300 }}
                rightSection={<ActionIcon variant="subtle" color="white"><IconRefresh size={16} /></ActionIcon>}
              />
            </Group>
            <Group>
              <Button variant="subtle" color="white" size="sm">Manage</Button>
              <Button variant="subtle" color="white" size="sm">Suresh</Button>
              <ActionIcon variant="subtle" color="white" size="lg">
                <IconCreditCard size={20} />
                <Badge size="xs" color="red" style={{ position: 'absolute', top: -5, right: -5 }}>1</Badge>
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Secondary Navigation */}
      <Box style={{ backgroundColor: '#f8f8f8', borderBottom: '1px solid #e5e7eb' }}>
        <Container size="xl">
          <Group gap="xl" py="sm">
            <Anchor c="dimmed" size="sm">Marketplace</Anchor>
            <Anchor c="dark" size="sm" fw={500}>Dashboard</Anchor>
            <Anchor c="dimmed" size="sm">Products</Anchor>
            <Anchor c="dimmed" size="sm">Settings</Anchor>
            <Anchor c="dimmed" size="sm">Reports</Anchor>
            <Anchor c="dimmed" size="sm">Themes</Anchor>
          </Group>
        </Container>
      </Box>

      {/* Main Content */}
      <Container size="xl" py="xl">
        <Tabs value={activeTab} onChange={(value) => {
          if (value === 'checkout') {
            navigate('/adobe-checkout-slowness/checkout', { replace: true });
          } else {
            navigate('/adobe-checkout-slowness/quotes', { replace: true });
          }
        }}>
          <Tabs.List mb="xl">
            <Tabs.Tab value="quotes">Quotes</Tabs.Tab>
            <Tabs.Tab value="checkout">Checkout</Tabs.Tab>
          </Tabs.List>

          <Routes>
            <Route index element={<QuotesPageContent errorRef={errorRef} />} />
            <Route path="quotes" element={<QuotesPageContent errorRef={errorRef} />} />
            <Route path="checkout" element={<CheckoutPageContent errorRef={errorRef} />} />
          </Routes>
        </Tabs>
      </Container>
    </Box>
  );
};

// Quotes Page Content Component (moved from OpportunityPageContent)
const QuotesPageContent: React.FC<{ errorRef: React.RefObject<HTMLDivElement> }> = ({ errorRef }) => {
  const [quantity, setQuantity] = useState(1);
  const [displayQuantity, setDisplayQuantity] = useState(1); // Displayed quantity (updated only on success)
  const [isSaving, setIsSaving] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAttemptedQuantity, setLastAttemptedQuantity] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showPersistentError, setShowPersistentError] = useState(false);
  const [demoMode, setDemoMode] = useState<'success' | 'failure'>('failure');
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load last attempted quantity from localStorage on component mount
  useEffect(() => {
    const savedQuantity = localStorage.getItem('lastAttemptedQuantity');
    if (savedQuantity) {
      setLastAttemptedQuantity(parseInt(savedQuantity, 10));
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, []);

  // Reset state when demo mode changes
  useEffect(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = null;
    }
    setIsSaving(false);
    setIsProcessing(false);
    setShowError(false);
    setShowSuccess(false);
    setShowPersistentError(false);
    setShowNotification(false);
    setRetryCount(0);
    setDisplayQuantity(quantity); // Reset display quantity when demo mode changes
  }, [demoMode]); // Removed quantity from dependencies - only reset when demo mode changes

  // Calculate pricing based on displayed quantity (only updates on success)
  const unitPrice = 335.88;
  const originalUnitPrice = 400.00; // For discount display
  const discountedUnitPrice = 335.88; // With 3YC discount (16% off)
  const totalPrice = displayQuantity * discountedUnitPrice;
  const proratedAmount = totalPrice * 0.96; // 96% of total for prorated
  const tax = proratedAmount * 0.05; // 5% tax
  const totalDueToday = proratedAmount + tax;

  const attemptPriceFetch = async (attemptNumber: number): Promise<boolean> => {
    // Simulate API call delay - 2.5 seconds for initial attempt (50% reduction from 5s), 3 seconds for retries
    const delay = attemptNumber === 1 ? 2500 : 3000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // For demo mode: fail for failure mode, succeed for success mode
    if (demoMode === 'failure') {
      // Always fail if in failure mode (until 3 retries exhausted)
      return false;
    } else {
      // Success mode: succeed on 3rd attempt (after initial 2.5s wait + 2 retries)
      return attemptNumber === 3;
    }
  };

  const handleSave = async () => {
    // Check if this is a retry of the same quantity after a failed attempt (cache scenario)
    const cachedFailedQuantity = localStorage.getItem('lastAttemptedQuantity');
    const hadPersistentError = localStorage.getItem('hadPersistentError') === 'true';
    if (cachedFailedQuantity && parseInt(cachedFailedQuantity, 10) === quantity && (showPersistentError || hadPersistentError)) {
      // Cache hit - show success immediately
      setDisplayQuantity(quantity);
      setIsSaving(false);
      setIsProcessing(false);
      setShowSuccess(true);
      setShowPersistentError(false);
      setRetryCount(0);
      localStorage.removeItem('lastAttemptedQuantity');
      localStorage.removeItem('hadPersistentError');
      setLastAttemptedQuantity(null);

      // Auto-scroll to success message
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return;
    }

    setIsSaving(true);
    setIsProcessing(true);
    setShowError(false);
    setShowSuccess(false);
    setShowPersistentError(false);
    setRetryCount(0);
    setLastAttemptedQuantity(quantity);
    localStorage.setItem('lastAttemptedQuantity', quantity.toString());

    // Start retry mechanism
    const performRetry = async (attemptNumber: number) => {
      // For success mode, attempt 0 is just the initial 2.5 second wait with spinner (50% reduction from 5s)
      if (attemptNumber === 0 && demoMode === 'success') {
        setRetryCount(0);
        retryTimerRef.current = setTimeout(() => performRetry(1), 2500);
        return;
      }
      const success = await attemptPriceFetch(attemptNumber);

      if (success) {
        // Success - update displayed quantity and prices, then show success
        setDisplayQuantity(quantity);
        setIsSaving(false);
        setIsProcessing(false);
        setShowSuccess(true);
        setRetryCount(0);
        localStorage.removeItem('lastAttemptedQuantity');
        setLastAttemptedQuantity(null);

        // Auto-scroll to success message
        setTimeout(() => {
          if (errorRef.current) {
            errorRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);

        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        return;
      }

      // Failed - handle retry logic
      if (demoMode === 'success') {
        // Success mode flow: 2.5s wait → attempt 1 with message → attempt 2 with message → success
        if (attemptNumber === 1) {
          // First retry: show notification "Adobe APIs are slow, unresponsive, retrying"
          setRetryCount(1);
          setShowNotification(true);
          notificationTimerRef.current = setTimeout(() => {
            setShowNotification(false);
          }, 5000); // Changed from 2000 to 5000 (5 seconds)
          // Continue with spinner and retry after 3 seconds
          retryTimerRef.current = setTimeout(() => performRetry(2), 3000);
        } else if (attemptNumber === 2) {
          // Second retry: show notification again
          setRetryCount(2);
          setShowNotification(true);
          notificationTimerRef.current = setTimeout(() => {
            setShowNotification(false);
          }, 5000); // Changed from 2000 to 5000 (5 seconds)
          // Continue with spinner and retry (will succeed on attempt 3)
          retryTimerRef.current = setTimeout(() => performRetry(3), 3000);
        }
      } else {
        // Failure mode flow
        if (attemptNumber === 1) {
          // First failure: silent retry (just spinner, no notification, 2.5 seconds - 50% reduction)
          setRetryCount(1);
          retryTimerRef.current = setTimeout(() => performRetry(2), 2500);
        } else if (attemptNumber === 2) {
          // Second failure: show sliding notification
          setRetryCount(2);
          setShowNotification(true);
          // Auto-hide notification after 2 seconds
          notificationTimerRef.current = setTimeout(() => {
            setShowNotification(false);
          }, 2000);
          // Continue with spinner and retry after 3 seconds
          retryTimerRef.current = setTimeout(() => performRetry(3), 3000);
        } else if (attemptNumber === 3) {
          // Third failure: show notification again
          setRetryCount(3);
          setShowNotification(true);
          notificationTimerRef.current = setTimeout(() => {
            setShowNotification(false);
          }, 5000); // Changed from 2000 to 5000 (5 seconds)
          // Show persistent error after 3 retries
          retryTimerRef.current = setTimeout(() => {
            setIsSaving(false);
            setIsProcessing(false);
            setShowPersistentError(true);
            setShowError(false);
            setRetryCount(0);
            // Store flag in localStorage for cache detection after refresh
            localStorage.setItem('hadPersistentError', 'true');

            // Auto-scroll to error message
            setTimeout(() => {
              if (errorRef.current) {
                errorRef.current.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
              }
            }, 100);
          }, 3000);
        }
      }
    };

    // Start retry mechanism - for success mode, start with 2.5s wait (attempt 0)
    if (demoMode === 'success') {
      performRetry(0);
    } else {
      performRetry(1);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box>
      {/* Notification - Sliding message from bottom-right */}
      {showNotification && (
        <Box style={{ 
          position: 'fixed', 
          bottom: '220px', // Moved up by 5cm (200px) from 20px
          right: '20px', 
          zIndex: 1000,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <Notification
            icon={<IconAlertTriangle size={18} />}
            color="orange"
            title="Adobe API Slowness"
            onClose={() => setShowNotification(false)}
            withCloseButton
            styles={{
              root: {
                minWidth: '400px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }
            }}
          >
            Experiencing slowness from Adobe APIs. Retrying the operation to fetch latest prices.
          </Notification>
        </Box>
      )}

      {/* Demo Mode Toggle */}
      <Box mb="md" style={{ 
        position: 'sticky', 
        top: '20px', 
        zIndex: 100,
        backgroundColor: 'white',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginBottom: '16px'
      }}>
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500}>Demo Mode:</Text>
          <SegmentedControl
            value={demoMode}
            onChange={(value) => setDemoMode(value as 'success' | 'failure')}
            data={[
              { label: 'Success Flow', value: 'success' },
              { label: 'Failure Flow', value: 'failure' }
            ]}
            size="sm"
          />
        </Group>
      </Box>

    <Grid>
      {/* Main Content */}
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <Stack gap="xl">
          {/* Back Navigation */}
          <Group>
            <ActionIcon variant="subtle" size="sm">
              <IconArrowLeft size={16} />
            </ActionIcon>
            <Text size="sm" c="dimmed">OPPORTUNITIES</Text>
          </Group>

          {/* Opportunity Header */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Group>
                <ThemeIcon color="blue" size="lg" radius="md">
                  <IconStar size={20} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" c="dimmed">Opportunity</Text>
                  <Badge color="green" size="sm">OPEN</Badge>
                </Box>
              </Group>
            </Group>
            
            <Title order={3} mb="md">
              Quote version for Adobe Commercial SJ by Appdirect SJ
              <ActionIcon variant="subtle" size="sm" ml="xs">
                <IconEdit size={14} />
              </ActionIcon>
            </Title>
            
            <Group>
              <Button color="blue" disabled={showPersistentError || isProcessing}>Finalize</Button>
              <Button variant="outline">Clone Opportunity</Button>
            </Group>
          </Card>

          {/* Success Message */}
          {showSuccess && (
            <Alert 
              ref={errorRef}
              icon={<IconCheck size={16} />} 
              title="Price Updated Successfully" 
              color="green"
              mb="md"
            >
              <Text size="sm">
                Prices have been successfully updated for {quantity} users. The pricing has been recalculated with latest discounts.
              </Text>
            </Alert>
          )}

          {/* Details Section */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Details</Title>
              <ActionIcon variant="subtle" size="sm">
                <IconEdit size={14} />
                <Text size="xs" ml="xs">Edit</Text>
              </ActionIcon>
            </Group>
            
            <Grid>
              <Grid.Col span={6}>
                <Stack gap="sm">
                  <Box>
                    <Text size="sm" c="dimmed">Opportunity Name</Text>
                    <Text size="sm">Quote version for Adobe Commercial SJ by Appdirect SJ</Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">Created Date</Text>
                    <Text size="sm">10/28/25</Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">Purchase Effective Date</Text>
                    <Text size="sm">—</Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">Confirm Currency</Text>
                    <Text size="sm">USD</Text>
                  </Box>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap="sm">
                  <Box>
                    <Text size="sm" c="dimmed">Customer</Text>
                    <Anchor size="sm">Adobe Commercial SJ, Suresh Jambhalkar</Anchor>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">Owner</Text>
                    <Anchor size="sm">Appdirect SJ, Suresh J</Anchor>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">Opportunity ID</Text>
                    <Group gap="xs">
                      <Text size="sm">161db585-ac7f-42cc-bb18-829b2bb81298</Text>
                      <ActionIcon variant="subtle" size="xs">
                        <IconCopy size={12} />
                      </ActionIcon>
                    </Group>
                  </Box>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Products Section */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Products</Title>
            
            {/* Persistent Error Message - Above Products section */}
            {showPersistentError && (
              <Alert 
                ref={errorRef}
                icon={<IconAlertTriangle size={16} />} 
                title="Unable to Fetch Latest Prices" 
                color="red"
                mb="md"
              >
                <Text size="sm" mb="sm">
                  We are experiencing slowness to get latest pricing from Adobe. All retry attempts have been exhausted. Please refresh the page after few minutes to view the latest price.
                </Text>
                <Button 
                  leftSection={<IconRefresh size={16} />} 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                >
                  Refresh Page
                </Button>
              </Alert>
            )}
            
            <TextInput 
              placeholder="Search to add a product" 
              mb="md"
              rightSection={<ActionIcon variant="subtle"><IconRefresh size={16} /></ActionIcon>}
            />
            
            {/* Product Item */}
            <Paper p="md" withBorder mb="md">
              <Group justify="space-between" mb="md">
                <Group>
                  <ThemeIcon color="red" size="md" radius="md">
                    <Text size="xs" fw={700} c="white">PDF</Text>
                  </ThemeIcon>
                  <Box>
                    <Text fw={500}>Adobe Acrobat Pro for Enterprise (NA)</Text>
                    <Badge size="xs" color="blue">WEB APP</Badge>
                  </Box>
                </Group>
                <Group>
                  <ActionIcon variant="subtle" color="red">
                    <IconTrash size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle">
                    <IconX size={16} />
                  </ActionIcon>
                </Group>
              </Group>
              
              <Grid gutter="md">
                <Grid.Col span={12}>
                  {/* Plan */}
                  <Box mb="md">
                    <Text size="sm" c="dimmed" mb="xs">Plan</Text>
                    <Text size="sm">Pro subscription, annual - Yearly - 1 Year Contract</Text>
                  </Box>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  {/* Users */}
                  <Box mb="md">
                    <Text size="sm" c="dimmed" mb="xs">Users</Text>
                    <NumberInput
                      value={quantity}
                      onChange={(value) => setQuantity(typeof value === 'number' ? value : 1)}
                      min={1}
                      size="sm"
                      rightSection={<IconCheck size={16} color="green" />}
                      style={{ width: 100 }}
                    />
                    <Text size="xs" c="dimmed" mt="xs">Minimum 1</Text>
                  </Box>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  {/* Markup */}
                  <Box mb="md">
                    <Text size="sm" c="dimmed" mb="xs">Apply Markdown / MarkUp % (optional)</Text>
                    <Group gap="xs" mb="xs">
                      <Button variant="filled" size="xs">MarkUp %</Button>
                      <Button variant="outline" size="xs">Markdown %</Button>
                    </Group>
                    <NumberInput
                      value={0}
                      size="sm"
                      style={{ width: 100 }}
                    />
                    <Text size="xs" c="dimmed" mt="xs">Markup the price by using percentage points here</Text>
                  </Box>
                </Grid.Col>
                
                <Grid.Col span={12}>
                  {/* Pricing Table */}
                  <Box mb="md">
                    <Text size="sm" c="dimmed" mb="xs">Product Pricing</Text>
                    {showSuccess && (
                      <Box mb="xs" p="xs" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px' }}>
                        <Group gap={4} align="center">
                          <Text size="xs" td="line-through" c="dimmed">${originalUnitPrice.toFixed(2)} / User / year</Text>
                        </Group>
                        <Group gap={4} align="center" mt={4}>
                          <Text size="xs" fw={600} c="#0891b2">${discountedUnitPrice.toFixed(2)} / User / year</Text>
                          <IconBolt size={12} color="#0891b2" />
                          <Text size="xs" c="#0891b2">3-year Commit pricing applied</Text>
                        </Group>
                      </Box>
                    )}
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Description</Table.Th>
                          <Table.Th>Frequency</Table.Th>
                          <Table.Th>Quantity</Table.Th>
                          <Table.Th>Unit wholesale price</Table.Th>
                          <Table.Th>Unit selling price</Table.Th>
                          <Table.Th>Total selling price</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td>Recurring Fee Per User (USER)</Table.Td>
                          <Table.Td>Yearly</Table.Td>
                          <Table.Td>{displayQuantity}</Table.Td>
                          <Table.Td>—</Table.Td>
                          <Table.Td>
                            {showSuccess ? (
                              <Group gap={4}>
                                <Text size="sm" td="line-through" c="dimmed">${originalUnitPrice.toFixed(2)}</Text>
                                <Text size="sm" fw={500} c="#0891b2">${discountedUnitPrice.toFixed(2)}</Text>
                              </Group>
                            ) : (
                              <Text size="sm">$335.88</Text>
                            )}
                          </Table.Td>
                          <Table.Td>${totalPrice.toFixed(2)}</Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </Box>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  {/* Contract Terms */}
                  <Box>
                    <Text size="sm" c="dimmed" mb="xs">Contract Terms</Text>
                    <Text size="sm" mb="xs">Length: 1 year(s)</Text>
                    <Button variant="outline" size="xs">Add custom contract</Button>
                  </Box>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  {/* Date Controls */}
                  <Box>
                    <Text size="sm" c="dimmed" mb="xs">Date Controls</Text>
                    <Box mb="xs">
                      <Text size="xs" c="dimmed" mb={4}>Request service on:</Text>
                      <Group gap={4}>
                        <Button variant="filled" size="xs">Immediate</Button>
                        <Button variant="outline" size="xs">Fixed date</Button>
                      </Group>
                    </Box>
                    <Box>
                      <Text size="xs" c="dimmed" mb={4}>Billing effective on:</Text>
                      <Group gap={4}>
                        <Button variant="filled" size="xs">Service activation</Button>
                        <Button variant="outline" size="xs">Next billing cycle</Button>
                        <Button variant="outline" size="xs">Fixed date</Button>
                      </Group>
                    </Box>
                  </Box>
                </Grid.Col>
              </Grid>
            </Paper>
            
            {/* Action Buttons */}
            <Group justify="flex-end">
              <Button 
                variant="outline" 
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                color="blue" 
                onClick={handleSave}
                disabled={isSaving}
                leftSection={isSaving ? <Loader size="xs" /> : null}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </Group>
          </Card>
        </Stack>
      </Grid.Col>

      {/* Right Sidebar */}
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <Stack gap="md">
          {/* Products Summary */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Products Summary</Title>
              <Group>
                <ActionIcon variant="subtle" size="sm">
                  <IconStar size={16} />
                </ActionIcon>
                <ActionIcon variant="subtle" size="sm">
                  <IconMessageCircle size={16} />
                </ActionIcon>
              </Group>
            </Group>
            
            <Paper p="md" withBorder mb="md">
              <Group justify="space-between" mb="sm">
                <Anchor size="sm">Adobe Acrobat Pro for Enterprise (NA)</Anchor>
                <Group>
                  <ActionIcon variant="subtle" color="red" size="sm">
                    <IconTrash size={14} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" size="sm">
                    <IconMessageCircle size={14} />
                  </ActionIcon>
                </Group>
              </Group>
              <Badge size="xs" color="blue" mb="sm">WEB APP</Badge>
              <Text size="sm" c="dimmed" mb="xs">Pro subscription, annual</Text>
              <Text size="sm">1 - {displayQuantity} Users - {
                showSuccess ? (
                  <Group gap={4} style={{ display: 'inline-flex' }}>
                    <Text size="sm" td="line-through" c="dimmed">$400.00</Text>
                    <Text size="sm" fw={500} c="#0891b2">$335.88</Text>
                  </Group>
                ) : (
                  '$335.88'
                )
              }/User</Text>
              <Text size="sm" fw={500} mt="xs">${totalPrice.toFixed(2)}</Text>
            </Paper>
            
            {/* Discount Code */}
            <Box mb="md">
              <Text size="sm" c="dimmed" mb="xs">Apply a discount code</Text>
              <Group>
                <TextInput 
                  placeholder="Enter a discount code" 
                  size="sm"
                  style={{ flex: 1 }}
                />
                <Button size="sm">Apply</Button>
              </Group>
            </Box>
            
            {/* Order Totals */}
            <Box>
              <Text size="sm" c="dimmed" mb="xs">
                Prorated charges for period from $323.00 10/28/25 to 10/14/26
              </Text>
              <Group justify="space-between" mb="xs">
                <Text size="sm">Subtotal: *</Text>
                <Text size="sm">${proratedAmount.toFixed(2)}</Text>
              </Group>
              <Group justify="space-between" mb="xs">
                <Text size="sm">Flat Tax</Text>
                <Text size="sm">${tax.toFixed(2)}</Text>
              </Group>
              <Divider my="sm" />
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>Total due today *</Text>
                <Text size="sm" fw={500}>${totalDueToday.toFixed(2)}</Text>
              </Group>
              <Text size="xs" c="dimmed">* Estimated values until order is finalized</Text>
            </Box>
          </Card>
          
          {/* Total Estimated Recurring Fees */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Total estimated recurring fees</Title>
              <ActionIcon variant="subtle" size="sm">
                <IconEdit size={14} />
                <Text size="xs" ml="xs">Edit</Text>
              </ActionIcon>
            </Group>
            
            <Text size="sm" c="dimmed" mb="md">
              The amount you pay each billing cycle may vary based on usage, if applicable.
            </Text>
            
            <Group justify="space-between">
              <Text size="sm" fw={500}>Total due yearly</Text>
              <Text size="sm" fw={500}>${totalPrice.toFixed(2)}</Text>
            </Group>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
    </Box>
  );
};

// Checkout Page Content Component
const CheckoutPageContent: React.FC<{ errorRef: React.RefObject<HTMLDivElement> }> = ({ errorRef }) => {
  const [quantity, setQuantity] = useState(10);
  const [displayQuantity, setDisplayQuantity] = useState(10); // Displayed quantity (updated only on success)
  const [isProcessing, setIsProcessing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAttemptedQuantity, setLastAttemptedQuantity] = useState<number | null>(null);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showPersistentError, setShowPersistentError] = useState(false);
  const [demoMode, setDemoMode] = useState<'success' | 'failure'>('failure');
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load last attempted quantity from localStorage on component mount
  useEffect(() => {
    const savedQuantity = localStorage.getItem('checkoutLastAttemptedQuantity');
    if (savedQuantity) {
      const parsedQuantity = parseInt(savedQuantity, 10);
      setLastAttemptedQuantity(parsedQuantity);
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, []);

  // Reset state when demo mode changes
  useEffect(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = null;
    }
    setIsProcessing(false);
    setIsNextDisabled(false);
    setShowError(false);
    setShowSuccess(false);
    setShowPersistentError(false);
    setShowNotification(false);
    setRetryCount(0);
    setDisplayQuantity(quantity); // Reset display quantity when demo mode changes
  }, [demoMode]); // Removed quantity from dependencies - only reset when demo mode changes

  // Pricing calculations based on displayed quantity (only updates on success)
  const originalUnitPrice = 10.00;
  const discountedUnitPrice = 7.50; // 3YC discount (25% off)
  const yearlyPrice = displayQuantity * discountedUnitPrice;
  const subtotal = yearlyPrice * 0.948; // Approximate to match $71.10 for 10 users
  const tax = subtotal * 0.05; // 5% tax
  const dueNow = subtotal + tax;

  const attemptPriceFetch = async (attemptNumber: number): Promise<boolean> => {
    // Simulate API call delay - 2.5 seconds for initial attempt (50% reduction from 5s), 3 seconds for retries
    const delay = attemptNumber === 1 ? 2500 : 3000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // For demo mode: fail for failure mode, succeed for success mode
    if (demoMode === 'failure') {
      // Always fail if in failure mode (until 3 retries exhausted)
      return false;
    } else {
      // Success mode: succeed on 3rd attempt (after initial 2.5s wait + 2 retries)
      return attemptNumber === 3;
    }
  };

  const handleQuantityBlur = async () => {
    // Check if quantity changed, if not, don't process
    if (quantity === displayQuantity && !showPersistentError) {
      return;
    }

    // Check if this is a retry of the same quantity after a failed attempt (cache scenario)
    const cachedFailedQuantity = localStorage.getItem('checkoutLastAttemptedQuantity');
    const hadPersistentError = localStorage.getItem('checkoutHadPersistentError') === 'true';
    if (cachedFailedQuantity && parseInt(cachedFailedQuantity, 10) === quantity && (showPersistentError || hadPersistentError)) {
      // Cache hit - show success immediately
      setDisplayQuantity(quantity);
      setIsProcessing(false);
      setIsNextDisabled(false);
      setShowSuccess(true);
      setShowPersistentError(false);
      setRetryCount(0);
      localStorage.removeItem('checkoutLastAttemptedQuantity');
      localStorage.removeItem('checkoutHadPersistentError');
      setLastAttemptedQuantity(null);

      // Auto-scroll to success message
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return;
    }

    setIsProcessing(true);
    setIsNextDisabled(true);
    setShowError(false);
    setShowSuccess(false);
    setShowPersistentError(false);
    setRetryCount(0);
    setLastAttemptedQuantity(quantity);
    localStorage.setItem('checkoutLastAttemptedQuantity', quantity.toString());

    // Start retry mechanism
    const performRetry = async (attemptNumber: number) => {
      // For success mode, attempt 0 is just the initial 2.5 second wait with spinner (50% reduction from 5s)
      if (attemptNumber === 0 && demoMode === 'success') {
        setRetryCount(0);
        retryTimerRef.current = setTimeout(() => performRetry(1), 2500);
        return;
      }
      const success = await attemptPriceFetch(attemptNumber);

      if (success) {
        // Success - update displayed quantity and prices, then show success
        setDisplayQuantity(quantity);
        setIsProcessing(false);
        setIsNextDisabled(false);
        setShowSuccess(true);
        setRetryCount(0);
        localStorage.removeItem('checkoutLastAttemptedQuantity');
        setLastAttemptedQuantity(null);

        // Auto-scroll to success message
        setTimeout(() => {
          if (errorRef.current) {
            errorRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);

        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        return;
      }

      // Failed - handle retry logic
      if (demoMode === 'success') {
        // Success mode flow: 2.5s wait → attempt 1 with message → attempt 2 with message → success
        if (attemptNumber === 1) {
          // First retry: show notification "Adobe APIs are slow, unresponsive, retrying"
          setRetryCount(1);
          setShowNotification(true);
          notificationTimerRef.current = setTimeout(() => {
            setShowNotification(false);
          }, 5000); // Changed from 2000 to 5000 (5 seconds)
          // Continue with spinner and retry after 3 seconds
          retryTimerRef.current = setTimeout(() => performRetry(2), 3000);
        } else if (attemptNumber === 2) {
          // Second retry: show notification again
          setRetryCount(2);
          setShowNotification(true);
          notificationTimerRef.current = setTimeout(() => {
            setShowNotification(false);
          }, 5000); // Changed from 2000 to 5000 (5 seconds)
          // Continue with spinner and retry (will succeed on attempt 3)
          retryTimerRef.current = setTimeout(() => performRetry(3), 3000);
        }
      } else {
        // Failure mode flow
        if (attemptNumber === 1) {
          // First failure: silent retry (just spinner, no notification, 2.5 seconds - 50% reduction)
          setRetryCount(1);
          retryTimerRef.current = setTimeout(() => performRetry(2), 2500);
        } else if (attemptNumber === 2) {
          // Second failure: show sliding notification
          setRetryCount(2);
          setShowNotification(true);
          // Auto-hide notification after 5 seconds
          notificationTimerRef.current = setTimeout(() => {
            setShowNotification(false);
          }, 5000); // Changed from 2000 to 5000 (5 seconds)
          // Continue with spinner and retry after 3 seconds
          retryTimerRef.current = setTimeout(() => performRetry(3), 3000);
        } else if (attemptNumber === 3) {
          // Third failure: show notification again
          setRetryCount(3);
          setShowNotification(true);
          notificationTimerRef.current = setTimeout(() => {
            setShowNotification(false);
          }, 5000); // Changed from 2000 to 5000 (5 seconds)
          // Show persistent error after 3 retries
          retryTimerRef.current = setTimeout(() => {
            setIsProcessing(false);
            setShowPersistentError(true);
            setShowError(false);
            setIsNextDisabled(true);
            setRetryCount(0);
            // Store flag in localStorage for cache detection after refresh
            localStorage.setItem('checkoutHadPersistentError', 'true');

            // Auto-scroll to error message
            setTimeout(() => {
              if (errorRef.current) {
                errorRef.current.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
              }
            }, 100);
          }, 3000);
        }
      }
    };

    // Start retry mechanism - for success mode, start with 2.5s wait (attempt 0)
    if (demoMode === 'success') {
      performRetry(0);
    } else {
      performRetry(1);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box>
      {/* Notification - Sliding message from bottom-right */}
      {showNotification && (
        <Box style={{ 
          position: 'fixed', 
          bottom: '220px', // Moved up by 5cm (200px) from 20px
          right: '20px', 
          zIndex: 1000,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <Notification
            icon={<IconAlertTriangle size={18} />}
            color="orange"
            title="Adobe API Slowness"
            onClose={() => setShowNotification(false)}
            withCloseButton
            styles={{
              root: {
                minWidth: '400px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }
            }}
          >
            Experiencing slowness from Adobe APIs. Retrying the operation to fetch latest prices.
          </Notification>
        </Box>
      )}

      {/* Demo Mode Toggle */}
      <Box mb="md" style={{ 
        position: 'sticky', 
        top: '20px', 
        zIndex: 100,
        backgroundColor: 'white',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginBottom: '16px'
      }}>
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500}>Demo Mode:</Text>
          <SegmentedControl
            value={demoMode}
            onChange={(value) => setDemoMode(value as 'success' | 'failure')}
            data={[
              { label: 'Success Flow', value: 'success' },
              { label: 'Failure Flow', value: 'failure' }
            ]}
            size="sm"
          />
        </Group>
      </Box>

      {/* Top Header Bar */}
      <Box style={{ 
        backgroundColor: '#3c3c3c', 
        padding: '16px 0',
        marginBottom: '24px',
        borderRadius: '4px'
      }}>
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Button 
              variant="subtle" 
              color="white"
              leftSection={<IconArrowLeft size={16} />}
            >
              Continue Shopping
            </Button>
            <Badge 
              size="lg" 
              variant="outline" 
              style={{ 
                backgroundColor: 'white',
                color: '#3c3c3c',
                borderColor: '#3c3c3c',
                padding: '8px 16px'
              }}
            >
              ACME
            </Badge>
          </Group>
        </Container>
      </Box>

      {/* Success Message */}
      {showSuccess && (
        <Alert 
          ref={errorRef}
          icon={<IconCheck size={16} />} 
          title="Price Updated Successfully" 
          color="green"
          mb="md"
        >
          <Text size="sm">
            Prices have been successfully updated for {quantity} users. The pricing has been recalculated with latest discounts.
          </Text>
        </Alert>
      )}

      {/* Persistent Error Message */}
      {showPersistentError && (
        <Alert 
          ref={errorRef}
          icon={<IconAlertTriangle size={16} />} 
          title="Unable to Fetch Latest Prices" 
          color="red"
          mb="md"
        >
          <Text size="sm" mb="sm">
            We are experiencing slowness to get latest pricing from Adobe. All retry attempts have been exhausted. Please refresh the page after few minutes to view the latest price.
          </Text>
          <Button 
            leftSection={<IconRefresh size={16} />} 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
          >
            Refresh Page
          </Button>
        </Alert>
      )}

      <Grid>
        {/* Left Column - Cart Details */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="md">
            <Box>
              <Text size="sm" c="dimmed" mb={4}>Step 1 of 2</Text>
              <Title order={2} mb="xl">Cart</Title>
            </Box>

            {/* Product Card */}
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: 'white' }}>
              <Group justify="space-between" align="flex-start" mb="md">
                <Group>
                  <ThemeIcon 
                    color="#0891b2" 
                    size={48} 
                    radius="md"
                    style={{ backgroundColor: '#0891b2' }}
                  >
                    <Text size="sm" fw={700} c="white">Dn</Text>
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Text fw={600} size="lg">3YC - RFS Dreamweaver</Text>
                    <Text size="sm" c="dimmed">Adobe Developer</Text>
                  </Stack>
                </Group>
                <Anchor size="sm" c="blue">Remove</Anchor>
              </Group>

              {/* Plan Details */}
              <Box mb="md">
                <Text fw={500} size="sm" mb="xs">Annual Plan (EU English) Level 1</Text>
                <Text size="xs" c="dimmed">
                  Minimum contract duration is 1 year. Early cancellation charge of 100% will apply. Auto-renews to a 1 year contract.
                </Text>
              </Box>

              {/* Total Users Input */}
              <Box mb="md">
                <Group align="center" gap="md">
                  <Text size="sm" fw={500}>Total Users</Text>
                  <NumberInput
                    value={quantity}
                    onChange={(value) => setQuantity(typeof value === 'number' ? value : 1)}
                    onBlur={handleQuantityBlur}
                    min={1}
                    size="sm"
                    style={{ width: 100 }}
                    disabled={isProcessing}
                  />
                </Group>
              </Box>

              {/* Pricing Information */}
              <Box>
                <Stack gap="xs">
                  {showSuccess && (
                    <Group gap="xs" align="center">
                      <Text size="sm" td="line-through" c="dimmed">${originalUnitPrice.toFixed(2)} / User / year</Text>
                    </Group>
                  )}
                  <Group gap="xs" align="center">
                    {showSuccess ? (
                      <Group gap="xs" align="center">
                        <Text size="sm" fw={600} c="#0891b2">${discountedUnitPrice.toFixed(2)} / User / year</Text>
                        <IconBolt size={16} color="#0891b2" />
                        <Text size="sm" c="#0891b2">3-year Commit pricing applied</Text>
                      </Group>
                    ) : (
                      <Text size="sm" fw={600} c="dimmed">${discountedUnitPrice.toFixed(2)} / User / year</Text>
                    )}
                  </Group>
                </Stack>
              </Box>
            </Card>
          </Stack>
        </Grid.Col>

        {/* Right Column - Order Summary */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: 'white' }}>
              {/* Product Summary */}
              <Paper p="sm" withBorder mb="md" style={{ backgroundColor: '#f9fafb' }}>
                <Group mb="xs">
                  <ThemeIcon 
                    color="#0891b2" 
                    size={32} 
                    radius="md"
                    style={{ backgroundColor: '#0891b2' }}
                  >
                    <Text size="xs" fw={700} c="white">Dn</Text>
                  </ThemeIcon>
                  <Stack gap={2} style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>3YC - RFS Dreamweaver</Text>
                    <Text size="xs" c="dimmed">Annual Plan (EU English) Level 1</Text>
                  </Stack>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">{displayQuantity} Users (yearly)</Text>
                  <Text size="sm" fw={500}>${yearlyPrice.toFixed(2)}</Text>
                </Group>
              </Paper>

              {/* Discount Codes */}
              <Box mb="md">
                <Text size="sm" c="dimmed" mb="xs">Apply discount codes</Text>
                <Group>
                  <TextInput 
                    placeholder="Enter code" 
                    size="sm"
                    style={{ flex: 1 }}
                  />
                  <Button size="sm" variant="outline">Apply</Button>
                </Group>
              </Box>

              {/* Due Now */}
              <Box mb="md">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={600}>Due now</Text>
                  <Text size="lg" fw={600}>${dueNow.toFixed(2)}</Text>
                </Group>
                <Text size="xs" c="dimmed" mb="sm">
                  Price reflects one-time and prorated recurring charges, if applicable.
                </Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm">Subtotal</Text>
                    <Text size="sm">${subtotal.toFixed(2)}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Estimated tax</Text>
                    <Text size="sm">${tax.toFixed(2)}</Text>
                  </Group>
                </Stack>
              </Box>

              {/* Estimated Recurring Charges */}
              <Box>
                <Text size="sm" fw={600} mb="xs">Estimated recurring charges</Text>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Due yearly (excluding tax)</Text>
                  <Text size="sm" fw={500}>${yearlyPrice.toFixed(2)}</Text>
                </Group>
              </Box>

              {/* Next Button */}
              <Button 
                color="#0891b2"
                fullWidth
                size="lg"
                mt="lg"
                disabled={isNextDisabled || isProcessing}
                leftSection={isProcessing ? <Loader size="xs" color="white" /> : null}
              >
                Next
              </Button>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default AdobeCheckoutSlownessFlow;