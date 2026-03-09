# EPIC: High Growth Offers (HGO) – Request-Based Experience

**Document version:** 1.0  
**Created:** March 2026  
**Status:** Draft  
**Product area:** Adobe VIP Marketplace / Value Incentive Plan (VIP) Programs

---

## 1. Epic summary

| Field | Description |
|-------|-------------|
| **Epic title** | HGO: Request-based experience (replace eligibility check) |
| **Epic owner** | [Product owner] |
| **Stakeholders** | Adobe Partnership, Marketplace Product, Sales & Channel |
| **Target release** | [Release version] |

**In one sentence:** We are changing how resellers request High Growth Offers (HGO): instead of checking eligibility first and often seeing an error, they will use a single “Request for HGO” action, choose their offer size (MOQ 100, 250, or 500) and schedule (Mid Term or Renewal), and submit the request—so more valid customers can access HGO without being blocked.

---

## 2. Business problem

**What we do today**  
Resellers use a “Check Eligible Offers” step before requesting HGO. The system then shows which products are eligible. For many customers—especially those who do not yet have an Adobe Acrobat subscription—this step returns an “ineligible” message and blocks them from going further.

**Why this is a problem**  
Adobe allows HGO (High Growth Offers) to be requested for all customers when creating a subscription. Our current flow does not match that: we block valid customers based on an eligibility check that often fails for new or non-Acrobat customers. That leads to:

- **Lost opportunities:** Resellers cannot request HGO for customers who are actually allowed to have it.
- **Confusion:** “Ineligible” messages when the customer could have been approved.
- **Friction:** Extra steps (check eligibility, then choose from multiple product tiles) instead of a direct request.

**What we want**  
A straightforward “Request for HGO” experience: one place to choose offer type and schedule, then submit—no upfront eligibility check that blocks valid customers.

---

## 3. Goals and success

| Goal | What success looks like |
|------|---------------------------|
| **Remove the blocking “ineligible” experience** | Customers without an existing Acrobat subscription are no longer shown an ineligible error when they are valid for HGO. |
| **Simplify how resellers request HGO** | One clear path: “Request for HGO” → choose offer type and schedule → submit. No “check eligibility” step, no multiple product tiles. |
| **Keep 3YC as the business rule** | We still require 3YC participation for HGO; that rule and its messaging stay in place. |
| **Grow HGO adoption** | More resellers can complete HGO requests for more customers, in line with what Adobe supports. |

---

## 4. User stories (business language)

### For resellers and company admins

- **US-1** As a reseller, I want to see a **“Request for HGO”** option (instead of “Check Eligible Offers”) so that I can request HGO for my customers without being blocked by an ineligible message when the customer doesn’t already have Acrobat.

- **US-2** As a reseller, I want **one simple form** where I choose **Offer Type** (MOQ 100, 250, or 500) and **Schedule** (Mid Term or Renewal) so that I can submit an HGO request in one place, without picking from multiple product-specific options.

- **US-3** As a reseller, I want to see a clear message that **HGO requires 3YC participation** so that I know the requirement before I request HGO.

- **US-4** As a reseller, I want to **submit** my HGO request and get a clear confirmation or error so that I know the outcome without hitting an ineligible error for customers who are valid for HGO.

### For the business and product

- **US-5** As a product owner, I want the experience to **no longer depend on an eligibility check** that fails for customers without Acrobat, so that we align with Adobe’s support for HGO for all customers at subscription creation.

- **US-6** As a product owner, I want the request to capture **Offer Type (MOQ)** and **Schedule** so that the right offer and timing are sent to Adobe and reflected in the subscription.

### Additional user stories (requested state, edit, cancel, notifications)

- **US-7** As a reseller, after I submit an HGO request, I want to see a **“Requested HGO”** status (not a product name) with the **offer type** (e.g. MOQ 100) and **schedule** (e.g. Mid-Term) clearly shown so that I can confirm what was requested at a glance.

- **US-8** As a reseller, I want to **edit** an existing HGO request so that I can change the offer type (MOQ 100, 250, or 500) or schedule (Mid-Term or Renewal) without starting over.

