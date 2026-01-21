/**
 * PDF Generation Script for Roof-link
 * Converts HTML template + JSON data into professional contractor estimate PDFs
 *
 * Usage:
 *   npm run generate                    # Uses charles-johnson.json by default
 *   npm run generate -- --data filename # Uses src/data/{filename}.json
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  templatePath: path.join(__dirname, '..', 'templates', 'estimate-template.html'),
  dataDir: path.join(__dirname, '..', 'data'),
  outputDir: path.join(__dirname, '..', '..', 'output'),
  defaultData: 'charles-johnson'
};

/**
 * Format a number as currency ($X,XXX.XX)
 */
function formatCurrency(value) {
  if (typeof value === 'string') {
    // Already formatted, return as-is
    if (value.startsWith('$')) return value;
    value = parseFloat(value);
  }
  if (isNaN(value)) return '$0.00';
  return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Generate HTML for a category header row
 */
function generateCategoryRow(categoryName) {
  return `
    <tr class="category-row">
      <td colspan="10">${categoryName}</td>
    </tr>
  `;
}

/**
 * Generate HTML for a single line item row
 */
function generateLineItemRow(item) {
  return `
    <tr>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td>${item.unit}</td>
      <td class="currency">${item.tax || ''}</td>
      <td class="currency">${formatCurrency(item.rcv)}</td>
      <td>${item.ageLife || ''}</td>
      <td>${item.condition || ''}</td>
      <td>${item.depPercent || ''}</td>
      <td class="currency ${item.depreciation ? 'negative' : ''}">${item.depreciation ? '(' + formatCurrency(item.depreciation) + ')' : ''}</td>
      <td class="currency">${formatCurrency(item.acv)}</td>
    </tr>
  `;
}

/**
 * Generate HTML for all line items, organized by category
 * Splits items between two pages for proper pagination
 */
function generateLineItemsHTML(lineItems, page) {
  let html = '';
  let itemCount = 0;
  const itemsPerPage1 = 17; // Approximate items that fit on page 1

  for (const category of lineItems) {
    // For page splitting
    const categoryStartCount = itemCount;

    // Check if this category should appear on this page
    if (page === 1) {
      // Page 1: items 0-16
      if (categoryStartCount >= itemsPerPage1) continue;

      html += generateCategoryRow(category.category);

      for (const item of category.items) {
        if (itemCount >= itemsPerPage1) break;
        html += generateLineItemRow(item);
        itemCount++;
      }
    } else {
      // Page 2: items 17+
      if (categoryStartCount + category.items.length <= itemsPerPage1) {
        itemCount += category.items.length;
        continue;
      }

      // Determine which items from this category go on page 2
      const skipItems = Math.max(0, itemsPerPage1 - categoryStartCount);
      const page2Items = category.items.slice(skipItems);

      if (page2Items.length > 0) {
        // Only show category header if we have items
        if (skipItems === 0) {
          html += generateCategoryRow(category.category);
        }

        for (const item of page2Items) {
          html += generateLineItemRow(item);
        }
      }

      itemCount += category.items.length;
    }
  }

  return html;
}

/**
 * Generate HTML for pre-loss conditions list
 */
function generatePreLossConditionsHTML(conditions) {
  return conditions.map(condition => `<li>${condition}</li>`).join('\n        ');
}

/**
 * Replace all template placeholders with actual data
 */
function populateTemplate(template, data) {
  let html = template;

  // Replace simple placeholders (nested object properties)
  const replacements = {
    // Contractor
    '{{contractor.name}}': data.contractor.name,
    '{{contractor.address}}': data.contractor.address,
    '{{contractor.city}}': data.contractor.city,
    '{{contractor.state}}': data.contractor.state,
    '{{contractor.zip}}': data.contractor.zip,
    '{{contractor.country}}': data.contractor.country,
    '{{contractor.phone}}': data.contractor.phone,
    '{{contractor.email}}': data.contractor.email,
    '{{contractor.rep}}': data.contractor.rep,

    // Carrier
    '{{carrier.name}}': data.carrier.name,
    '{{carrier.phone}}': data.carrier.phone,
    '{{carrier.email}}': data.carrier.email,
    '{{carrier.rep}}': data.carrier.rep,

    // Claim
    '{{claim.number}}': data.claim.number,
    '{{claim.policyNumber}}': data.claim.policyNumber,
    '{{claim.lossType}}': data.claim.lossType,
    '{{claim.lossDate}}': data.claim.lossDate,
    '{{claim.dateInspected}}': data.claim.dateInspected,
    '{{claim.estimateCompleted}}': data.claim.estimateCompleted,
    '{{claim.priceList}}': data.claim.priceList,

    // Insured
    '{{insured.name}}': data.insured.name,
    '{{insured.address}}': data.insured.address,
    '{{insured.city}}': data.insured.city,
    '{{insured.state}}': data.insured.state,
    '{{insured.zip}}': data.insured.zip,
    '{{insured.phone}}': data.insured.phone,
    '{{insured.email}}': data.insured.email,

    // Estimate Info
    '{{estimateTitle}}': data.estimateTitle,
    '{{estimateSubtitle}}': data.estimateSubtitle,
    '{{section}}': data.section,

    // Summary
    '{{summary.taxTotal}}': formatCurrency(data.summary.taxTotal),
    '{{summary.lineItemTotal}}': formatCurrency(data.summary.lineItemTotal),
    '{{summary.depreciationTotal}}': formatCurrency(data.summary.depreciationTotal),
    '{{summary.acvTotal}}': formatCurrency(data.summary.acvTotal),
    '{{summary.materialSalesTaxRate}}': data.summary.materialSalesTaxRate,
    '{{summary.materialSalesTax}}': formatCurrency(data.summary.materialSalesTax),
    '{{summary.rcvTotal}}': formatCurrency(data.summary.rcvTotal),
    '{{summary.totalDepreciation}}': formatCurrency(data.summary.totalDepreciation),
    '{{summary.totalACV}}': formatCurrency(data.summary.totalACV),
    '{{summary.additionalClaimValue}}': formatCurrency(data.summary.additionalClaimValue),

    // Footer
    '{{footer.disclaimer}}': data.footer.disclaimer,
    '{{footer.generatedDate}}': data.footer.generatedDate,

    // Professional Standards
    '{{professionalStandards.qualityAssurance}}': data.professionalStandards.qualityAssurance,
    '{{professionalStandards.documentation}}': data.professionalStandards.documentation,
    '{{professionalStandards.warranty}}': data.professionalStandards.warranty,
    '{{professionalStandards.contact}}': data.professionalStandards.contact
  };

  // Apply all replacements
  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.split(placeholder).join(value || '');
  }

  // Generate and insert line items
  html = html.replace('{{LINE_ITEMS_PAGE1}}', generateLineItemsHTML(data.lineItems, 1));
  html = html.replace('{{LINE_ITEMS_PAGE2}}', generateLineItemsHTML(data.lineItems, 2));

  // Generate and insert pre-loss conditions
  html = html.replace('{{PRE_LOSS_CONDITIONS}}', generatePreLossConditionsHTML(data.preLossConditions));
  html = html.replace('{{PRE_LOSS_CONTINUED}}', ''); // Empty for now, can be extended

  return html;
}

