import type { ActionCenterSubscriptionRow } from '../types/adobeActionCenter';

function makeRow(
  id: string,
  subId: string,
  created: string,
  companyName: string,
  companyId: string,
  product: string,
  contractEnd: string,
  status?: string,
  extra?: Partial<ActionCenterSubscriptionRow>
): ActionCenterSubscriptionRow {
  return {
    id,
    subscriptionId: subId,
    created,
    companyName,
    companyId,
    product,
    contractEndDate: contractEnd,
    status,
    ...extra,
  };
}

/** Mock rows for "Subscriptions with discrepancies" (manager view – many companies) */
export const MOCK_DISCREPANCIES: ActionCenterSubscriptionRow[] = [
  makeRow('1', 'a6b1a2b6-6a3a-4f2e-9c1d-8e7f0a1b2c3d', '01/19/26', 'Google-Demo-GTT17', 'P100001', 'Adobe Acrobat Pro for Teams (NA)', '01/19/27'),
  makeRow('2', 'b7c2b3c7-7b4b-5g3f-0d2e-9f8a1b2c3d4e', '01/18/26', 'Adobe Commercial', 'P100002', 'Adobe Acrobat Standard for Enterprise (NA)', '01/18/27'),
  makeRow('3', 'c8d3c4d8-8c5c-6h4g-1e3f-0a9b2c3d4e5f', '01/17/26', 'Contoso Ltd', 'P100003', 'Adobe Creative Cloud for Teams', '01/17/27'),
  makeRow('4', 'd9e4d5e9-9d6d-7i5h-2f4g-1b0c3d4e5f6a', '01/16/26', 'Fabrikam Inc', 'P100004', 'Adobe Acrobat Pro for Teams (NA)', '01/16/27'),
  makeRow('5', 'e0f5e6f0-0e7e-8j6i-3g5h-2c1d4e5f6a7b', '01/15/26', 'Northwind Traders', 'P100005', 'Adobe Acrobat Standard for Enterprise (NA)', '01/15/27'),
  ...Array.from({ length: 8 }, (_, i) =>
    makeRow(
      `extra-${i}`,
      `sub-${i}-${Math.random().toString(36).slice(2, 10)}`,
      '01/10/26',
      `Company Demo ${i + 10}`,
      `P1000${(i + 10) % 100}`,
      i % 2 === 0 ? 'Adobe Acrobat Pro for Teams (NA)' : 'Adobe Acrobat Standard for Enterprise (NA)',
      '01/10/27'
    )
  ),
];

/** Mock rows for "Synced subscriptions" */
export const MOCK_SYNCED: ActionCenterSubscriptionRow[] = [
  makeRow('s1', 's1-a1b2c3d4-5e6f-7890-abcd-ef1234567890', '01/10/26', 'Synced Company One', 'P200001', 'Adobe Acrobat Pro for Teams (NA)', '01/10/27', 'Synced'),
  makeRow('s2', 's2-b2c3d4e5-6f7a-8901-bcde-f12345678901', '01/11/26', 'Synced Company Two', 'P200002', 'Adobe Creative Cloud for Teams', '01/11/27', 'Synced'),
];

/** Mock rows for "Late renewals" (suspended – 14 days to reactivate) */
export const MOCK_LATE_RENEWALS: ActionCenterSubscriptionRow[] = [
  makeRow('l1', 'l1-c3d4e5f6-7a8b-9012-cdef-123456789012', '12/01/25', 'Expired Corp', 'P300001', 'Adobe Acrobat Pro for Teams (NA)', '12/01/26', 'Suspended', {
    anniversaryDate: '12/01/26',
    daysLeftToReactivate: 12,
    productEdition: 'Pro',
    licensesCount: 25,
    licensesStatus: 'Suspended',
  }),
  makeRow('l2', 'l2-d4e5f6a7-8b9c-0123-defa-234567890123', '12/15/25', 'Lapsed Solutions', 'P300002', 'Adobe Acrobat Standard for Enterprise (NA)', '12/15/26', 'Suspended', {
    anniversaryDate: '12/15/26',
    daysLeftToReactivate: 5,
    productEdition: 'Standard',
    licensesCount: 50,
    licensesStatus: 'Suspended',
  }),
  makeRow('l3', 'l3-e5f6a7b8-9c0d-1234-efab-345678901234', '11/20/25', 'Near Lapse Inc', 'P300003', 'Adobe Creative Cloud for Teams', '11/20/26', 'Suspended', {
    anniversaryDate: '11/20/26',
    daysLeftToReactivate: 3,
    productEdition: 'Teams',
    licensesCount: 10,
    licensesStatus: 'Suspended',
  }),
];

