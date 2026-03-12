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

### Buyer Activity - Appointment (Registered or Guest.)

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

- Displays a list of all enquiries sent by the buyer.
- **Filters:** All, Pending, Approved, Rejected.
- **Card Details:** Enquiry ID, Status Badge, Item List (Count & Names), Date Created, Delivery Location.
- **Action:** View Details (Redirects to enquiry detail page).

### Quotation List

- Displays offers received from sellers for products/services.
- **Filters:** All, Pending, Accepted.
- **Card Details:** Quotation ID, Status (Pending/Accepted), Items (Main Item + Count), Date, Seller Reputation Snapshot, Total Quote Value.
- **Action:** View (Redirects to associated Enquiry detail page).

### Appointment List

- Tracks requests for site visits or service consultations.
- **Filters:** All, Upcoming, Completed, Cancelled.
- **Card Details:** Appointment ID, Main Item Name, Preferred Time Slots (Date & Time), Created Date, Status Badge, Location/Remarks.
- **Action:** View Details.

### Visit List

- Tracks confirmed site visits scheduled by service providers.
- **Filters:** All, Pending, Accepted, Completed.
- **Card Details:** Visit ID, Appointment Item Reference, Scheduled Date & Time Slot, Status Badge (Pending/Accepted/Completed), Seller Reputation Snapshot.
- **Action:** View (Redirects to Appointment Details).

## Seller Activities - Seller Dashboard (Again)

### Enquiry List

- Divided into **Active Enquiries** (Pending response) and **Responded Enquiries**.
- **Search:** Search by ID, Buyer Name, or Item Name.
- **Card Details:** Assignment ID, Time Badge (New/Active/Aging), Buyer Name, Location, Item Summary (Main Item + Count).
- **Action:** Respond / View Details.

### Quotation List

- Referred to as the **Deal Board**.
- **Search:** Search by ID, Customer, or Item Name.
- **Card Details:** Quotation ID, Status (Sent/Accepted), Customer Name, Item Summary, Quote Value.
- **Action:** View Details.

#### Quotation Create Form

- Triggered from an Enquiry response.
- **Step 1:** Select matching "Item Listing" from seller's own catalog.
- **Step 2:** Provide Rate per Unit (Total amount calculated automatically).
- **Step 3:** Add item-specific remarks and overall quotation remarks.
- **Step 4:** Set Expected Delivery Date.
- **Action:** Submit Quotation (Triggers **Coin Deduction Modal**).

### Appointment List

- Tracks incoming Site Visit / Service requests.
- **Filters:** Pending (Active requests) and Confirmed/Completed (Collapsible).
- **Card Details:** Appointment ID, Item Name, Buyer Name, Time Badge, Scheduled Slot (if confirmed), Location.
- **Action:** View Details / Confirm Visit.

### Visit List

- List of confirmed and upcoming site visits.
- Tracks visits that have moved from Appointment -> Confirmed Visit phase.

#### Visit Create Form

- Used to confirm a buyer's Appointment request.
- **Action:** Seller selects one of the **Preferred Time Slots** provided by the buyer.
- **Action:** Confirm & Pay (Triggers **Coin Deduction Modal** for the lead).

## Reviews

### Buyer - Dashboard

#### Review Form

- Accessible from Enquiry or Appointment details.
- **Fields:** Rating (1-5 Stars), Title (Optional), Detailed Feedback, Media Upload (Multiple Photos/Videos).
- **Status:** Verified badge is automatically applied for reviews linked to successful completions.

### Seller - Dashboard

- Reputation management center.
- **Summary:** Overall average rating, total feedbacks, rating distribution bars (1-5 stars).

#### Sellers actions over Reviews

- **Pin to Top:** Feature up to 5 best reviews at the top of the seller profile.
- **Hide Review:** Hide unfair or irrelevant reviews from the public profile.
- **View:** Read full feedback and associated buyer details.
