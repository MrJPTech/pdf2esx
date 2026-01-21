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
│  HTML Template  │  PDF Export  │  Local Storage  │  Download     │
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

### Local Data Storage (Optional)
```typescript
// Save estimate data locally or to Supabase
const estimateRecord = {
  date: new Date(),
  claimNumber: estimate.claim.number,
  insuredName: estimate.insured.name,
  address: estimate.insured.address,
  carrierRCV: estimate.summary.rcv,
  supplementRCV: estimate.supplementSummary.rcv,
  additionalValue: estimate.additionalClaimValue,
  status: 'Generated'
};

// Option 1: Local JSON file
await fs.writeFile(`./data/estimates/${estimate.claim.number}.json`, JSON.stringify(estimateRecord));

// Option 2: Supabase (if configured)
await supabase.from('estimates').insert(estimateRecord);
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

---

## Implemented Patterns (2026-01-21)

### PDF Generation Pipeline
```javascript
// src/scripts/generate-pdf.js pattern
const puppeteer = require('puppeteer');

async function generatePDF(dataFile) {
  // 1. Load JSON data
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // 2. Load and populate HTML template
  let template = fs.readFileSync(templatePath, 'utf8');
  const populatedHTML = populateTemplate(template, data);

  // 3. Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 4. Generate PDF
  const page = await browser.newPage();
  await page.setContent(populatedHTML, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true,  // Critical for colors
    margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' }
  });

  await browser.close();
}
```

### Template Placeholder Pattern
```javascript
// Simple {{variable}} replacement
function populateTemplate(template, data) {
  // Replace nested objects: {{contractor.name}}
  // Replace arrays: {{LINE_ITEMS_PAGE1}}
  // Format currency: formatCurrency(value)
}
```

### JSON Data Structure (Implemented)
```json
{
  "contractor": { "name", "address", "city", "state", "zip", "phone", "email", "rep" },
  "carrier": { "name", "phone", "email", "rep" },
  "claim": { "number", "policyNumber", "lossType", "lossDate", "dateInspected", "estimateCompleted", "priceList" },
  "insured": { "name", "address", "city", "state", "zip", "phone", "email" },
  "estimateTitle": "Restoration/Service/Remodel",
  "estimateSubtitle": "Supplement Estimate: Charles Johnson Property",
  "section": "Roof - Dwelling",
  "lineItems": [
    {
      "category": "TEAR-OFF & PREPARATION",
      "items": [
        { "description", "quantity", "unit", "tax", "rcv", "ageLife", "condition", "depPercent", "depreciation", "acv" }
      ]
    }
  ],
  "summary": { "taxTotal", "lineItemTotal", "depreciationTotal", "acvTotal", "materialSalesTaxRate", "materialSalesTax", "rcvTotal", "totalDepreciation", "totalACV", "additionalClaimValue" },
  "preLossConditions": ["Condition 1", "Condition 2", ...],
  "footer": { "disclaimer", "generatedDate" },
  "professionalStandards": { "qualityAssurance", "documentation", "warranty", "contact" }
}
```

### CSS Variables for Branding
```css
:root {
  --gold-accent: #c9a227;      /* Golden yellow for headers */
  --gold-light: #f5e6b3;
  --category-bg: #fff9e6;      /* Light yellow for category rows */
  --header-bg: #f5f5f5;        /* Light gray for table headers */
  --border-color: #d0d0d0;
  --text-dark: #333333;
  --summary-header: #c9a227;   /* Gold header bar */
}
```

### Page Layout Pattern (3-page)
- **Page 1**: Header + Contact Grid + First half of line items
- **Page 2**: Remaining line items + Totals + Summary + Pre-loss conditions
- **Page 3**: Continued pre-loss + Signature + Disclaimer + Professional standards box
