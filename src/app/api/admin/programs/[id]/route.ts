import { NextRequest, NextResponse } from 'next/server';
import { ProgramService } from '@/services/programService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteProgramVector } from '@/lib/qdrant';

export async function PATCH(
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

    // 1. Update in DB
    const program = await ProgramService.updateProgram(id, data);

    // 2. Re-vectorize with updated data + re-stamp embeddedAt (non-fatal)
    await ProgramService.embedSingleProgram(program);

    // 3. Re-fetch so embeddedAt is current in the response
    const freshProgram = await ProgramService.getProgramById(program.id);

    return NextResponse.json(freshProgram);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { message: 'Error updating program' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // 1. Fetch universityId before deletion (needed for Qdrant cleanup)
    const program = await ProgramService.getProgramById(id);

    // 2. Delete from PostgreSQL
    await ProgramService.deleteProgram(id);

    // 3. Delete vector from Qdrant (non-fatal — logged internally)
    if (program) {
      await deleteProgramVector(program.universityId, id);
    }

    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { message: 'Error deleting program' },
      { status: 500 }
    );
  }
}
