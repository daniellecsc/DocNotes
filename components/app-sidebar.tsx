'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar';
import { HomeIcon, Users, SettingsIcon, File } from 'lucide-react';

// Menu items
const items = [
  { title: 'Home', href: '/', icon: HomeIcon },
  { title: 'Clients', href: '/clients', icon: Users },
  { title: 'Notes', href: '/notes', icon: File },
  { title: 'Settings', href: '/settings', icon: SettingsIcon },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar collapsible='icon'>
      {/* Sidebar Header */}
      <SidebarHeader className='border-b border-b-cyan-900'>
        <Link href='/' className='flex items-center gap-2 px-2 py-3 text-white'>
          <img src='/logo.svg' alt='Logo' className='h-7 w-7' />
          {open && <span className='font-bold text-lg'>DocNotes</span>}
        </Link>
      </SidebarHeader>

      {/* Sidebar Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className='text-gray-300'>
              {items.map((item) => {
                // Active tab logic
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`rounded-md transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-cyan-950 text-white font-semibold hover:bg-cyan-950 hover:text-white'
                          : 'hover:bg-cyan-900 hover:text-white'
                      }`}
                    >
                      <Link
                        href={item.href}
                        className='flex items-center gap-4 px-2 py-5'
                      >
                        <item.icon className='shrink-0' />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
