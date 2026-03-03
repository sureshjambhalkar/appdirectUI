/** Single subscription row for Action Center tables */
export interface ActionCenterSubscriptionRow {
  id: string;
  subscriptionId: string;
  created: string;
  companyName: string;
  companyId?: string;
  product: string;
  contractEndDate: string;
  /** Optional status for badges (e.g. suspended, synced) */
  status?: string;
  /** Late renewals: anniversary date */
  anniversaryDate?: string;
  /** Late renewals: days left in 14-day window to reactivate (0 = expired) */
  daysLeftToReactivate?: number;
  /** Product edition (e.g. Pro, Standard) */
  productEdition?: string;
  /** Licenses count */
  licensesCount?: number;
  /** Licenses status (e.g. Active, Suspended) */
  licensesStatus?: string;
  /** Auto-renewal tab: whether auto-renewal is on */
  autoRenewal?: boolean;
}
