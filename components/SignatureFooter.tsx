'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';

export default function SignatureFooter() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .12 });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  return <>
    <section ref={section} className={`signature-finale${visible ? ' is-visible' : ''}`} aria-labelledby="finale-title">
      <div className="finale-topline"><span>THE ART OF PRESENCE</span><span>SHANNA / 01</span></div>
      <div className="finale-content">
        <div className="signature-sculpture" aria-hidden="true"><div className="sculpture-orbit orbit-one"/><div className="sculpture-orbit orbit-two"/><div className="sculpture-orbit orbit-three"/><span>S</span><div className="sculpture-shadow"/></div>
        <div className="finale-copy"><span className="finale-eyebrow">AN INVISIBLE IMPRESSION</span><h2 id="finale-title">A presence.<br/><em>Beyond words.</em></h2><p>Some things stay with you.<br/>Make your scent one of them.</p><a className="signature-cta" href="#collection"><span>Find your signature</span><span className="cta-arrow"><ArrowUpRight size={19}/></span></a></div>
      </div>
      <div className="finale-bottomline"><span>THREE EXPRESSIONS. ONE YOU.</span><span className="finale-mark">S /</span></div>
    </section>
    <footer className="signature-footer"><div className="footer-brand-row"><a href="#journey" aria-label="SHANNA home" className="signature-wordmark">SHANNA<span>PARFUMS</span></a><a href="#journey" className="footer-back" aria-label="Back to top"><ArrowUp size={18}/></a></div><div className="footer-meta"><span>© {new Date().getFullYear()} SHANNA</span><span>CONCEPT STORE</span><span>DESIGNED TO LINGER.</span></div></footer>
  </>;
}
