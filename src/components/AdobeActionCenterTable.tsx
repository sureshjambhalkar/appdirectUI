import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  Group,
  TextInput,
  ActionIcon,
  Menu,
  Checkbox,
  Select,
  Text,
  Anchor,
  Badge,
  Switch,
} from '@mantine/core';
import { IconSearch, IconFilter, IconDots, IconX, IconLayoutList } from '@tabler/icons-react';
import type { ActionCenterSubscriptionRow } from '../types/adobeActionCenter';

interface AdobeActionCenterTableProps {
  rows: ActionCenterSubscriptionRow[];
  searchPlaceholder?: string;
  onRowAction?: (row: ActionCenterSubscriptionRow, action: string) => void;
  /** If true, show company column and selection (manager view). If false, compact (customer view). */
  managerView?: boolean;
  /** Drives extra columns and row actions (e.g. late-renewals, auto-renewal). */
  categoryId?: string;
  /** Callback when auto-renewal switch is toggled (auto-renewal tab). */
  onAutoRenewalToggle?: (row: ActionCenterSubscriptionRow, enabled: boolean) => void;
}

const PAGE_SIZES = [10, 25, 50];

export default function AdobeActionCenterTable({
  rows,
  searchPlaceholder = 'Search by company name or company ID',
  onRowAction,
  managerView = true,
  categoryId,
  onAutoRenewalToggle,
}: AdobeActionCenterTableProps) {
  const isLateRenewals = categoryId === 'late-renewals';
  const isAutoRenewal = categoryId === 'auto-renewal';
  const isRevertUpgrade = categoryId === 'revert-upgrade';
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const s = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.companyName.toLowerCase().includes(s) ||
        (r.companyId && r.companyId.toLowerCase().includes(s)) ||
        r.subscriptionId.toLowerCase().includes(s) ||
        r.product.toLowerCase().includes(s)
    );
  }, [rows, search]);

  const total = filtered.length;
  const from = (page - 1) * pageSize;
  const to = Math.min(from + pageSize, total);
  const pageRows = filtered.slice(from, to);
  const totalPages = Math.ceil(total / pageSize) || 1;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === pageRows.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(pageRows.map((r) => r.id)));
  };

  return (
    <Box>
      <Group mb="md" gap="xs">
        <ActionIcon variant="subtle" color="gray" size="sm">
          <IconFilter size={16} />
        </ActionIcon>
        <TextInput
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          rightSection={search ? <ActionIcon size="sm" variant="subtle" onClick={() => setSearch('')}><IconX size={14} /></ActionIcon> : null}
          style={{ flex: 1, maxWidth: 400 }}
          size="sm"
        />
        <ActionIcon variant="subtle" color="gray" size="sm">
          <IconLayoutList size={16} />
        </ActionIcon>
      </Group>

      <Text size="sm" c="#6b7280" mb="sm">
        {total} results
      </Text>

      <Paper withBorder radius="md" bg="white">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr style={{ backgroundColor: '#f9fafb' }}>
              {managerView && (
                <Table.Th style={{ width: 40 }}>
                  <Checkbox
                    checked={pageRows.length > 0 && selectedIds.size === pageRows.length}
                    indeterminate={selectedIds.size > 0 && selectedIds.size < pageRows.length}
                    onChange={toggleSelectAll}
                  />
                </Table.Th>
              )}
              <Table.Th fw={600}>Subscription ID</Table.Th>
              <Table.Th fw={600}>Created</Table.Th>
              {managerView && <Table.Th fw={600}>Company name</Table.Th>}
              {isLateRenewals && <Table.Th fw={600}>Status</Table.Th>}
              {isLateRenewals && <Table.Th fw={600}>Days left to reactivate</Table.Th>}
              {isAutoRenewal && <Table.Th fw={600}>Auto-renewal</Table.Th>}
              <Table.Th fw={600}>Product</Table.Th>
              <Table.Th fw={600}>Contract end date</Table.Th>
              <Table.Th style={{ width: 48 }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pageRows.map((row) => (
              <Table.Tr
                key={row.id}
                style={{
                  backgroundColor: selectedIds.has(row.id) ? '#eff6ff' : undefined,
                }}
              >
                {managerView && (
                  <Table.Td>
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleSelect(row.id)}
                    />
                  </Table.Td>
                )}
                <Table.Td>
                  <Anchor
                    size="sm"
                    c="#0891b2"
                    href="#"
                    underline="hover"
                    onClick={(e) => { e.preventDefault(); isLateRenewals && onRowAction?.(row, 'view'); }}
                  >
                    {row.subscriptionId}
                  </Anchor>
                </Table.Td>
                <Table.Td>{row.created}</Table.Td>
                {managerView && <Table.Td>{row.companyName}</Table.Td>}
                {isLateRenewals && (
                  <Table.Td>
                    <Badge size="sm" color="red" variant="light">{row.status ?? 'Suspended'}</Badge>
                  </Table.Td>
                )}
                {isLateRenewals && (
                  <Table.Td>
                    <Text size="sm" fw={row.daysLeftToReactivate != null && row.daysLeftToReactivate <= 3 ? 600 : 400} c={row.daysLeftToReactivate != null && row.daysLeftToReactivate <= 3 ? 'red' : undefined}>
                      {row.daysLeftToReactivate != null ? `${row.daysLeftToReactivate} days` : '—'}
                    </Text>
                  </Table.Td>
                )}
                {isAutoRenewal && (
                  <Table.Td>
                    <Group gap="xs">
                      <Switch
                        size="sm"
                        checked={row.autoRenewal ?? false}
                        onChange={(e) => onAutoRenewalToggle?.(row, e.currentTarget.checked)}
                      />
                      <Text size="sm" c="#6b7280">{row.autoRenewal ? 'On' : 'Off'}</Text>
                    </Group>
                  </Table.Td>
                )}
                <Table.Td>{row.product}</Table.Td>
                <Table.Td>{row.contractEndDate}</Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {isLateRenewals && (
                        <Menu.Item onClick={() => onRowAction?.(row, 'view')}>Subscription details</Menu.Item>
                      )}
                      {isAutoRenewal && (
                        <>
                          <Menu.Item onClick={() => onRowAction?.(row, 'revert')}>Revert</Menu.Item>
                          <Menu.Item onClick={() => onAutoRenewalToggle?.(row, !row.autoRenewal)}>
                            {row.autoRenewal ? 'Turn off auto-renewal' : 'Turn on auto-renewal'}
                          </Menu.Item>
                        </>
                      )}
                      {isRevertUpgrade && (
                        <Menu.Item onClick={() => onRowAction?.(row, 'revert')}>Revert upgrade</Menu.Item>
                      )}
                      {!isLateRenewals && !isAutoRenewal && (
                        <>
                          <Menu.Item onClick={() => onRowAction?.(row, 'view')}>View details</Menu.Item>
                          <Menu.Item onClick={() => onRowAction?.(row, 'sync')}>Sync</Menu.Item>
                          <Menu.Item onClick={() => onRowAction?.(row, 'download')}>Download</Menu.Item>
                        </>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="space-between" p="md" style={{ borderTop: '1px solid #e5e7eb' }}>
          <Group gap="xs">
            <Text size="sm" c="#6b7280">
              Rows per page
            </Text>
            <Select
              size="xs"
              style={{ width: 70 }}
              data={PAGE_SIZES.map((n) => ({ value: String(n), label: String(n) }))}
              value={String(pageSize)}
              onChange={(v) => {
                setPageSize(Number(v) || 10);
                setPage(1);
              }}
            />
          </Group>
          <Text size="sm" c="#6b7280">
            {from + 1}-{to} of {total}
          </Text>
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              ›
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
    </Box>
  );
}
