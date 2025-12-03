// components/ui/Breadcrumbs.tsx (Advanced)
'use client';

import Link from 'next/link';
import { TbChevronRight, TbHome } from 'react-icons/tb';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  homeLabel?: string;
  separator?: React.ReactNode;
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({
  items,
  homeHref = '/',
  homeLabel = 'Dashboard',
  separator = <TbChevronRight className="w-3 h-3 text-gray-400" />,
  className = '',
  showHome = true,
}: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm overflow-x-auto whitespace-nowrap text-ellipsis ${className}`}>
      {/* Home Link */}
      {showHome && (
        <>
          <Link
            href={homeHref}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <TbHome className="w-4 h-4" />
            <span>{homeLabel}</span>
          </Link>
          {items.length > 0 && separator}
        </>
      )}

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && separator}
          
          <div className="flex items-center space-x-1">
            {item.icon && item.icon}
            
            {item.href && !item.active ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`
                  ${item.active
                    ? 'text-blue-900 font-medium'
                    : 'text-gray-500 hover:text-gray-700'}
                `}
              >
                {item.label}
              </span>
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}