# Product Context - Roof-link

## Project Overview
**Name**: Roof-link
**Type**: Internal Tool / SaaS Application
**Status**: Initial Development
**Created**: 2026-01-21
**Location**: J:\PRSMTECH\INTERNAL-PROJECTS\Roof-link

## Business Problem
Roofing contractors need to:
1. Parse insurance company scope PDFs (e.g., Farmers Insurance estimates)
2. Extract line items, quantities, pricing, and property details via OCR
3. Generate professional supplement estimates in a branded format
4. Integrate with Rooflink API for roof measurements and photos
5. Automate workflows: Google Sheets logging, email notifications

## Technology Stack

### Core Technologies
- **Runtime**: Node.js / Python (TBD based on requirements)
- **PDF Parsing**: OCR (Tesseract, Google Vision, or AWS Textract)
- **Template Engine**: HTML/SVG templates → PDF export
- **API Integration**: Rooflink Developer API

### Integrations
- **Rooflink API**: Roof measurements, aerial photos, property data
- **Google Sheets API**: Data logging and tracking
- **SendGrid**: Email notifications
- **Supabase**: (Optional) Data persistence

## Key Features

### Phase 1: MVP
1. **PDF Upload & OCR Parsing**
   - Accept insurance scope PDFs
   - Extract: Property address, claim info, line items, quantities, pricing

2. **Data Transformation**
   - Map insurance scope fields to contractor estimate format
   - Calculate supplement values (additional claim recovery)

3. **Template-Based PDF Generation**
   - Professional branded output (Golden Nail Roofing style)
   - SVG/HTML template system for easy customization

### Phase 2: Automation
1. **Rooflink API Integration**
   - Fetch roof photos automatically
   - Get accurate measurements (squares, ridge length, etc.)

2. **Google Automation**
   - Add parsed data to Google Sheets
   - Track claim status and follow-ups

3. **Email Integration**
   - Send estimates to insurance adjusters
   - Notification workflows

### Phase 3: SaaS Features
1. Multi-tenant support
2. Custom branding per contractor
3. Dashboard and analytics
4. Integration marketplace

## Document Examples

### Input: Insurance Scope PDF
- **Source**: Farmers Insurance / Mid-Century Insurance of Texas
- **Format**: Multi-page PDF with line items, roof diagrams, pricing
- **Key Fields**: Claim #, Policy #, Property Address, Line Items (Qty, Unit, RCV, ACV, Depreciation)
- **Example**: `CHARLES_JOHNSON_INSURANCE_SCOPE.pdf`

### Output: Contractor Supplement Estimate
- **Format**: Branded HTML → PDF
- **Key Sections**: Header, Property Info, Line Items Table, Summary, Footer
- **Example**: `Golden Nail Roofing - Charles Johnson Insurance Estimate.pdf`

## Success Metrics
- Time to generate estimate: <5 minutes (vs 2+ hours manual)
- Accuracy of OCR parsing: >95%
- Additional claim value recovery: Track per estimate
- User adoption: Contractors using the tool weekly

## Stakeholders
- **Primary Users**: Roofing contractors, supplement specialists
- **End Recipients**: Insurance adjusters, homeowners
- **Client**: Golden Nail Roofing (initial implementation)
