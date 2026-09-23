import Image from 'next/image';
const finishes = ['Black & gold · I', 'White & silver', 'Black & gold · II'];
export default function MensCollection() {
  return <>{finishes.map((finish, index) => (
    <article className="product product-men" key={finish} aria-label={`For him — ${finish}`}>
      <div className="product-visual">
        <Image className={`mens-bottle-photo mens-bottle-${index}`} src="/images/shanna-men.jpg" alt={`Shanna men's perfume bottle, ${finish}, in clear cylindrical glass.`} fill sizes="(max-width: 600px) 270vw, 100vw" quality={90}/>
        <div className="product-top"><span>0{index + 4}</span><span>FOR HIM</span></div>
        <span className="product-explore">SHANNA COLLECTION</span>
      </div>
      <div className="product-title"><h3>For him</h3></div>
      <p>{finish}</p>
      <span className="price">Details coming soon</span>
    </article>
  ))}</>;
}
