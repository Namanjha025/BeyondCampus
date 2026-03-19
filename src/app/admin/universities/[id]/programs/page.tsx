'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  ArrowLeft,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  DollarSign,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle2,
  Database,
  Brain,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ProgramFormModal from '../../../../../components/admin/ProgramFormModal';

export default function ProgramManagementPage() {
  const params = useParams();
  const universityId = params.id as string;

  const [university, setUniversity] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [vectorizingId, setVectorizingId] = useState<string | null>(null);


  useEffect(() => {
    fetchData();
  }, [universityId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/universities/${universityId}`);
      if (response.ok) {
        const data = await response.json();
        setUniversity(data);
        setPrograms(data.programs || []);
      }
    } catch (error) {
      console.error('Error fetching university/programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      const response = await fetch(`/api/admin/programs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };
  
  const handleVectorize = async (id: string) => {
    setVectorizingId(id);
    try {
      // Calling PATCH with empty data triggers re-vectorization on the backend
      const response = await fetch(`/api/admin/programs/${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (response.ok) {
        const updatedProgram = await response.json();
        setPrograms((prev) => prev.map((p) => p.id === id ? updatedProgram : p));
      }
    } catch (error) {
      console.error('Error vectorizing program:', error);
    } finally {
      setVectorizingId(null);
    }
  };

  const filteredPrograms = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalPrograms = programs.length;
  const vectorized = programs.filter((p) => p.embeddedAt).length;
  const notVectorized = totalPrograms - vectorized;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading programs...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/universities"
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Universities
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg',
                  university?.logoColor || 'bg-gray-700'
                )}
              >
                {university?.logo}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Manage Programs</h1>
                <p className="text-gray-400">{university?.name}</p>
              </div>
            </div>
            <Button
              onClick={() => { setEditingProgram(null); setIsModalOpen(true); }}
              className="bg-primary hover:bg-primary/90 text-white gap-2"
            >
              <Plus className="h-4 w-4" /> Add Program
            </Button>
          </div>
        </div>

        {/* Pipeline Status Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalPrograms}</p>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">In Database</p>
            </div>
          </div>
          <div className="bg-[#0f0f0f] border border-emerald-500/20 rounded-xl p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-emerald-500/10">
              <Brain className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{vectorized}</p>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">Vectorized</p>
            </div>
          </div>
          <div className={cn(
            "bg-[#0f0f0f] border rounded-xl p-5 flex items-center gap-4",
            notVectorized > 0 ? "border-amber-500/20" : "border-gray-800"
          )}>
            <div className={cn(
              "p-2.5 rounded-lg",
              notVectorized > 0 ? "bg-amber-500/10" : "bg-gray-800"
            )}>
              <AlertCircle className={cn("h-5 w-5", notVectorized > 0 ? "text-amber-500" : "text-gray-600")} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{notVectorized}</p>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">Not Vectorized</p>
            </div>
          </div>
        </div>

        {/* Pipeline info banner if some not vectorized */}
        {notVectorized > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-400">
              <strong>{notVectorized} program{notVectorized > 1 ? 's' : ''}</strong> {notVectorized > 1 ? 'have' : 'has'} not been vectorized yet. 
              Go to{' '}
              <Link href={`/admin/universities/${universityId}/knowledge`} className="underline underline-offset-2 hover:text-amber-300">
                Manage Knowledge
              </Link>
              {' '}and click <strong>"Sync with Intelligence AI"</strong> to run the full pipeline.
            </p>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search programs by name or department…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#0f0f0f] border-gray-800 focus:border-primary/50 text-white w-full"
            />
          </div>
        </div>

        {/* Programs Table */}
        {filteredPrograms.length === 0 ? (
          <div className="py-20 text-center bg-[#0f0f0f] border border-gray-800 rounded-2xl text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No programs found for this university.</p>
          </div>
        ) : (
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-[#151515]/50">
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Program</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Degree</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Duration</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Tuition / yr</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">AI Status</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredPrograms.map((p) => (
                  <tr key={p.id} className="hover:bg-[#151515] transition-colors group">
                    {/* Name + dept */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white group-hover:text-primary transition-colors leading-tight">
                          {p.name}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">{p.department || 'General Department'}</span>
                      </div>
                    </td>

                    {/* Degree badge */}
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">
                        {p.degreeType}
                      </Badge>
                    </td>

                    {/* Duration */}
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {p.durationMonths ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-gray-600" />
                          {p.durationMonths} mo
                        </div>
                      ) : (
                        <span className="text-gray-700">—</span>
                      )}
                    </td>

                    {/* Tuition */}
                    <td className="px-6 py-4 text-sm">
                      {p.tuitionPerYear ? (
                        <div className="flex items-center gap-1 font-semibold text-emerald-500/90">
                          <DollarSign className="h-3.5 w-3.5" />
                          {p.tuitionPerYear.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-gray-700">—</span>
                      )}
                    </td>

                    {/* AI Pipeline Status */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        {/* Always in DB if shown */}
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-amber-500 shrink-0" />
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Extracted</span>
                        </div>

                        {/* Vectorized or not */}
                        <div className="flex items-center gap-2">
                          {vectorizingId === p.id ? (
                            <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shrink-0" />
                          ) : p.embeddedAt ? (
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] shrink-0" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-gray-600 shrink-0" />
                          )}
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            p.embeddedAt ? "text-emerald-500" : "text-gray-600"
                          )}>
                            {vectorizingId === p.id ? 'Processing...' : 'Vectorized'}
                          </span>
                          
                          {/* Individual Vectorize Action */}
                          <button
                            onClick={() => handleVectorize(p.id)}
                            disabled={!!vectorizingId}
                            className={cn(
                              "p-1 rounded-md hover:bg-white/10 transition-colors ml-auto",
                              vectorizingId ? "opacity-30 cursor-not-allowed" : "opacity-50 hover:opacity-100"
                            )}
                            title="Re-vectorize this program"
                          >
                            <RotateCcw className={cn("h-2.5 w-2.5 text-gray-400", vectorizingId === p.id && "animate-spin")} />
                          </button>
                        </div>

                        {/* Apply link status */}
                        {p.applyUrl && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-3 w-3 text-sky-400 shrink-0" />
                            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Apply Link ✓</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditingProgram(p); setIsModalOpen(true); }}
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(p.id)}
                          className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        {filteredPrograms.length > 0 && (
          <div className="mt-4 flex items-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-primary" />
              <span>Extracted = saved in database</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Vectorized = in Qdrant (semantic AI search enabled)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              <span>Not Vectorized = not yet embedded</span>
            </div>
          </div>
        )}
      </div>

      <ProgramFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        universityId={universityId}
        program={editingProgram}
      />
    </div>
  );
}
