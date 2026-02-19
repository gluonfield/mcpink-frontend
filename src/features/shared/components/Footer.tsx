import { InstagramLogo, TiktokLogo, XLogo, YoutubeLogo } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

const FOOTER_SECTIONS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Docs', to: '/docs' }
    ]
  },
  {
    title: 'Developers',
    links: [
      { label: 'Quick Start', to: '/get-started' },
      { label: 'API Keys', to: '/settings/api-keys' },
      { label: 'Dashboard', to: '/dashboard' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' }
    ]
  },
  {
    title: 'Connect',
    links: [{ label: 'contact@ml.ink', to: 'mailto:contact@ml.ink', external: true }]
  }
]

const SOCIAL_LINKS = [
  {
    label: 'X',
    href: 'https://x.com/inkmcp',
    icon: XLogo
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@inkmcp',
    icon: YoutubeLogo
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@inkmcp',
    icon: TiktokLogo
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/inkmcp',
    icon: InstagramLogo
  }
]

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1600px] overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-950">
      {/* Links section */}
      <div className="px-8 py-12 md:px-16 md:py-16">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {FOOTER_SECTIONS.map(section => (
            <div key={section.title}>
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                {section.title}
              </p>
              <ul className="mt-4 space-y-3">
                {section.links.map(link =>
                  'external' in link && link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.to}
                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-8 py-6 md:px-16">
        <img src="/logo_assets/inkdb.png" alt="ink" className="h-5 w-auto invert" />

        <div className="flex items-center gap-8">
          <p className="hidden text-xs text-neutral-500 md:block">
            &copy; {new Date().getFullYear()} Ink MCP &mdash; All Rights Reserved
          </p>
          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-white"
                aria-label={link.label}
              >
                <link.icon className="size-[18px]" weight="bold" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile copyright */}
      <p className="border-t border-white/[0.06] px-8 py-4 text-center text-xs text-neutral-500 md:hidden">
        &copy; {new Date().getFullYear()} Ink MCP &mdash; All Rights Reserved
      </p>
    </footer>
  )
}
