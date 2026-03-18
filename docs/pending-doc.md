Fixes On the Assignments:

- Appointment & Visit List
- Assign Appointments
  - Based on Pincode
  - Based on SubCategory
- Visits Selection
  - Selection of Visit cause Appointment to Closed
  - Visit with suggested time
- Enquiry Quotation Reconsider Request.

Block Further Actions on Closed Enquiry / Appointments.

---

Blocked Buyers - (BlackListing Buyers) - (Eq. Fake Enquiry)

- Assignment can be extended to store this. (Thought: Enquiry made to Entity, can mark fake, is relation between the fake, which lives between 2 Sides, prevent malpractice, other should still see the enquiry, but block applies to buyer, should my assingment table also needs buyerId/fromId, what if b2b support, fromId & fromEntityId?)
- Seller can Block Buyer
- if Buyer Blocked Enquiry/Appointment won't show if Seller Blocked Buyer.
- Fake Enquiry as a Flag & There could be other flags.
- Params - Single Seller BlackList Once, No of BlackList to Ban, Ban Duration

---

ItemListing Details

- For Product/Service -
  - Upload **media & documents** as brochures, flyers, poster, banners ... (same content as Content) -already have attachment in schema.
  - Show these at Quotation or Visits alonh with Item Listing
- Item Request from Seller/Buyer to Admin.

---

B2B activities - Seller Enquiries

- Seller Enquiry with Entity type Hirarchy (Retailer -> WholeSaler -> Manufacturer)
- Seller Quotation

---

Rooms Category Grouping -

Which Rooms groups which Categories. Predefined Group of Categories. So Room can directly lead to a page with preselected categories & subcategories to choose Products from.

---

Wallet Operations for Admins

- Refund - directed to paymentment gateway - through payement information.

---

Bulk Operations

- ItemListing Bulk Upload for Product Seller & Service Provider.
- Deciding Optimal Format & Core necessary Inputs.
- Integration on the Client Side.

---

Admin Reports.

- Reports Queries
- Reports Generation into Excel Files.

---

AI Calculator

- AI SDK Selection - Plan Selection. (My pick OpenRouter.)
- OpenRouter Chat Setup.
- OpenRouter API Integration.
- Generating Async Document/Media Content Embedding pgvector
  - Embedding queue
  - Passing Embedding to OpenRouter to Train Model
  - Passing Prompt to OpenRouter to Use Tuned Model
- Response Formatting
- Prompt Engineering to optimized Outputs
  - Formatting Suggested Results as Next Prompts
- Store Chats
- Resume Chats
  - Loading Context, Settings & Model
- Admin Dashboard - Content & Model management & Manage Trained Models.
- Trained Model for Total Cost Calculation
- Model for Item (Product / Services) Suggestion, Quantity, Suggestion on Processing.
