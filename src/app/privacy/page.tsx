import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";
import { PRIVACY_POLICY_VERSION } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy · Intrastack",
  description:
    "How Intrastack Solutions collects, uses, retains, and protects personal data across our marketing site, careers platform, and applicant/customer dashboards.",
  alternates: { canonical: "/privacy" },
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-12 first:mt-0">
      <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  const { email } = SITE.contact;

  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy" },
        ])}
      />

      <section className="w-full bg-background">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="inline size-3 mx-1" />
            <span className="text-primary">Privacy Policy</span>
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-foreground leading-[1.08] tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Effective: {PRIVACY_POLICY_VERSION} &middot; Policy version {PRIVACY_POLICY_VERSION}
          </p>
        </div>
      </section>

      <section className="w-full bg-paper-2 pb-20 md:pb-24 px-6 border-t border-base-300">
        <div className="mx-auto max-w-3xl pt-12">
          <Section id="overview" title="Overview">
            <p>
              Intrastack Solutions (&ldquo;Intrastack,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;)
              provides cloud transformation, DevOps, AI engineering, and staffing services, and
              operates a careers platform connecting applicants with our customers&apos; open
              roles. This policy explains what personal data we collect across{" "}
              <span className="text-foreground font-medium">intrastack.com</span> and the
              applicant/customer/admin dashboards, why we collect it, how long we keep it, and
              the rights you have over it. It is written to meet the disclosure requirements of
              the EU/UK General Data Protection Regulation (GDPR) and the California Consumer
              Privacy Act (CCPA/CPRA), and applies regardless of where you are located.
            </p>
          </Section>

          <Section id="collect" title="Information We Collect">
            <p>We collect different data depending on how you interact with us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="text-foreground font-medium">Contact form</span> &mdash; name,
                work email, phone, company, job title, company size, budget/timeline, and your
                message, when you submit the &ldquo;Reach Us&rdquo; form.
              </li>
              <li>
                <span className="text-foreground font-medium">Whitepaper downloads</span> &mdash;
                email address and, optionally, what you&apos;re looking for, when you unlock a
                gated report.
              </li>
              <li>
                <span className="text-foreground font-medium">Chat widget</span> &mdash; name,
                company, email or phone, and the content of your conversation, if you use our
                site chat.
              </li>
              <li>
                <span className="text-foreground font-medium">Job applications</span> &mdash;
                your profile details (name, contact info, work history, skills, education,
                links), the resume file you upload, and any cover letter or notes you provide.
              </li>
              <li>
                <span className="text-foreground font-medium">Account &amp; profile data</span>{" "}
                &mdash; email, password (hashed by our authentication provider), display name,
                role, and, for customer accounts, company and title.
              </li>
              <li>
                <span className="text-foreground font-medium">Meetings &amp; onboarding</span>{" "}
                &mdash; interview scheduling details and any offer letters, NDAs, or onboarding
                documents exchanged through the platform.
              </li>
              <li>
                <span className="text-foreground font-medium">Technical data</span> &mdash; IP
                address, user agent, and the page you submitted a form from, captured
                automatically for fraud prevention and support.
              </li>
            </ul>
          </Section>

          <Section id="use" title="How We Use It">
            <ul className="list-disc pl-6 space-y-2">
              <li>Responding to enquiries and delivering the content you requested.</li>
              <li>Operating the careers platform: matching applicants to roles, scheduling interviews, and managing the hiring workflow between applicants and our customers.</li>
              <li>Authenticating accounts and enforcing role-based access to the dashboards.</li>
              <li>Sending transactional email (confirmations, status updates, password resets).</li>
              <li>Detecting and preventing abuse, fraud, and security incidents.</li>
              <li>Complying with legal obligations and responding to lawful requests.</li>
            </ul>
          </Section>

          <Section id="ai-processing" title="AI Processing Disclosure">
            <p>
              When our AI-assisted features are enabled, some content is sent to{" "}
              <span className="text-foreground font-medium">Anthropic</span>&apos;s Claude API for
              processing:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="text-foreground font-medium">Resume parsing &amp; matching</span>{" "}
                &mdash; if you use the resume assistant, the text of your uploaded resume is sent
                to Claude to extract structured fields and to score it against open roles.
              </li>
              <li>
                <span className="text-foreground font-medium">Site chat</span> &mdash; messages you
                send through the chat widget are sent to Claude to generate a reply.
              </li>
            </ul>
            <p>
              This only happens while an Anthropic API key is configured on our servers; if it
              isn&apos;t, these features fall back to a non-AI stub and nothing is sent
              externally. Anthropic processes this content as our data processor under its own
              API data-handling terms and does not use API inputs to train its models by default.
            </p>
          </Section>

          <Section id="legal-basis" title="Legal Bases for Processing (GDPR)">
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="text-foreground font-medium">Consent</span> &mdash; contact form, whitepaper downloads, and account registration, each recorded with a policy version and timestamp.</li>
              <li><span className="text-foreground font-medium">Contract</span> &mdash; processing needed to run your applicant or customer account and the hiring workflow you&apos;re part of.</li>
              <li><span className="text-foreground font-medium">Legitimate interest</span> &mdash; security, fraud prevention, and improving our services.</li>
            </ul>
          </Section>

          <Section id="retention" title="Data Retention">
            <p>
              We keep personal data only as long as needed for the purpose it was collected for.
              These are our standard retention periods; they may be shortened or extended for a
              specific legal or contractual reason.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="text-foreground font-medium">Contact form &amp; whitepaper leads</span> &mdash; 24 months from last contact, or until you ask us to delete it, whichever comes first.</li>
              <li><span className="text-foreground font-medium">Chat transcripts</span> &mdash; 12 months.</li>
              <li><span className="text-foreground font-medium">Job applications &amp; resumes</span> &mdash; for the duration of the hiring process, plus 12 months after a final decision, to support re-engagement and legal recordkeeping.</li>
              <li><span className="text-foreground font-medium">Account data</span> &mdash; for as long as your account is active, plus 90 days after deletion to allow recovery of an accidental request.</li>
              <li><span className="text-foreground font-medium">Support tickets</span> &mdash; 36 months after closure.</li>
              <li><span className="text-foreground font-medium">Onboarding documents</span> (offer letters, NDAs) &mdash; for the duration of the engagement they relate to, plus applicable record-keeping requirements.</li>
            </ul>
          </Section>

          <Section id="sharing" title="Third Parties &amp; Processors">
            <p>We do not sell personal data. We share it only with the processors that run our platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="text-foreground font-medium">Supabase</span> &mdash; database, authentication, and file storage.</li>
              <li><span className="text-foreground font-medium">Anthropic</span> &mdash; AI processing for resume parsing/matching and site chat (see above).</li>
              <li><span className="text-foreground font-medium">Resend</span> &mdash; transactional email delivery.</li>
              <li>Our customers &mdash; when you apply to a job, your application details are shared with the customer that posted it, for hiring purposes only.</li>
            </ul>
          </Section>

          <Section id="rights" title="Your Rights">
            <p>Depending on where you live, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Know what personal data we hold about you, and request a copy of it (access / export).</li>
              <li>Correct inaccurate data.</li>
              <li>Delete your data (&ldquo;right to erasure&rdquo;), subject to legal retention requirements.</li>
              <li>Restrict or object to certain processing.</li>
              <li>Receive your data in a portable format.</li>
              <li>Non-discrimination for exercising any of these rights &mdash; we will never degrade your service for it.</li>
            </ul>
            <p>We do not sell personal data, so there is nothing to opt out of under CCPA&apos;s &ldquo;do not sell&rdquo; provision.</p>
          </Section>

          <Section id="exercise-rights" title="How to Exercise Your Rights">
            <p>
              To request access, correction, export, or deletion of your data, email{" "}
              <a href={`mailto:${email}?subject=Privacy%20Request`} className="font-semibold text-primary hover:underline">
                {email}
              </a>{" "}
              with the subject line &ldquo;Privacy Request&rdquo; and the email address associated
              with your data. We verify the request before acting on it and respond within 30
              days (GDPR) or 45 days (CCPA), as applicable.
            </p>
          </Section>

          <Section id="cookies" title="Cookies &amp; Tracking">
            <p>
              We use strictly necessary cookies to keep you signed in to the applicant, customer,
              and admin dashboards. We do not currently use third-party advertising or analytics
              cookies.
            </p>
          </Section>

          <Section id="security" title="Security">
            <p>
              We use industry-standard safeguards &mdash; encrypted connections, role-based access
              control, and row-level security on our database &mdash; to protect personal data.
              No system is completely secure; if we ever become aware of a breach affecting your
              data, we will notify you and the relevant regulator as required by law.
            </p>
          </Section>

          <Section id="children" title="Children's Privacy">
            <p>
              Our services are intended for professional use and are not directed at children
              under 16. We do not knowingly collect personal data from children.
            </p>
          </Section>

          <Section id="transfers" title="International Transfers">
            <p>
              We operate delivery centers in the United States, Vietnam, Japan, and India. Personal
              data may be processed in any of these locations. Where required, we rely on
              standard contractual clauses or an equivalent safeguard for cross-border transfers.
            </p>
          </Section>

          <Section id="changes" title="Changes to This Policy">
            <p>
              We&apos;ll update the &ldquo;Effective&rdquo; date and policy version above when we
              make material changes, and where required, ask for renewed consent.
            </p>
          </Section>

          <Section id="contact" title="Contact Us">
            <p>
              Questions about this policy or how we handle your data:{" "}
              <a href={`mailto:${email}`} className="font-semibold text-primary hover:underline">
                {email}
              </a>
              , or by mail at {SITE.contact.address.streetAddress},{" "}
              {SITE.contact.address.addressLocality}, {SITE.contact.address.addressRegion}{" "}
              {SITE.contact.address.postalCode}.
            </p>
          </Section>
        </div>
      </section>
    </main>
  );
}
