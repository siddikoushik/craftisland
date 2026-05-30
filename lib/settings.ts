export interface HomepageSettings {
  // Hero Section
  heroImage: string;
  heroTagline: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryBtnText: string;
  heroSecondaryBtnText: string;

  // Value Props
  prop1Title: string; prop1Desc: string; prop1Icon: string;
  prop2Title: string; prop2Desc: string; prop2Icon: string;
  prop3Title: string; prop3Desc: string; prop3Icon: string;
  prop4Title: string; prop4Desc: string; prop4Icon: string;

  // Craft Section (Our Story)
  craftImage: string;
  craftTagline: string;
  craftTitle: string;
  craftDescription: string;
  craftBullets: string[];
  craftBtnText: string;

  // Scent Families
  scentHeading: string;
  scentSubtitle: string;
  scentFloralDesc: string;
  scentWoodyDesc: string;
  scentGourmandDesc: string;
  scentFreshDesc: string;

  // Testimonials & Reviews
  testimonialHeading: string;
  testimonialTitle: string;
  testimonial1Body: string;
  testimonial1Author: string;
  testimonial1Location: string;
  testimonial2Body: string;
  testimonial2Author: string;
  testimonial2Location: string;
  testimonial3Body: string;
  testimonial3Author: string;
  testimonial3Location: string;
}

export const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  heroImage: '/images/hero-candle.png',
  heroTagline: 'Hand-poured · Small batch',
  heroTitle: 'Light something beautiful.',
  heroDescription: 'Craft Island candles are crafted in small batches with clean-burning soy wax and fragrances designed to turn an ordinary evening into a ritual.',
  heroPrimaryBtnText: 'Shop the collection',
  heroSecondaryBtnText: 'Our story',

  prop1Title: '100% Soy Wax', prop1Desc: 'Clean-burning, vegan, and free from paraffin.', prop1Icon: 'Leaf',
  prop2Title: 'Up to 90 Hours', prop2Desc: 'Long, even burns with cotton wicks.', prop2Icon: 'Flame',
  prop3Title: 'Reusable Vessels', prop3Desc: 'Keep the jar long after the wax is gone.', prop3Icon: 'Recycle',
  prop4Title: 'Free Shipping ₹1,875+', prop4Desc: 'Carbon-neutral delivery on every order.', prop4Icon: 'Truck',

  craftImage: '/images/lifestyle-pour.png',
  craftTagline: 'The Craft Island way',
  craftTitle: 'Poured by hand, never rushed.',
  craftDescription: 'Every candle is blended, poured, and finished in our studio in small batches. We cure each pour for two full weeks so the fragrance settles into the wax — the difference you can smell the moment you light it.',
  craftBullets: [
    'Phthalate-free fragrance oils',
    'Lead-free cotton wicks',
    'Two-week cure for a true scent throw'
  ],
  craftBtnText: 'Read our story',

  scentHeading: 'Find your scent family',
  scentSubtitle: 'By Mood',
  scentFloralDesc: 'Romantic, soft, fresh-cut',
  scentWoodyDesc: 'Smoky, grounded, library-quiet',
  scentGourmandDesc: 'Indulgent, edible, warm',
  scentFreshDesc: 'Bright, airy, coastal',

  testimonialHeading: 'Loved by thousands',
  testimonialTitle: 'Over 12,000 five-star reviews',
  testimonial1Body: 'Amber Noir is the only candle I buy now. My whole house smells like a luxury hotel.',
  testimonial1Author: 'Eleanor M.',
  testimonial1Location: 'Verified Buyer',
  testimonial2Body: 'The scent throw is unreal — I light one in the living room and can smell it upstairs.',
  testimonial2Author: 'James T.',
  testimonial2Location: 'Verified Buyer',
  testimonial3Body: 'Beautifully made and the vessels are gorgeous. I keep them for plants once they’re done.',
  testimonial3Author: 'Sofia R.',
  testimonial3Location: 'Verified Buyer'
}
