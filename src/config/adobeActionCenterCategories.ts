/**
 * Adobe Action Center – category configuration.
 * Add new entries here to introduce new action types without changing layout.
 */
export interface ActionCategory {
  id: string;
  label: string;
  description?: string;
  /** Optional report button label for this category (e.g. "Download Discrepancy Report") */
  reportLabel?: string;
  /** Search placeholder for this category */
  searchPlaceholder?: string;
}

export const ADOBE_ACTION_CENTER_CATEGORIES: ActionCategory[] = [
  {
    id: 'sync-subscription',
    label: 'Subscriptions with discrepancies',
    description: 'Subscriptions that need to be synced with Adobe.',
    reportLabel: 'Download Discrepancy Report',
    searchPlaceholder: 'Search by company name or company ID',
  },
  {
    id: 'synced',
    label: 'Synced subscriptions',
    description: 'Subscriptions that are in sync.',
    searchPlaceholder: 'Search by company name or company ID',
  },
  {
    id: 'late-renewals',
    label: 'Late renewals',
    description: 'Subscriptions in suspended status; only end customers can react.',
    searchPlaceholder: 'Search by company name or subscription ID',
  },
  {
    id: 'revert-upgrade',
    label: 'Revert subscription upgrade',
    description: 'Subscriptions eligible for reverting an upgrade.',
    searchPlaceholder: 'Search by company name or subscription ID',
  },
  {
    id: 'reduce-units',
    label: 'Eligible for reducing units',
    description: 'Subscriptions eligible for reducing units within 14 days.',
    searchPlaceholder: 'Search by company name or subscription ID',
  },
  {
    id: 'auto-renewal',
    label: 'Auto-renewal',
    description: 'Subscriptions renewing in the last 30 days of their contract. Turn auto-renewal on or off for each.',
    searchPlaceholder: 'Search by company name or subscription ID',
  },
];

export function getCategoryById(id: string): ActionCategory | undefined {
  return ADOBE_ACTION_CENTER_CATEGORIES.find((c) => c.id === id);
}
