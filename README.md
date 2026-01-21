<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:4F46E5,100:06B6D4&height=200&section=header&text=pdf2esx&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Insurance%20PDF%20to%20Estimate%20Converter&descAlignY=55&descSize=20" width="100%"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=4F46E5&center=true&vCenter=true&multiline=true&repeat=true&width=600&height=100&lines=Transform+Insurance+Scopes+into+Estimates;Powered+by+OCR+%2B+Rooflink+API;Built+for+Roofing+Contractors" alt="Typing SVG" />
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Features-4F46E5?style=for-the-badge&logo=star&logoColor=white" alt="Features"/></a>
  <a href="#quick-start"><img src="https://img.shields.io/badge/Quick_Start-06B6D4?style=for-the-badge&logo=rocket&logoColor=white" alt="Quick Start"/></a>
  <a href="#api"><img src="https://img.shields.io/badge/API-10B981?style=for-the-badge&logo=fastapi&logoColor=white" alt="API"/></a>
  <a href="#contributing"><img src="https://img.shields.io/badge/Contributing-F59E0B?style=for-the-badge&logo=github&logoColor=white" alt="Contributing"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white" alt="Puppeteer"/>
  <img src="https://img.shields.io/badge/Tesseract-5A29E4?style=for-the-badge&logo=google&logoColor=white" alt="Tesseract OCR"/>
</p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

<p align="center">
  <b>Transform insurance scope PDFs into professional contractor supplement estimates in minutes, not hours.</b>
</p>

<p align="center">
  <i>Recover $15K-$25K+ per claim through proper supplementation</i>
</p>

---

## Overview

**pdf2esx** (PDF to Estimate) is an automation tool that converts insurance company scope documents into branded contractor supplement estimates. It uses OCR technology to extract data from insurance PDFs and generates professional PDF estimates ready for submission.

### The Problem

Roofing contractors spend 2+ hours manually:
- Reading through multi-page insurance scope PDFs
- Extracting line items, quantities, and pricing
- Re-entering data into their own estimate format
- Calculating supplement values

### The Solution

pdf2esx automates this entire workflow:

```
Insurance PDF → OCR Parse → Data Extract → Template → Professional PDF
     ↓                                                      ↓
  5 minutes                                         Download Ready
```

---

## Features

<details>
<summary><b>PDF Parsing & OCR</b></summary>

- **Digital PDF Support**: Direct text extraction from digital PDFs
- **Scanned Document OCR**: Tesseract.js for image-based documents
- **Multi-Page Processing**: Handle complex insurance scopes (10+ pages)
- **Intelligent Data Extraction**: Claim info, line items, measurements, pricing

</details>

<details>
<summary><b>Professional Output</b></summary>

- **Branded Templates**: Customizable HTML/CSS templates
- **PDF Generation**: High-quality PDF output via Puppeteer
- **Multiple Formats**: Support for different contractor branding
- **Supplement Calculations**: Automatic additional value calculations

</details>

<details>
<summary><b>Rooflink Integration</b></summary>

- **Aerial Photos**: Fetch property aerial imagery
- **Roof Measurements**: Accurate squares, ridge, hip, perimeter lengths
- **Property Data**: Address verification and property details
- **API-Driven**: Seamless integration with Rooflink Developer API

</details>

<details>
<summary><b>Data Extraction</b></summary>

| Field | Example |
|-------|---------|
| Claim Number | 7009280374-1 |
| Policy Number | 0789381246 |
| Property Address | 521 La Cresta Dr, Red Oak, TX |
| Date of Loss | 05/16/2025 |
| Type of Loss | Hail |
| Total RCV | $26,703.44 |
| Line Items | Shingles, Underlayment, Labor, etc. |

</details>

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/MrJPTech/pdf2esx.git
cd pdf2esx

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Configuration

```env
# Required
ROOFLINK_API_KEY=your_rooflink_api_key
ROOFLINK_BASE_URL=https://api.rooflink.com

# Optional: Supabase for data persistence
SUPABASE_PROJECT_REF=your_project_ref
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Usage

```bash
# Parse an insurance scope PDF
npm run parse -- --input ./docs/INSURANCE_SCOPE.pdf

# Generate estimate from parsed data
npm run generate -- --input ./data/parsed.json --template contractor

# Full pipeline
npm run process -- --input ./docs/SCOPE.pdf --output ./output/estimate.pdf
```

---

## Architecture

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
│  { property, claim, insured, contractor, lineItems, summary }   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OUTPUT GENERATION                             │
├─────────────────────────────────────────────────────────────────┤
│  HTML Template  │  PDF Export  │  Local Storage  │  Download     │
└─────────────────┴──────────────┴─────────────────┴──────────────┘
```

---

## API

### Core Interfaces

```typescript
interface InsuranceScope {
  claim: {
    number: string;
    policyNumber: string;
    lossDate: Date;
    lossType: string;
  };
  insured: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  roofData: {
    surfaceArea: number;
    squares: number;
    ridgeLength: number;
    hipLength: number;
  };
  lineItems: LineItem[];
  summary: {
    rcv: number;
    acv: number;
    depreciation: number;
  };
}
```

---

## Roadmap

### Phase 1: MVP
- [x] Project structure and configuration
- [ ] PDF text extraction
- [ ] Basic HTML template
- [ ] PDF generation with Puppeteer
- [ ] Sample document testing

### Phase 2: Automation
- [ ] OCR for scanned PDFs
- [ ] Rooflink API integration
- [ ] Supabase persistence (optional)

### Phase 3: Polish
- [ ] Web UI for uploads
- [ ] Error handling and validation
- [ ] Multiple template options
- [ ] Documentation

---

## Contributing

We welcome contributions! Please see our contributing guidelines.

### Contributors

<!-- Add contributor avatars here -->

---

## License

This project is proprietary software developed by PRSMTECH.

---

## Support

**Primary Contact**: Golden Nail Roofing
- Jalen Ward
- supplement@goldennailroofing.com
- (469) 389-0597

---

<p align="center">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back_to_Top-4F46E5?style=for-the-badge&logo=chevron-up&logoColor=white" alt="Back to Top"/>
  </a>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:4F46E5,100:06B6D4&height=100&section=footer" width="100%"/>
</p>

<p align="center">
  <sub>Built with <img src="https://img.shields.io/badge/Claude_Code-4F46E5?style=flat&logo=anthropic&logoColor=white" alt="Claude Code"/> by <a href="https://github.com/MrJPTech">PRSMTECH</a></sub>
</p>