/**
 * Main PDF generation function
 */
async function generatePDF(dataFile) {
  console.log('🚀 Starting PDF generation...');

  // Load data
  const dataPath = path.join(CONFIG.dataDir, `${dataFile}.json`);
  console.log(`📂 Loading data from: ${dataPath}`);

  if (!fs.existsSync(dataPath)) {
    throw new Error(`Data file not found: ${dataPath}`);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`✅ Loaded data for: ${data.insured.name}`);

  // Load template
  console.log(`📄 Loading template from: ${CONFIG.templatePath}`);

  if (!fs.existsSync(CONFIG.templatePath)) {
    throw new Error(`Template not found: ${CONFIG.templatePath}`);
  }

  const template = fs.readFileSync(CONFIG.templatePath, 'utf8');
  console.log('✅ Template loaded');

  // Populate template
  console.log('🔧 Populating template with data...');
  const populatedHTML = populateTemplate(template, data);
  console.log('✅ Template populated');

  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${CONFIG.outputDir}`);
  }

  // Generate output filename
  const outputFilename = `${data.contractor.name} - ${data.insured.name} Insurance Estimate.pdf`;
  const outputPath = path.join(CONFIG.outputDir, outputFilename);

  // Launch Puppeteer
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set content with proper waiting
    console.log('📝 Setting page content...');
    await page.setContent(populatedHTML, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF
    console.log('📄 Generating PDF...');
    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: true, // CRITICAL: Preserves colors and backgrounds
      margin: {
        top: '0in',
        right: '0in',
        bottom: '0in',
        left: '0in'
      }
    });

    console.log('');
    console.log('✨ PDF generated successfully!');
    console.log(`📍 Output: ${outputPath}`);

    // Get file size
    const stats = fs.statSync(outputPath);
    const fileSizeKB = Math.round(stats.size / 1024);
    console.log(`📊 Size: ${fileSizeKB} KB`);

  } finally {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  let dataFile = CONFIG.defaultData;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--data' && args[i + 1]) {
      dataFile = args[i + 1];
    }
  }

  return { dataFile };
}

// Main execution
const { dataFile } = parseArgs();

generatePDF(dataFile)
  .then(() => {
    console.log('');
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
