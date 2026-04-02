import { NextRequest, NextResponse } from 'next/server';
import { ProgramService } from '@/services/programService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // 1. Save to DB
    const program = await ProgramService.createProgram(id, data);

    // 2. Embed into Qdrant + stamp embeddedAt (non-fatal)
    await ProgramService.embedSingleProgram(program);

    // 3. Re-fetch so embeddedAt is included in the response
    const freshProgram = await ProgramService.getProgramById(program.id);

    return NextResponse.json(freshProgram, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { message: 'Error creating program' },
      { status: 500 }
    );
  }
}
