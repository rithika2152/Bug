'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { Bug, LogOut, Settings, User, Bell, Search } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bug className="h-8 w-8 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BugTracker
            </span>
            <div className="text-xs text-gray-500 font-medium">Professional</div>
          </div>
        </div>
        
        <div className="flex-1" />
        
        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <Search className="h-4 w-4" />
            <span className="text-sm">Search</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </Button>

          {/* Role Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            user.role === 'manager' 
              ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200' 
              : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200'
          }`}>
            {user.role === 'manager' ? '👑 Manager' : '💻 Developer'}
          </div>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-blue-200 transition-all duration-200">
                <Avatar className="h-10 w-10 shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-2">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-semibold leading-none text-gray-900">{user.name}</p>
                  <p className="text-xs leading-none text-gray-600">{user.email}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${
                    user.role === 'manager' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'manager' ? 'Manager Dashboard' : 'Developer Dashboard'}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <User className="mr-3 h-4 w-4 text-gray-500" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Settings className="mr-3 h-4 w-4 text-gray-500" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="p-3 hover:bg-red-50 rounded-lg cursor-pointer text-red-600 hover:text-red-700"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}