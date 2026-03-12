## Seller Registration

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

## Buyer Registration

- **Step 1 (Basic Info)**
  - Name
  - Phone Number (+91)
  - Pincode (Search)
  - Type (Buyer Customer)
  - **Action:** Send OTP
- **Step 1 (Verification)**
  - OTP (6-digit)
  - **Action:** Verify & Register -> Redirects to Buyer Dashboard

## Seller / Buyer Login

- **Step 1 (Basic Info)**
  - Phone Number (+91)
  - **Action:** Send OTP
- **Step 1 (Verification)**
  - OTP (6-digit)
  - **Action:** Verify & Login -> Redirects to Dashboard

## Seller Dashboard

### Entity Settings Form

- Display Name
- Business Type (Select if not approved) [Manufacturer / Wholesaler / Retailer / Service Provider]
- Legal Business Name
- Business Description
- Contact E-Mail
- Support E-Mail
- Phone Number
- Secondary Phone Number
- Address
- Landmark
- City
- Pincode (Autocomplete)
- Documents Upload
- **Action:** Save Changes

### Entity Item Listing (Product Listing for Product Seller & Service Listing for Service Provider)

- **Step 1 (Find Item)**
  Search with Catagory, Brand, Specification or Item Name
  - **Action:** Next
- **Step 2 (Item Details)** [This step is not present during Service Listing for Service Provider.]
  - Unit Type
  - Min Quantity
  - Base Rate
  - Negotiable
  - **Action:** Next
- **Step 3 (Item Regions)**
  - Target Regions (Unified Selector / State / District / Pincodes)
  - **Action:** Next

### Edit Item Listing

With above field. (Step 1 is not present.)

### Offers

#### Create Offer Form

- Offer Name
- Description
- Start Date (Date picker)
- End Date (Date picker)
- Applicable Relation Type (Select: Category / Brand / Specification / Item / Listing) [Offer applies to which product / service]
- Applicable Relation Items (Multi-select Combo) [Offer applies to which product / service]
- Target Regions (Unified Selector)
- Media Upload (Images)
- Document Upload
- **Action:** Create / Update Offer

After Offer is created, it will be listed in the Offers List. From here One Offer can be Published if Admins has Approved the Offer.

### Contents

#### Create Content Form

- Content Title
- Description
- Active Status (Switch)
- Target Audience Regions (Unified Selector)
- Document / File Upload
- Media / Video Upload
- **Action:** Create / Update Content

After Content is created, it will be listed in the Contents List. From here One Content can be Published if Admins has Approved the Content.

### Events

#### Create Event Form

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

After Event is created, it will be listed in the Events List. From here One Event can be Published if Admins has Approved the Event.

## Buyer Activities

### Buyer Browse & Search

- Browse Page Gives Category & Subcategory to choose Item.
- Filters are there to narrow down based on Specification, Brand. (This not applied to Services)
- **Action:** Add To Enquiry Modal (For Products)
  - Quantity
  - Unit (Select)
  - Remarks
  - **Action:** Add to Enquiry (Stores in cart)
- **Action:**Add To Appointment Modal (For Services)
  - **Action:** Confirm (Item set for appointment)

### Buyer Activity - Enquiry (Registered or Guest.)

- **Step 1.1 (Item selection)**
  - Or, "Add to Enquiry"
- **Step 1.2 (Buyer Details)** (Automatically fetches if User Logged)
  - Full Name
  - Email Address
  - Phone Number (+91)
  - PinCode (Autocomplete)
  - Address
  - Expected Delivery Date (Optional Date picker)
  - Purpose (Optional)
  - Additional Requirements (Optional)
  - **Action:** Send OTP
- **Step 2 (Verify By OTP)** [Only for Not Logged In]
  - OTP (6-digit) - [This Creates User Registration for Non registered User]
  - **Action:** Verify & Next -> Redirects to Enquiry Review
- **Step 3 (Enquiry Review)**
  - Informed about Potential Split Enquiries.
  - **Action:** Submit Enquiry

### Buyer Activity - Quotation (Registered or Guest.)

- **Step 1.1 (Item selection)**
  - Or, "Create Apporintment"
- **Step 1.2 (Buyer Details)** (Automatically fetches if User Logged)
  - Full Name
  - Email Address
  - Phone Number (+91)
  - PinCode (Autocomplete)
  - Address
  - Expected Delivery Date (Optional Date picker)
  - Purpose (Optional)
  - Additional Requirements (Optional)
  - **Action:** Send OTP
- **Step 2 (Verify By OTP)** [Only for Not Logged In]
  - OTP (6-digit) - [This Creates User Registration for Non registered User]
  - **Action:** Verify & Next -> Redirects to Quotation Review
- **Step 3 (Quotation Review)**
  - Informed about Potential Split Quotations.
  - **Action:** Submit Quotation

## Buyer Dashboard

### Enquiry List
