import Link from 'next/link'
import { GraduationCap, Users, LayoutDashboard, Database, Upload } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Universities', value: '8', icon: GraduationCap },
    { label: 'Total Programs', value: '42', icon: Database },
    { label: 'Total Students', value: '1,234', icon: Users },
  ]

  const actions = [
    { 
      title: 'Manage Universities', 
      description: 'Add, edit, or remove university profiles', 
      href: '/admin/universities',
      icon: GraduationCap 
    },
    { 
      title: 'Data Ingestion', 
      description: 'Upload and index scraped .md documents', 
      href: '/admin/ingestion',
      icon: Upload 
    },
    { 
      title: 'User Management', 
      description: 'Review student applications and profiles', 
      href: '/admin/users',
      icon: Users 
    }
  ]

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actions.map((action) => (
            <Link 
              key={action.title} 
              href={action.href}
              className="group bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl hover:bg-[#151515] hover:border-gray-700 transition-all"
            >
              <div className="p-3 bg-gray-800/50 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-all">
                <action.icon className="h-6 w-6 text-gray-400 group-hover:text-primary transition-all" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
