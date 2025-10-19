import React from 'react';
import Icon from '../AppIcon';

const BreadcrumbNavigation = ({ items = [] }) => {
  const handleNavigation = (path) => {
    if (path) {
      window.location.href = path;
    }
  };

  // Default breadcrumb if no items provided
  const defaultBreadcrumb = [
    { label: 'Dashboard', path: '/dashboard' }
  ];

  const breadcrumbItems = items?.length > 0 ? items : defaultBreadcrumb;

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems?.map((item, index) => {
          const isLast = index === breadcrumbItems?.length - 1;
          
          return (
            <li key={index} className="flex items-center space-x-2">
              {index > 0 && (
                <Icon name="ChevronRight" size={14} className="text-muted-foreground/60" />
              )}
              {isLast ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item?.label}
                </span>
              ) : (
                <button
                  onClick={() => handleNavigation(item?.path)}
                  className="hover:text-foreground transition-colors duration-150 focus:outline-none focus:underline"
                >
                  {item?.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;