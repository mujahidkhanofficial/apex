import Link from "next/link"
import { Github, Linkedin, Twitter, Instagram } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    services: [
      { label: "Local SEO", href: "#services" },
      { label: "Web Development", href: "#services" },
      { label: "Graphic Design", href: "#services" },
      { label: "Content Writing", href: "#services" },
      { label: "Shopify Development", href: "#services" },
    ],
    company: [
      { label: "About", href: "#about" },
      { label: "Team", href: "#team" },
      { label: "Work", href: "#work" },
      { label: "Contact", href: "#contact" },
    ],
    social: [
      { icon: Twitter, href: "#", label: "Twitter" },
      { icon: Linkedin, href: "#", label: "LinkedIn" },
      { icon: Instagram, href: "#", label: "Instagram" },
      { icon: Github, href: "#", label: "GitHub" },
    ],
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tight text-foreground mb-4 inline-block">
              APEX<span className="text-primary">MEDIA</span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
              A few skilled humans doing the work of many.™ We help brands grow through strategic design, development,
              and digital marketing solutions.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-sm transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {currentYear} ApexMediaDigital. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
