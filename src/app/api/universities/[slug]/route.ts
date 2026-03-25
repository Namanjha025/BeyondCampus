import { NextRequest, NextResponse } from 'next/server';
import { UniversityService } from '@/services/universityService';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Check if slug is a UUID (to maintain backward compatibility for IDs)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    const university = isUuid 
      ? await UniversityService.getUniversityById(slug)
      : await UniversityService.getUniversityBySlug(slug);

    if (!university) {
      return NextResponse.json(
        { message: 'University not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(university);
  } catch (error) {
    console.error('Error fetching university:', error);
    return NextResponse.json(
      { message: 'Error fetching university' },
      { status: 500 }
    );
  }
}
