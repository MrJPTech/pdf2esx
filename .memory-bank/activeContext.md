# Active Context - Roof-link

## Current Focus
- Project initialization and setup
- Understanding requirements from meeting transcription
- Analyzing input/output document formats

## Session: 2026-01-21

### Completed This Session
- [x] Analyzed meeting transcription for requirements
- [x] Examined input PDF (Farmers Insurance scope)
- [x] Examined output PDF (Golden Nail Roofing estimate)
- [x] Created project directory structure
- [x] Initialized git repository
- [x] Created Memory Bank files
- [x] Created .env.local template
- [x] Created project CLAUDE.md

### Key Insights from Meeting Transcription

**Core Workflow Identified:**
1. Roofer/Manager/Agency uploads insurance PDF
2. System OCR parses the PDF to extract data
3. Data written into professional template (SVG/HTML)
4. Export as branded PDF estimate

**Technical Approach:**
- Use SVG template for best visual quality
- OCR parsing for insurance PDF extraction
- Rooflink API for photos and measurements
- Google Sheets automation for tracking
- Email integration for sending estimates

**Timeline Mentioned:**
- "Could have this working by Friday" - indicating quick MVP is feasible

### Rooflink API Discovery
From meeting notes:
- Rooflink has developer documentation
- API key available through their developer portal
- MCP server integration possible for Claude Desktop
- Can get roof photos, measurements directly via API

## Open Questions
1. Which Rooflink API endpoints are available?
2. What permissions does the API key provide?
3. Preferred template styling (exact branding requirements)?
4. Google Sheets structure for tracking?

## Next Steps
1. [ ] Set up Node.js/Python project structure
2. [ ] Implement PDF OCR parsing module
3. [ ] Create HTML/SVG estimate template
4. [ ] Integrate Rooflink API for photos
5. [ ] Build Google Sheets automation
6. [ ] Add email sending capability

## Technical Decisions
- **Decision**: Use HTML templates (easier to maintain) over SVG
- **Rationale**: HTML can include dynamic data more easily, PDF libraries support HTML well
- **Decision Logged**: 2026-01-21
