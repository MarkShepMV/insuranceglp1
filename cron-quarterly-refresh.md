# Quarterly GLP-1 Carrier Page Refresh — Cron Task Specification

**Schedule:** `0 7 1 2,5,8,11 *` UTC  
**Runs:** Feb 1 / May 1 / Aug 1 / Nov 1 at 07:00 UTC (2:00 PM Bangkok / ICT)  
**Notification title:** "insuranceglp1 carrier pages refreshed — [quarter]"  
**Repo:** https://github.com/ (master branch)  
**Site:** https://www.insuranceglp1.com (GitHub Pages, canonical www)

---

## Context (read before running)

This cron updates three carrier-specific GLP-1 insurance coverage pages for insuranceglp1.com. The pages summarize publicly-disclosed formulary information for Aetna, UnitedHealthcare, and Blue Cross Blue Shield regarding four medications: Ozempic (semaglutide), Wegovy (semaglutide), Mounjaro (tirzepatide), and Zepbound (tirzepatide).

Pages:
- `/home/user/workspace/insuranceglp1/aetna.html`
- `/home/user/workspace/insuranceglp1/unitedhealthcare.html`
- `/home/user/workspace/insuranceglp1/bcbs.html`

The "As of [Month YYYY]" datestamp at the top of each page must be updated to reflect the current quarter. Site style matches index.html (DM Sans + Source Serif, teal #0d9488 primary, white background). GA4 tag: G-XJ10VYEBLD.

---

## Refresh Procedure (step by step)

### Step 1: Research current formulary status

For each carrier, search the web for updated formulary information. Key queries to run:

**Aetna:**
- "Aetna formulary Ozempic Wegovy Mounjaro Zepbound [current year] prior authorization"
- "Aetna CVS Health GLP-1 weight loss coverage changes [current quarter]"
- Check: https://www.aetna.com/employers-organizations/glp1-benefits-coverage.html
- Check: Aetna public Clinical Policy Bulletins at aetna.com (provider section, Pharmacy Criteria)

**UnitedHealthcare:**
- "UnitedHealthcare UHC OptumRx Ozempic Mounjaro Wegovy Zepbound formulary [current year]"
- Check: https://www.uhcprovider.com/en/prior-auth-advance-notification/prior-auth-specialty-drugs/prior-auth-pharmacy-medical-necessity.html
- Download latest PA criteria PDFs from uhcprovider.com for diabetes GLP-1s and weight-loss GLP-1s

**BCBS:**
- "Anthem Blue Cross Blue Shield Ozempic Wegovy Mounjaro Zepbound formulary [current year]"
- "BCBS Federal Employee Program FEP GLP-1 coverage [current year]"
- "BCBS Massachusetts Blue Cross GLP-1 obesity weight loss [current year]"
- Check: https://www.fepblue.org/pharmacy/prescriptions
- Check: https://www.anthem.com/pharmacy-information/drug-list-formulary

**Universal:**
- "GoodRx Ozempic insurance coverage [current quarter]" — https://www.goodrx.com/ozempic/insurance-coverage
- "Word and Brown GLP-1 carrier coverage update [current year]" — https://www.wordandbrown.com/NewsPost/Weight-Loss-Drugs-(GLP-1)-Coverage
- Novo Nordisk formulary updates: https://www.novocare.com
- Eli Lilly formulary updates: https://www.lillydirect.com

### Step 2: Identify what changed

For each carrier and each medication, note any changes to:
1. Coverage status (covered / varies / not covered)
2. Formulary tier (Tier 2, 3, specialty, excluded)
3. Prior authorization requirements (new criteria, step therapy changes)
4. Out-of-pocket cost ranges (update if list prices changed significantly)
5. State-specific changes (new state mandates, affiliate policy changes)

### Step 3: Update each HTML file

For each of the three pages:

1. Update the "As of [Month YYYY]" badge at the top — use the format "As of [Month YYYY]" (e.g., "As of August 2026")
2. Update the `dateModified` in the JSON-LD schema to the new date
3. Update any coverage status badges (Generally Covered / Varies by Plan / Often Excluded / Employer-Dependent)
4. Update the 4-cell data grids (Coverage Status, Formulary Tier, Prior Auth, OOP cost)
5. Update the prose paragraphs with new sourced information — include inline hyperlinks to the sources
6. Update the Sources section at the bottom with links to new references
7. Update the BCBS affiliate comparison table if any rows changed
8. If new states gained or lost coverage mandates, update the FAQ answers

### Step 4: Update sitemap.xml

Update the `<lastmod>` date for all three carrier URLs:
```xml
<lastmod>YYYY-MM-DD</lastmod>
```

### Step 5: Git commit and push

```bash
cd /home/user/workspace/insuranceglp1
git add -A
git commit -m "SEO: Quarterly carrier page refresh — [Month YYYY] — Aetna/UHC/BCBS formulary update"
git push origin master
```

### Step 6: Verify deployment

Wait 90 seconds for GitHub Pages to deploy, then verify HTTP 200:
- curl -I https://www.insuranceglp1.com/aetna.html
- curl -I https://www.insuranceglp1.com/unitedhealthcare.html
- curl -I https://www.insuranceglp1.com/bcbs.html

### Step 7: Send notification

Send notification with title: "insuranceglp1 carrier pages refreshed — [Q1/Q2/Q3/Q4 YYYY]"

Notification body should list:
- What changed for Aetna (coverage status changes, new PA criteria, tier changes)
- What changed for UnitedHealthcare
- What changed for BCBS (which affiliates, which medications)
- Any new carriers to consider adding (Cigna, Humana, Kaiser)
- Next refresh date

---

## Key source URLs to check each quarter

| Source | URL | What to check |
|--------|-----|---------------|
| Aetna formulary search | https://www.aetna.com/dsepublic/#/contentPage?page=drugSearchLanding | Ozempic, Wegovy, Mounjaro, Zepbound |
| Aetna GLP-1 employer page | https://www.aetna.com/employers-organizations/glp1-benefits-coverage.html | Policy announcements |
| Aetna PA criteria | https://www.aetna.com (provider > pharmacy criteria) | PA requirement updates |
| UHC Provider PA | https://www.uhcprovider.com/en/prior-auth-advance-notification/prior-auth-specialty-drugs/ | Weight loss and diabetes PA criteria |
| UHC pharmacy update | https://www.uhcprovider.com/content/dam/provider/docs/public/resources/pharmacy/COMM-Pharmacy-Update-Prior-Auth-and-Coverage-Criteria.pdf | Quarterly coverage changes |
| FEP Blue formulary | https://www.fepblue.org/pharmacy/prescriptions | FEP coverage changes |
| Anthem drug lists | https://www.anthem.com/pharmacy-information/drug-list-formulary | State-by-state formularies |
| BCBS MA provider updates | https://provider.bluecrossma.com | GLP-1 policy changes |
| Word & Brown summary | https://www.wordandbrown.com/NewsPost/Weight-Loss-Drugs-(GLP-1)-Coverage | Multi-carrier CA/NV summary |
| NovoCare | https://www.novocare.com/eligibility/psp.html | Savings program changes |
| Lilly Direct | https://www.lillydirect.com | Savings program changes |
| GoodRx coverage | https://www.goodrx.com/ozempic/insurance-coverage | Consumer-facing coverage data |
| CMS GLP-1 info | https://www.cms.gov/medicare/coverage/prescription-drug-coverage/medicare-glp-1-bridge | Medicare coverage changes |

---

## NDC codes for specific pharmacy inquiries

- Ozempic (semaglutide): NDC 0169-4060
- Wegovy (semaglutide): NDC 0169-4550
- Mounjaro (tirzepatide): NDC 0002-1436
- Zepbound (tirzepatide): NDC 0002-1453

---

## Brand compliance reminders

- No emojis, no exclamation points
- All 4 meds (Ozempic, Wegovy, Mounjaro, Zepbound) named on each page
- "Created by" — never "Curated by"
- Cite GoodRx, carrier formulary PDFs, CMS.gov, novocare.com, lillydirect.com with inline hyperlinks
- "As of [Month YYYY]" datestamp format
- Hard disclaimer: "Coverage varies by plan. This information is a summary of publicly-disclosed formulary information as of the date above. Always confirm with your insurer."
- Footer: "Not medical advice. Always consult a licensed healthcare provider."

---

## Adding future carriers

To add a new carrier (e.g., Cigna, Humana, Kaiser), create a new HTML file following the same structure as aetna.html:
1. Copy aetna.html as a template
2. Update slug, canonical URL, Open Graph, and JSON-LD
3. Research that carrier's formulary using the same research methodology
4. Add the URL to sitemap.xml with priority 0.9
5. Add a footer link in index.html, aetna.html, unitedhealthcare.html, and bcbs.html
6. Add the carrier to this cron task's Step 1 research list

---

*This cron specification was created May 2026 as part of SEO #3 (carrier-specific coverage pages). Next scheduled run: August 1, 2026 at 07:00 UTC.*
