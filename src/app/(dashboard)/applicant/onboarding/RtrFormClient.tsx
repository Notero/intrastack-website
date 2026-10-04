"use client";

import { useRef, useState, useEffect } from "react";
import { submitRtrAction, type RtrPayload } from "./actions";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function fmtDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ─── types ───────────────────────────────────────────────────────────────── */

interface Props {
  initialFullName: string;
  initialEmail: string;
}

type SigMode = "draw" | "type";
type Step = 1 | 2 | 3;

/* ─── component ───────────────────────────────────────────────────────────── */

export function RtrFormClient({ initialFullName, initialEmail }: Props) {
  /* form fields */
  const [fullName, setFullName] = useState(initialFullName);
  const [roleSought, setRoleSought] = useState("");
  const [phone, setPhone] = useState("");
  const [recruiter, setRecruiter] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(today());
  const [notes, setNotes] = useState("");

  /* multi-step */
  const [step, setStep] = useState<Step>(1);
  const [agreeRead, setAgreeRead] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  /* signature */
  const [sigMode, setSigMode] = useState<SigMode>("draw");
  const [sigDataUrl, setSigDataUrl] = useState<string | null>(null);
  const [sigTypeValue, setSigTypeValue] = useState("");
  const [agreeSign, setAgreeSign] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  /* submission */
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receiptPayload, setReceiptPayload] = useState<RtrPayload | null>(null);

  /* ── progress pct ── */
  const pct = step === 1 ? 0 : step === 2 ? 50 : 85;
  const stepLabel =
    step === 1
      ? "Step 1 of 3 · Your information"
      : step === 2
      ? "Step 2 of 3 · Review agreement"
      : "Step 3 of 3 · Sign & submit";

  /* ── canvas drawing ── */
  const getPos = (
    e: MouseEvent | TouchEvent,
    canvas: HTMLCanvasElement
  ): { x: number; y: number } => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.strokeStyle = "#1A1A1A";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  useEffect(() => {
    if (step !== 3 || sigMode !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    initCanvas();

    const onDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDrawing.current = true;
      const ctx = canvas.getContext("2d")!;
      const pos = getPos(e, canvas);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const ctx = canvas.getContext("2d")!;
      const pos = getPos(e, canvas);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setSigDataUrl(canvas.toDataURL("image/png"));
    };
    const onUp = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onUp);
    return () => {
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onUp);
    };
  }, [step, sigMode, initCanvas]);

  /* ── typed signature ── */
  useEffect(() => {
    const drawTypedSignature = () => {
      if (sigMode !== "type" || !sigTypeValue.trim()) {
        if (sigMode === "type") setSigDataUrl(null);
        return;
      }
      const offscreen = document.createElement("canvas");
      offscreen.width = 400;
      offscreen.height = 120;
      const ctx = offscreen.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 400, 120);
      ctx.fillStyle = "#1A1A1A";
      ctx.font = "italic 42px 'Brush Script MT','Segoe Script',cursive";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sigTypeValue, 200, 60);
      setSigDataUrl(offscreen.toDataURL("image/png"));
    };
    drawTypedSignature();
  }, [sigTypeValue, sigMode]);

  const clearSig = () => {
    setSigDataUrl(null);
    if (sigMode === "draw") {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    } else {
      setSigTypeValue("");
    }
  };

  /* ── step 1 validation ── */
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});

  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().split(/\s+/).length < 2)
      errs.fullName = "Enter your full legal name (first and last).";
    if (!roleSought.trim() || roleSought.trim().length < 2)
      errs.roleSought = "Enter the role you are seeking.";
    if (!phone.trim() || !/^\+?[\d\s\-().]{7,20}$/.test(phone.trim()))
      errs.phone = "Enter a valid phone number.";
    if (!effectiveDate)
      errs.effectiveDate = "Select an effective date.";
    else if (effectiveDate < today())
      errs.effectiveDate = "Effective date cannot be in the past.";
    setStep1Errors(errs);
    return Object.keys(errs).length === 0;
  }

  const canContinueStep1 =
    fullName.trim() && roleSought.trim() && phone.trim() && effectiveDate;

  /* ── submit ── */
  async function handleSubmit() {
    if (!sigDataUrl) return;
    if (!agreeSign) return;
    setSubmitting(true);
    setSubmitError(null);
    const now = new Date();
    const payload: RtrPayload = {
      candidate: {
        fullName: fullName.trim(),
        roleSought: roleSought.trim(),
        email: initialEmail,
        phone: phone.trim(),
        otherAgencies: notes.trim() || null,
      },
      recruiter: recruiter.trim() || null,
      agreementDate: effectiveDate,
      effectiveThrough: addDays(effectiveDate, 90),
      signature: { method: sigMode, imageDataUrl: sigDataUrl },
      submittedAtIso: now.toISOString(),
      submittedAtDisplay: now.toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      }),
      userAgent: navigator.userAgent,
    };
    const result = await submitRtrAction(payload);
    setSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.error ?? "Submission failed. Please try again.");
      return;
    }
    setReceiptPayload(payload);
    setSubmitted(true);
  }

  /* ── receipt screen ── */
  if (submitted && receiptPayload) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <style>{RTR_CSS}</style>
        <div className="rtr-success">
          <div className="rtr-success-icon">✓</div>
          <h2>Agreement signed and submitted</h2>
          <p>
            Thank you, <strong>{receiptPayload.candidate.fullName}</strong>. Your
            Right to Represent Agreement has been submitted to Intrastack
            Solutions. A confirmation receipt has been sent to{" "}
            <strong>{receiptPayload.candidate.email}</strong>.
          </p>
          <div className="rtr-receipt">
            {[
              ["Candidate", receiptPayload.candidate.fullName],
              ["Role sought", receiptPayload.candidate.roleSought],
              ["Email", receiptPayload.candidate.email],
              ["Agreement date", fmtDate(receiptPayload.agreementDate)],
              ["Effective through", fmtDate(receiptPayload.effectiveThrough)],
              ["Submitted", receiptPayload.submittedAtDisplay],
            ].map(([label, value]) => (
              <div key={label} className="rtr-receipt-row">
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
            <div className="rtr-receipt-row rtr-sig-row">
              <span>Signature</span>
              <img src={receiptPayload.signature.imageDataUrl} alt="Signature" className="rtr-sig-img" />
            </div>
          </div>
          <a href="/applicant/dashboard" className="rtr-btn rtr-btn-primary rtr-continue-btn">
            Continue to your dashboard →
          </a>
        </div>
      </div>
    );
  }

  /* ── main form ── */
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <style>{RTR_CSS}</style>

      {/* Progress */}
      <div className="rtr-progress-wrap">
        <div className="rtr-progress-bg">
          <div className="rtr-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="rtr-progress-labels">
          <span>{stepLabel}</span>
          <span>{pct}%</span>
        </div>
      </div>

      {/* Hero */}
      <div className="rtr-hero">
        <div className="rtr-hero-eyebrow">Intrastack Solutions · Onboarding</div>
        <h1>Right to Represent Agreement</h1>
        <p>
          Before accessing your dashboard, please complete and sign this
          agreement authorising Intrastack to represent you as a candidate.
        </p>
        <div className="rtr-hero-meta">
          <span><b>Binding</b> · E-SIGN Act / UETA compliant</span>
          <span><b>90-day</b> term from effective date</span>
          <span><b>~3 min</b> to complete</span>
        </div>
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="rtr-card">
          <div className="rtr-step-head">
            <span className="rtr-step-num">1</span>
            <h2>Your information</h2>
          </div>
          <p className="rtr-step-sub">
            This information will appear on your signed agreement.
          </p>

          <div className="rtr-grid2">
            <div className="rtr-field">
              <label>Full legal name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setStep1Errors((p) => ({ ...p, fullName: "" })); }}
                placeholder="e.g. Jordan A. Mitchell"
                className={step1Errors.fullName ? "rtr-input-error" : ""}
              />
              {step1Errors.fullName && <span className="rtr-field-error">{step1Errors.fullName}</span>}
            </div>
            <div className="rtr-field">
              <label>Role sought *</label>
              <input
                type="text"
                value={roleSought}
                onChange={(e) => { setRoleSought(e.target.value); setStep1Errors((p) => ({ ...p, roleSought: "" })); }}
                placeholder="e.g. Senior Cloud Engineer"
                className={step1Errors.roleSought ? "rtr-input-error" : ""}
              />
              {step1Errors.roleSought && <span className="rtr-field-error">{step1Errors.roleSought}</span>}
            </div>
          </div>

          <div className="rtr-grid2">
            <div className="rtr-field">
              <label>Email address</label>
              <input
                type="email"
                value={initialEmail}
                readOnly
                className="rtr-readonly"
              />
            </div>
            <div className="rtr-field">
              <label>Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setStep1Errors((p) => ({ ...p, phone: "" })); }}
                placeholder="(555) 123-4567"
                className={step1Errors.phone ? "rtr-input-error" : ""}
              />
              {step1Errors.phone && <span className="rtr-field-error">{step1Errors.phone}</span>}
            </div>
          </div>

          <div className="rtr-grid2">
            <div className="rtr-field">
              <label>Assigned recruiter (optional)</label>
              <input
                type="text"
                value={recruiter}
                onChange={(e) => setRecruiter(e.target.value)}
                placeholder="e.g. Pat Reynolds"
              />
            </div>
            <div className="rtr-field">
              <label>Agreement effective date *</label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => { setEffectiveDate(e.target.value); setStep1Errors((p) => ({ ...p, effectiveDate: "" })); }}
                className={step1Errors.effectiveDate ? "rtr-input-error" : ""}
              />
              {step1Errors.effectiveDate && <span className="rtr-field-error">{step1Errors.effectiveDate}</span>}
            </div>
          </div>

          <div className="rtr-field">
            <label>Other agencies or recruiters (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="List any other staffing agencies or recruiters who have submitted you for roles, if applicable. Leave blank if none."
              rows={3}
            />
          </div>

          <button
            type="button"
            className="rtr-btn rtr-btn-primary"
            onClick={() => { if (validateStep1()) setStep(2); }}
          >
            Continue to review →
          </button>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="rtr-card">
          <div className="rtr-step-head">
            <span className="rtr-step-num">2</span>
            <h2>Review agreement</h2>
          </div>
          <p className="rtr-step-sub">
            Read the full agreement below. Scroll to the bottom to continue.
          </p>

          {/* Live-filled preview */}
          <div className="rtr-doc-meta">
            <span>Candidate: <b>{fullName}</b></span>
            <span>Recruiter: <b>{recruiter || "To be assigned"}</b></span>
            <span>Date: <b>{fmtDate(effectiveDate)}</b></span>
            <span>Through: <b>{fmtDate(addDays(effectiveDate, 90))}</b></span>
          </div>

          <div
            className="rtr-doc-scroll"
            onScroll={(e) => {
              const el = e.currentTarget;
              if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
                setHasScrolled(true);
              }
            }}
          >
            <h3>Right to Represent Agreement</h3>
            <p>
              This Right to Represent Agreement (the &quot;Agreement&quot;) confirms the
              mutual understanding between <b>{fullName || "[your full legal name]"}</b>{" "}
              (&quot;Candidate&quot;) and Intrastack Solutions, a recruiting and staffing
              services firm located at 331 Bella Vida Blvd, Orlando, FL 32828
              (&quot;Intrastack,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), regarding Intrastack&apos;s
              authorization to represent the Candidate&apos;s professional candidacy
              to prospective employers and clients for the role of{" "}
              <b>{roleSought || "[role sought]"}</b>.
            </p>

            <h4>1. Grant of Representation</h4>
            <p>
              By signing below, the Candidate grants Intrastack the exclusive
              right, for the term specified herein, to submit the Candidate&apos;s
              resume, qualifications, and professional profile to prospective
              employer clients identified by Intrastack, and to act as the
              Candidate&apos;s representative in coordinating interviews, negotiating
              offers, and facilitating the hiring process on the Candidate&apos;s
              behalf.
            </p>

            <h4>2. Scope of Authorization</h4>
            <p>
              The Candidate authorizes Intrastack Solutions to act as their
              exclusive recruiting representative for the purpose of identifying,
              presenting, and submitting the Candidate&apos;s qualifications to
              prospective employer clients engaged by Intrastack. This
              representation includes, but is not limited to, resume submission,
              interview coordination, offer negotiation support, and general
              advocacy on behalf of the Candidate throughout the hiring process.
            </p>
            <p>
              Intrastack agrees to submit the Candidate&apos;s profile only to
              opportunities mutually discussed and approved by the Candidate
              prior to submission. No resume or candidate information will be
              released to any third-party employer without the Candidate&apos;s
              express prior consent, whether verbal or written.
            </p>

            <h4>3. Disclosure of Competing Representations</h4>
            <p>
              To avoid duplicate submissions and protect the Candidate&apos;s
              professional reputation with prospective employers, the Candidate
              agrees to inform Intrastack of any other staffing agencies,
              recruiters, or direct applications currently representing them or
              submitted on their behalf for the same or substantially similar
              positions. Intrastack will likewise disclose, upon request, which
              employer clients the Candidate&apos;s profile has been submitted to.
            </p>
            <p>
              Should the Candidate accept representation by another recruiting
              firm for the same opportunity already submitted by Intrastack, the
              Candidate agrees to promptly notify Intrastack in writing to avoid
              conflicting submissions.
            </p>

            <h4>4. Candidate Obligations</h4>
            <ul>
              <li>Provide accurate, current, and complete professional information, including an up-to-date resume, and promptly notify Intrastack of any material changes.</li>
              <li>Notify Intrastack immediately of any competing offers or representation by other agencies for positions submitted by Intrastack.</li>
              <li>Refrain from directly contacting or applying to employer clients introduced by Intrastack during the term of this Agreement without prior written consent from Intrastack.</li>
              <li>Respond to communications from Intrastack in a timely manner to facilitate the recruiting process.</li>
            </ul>

            <h4>5. Intrastack Obligations</h4>
            <ul>
              <li>Act in the Candidate&apos;s best professional interest when representing them to employer clients.</li>
              <li>Not submit the Candidate&apos;s profile to any employer without prior notification and consent.</li>
              <li>Maintain the confidentiality of the Candidate&apos;s personal and professional information in accordance with applicable privacy laws.</li>
              <li>Provide timely feedback from employer clients regarding interview outcomes and application statuses, to the extent such information is available to Intrastack.</li>
            </ul>

            <h4>6. Term and Termination</h4>
            <p>
              This Agreement is effective as of the date signed and remains in
              force for a period of ninety (90) days from the effective date
              ({fmtDate(effectiveDate) || "[effective date]"} through{" "}
              {fmtDate(addDays(effectiveDate, 90)) || "[expiry date]"}), unless
              earlier terminated by either party upon seven (7) days&apos; written
              notice. Early termination does not affect any ongoing hiring
              processes that were actively facilitated by Intrastack prior to
              the termination notice.
            </p>

            <h4>7. No Employment Guarantee</h4>
            <p>
              This Agreement does not constitute a guarantee of employment.
              Intrastack&apos;s role is limited to facilitating the introduction
              between the Candidate and prospective employer clients. Employment
              decisions are made solely by the employer client.
            </p>

            <h4>8. Electronic Signature Acknowledgment</h4>
            <p>
              The Candidate acknowledges that their electronic signature below
              constitutes a legally binding signature under the Electronic
              Signatures in Global and National Commerce Act (E-SIGN Act) and
              the Uniform Electronic Transactions Act (UETA), and is equivalent
              in legal effect to a handwritten signature. A timestamp, signature
              method, and session reference are recorded as part of the audit
              trail.
            </p>

            {notes && (
              <p>
                <b>Disclosed competing representations at signing:</b> {notes}
              </p>
            )}
          </div>

          {!hasScrolled && (
            <p className="rtr-scroll-nudge">↓ Scroll to read the full agreement ↓</p>
          )}

          <label className="rtr-checkbox-row">
            <input
              type="checkbox"
              checked={agreeRead}
              onChange={(e) => setAgreeRead(e.target.checked)}
              disabled={!hasScrolled}
            />
            <span>I have read and understood the Right to Represent Agreement in its entirety.</span>
          </label>

          <div className="rtr-btn-row">
            <button
              type="button"
              className="rtr-btn rtr-btn-secondary"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
            <button
              type="button"
              className="rtr-btn rtr-btn-primary"
              disabled={!agreeRead}
              onClick={() => setStep(3)}
            >
              Continue to sign →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div className="rtr-card">
          <div className="rtr-step-head">
            <span className="rtr-step-num">3</span>
            <h2>Sign the agreement</h2>
          </div>
          <p className="rtr-step-sub">
            Choose how you&apos;d like to sign — drawn or typed signatures are both legally binding.
          </p>

          {/* Sig mode tabs */}
          <div className="rtr-sig-tabs">
            <button
              type="button"
              className={`rtr-sig-tab ${sigMode === "draw" ? "active" : ""}`}
              onClick={() => { setSigMode("draw"); clearSig(); }}
            >
              ✏ Draw
            </button>
            <button
              type="button"
              className={`rtr-sig-tab ${sigMode === "type" ? "active" : ""}`}
              onClick={() => { setSigMode("type"); clearSig(); }}
            >
              T Type
            </button>
          </div>

          {/* Draw pane */}
          {sigMode === "draw" && (
            <div className="rtr-sig-pane">
              <canvas ref={canvasRef} className="rtr-canvas" />
              {!sigDataUrl && (
                <div className="rtr-sig-placeholder">Sign here with mouse or touch</div>
              )}
            </div>
          )}

          {/* Type pane */}
          {sigMode === "type" && (
            <div className="rtr-sig-pane">
              <input
                type="text"
                className="rtr-sig-type-input"
                placeholder="Type your full name"
                value={sigTypeValue}
                onChange={(e) => setSigTypeValue(e.target.value)}
              />
              {sigDataUrl && (
                <div className="rtr-sig-preview-wrap">
                  <img src={sigDataUrl} alt="Signature preview" className="rtr-sig-preview" />
                </div>
              )}
            </div>
          )}

          <div className="rtr-sig-meta">
            <button type="button" className="rtr-sig-clear" onClick={clearSig}>
              ✕ Clear signature
            </button>
            <span className="rtr-sig-status">
              {sigDataUrl ? "✓ Signature captured" : "No signature yet"}
            </span>
          </div>

          <label className="rtr-checkbox-row">
            <input
              type="checkbox"
              checked={agreeSign}
              onChange={(e) => setAgreeSign(e.target.checked)}
            />
            <span>
              I, <b>{fullName || "[your name]"}</b>, agree this electronic
              signature is legally binding and constitutes my acceptance of the
              Right to Represent Agreement above, equivalent to a handwritten
              signature under the E-SIGN Act and UETA.
            </span>
          </label>

          <p className="rtr-audit-note">
            By submitting this form, a timestamp, session reference, and your
            signature method will be recorded alongside your signature as part
            of the audit trail.
          </p>

          {submitError && (
            <p className="rtr-error">{submitError}</p>
          )}

          <div className="rtr-btn-row">
            <button
              type="button"
              className="rtr-btn rtr-btn-secondary"
              onClick={() => setStep(2)}
            >
              ← Back
            </button>
            <button
              type="button"
              className="rtr-btn rtr-btn-primary"
              disabled={!sigDataUrl || !agreeSign || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Submitting…" : "Submit signed agreement"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── scoped CSS ──────────────────────────────────────────────────────────── */

const RTR_CSS = `
  .rtr-progress-wrap { margin-bottom: 20px; }
  .rtr-progress-bg { height: 6px; border-radius: 6px; background: #E2E4E8; overflow: hidden; }
  .rtr-progress-fill { height: 100%; border-radius: 6px; background: linear-gradient(135deg, #F5A623, #D9402A); transition: width .35s ease; }
  .rtr-progress-labels { display: flex; justify-content: space-between; font-size: 12px; color: #6B6F76; margin-top: 6px; }

  .rtr-hero { background: #1A1A1A; background-image: radial-gradient(circle at 15% 20%, rgba(245,166,35,.20), transparent 45%), radial-gradient(circle at 85% 0%, rgba(217,64,42,.25), transparent 50%); border-radius: 14px; padding: 32px 28px; margin-bottom: 20px; color: #fff; }
  .rtr-hero-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #FBC569; margin-bottom: 8px; }
  .rtr-hero h1 { font-size: 24px; line-height: 1.25; margin: 0 0 8px; font-weight: 800; }
  .rtr-hero p { margin: 0; color: rgba(255,255,255,.68); font-size: 14px; line-height: 1.55; }
  .rtr-hero-meta { margin-top: 16px; display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: rgba(255,255,255,.5); }
  .rtr-hero-meta b { color: #fff; font-weight: 600; }

  .rtr-card { background: #fff; border: 1px solid #E2E4E8; border-radius: 10px; padding: 28px; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(20,20,30,.06); }
  .rtr-step-head { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
  .rtr-step-num { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #F5A623, #D9402A); color: #fff; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .rtr-step-head h2 { font-size: 17px; margin: 0; color: #1A1A1A; font-weight: 700; }
  .rtr-step-sub { font-size: 13px; color: #6B6F76; margin: 0 0 20px 40px; }

  .rtr-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 540px) { .rtr-grid2 { grid-template-columns: 1fr; } }
  .rtr-field { margin-bottom: 14px; }
  .rtr-field label { display: block; font-size: 12.5px; font-weight: 600; color: #1A1A1A; margin-bottom: 5px; }
  .rtr-field input, .rtr-field textarea { width: 100%; padding: 9px 12px; border: 1.5px solid #E2E4E8; border-radius: 7px; font-size: 14px; color: #1A1A1A; background: #fff; outline: none; font-family: inherit; box-sizing: border-box; transition: border-color .15s; }
  .rtr-field input:focus, .rtr-field textarea:focus { border-color: #F5A623; }
  .rtr-field textarea { resize: vertical; min-height: 70px; }
  .rtr-readonly { background: #F6F7F9 !important; color: #6B6F76 !important; cursor: not-allowed; }
  .rtr-input-error { border-color: #D9402A !important; }
  .rtr-field-error { display: block; font-size: 11.5px; color: #D9402A; margin-top: 4px; }

  .rtr-doc-meta { display: flex; flex-wrap: wrap; gap: 12px; background: #F6F7F9; border-radius: 7px; padding: 10px 14px; margin-bottom: 12px; font-size: 12.5px; color: #6B6F76; }
  .rtr-doc-meta b { color: #1A1A1A; }
  .rtr-doc-scroll { border: 1.5px solid #E2E4E8; border-radius: 8px; padding: 20px 22px; max-height: 320px; overflow-y: auto; font-size: 13.5px; line-height: 1.65; color: #2B2B2E; margin-bottom: 14px; }
  .rtr-doc-scroll h3 { font-size: 16px; font-weight: 700; margin: 0 0 12px; color: #1A1A1A; }
  .rtr-doc-scroll h4 { font-size: 13.5px; font-weight: 700; margin: 18px 0 6px; color: #1A1A1A; }
  .rtr-doc-scroll p { margin: 0 0 10px; }
  .rtr-doc-scroll ul { margin: 0 0 10px; padding-left: 20px; }
  .rtr-doc-scroll li { margin-bottom: 5px; }
  .rtr-scroll-nudge { font-size: 12px; color: #6B6F76; text-align: center; margin-bottom: 10px; }

  .rtr-checkbox-row { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: #2B2B2E; line-height: 1.5; margin: 14px 0; cursor: pointer; }
  .rtr-checkbox-row input[type=checkbox] { margin-top: 2px; flex-shrink: 0; accent-color: #F5A623; width: 16px; height: 16px; }

  .rtr-btn-row { display: flex; gap: 10px; margin-top: 20px; }
  .rtr-btn { padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: opacity .15s, transform .1s; font-family: inherit; }
  .rtr-btn:active { transform: scale(.97); }
  .rtr-btn:disabled { opacity: .45; cursor: not-allowed; }
  .rtr-btn-primary { background: linear-gradient(135deg, #F5A623, #D9402A); color: #fff; }
  .rtr-btn-primary:hover:not(:disabled) { opacity: .88; }
  .rtr-btn-secondary { background: #fff; color: #2B2B2E; border: 1.5px solid #E2E4E8; }
  .rtr-btn-secondary:hover { border-color: #1A1A1A; }

  .rtr-sig-tabs { display: flex; gap: 8px; margin-bottom: 14px; }
  .rtr-sig-tab { padding: 7px 18px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1.5px solid #E2E4E8; background: #fff; color: #6B6F76; font-family: inherit; transition: all .15s; }
  .rtr-sig-tab.active { border-color: #F5A623; color: #1A1A1A; background: #FFF8EE; }
  .rtr-sig-pane { border: 1.5px solid #E2E4E8; border-radius: 8px; background: #fff; margin-bottom: 10px; position: relative; min-height: 140px; overflow: hidden; }
  .rtr-canvas { width: 100%; height: 160px; display: block; touch-action: none; cursor: crosshair; }
  .rtr-sig-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #C0C3C9; font-size: 14px; pointer-events: none; }
  .rtr-sig-type-input { width: 100%; padding: 16px; border: none; outline: none; font-size: 36px; font-family: 'Brush Script MT','Segoe Script',cursive; color: #1A1A1A; background: transparent; box-sizing: border-box; }
  .rtr-sig-preview-wrap { padding: 0 16px 12px; }
  .rtr-sig-preview { max-width: 100%; height: auto; }
  .rtr-sig-meta { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
  .rtr-sig-clear { font-size: 12px; color: #6B6F76; background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; }
  .rtr-sig-clear:hover { color: #D9402A; }
  .rtr-sig-status { font-size: 12px; color: #6B6F76; }
  .rtr-audit-note { font-size: 12px; color: #6B6F76; line-height: 1.5; margin-bottom: 6px; }
  .rtr-error { color: #D9402A; font-size: 13px; margin: 8px 0; }

  .rtr-success { text-align: center; padding: 32px 0; }
  .rtr-success-icon { width: 56px; height: 56px; border-radius: 50%; background: #EAF7EF; color: #1C8A4B; font-size: 26px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-weight: 700; }
  .rtr-success h2 { font-size: 22px; font-weight: 800; color: #1A1A1A; margin: 0 0 10px; }
  .rtr-success p { font-size: 14.5px; color: #6B6F76; line-height: 1.6; margin: 0 0 24px; }
  .rtr-receipt { background: #F6F7F9; border: 1px solid #E2E4E8; border-radius: 8px; overflow: hidden; margin-bottom: 24px; text-align: left; }
  .rtr-receipt-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 16px; border-bottom: 1px solid #E2E4E8; font-size: 13px; }
  .rtr-receipt-row:last-child { border-bottom: none; }
  .rtr-receipt-row span:first-child { color: #6B6F76; font-weight: 600; font-size: 12px; }
  .rtr-receipt-row span:last-child { color: #1A1A1A; }
  .rtr-sig-row { flex-direction: column; align-items: flex-start; gap: 8px; }
  .rtr-sig-img { max-width: 180px; height: auto; }
  .rtr-continue-btn { display: inline-block; text-decoration: none; margin-top: 4px; }
`;
