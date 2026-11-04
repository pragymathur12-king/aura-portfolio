/**
 * AURA // PRODUCT INTELLIGENCE LAB — CORE LOGIC ENGINES
 * Deterministic client-side simulation engines for Loadvanta, ChargeDossier,
 * and Product Strategy Prioritization.
 *
 * All simulation data is synthetic and deterministic.
 */

// =========================================================
// 1. GLOBAL INTERSECTION OBSERVER (REVEAL ANIMATIONS)
// =========================================================
(function initReveals() {
  const supportsIO = typeof IntersectionObserver !== 'undefined';
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (!revealEls.length) return;

  if (reduceMotion || !supportsIO) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
  );

  revealEls.forEach((el) => io.observe(el));
})();

// =========================================================
// 2. HERO CONSOLE & HUD CONTROLS
// =========================================================
(function initHeroConsole() {
  const enterBtn = document.getElementById('enterLabBtn');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      const target = document.getElementById('lab-stations') || document.getElementById('station-freight');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Station navigation buttons
  const navBtns = document.querySelectorAll('[data-target-station]');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const stationId = btn.getAttribute('data-target-station');
      const el = document.getElementById(stationId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// =========================================================
// 3. STATION ONE: FREIGHT INTELLIGENCE ENGINE (LOADVANTA)
// =========================================================
(function initStationFreight() {
  const container = document.getElementById('station-freight');
  if (!container) return;

  // Synthetic Dataset: 9 Real-world modeled synthetic rate confirmations
  const FREIGHT_DOCS = [
    {
      id: 'DOC-801',
      carrier: 'Apex Freight Logistics',
      loadRef: 'LD-99210-CHI',
      docType: 'Broker Rate Confirmation (Digital PDF)',
      origin: 'Chicago, IL (ORD Hub)',
      destination: 'Atlanta, GA (ATL DC)',
      cargoType: 'Dry Van (53ft)',
      weightLbs: 41200,
      rateUsd: 2450,
      deliveryDate: '2026-11-08',
      accessorialsDisclosed: true,
      extractionConfidence: 94,
      requiredFieldsComplete: true,
      missingFields: [],
      validationErrors: []
    },
    {
      id: 'DOC-802',
      carrier: 'Blue Ridge Cold Chain',
      loadRef: 'LD-88341-DAL',
      docType: 'Broker Rate Confirmation (Scan)',
      origin: 'Dallas, TX (DFW Depot)',
      destination: 'Denver, CO (DEN Yard)',
      cargoType: 'Reefer (-10°F Frozen)',
      weightLbs: 38500,
      rateUsd: 3100,
      deliveryDate: '2026-11-09',
      accessorialsDisclosed: true,
      extractionConfidence: 82, // Below 85% default
      requiredFieldsComplete: true,
      missingFields: [],
      validationErrors: []
    },
    {
      id: 'DOC-803',
      carrier: 'Cascade Heavy Haul',
      loadRef: 'LD-77192-SEA',
      docType: 'Broker Rate Confirmation (PDF)',
      origin: 'Seattle, WA',
      destination: 'Salt Lake City, UT',
      cargoType: 'Flatbed (Oversize Steel)',
      weightLbs: 46800,
      rateUsd: null, // MISSING MANDATORY FIELD
      deliveryDate: '2026-11-10',
      accessorialsDisclosed: false,
      extractionConfidence: 96, // High confidence, but MISSING RATE!
      requiredFieldsComplete: false,
      missingFields: ['Agreed Total Linehaul Rate ($)'],
      validationErrors: ['Mandatory billing field missing: Rate is null/zero']
    },
    {
      id: 'DOC-804',
      carrier: 'Desert Sun Transport',
      loadRef: 'LD-66384-LAX',
      docType: 'Broker Rate Confirmation (PDF)',
      origin: 'Los Angeles, CA (Port Terminal)',
      destination: 'Phoenix, AZ (Sky Harbor Dist)',
      cargoType: 'Dry Van (Palletized Goods)',
      weightLbs: 29400,
      rateUsd: 1350,
      deliveryDate: '2026-11-07',
      accessorialsDisclosed: true,
      extractionConfidence: 89,
      requiredFieldsComplete: true,
      missingFields: [],
      validationErrors: []
    },
    {
      id: 'DOC-805',
      carrier: 'Evergreen Produce Express',
      loadRef: 'LD-55201-MIA',
      docType: 'Broker Rate Confirmation (Fax OCR)',
      origin: 'Miami, FL (Fruit Terminal)',
      destination: 'Charlotte, NC (Regional Hub)',
      cargoType: 'Reefer (Fresh Citrus)',
      weightLbs: 42100,
      rateUsd: 2800,
      deliveryDate: null, // MISSING APPOINTMENT WINDOW
      accessorialsDisclosed: false,
      extractionConfidence: 78,
      requiredFieldsComplete: false,
      missingFields: ['Consignee Delivery Appointment Date/Time'],
      validationErrors: ['Missing critical delivery scheduling window']
    },
    {
      id: 'DOC-806',
      carrier: 'Frontier Specialized Carriers',
      loadRef: 'LD-44119-HOU',
      docType: 'Broker Rate Confirmation (Scan)',
      origin: 'Houston, TX (Petro Corridor)',
      destination: 'Memphis, TN (Crossdock)',
      cargoType: 'Step Deck (Piping & Valves)',
      weightLbs: 44000,
      rateUsd: 2950,
      deliveryDate: '2026-11-11',
      accessorialsDisclosed: true,
      extractionConfidence: 64, // Low confidence
      requiredFieldsComplete: true,
      missingFields: [],
      validationErrors: []
    },
    {
      id: 'DOC-807',
      carrier: 'Great Lakes Freightway',
      loadRef: 'LD-33902-EWR',
      docType: 'Broker Rate Confirmation (PDF)',
      origin: 'Newark, NJ',
      destination: 'Columbus, OH',
      cargoType: 'Dry Van (Retail Apparel)',
      weightLbs: 35000,
      rateUsd: 1950,
      deliveryDate: '2026-11-08',
      accessorialsDisclosed: true,
      extractionConfidence: 91, // High confidence, but CONTRADICTION!
      requiredFieldsComplete: true,
      missingFields: [],
      validationErrors: ['Contradiction: Header specifies $0 Accessorials, but line-item 3 details $150 detention fee']
    },
    {
      id: 'DOC-808',
      carrier: 'Midwest Corridor Express',
      loadRef: 'LD-22871-IND',
      docType: 'Broker Rate Confirmation (EDI/PDF)',
      origin: 'Indianapolis, IN (Assembly Hub)',
      destination: 'Detroit, MI (Auto Plant)',
      cargoType: 'Dry Van (Automotive Assemblies)',
      weightLbs: 39800,
      rateUsd: 1420,
      deliveryDate: '2026-11-07',
      accessorialsDisclosed: true,
      extractionConfidence: 98,
      requiredFieldsComplete: true,
      missingFields: [],
      validationErrors: []
    },
    {
      id: 'DOC-809',
      carrier: 'Keystone Logistics Partners',
      loadRef: 'LD-11450-KCM',
      docType: 'Broker Rate Confirmation (Digital PDF)',
      origin: 'Kansas City, MO (Rail Yard)',
      destination: 'Nashville, TN (Logistics Hub)',
      cargoType: 'Power Only (Trailer Repositioning)',
      weightLbs: 22000,
      rateUsd: 1850,
      deliveryDate: '2026-11-09',
      accessorialsDisclosed: true,
      extractionConfidence: 79,
      requiredFieldsComplete: true,
      missingFields: [],
      validationErrors: []
    }
  ];

  let selectedDocId = 'DOC-801';
  let activeThreshold = 85;

  const docSelectEl = document.getElementById('freightDocSelect');
  const thresholdSlider = document.getElementById('freightThresholdSlider');
  const thresholdValEl = document.getElementById('freightThresholdVal');
  const runBtn = document.getElementById('runFreightPipelineBtn');

  // DOM Output Elements
  const countAutoEl = document.getElementById('countFreightAuto');
  const countReviewEl = document.getElementById('countFreightReview');
  const countBlockedEl = document.getElementById('countFreightBlocked');

  const docIdBadge = document.getElementById('fDocIdBadge');
  const docCarrierEl = document.getElementById('fDocCarrier');
  const docOriginEl = document.getElementById('fDocOrigin');
  const docDestEl = document.getElementById('fDocDest');
  const docRateEl = document.getElementById('fDocRate');
  const docWeightEl = document.getElementById('fDocWeight');
  const docDateEl = document.getElementById('fDocDate');
  const docConfidenceBadge = document.getElementById('fDocConfidenceBadge');
  const docStatusBadge = document.getElementById('fDocStatusBadge');
  const docDecisionNote = document.getElementById('fDocDecisionNote');

  // Reasoning Elements
  const whyProblemEl = document.getElementById('fWhyProblem');
  const whyRuleEl = document.getElementById('fWhyRule');
  const whyTradeoffEl = document.getElementById('fWhyTradeoff');

  function evaluateDoc(doc, threshold) {
    // CRITICAL PRODUCT RULE: Missing mandatory field or fatal validation failure can NEVER auto-sync!
    if (!doc.requiredFieldsComplete || doc.missingFields.length > 0 || doc.validationErrors.length > 0) {
      return {
        status: 'BLOCKED',
        label: 'BLOCKED // MANDATORY EXCEPTION',
        theme: 'rose',
        reason: doc.missingFields.length > 0
          ? `Missing mandatory field: "${doc.missingFields.join(', ')}". Loadvanta deterministic guardrails strictly forbid auto-sync when mandatory commercial fields are absent, regardless of extraction confidence (${doc.extractionConfidence}%).`
          : `Validation contradiction detected: ${doc.validationErrors.join(', ')}. Inconsistent accessorial data must be reviewed by broker operations before TMS lock.`
      };
    }

    if (doc.extractionConfidence >= threshold) {
      return {
        status: 'AUTO_SYNC',
        label: 'AUTO-SYNC AUTHORIZED // DIRECT TO TMS',
        theme: 'emerald',
        reason: `All mandatory fields verified present and consistent. Extraction confidence (${doc.extractionConfidence}%) meets or exceeds the active threshold (${threshold}%). Document is authorized for automatic synchronization with zero manual touchpoints.`
      };
    }

    return {
      status: 'MANUAL_REVIEW',
      label: 'MANUAL REVIEW QUEUE // CONFIDENCE DEFICIT',
      theme: 'amber',
      reason: `All mandatory fields are present, but extraction confidence (${doc.extractionConfidence}%) is below the active authorization threshold (${threshold}%). Document is safely routed to the human operator review queue to enforce manual verification before TMS record lock.`
    };
  }

  function updateFleetStats() {
    let autoCount = 0;
    let reviewCount = 0;
    let blockedCount = 0;

    FREIGHT_DOCS.forEach(doc => {
      const res = evaluateDoc(doc, activeThreshold);
      if (res.status === 'AUTO_SYNC') autoCount++;
      else if (res.status === 'MANUAL_REVIEW') reviewCount++;
      else blockedCount++;
    });

    if (countAutoEl) countAutoEl.textContent = autoCount;
    if (countReviewEl) countReviewEl.textContent = reviewCount;
    if (countBlockedEl) countBlockedEl.textContent = blockedCount;
  }

  function renderSelectedDoc() {
    if (docSelectEl && docSelectEl.value) {
      selectedDocId = docSelectEl.value;
    }
    const doc = FREIGHT_DOCS.find(d => d.id === selectedDocId) || FREIGHT_DOCS[0];
    const decision = evaluateDoc(doc, activeThreshold);

    if (docIdBadge) docIdBadge.textContent = `${doc.id} // ${doc.loadRef}`;
    if (docCarrierEl) docCarrierEl.textContent = doc.carrier;
    if (docOriginEl) docOriginEl.textContent = doc.origin;
    if (docDestEl) docDestEl.textContent = doc.destination;
    if (docRateEl) {
      docRateEl.textContent = doc.rateUsd !== null ? `$${doc.rateUsd.toLocaleString()} USD` : 'NULL (MISSING)';
      docRateEl.style.color = doc.rateUsd !== null ? '#F8FAFC' : '#f43f5e';
    }
    if (docWeightEl) docWeightEl.textContent = `${doc.weightLbs.toLocaleString()} lbs (${doc.cargoType})`;
    if (docDateEl) {
      docDateEl.textContent = doc.deliveryDate || 'NOT SPECIFIED (MISSING)';
      docDateEl.style.color = doc.deliveryDate ? '#F8FAFC' : '#f43f5e';
    }

    if (docConfidenceBadge) {
      docConfidenceBadge.textContent = `${doc.extractionConfidence}% Confidence`;
      docConfidenceBadge.className = 'hud-tag ' + (doc.extractionConfidence >= activeThreshold ? 'tag-emerald' : 'tag-amber');
    }

    if (docStatusBadge) {
      docStatusBadge.textContent = decision.label;
      docStatusBadge.className = 'status-pill status-' + decision.theme;
    }

    if (docDecisionNote) {
      docDecisionNote.innerHTML = `<strong>Pipeline Logic:</strong> ${decision.reason}`;
    }

    // Update reasoning explanation panel
    if (whyProblemEl) {
      whyProblemEl.textContent = 'Freight rate confirmations arrive in varied, unstructured PDF formats across broker networks. Without deterministic validation guardrails, automated LLM or OCR extraction risks committing incomplete rates or contradictory accessorial clauses into TMS records, leading to billing exceptions and administrative reconciliation overhead.';
    }
    if (whyRuleEl) {
      whyRuleEl.innerHTML = `
        <strong>Rule 1 (Completeness Guardrail):</strong> If any mandatory field (Rate, Appointment, Route) is null or contradictory, the record is <em>permanently blocked from auto-sync</em>.<br>
        <strong>Rule 2 (Confidence Threshold):</strong> Complete records are only auto-synced if confidence &ge; ${activeThreshold}%. Otherwise routed to human review.
      `;
    }
    if (whyTradeoffEl) {
      whyTradeoffEl.innerHTML = `
        At ${activeThreshold}% threshold, <strong>${countAutoEl ? countAutoEl.textContent : 0} of ${FREIGHT_DOCS.length}</strong> synthetic rate cons auto-sync.
        Raising threshold to 95% eliminates false-positive risk but increases operator queue burden; lowering to 70% accelerates ingest but risks undetected detention/rate misinterpretations.
      `;
    }

    updateFleetStats();
  }

  // Populate Selector if empty
  if (docSelectEl && docSelectEl.options.length <= 1) {
    docSelectEl.innerHTML = '';
    FREIGHT_DOCS.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = `${d.id}: ${d.carrier} (${d.origin.split(' ')[0]} -> ${d.destination.split(' ')[0]})`;
      docSelectEl.appendChild(opt);
    });
    docSelectEl.value = selectedDocId;
  }

  if (docSelectEl) {
    docSelectEl.addEventListener('change', (e) => {
      selectedDocId = e.target.value;
      renderSelectedDoc();
    });
  }

  if (thresholdSlider) {
    thresholdSlider.addEventListener('input', (e) => {
      activeThreshold = parseInt(e.target.value, 10);
      if (thresholdValEl) thresholdValEl.textContent = activeThreshold + '%';
      renderSelectedDoc();
    });
  }

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      // Simulate quick pipeline run animation
      runBtn.classList.add('is-running');
      runBtn.textContent = 'EXECUTING DETERMINISTIC PIPELINE...';
      setTimeout(() => {
        runBtn.classList.remove('is-running');
        runBtn.textContent = 'RERUN PIPELINE';
        renderSelectedDoc();
      }, 250);
    });
  }

  renderSelectedDoc();
})();

