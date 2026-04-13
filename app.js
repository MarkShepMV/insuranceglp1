/* ============================================
   InsuranceGLP1.com — App Logic
   ============================================ */

// State
let selections = {
  insuranceType: null,
  provider: null,
  medication: null,
  reason: null
};

// Medication display names
const medNames = {
  ozempic: 'Ozempic',
  wegovy: 'Wegovy',
  mounjaro: 'Mounjaro',
  zepbound: 'Zepbound',
  rybelsus: 'Rybelsus',
  saxenda: 'Saxenda',
  trulicity: 'Trulicity'
};

const medGeneric = {
  ozempic: 'semaglutide',
  wegovy: 'semaglutide',
  mounjaro: 'tirzepatide',
  zepbound: 'tirzepatide',
  rybelsus: 'oral semaglutide',
  saxenda: 'liraglutide',
  trulicity: 'dulaglutide'
};

// Whether a medication is for weight loss
const isWeightLossMed = {
  ozempic: false,
  wegovy: true,
  mounjaro: false,
  zepbound: true,
  rybelsus: false,
  saxenda: true,
  trulicity: false
};

// Manufacturer info
const medManufacturer = {
  ozempic: 'novo',
  wegovy: 'novo',
  mounjaro: 'lilly',
  zepbound: 'lilly',
  rybelsus: 'novo',
  saxenda: 'novo',
  trulicity: 'lilly'
};

// Provider display names
const providerNames = {
  aetna: 'Aetna',
  bcbs: 'Anthem / Blue Cross Blue Shield',
  cigna: 'Cigna',
  uhc: 'UnitedHealthcare',
  kaiser: 'Kaiser Permanente',
  humana: 'Humana',
  centene: 'Centene / Ambetter',
  oscar: 'Oscar Health',
  molina: 'Molina Healthcare',
  other: 'your insurer'
};

// US States for Medicaid
const usStates = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming','DC'
];

// ============================================
// Dark mode toggle
// ============================================
(function () {
  const t = document.querySelector('[data-theme-toggle]');
  const r = document.documentElement;
  let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  r.setAttribute('data-theme', d);
  if (t) {
    updateToggleIcon(t, d);
    t.addEventListener('click', () => {
      d = d === 'dark' ? 'light' : 'dark';
      r.setAttribute('data-theme', d);
      t.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode');
      updateToggleIcon(t, d);
    });
  }
})();

