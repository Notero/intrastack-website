import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const NEWS_SECTIONS = [
  { label: "Top News", href: "/news" },
  { label: "Blogs", href: "/news/blogs" },
  { label: "Trends & Tech", href: "/news/trends" },
  { label: "Whitepapers", href: "/news/whitepaper" },
  { label: "Client Stories", href: "/news/client_stories" },
  { label: "Intrastack News", href: "/news/intrastack" },
];

const CORPORATE_LINKS = [
  { label: "About Intrastack", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

const RESOURCE_LINKS = [
  { label: "Research Library", href: "/news/whitepaper" },
  { label: "Press Room", href: "/news/intrastack" },
  { label: "Client Stories", href: "/news/client_stories" },
  { label: "Portal Login", href: "/login" },
  { label: "Register", href: "/register" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Accessibility", href: "#" },
];

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

export function NewsPortalFooter() {
  return (
    <footer className="bg-ink-900 text-ink-300 mt-0">
      <div className="border-t-4 border-brand-600" />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Brand + contact */}
          <div className="col-span-12 md:col-span-4">
            <Link href="/news" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 flex items-center justify-center">
                <span className="font-serif font-black text-white text-lg">I</span>
              </div>
              <span className="font-serif font-black text-2xl text-white">
                Intrastack<span className="text-brand-500">.</span>
              </span>
            </Link>
            <p className="font-sans text-[13.5px] leading-relaxed text-ink-400 max-w-xs">
              Authoritative reporting and research on the industries shaping enterprise
              technology. Trusted by leaders since 2009.
            </p>

            <ul className="mt-5 space-y-2.5 text-[13px] text-ink-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-400 shrink-0" />
                304 S. Jones Blvd #5755, Las Vegas, NV 89107
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                888-959-7868
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:info@intrastack.com" className="hover:text-white transition-colors">
                  info@intrastack.com
                </a>
              </li>
            </ul>

            <div className="flex gap-2 mt-5">
              {[
                { Icon: FacebookIcon, label: "Facebook" },
                { Icon: TwitterIcon, label: "Twitter" },
                { Icon: LinkedinIcon, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 border border-ink-700 flex items-center justify-center text-ink-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* News sections */}
          <div className="col-span-6 md:col-span-2">
            <div className="font-sans font-bold uppercase tracking-wider text-[12px] text-white mb-3">
              Sections
            </div>
            <ul className="space-y-2 font-sans text-[13px] text-ink-400">
              {NEWS_SECTIONS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate links */}
          <div className="col-span-6 md:col-span-2">
            <div className="font-sans font-bold uppercase tracking-wider text-[12px] text-white mb-3">
              Company
            </div>
            <ul className="space-y-2 font-sans text-[13px] text-ink-400">
              {CORPORATE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-6 md:col-span-2">
            <div className="font-sans font-bold uppercase tracking-wider text-[12px] text-white mb-3">
              Resources
            </div>
            <ul className="space-y-2 font-sans text-[13px] text-ink-400">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-6 md:col-span-2">
            <div className="font-sans font-bold uppercase tracking-wider text-[12px] text-white mb-3">
              Legal
            </div>
            <ul className="space-y-2 font-sans text-[13px] text-ink-400">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans text-[12px] text-ink-500">
          <span>© {new Date().getFullYear()} Intrastack Media Group. All rights reserved.</span>
          <Link href="/" className="hover:text-white transition-colors text-ink-400">
            ← Back to Intrastack corporate site
          </Link>
        </div>
      </div>
    </footer>
  );
}
