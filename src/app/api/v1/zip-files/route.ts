import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';
import archiver from 'archiver';
import { PassThrough } from 'stream';
import { ErrBadRequest } from '../../core/error.response';
import logger from '../../libs/logger';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const urls: string[] = body?.documents;

    if (!urls || !Array.isArray(urls)) {
      return ErrBadRequest('Missing document list');
    }

    const passthrough = new PassThrough(); //It is an intermediate stream that allows writing data into it (via the archive) and pushing it through the response.

    const fileName =
      process.env.NEXT_PUBLIC_ZIP_FILE_DOCUMENTS_NAME || 'documents.zip';

    const response = new NextResponse(passthrough as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=${fileName}`,
      },
    });

    const archive = archiver('zip', { zlib: { level: 9 } }); //The highest compression level.
    archive.pipe(passthrough);

    // Fetch and append each file
    for (const url of urls) {
      try {
        const fileStream = await axios.get(url, { responseType: 'stream' });
        const filename = url.split('/').pop() || 'file';
        archive.append(fileStream.data, { name: filename });
      } catch (error) {
        console.error(`Failed to fetch ${url}:`, (error as any).message);
      }
    }

    archive.finalize();
    return response;
  } catch (error) {
    logger.error('Error in zip-download route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};
