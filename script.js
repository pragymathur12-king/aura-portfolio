// Elements marked with .reveal will fade/slide in when they enter the viewport.

(function () {
  const supportsIO = typeof IntersectionObserver !== 'undefined';
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (!revealEls.length) return;

  // If user prefers reduced motion, show immediately.
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
    {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  revealEls.forEach((el) => io.observe(el));
})();

// Animated statistic counters for the About section
(function () {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counterEls = Array.from(document.querySelectorAll('.metric-value[data-target]'));
  if (!counterEls.length) return;

  const supportsIO = typeof IntersectionObserver !== 'undefined';

  const animate = (el, target) => {
    const suffix = el.getAttribute('data-suffix') !== null ? el.getAttribute('data-suffix') : '+';
    if (reduceMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 900; // ms
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

  if (!supportsIO) {
    counterEls.forEach((el) => {
      const target = Number(el.getAttribute('data-target') || '0');
      animate(el, target);
    });
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

  counterEls.forEach((el) => counterIO.observe(el));
})();

// Animate product journey timeline while scrolling
(function () {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const items = Array.from(document.querySelectorAll('.timeline-item'));
  if (!items.length) return;

  // Build a scroll-based progress (simple, smooth enough)
  const ioSupportsIO = typeof IntersectionObserver !== 'undefined';
  if (!ioSupportsIO) return;

  const activateIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-active');
        activateIO.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  activateIO.observe(timeline);
})();





// =========================================================
// 1. PRODUCT JUDGMENT LAB: SCENARIO & TRADE-OFF SIMULATION
// =========================================================
(function initProductJudgmentLab() {
  const choicesContainer = document.querySelector('.lab-choices-container');
  const analysisSection = document.getElementById('labAnalysisSection');
  if (!choicesContainer || !analysisSection) return;

  const choices = Array.from(choicesContainer.querySelectorAll('.choice-card'));

  const tradeOffData = {
    optA: {
      badge: 'OPTION A SELECTED &bull; DATA &amp; DIAGNOSTICS FIRST',
      title: 'Granular Funnel &amp; Cohort Segmentation',
      thesis: 'Deconstruct drop-offs across [Device &times; Currency &times; Gateway &times; Tier] before committing code changes or rolling back.',
      whyChoose: 'An 18% aggregate drop is almost never uniform. Jumping to conclusions risks reverting weeks of engineering work when the failure is localized to a single browser, currency, or gateway API. Segmentation establishes the true blast radius before modifying production systems.',
      advantages: [
        'Isolates the exact breakdown point (e.g. Safari iOS 17 WebKit quirk, GBP 3DS v2 challenge, or guest modal).',
        'Preserves working features for unaffected cohorts (e.g. domestic USD transactions continuing without interruption).',
        'Avoids an expensive, demoralizing full rollback of the release.',
        'Provides engineering with specific repro steps, network logs, and error codes rather than vague reports.'
      ],
      risks: [
        '<strong>Time Drag &amp; Revenue Bleed:</strong> Spending 24–48 hours querying telemetry while top-line revenue continues dropping at ~$20k/day.',
        '<strong>Data Volume Thresholds:</strong> Low-volume international currencies or enterprise tiers may take days to reach statistical significance.',
        '<strong>Executive Impatience:</strong> Leadership may perceive analytical rigor as indecisiveness during an active business incident.'
      ],
      evidence: [
        '<strong>Strengthens:</strong> Funnel telemetry reveals 88% of drop-off is concentrated in a specific payment gateway (e.g. Adyen 3DS redirect failure on mobile), while domestic checkout is stable.',
        '<strong>Weakens:</strong> Telemetry shows a uniform 18% drop across every single browser, OS, device, geography, and payment method—indicating a systemic UX checkout flow flaw.'
      ],
      nextAction: [
        'Run Snowflake/Mixpanel queries: Segment step-by-step funnel completion by [Device &times; OS &times; Gateway &times; Currency &times; User Tier].',
        'If concentrated in 1 gateway/currency, deploy a targeted feature flag to fallback that specific segment while keeping the new checkout live for the rest.',
        'Spin up an hourly cross-functional incident Slack channel (#war-room-checkout) with engineering and sales leads with updated cohort deltas.'
      ],
      metrics: [
        'Step-level drop-off rate (Payment Method Selection &rarr; 3DS Challenge &rarr; Order Confirmation)',
        'Gateway error response codes (HTTP 402, 504 timeouts, Soft decline rates)',
        'Median checkout completion duration (detecting UI stutter or network latency spikes)'
      ]
    },
    optB: {
      badge: 'OPTION B SELECTED &bull; SPEED &amp; DAMAGE CONTROL',
      title: 'Rapid Checkout Simplification &amp; Rollback',
      thesis: 'Instantly revert the multi-step form to single-page flow to stop top-line revenue bleeding while investigation continues offline.',
      whyChoose: 'When top-line conversion hemorrhages 18% post-release, the primary duty of an APM is business risk mitigation and stop-loss. If the monetary loss exceeds the cost of delayed roadmap milestones, immediately reverting to the known-stable single-page checkout protects customer trust and corporate cash flow while root-cause investigation happens offline.',
      advantages: [
        'Immediate revenue protection: returns conversion to the baseline average within minutes of deployment.',
        'De-escalates executive and sales panic, buying calm focus for the team.',
        'Provides a clean control environment to isolate discrepancies between staging and production.',
        'Protects customer trust during critical billing cycles.'
      ],
      risks: [
        '<strong>Loss of Live Production Telemetry:</strong> Once rolled back, you lose live production traffic data necessary to debug rare edge-case bugs.',
        '<strong>Engineering Sunk Cost &amp; Morale:</strong> Reverting features can demoralize engineers and cause friction between Product and Dev.',
        '<strong>Multi-Currency Rollout Delay:</strong> May breach contractual commitments with new international partners or enterprise clients expecting foreign currency support.'
      ],
      evidence: [
        '<strong>Strengthens:</strong> Customer support tickets show broad user frustration across all tiers, confusion with the new multi-step stepper, and zero specific API errors in Datadog.',
        '<strong>Weakens:</strong> Error logs immediately show a 504 Gateway Timeout from an external KYC validation vendor—meaning a localized config fix or timeout increase would resolve the issue without reverting the entire frontend.'
      ],
      nextAction: [
        'Execute staged feature-flag rollback of the multi-step UI to the legacy checkout for 80% of traffic, reserving 20% in an isolated canary/sandbox with verbose telemetry logging.',
        'Conduct a 2-hour rapid design critique on checkout stepper friction, form field cognitive load, and mobile autofill behavior.',
        'Re-baseline hourly GMV and conversion within 3 hours post-rollback to confirm recovery.'
      ],
      metrics: [
        'Overall Checkout Conversion Rate rebound (target: return to &ge; baseline within 4 hours)',
        'Cart Abandonment Rate delta across returning customers',
        'Support ticket inflow tagged with \'checkout error\' or \'cannot pay\''
      ]
    },
    optC: {
      badge: 'OPTION C SELECTED &bull; SYSTEMS &amp; INFRA FIRST',
      title: 'Critical Technical &amp; Payment Gateway Spike',
      thesis: 'Direct an emergency engineering sprint to audit API timeouts, 3D Secure failures, and network latency.',
      whyChoose: 'Modern checkout failures are frequently infrastructure and integration failures disguised as UX issues. If engineering already suspects third-party gateway latency, initiating a focused technical spike directly targets API payloads, 3D Secure v2 handshakes, and webhook drop-offs before redesigning forms or blaming user psychology.',
      advantages: [
        'Solves the actual underlying failure mode if the issue is API latency, tokenization failure, or gateway timeout.',
        'Preserves all UX work and multi-currency UI enhancements.',
        'Builds permanent technical monitoring resilience (gateway fallback routing, automated retries, circuit breakers).',
        'Directly tests third-party vendor SLAs and contract guarantees.'
      ],
      risks: [
        '<strong>Assumption of Technical Fault:</strong> Assumes the problem is technical. If the issue is actually UX friction, unhelpful error messaging, or hidden fees, engineering hours will be wasted hunting ghosts.',
        '<strong>Third-Party Dependency:</strong> If the gateway itself has a regional outage or rate limit, engineering cannot fix it internally without routing traffic elsewhere.',
        '<strong>Delayed UX Fixes:</strong> Leaves confused users struggling on an unintuitive interface while engineers inspect database queries.'
      ],
      evidence: [
        '<strong>Strengthens:</strong> APM monitoring (Datadog/New Relic) shows API response times on /api/v2/charge spiked from 420ms to 4,800ms, with a surge in HTTP 504 timeouts on 3DS authorization calls.',
        '<strong>Weakens:</strong> Gateway latency and API success rates are at 99.98% green health, but users spend 4 minutes on the address verification screen before abandoning.'
      ],
      nextAction: [
        'Direct engineering to inspect payment gateway webhook acknowledgment logs, 3DS authentication success percentages, and API timeout thresholds.',
        'Implement dynamic secondary payment routing (if Gateway A latencies exceed 2,000ms, failover transparently to Gateway B).',
        'Add client-side Sentry error logging to capture silent JavaScript validation crashes in the checkout container.'
      ],
      metrics: [
        'Gateway p95 &amp; p99 API Latency on payment authorization endpoints',
        '3DS v2 Challenge completion vs. frictionless flow ratio',
        'Payment processor decline codes (e.g., Do Not Honor, Expired Card, Network Error)'
      ]
    }
  };

  const renderAnalysis = (key) => {
    const data = tradeOffData[key];
    if (!data) return;

    analysisSection.innerHTML = `
      <div class="lab-analysis-panel">
        <div class="lab-analysis-header">
          <span class="analysis-badge">${data.badge}</span>
          <h3 class="analysis-title">${data.title}</h3>
          <p class="analysis-thesis"><strong>APM Working Hypothesis:</strong> ${data.thesis}</p>
        </div>

        <div class="analysis-grid">
          <div class="analysis-block">
            <h4 class="analysis-block-title">💡 Why an APM Would Choose This</h4>
            <div class="analysis-block-body">
              <p>${data.whyChoose}</p>
            </div>
          </div>

          <div class="analysis-block">
            <h4 class="analysis-block-title">✨ Key Advantages</h4>
            <div class="analysis-block-body">
              <ul>
                ${data.advantages.map(adv => `<li>${adv}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="analysis-block">
            <h4 class="analysis-block-title">⚠️ Hidden Risks &amp; Unstated Assumptions</h4>
            <div class="analysis-block-body">
              <ul>
                ${data.risks.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="analysis-block">
            <h4 class="analysis-block-title">🔍 What Evidence Strengthens / Weakens It</h4>
            <div class="analysis-block-body">
              <ul>
                ${data.evidence.map(ev => `<li>${ev}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="analysis-block">
            <h4 class="analysis-block-title">🚀 Immediate Next Action (First 48 Hours)</h4>
            <div class="analysis-block-body">
              <ul>
                ${data.nextAction.map(act => `<li>${act}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="analysis-block">
            <h4 class="analysis-block-title">📊 Diagnostic Signals &amp; Metrics to Watch</h4>
            <div class="analysis-block-body">
              <ul>
                ${data.metrics.map(m => `<li>${m}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div class="analysis-footer-actions">
          <button type="button" class="analysis-reset-btn" id="changeLabDecisionBtn">
            <span>↺ Change my decision</span>
          </button>
          <span style="font-size: 13px; color: #94a3b8;">
            Deterministic product reasoning framework &bull; Aura Lab
          </span>
        </div>
      </div>
    `;

    const resetBtn = document.getElementById('changeLabDecisionBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        choicesContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstChoice = choices[0];
        if (firstChoice) firstChoice.focus();
      });
    }
  };

  choices.forEach((card) => {
    card.addEventListener('click', () => {
      const choiceKey = card.getAttribute('data-choice');
      choices.forEach((c) => {
        c.classList.remove('is-selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('is-selected');
      card.setAttribute('aria-checked', 'true');
      renderAnalysis(choiceKey);

      // Smoothly scroll down so the analysis panel is comfortably in view
      analysisSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Keyboard support: Enter or Space selects
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
})();

// =========================================================
// 2. PRODUCT EXPERIMENT PLANNER: INTERACTIVE SPEC EXPLORER
// =========================================================
(function initExperimentPlanner() {
  const tabs = Array.from(document.querySelectorAll('.planner-tab'));
  const contentContainer = document.getElementById('plannerSpecContent');
  if (!tabs.length || !contentContainer) return;

  const experiments = {
    exp1: {
      name: 'Fintech: ChargeDossier Dynamic Auth Pre-Check',
      hypothesis: 'Moving 3D Secure & identity verification to background asynchronous pre-checks during cart review will increase checkout completion by 3.2% without increasing fraudulent chargeback rates.',
      segment: 'Returning authenticated users on desktop & mobile with transaction values under $250.',
      intervention: 'Dynamic risk-based step-up authentication. Frictionless 1-click authorization for low-risk returning users; stepped-up verification reserved only for high-risk fraud flags.',
      successMetric: 'Checkout Completion Rate (+3.2% target, statistical significance p &lt; 0.05).',
      guardrailMetric: 'Dispute & Chargeback Rate (must remain strictly &le; 0.45% of GMV; stop experiment immediately if &gt; 0.60%).',
      evidence: 'ChargeDossier historical dispute analysis demonstrating that 92% of fraud losses originate from guest checkouts with order value &gt; $400.'
    },
    exp2: {
      name: 'Logistics: Loadvanta Extraction Confidence Routing',
      hypothesis: 'Setting deterministic extraction confidence thresholds at 94% on inbound rate confirmation PDFs will allow 68% of documents to auto-sync to TMS while maintaining zero billing discrepancies.',
      segment: 'Top 15 vetted freight broker PDF templates representing 60% of recurring weekly load volume.',
      intervention: 'Automated document pipeline extraction with deterministic field validation; rate cons scoring below 94% confidence routed to a human-in-the-loop review queue.',
      successMetric: 'Average document processing time reduced from 8.5 minutes to &lt; 30 seconds per rate con.',
      guardrailMetric: 'Rate discrepancy claim rate (must remain strictly 0.0% on auto-synced loads).',
      evidence: 'Loadvanta architecture benchmarks showing accessorial fee misinterpretations (detention, lumper fees) are the sole cause of freight invoice disputes.'
    },
    exp3: {
      name: 'Mobility: Uber Commute Surge Shield Subscription',
      hypothesis: 'Offering fixed-price surge shields on frequent commute corridors will lift 30-day rider retention by 14% and stabilize weekly trip frequency.',
      segment: 'Daily commuters traveling between major residential clusters and commercial hubs during peak hours (8-10 AM & 5-7 PM, Mon-Fri).',
      intervention: '\'Commute Lock\' subscription tier: riders pay a flat monthly pass fee in exchange for capped 1.2x surge pricing on their pre-registered route.',
      successMetric: 'Weekly completed trips per active subscriber (+18% lift) &amp; 60-day subscription renewal rate (&gt; 72%).',
      guardrailMetric: 'Driver gross hourly earnings (must not decrease vs. standard dynamic surge dispatch).',
      evidence: 'Commuter teardown analytics indicating that rider app abandonment jumps by 47% whenever peak surge multipliers exceed 1.6x on standard workdays.'
    }
  };

  const renderSpec = (key) => {
    const exp = experiments[key];
    if (!exp) return;

    contentContainer.innerHTML = `
      <div class="spec-grid">
        <div class="spec-item full-width">
          <div class="spec-label">🔬 Experiment Scenario</div>
          <div class="spec-value" style="font-size: 16px; font-weight: 700; color: #00e5ff;">${exp.name}</div>
        </div>

        <div class="spec-item full-width">
          <div class="spec-label">💡 Testable Hypothesis</div>
          <div class="spec-value">${exp.hypothesis}</div>
        </div>

        <div class="spec-item">
          <div class="spec-label">🎯 Target Cohort / Segment</div>
          <div class="spec-value">${exp.segment}</div>
        </div>

        <div class="spec-item">
          <div class="spec-label">⚙️ Product Intervention</div>
          <div class="spec-value">${exp.intervention}</div>
        </div>

        <div class="spec-item">
          <div class="spec-label">📈 Primary Success Metric</div>
          <div class="spec-value" style="color: #10b981; font-weight: 600;">${exp.successMetric}</div>
        </div>

        <div class="spec-item">
          <div class="spec-label">🛡️ Non-Negotiable Guardrail</div>
          <div class="spec-value" style="color: #f59e0b; font-weight: 600;">${exp.guardrailMetric}</div>
        </div>

        <div class="spec-item full-width">
          <div class="spec-label">📚 Pre-Launch Grounding &amp; Evidence</div>
          <div class="spec-value">${exp.evidence}</div>
        </div>
      </div>
    `;
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const expKey = tab.getAttribute('data-exp');
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderSpec(expKey);
    });
  });

  // Render initial spec (exp1)
  renderSpec('exp1');
})();

// =========================================================
// 3. RECRUITER FAST TRACK MODAL CONTROLLER
// =========================================================
(function initRecruiterFastTrack() {
  const modal = document.getElementById('fastTrackModal');
  const openBtn = document.getElementById('openFastTrack');
  const closeBtn = document.getElementById('closeFastTrack');
  if (!modal || !openBtn) return;

  const openModal = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    openBtn.focus();
  };

  openBtn.addEventListener('click', openModal);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on backdrop or any element with data-close-modal
  modal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close-modal') || e.target.classList.contains('fast-track-backdrop')) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();