function updateToggleIcon(btn, mode) {
  btn.innerHTML = mode === 'dark'
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

// ============================================
// Step Navigation
// ============================================
function showStep(stepNum) {
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
  const step = document.getElementById(stepNum === 5 ? 'resultsStep' : `step${stepNum}`);
  if (step) step.classList.add('active');

  // Update progress bar
  const pct = Math.min(((stepNum - 1) / 4) * 100, 100);
  document.getElementById('progressFill').style.width = pct + '%';

  // Update progress step indicators
  document.querySelectorAll('.progress-step').forEach(ps => {
    const sn = parseInt(ps.dataset.step);
    ps.classList.remove('active', 'completed');
    if (sn < stepNum) ps.classList.add('completed');
    else if (sn === stepNum) ps.classList.add('active');
  });

  // Smooth scroll to wizard
  const wizardSection = document.getElementById('wizard');
  wizardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deselectSiblings(card) {
  card.closest('.card-grid, .state-grid').querySelectorAll('.option-card, .state-btn').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
}

// ============================================
// Step 1: Insurance Type
// ============================================
function selectInsuranceType(card) {
  deselectSiblings(card);
  selections.insuranceType = card.dataset.value;
  selections.provider = null;

  setTimeout(() => {
    if (selections.insuranceType === 'none') {
      // Skip to step 3 for no-insurance, then go straight to results
      showStep(3);
    } else if (selections.insuranceType === 'medicare') {
      // Skip provider, go to medication
      selections.provider = 'medicare';
      showStep(3);
    } else {
      buildProviderStep();
      showStep(2);
    }
  }, 250);
}

// ============================================
// Step 2: Provider
// ============================================
function buildProviderStep() {
  const container = document.getElementById('providerContent');
  const type = selections.insuranceType;

  if (type === 'medicaid') {
    document.getElementById('step2Title').textContent = 'What state are you in?';
    let html = '<div class="state-grid">';
    usStates.forEach(state => {
      html += `<button class="state-btn" onclick="selectState(this, '${state}')">${state}</button>`;
    });
    html += '</div>';
    container.innerHTML = html;
  } else if (type === 'military') {
    document.getElementById('step2Title').textContent = 'Select your TRICARE plan';
    container.innerHTML = `
      <div class="card-grid cards-2" style="max-width:480px; margin:0 auto;">
        <button class="option-card" data-value="tricare-prime" onclick="selectProvider(this)">
          <span class="card-label">TRICARE Prime</span>
        </button>
        <button class="option-card" data-value="tricare-select" onclick="selectProvider(this)">
          <span class="card-label">TRICARE Select</span>
        </button>
        <button class="option-card" data-value="tricare-reserve" onclick="selectProvider(this)">
          <span class="card-label">TRICARE Reserve Select</span>
        </button>
        <button class="option-card" data-value="tricare-other" onclick="selectProvider(this)">
          <span class="card-label">Other TRICARE</span>
        </button>
      </div>
    `;
  } else {
    document.getElementById('step2Title').textContent = 'Who is your insurance provider?';
    container.innerHTML = `
      <div class="provider-select-wrap">
        <select class="provider-select" id="providerSelect" onchange="onProviderSelect()">
          <option value="">Select your provider...</option>
          <option value="aetna">Aetna</option>
          <option value="bcbs">Anthem / Blue Cross Blue Shield</option>
          <option value="cigna">Cigna</option>
          <option value="uhc">UnitedHealthcare (UHC/OptumRx)</option>
          <option value="kaiser">Kaiser Permanente</option>
          <option value="humana">Humana</option>
          <option value="centene">Centene / Ambetter</option>
          <option value="oscar">Oscar Health</option>
          <option value="molina">Molina Healthcare</option>
          <option value="other">Other</option>
        </select>
      </div>
    `;
  }
}

function onProviderSelect() {
  const val = document.getElementById('providerSelect').value;
  if (val) {
    selections.provider = val;
    setTimeout(() => showStep(3), 250);
  }
}

function selectProvider(card) {
  deselectSiblings(card);
  selections.provider = card.dataset.value;
  setTimeout(() => showStep(3), 250);
}

function selectState(btn, state) {
  document.querySelectorAll('.state-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selections.provider = state;
  setTimeout(() => showStep(3), 250);
}

// ============================================
// Step 3: Medication
// ============================================
function selectMedication(card) {
  deselectSiblings(card);
  selections.medication = card.dataset.value;

  if (selections.insuranceType === 'none') {
    // Skip reason, go straight to results
    selections.reason = 'any';
    setTimeout(() => {
      showResults();
      showStep(5);
    }, 250);
  } else {
    setTimeout(() => showStep(4), 250);
  }
}

// ============================================
// Step 4: Reason
// ============================================
function selectReason(card) {
  deselectSiblings(card);
  selections.reason = card.dataset.value;
  setTimeout(() => {
    showResults();
    showStep(5);
  }, 250);
}

// ============================================
// Coverage Logic
// ============================================
function getCoverage() {
  const { insuranceType, provider, medication, reason } = selections;
  const wlMed = isWeightLossMed[medication];

  // No insurance
  if (insuranceType === 'none') {
    return {
      status: 'blue',
      label: 'Alternative Options Available',
      detail: `Without insurance, ${medNames[medication]} typically costs $900–$1,300/month at retail. However, DTC telehealth providers and manufacturer programs can significantly reduce costs.`,
      note: ''
    };
  }

  // Diabetes medications + diabetes diagnosis = GREEN everywhere
  if (!wlMed && reason === 'diabetes') {
    let providerLabel = getProviderLabel();
    return {
      status: 'green',
      label: 'Likely Covered',
      detail: `Most ${providerLabel} plans cover ${medNames[medication]} for Type 2 diabetes. Prior authorization is typically required.`,
      note: 'Diabetes GLP-1 medications are generally well-covered across all major insurers when prescribed for a diabetes diagnosis.'
    };
  }

  // Diabetes medications + other reasons
  if (!wlMed && (reason === 'obesity' || reason === 'overweight')) {
    let providerLabel = getProviderLabel();
    return {
      status: 'yellow',
      label: 'Coverage Varies',
      detail: `${medNames[medication]} is FDA-approved for diabetes, not weight loss. Coverage for off-label use depends on your specific ${providerLabel} plan. Many plans require a diabetes diagnosis for coverage.`,
      note: 'Your doctor may need to document additional clinical reasons for prescribing this medication.'
    };
  }

  if (!wlMed && reason === 'cardiovascular') {
    let providerLabel = getProviderLabel();
    return {
      status: 'yellow',
      label: 'Coverage Varies',
      detail: `Coverage for ${medNames[medication]} for cardiovascular risk reduction depends on your specific ${providerLabel} plan. Some plans cover this indication, especially with supporting clinical documentation.`,
      note: 'Ask your doctor about documenting the cardiovascular benefit when requesting prior authorization.'
    };
  }

  if (!wlMed && (reason === 'other' || reason === 'any')) {
    let providerLabel = getProviderLabel();
    return {
      status: 'yellow',
      label: 'Coverage Varies',
      detail: `Coverage for ${medNames[medication]} depends on the specific indication and your ${providerLabel} plan details.`,
      note: ''
    };
  }

  // Weight loss medications
  if (wlMed) {
    // Medicare
    if (insuranceType === 'medicare') {
      return {
        status: 'red',
        label: 'Likely Not Covered',
        detail: `Medicare does not currently cover ${medNames[medication]} for weight loss. A pilot program for weight-loss GLP-1 coverage may begin in July 2026.`,
        note: 'Medicare Part D only covers GLP-1 medications for Type 2 diabetes, not for weight loss alone.'
      };
    }

    // TRICARE
    if (insuranceType === 'military') {
      if (reason === 'diabetes') {
        return {
          status: 'green',
          label: 'Likely Covered',
          detail: `TRICARE generally covers ${medNames[medication]} with prior authorization. Coverage is typically available for eligible beneficiaries.`,
          note: ''
        };
      }
      return {
        status: 'green',
        label: 'Likely Covered',
        detail: `TRICARE covers ${medNames[medication]} for weight management with prior authorization. You'll need to meet specific BMI and clinical criteria.`,
        note: 'TRICARE has maintained GLP-1 weight loss coverage, unlike many commercial insurers.'
      };
    }

    // Medicaid
    if (insuranceType === 'medicaid') {
      if (provider === 'California') {
        return {
          status: 'red',
          label: 'Likely Not Covered',
          detail: `California Medicaid (Medi-Cal) dropped coverage for ${medNames[medication]} for weight loss starting January 2026.`,
          note: 'California is one of several states that have restricted GLP-1 weight-loss coverage under Medicaid due to budget pressures.'
        };
      }
      if (reason === 'overweight') {
        return {
          status: 'yellow',
          label: 'Coverage Varies',
          detail: `Medicaid coverage for ${medNames[medication]} for overweight with health conditions varies by state. ${provider} Medicaid may have stricter requirements than for obesity (BMI 30+).`,
          note: 'Contact your state Medicaid office or managed care plan for specific coverage criteria.'
        };
      }
      return {
        status: 'yellow',
        label: 'Coverage Varies',
        detail: `Medicaid coverage for ${medNames[medication]} for weight loss varies by state. ${provider} Medicaid may or may not cover this indication — policies change frequently.`,
        note: 'Contact your state Medicaid office or managed care plan for the latest coverage details.'
      };
    }

    // Commercial / ACA — Weight Loss Meds
    if (reason === 'obesity' || reason === 'overweight' || reason === 'other' || reason === 'any') {
      // Kaiser — mostly excluded
      if (provider === 'kaiser') {
        return {
          status: 'red',
          label: 'Likely Not Covered',
          detail: `Most Kaiser Permanente regions do not cover ${medNames[medication]} for weight loss in 2026. Kaiser has been among the most restrictive insurers for GLP-1 weight-loss coverage.`,
          note: 'Check with your specific Kaiser region, as policies can vary.'
        };
      }

      // Overweight with conditions is stricter
      if (reason === 'overweight') {
        return {
          status: 'yellow',
          label: 'Coverage Varies',
          detail: `Coverage for ${medNames[medication]} for overweight with health conditions (BMI 27–29.9) depends on your specific ${getProviderLabel()} plan. Requirements are typically stricter than for obesity (BMI 30+), and many plans have added exclusions in 2026.`,
          note: 'Documentation of comorbidities (hypertension, dyslipidemia, sleep apnea) strengthens your prior authorization request.'
        };
      }

      // Main commercial weight-loss coverage
      let providerLabel = getProviderLabel();
      return {
        status: 'yellow',
        label: 'Coverage Varies',
        detail: `Coverage for ${medNames[medication]} for weight loss depends on your specific ${providerLabel} plan. Many employer and ACA plans have restricted or dropped GLP-1 weight-loss coverage in 2026. Prior authorization is required, and some plans now exclude this class entirely for weight management.`,
        note: reason === 'obesity'
          ? '41 million people lost Wegovy coverage in 2026 as insurers pulled back from weight-loss GLP-1 coverage.'
          : ''
      };
    }

    // Weight loss med + diabetes reason
    if (reason === 'diabetes') {
      let providerLabel = getProviderLabel();
      return {
        status: 'yellow',
        label: 'Coverage Varies',
        detail: `${medNames[medication]} is FDA-approved for weight loss, not diabetes. Your insurer may prefer a diabetes-specific medication like Ozempic or Mounjaro. Talk to your doctor about the best option for your ${providerLabel} plan.`,
        note: 'Your doctor may be able to prescribe a diabetes-approved version of the same drug class.'
      };
    }

    // Weight loss med + cardiovascular
    if (reason === 'cardiovascular') {
      let providerLabel = getProviderLabel();
      return {
        status: 'yellow',
        label: 'Coverage Varies',
        detail: `Coverage for ${medNames[medication]} for cardiovascular risk reduction is plan-dependent. Some ${providerLabel} plans may cover this with strong clinical documentation.`,
        note: ''
      };
    }
  }

  // Fallback
  return {
    status: 'yellow',
    label: 'Coverage Varies',
    detail: `Coverage depends on your specific plan details. Contact your insurance provider for the most accurate information about ${medNames[medication]}.`,
    note: ''
  };
}

function getProviderLabel() {
  const { insuranceType, provider } = selections;
  if (insuranceType === 'medicare') return 'Medicare';
  if (insuranceType === 'military') return 'TRICARE';
  if (insuranceType === 'medicaid') return provider + ' Medicaid';
  return providerNames[provider] || 'your insurer';
}

// ============================================
// Render Results
// ============================================
function showResults() {
  const coverage = getCoverage();
  const { medication, insuranceType } = selections;
  const manufacturer = medManufacturer[medication];

  const iconSvgs = {
    green: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    yellow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
    red: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
    blue: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
  };

  let html = `
    <div class="results-card">
      <div class="results-header">
        <div class="results-icon ${coverage.status}">${iconSvgs[coverage.status]}</div>
        <div>
          <div class="results-status ${coverage.status}">${coverage.label}</div>
          <p class="results-detail">${coverage.detail}</p>
          ${coverage.note ? `<p class="results-detail" style="margin-top: var(--space-2); font-size: var(--text-xs); font-style: italic;">${coverage.note}</p>` : ''}
        </div>
      </div>
      <div class="results-body">
        <div class="results-divider"></div>
  `;

  // What to do next
  if (insuranceType !== 'none') {
    html += `
        <h3 class="results-section-title">What to Do Next</h3>
        <p class="results-detail" style="margin-bottom: var(--space-3);">Call the number on your insurance card and ask:</p>
        <ul class="results-list">
          <li>"Is ${medNames[medication]} on my plan's formulary?"</li>
          <li>"Does my plan require prior authorization for ${medNames[medication]}?"</li>
          <li>"What tier is ${medNames[medication]} on, and what is my copay?"</li>
        </ul>
        <div class="results-divider"></div>
    `;
  }

  // Estimated Costs
  html += `
        <h3 class="results-section-title">Estimated Monthly Costs</h3>
        <div class="cost-grid">
          <div class="cost-item">
            <div class="cost-label">With Insurance</div>
            <div class="cost-value">$25–$150</div>
          </div>
          <div class="cost-item">
            <div class="cost-label">Without Insurance</div>
            <div class="cost-value">$900–$1,300</div>
          </div>
          <div class="cost-item">
            <div class="cost-label">DTC / Telehealth</div>
            <div class="cost-value">$149–$500</div>
          </div>
        </div>
  `;

  // Savings programs
  if (coverage.status === 'red' || coverage.status === 'yellow' || coverage.status === 'blue') {
    const savingsInfo = manufacturer === 'novo'
      ? `<strong>Novo Nordisk NovoCare:</strong> Savings cards and patient assistance for ${medNames[medication]}. Visit <a href="https://www.novocare.com" target="_blank" rel="noopener noreferrer">NovoCare.com</a> to check eligibility.`
      : `<strong>Eli Lilly Cares:</strong> Savings cards and patient assistance for ${medNames[medication]}. Visit <a href="https://www.lillycares.com" target="_blank" rel="noopener noreferrer">LillyCares.com</a> to check eligibility.`;

    html += `
        <div class="savings-box">
          <div class="savings-title">Manufacturer Savings Programs</div>
          <p class="savings-text">${savingsInfo}</p>
        </div>
    `;
  }

  // CTA
  html += `
        <div class="results-actions">
          <a href="https://www.glp1maps.com" target="_blank" rel="noopener noreferrer" class="btn-primary">
            Find a GLP-1 Provider Near You
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <button class="btn-secondary" onclick="startOver()">
            Start Over
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('resultsContainer').innerHTML = html;

  // Show email section and monetization sections
  document.getElementById('emailSection').style.display = 'block';
  document.getElementById('telehealth-section').style.display = 'block';
  document.getElementById('savings-section').style.display = 'block';
  document.getElementById('rx-card-section').style.display = 'block';
}

// ============================================
// Start Over
// ============================================
function startOver() {
  selections = { insuranceType: null, provider: null, medication: null, reason: null };
  document.querySelectorAll('.option-card, .state-btn').forEach(c => c.classList.remove('selected'));
  document.getElementById('emailSection').style.display = 'none';
  document.getElementById('telehealth-section').style.display = 'none';
  document.getElementById('savings-section').style.display = 'none';
  document.getElementById('rx-card-section').style.display = 'none';
  document.getElementById('progressFill').style.width = '0%';
  document.querySelectorAll('.progress-step').forEach(ps => {
    ps.classList.remove('active', 'completed');
  });
  document.querySelector('.progress-step[data-step="1"]').classList.add('active');
  showStep(1);
}

// ============================================
// Email form
// ============================================
function handleEmailSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  // In-memory store (no localStorage in sandbox)
  window.__emailCapture = window.__emailCapture || [];
  window.__emailCapture.push({ email, selections: { ...selections }, timestamp: Date.now() });

  document.getElementById('emailForm').style.display = 'none';
  document.getElementById('emailSuccess').style.display = 'block';
}
