import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { uploadImage } from '@/lib/utils/image-upload'

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    let user;
    try {
      user = await requireAdmin()
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { 
          error: 'Authentication failed', 
          details: authError instanceof Error ? authError.message : 'Unknown auth error' 
        },
        { status: 401 }
      )
    }

    // Parse the form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'league-logos'
    const folder = formData.get('folder') as string || ''

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    try {
      const result = await uploadImage(file, bucket, folder)
      
      return NextResponse.json({
        success: true,
        path: result.path,
        publicUrl: result.publicUrl
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      return NextResponse.json(
        { 
          error: error instanceof Error ? error.message : 'Failed to upload image' 
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Unexpected error uploading image:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload image', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}