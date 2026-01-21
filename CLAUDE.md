# CLAUDE.md - Roof-link Project Guide

## Project Overview

**Name**: Roof-link
**Type**: Internal Tool / SaaS Application
**Purpose**: Automate roofing insurance claim processing and supplement estimate generation
**Location**: `J:\PRSMTECH\INTERNAL-PROJECTS\Roof-link`
**Status**: Initial Development

## What This Project Does

Roof-link transforms insurance scope PDFs into professional contractor supplement estimates:

1. **Input**: Insurance company scope PDF (e.g., Farmers Insurance hail damage estimate)
2. **Processing**: OCR parsing extracts property details, line items, pricing
3. **Enhancement**: Rooflink API provides accurate roof measurements and photos
4. **Output**: Branded contractor estimate PDF with supplement items

**Value Proposition**: Recover additional claim value ($15K-$25K+ per claim) through proper supplementation.

## Technology Stack

### Recommended Stack
- **Runtime**: Node.js 20+ with TypeScript
- **PDF Parsing**: pdf-parse (digital PDFs) + Tesseract.js (scanned)
- **PDF Generation**: Puppeteer (HTML → PDF)
- **Template Engine**: Handlebars or EJS
- **Styling**: Tailwind CSS
- **API Client**: Axios

### Integrations
- **Rooflink API**: Roof measurements, aerial photos
- **Google Sheets API**: Claim tracking and logging
- **SendGrid**: Email delivery
- **Supabase**: (Optional) Data persistence

## Directory Structure

```
Roof-link/
├── .claude/                    # Claude Code configuration
│   └── commands/               # Project-specific slash commands
├── .memory-bank/               # Session context files
│   ├── activeContext.md
│   ├── productContext.md
│   ├── progress.md
│   ├── decisionLog.md
│   └── systemPatterns.md
├── media/                      # Sample files and meeting recordings
│   └── docs/                   # Sample PDFs
├── src/                        # Source code (to be created)
│   ├── parsers/                # PDF/OCR parsing modules
│   ├── templates/              # HTML estimate templates
│   ├── services/               # API integration services
│   └── utils/                  # Helper utilities
├── templates/                  # HTML/CSS templates
├── .env.local                  # Environment configuration
├── .gitignore                  # Git ignore rules
├── package.json                # Node.js dependencies
└── CLAUDE.md                   # This file
```

## Sample Documents

Located in `media/docs/`:

### Input Example
- **File**: `CHARLES_JOHNSON_INSURANCE_SCOPE.pdf`
- **Source**: Farmers Insurance / Mid-Century Insurance of Texas
- **Type**: Hail damage claim (05/16/2025)
- **Property**: 521 La Cresta Dr, Red Oak, TX
- **Key Data**: EagleView roof measurements, line items with RCV/ACV

### Output Example
- **File**: `Golden Nail Roofing - Charles Johnson Insurance Estimate.pdf`
- **Contractor**: Golden Nail Roofing (Irving, TX)
- **Format**: Professional branded estimate
- **Key Feature**: Additional claim value recovered: $19,674.74

## Key Data Fields to Extract

### From Insurance Scope PDF
```
Claim Information:
- Claim Number: 7009280374-1
- Policy Number: 0789381246
- Date of Loss: 05/16/2025
- Type of Loss: Hail

Insured Information:
- Name: Charles Johnson
- Address: 521 La Cresta Dr, Red Oak, TX 75154-5109
- Phone: (214) 802-8209
- Email: melbajohnson@swbell.net

Roof Measurements (from EagleView):
- Surface Area: 5,474.24 SF
- Number of Squares: 54.74
- Total Ridge Length: 74.38 LF
- Total Hip Length: 259.56 LF
- Total Perimeter: 511.00 LF

Line Items: (Array of items with Qty, Unit, Tax, RCV, ACV, Depreciation)
```

## Common Commands

### Development
```bash
# Install dependencies (when package.json is created)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### PDF Processing (Planned)
```bash
# Parse an insurance scope PDF
npm run parse -- --input ./media/docs/CHARLES_JOHNSON_INSURANCE_SCOPE.pdf

# Generate estimate from parsed data
npm run generate -- --input ./data/parsed.json --template contractor

# Full pipeline: parse and generate
npm run process -- --input ./media/docs/SCOPE.pdf --output ./output/estimate.pdf
```

## Rooflink API Integration

### Authentication
```javascript
// Use API key from .env.local
const ROOFLINK_API_KEY = process.env.ROOFLINK_API_KEY;
```

### Key Endpoints (to be verified)
- Property lookup by address
- Roof measurements
- Aerial photos
- Building details

### MCP Server Option
From meeting notes: Rooflink may have MCP server integration for Claude Desktop.
Check their developer documentation for `mcp-server-rooflink` or similar.

## Environment Variables

Required in `.env.local`:
```
ROOFLINK_API_KEY=           # Rooflink developer API key
GOOGLE_SHEETS_API_KEY=      # Google Sheets API (optional)
SENDGRID_API_KEY=           # Email sending (optional)
```

## Development Workflow

### Session Start
```bash
cd J:\PRSMTECH\INTERNAL-PROJECTS\Roof-link
C:\Users\swizz\.claude\load-project-env.ps1
claude-code
/memory-load
```

### Session End
```bash
/memory-save
git add .
git commit -m "feat: description of changes"
```

## Key Implementation Tasks

### Phase 1: MVP (Week 1)
1. [ ] Set up Node.js project with TypeScript
2. [ ] Implement PDF text extraction
3. [ ] Create basic HTML template
4. [ ] Build PDF generation with Puppeteer
5. [ ] Test with sample documents

### Phase 2: Automation (Week 2)
1. [ ] Add OCR for scanned PDFs
2. [ ] Integrate Rooflink API
3. [ ] Add Google Sheets logging
4. [ ] Implement email sending

### Phase 3: Polish (Week 3)
1. [ ] Build web UI for uploads
2. [ ] Add error handling and validation
3. [ ] Create multiple template options
4. [ ] Write documentation

## Meeting Recording

The original requirements discussion is recorded at:
`media/2026-01-21_00-20-24_1.mp3`

Key points from the meeting:
- OCR parse insurance PDF → extract to template
- Use SVG/HTML for professional output
- Rooflink API for measurements and photos
- Google automation for tracking
- "Could have this working by Friday" - MVP is straightforward

## Related PRSMTECH Resources

- **LOGIC Documentation**: `J:\PRSMTECH\LOGIC\`
- **Global Framework**: `C:\Users\swizz\.claude\`
- **Similar Projects**: Check other internal tools in `J:\PRSMTECH\INTERNAL-PROJECTS\`

## Contact

**Primary Client**: Golden Nail Roofing
- Jalen Ward
- supplement@goldennailroofing.com
- (469) 389-0597

---

*Last Updated: 2026-01-21*
*Created by: PRSMTECH / Claude Code*
