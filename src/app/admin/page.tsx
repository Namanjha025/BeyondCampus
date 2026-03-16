'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  LayoutDashboard,
  Database,
  Upload,
  ArrowRight,
  Clock,
  PlusCircle,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Universities',
      value: stats?.counts?.universities || 0,
      icon: GraduationCap,
    },
    {
      label: 'Total Programs',
      value: stats?.counts?.programs || 0,
      icon: Database,
    },
    {
      label: 'Total Students',
      value: stats?.counts?.students || 0,
      icon: Users,
    },
    {
      label: 'Total Applications',
      value: stats?.counts?.applications || 0,
      icon: ClipboardList,
    },
  ];

  const quickActions = [
    {
      title: 'Manage Universities',
      description: 'Add, edit, or remove university profiles',
      href: '/admin/universities',
      icon: PlusCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">
                System intelligence & management
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-2xl animate-pulse"
                  >
                    <div className="h-10 w-10 bg-gray-800 rounded-lg mb-4" />
                    <div className="h-4 w-24 bg-gray-800 rounded mb-2" />
                    <div className="h-8 w-12 bg-gray-800 rounded" />
                  </div>
                ))
            : statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-2xl hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">
                      {stat.label}
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex items-center justify-between bg-[#0f0f0f] border border-gray-800 p-5 rounded-2xl hover:bg-[#151515] hover:border-gray-700 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-primary/20 transition-all">
                      <action.icon className="h-5 w-5 text-gray-400 group-hover:text-primary transition-all" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Universities */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">
                Recent University Additions
              </h2>
              <Link
                href="/admin/universities"
                className="text-primary text-xs hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="bg-[#0f0f0f] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="divide-y divide-gray-800">
                {isLoading ? (
                  <div className="p-6 text-center text-gray-500">
                    Loading activity...
                  </div>
                ) : stats?.recentUniversities?.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No universities added yet.
                  </div>
                ) : (
                  stats?.recentUniversities?.map((u: any) => (
                    <div
                      key={u.id}
                      className="p-4 flex items-center justify-between hover:bg-[#151515] transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg',
                            u.logoColor || 'bg-gray-700'
                          )}
                        >
                          {u.logo}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                            {u.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {u.city}, {u.state}
                          </p>
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-600 font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications Placeholder */}
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-8 text-center">
          <div className="max-w-md mx-auto">
            <ClipboardList className="h-12 w-12 text-gray-800 mx-auto mb-4" />
            <h3 className="text-white font-bold mb-2">
              Student Activity Stream
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              As students begin shortlisting and applying through the portal,
              real-time activity metrics will populate this workspace.
            </p>
            <div className="flex justify-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
              <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
              <div className="h-1.5 w-1.5 rounded-full bg-primary/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
