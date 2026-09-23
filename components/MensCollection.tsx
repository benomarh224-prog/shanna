import Image from 'next/image';

export default function MensCollection() {
  return (
    <section id="for-him" className="mens-collection" aria-labelledby="mens-title">
      <div className="mens-heading">
        <span className="mens-eyebrow">SHANNA COLLECTION / FOR HIM</span>
        <span className="mens-edition">A DIFFERENT EXPRESSION.</span>
      </div>
      <div className="mens-layout">
        <div className="mens-copy">
          <span className="mens-index" aria-hidden="true">02 —</span>
          <h2 id="mens-title">Presence.<br/><em>His signature.</em></h2>
          <p>Discover the men’s collection.<br/>A signature, distinctly yours.</p>
          <div className="mens-caption"><span>FOR HIM</span><span>SHANNA COLLECTION</span></div>
        </div>
        <figure className="mens-image">
          <Image src="/images/shanna-men.jpg" alt="Shanna men's collection: three cylindrical clear glass perfume bottles, two with black and gold caps and one with a white and silver cap, on a light stone surface." width={1280} height={853} sizes="(max-width: 760px) 100vw, 65vw" quality={90}/>
          <figcaption><span>THE MEN’S COLLECTION</span><span>SHANNA</span></figcaption>
        </figure>
      </div>
    </section>
  );
}
