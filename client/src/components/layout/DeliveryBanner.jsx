/**
 * DeliveryBanner — promotional banner for delivery offers.
 *
 * Props:
 *   message   — banner text (default 'Free delivery within Trapiche!')
 *   icon      — Material Symbol icon name (default 'delivery_dining')
 *   className — additional classes
 */
import Icon from '../ui/Icon';

export default function DeliveryBanner({
  message = 'Free delivery within Trapiche! Minimum order of ₱200.',
  icon = 'delivery_dining',
  className = '',
}) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-primary-fixed)',
        color: 'var(--color-on-primary-fixed)',
        padding: '0.75rem 1rem',
        textAlign: 'center',
        fontSize: '0.9375rem',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      <Icon
        name={icon}
        size={20}
        fill={1}
        weight={300}
      />
      <span>{message}</span>
    </div>
  );
}