/** Mock rows for "Revert subscription upgrade" */
export const MOCK_REVERT_UPGRADE: ActionCenterSubscriptionRow[] = [
  makeRow('r1', 'r1-e5f6a7b8-9c0d-1234-efab-345678901234', '01/05/26', 'Downgrade Candidate', 'P400001', 'Adobe Creative Cloud for Teams', '01/05/27'),
];

/** Mock rows for "Eligible for reducing units" (within 14 days) */
export const MOCK_REDUCE_UNITS: ActionCenterSubscriptionRow[] = [
  makeRow('u1', 'u1-f6a7b8c9-0d1e-2345-fabc-456789012345', '01/12/26', 'Scale Down Inc', 'P500001', 'Adobe Acrobat Pro for Teams (NA)', '01/12/27'),
  makeRow('u2', 'u2-a7b8c9d0-1e2f-3456-abcd-567890123456', '01/14/26', 'Units Review Ltd', 'P500002', 'Adobe Acrobat Standard for Enterprise (NA)', '01/14/27'),
];

/** Mock rows for "Auto-renewal" – renewing in last 30 days of contract; toggle on/off */
export const MOCK_AUTO_RENEWAL: ActionCenterSubscriptionRow[] = [
  makeRow('ar1', 'ar1-b8c9d0e1-2f3a-4567-bcde-678901234567', '01/01/26', 'Auto Renew Corp', 'P600001', 'Adobe Acrobat Pro for Teams (NA)', '03/15/26', undefined, { autoRenewal: true }),
  makeRow('ar2', 'ar2-c9d0e1f2-3a4b-5678-cdef-678901234567', '01/10/26', 'Renew Soon Ltd', 'P600002', 'Adobe Acrobat Standard for Enterprise (NA)', '03/20/26', undefined, { autoRenewal: false }),
  makeRow('ar3', 'ar3-d0e1f2a3-4b5c-6789-defa-789012345678', '02/01/26', 'Contract End Inc', 'P600003', 'Adobe Creative Cloud for Teams', '03/25/26', undefined, { autoRenewal: true }),
];

/** By category id (for manager view – all data) */
export const MOCK_BY_CATEGORY: Record<string, ActionCenterSubscriptionRow[]> = {
  'sync-subscription': MOCK_DISCREPANCIES,
  synced: MOCK_SYNCED,
  'late-renewals': MOCK_LATE_RENEWALS,
  'revert-upgrade': MOCK_REVERT_UPGRADE,
  'reduce-units': MOCK_REDUCE_UNITS,
  'auto-renewal': MOCK_AUTO_RENEWAL,
};

/** For end-customer view: only rows for a given company (e.g. companyId or company name) */
export function getMockRowsForCompany(
  categoryId: string,
  companyId: string
): ActionCenterSubscriptionRow[] {
  const all = MOCK_BY_CATEGORY[categoryId] ?? [];
  const filtered = all.filter((r) => r.companyId === companyId);
  if (filtered.length > 0) return filtered;
  // Fallback: show a couple of placeholder rows for this company so the customer view isn't empty
  if (categoryId === 'sync-subscription' || categoryId === 'late-renewals' || categoryId === 'reduce-units' || categoryId === 'auto-renewal') {
    const isLate = categoryId === 'late-renewals';
    return [
      makeRow('cust-1', `sub-${companyId}-1`, '01/15/26', 'My Company', companyId, 'Adobe Acrobat Pro for Teams (NA)', '01/15/27', isLate ? 'Suspended' : undefined, isLate ? { anniversaryDate: '01/15/27', daysLeftToReactivate: 10, productEdition: 'Pro', licensesCount: 20, licensesStatus: 'Suspended' } : categoryId === 'auto-renewal' ? { autoRenewal: true } : undefined),
      makeRow('cust-2', `sub-${companyId}-2`, '01/10/26', 'My Company', companyId, 'Adobe Acrobat Standard for Enterprise (NA)', '01/10/27', undefined, categoryId === 'auto-renewal' ? { autoRenewal: false } : undefined),
    ];
  }
  return [];
}
