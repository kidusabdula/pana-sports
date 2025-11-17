// components/shared/Footer.tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail,
  Phone,
  MapPin,
  Apple,
  Smartphone
} from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');

  const quickLinks = [
    { href: '/premier-league', label: 'Premier League' },
    { href: '/ethiopian-cup', label: 'Ethiopian Cup' },
    { href: '/higher-league', label: 'Higher League' },
    { href: '/league-one', label: 'League One' },
    { href: '/walias-u20-pl', label: 'Walias U-20 PL' },
  ];

  const companyLinks = [
    { href: '/about-us', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/careers', label: 'Careers' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ];

  const resourcesLinks = [
    { href: '/news', label: 'News' },
    { href: '/fixtures', label: 'Fixtures' },
    { href: '/results', label: 'Results' },
    { href: '/standings', label: 'Standings' },
    { href: '/players', label: 'Players' },
  ];

  return (
    <footer className="bg-zinc-900/60 backdrop-blur-xl border-t border-zinc-800/50 mt-auto">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-zinc-900/60 to-zinc-900/80 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-black text-xl tracking-tight">P</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                  Pana Sports
                </span>
                <span className="text-xs text-muted-foreground font-medium tracking-wider">
                  ETHIOPIAN FOOTBALL HUB
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground max-w-md">
              Your comprehensive source for Ethiopian football news, match results, player statistics, and league standings. Stay updated with the latest from Ethiopian football.
            </p>
            
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Leagues</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 mb-6">
              {resourcesLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Get the App</h3>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex items-center gap-2 bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60">
                  <Apple className="h-4 w-4" />
                  <span className="text-xs">App Store</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-xs">Google Play</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-zinc-800/50" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pana Sports. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>info@panasports.et</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+251 123 456 789</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Addis Ababa, Ethiopia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}