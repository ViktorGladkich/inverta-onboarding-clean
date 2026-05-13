import { NextRequest, NextResponse } from 'next/server';

// Helper: convert array to comma-separated string for Baserow
function arrayToString(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ');
  return String(value || '');
}

export async function POST(req: NextRequest) {
  // Baserow configuration via environment variables
  // Set these in Vercel Dashboard → Settings → Environment Variables
  const BASEROW_TOKEN = process.env.BASEROW_TOKEN;
  const BASEROW_TABLE_ID = process.env.BASEROW_TABLE_ID;
  const BASEROW_URL = process.env.BASEROW_URL || 'https://api.baserow.io';

  try {
    const data = await req.json();

    // ============================================
    // VALIDATION (basic — Firmenname is required)
    // ============================================
    if (!data.firmenname || data.firmenname.trim() === '') {
      return NextResponse.json(
        { error: 'Firmenname ist erforderlich' },
        { status: 400 }
      );
    }

    // ============================================
    // FORMAT DATA FOR BASEROW
    // Each column matches a field in your Baserow table
    // Baserow expects ALL fields as strings (long text columns recommended)
    // ============================================
    const baserowRow = {
      // Meta
      'Eingegangen am': new Date().toISOString(),
      'Status': 'Neu',

      // Step 1: Firma
      'Firmenname': data.firmenname,
      'Rechtsform': data.rechtsform || '',
      'Adresse': data.adresse || '',
      'PLZ & Stadt': data.plz_stadt || '',
      'HRB': data.hrb || '',
      'USt-ID': data.ust_id || '',
      'Steuernummer': data.steuernummer || '',
      'Geschäftsführer': data.geschaeftsfuehrer || '',
      'Gründungsdatum': data.gruendung || '',

      // Step 2: Kontakt
      'E-Mail Kontakt': data.email_kontakt || '',
      'Telefon': data.telefon || '',
      'WhatsApp': data.whatsapp || '',
      'DSGVO Name': data.dsgvo_name || '',
      'DSGVO E-Mail': data.dsgvo_email || '',
      'DSB vorhanden': data.dsb_vorhanden || '',
      'DSB Kontakt': data.dsb_kontakt || '',

      // Step 3: Sicherheit
      'Sicherheit Leistungen': arrayToString(data.sicherheit_leistungen),
      'Sicherheit Weitere': data.sicherheit_weitere || '',
      'Wachschein-Nr': data.wachschein_nr || '',
      'Haftpflicht': data.haftpflicht || '',
      'Sicherheit Zielgruppe': data.sicherheit_zielgruppe || '',
      'Sicherheit Gebiet': data.sicherheit_gebiet || '',
      'Sicherheit USP': data.sicherheit_usp || '',

      // Step 4: Reinigung
      'Reinigung Arten': arrayToString(data.reinigung_arten),
      'Reinigung Volumen': data.reinigung_volumen || '',
      'Reinigung Gebiet': data.reinigung_gebiet || '',

      // Step 5: Umzug
      'Umzug Arten': arrayToString(data.umzug_arten),
      'Umzug Region': arrayToString(data.umzug_region),
      'Umzug Zusatz': arrayToString(data.umzug_zusatz),
      'Umzug Formular': data.umzug_formular || '',

      // Step 6: Design
      'Primärfarbe': data.markenfarbe_primaer || '',
      'Sekundärfarbe': data.markenfarbe_sekundaer || '',
      'Weitere Farben': data.markenfarben_weitere || '',
      'Tonalität': arrayToString(data.tonalitaet),
      'Inspiration 1': data.inspiration_1 || '',
      'Inspiration 2': data.inspiration_2 || '',
      'Inspiration 3': data.inspiration_3 || '',
      'Vermeiden': data.vermeiden || '',

      // Step 7: Ziele
      'Hauptziel': data.hauptziel || '',
      'Priorität Sicherheit': data.prioritaet_sicherheit || '',
      'Priorität Reinigung': data.prioritaet_reinigung || '',
      'Priorität Umzug': data.prioritaet_umzug || '',
      'Kontaktwege': arrayToString(data.kontaktwege),
      'Google Business': data.google_business || '',
      'Social Media': data.social_media || '',
      'Konkurrenten': data.konkurrenten || '',
    };

    // ============================================
    // SEND TO BASEROW (if configured)
    // ============================================
    if (BASEROW_TOKEN && BASEROW_TABLE_ID) {
      const baseUrl = BASEROW_URL.endsWith('/') ? BASEROW_URL.slice(0, -1) : BASEROW_URL;
      const url = `${baseUrl}/api/database/rows/table/${BASEROW_TABLE_ID}/?user_field_names=true`;

      const baserowRes = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Token ${BASEROW_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(baserowRow),
      });

      if (!baserowRes.ok) {
        const errText = await baserowRes.text();
        console.error('Baserow error:', baserowRes.status, errText);
        return NextResponse.json(
          {
            error: 'Speichern fehlgeschlagen',
            detail: errText,
          },
          { status: 500 }
        );
      }

      const baserowData = await baserowRes.json();
      console.log('Baserow row created:', baserowData.id);

      return NextResponse.json({
        success: true,
        id: baserowData.id,
      });
    }

    // ============================================
    // FALLBACK: log to console if Baserow not configured
    // (useful for development / testing before API setup)
    // ============================================
    console.log('--- ONBOARDING SUBMISSION (Baserow not configured) ---');
    console.log(JSON.stringify(baserowRow, null, 2));
    console.log('---');

    return NextResponse.json({
      success: true,
      warning: 'Baserow nicht konfiguriert — Daten wurden geloggt aber nicht gespeichert',
    });
  } catch (err) {
    console.error('Submit handler error:', err);
    return NextResponse.json(
      {
        error: 'Ein Fehler ist aufgetreten',
        detail: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
