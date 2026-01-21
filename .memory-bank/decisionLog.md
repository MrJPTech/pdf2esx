# Decision Log - Roof-link

## Architecture Decisions

### DEC-001: HTML Templates over SVG
**Date**: 2026-01-21
**Status**: Approved
**Decision**: Use HTML/CSS templates instead of pure SVG for PDF generation

**Context**:
Meeting transcription mentioned SVG for "best quality" templates. However, HTML offers better flexibility.

**Options Considered**:
1. **SVG Templates** - Better for fixed layouts, complex graphics
2. **HTML/CSS Templates** - Better for dynamic content, tables, easier maintenance
3. **Hybrid** - SVG for header/logo, HTML for content

**Decision**: HTML/CSS with Tailwind for styling

**Rationale**:
- Insurance estimates are primarily tabular data
- HTML handles dynamic row counts naturally
- Easier to maintain and customize per contractor
- Modern PDF libraries (Puppeteer) render HTML excellently

**Consequences**:
- Need Puppeteer or similar for HTML→PDF conversion
- Template designers need HTML/CSS knowledge
- Excellent browser preview during development

---

### DEC-002: OCR Service Selection
**Date**: 2026-01-21
**Status**: Pending Evaluation

**Context**:
Need to extract text and structure from insurance PDF documents

**Options Considered**:
1. **Tesseract OCR** - Free, local, good for basic extraction
2. **Google Cloud Vision** - Excellent accuracy, cloud-based, per-API cost
3. **AWS Textract** - Best for structured documents, higher cost
4. **pdf.js + pdf-parse** - For digital PDFs (not scanned)

**Decision**: TBD - Need to test with sample documents

**Evaluation Criteria**:
- Accuracy on insurance scope PDFs
- Handling of tables and line items
- Cost at scale
- Implementation complexity

---

### DEC-003: Project Type (Node.js vs Python)
**Date**: 2026-01-21
**Status**: Recommended Node.js

**Context**:
Meeting transcript mentioned both Python and Node.js as options

**Recommendation**: Node.js with TypeScript

**Rationale**:
- Better PDF libraries (Puppeteer for HTML→PDF)
- Excellent async handling for API calls
- TypeScript for type safety
- npm ecosystem for integrations (Rooflink, Supabase)
- Consistent with PRSMTECH stack (Next.js projects)

**Alternative**: Python for OCR-heavy workloads (better ML libraries)

---

## Integration Decisions

### DEC-004: Rooflink API as Primary Data Source
**Date**: 2026-01-21
**Status**: Approved (pending API access)

**Context**:
From meeting: "You don't even need a Rooflink developer just get it from there. It's a real API key..."

**Decision**: Build around Rooflink API for roof measurements and photos

**Integration Points**:
- Roof measurements (squares, ridge length, etc.)
- Aerial photos
- Property details

**Fallback**: Manual entry if API unavailable

---

## Process Decisions

### DEC-005: Quick MVP Approach
**Date**: 2026-01-21
**Status**: Approved

**Context**:
From meeting: "We could have that shit working by Friday"

**Decision**: Focus on minimal viable product first

**MVP Scope**:
1. Manual PDF upload
2. OCR extraction to JSON
3. JSON → HTML template → PDF
4. Download generated estimate

**Deferred to Phase 2**:
- Automatic Rooflink integration
- Supabase data persistence (optional)
- Multi-tenant support
