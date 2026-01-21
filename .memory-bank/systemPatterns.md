# System Patterns - Roof-link

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         INPUT SOURCES                           │
├─────────────────────────────────────────────────────────────────┤
│  Insurance PDF  │  Rooflink API  │  Manual Entry  │  Photos     │
│  (OCR Parse)    │  (Measurements)│  (Override)    │  (Upload)   │
└────────┬────────┴────────┬───────┴────────┬───────┴──────┬──────┘
         │                 │                │              │
         ▼                 ▼                ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA NORMALIZATION LAYER                      │
│  - Extract structured data from all sources                      │
│  - Validate and merge data                                       │
│  - Apply business rules (pricing, calculations)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ESTIMATE DATA MODEL                           │
│  {                                                               │
│    property: { address, city, state, zip },                      │
│    claim: { number, policyNumber, lossDate, lossType },          │
│    insured: { name, phone, email },                              │
│    contractor: { name, address, phone, email },                  │
│    lineItems: [{ description, qty, unit, price, rcv, acv }],     │
│    summary: { subtotal, tax, total, depreciation, netClaim }     │
│  }                                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OUTPUT GENERATION                             │
├─────────────────────────────────────────────────────────────────┤
│  HTML Template  │  PDF Export  │  Google Sheets  │  Email Send  │
└─────────────────┴──────────────┴─────────────────┴──────────────┘
```

## Core Data Structures

### Insurance Scope (Input)
```typescript
interface InsuranceScope {
  claim: {
    number: string;          // "7009280374-1"
    policyNumber: string;    // "0789381246"
    lossDate: Date;          // "05/16/2025"
    lossType: string;        // "Hail"
  };
  insured: {
    name: string;            // "Charles Johnson"
    address: string;         // "521 La Cresta Dr"
    city: string;            // "Red Oak"
    state: string;           // "TX"
    zip: string;             // "75154-5109"
    phone: string;           // "(214) 802-8209"
    email: string;           // "melbajohnson@swbell.net"
  };
  carrier: {
    name: string;            // "Farmers / Mid-Century Insurance"
    rep: string;             // "Barry Hollingsworth"
    phone: string;           // "(214) 813-5253"
    email: string;           // "myclaim@farmersinsurance.com"
  };
  roofData: {
    surfaceArea: number;     // 5474.24 SF
    squares: number;         // 54.74
    ridgeLength: number;     // 74.38 LF
    hipLength: number;       // 259.56 LF
    perimeterLength: number; // 511.00 LF
  };
  lineItems: LineItem[];
  summary: {
    lineItemTotal: number;
    materialTax: number;
    rcv: number;             // Replacement Cost Value
    depreciation: number;
    acv: number;             // Actual Cash Value
    deductible: number;
    priorPayments: number;
    netClaim: number;
  };
}

interface LineItem {
  description: string;       // "Laminated - comp. shingle rfg."
  quantity: number;          // 52.12
  unit: string;              // "SQ"
  unitPrice: number;         // 284.90
  tax: number;               // 440.15
  rcv: number;               // 15,289.14
  ageLife: string;           // "5/30 yrs"
  condition: string;         // "Repl."
  depPercent: number;        // 0%
  depreciation: number;      // 0.00
  acv: number;               // 15,289.14
}
```

### Contractor Estimate (Output)
```typescript
interface ContractorEstimate extends InsuranceScope {
  contractor: {
    name: string;            // "Golden Nail Roofing"
    address: string;         // "2300 Valley View Ln Ste 106"
    city: string;            // "Irving"
    state: string;           // "TX"
    zip: string;             // "75062"
    phone: string;           // "(469) 389-0597"
    email: string;           // "supplement@goldennailroofing.com"
    rep: string;             // "Jalen Ward"
  };
  supplementItems: LineItem[];  // Additional items for supplement
  additionalClaimValue: number; // Value recovered through supplement
  generatedDate: Date;
  templateVersion: string;
}
```

## File Naming Conventions

### Input Files
- `{INSURED_NAME}_INSURANCE_SCOPE.pdf`
- Example: `CHARLES_JOHNSON_INSURANCE_SCOPE.pdf`

### Output Files
- `{Contractor} - {Insured Name} Insurance Estimate.pdf`
- Example: `Golden Nail Roofing - Charles Johnson Insurance Estimate.pdf`

## API Integration Patterns

### Rooflink API
```typescript
// Authentication
const rooflink = new RooflinkClient({
  apiKey: process.env.ROOFLINK_API_KEY,
  baseUrl: process.env.ROOFLINK_BASE_URL
});

// Get property data
const propertyData = await rooflink.getProperty(address);
const roofMeasurements = await rooflink.getMeasurements(propertyId);
const aerialPhotos = await rooflink.getPhotos(propertyId);
```

### Google Sheets Integration
```typescript
// Append estimate data to tracking sheet
await sheets.appendRow(spreadsheetId, {
  date: new Date(),
  claimNumber: estimate.claim.number,
  insuredName: estimate.insured.name,
  address: estimate.insured.address,
  carrierRCV: estimate.summary.rcv,
  supplementRCV: estimate.supplementSummary.rcv,
  additionalValue: estimate.additionalClaimValue,
  status: 'Generated'
});
```

## Error Handling Patterns

### OCR Parsing Errors
```typescript
try {
  const extractedData = await ocrService.parse(pdfBuffer);
  validateExtractedData(extractedData);
} catch (error) {
  if (error instanceof OCRError) {
    // Log for manual review
    await logFailedParse(pdfBuffer, error);
    // Offer manual entry fallback
    return { success: false, requiresManualEntry: true };
  }
  throw error;
}
```

### Validation Rules
1. Claim number format validation
2. Address verification (optional Rooflink lookup)
3. Line item quantity/price sanity checks
4. Required fields presence check

## Template System

### Template Variables
```html
<!-- Property Info -->
{{insured.name}}
{{insured.address}}
{{claim.number}}

<!-- Line Items Loop -->
{{#each lineItems}}
  <tr>
    <td>{{description}}</td>
    <td>{{quantity}} {{unit}}</td>
    <td>{{formatCurrency unitPrice}}</td>
    <td>{{formatCurrency rcv}}</td>
  </tr>
{{/each}}

<!-- Summary -->
{{formatCurrency summary.rcv}}
{{formatCurrency summary.netClaim}}
```

### CSS Classes for Styling
- `.estimate-header` - Company branding header
- `.property-info` - Property and claim details
- `.line-items-table` - Main estimate table
- `.summary-section` - Totals and calculations
- `.footer` - Contact info and disclaimers
