# Project Forms & Fields

## Signup & Auth

### Seller / Service Provider
- **Step 1 (Basic Info)**
  - Name
  - Phone Number (+91)
  - Pincode (Search)
  - Type (Select: Product Seller / Service Provider)
  - **Action:** Send OTP
- **Step 1 (Verification)**
  - OTP (6-digit)
  - **Action:** Verify & Register -> Redirects to Onboarding
- **Step 2 - Onboarding - Business Details**
  - Display Name
  - Legal Name
  - Business Type (Select: Manufacturer / Wholesaler / Retailer / Service Provider)
  - About Business
  - Primary Phone (+91)
  - Secondary Phone (+91)
  - Contact Email
  - Area Pincode (Search)
  - Street Address
  - City
  - **Action:** Launch Business -> Redirects to Seller Dashboard

### Buyer
- **Step 1 (Basic Info)**
  - Name
  - Phone Number (+91)
  - Pincode (Search)
  - Type (Buyer Customer)
  - **Action:** Send OTP
- **Step 1 (Verification)**
  - OTP (6-digit)
  - **Action:** Verify & Register -> Redirects to Buyer Dashboard

### Admin
- **Login**
  - Email
  - Password
  - **Action:** Login -> Redirects to Admin Dashboard

---

## Seller Dashboard Forms

### Entity Settings Form
- Display Name 
- Business Type (Select if not approved)
- Legal Business Name 
- Business Description 
- Contact E-Mail 
- Support E-Mail 
- Phone Number 
- Secondary Phone Number 
- Address 
- Landmark (Line 2)
- City 
- Pincode (Autocomplete)
- Documents Upload 
- **Action:** Save Changes

### Quotation Form
- Select Matching Listing (Autocomplete - Per Item)
- Rate (Per Item)
- Item Specific Remarks (Per Item)
- Expected Delivery Date (Date picker)
- Overall Remarks
- **Action:** Submit / Update Quotation

### Offer Form
- Offer Name 
- Description 
- Start Date (Date picker)
- End Date (Date picker)
- Applicable Relation Type (Select: Category / Brand / Specification / Item / Listing)
- Applicable Relation Items (Multi-select Combo)
- Target Regions (Unified Selector)
- Media Upload (Images)
- Document Upload 
- **Action:** Create / Update Offer

### Event Form
- Event Title 
- Description 
- Event Nature (Select: Live / Recorded)
- Public Event (Switch)
- Start Date & Time 
- End Date & Time 
- Remote (Switch)
- Physical (Switch)
- Venue Address (If Physical)
- City / Pincode (If Physical)
- Meeting Link (If Remote)
- Target Regions (Unified Selector)
- Recorded Session / Video Upload 
- Brochure / Presentation Upload 
- **Action:** Save & Request Approval / Update Event / Publish Event

### Content Form
- Content Title 
- Description 
- Active Status (Switch)
- Target Audience Regions (Unified Selector)
- Document / File Upload 
- Media / Video Upload 
- **Action:** Create / Update Content

### Listing Edit Form
- Active Status (Switch)
- Unit Type (Select)
- Min Quantity 
- Base Rate 
- Negotiable (Switch)
- Product Images Upload 
- Brochures & Specs Upload 
- Target Regions (Unified Selector / State / District / Pincodes)
- **Action:** Save All Changes

---

## Buyer Activity Forms

### Buyer Details Form
- Full Name 
- Email Address 
- Phone Number (+91)
- PinCode (Autocomplete)
- Address 
- Expected Delivery Date (Optional Date picker)
- Purpose (Optional)
- Additional Requirements (Optional)
- **Action:** Auto-updates on change

### Add To Enquiry Modal
- Quantity
- Unit (Select)
- Remarks 
- **Action:** Add to Enquiry (Stores in cart)

### Add To Appointment Modal
- **Action:** Confirm (Item set for appointment)

---

## Admin Forms

### Create Admin / Staff Roles (Manager, Executive, Accountant)
- Name 
- Email 
- Password 
- **Action:** Create Account

### Category Form
- Name 
- Icon Upload 
- Type (Select: Product / Service)
- Is Sub-category (Switch)
- Parent Category (Autocomplete, if sub-category)
- **Action:** Create / Update Category

### Brand Form
- Name 
- Logo Upload 
- **Action:** Create / Update Brand

### Specification Form
- Name 
- Description 
- **Action:** Create / Update Specification

### Item Form
- Name 
- Description 
- Type (Select: Product / Service)
- HSN Code 
- GST % 
- Category (Autocomplete)
- Brand (Autocomplete)
- Specification (Autocomplete)
- **Action:** Create / Update Item

---

## Shared Forms

### Review Form
- Rating (1-5 Star Picker)
- Title (Optional)
- Detailed Feedback 
- Photos / Videos Upload 
- **Action:** Submit Experience
