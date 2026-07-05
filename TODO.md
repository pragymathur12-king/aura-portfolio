# Typography Fix - Case Studies

## Plan / Steps
1. Edit `style.css`
   - Enforce global typography baseline (min body font 18px, soft white, gray secondary).
   - Fix any explicit black text on dark backgrounds (replace `color:black` / `#050816` on bright surfaces/overlays).
   - Update case-page typography sizes (ensure `case-p`, `case-lede`, `case-list li`, `case-steps` are >= 18px on mobile too).
   - Improve spacing/padding for readability.
   - Confirm max-width centering works for case pages.
2. Re-run verification by locating remaining black/too-small text styles in `style.css` and any other CSS (if present).
3. Inspect each case-study HTML and patch inline styles / overrides
   - `uber.html`, `ai-feature.html`, `ab-testing.html`, `competitor-analysis.html`
   - Ensure their markup uses the case-page classes and no inline styles introduce black text or small fonts.
4. Inspect any additional pages that might be case-study-like (`entry.html`, `portfolio.html` if relevant)
5. Test responsiveness
   - Confirm mobile media queries keep fonts >= 18px and hierarchy is readable.
6. Final run-through
   - Ensure no black text anywhere on dark backgrounds.

## Progress
- [ ] Step 1: Update `style.css`
- [ ] Step 2: Verify no remaining black/too-small typography rules
- [ ] Step 3: Update case-study HTML inline styles/overrides
- [ ] Step 4: Check other potential case-study pages
- [ ] Step 5: Responsive verification
- [ ] Step 6: Final consistency pass

