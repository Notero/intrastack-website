import Image from "next/image";
import Link from "next/link";
import { ArrowRightCircle, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Career", href: "/careers" },
  { label: "Certifications", href: "/about/certifications" },
  { label: "Partners", href: "/about/partners" },
  { label: "Contact Us", href: "/contact" },
  { label: "News & Updates", href: "/news/blogs" },
  { label: "Whitepapers", href: "/news/whitepaper" },
];

const SERVICES = [
  { label: "AI & Machine Learning", href: "/services/ai_engineering" },
  { label: "DevOps & Automation", href: "/services/devops_automation" },
  { label: "Cloud Transformation", href: "/services/cloud_transformation" },
  { label: "Cloud Migration", href: "/services/cloud_migration" },
  { label: "IT Consulting", href: "/services/it_consulting" },
  { label: "IT Services", href: "/services/it_services" },
  { label: "Software Development", href: "/services/software_development" },
  { label: "Cybersecurity", href: "/services/cybersecurity" },
  { label: "Staffing Services", href: "/services/staff_augmentation" },
];

const SOLUTIONS = [
  { label: "Security & Compliance", href: "/solutions/security_compliance" },
  { label: "Business Continuity", href: "/solutions/business_continuity" },
  { label: "Data Analytics", href: "/solutions/data_analytics" },
  { label: "Hybrid Cloud", href: "/solutions/hybrid_cloud" },
  { label: "AWS", href: "/solutions/aws" },
  { label: "Azure", href: "/solutions/azure" },
  { label: "Kubernetes", href: "/solutions/kubernetes" },
  { label: "AI Automation", href: "/solutions/ai_automation" },
];

function LinkCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-6">{title}</h3>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-center gap-2 text-sm text-white/80 hover:text-secondary transition-colors"
            >
              <ArrowRightCircle className="size-4 text-white/80 group-hover:text-secondary transition-colors" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <Link href="/" className="inline-flex items-center mb-6">
            <Image
              src="/images/intrastack-logo-assets/email-print/print-hires-logo-2400x1878.png"
              alt="Intrastack"
              width={160}
              height={125}
              className="h-20 w-auto"
            />
          </Link>
          <p className="text-sm text-white/75 leading-relaxed">
            At <span className="font-semibold text-white">Intrastack Solutions</span>, we
            understand the transformative power of cloud technology in driving modern
            business success. Our expertise enables us to deliver innovative, high-impact
            solutions that propel our clients to new heights.
          </p>

          <h3 className="mt-8 text-lg font-bold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-3">
              <MapPin className="size-4 mt-0.5 text-secondary shrink-0" />
              <span>
                <span className="font-semibold text-white">Address:</span> 304 S. Jones
                Blvd #5755, Las Vegas, NV 89107
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-secondary shrink-0" />
              <span>
                <span className="font-semibold text-white">Phone:</span> 888-959-7868
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-secondary shrink-0" />
              <span>
                <span className="font-semibold text-white">Email:</span>{" "}
                <a
                  href="mailto:info@intrastack.com"
                  className="hover:text-secondary transition-colors"
                >
                  info@intrastack.com
                </a>
              </span>
            </li>
          </ul>

          <Button asChild variant="secondary" className="mt-6">
            <Link href="/contact">
              Contact Us <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <LinkCol title="Quick Links" links={QUICK_LINKS} />
        <LinkCol title="Services" links={SERVICES} />
        <LinkCol title="Solutions" links={SOLUTIONS} />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/80 flex items-center gap-3">
            <span>© {new Date().getFullYear()} Intrastack Solutions. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-secondary transition-colors underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-white/70">FOLLOW US:</span>
            {[
              { Icon: FacebookIcon, href: "#", label: "Facebook" },
              { Icon: TwitterIcon, href: "#", label: "Twitter" },
              { Icon: LinkedinIcon, href: "#", label: "LinkedIn" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid place-items-center size-8 rounded bg-white/10 hover:bg-secondary hover:text-ink-900 transition-colors"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
