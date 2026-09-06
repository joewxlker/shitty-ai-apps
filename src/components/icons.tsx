import { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  width: '1em',
  height: '1em',
};

function getProps(props: IconProps, defaultClass = 'h-5 w-5 shrink-0'): SVGProps<SVGSVGElement> {
  return {
    ...base,
    ...props,
    className: props.className ? `shrink-0 ${props.className}` : defaultClass,
  };
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-6 w-6 shrink-0')}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...getProps(props)}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...getProps(props)}>
      <path d="M12 2s-2 3.5-2 6.5A2 2 0 0 0 12 11a2 2 0 0 0 2-2.5C16 10 18 12.5 18 15.5A6 6 0 0 1 6 15.5c0-2 1-3.5 2-4.5-.3 1 .2 2 1 2 1 0 1-1.5 0-3C8 8 12 5 12 2Z" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...getProps(props)}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" />
    </svg>
  );
}

export function LightbulbIcon(props: IconProps) {
  return (
    <svg {...getProps(props)}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a6 6 0 0 0-4 10.5c.6.5 1 1.3 1 2.5h6c0-1.2.4-2 1-2.5A6 6 0 0 0 12 2Z" />
    </svg>
  );
}

export function HeartHandshakeIcon(props: IconProps) {
  return (
    <svg {...getProps(props)}>
      <path d="M12 6.5c-1.2-1.7-3-2.5-4.5-2A3.7 3.7 0 0 0 5 8c0 3.5 4.5 6.5 7 9 2.5-2.5 7-5.5 7-9a3.7 3.7 0 0 0-2.5-3.5c-1.5-.5-3.3.3-4.5 2Z" />
      <path d="m9 12 1.5 1.5L13 11" />
    </svg>
  );
}

export function BarChartIcon(props: IconProps) {
  return (
    <svg {...getProps(props)}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
      <path d="M2 20h20" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-3.5 w-3.5 shrink-0')}>
      <path d="M14 4h6v6" />
      <path d="M10 14 20 4" />
      <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
    </svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function MessageCircleIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <path d="M21 11.5a8.4 8.4 0 0 1-9.3 8.4c-1.2-.1-2-.3-2.9-.7L3 20l1-4.8A8.3 8.3 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-5 w-5 shrink-0')}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
      <path d="M16 3.1a4 4 0 0 1 0 7.8" />
    </svg>
  );
}

export function DollarIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <path d="M12 2v20" />
      <path d="M17 5.5c0-1.9-2.2-3.5-5-3.5S7 3.6 7 5.5 9.2 9 12 9s5 1.6 5 3.5-2.2 3.5-5 3.5-5-1.6-5-3.5" />
    </svg>
  );
}

export function LoaderIcon(props: IconProps) {
  return (
    <svg
      {...getProps(props, 'h-6 w-6 shrink-0')}
      className={['animate-spin', props.className].filter(Boolean).join(' ')}
    >
      <path d="M12 2v4" opacity="0.9" />
      <path d="M12 18v4" opacity="0.2" />
      <path d="m4.9 4.9 2.8 2.8" opacity="0.3" />
      <path d="m16.3 16.3 2.8 2.8" opacity="0.7" />
      <path d="M2 12h4" opacity="0.4" />
      <path d="M18 12h4" opacity="0.8" />
      <path d="m4.9 19.1 2.8-2.8" opacity="0.5" />
      <path d="m16.3 7.7 2.8-2.8" opacity="1" />
    </svg>
  );
}export function PencilIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <svg {...getProps(props, 'h-4 w-4 shrink-0')}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

