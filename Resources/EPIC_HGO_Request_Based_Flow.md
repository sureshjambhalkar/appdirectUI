# EPIC: High Growth Offers (HGO) – Move from Eligibility-Based to Request-Based Flow

**Document version:** 1.0  
**Created:** March 2026  
**Status:** Draft  
**Product area:** Adobe VIP Marketplace / Value Incentive Plan (VIP) Programs

---

## 1. Epic summary

| Field | Description |
|-------|-------------|
| **Epic title** | HGO: Request-based flow (replace eligibility check) |
| **Epic owner** | [Product owner] |
| **Stakeholders** | Adobe Partnership, Marketplace PM, Engineering |
| **Target release** | [Release version] |

**One-line summary:** Replace the current “check eligibility → show eligible products” HGO flow with a direct “Request for HGO” flow. Users request HGO by selecting Offer Type (MOQ 100 / 250 / 500) and Schedule (Mid Term / Renewal) in a single tile, without an upfront eligibility check, aligning with Adobe API behavior that accepts MOQ for all customers at subscription creation.

---

## 2. Problem statement

- **Current behavior:** The product uses an **eligibility-based** HGO flow: the user clicks “Check Eligible Offers,” we call Adobe APIs to determine eligibility, then show eligible products (e.g. two product tiles) for which HGO can be requested.
- **Issue:** For customers **without an existing Adobe Acrobat subscription**, Adobe’s APIs do **not** return an eligibility response. The platform therefore shows an **ineligible error** to these users even though they are valid candidates for HGO.
- **Adobe behavior:** Adobe’s subscription-creation APIs **do accept** High Growth Offer (MOQ) parameters for **all customers**. Eligibility is not a prerequisite for submitting an HGO request at creation time.
- **Impact:** Valid customers are blocked from requesting HGO due to a pre-check that does not match Adobe’s actual API contract, leading to a poor experience and lost HGO adoption.

---

## 3. Goals and success criteria

| Goal | Success criteria |
|------|-------------------|
| Remove dependency on eligibility for HGO | No “check eligibility” step; no ineligible error for customers without Acrobat based solely on missing eligibility response. |
| Align UX with Adobe API capabilities | HGO can be requested for any customer for whom we support subscription creation (subject to business rules, e.g. 3YC). |
| Simplify HGO request UX | Single request path: one tile with Offer Type + Schedule, then submit. |
| Maintain 3YC requirement | Enrollment in HGO still requires 3YC participation; messaging and validation preserved. |

---

## 4. User stories

### 4.1 Primary user stories

- **US-1** As a **reseller / company admin**, I want to see a **“Request for HGO”** action (instead of “Check Eligible Offers”) on the High Growth Offers (HGO) program card so that I can request HGO without being blocked by an eligibility check that fails for customers without Acrobat.
- **US-2** As a **reseller / company admin**, I want to open a **single request form** (one tile) where I can choose **Offer Type** (MOQ 100, MOQ 250, MOQ 500) and **Schedule** (Mid Term or Renewal) so that I can submit an HGO request in one place without selecting from multiple product-specific tiles.
- **US-3** As a **reseller / company admin**, I want to see a clear message that **enrollment in HGO requires 3YC participation** so that I understand the prerequisite before requesting HGO.
- **US-4** As a **reseller / company admin**, I want to **submit** my HGO request (Apply for HGO) and receive confirmation (or clear error) so that I know the outcome without hitting an ineligible error for valid customers.

### 4.2 Supporting user stories

- **US-5** As a **platform**, we want to **stop calling** the Adobe eligibility endpoint for HGO when the customer has no Acrobat subscription, so that we do not surface incorrect “ineligible” states.
- **US-6** As a **product owner**, I want the HGO request payload to use **Offer Type (MOQ)** and **Schedule** so that backend and Adobe integration can create the subscription with the correct MOQ and schedule parameters.

---

## 5. Acceptance criteria

### 5.1 VIP Programs – HGO card

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-1 | The HGO program card displays the button label **“Request for HGO”** (not “Check Eligible Offers” or “Check Eligible Offers”). | UI review on all surfaces where the HGO card appears (e.g. Create Customer, Update Customer, Customer Details, any recommendations/summary views). |
| AC-2 | The card still shows **“Find out more”** and supporting copy (e.g. that 3YC is required for HGO). | UI review. |
| AC-3 | Clicking **“Request for HGO”** opens the HGO request flow (modal or dedicated view). | Click-through test. |