// =========================================================
// 4. STATION TWO: DISPUTE INTELLIGENCE ENGINE (CHARGEDOSSIER)
// =========================================================
(function initStationDispute() {
  const container = document.getElementById('station-dispute');
  if (!container) return;

  const DISPUTES = [
    {
      id: 'DSP-1049',
      amount: '$349.00 USD',
      item: 'AeroSound Pro Wireless ANC Headphones & MagSafe Dock',
      reasonCode: 'Reason 4837 (Fraud — No Cardholder Authorization)',
      network: 'Mastercard Opportunity Lab Framework',
      initialEvidence: {
        avsCvv: true,        // 30 pts
        pod: true,           // 35 pts
        termsRefund: true,   // 12 pts
        customerComm: true,  // 15 pts
        deviceIp: true,      // 8 pts
        fatalMismatch: false
      },
      context: 'Full AVS match (Y), CVC match (M), 3DS authenticated, FedEx delivered with matching cardholder signature (E. VANCE). Flawless compelling evidence package meeting Second Presentment standards.'
    },
    {
      id: 'DSP-2081',
      amount: '$295.00 USD',
      item: 'BaristaCraft Precision Burr Coffee Grinder',
      reasonCode: 'Reason 4853 (Goods / Services Not Received)',
      network: 'Mastercard Opportunity Lab Framework',
      initialEvidence: {
        avsCvv: false,
        pod: false, // In transit - missing delivery scan
        termsRefund: true,
        customerComm: false,
        deviceIp: true,
        fatalMismatch: false
      },
      context: 'Carrier tracking confirms shipment is still In Transit (severe blizzard delay). Audit engine catches fatal non-delivery flaw. Operator explicitly rejects dispute to avoid unviable submission and dispute fees.'
    },
    {
      id: 'DSP-3312',
      amount: '$850.00 USD',
      item: 'ErgoLift Pro Motorized Standing Desk (Walnut / White)',
      reasonCode: 'Reason 4837 (Fraud — No Cardholder Authorization)',
      network: 'Mastercard Opportunity Lab Framework',
      initialEvidence: {
        avsCvv: false,
        pod: true,
        termsRefund: false,
        customerComm: false,
        deviceIp: false,
        fatalMismatch: true // Reshipper delivery address mismatch & affidavit
      },
      context: 'Order shipped to Florida freight forwarding warehouse (Bay 4 Forwarding) while billing address was in Austin, Texas. AVS failed (N), 3DS failed, cardholder filed card theft affidavit. Severe fatal contradictions trigger rejection as loss.'
    },
    {
      id: 'DSP-4190',
      amount: '$1,150.00 USD',
      item: 'The Modern Modular Platform Bed Frame (King / Natural)',
      reasonCode: 'Reason 4853 (Goods Not as Described / Defective Merchandise)',
      network: 'Mastercard Opportunity Lab Framework',
      initialEvidence: {
        avsCvv: true,        // Payment auth: 30 pts
        pod: true,           // Carrier delivery & signature: 35 pts
        termsRefund: false,  // Missing published return policy: initially 0 pts
        customerComm: false, // Missing customer support remedy log: initially 0 pts
        deviceIp: true,      // Customer tenure & history: 8 pts
        fatalMismatch: false
      },
      context: 'High-ticket furniture purchase ($1,150). Customer reported cracked bed frame slat. Delivered with signature, but merchant dossier initially lacks published 30-day return/warranty policy clause and formal customer support remedy logs.'
    }
  ];

  let selectedDisputeId = 'DSP-4190';
  let currentEvidence = { ...DISPUTES[3].initialEvidence };

  const disputeSelectEl = document.getElementById('disputeCaseSelect');
  const dAmountEl = document.getElementById('dCaseAmount');
  const dItemEl = document.getElementById('dCaseItem');
  const dReasonEl = document.getElementById('dCaseReason');
  const dContextEl = document.getElementById('dCaseContext');

  const scoreValEl = document.getElementById('dScoreVal');
  const scoreTierEl = document.getElementById('dScoreTierBadge');
  const scoreRecommendationEl = document.getElementById('dScoreRecommendation');
  const scoreInitialComparisonEl = document.getElementById('dInitialComparison');

  // Checkbox inputs
  const chkAvs = document.getElementById('chkAvsCvv');
  const chkPod = document.getElementById('chkPod');
  const chkTerms = document.getElementById('chkTermsRefund');
  const chkComm = document.getElementById('chkCustomerComm');
  const chkDevice = document.getElementById('chkDeviceIp');
  const chkFatal = document.getElementById('chkFatalMismatch');

  const recalculateBtn = document.getElementById('recalcDisputeBtn');
  const resetEvidenceBtn = document.getElementById('resetEvidenceBtn');

  function calculateScore(ev) {
    // Scoring aligned with ChargeDossier deterministic heuristic engine:
    // Payment & Auth: 30 pts | Delivery & Signature: 35 pts | Return Policy: 12 pts | Support Remedy: 15 pts | Account Tenure: 8 pts
    let score = 0;
    if (ev.avsCvv) score += 30;
    if (ev.pod) score += 35;
    if (ev.termsRefund) score += 12;
    if (ev.customerComm) score += 15;
    if (ev.deviceIp) score += 8;
    if (ev.fatalMismatch) score -= 40;

    score = Math.max(0, Math.min(100, score));

    // Threshold boundaries: DSP-3312 = 0 pts; DSP-2081 = 20 pts; DSP-4190 baseline = 73 pts; DSP-1049 = 100 pts
    let tier = 'Tier C (Unviable / High Loss Risk)';
    let tierBadge = 'TIER C // UNVIABLE DEFENSE';
    let theme = 'rose';
    let recommendation = 'Do not submit Second Presentment. The dossier contains fatal contradictions or lacks essential delivery evidence. Submitting will incur representment fees with near-zero probability of recovery.';

    if (score >= 80) {
      tier = 'Tier A (High Readiness // Ready for Second Presentment)';
      tierBadge = 'TIER A // DEFENSE READY';
      theme = 'emerald';
      recommendation = 'Strong evidence package. Complete gateway authentication, carrier proof of delivery, published return terms, and support logs satisfy Second Presentment compelling evidence criteria.';
    } else if (score >= 60) {
      tier = 'Tier B (Moderate Readiness // Remediation Recommended)';
      tierBadge = 'TIER B // REMEDIATION NEEDED';
      theme = 'amber';
      recommendation = 'Moderate defense readiness (73/100). Key merchant disclosure missing (published return policy and support remedy log). Remediation recommended before Second Presentment drafting.';
    }

    return { score, tier, tierBadge, theme, recommendation };
  }

  function renderDispute() {
    if (disputeSelectEl && disputeSelectEl.value && disputeSelectEl.value !== selectedDisputeId) {
      selectedDisputeId = disputeSelectEl.value;
      const d = DISPUTES.find(item => item.id === selectedDisputeId);
      if (d) {
        currentEvidence = { ...d.initialEvidence };
      }
    }
    const dispute = DISPUTES.find(d => d.id === selectedDisputeId) || DISPUTES[3];

    if (dAmountEl) dAmountEl.textContent = dispute.amount;
    if (dItemEl) dItemEl.textContent = dispute.item;
    if (dReasonEl) dReasonEl.textContent = dispute.reasonCode;
    if (dContextEl) dContextEl.textContent = dispute.context;

    // Sync checkboxes with current evidence state
    if (chkAvs) chkAvs.checked = !!currentEvidence.avsCvv;
    if (chkPod) chkPod.checked = !!currentEvidence.pod;
    if (chkTerms) chkTerms.checked = !!currentEvidence.termsRefund;
    if (chkComm) chkComm.checked = !!currentEvidence.customerComm;
    if (chkDevice) chkDevice.checked = !!currentEvidence.deviceIp;
    if (chkFatal) chkFatal.checked = !!currentEvidence.fatalMismatch;

    const currentResult = calculateScore(currentEvidence);
    const initialResult = calculateScore(dispute.initialEvidence);

    if (scoreValEl) {
      scoreValEl.textContent = currentResult.score;
      scoreValEl.className = 'score-number text-' + currentResult.theme;
    }
    if (scoreTierEl) {
      scoreTierEl.textContent = currentResult.tierBadge;
      scoreTierEl.className = 'status-pill status-' + currentResult.theme;
    }
    if (scoreRecommendationEl) {
      scoreRecommendationEl.textContent = currentResult.recommendation;
    }

    if (scoreInitialComparisonEl) {
      const delta = currentResult.score - initialResult.score;
      const deltaText = delta > 0 ? `+${delta}` : `${delta}`;
      scoreInitialComparisonEl.innerHTML = `
        <strong>Baseline Comparison:</strong> Initial Case Score was <strong>${initialResult.score}/100</strong> (${initialResult.tierBadge.split(' ')[0]}).
        Current Remediation Delta: <span style="color: ${delta >= 0 ? '#10b981' : '#f43f5e'}; font-weight:700;">${deltaText} pts</span>.
      `;
    }
  }

  function readCheckboxes() {
    currentEvidence = {
      avsCvv: chkAvs ? chkAvs.checked : false,
      pod: chkPod ? chkPod.checked : false,
      termsRefund: chkTerms ? chkTerms.checked : false,
      customerComm: chkComm ? chkComm.checked : false,
      deviceIp: chkDevice ? chkDevice.checked : false,
      fatalMismatch: chkFatal ? chkFatal.checked : false
    };
  }

  // Populate selector if empty
  if (disputeSelectEl && disputeSelectEl.options.length <= 1) {
    disputeSelectEl.innerHTML = '';
    DISPUTES.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = `${d.id}: ${d.amount} - ${d.item}`;
      disputeSelectEl.appendChild(opt);
    });
    disputeSelectEl.value = selectedDisputeId;
  }

  if (disputeSelectEl) {
    disputeSelectEl.addEventListener('change', (e) => {
      selectedDisputeId = e.target.value;
      const dispute = DISPUTES.find(d => d.id === selectedDisputeId);
      currentEvidence = { ...dispute.initialEvidence };
      renderDispute();
    });
  }

  [chkAvs, chkPod, chkTerms, chkComm, chkDevice, chkFatal].forEach(chk => {
    if (chk) {
      chk.addEventListener('change', () => {
        readCheckboxes();
        renderDispute();
      });
    }
  });

  if (recalculateBtn) {
    recalculateBtn.addEventListener('click', () => {
      readCheckboxes();
      renderDispute();
    });
  }

  if (resetEvidenceBtn) {
    resetEvidenceBtn.addEventListener('click', () => {
      const dispute = DISPUTES.find(d => d.id === selectedDisputeId);
      currentEvidence = { ...dispute.initialEvidence };
      renderDispute();
    });
  }

  renderDispute();
})();

