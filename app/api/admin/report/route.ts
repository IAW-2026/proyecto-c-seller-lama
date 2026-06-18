import { type NextRequest } from 'next/server';
import { jsonError, requireSuperAdmin } from '@/lib/api-auth';
import {
  buildAdminCsvReport,
  buildAdminPdfReport,
  getAdminReportData,
  getAdminReportSearchParams,
  getReportFilename,
  parseReportFormat,
} from '@/lib/admin/admin-report';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authResult = await requireSuperAdmin();
  if (!authResult.ok) return authResult.response;

  const format = parseReportFormat(request.nextUrl.searchParams.get('format'));
  const searchParams = getAdminReportSearchParams(request.nextUrl.searchParams);

  try {
    const report = await getAdminReportData(searchParams);
    const filename = getReportFilename(format, report.generatedAt);

    if (format === 'csv') {
      return new Response(buildAdminCsvReport(report), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    return new Response(buildAdminPdfReport(report), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error al generar reporte admin', error);
    return jsonError('No se pudo generar el reporte', 500);
  }
}
