'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  GraduationCap,
  MoreVertical,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
}

interface AppSidebarProps {
  navItems: NavItem[];
  activeItem: string;
  middleContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export default function AppSidebar({
  navItems,
  activeItem,
  middleContent,
  bottomContent,
  headerAction,
}: AppSidebarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      setSidebarWidth(Number(savedWidth));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        localStorage.setItem('sidebarWidth', sidebarWidth.toString());
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, sidebarWidth]);

  const userInitials =
    session?.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('') || 'U';

  return (
    <div
      ref={sidebarRef}
      className="flex flex-col border-r bg-secondary/50 transition-all duration-300 relative"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <h2 className="font-bold text-lg">BeyondCampus</h2>
        </div>
        {headerAction}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 border-b border-border/30">
          {navItems.map((item) => {
            const isActive = item.label === activeItem;
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start text-left h-10 px-4 rounded-md',
                  !isActive &&
                    'hover:bg-accent/50 transition-all duration-200 group'
                )}
                onClick={() => !isActive && router.push(item.href)}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 mr-3',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-primary transition-colors'
                  )}
                />
                <span className="text-[15px] font-medium">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Middle Content (e.g., recent chats) */}
        {middleContent}

        {/* Flexible spacer */}
        <div className="flex-1" />

        {/* Bottom Content (optional extra section above user) */}
        {bottomContent}

        {/* User Account Section */}
        <div className="border-t border-border/50">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium truncate">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground/70">Student</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-secondary/70 opacity-60 hover:opacity-100"
                    aria-label="Account options"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className={cn(
          'absolute top-0 -right-1 w-3 h-full cursor-col-resize group',
          isResizing && 'bg-primary/10'
        )}
        onMouseDown={handleMouseDown}
        style={{
          touchAction: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        <div
          className={cn(
            'absolute left-1 top-0 w-1 h-full bg-border group-hover:bg-primary/30 transition-colors',
            isResizing && 'bg-primary/50'
          )}
        />
      </div>
    </div>
  );
}
