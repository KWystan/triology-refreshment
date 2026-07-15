/**
 * BestSellerBadge — circular "BEST / SELLER" badge with folded-corner effect.
 *
 * Uses the `best-seller.svg` asset imported from `client/src/assets/ui/`.
 * Positioned at the top-left of the product card image, slightly overhanging
 * the card edge.
 *
 * Props:
 *   size     — diameter in px (default 60).  Accepts 56–64 range.
 */
import bestSellerSvg from '@/assets/ui/best-seller.svg';

export default function BestSellerBadge({ size = 60 }) {
  return (
    <img
      src={bestSellerSvg}
      alt="Best Seller"
      className="bs-badge"
      style={{
        width: size,
        height: size,
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 5,
        pointerEvents: 'none',
        transform: 'rotate(-6deg)',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
      }}
    />
  );
}
