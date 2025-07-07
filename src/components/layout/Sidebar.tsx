import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Receipt,
  Calculator,
  Package,
  ShoppingCart,
  Briefcase,
  Wrench,
  FileText,
  Clock,
  Users,
  Truck,
  Target,
  UserCheck,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        description: 'Overview and analytics',
      },
    ],
  },
  {
    title: 'Financial',
    items: [
      {
        title: 'Facturi',
        href: '/facturi',
        icon: Receipt,
        description: 'Invoice management',
      },
      {
        title: 'TVA',
        href: '/tva',
        icon: Calculator,
        description: 'VAT calculations',
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        title: 'Depozit',
        href: '/depozit',
        icon: Package,
        description: 'Inventory management',
      },
      {
        title: 'Comenzi',
        href: '/comenzi',
        icon: ShoppingCart,
        description: 'Order management',
      },
      {
        title: 'Lucrări',
        href: '/lucrari',
        icon: Briefcase,
        description: 'Project management',
      },
      {
        title: 'Manoperă',
        href: '/manopera',
        icon: Wrench,
        description: 'Labor tracking',
      },
    ],
  },
  {
    title: 'Human Resources',
    items: [
      {
        title: 'Angajați',
        href: '/angajati',
        icon: UserCheck,
        description: 'Employee management',
      },
      {
        title: 'Contracte',
        href: '/contracte',
        icon: FileText,
        description: 'Contract management',
      },
      {
        title: 'Pontaj',
        href: '/pontaj',
        icon: Clock,
        description: 'Time tracking',
      },
    ],
  },
  {
    title: 'Master Data',
    items: [
      {
        title: 'Clienți',
        href: '/clienti',
        icon: Users,
        description: 'Client management',
      },
      {
        title: 'Furnizori',
        href: '/furnizori',
        icon: Truck,
        description: 'Supplier management',
      },
      {
        title: 'Centre Cost',
        href: '/centre-cost',
        icon: Target,
        description: 'Cost center management',
      },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-6">
              {navigationGroups.map((group, groupIndex) => (
                <div key={group.title}>
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.title}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link to={item.href} className="w-full">
                          <Button
                            key={item.href}
                            variant={isActive ? 'secondary' : 'ghost'}
                            className={cn(
                              'w-full justify-start',
                              isActive && 'bg-secondary'
                            )}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                  {groupIndex < navigationGroups.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};