### 5.2 HGO request flow – single tile

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-4 | The flow shows **one** request tile (no multiple product-specific tiles for HGO). | UI review. |
| AC-5 | The flow shows an **informational banner** stating that enrollment in High Growth Offers requires participation in the 3YC program. | UI review. |
| AC-6 | **Offer type** is a single selector with options: **MOQ 100**, **MOQ 250**, **MOQ 500**. | UI + test with each option. |
| AC-7 | **Schedule** is a single selector with options: **Mid Term**, **Renewal**. | UI + test with each option. |
| AC-8 | Primary action is **“Apply for HGO”**; secondary action is **“Cancel”**. | UI review; Cancel closes without submitting. |
| AC-9 | **“Apply for HGO”** is enabled only when both Offer Type and Schedule are selected. | Test with empty/partial selection. |
| AC-10 | On submit, the selected **Offer Type (MOQ)** and **Schedule** are sent to the backend/Adobe integration (no eligibility call required before this). | Integration/API test. |

### 5.3 Behavior and errors

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-11 | Customers **without** an existing Adobe Acrobat subscription are **not** shown an “ineligible” error when using “Request for HGO” (no eligibility pre-check). | Test with customer that has no Acrobat subscription. |
| AC-12 | Business validation (e.g. 3YC requirement) is still enforced where applicable; errors are clear and actionable. | Test with non-3YC customer if 3YC is required. |
| AC-13 | After successful submission, the user sees a clear success state and the flow closes (or navigates as designed). | E2E test. |

---

## 6. Out of scope (for this epic)

- Changing 3YC enrollment or validation rules.
- Changing Adobe subscription creation API contracts beyond passing MOQ and schedule for HGO.
- Redesign of the 3YC card or other VIP program cards (only HGO card and HGO flow in scope).
- Backend implementation details (this epic focuses on product/UX scope; implementation will be covered in technical design and stories).

---

## 7. Technical notes (for implementation stories)

- **Frontend:** Replace “Check Eligible Offers” with “Request for HGO”; remove any UI that depends on an HGO eligibility API response for showing/blocking the flow. Implement a single-tile form: Offer Type (MOQ 100 / 250 / 500), Schedule (Mid Term / Renewal), Apply for HGO, Cancel.
- **Integration:** Use Adobe subscription creation (or equivalent) APIs that accept MOQ (HGO) and schedule; do not rely on eligibility APIs for customers without Acrobat to gate the request.
- **APIs:** Identify exact Adobe API parameters for MOQ (e.g. 100, 250, 500) and schedule (Mid Term vs Renewal) and document in technical spec.
- **Conditional options:** Offer Type and Schedule options may be conditional on segment/region in the future; for this epic, the fixed sets above are sufficient.

---

## 8. Dependencies and risks

| Dependency / risk | Mitigation |
|-------------------|------------|
| Adobe API contract for MOQ and schedule | Confirm with Adobe documentation and partnership; document in technical spec. |
| Backend support for request-based HGO | Backend must accept and forward MOQ + schedule to Adobe; align with backend epic/stories. |
| Existing “eligible products” or multi-tile HGO screens | Deprecate or refactor to the single-tile request flow; update all entry points (e.g. Create/Update Customer, Customer Details, recommendations). |

---

## 9. Definition of done (epic level)

- [ ] All acceptance criteria AC-1 through AC-13 verified.
- [ ] “Request for HGO” is the only HGO entry action on the card (no “Check Eligible Offers”).
- [ ] Single-tile HGO request form is live with Offer Type (MOQ 100/250/500) and Schedule (Mid Term/Renewal).
- [ ] No eligibility-based blocking for customers without Acrobat; request is submitted with MOQ and schedule.
- [ ] Documentation and release notes updated; stakeholders sign-off.

---

## 10. References

- Current UX: VIP Programs section with 3YC and HGO cards; HGO flow with (current) eligibility check and multi-product tiles.
- Target UX: Same section; HGO card with “Request for HGO” opening a single-tile form (Offer Type + Schedule).
- Adobe: Subscription creation APIs accepting MOQ (High Growth Offers) for all customers.