// =========================================================
// 5. STATION THREE: PRODUCT STRATEGY & PRIORITIZATION
// =========================================================
(function initStationStrategy() {
  const container = document.getElementById('station-strategy');
  if (!container) return;

  const INITIATIVES = [
    {
      id: 'INIT-01',
      domain: 'Fintech / ChargeDossier Extension',
      name: 'Dynamic Pre-Checkout Auth Risk Triage',
      desc: 'Move 3DS / KYC identity verification to async background pre-checks during cart review for low-risk returning users.',
      impact: 8,
      confidence: 75,
      effort: 5,
      risk: 2,
      tradeoff: 'Reduces cart abandonment by ~3.2% but requires tighter telemetry alerting on downstream chargeback rates.',
      nextStep: 'A/B test dynamic 3DS step-up on transactions under $250 with a strict 0.45% GMV fraud stop-loss.'
    },
    {
      id: 'INIT-02',
      domain: 'Logistics / Loadvanta Extension',
      name: 'Confidence-Based Rate Con Auto-Sync',
      desc: 'Implement deterministic extraction confidence routing at 94% threshold to auto-sync clean freight documents directly to TMS.',
      impact: 9,
      confidence: 80,
      effort: 6,
      risk: 2,
      tradeoff: 'Eliminates 85% of operator manual entry hours, but risks rare accessorial dispute if broker formats change unannounced.',
      nextStep: 'Deploy shadow-mode ingestion against 500 historic broker PDFs to validate zero rate discrepancies.'
    },
    {
      id: 'INIT-03',
      domain: 'Mobility / Uber Commute Lock Teardown',
      name: 'Commuter Corridor Surge Shield Subscription',
      desc: 'Offer monthly subscription capping peak surge multipliers at 1.2x on pre-registered work commute routes.',
      impact: 7,
      confidence: 60,
      effort: 4,
      risk: 3,
      tradeoff: 'Stabilizes weekly commuter retention by 14% but risks gross margin compression during extreme weather demand spikes.',
      nextStep: 'Run a 60-day pilot on two high-density urban corridors with driver gross hourly earnings floor guarantees.'
    }
  ];

  function calculateScore(item) {
    // Transparent Normalized Prioritization Formula:
    // Score = (Impact * (Confidence / 100)) / (Effort * (1 + Risk * 0.2)) * 100
    const eff = Math.max(1, item.effort);
    const riskFactor = 1 + (item.risk * 0.2);
    const raw = (item.impact * (item.confidence / 100)) / (eff * riskFactor);
    return Math.round(raw * 100 * 10) / 10;
  }

  function renderStrategy() {
    const scored = INITIATIVES.map(init => ({
      ...init,
      score: calculateScore(init)
    }));

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    const cardsContainer = document.getElementById('strategyCardsContainer');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = '';

    scored.forEach((item, index) => {
      const rank = index + 1;
      const rankBadgeClass = rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : 'rank-bronze';

      const card = document.createElement('div');
      card.className = 'strategy-initiative-card reveal is-visible';
      card.innerHTML = `
        <div class="strategy-card-header">
          <div class="rank-badge ${rankBadgeClass}">RANK #${rank}</div>
          <span class="hud-tag tag-cyan">${item.domain}</span>
          <div class="strategy-score-display">
            <span class="score-label">Priority Score</span>
            <span class="score-val">${item.score}</span>
          </div>
        </div>

        <h3 class="strategy-init-title">${item.name}</h3>
        <p class="strategy-init-desc">${item.desc}</p>

        <!-- Interactive Sliders -->
        <div class="strategy-sliders-grid">
          <div class="slider-control-group">
            <div class="slider-label-row">
              <label for="impact-${item.id}">Expected Impact (1-10)</label>
              <span class="slider-val" id="val-impact-${item.id}">${item.impact}</span>
            </div>
            <input type="range" min="1" max="10" value="${item.impact}" class="hud-slider" id="impact-${item.id}" data-id="${item.id}" data-param="impact">
          </div>

          <div class="slider-control-group">
            <div class="slider-label-row">
              <label for="conf-${item.id}">Confidence (10%-100%)</label>
              <span class="slider-val" id="val-conf-${item.id}">${item.confidence}%</span>
            </div>
            <input type="range" min="10" max="100" step="5" value="${item.confidence}" class="hud-slider" id="conf-${item.id}" data-id="${item.id}" data-param="confidence">
          </div>

          <div class="slider-control-group">
            <div class="slider-label-row">
              <label for="eff-${item.id}">Effort (1-10)</label>
              <span class="slider-val" id="val-eff-${item.id}">${item.effort}</span>
            </div>
            <input type="range" min="1" max="10" value="${item.effort}" class="hud-slider" id="eff-${item.id}" data-id="${item.id}" data-param="effort">
          </div>

          <div class="slider-control-group">
            <div class="slider-label-row">
              <label for="risk-${item.id}">Risk / Uncertainty (1-5)</label>
              <span class="slider-val" id="val-risk-${item.id}">${item.risk}</span>
            </div>
            <input type="range" min="1" max="5" value="${item.risk}" class="hud-slider" id="risk-${item.id}" data-id="${item.id}" data-param="risk">
          </div>
        </div>

        <!-- Strategic Trade-Off Breakdown -->
        <div class="strategy-tradeoff-box">
          <div class="tradeoff-item">
            <span class="tradeoff-label">⚖️ Principal Trade-Off:</span>
            <span class="tradeoff-text">${item.tradeoff}</span>
          </div>
          <div class="tradeoff-item" style="margin-top: 8px;">
            <span class="tradeoff-label">🧪 Suggested Validation Step:</span>
            <span class="tradeoff-text">${item.nextStep}</span>
          </div>
        </div>
      `;

      cardsContainer.appendChild(card);
    });

    // Wire up sliders
    const sliders = cardsContainer.querySelectorAll('.hud-slider');
    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const id = e.target.getAttribute('data-id');
        const param = e.target.getAttribute('data-param');
        const val = parseInt(e.target.value, 10);

        const targetInit = INITIATIVES.find(i => i.id === id);
        if (targetInit) {
          targetInit[param] = val;
          renderStrategy();
        }
      });
    });
  }

  renderStrategy();
})();

