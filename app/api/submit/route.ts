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

      // Step 1: Firma & Rechtsform
      'Firmenname': data.firmenname,
      'Rechtsform': data.rechtsform || '',
      'Rechtsform Sonstiges': data.rechtsform_sonstiges || '',
      'Geschäftsführer': data.geschaeftsfuehrer || '',
      'Straße': data.strasse || '',
      'PLZ & Stadt': data.plz_stadt || '',
      'Bundesland': data.bundesland || '',
      'Registergericht': data.registergericht || '',
      'HRB': data.hrb || '',
      'USt-ID': data.ust_id || '',
      'Steuernummer': data.steuernummer || '',
      'Wirtschafts-ID': data.wirtschafts_id || '',
      'Gründungsjahr': data.gruendungsjahr || '',

      // Step 2: Kontakt & Erreichbarkeit
      'Telefon': data.telefon || '',
      'Notfall-Nummer': data.notfall_nummer || '',
      'E-Mail Kontakt': data.email_kontakt || '',
      'E-Mail Datenschutz': data.email_datenschutz || '',
      'Öffnung Mo-Fr': data.oeffnung_mo_fr || '',
      'Öffnung Sa': data.oeffnung_sa || '',
      'Öffnung So': data.oeffnung_so || '',
      'Einsatz 24/7': data.einsatz_24_7 || '',
      'Domain': data.domain || '',
      'Domain gekauft': data.domain_gekauft || '',

      // Step 3: Genehmigungen & Versicherung
      'Bewachung Behörde': data.bewachung_behoerde || '',
      'Bewachung Aktenzeichen': data.bewachung_aktenzeichen || '',
      'Bewachung Datum': data.bewachung_datum || '',
      'Bewacher-ID': data.bewacher_id || '',
      'Aufsichtsbehörde': data.aufsichtsbehoerde || '',
      'Haftpflicht Versicherung': data.haftpflicht_versicherung || '',
      'Haftpflicht Geltungsbereich': data.haftpflicht_geltungsbereich || '',
      'Haftpflicht Summe': data.haftpflicht_summe || '',
      'Zertifizierungen': arrayToString(data.zertifizierungen),
      'Zertifizierungen Sonstiges': data.zertifizierungen_sonstiges || '',

      // Step 4: Leistungen
      'Leistungen': arrayToString(data.leistungen),
      'Leistungen Sonstiges': data.leistungen_sonstiges || '',
      'Leistungen Beschreibung': data.leistungen_beschreibung || '',
      'Einsatzgebiet': data.einsatzgebiet || '',
      'Einsatzgebiet Sonstiges': data.einsatzgebiet_sonstiges || '',

      // Step 5: Über das Unternehmen
      'Mitarbeiter Anzahl': data.mitarbeiter_anzahl || '',
      'Kunden Anzahl': data.kunden_anzahl || '',
      'Firmengeschichte': data.firmengeschichte || '',
      'Slogan': data.slogan || '',
      'Sprachen': arrayToString(data.sprachen),
      'Sprachen Sonstiges': data.sprachen_sonstiges || '',

      // Step 6: Datenschutz & Hosting
      'Verantwortlicher abweichend': data.verantwortlicher_abweichend || '',
      'Verantwortlicher Details': data.verantwortlicher_details || '',
      'DSB vorhanden': data.dsb_vorhanden || '',
      'DSB Kontakt': data.dsb_kontakt || '',
      'Tools Website': arrayToString(data.tools_website),
      'Tools Newsletter': data.tools_newsletter || '',
      'Tools Buchung': data.tools_buchung || '',
      'Tools Sonstiges': data.tools_sonstiges || '',
      'Hosting': data.hosting || '',
      'Hosting Anbieter': data.hosting_anbieter || '',
      'Hosting Standort': data.hosting_standort || '',

      // Step 7: Medien, Social Media & Kontaktformular
      'Bildmaterial': data.bildmaterial || '',
      'Hauptfarbe': data.hauptfarbe || '',
      'Instagram': data.instagram || '',
      'Facebook': data.facebook || '',
      'LinkedIn': data.linkedin || '',
      'Xing': data.xing || '',
      'TikTok': data.tiktok || '',
      'YouTube': data.youtube || '',
      'Google Business': data.google_business || '',
      'Kontaktanfragen E-Mail': data.kontaktanfragen_email || '',
      'Kontakt WhatsApp Pref': data.kontakt_whatsapp_pref || '',
      'Kontakt WhatsApp Nr': data.kontakt_whatsapp_nr || '',
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