- **US-9** As a reseller, when I am editing an HGO request, I want **“Update HGO”** to be enabled only when I have changed the offer type or schedule from the current values so that I do not submit unnecessary updates.

- **US-10** As a reseller, I want to **cancel** an HGO request so that I can remove the request and return to the state where I can request HGO again, with a clear confirmation that the request was cancelled.

- **US-11** As a reseller, I want to see a **success notification** when my HGO request is applied, when I update an HGO, or when I cancel an HGO request so that I know each action completed successfully.

- **US-12** As a reseller, I want to see a **clear error notification** when an HGO action (request, update, or cancel) fails so that I know what went wrong and can try again or get help.

---

## 5. What we will deliver (acceptance criteria)

### 5.1 HGO entry point (VIP Programs card)

- The HGO program card shows the button **“Request for HGO”** (not “Check Eligible Offers”) everywhere the card appears.
- The card still includes **“Find out more”** and copy that 3YC is required for HGO.
- Clicking **“Request for HGO”** opens the HGO request experience (e.g. modal or dedicated screen).

### 5.2 HGO request experience (single form)

- The experience shows **one form** (one “tile”), not multiple product-specific tiles.
- A short **informational message** states that enrollment in High Growth Offers requires participation in the 3YC program.
- **Offer type** can be chosen from: **MOQ 100**, **MOQ 250**, **MOQ 500**.
- **Schedule** can be chosen from: **Mid Term**, **Renewal**.
- The main action is **“Apply for HGO”**; there is a **“Cancel”** option that closes without submitting.
- **“Apply for HGO”** is only available when both Offer Type and Schedule are selected.
- When the user submits, the chosen **Offer Type** and **Schedule** are what we use for the HGO request (no eligibility check required before this).

### 5.3 Behavior and messaging

- Customers **without** an existing Adobe Acrobat subscription are **not** shown an “ineligible” error when using “Request for HGO”; we do not block them based on that check.
- We still enforce business rules (e.g. 3YC) where they apply, and show clear, actionable messages if something is missing.
- After a successful submission, the user sees a clear success message and the flow closes or moves on as designed.

---

## 6. Out of scope for this epic

- Changes to how 3YC enrollment or validation works.
- Changes to other VIP program cards (only the HGO card and HGO request flow are in scope).
- Redesign of the 3YC card.
- Detailed technical or backend design (those stay in technical specs and implementation stories).

---

## 7. Dependencies and risks (business view)

| Dependency or risk | How we address it |
|--------------------|--------------------|
| **Adobe’s position on HGO** | Confirm with Adobe that HGO (MOQ 100 / 250 / 500) and schedule (Mid Term / Renewal) are supported for all customers at subscription creation; document agreement. |
| **Backend and Adobe handoff** | Ensure the backend can receive Offer Type and Schedule from the new flow and pass them correctly to Adobe. |
| **Existing “eligible products” / multi-tile flows** | Replace or retire those with the new single-form “Request for HGO” experience and update all entry points (e.g. Create/Update Customer, Customer Details, recommendations). |

---

## 8. Definition of done (epic level)

- [ ] “Request for HGO” is the only HGO entry action on the card (no “Check Eligible Offers”).
- [ ] The HGO request experience is a single form with Offer Type (MOQ 100 / 250 / 500) and Schedule (Mid Term / Renewal).
- [ ] Customers without an existing Acrobat subscription are no longer blocked by an ineligible message when requesting HGO.
- [ ] 3YC requirement and messaging are still present and enforced where applicable.
- [ ] Stakeholders have signed off; release notes and user-facing documentation are updated.

---

## 9. References (for context)

- **Current experience:** VIP Programs section with 3YC and HGO cards; HGO uses “Check Eligible Offers” and then shows multiple product tiles.
- **Target experience:** Same section; HGO card with “Request for HGO” opening a single form (Offer Type + Schedule).
- **Adobe:** HGO (MOQ) can be requested for all customers at subscription creation; we are aligning our experience with this.