// =========================================================
// 6. RECRUITER ACCESS MODAL CONTROLLER
// =========================================================
(function initRecruiterAccess() {
  const modal = document.getElementById('recruiterAccessModal');
  const openBtns = document.querySelectorAll('[data-open-recruiter-modal]');
  const closeBtns = document.querySelectorAll('[data-close-recruiter-modal]');

  if (!modal) return;

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('recruiter-modal-backdrop') || e.target.hasAttribute('data-close-recruiter-modal')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();

// =========================================================
// 7. ANIMATED METRICS COUNTERS (ABOUT SECTION)
// =========================================================
(function initCounters() {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counterEls = Array.from(document.querySelectorAll('.metric-value[data-target]'));
  if (!counterEls.length) return;

  const animate = (el, target) => {
    const suffix = el.getAttribute('data-suffix') !== null ? el.getAttribute('data-suffix') : '+';
    if (reduceMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 900;
    const start = performance.now();
    const from = 0;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const value = Math.round(from + (target - from) * easeOutCubic(t));
      el.textContent = `${value}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (typeof IntersectionObserver === 'undefined') {
    counterEls.forEach(el => animate(el, Number(el.getAttribute('data-target') || '0')));
    return;
  }

  const counterIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = Number(el.getAttribute('data-target') || '0');
          animate(el, target);
          counterIO.unobserve(el);
        }
      }
    },
    { threshold: 0.25, rootMargin: '0px 0px -15% 0px' }
  );

  counterEls.forEach(el => counterIO.observe(el));
})();
