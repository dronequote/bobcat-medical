# Bobcat Medical - Credentials & Setup

## GHL API Token
```
pit-f38f3d9b-2a83-4465-867e-b21453b814ba
```

## GHL Location ID
```
697bd911533633ba616ad803
```

## MongoDB Setup

Run this in MongoDB to set up Bobcat Medical:

```javascript
// 1. Insert storefront config
db.storefronts.insertOne({
  clientId: "bobcat-medical",
  name: "Bobcat Medical",
  ghlLocationId: "697bd911533633ba616ad803",
  ghlApiToken: "pit-f38f3d9b-2a83-4465-867e-b21453b814ba",
  siteUrl: "https://bobcatmedical.com",
  businessName: "Bobcat Medical",
  businessAddress: "123 Healthcare Blvd, Medical City, MC 12345",
  businessEmail: "info@bobcatmedical.com",
  logoUrl: null,
  primaryColor: "#0d8f8f",
  superadminEmails: [
    "admin@bobcatmedical.com"
  ],
  hiddenSuperadminEmail: "info@leadprospecting.ai",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Frontend .env

```
PUBLIC_API_URL=https://lpai-monorepo-production.up.railway.app/api
PUBLIC_SITE_URL=https://bobcatmedical.com
```
