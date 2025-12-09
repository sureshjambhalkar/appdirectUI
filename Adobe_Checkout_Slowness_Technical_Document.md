# Adobe Checkout Slowness - Technical Document

## Feature Description

The Adobe Checkout Slowness feature improves the user experience when creating quotes or completing checkout for Adobe products. When Adobe's pricing system is slow to respond, this feature automatically handles the wait time and keeps users informed about what's happening.

### What It Does:

1. **Automatic Retry System**
   - If pricing information doesn't load immediately, the system automatically tries again up to 3 times
   - Users don't need to manually refresh or retry - the system handles it automatically
   - Each retry attempt waits a few seconds before trying again

2. **Smart Response Handling**
   - If a user previously tried to get pricing for the same quantity and it failed, the system remembers this
   - When the user tries again later, if the pricing is now available, it shows immediately without waiting

3. **User Notifications**
   - Clear messages appear to inform users when the system is waiting for Adobe's response
   - Users see progress indicators so they know the system is still working
   - Success messages confirm when pricing has been updated

4. **Two Page Types Supported**
   - **Quotes Page**: When users click "Save" to update pricing
   - **Checkout Page**: When users change the number of users and leave the field

5. **Demo Mode**
   - Includes a toggle to demonstrate both successful and failed scenarios
   - Helps users understand what to expect in different situations

---

## Customer Impact

### Benefits for Users:

1. **Better Experience During Delays**
   - Users see clear messages explaining what's happening
   - No confusion about whether the system is working or broken
   - Progress indicators show the system is actively processing the request

2. **Less Frustration**
   - Users don't need to manually retry or refresh the page
   - The system handles retries automatically in the background
   - Clear success messages confirm when pricing updates are complete

3. **Faster Response Times**
   - If pricing was previously loaded for the same quantity, it appears immediately
   - Reduces unnecessary waiting time for repeated requests

4. **Clear Error Communication**
   - If all retry attempts fail, users see a clear error message
   - Error messages include instructions on what to do next (refresh the page)
   - Users understand the situation and know how to proceed

5. **Confidence in the System**
   - Success confirmations build trust that the system is working correctly
   - Transparent communication about delays reduces anxiety
   - Users can continue working while the system processes in the background

### What Users Will Notice:

- **Wait Times**: Initial response may take 2-3 seconds, with total wait time up to 10-15 seconds if multiple retries are needed
- **Notifications**: Orange warning messages appear in the bottom-right corner when the system is waiting
- **Success Messages**: Green confirmation messages appear when pricing is successfully updated
- **Error Messages**: Red error messages appear if all attempts fail, with a button to refresh the page

---

## Changes on UI

### 1. **Notification Messages**

**What Users See**:
- An orange message box appears in the bottom-right corner of the screen
- Title: "Waiting for Adobe Response"
- Message explains that the system is waiting for Adobe and will retry automatically
- Message automatically disappears after 5-7 seconds
- Users can close it manually by clicking the X button

**When It Appears**:
- After the first retry attempt (in success scenarios)
- After the second retry attempt (in failure scenarios)

### 2. **Loading Indicators**

**Quotes Page**:
- "Save" button shows a spinning icon and changes text to "Saving..." while processing
- Button is disabled (grayed out) during processing
- "Finalize" button is disabled during processing or when errors occur

**Checkout Page**:
- "Next" button shows a spinning icon while processing
- Button is disabled during processing or when errors occur
- The number of users field is disabled during processing

### 3. **Success Messages**

**What Users See**:
- Green message box with a checkmark icon
- Title: "Price Updated Successfully"
- Message confirms the number of users and that pricing has been recalculated
- Message automatically scrolls into view
- Message disappears after 5 seconds

**Location**: 
- Quotes Page: Appears above the product details section
- Checkout Page: Appears below the header, above the cart

### 4. **Error Messages**

**What Users See** (After All Retries Fail):
- Red message box with a warning icon
- Title: "Unable to Fetch Latest Prices"
- Message explains that Adobe's system is slow and all retry attempts have been exhausted
- Includes a "Refresh Page" button
- Message remains visible until user takes action

**Location**:
- Quotes Page: Appears above the products section
- Checkout Page: Appears below the header, above the cart

### 5. **Pricing Display**

**When Pricing Updates Successfully**:
- Original price appears with a line through it (e.g., ~~$400.00~~)
- New discounted price appears in teal/blue color with a lightning bolt icon
- Text shows "3-year Commit pricing applied" in teal/blue
- Pricing table updates to show both original and discounted prices
- Green highlight box appears around the discount information

### 6. **Demo Mode Toggle**

**What Users See**:
- A small control panel at the top of the page
- Two options: "Success Flow" and "Failure Flow"
- Allows users to see what happens in both scenarios

**Purpose**: Helps users understand what to expect in different situations

### 7. **Button States**

**During Processing**:
- Buttons show a spinning icon
- Buttons are disabled (cannot be clicked)
- Button text may change (e.g., "Save" becomes "Saving...")

**After Errors**:
- Some buttons remain disabled until the error is resolved
- Users must refresh the page to try again

### 8. **Automatic Scrolling**

- When success or error messages appear, the page automatically scrolls to show them
- Ensures users see important messages even if they're not currently viewing that part of the page

### 9. **Quantity Input**

**Quotes Page**:
- Users enter the number of users
- Click "Save" to update pricing
- System processes the request and shows results

**Checkout Page**:
- Users enter the number of users
- When they click away from the field, pricing automatically updates
- System processes in the background

---

## How It Works for Users

### Successful Scenario:
1. User changes the number of users
2. User clicks "Save" (Quotes) or clicks away from the field (Checkout)
3. System shows a loading spinner
4. System waits a few seconds and tries to get pricing
5. If first attempt doesn't work, a notification appears explaining the delay
6. System automatically tries again
7. After 2-3 attempts, pricing updates successfully
8. Green success message appears confirming the update

### Failed Scenario:
1. User changes the number of users
2. User clicks "Save" (Quotes) or clicks away from the field (Checkout)
3. System shows a loading spinner
4. System tries multiple times to get pricing
5. Notifications appear explaining the delays
6. After all attempts fail, a red error message appears
7. User can click "Refresh Page" to try again later

### Quick Recovery Scenario:
1. User previously tried to get pricing for a quantity and it failed
2. User tries the same quantity again later
3. If pricing is now available, it appears immediately without waiting
4. Success message appears right away

---

## What Users Should Know

- **Wait Times**: It's normal for pricing to take a few seconds to load, especially during busy periods
- **Notifications**: If you see an orange notification, the system is still working - no action needed
- **Success Messages**: Green messages confirm your pricing has been updated
- **Errors**: If you see a red error message, click "Refresh Page" and try again in a few minutes
- **Processing**: Buttons will be disabled while the system is processing - this is normal

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Target Audience**: End Users and Business Stakeholders
