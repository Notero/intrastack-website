# Resume AI — phases

The resume assistant: someone uploads their resume, we pull it into structured
data, match it against open roles, and eventually save the result. Splitting it
up so each chunk can ship and get reviewed on its own.

## Stack
- Next 16 + TS, Supabase, shadcn.
- Parsing goes through Claude (structured outputs). PDFs go straight to the model;
  DOCX gets turned into text with mammoth first.
- No API key yet, so the parser returns a stub for now (flagged `stub: true`) and
  the whole flow still runs in dev. Drop an `ANTHROPIC_API_KEY` in and it's live —
  nothing else to change.

## Where we're at

### Phase 1 — parsing (done)
- [x] `POST /api/resume/parse` — takes a PDF or DOCX, 5MB max
- [x] pulls it into a typed schema: competencies, tech stack, years, roles, etc.
- [x] DOCX → text via mammoth, PDF sent as-is
- [x] stub fallback when there's no key

### Phase 2 — upload UI
- [ ] a page to drop a resume and see what came back
- [ ] render the parsed fields nicely (shadcn, matching the rest of the site)
- [ ] loading / error / file-too-big handling

### Phase 3 — matching
- [ ] match the parsed resume against `job_posts`
- [ ] Claude ranks the top 3 and explains why each one fits
- [ ] keeping it simple at first (Claude scores a shortlist); embeddings/pgvector later if we need the scale

### Phase 4 — saving results
- [ ] Supabase tables for the parsed resume + match scores + chat history
- [ ] one unified candidate profile, tied into the candidate portal
- [ ] this is the part that actually needs Supabase access

### Phase 5 — going live
- [ ] real API key wired in
- [ ] scale matching up if it needs it
- [ ] rate limiting, file checks, proper error handling

## Still need
- An Anthropic API key (runs stubbed without one).
- Supabase access — only for phase 4.
