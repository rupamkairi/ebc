POST - http://localhost:10000/api/conference-hall/offer/list
-d {}

```json
[
  {
    "id": "cbcad136-3587-44c9-8417-84c86225e2dc",
    "createdAt": "2026-01-25T08:23:11.700Z",
    "updatedAt": "2026-01-25T10:04:55.694Z",
    "isActive": true,
    "name": "Test Offer",
    "description": "",
    "createdById": "715c2762-88d3-4ab9-add5-9becb477787d",
    "deletedById": null,
    "entityId": "9df5eca3-5dca-401a-9a3b-42a1499cc422",
    "entity": {
      "id": "9df5eca3-5dca-401a-9a3b-42a1499cc422",
      "name": "Test Seller",
      "legalName": "",
      "description": "",
      "createdAt": "2026-01-22T12:44:02.604Z",
      "updatedAt": "2026-01-22T12:44:02.604Z",
      "createdById": "715c2762-88d3-4ab9-add5-9becb477787d",
      "verificaitonRemark": null,
      "verifiedById": null,
      "deletedById": null,
      "type": null,
      "verificationStatus": "PENDING",
      "addressLine1": "",
      "addressLine2": "",
      "city": "",
      "contactEmail": "",
      "op_type": "PRODUCT",
      "pincodeId": "39971e59-0cc9-4856-953c-a33a3e3a10e2",
      "primaryContactNumber": "",
      "secondaryContactNumber": "",
      "supportEmail": ""
    },
    "offerDetails": [
      {
        "id": "e27e64db-22e0-4d31-908a-aacb274c9545",
        "startDate": "2026-01-31T18:30:00.000Z",
        "endDate": "2026-02-27T18:30:00.000Z",
        "publishedAt": "2026-01-25T10:04:59.877Z",
        "isPublic": true,
        "offerId": "cbcad136-3587-44c9-8417-84c86225e2dc"
      }
    ],
    "offerRelations": [
      {
        "id": "1164ed6c-b609-4d2d-bd15-4113c3dbe2c6",
        "categoryId": null,
        "brandId": "8acf9255-35bf-4ecc-a6e1-5734c0e745e9",
        "specificationId": null,
        "itemId": null,
        "itemListingId": null,
        "offerId": "cbcad136-3587-44c9-8417-84c86225e2dc",
        "category": null,
        "brand": {
          "id": "8acf9255-35bf-4ecc-a6e1-5734c0e745e9",
          "createdAt": "2026-01-24T07:06:51.922Z",
          "updatedAt": "2026-01-24T07:06:51.922Z",
          "name": "P01",
          "createdById": "dcee3c46-a37a-4bee-881b-8fba7bdbdb21",
          "deletedById": null,
          "brandLogoId": null
        },
        "specification": null,
        "item": null,
        "itemListing": null
      }
    ],
    "offerRegions": [
      {
        "id": "e149fd28-da6c-465c-8826-bc9877a4dae7",
        "pincodeId": "16aaa20e-968d-4067-839f-486281bf9fd3",
        "offerId": "cbcad136-3587-44c9-8417-84c86225e2dc",
        "pincode": {
          "id": "16aaa20e-968d-4067-839f-486281bf9fd3",
          "state": "west bengal",
          "district": "howrah",
          "pincode": "711106"
        }
      },
      {
        "id": "19f0c67c-f4b9-4b25-982b-84b86968ddbb",
        "pincodeId": "4cd37a5c-15dd-4300-8d82-a42f2190bcf3",
        "offerId": "cbcad136-3587-44c9-8417-84c86225e2dc",
        "pincode": {
          "id": "4cd37a5c-15dd-4300-8d82-a42f2190bcf3",
          "state": "west bengal",
          "district": "howrah",
          "pincode": "711204"
        }
      },
      {
        "id": "3b9133f6-d6e4-4da8-a4ff-2aab5bc86903",
        "pincodeId": "f6f6f2f9-8bdc-412f-a86b-62ae77adacdc",
        "offerId": "cbcad136-3587-44c9-8417-84c86225e2dc",
        "pincode": {
          "id": "f6f6f2f9-8bdc-412f-a86b-62ae77adacdc",
          "state": "west bengal",
          "district": "howrah",
          "pincode": "711205"
        }
      }
    ]
  },
  {
    "id": "70d1abaf-25a3-4e4f-9cc3-ea17e5aad493",
    "createdAt": "2026-01-25T08:22:20.507Z",
    "updatedAt": "2026-01-25T10:00:37.582Z",
    "isActive": true,
    "name": "Test Offer Q1",
    "description": "",
    "createdById": "715c2762-88d3-4ab9-add5-9becb477787d",
    "deletedById": null,
    "entityId": "9df5eca3-5dca-401a-9a3b-42a1499cc422",
    "entity": {
      "id": "9df5eca3-5dca-401a-9a3b-42a1499cc422",
      "name": "Test Seller",
      "legalName": "",
      "description": "",
      "createdAt": "2026-01-22T12:44:02.604Z",
      "updatedAt": "2026-01-22T12:44:02.604Z",
      "createdById": "715c2762-88d3-4ab9-add5-9becb477787d",
      "verificaitonRemark": null,
      "verifiedById": null,
      "deletedById": null,
      "type": null,
      "verificationStatus": "PENDING",
      "addressLine1": "",
      "addressLine2": "",
      "city": "",
      "contactEmail": "",
      "op_type": "PRODUCT",
      "pincodeId": "39971e59-0cc9-4856-953c-a33a3e3a10e2",
      "primaryContactNumber": "",
      "secondaryContactNumber": "",
      "supportEmail": ""
    },
    "offerDetails": [
      {
        "id": "f2cc87b7-3cd4-4fec-b28f-9e9bad5de3b4",
        "startDate": "2025-12-31T18:30:00.000Z",
        "endDate": "2026-03-30T18:30:00.000Z",
        "publishedAt": "2026-01-25T10:00:50.461Z",
        "isPublic": true,
        "offerId": "70d1abaf-25a3-4e4f-9cc3-ea17e5aad493"
      }
    ],
    "offerRelations": [
      {
        "id": "7495bda8-750a-40e4-9ea2-14111e8d2787",
        "categoryId": null,
        "brandId": null,
        "specificationId": null,
        "itemId": null,
        "itemListingId": "e82866fa-a5c7-4d7a-a736-d53066ce6e69",
        "offerId": "70d1abaf-25a3-4e4f-9cc3-ea17e5aad493",
        "category": null,
        "brand": null,
        "specification": null,
        "item": null,
        "itemListing": {
          "id": "e82866fa-a5c7-4d7a-a736-d53066ce6e69",
          "createdAt": "2026-01-24T07:12:19.966Z",
          "updatedAt": "2026-01-24T07:12:19.966Z",
          "createdById": "715c2762-88d3-4ab9-add5-9becb477787d",
          "deletedById": null,
          "isActive": true,
          "itemId": "6af8abbc-5d9b-42b9-a02e-2454f01624e7",
          "entityId": "9df5eca3-5dca-401a-9a3b-42a1499cc422"
        }
      }
    ],
    "offerRegions": [
      {
        "id": "1e2a116f-a66a-4aaa-8973-b64cb3e868c4",
        "pincodeId": "39971e59-0cc9-4856-953c-a33a3e3a10e2",
        "offerId": "70d1abaf-25a3-4e4f-9cc3-ea17e5aad493",
        "pincode": {
          "id": "39971e59-0cc9-4856-953c-a33a3e3a10e2",
          "state": "west bengal",
          "district": "kolkata",
          "pincode": "700005"
        }
      },
      {
        "id": "cf538370-ae37-439b-8516-1eca57ba5fd4",
        "pincodeId": "b0a1d5e8-c2b6-4f11-95e4-f4595ea15e68",
        "offerId": "70d1abaf-25a3-4e4f-9cc3-ea17e5aad493",
        "pincode": {
          "id": "b0a1d5e8-c2b6-4f11-95e4-f4595ea15e68",
          "state": "west bengal",
          "district": "kolkata",
          "pincode": "700020"
        }
      },
      {
        "id": "a59ff921-2cfb-45bc-92d6-b3f33d9033ca",
        "pincodeId": "95cdd153-94a0-49fe-a826-f1ef32f5cc64",
        "offerId": "70d1abaf-25a3-4e4f-9cc3-ea17e5aad493",
        "pincode": {
          "id": "95cdd153-94a0-49fe-a826-f1ef32f5cc64",
          "state": "west bengal",
          "district": "kolkata",
          "pincode": "700046"
        }
      }
    ]
  }
]
```
