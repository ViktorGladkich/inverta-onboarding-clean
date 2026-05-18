'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';
import {
  Input,
  TextArea,
  Checkbox,
  RadioGroup,
  SectionHeading,
  FieldGroupLabel,
} from './FormFields';

// ============================================
// FORM DATA SHAPE — PROSECURE
// ============================================
export interface FormData {
  // Step 1: Firma & Rechtsform
  firmenname: string;
  rechtsform: string;
  rechtsform_sonstiges: string;
  geschaeftsfuehrer: string;
  strasse: string;
  plz_stadt: string;
  bundesland: string;
  registergericht: string;
  hrb: string;
  ust_id: string;
  steuernummer: string;
  wirtschafts_id: string;
  gruendungsjahr: string;

  // Step 2: Kontaktdaten & Erreichbarkeit
  telefon: string;
  notfall_nummer: string;
  email_kontakt: string;
  email_datenschutz: string;
  oeffnung_mo_fr: string;
  oeffnung_sa: string;
  oeffnung_so: string;
  einsatz_24_7: string;
  domain: string;
  domain_gekauft: string;

  // Step 3: Genehmigungen & Versicherung
  bewachung_behoerde: string;
  bewachung_aktenzeichen: string;
  bewachung_datum: string;
  bewacher_id: string;
  aufsichtsbehoerde: string;
  haftpflicht_versicherung: string;
  haftpflicht_geltungsbereich: string;
  haftpflicht_summe: string;
  zertifizierungen: string[];
  zertifizierungen_sonstiges: string;

  // Step 4: Leistungen
  leistungen: string[];
  leistungen_sonstiges: string;
  leistungen_beschreibung: string;
  einsatzgebiet: string;
  einsatzgebiet_sonstiges: string;

  // Step 5: Über das Unternehmen
  mitarbeiter_anzahl: string;
  kunden_anzahl: string;
  firmengeschichte: string;
  slogan: string;
  sprachen: string[];
  sprachen_sonstiges: string;

  // Step 6: Datenschutz & Hosting
  verantwortlicher_abweichend: string;
  verantwortlicher_details: string;
  dsb_vorhanden: string;
  dsb_kontakt: string;
  tools_website: string[];
  tools_newsletter: string;
  tools_buchung: string;
  tools_sonstiges: string;
  hosting: string;
  hosting_anbieter: string;
  hosting_standort: string;

  // Step 7: Medien, Social Media & Kontaktformular
  bildmaterial: string;
  hauptfarbe: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  xing: string;
  tiktok: string;
  youtube: string;
  google_business: string;
  kontaktanfragen_email: string;
  kontakt_whatsapp_pref: string;
  kontakt_whatsapp_nr: string;
}

const initialFormData: FormData = {
  firmenname: '',
  rechtsform: '',
  rechtsform_sonstiges: '',
  geschaeftsfuehrer: '',
  strasse: '',
  plz_stadt: '',
  bundesland: '',
  registergericht: '',
  hrb: '',
  ust_id: '',
  steuernummer: '',
  wirtschafts_id: '',
  gruendungsjahr: '',
  telefon: '',
  notfall_nummer: '',
  email_kontakt: '',
  email_datenschutz: '',
  oeffnung_mo_fr: '',
  oeffnung_sa: '',
  oeffnung_so: '',
  einsatz_24_7: '',
  domain: '',
  domain_gekauft: '',
  bewachung_behoerde: '',
  bewachung_aktenzeichen: '',
  bewachung_datum: '',
  bewacher_id: '',
  aufsichtsbehoerde: '',
  haftpflicht_versicherung: '',
  haftpflicht_geltungsbereich: '',
  haftpflicht_summe: '',
  zertifizierungen: [],
  zertifizierungen_sonstiges: '',
  leistungen: [],
  leistungen_sonstiges: '',
  leistungen_beschreibung: '',
  einsatzgebiet: '',
  einsatzgebiet_sonstiges: '',
  mitarbeiter_anzahl: '',
  kunden_anzahl: '',
  firmengeschichte: '',
  slogan: '',
  sprachen: [],
  sprachen_sonstiges: '',
  verantwortlicher_abweichend: '',
  verantwortlicher_details: '',
  dsb_vorhanden: '',
  dsb_kontakt: '',
  tools_website: [],
  tools_newsletter: '',
  tools_buchung: '',
  tools_sonstiges: '',
  hosting: '',
  hosting_anbieter: '',
  hosting_standort: '',
  bildmaterial: '',
  hauptfarbe: '',
  instagram: '',
  facebook: '',
  linkedin: '',
  xing: '',
  tiktok: '',
  youtube: '',
  google_business: '',
  kontaktanfragen_email: '',
  kontakt_whatsapp_pref: '',
  kontakt_whatsapp_nr: '',
};

const STORAGE_KEY = 'prosecure_onboarding_data';

const TOTAL_STEPS = 7;

const STEP_TITLES = [
  'Firma',
  'Kontakt',
  'Zulassung',
  'Leistungen',
  'Über uns',
  'Datenschutz',
  'Online',
];

// ============================================
// MAIN WIZARD
// ============================================
export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved data on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({ ...initialFormData, ...parsed });
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  // Save on every change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: keyof FormData, value: string) => {
    setData((prev) => {
      const current = prev[key] as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const back = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Fehler beim Senden');
      }
      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler');
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // SUCCESS SCREEN
  // ============================================
  if (submitted) {
    return (
      <main className="relative min-h-dvh flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
        {/* Background Images with smooth cross-fade */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[var(--color-bg-black)]">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.15, scale: 1 }}
            className="absolute inset-0 bg-no-repeat bg-center bg-[size:90%] sm:bg-[size:40%]"
            style={{ backgroundImage: `url(/pixolite10.png)` }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-black)]/40 via-[var(--color-bg-black)]/20 to-[var(--color-bg-black)]/60" />
        </div>

        <div className="relative z-10 max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-8 rounded-full bg-[var(--color-bg-lime)] flex items-center justify-center glow-lime"
            >
              <Check
                className="w-10 h-10 text-[var(--color-text-black)]"
                strokeWidth={3}
              />
            </motion.div>

            <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-bg-lime)] mb-3">
              — VIELEN DANK
            </p>

            <h1 className="font-display font-bold text-5xl leading-tight mb-2">
              BRIEF
            </h1>
            <h1 className="font-serif italic text-5xl text-[var(--color-bg-lime)] font-normal mb-6">
              empfangen.
            </h1>

            <p className="text-[var(--color-text-gray)] mb-8 leading-relaxed">
              Wir haben Ihre Angaben erhalten und melden uns innerhalb von 24
              Stunden mit den nächsten Schritten — inkl. Termin für ein Kickoff-Gespräch.
            </p>

            <div className="border-t border-[var(--color-border-subtle)] pt-6 text-left">
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-gray)] mb-3">
                — INVERTA DIGITAL
              </p>
              <p className="text-sm text-[var(--color-text-white)] font-bold">
                info@invertadigital.de
              </p>
              <p className="text-sm text-[var(--color-text-gray)]">
                +49 176 70428834
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // ============================================
  // FORM CONTENT
  // ============================================
  const progressPercent = ((step + 1) / TOTAL_STEPS) * 100;

  const bgImages = [
    '/pixolite1.png', // Step 0: Firma
    '/pixolite2.png', // Step 1: Kontakt
    '/pixolite3.png', // Step 2: Zulassung
    '/pixolite8.png', // Step 3: Leistungen
    '/pixolite5.png', // Step 4: Über uns
    '/pixolite6.png', // Step 5: Datenschutz
    '/pixolite7.png', // Step 6: Online
  ];
  const bgImage = bgImages[step] || '/pixolite1.png';

  return (
    <main className="relative min-h-dvh flex flex-col overflow-hidden">
      {/* Background Images with smooth cross-fade */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[var(--color-bg-black)]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={bgImage}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 0.25, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 bg-no-repeat bg-center bg-[size:90%] sm:bg-[size:40%]"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-black)]/50 via-[var(--color-bg-black)]/10 to-[var(--color-bg-black)]/60" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-[var(--color-bg-black)]/95 backdrop-blur-md border-b border-[var(--color-border-subtle)]">
          <div className="max-w-2xl mx-auto px-5 sm:px-8 py-0 flex items-center justify-between">
            <Logo className="h-7 w-auto text-white" />
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-gray)]">
                {String(step + 1).padStart(2, '0')} / {String(TOTAL_STEPS).padStart(2, '0')}
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-[2px] bg-[var(--color-border-subtle)]">
            <motion.div
              className="progress-bar h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </header>

        {/* STEP INDICATOR */}
        <div className="max-w-2xl w-full mx-auto px-5 sm:px-8 py-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {STEP_TITLES.map((title, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`
                  flex-shrink-0 font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm transition-all
                  ${
                    i === step
                      ? 'bg-[var(--color-bg-lime)] text-[var(--color-text-black)] font-bold'
                      : i < step
                      ? 'text-[var(--color-bg-lime)]'
                      : 'text-[var(--color-text-dim)]'
                  }
                `}
              >
                {String(i + 1).padStart(2, '0')} {title}
              </button>
            ))}
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="flex-1 max-w-2xl w-full mx-auto px-5 sm:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && <Step1Firma data={data} update={update} />}
              {step === 1 && <Step2Kontakt data={data} update={update} />}
              {step === 2 && (
                <Step3Zulassung
                  data={data}
                  update={update}
                  toggleArray={toggleArray}
                />
              )}
              {step === 3 && (
                <Step4Leistungen
                  data={data}
                  update={update}
                  toggleArray={toggleArray}
                />
              )}
              {step === 4 && (
                <Step5UeberUns
                  data={data}
                  update={update}
                  toggleArray={toggleArray}
                />
              )}
              {step === 5 && (
                <Step6Datenschutz
                  data={data}
                  update={update}
                  toggleArray={toggleArray}
                />
              )}
              {step === 6 && <Step7Online data={data} update={update} />}
            </motion.div>
          </AnimatePresence>

          {/* ERROR MESSAGE */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-start gap-3 p-4 bg-[var(--color-critical)]/10 border border-[var(--color-critical)]/40 rounded-sm"
            >
              <AlertCircle className="w-5 h-5 text-[var(--color-critical)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--color-text-white)]">{error}</p>
            </motion.div>
          )}
        </div>

        {/* NAVIGATION (sticky bottom on mobile) */}
        <footer className="sticky bottom-0 z-40 bg-[var(--color-bg-black)]/95 backdrop-blur-md border-t border-[var(--color-border-subtle)]">
          <div className="max-w-2xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-3">
            <button
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-text-gray)] hover:text-[var(--color-bg-lime)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Zurück</span>
            </button>

            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--color-bg-lime)] text-[var(--color-text-black)] font-mono text-xs uppercase tracking-wider font-bold hover:bg-[var(--color-bg-lime-dark)] transition-colors"
              >
                Weiter
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--color-bg-lime)] text-[var(--color-text-black)] font-mono text-xs uppercase tracking-wider font-bold hover:bg-[var(--color-bg-lime-dark)] disabled:opacity-50 transition-colors"
              >
                {submitting ? (
                  'Sende...'
                ) : (
                  <>
                    Brief absenden
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  </>
                )}
              </button>
            )}
          </div>
        </footer>
      </div>
    </main>
  );
}

// ============================================
// STEP COMPONENTS
// ============================================

function Step1Firma({
  data,
  update,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 01 / FIRMA"
        title="FIRMEN-"
        italic="daten."
        priority="KRITISCH"
        description="Für das Impressum, Verträge und die rechtssichere Umsetzung Ihrer Website."
      />

      <Input
        label="Vollständiger, eingetragener Firmenname"
        name="firmenname"
        value={data.firmenname}
        onChange={(v) => update('firmenname', v)}
        required
        placeholder="z.B. ProSecure GmbH"
        hint="z.B. ProSecure GmbH / UG (haftungsbeschränkt) / e.K. / Max Mustermann – ProSecure"
      />

      <RadioGroup
        label="Rechtsform"
        name="rechtsform"
        value={data.rechtsform}
        onChange={(v) => update('rechtsform', v)}
        options={[
          { value: 'gmbh', label: 'GmbH' },
          { value: 'ug', label: 'UG (haftungsbeschränkt)' },
          { value: 'gbr', label: 'GbR' },
          { value: 'einzel', label: 'Einzelunternehmen / e.K.' },
          { value: 'sonstiges', label: 'Sonstiges' },
        ]}
      />

      {data.rechtsform === 'sonstiges' && (
        <Input
          label="Rechtsform — bitte angeben"
          name="rechtsform_sonstiges"
          value={data.rechtsform_sonstiges}
          onChange={(v) => update('rechtsform_sonstiges', v)}
        />
      )}

      <Input
        label="Geschäftsführer / verantwortlicher Inhaber (V.i.S.d. § 5 TMG)"
        name="geschaeftsfuehrer"
        value={data.geschaeftsfuehrer}
        onChange={(v) => update('geschaeftsfuehrer', v)}
        required
        placeholder="Vor- und Nachname"
      />

      <FieldGroupLabel>Geschäftsadresse (Hauptsitz)</FieldGroupLabel>

      <Input
        label="Straße & Hausnummer"
        name="strasse"
        value={data.strasse}
        onChange={(v) => update('strasse', v)}
        required
        placeholder="Musterstraße 1"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="PLZ & Ort"
          name="plz_stadt"
          value={data.plz_stadt}
          onChange={(v) => update('plz_stadt', v)}
          required
          placeholder="01217 Dresden"
        />
        <Input
          label="Bundesland"
          name="bundesland"
          value={data.bundesland}
          onChange={(v) => update('bundesland', v)}
          placeholder="z.B. Sachsen"
        />
      </div>

      <FieldGroupLabel>Handelsregister (falls GmbH / UG / e.K.)</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Registergericht"
          name="registergericht"
          value={data.registergericht}
          onChange={(v) => update('registergericht', v)}
          placeholder="z.B. Amtsgericht Dresden"
        />
        <Input
          label="Handelsregisternummer"
          name="hrb"
          value={data.hrb}
          onChange={(v) => update('hrb', v)}
          placeholder="z.B. HRB 12345"
        />
      </div>

      <FieldGroupLabel>Steuerliche Angaben</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Umsatzsteuer-ID (§ 27a UStG)"
          name="ust_id"
          value={data.ust_id}
          onChange={(v) => update('ust_id', v)}
          placeholder="DE123456789"
        />
        <Input
          label="Steuernummer (falls keine USt-IdNr.)"
          name="steuernummer"
          value={data.steuernummer}
          onChange={(v) => update('steuernummer', v)}
          placeholder="000/000/00000"
        />
      </div>

      <Input
        label="Wirtschafts-ID (sofern vorhanden)"
        name="wirtschafts_id"
        value={data.wirtschafts_id}
        onChange={(v) => update('wirtschafts_id', v)}
      />

      <Input
        label="Gründungsjahr des Unternehmens"
        name="gruendungsjahr"
        value={data.gruendungsjahr}
        onChange={(v) => update('gruendungsjahr', v)}
        placeholder="z.B. 2018"
        hint={'Aktuell steht im Code „seit 2008" — bitte korrigieren.'}
      />
    </div>
  );
}

function Step2Kontakt({
  data,
  update,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 02 / KONTAKT"
        title="KONTAKT &"
        italic="Erreichbarkeit."
        priority="KRITISCH"
        description="Kontaktdaten für Impressum, Kontaktseite und Footer."
      />

      <FieldGroupLabel>Telefon</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Telefon (Hauptkontakt, geschäftlich)"
          name="telefon"
          type="tel"
          value={data.telefon}
          onChange={(v) => update('telefon', v)}
          required
        />
        <Input
          label="Notfall- / 24h-Nummer (falls separat)"
          name="notfall_nummer"
          type="tel"
          value={data.notfall_nummer}
          onChange={(v) => update('notfall_nummer', v)}
        />
      </div>

      <FieldGroupLabel>E-Mail</FieldGroupLabel>

      <Input
        label="Offizielle E-Mail-Adresse"
        name="email_kontakt"
        type="email"
        value={data.email_kontakt}
        onChange={(v) => update('email_kontakt', v)}
        required
        placeholder="kontakt@prosecure-dresden.de"
        hint="Aktueller Platzhalter: kontakt@prosecure-dresden.de"
      />

      <Input
        label="Datenschutz-E-Mail (falls separat)"
        name="email_datenschutz"
        type="email"
        value={data.email_datenschutz}
        onChange={(v) => update('email_datenschutz', v)}
      />

      <FieldGroupLabel>Öffnungs- / Erreichbarkeitszeiten Büro</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Input
          label="Mo – Fr"
          name="oeffnung_mo_fr"
          value={data.oeffnung_mo_fr}
          onChange={(v) => update('oeffnung_mo_fr', v)}
          placeholder="z.B. 08:00 – 18:00"
        />
        <Input
          label="Samstag"
          name="oeffnung_sa"
          value={data.oeffnung_sa}
          onChange={(v) => update('oeffnung_sa', v)}
          placeholder="z.B. geschlossen"
        />
        <Input
          label="Sonntag"
          name="oeffnung_so"
          value={data.oeffnung_so}
          onChange={(v) => update('oeffnung_so', v)}
          placeholder="z.B. geschlossen"
        />
      </div>

      <RadioGroup
        label="Einsatzbereitschaft 24/7?"
        name="einsatz_24_7"
        value={data.einsatz_24_7}
        onChange={(v) => update('einsatz_24_7', v)}
        options={[
          { value: 'ja', label: 'Ja — wir sind rund um die Uhr erreichbar' },
          { value: 'nein', label: 'Nein' },
        ]}
      />

      <FieldGroupLabel>Internetdomain</FieldGroupLabel>

      <Input
        label="Gewünschte Domain"
        name="domain"
        value={data.domain}
        onChange={(v) => update('domain', v)}
        placeholder="z.B. prosecure-dresden.de"
        hint="Aktueller Platzhalter: prosecure-dresden.de"
      />

      <RadioGroup
        label="Haben Sie die Domain bereits gekauft?"
        name="domain_gekauft"
        value={data.domain_gekauft}
        onChange={(v) => update('domain_gekauft', v)}
        options={[
          { value: 'ja', label: 'Ja, bereits registriert' },
          { value: 'nein', label: 'Nein, bitte übernehmen' },
        ]}
      />
    </div>
  );
}

function Step3Zulassung({
  data,
  update,
  toggleArray,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggleArray: (key: keyof FormData, value: string) => void;
}) {
  const zertOptions = [
    'DIN 77200',
    'ISO 9001',
    'BDSW-Mitglied',
    'IHK-Sachkundeprüfung § 34a',
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 03 / ZULASSUNG"
        title="GENEHMIGUNGEN &"
        italic="Versicherung."
        priority="KRITISCH"
        description="Pflichtangaben nach § 34a GewO für das Bewachungsgewerbe."
      />

      <FieldGroupLabel>Bewachungserlaubnis nach § 34a GewO</FieldGroupLabel>

      <Input
        label="Erteilende Behörde"
        name="bewachung_behoerde"
        value={data.bewachung_behoerde}
        onChange={(v) => update('bewachung_behoerde', v)}
        placeholder="z.B. Landesdirektion Sachsen, Ordnungsamt Dresden"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Aktenzeichen / Erlaubnisnummer"
          name="bewachung_aktenzeichen"
          value={data.bewachung_aktenzeichen}
          onChange={(v) => update('bewachung_aktenzeichen', v)}
        />
        <Input
          label="Datum der Erteilung"
          name="bewachung_datum"
          value={data.bewachung_datum}
          onChange={(v) => update('bewachung_datum', v)}
          placeholder="TT.MM.JJJJ"
        />
      </div>

      <FieldGroupLabel>Bewacherregister & Aufsicht</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Bewacher-ID des Unternehmens (BWR)"
          name="bewacher_id"
          value={data.bewacher_id}
          onChange={(v) => update('bewacher_id', v)}
        />
        <Input
          label="Zuständige Aufsichtsbehörde"
          name="aufsichtsbehoerde"
          value={data.aufsichtsbehoerde}
          onChange={(v) => update('aufsichtsbehoerde', v)}
        />
      </div>

      <FieldGroupLabel>Berufshaftpflichtversicherung</FieldGroupLabel>

      <Input
        label="Versicherung (Name)"
        name="haftpflicht_versicherung"
        value={data.haftpflicht_versicherung}
        onChange={(v) => update('haftpflicht_versicherung', v)}
        placeholder="z.B. HDI, Allianz, Gothaer..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Geltungsbereich"
          name="haftpflicht_geltungsbereich"
          value={data.haftpflicht_geltungsbereich}
          onChange={(v) => update('haftpflicht_geltungsbereich', v)}
          placeholder="z.B. Deutschland / EU"
        />
        <Input
          label="Versicherungssumme"
          name="haftpflicht_summe"
          value={data.haftpflicht_summe}
          onChange={(v) => update('haftpflicht_summe', v)}
          placeholder="z.B. 3.000.000 €"
        />
      </div>

      <FieldGroupLabel>
        Zertifizierungen & Mitgliedschaften (vertrauensbildend)
      </FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {zertOptions.map((opt) => (
          <Checkbox
            key={opt}
            label={opt}
            checked={data.zertifizierungen.includes(opt)}
            onChange={() => toggleArray('zertifizierungen', opt)}
          />
        ))}
      </div>

      <Input
        label="Sonstige Zertifizierungen"
        name="zertifizierungen_sonstiges"
        value={data.zertifizierungen_sonstiges}
        onChange={(v) => update('zertifizierungen_sonstiges', v)}
      />
    </div>
  );
}

function Step4Leistungen({
  data,
  update,
  toggleArray,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggleArray: (key: keyof FormData, value: string) => void;
}) {
  const leistungsOptions = [
    'Baustellenbewachung',
    'Objektschutz / Werkschutz / Revierdienst',
    'Alarmaufschaltung / 24h Notruf-Service',
    'Veranstaltungs- / Eventsicherheit',
    'Personenschutz',
    'Ladendetektiv / Kaufhausdetektiv',
    'Empfangsdienst / Pförtnerdienst',
    'City-Streife / Revier-Streifendienst',
    'Geld- und Werttransport',
    'Brandwache',
    'Asyl- / Flüchtlingsunterkünfte',
    'Sicherheitsberatung',
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 04 / LEISTUNGEN"
        title="SICHERHEITS-"
        italic="leistungen."
        priority="KRITISCH"
        description="Aktuell zeigt die Website 4 Leistungen: Baustellenbewachung, Objektschutz, Alarmaufschaltung, Eventsicherheit. Bitte bestätigen oder ergänzen."
      />

      <FieldGroupLabel>
        Welche dieser Leistungen bieten Sie tatsächlich an? (Mehrfachauswahl)
      </FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {leistungsOptions.map((opt) => (
          <Checkbox
            key={opt}
            label={opt}
            checked={data.leistungen.includes(opt)}
            onChange={() => toggleArray('leistungen', opt)}
          />
        ))}
      </div>

      <Input
        label="Sonstige Leistungen"
        name="leistungen_sonstiges"
        value={data.leistungen_sonstiges}
        onChange={(v) => update('leistungen_sonstiges', v)}
      />

      <TextArea
        label="Bitte 2–4 Sätze zu JEDER angebotenen Leistung"
        name="leistungen_beschreibung"
        value={data.leistungen_beschreibung}
        onChange={(v) => update('leistungen_beschreibung', v)}
        rows={10}
        placeholder={
          'Leistung 1: ...\nBeschreibung: Was wird genau angeboten, für wen, welche Besonderheiten?\n\nLeistung 2: ...\nBeschreibung: ...'
        }
      />

      <RadioGroup
        label="In welchem Einsatzgebiet sind Sie tätig?"
        name="einsatzgebiet"
        value={data.einsatzgebiet}
        onChange={(v) => update('einsatzgebiet', v)}
        options={[
          { value: 'dresden', label: 'Nur Dresden' },
          { value: 'sachsen', label: 'Großraum Dresden / Sachsen' },
          { value: 'bundesweit', label: 'Bundesweit' },
          { value: 'sonstiges', label: 'Sonstiges' },
        ]}
      />

      {data.einsatzgebiet === 'sonstiges' && (
        <Input
          label="Einsatzgebiet — bitte angeben"
          name="einsatzgebiet_sonstiges"
          value={data.einsatzgebiet_sonstiges}
          onChange={(v) => update('einsatzgebiet_sonstiges', v)}
        />
      )}
    </div>
  );
}

function Step5UeberUns({
  data,
  update,
  toggleArray,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggleArray: (key: keyof FormData, value: string) => void;
}) {
  const sprachenOptions = ['Deutsch', 'Englisch', 'Russisch'];

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 05 / ÜBER UNS"
        title="ÜBER DAS"
        italic="Unternehmen."
        priority="WICHTIG"
        description={'Inhalte für Hero, „Über uns" und SEO.'}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Anzahl der Mitarbeiter (ungefähr)"
          name="mitarbeiter_anzahl"
          value={data.mitarbeiter_anzahl}
          onChange={(v) => update('mitarbeiter_anzahl', v)}
          placeholder="z.B. 25"
        />
        <Input
          label="Betreute Kunden / Objekte"
          name="kunden_anzahl"
          value={data.kunden_anzahl}
          onChange={(v) => update('kunden_anzahl', v)}
          placeholder="z.B. 430+"
          hint='Aktuell steht „430+ zufriedene Kunden" — stimmt das?'
        />
      </div>

      <TextArea
        label="Kurze Firmengeschichte / Selbstbeschreibung (3–5 Sätze)"
        name="firmengeschichte"
        value={data.firmengeschichte}
        onChange={(v) => update('firmengeschichte', v)}
        rows={6}
        placeholder="Was macht Ihr Unternehmen besonders? Warum sollte ein Kunde Sie wählen?"
      />

      <Input
        label="Slogan / Claim (falls vorhanden)"
        name="slogan"
        value={data.slogan}
        onChange={(v) => update('slogan', v)}
        placeholder='Aktuell: "Ihr Schutz. Unsere Mission."'
      />

      <FieldGroupLabel>
        Sprachen, in denen Sie Kunden betreuen (Mehrfachauswahl)
      </FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
        {sprachenOptions.map((opt) => (
          <Checkbox
            key={opt}
            label={opt}
            checked={data.sprachen.includes(opt)}
            onChange={() => toggleArray('sprachen', opt)}
          />
        ))}
      </div>

      <Input
        label="Weitere Sprachen"
        name="sprachen_sonstiges"
        value={data.sprachen_sonstiges}
        onChange={(v) => update('sprachen_sonstiges', v)}
      />
    </div>
  );
}

function Step6Datenschutz({
  data,
  update,
  toggleArray,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggleArray: (key: keyof FormData, value: string) => void;
}) {
  const toolsOptions = [
    'Google Analytics',
    'Google Maps (Einbettung)',
    'Google Fonts (lokal)',
    'Facebook Pixel / Meta Ads',
    'YouTube-Videos eingebettet',
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 06 / DATENSCHUTZ"
        title="DATENSCHUTZ &"
        italic="Hosting."
        priority="KRITISCH"
        description="Für die DSGVO-konforme Datenschutzerklärung."
      />

      <RadioGroup
        label="Verantwortlicher für die Datenverarbeitung"
        name="verantwortlicher_abweichend"
        value={data.verantwortlicher_abweichend}
        onChange={(v) => update('verantwortlicher_abweichend', v)}
        options={[
          {
            value: 'identisch',
            label: 'Identisch mit Geschäftsführer & Geschäftsadresse',
          },
          { value: 'abweichend', label: 'Abweichend (bitte unten angeben)' },
        ]}
      />

      {data.verantwortlicher_abweichend === 'abweichend' && (
        <TextArea
          label="Abweichender Verantwortlicher — Name & Adresse"
          name="verantwortlicher_details"
          value={data.verantwortlicher_details}
          onChange={(v) => update('verantwortlicher_details', v)}
          rows={3}
        />
      )}

      <RadioGroup
        label="Externer / interner Datenschutzbeauftragter vorhanden?"
        name="dsb_vorhanden"
        value={data.dsb_vorhanden}
        onChange={(v) => update('dsb_vorhanden', v)}
        options={[
          { value: 'nein', label: 'Nein' },
          { value: 'ja', label: 'Ja' },
        ]}
      />

      {data.dsb_vorhanden === 'ja' && (
        <Input
          label="Name & Kontakt DSB"
          name="dsb_kontakt"
          value={data.dsb_kontakt}
          onChange={(v) => update('dsb_kontakt', v)}
        />
      )}

      <FieldGroupLabel>
        Welche Tools / Dienste werden auf der Website genutzt? (Mehrfachauswahl)
      </FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {toolsOptions.map((opt) => (
          <Checkbox
            key={opt}
            label={opt}
            checked={data.tools_website.includes(opt)}
            onChange={() => toggleArray('tools_website', opt)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Newsletter-Tool (welches?)"
          name="tools_newsletter"
          value={data.tools_newsletter}
          onChange={(v) => update('tools_newsletter', v)}
        />
        <Input
          label="Online-Buchungstool"
          name="tools_buchung"
          value={data.tools_buchung}
          onChange={(v) => update('tools_buchung', v)}
        />
      </div>

      <Input
        label="Sonstige Tools / Dienste"
        name="tools_sonstiges"
        value={data.tools_sonstiges}
        onChange={(v) => update('tools_sonstiges', v)}
      />

      <FieldGroupLabel>Hosting der Website</FieldGroupLabel>

      <RadioGroup
        label="Hosting-Anbieter"
        name="hosting"
        value={data.hosting}
        onChange={(v) => update('hosting', v)}
        options={[
          {
            value: 'inverta',
            label: 'INVERTA übernimmt (Empfehlung: Vercel / Hetzner DE)',
          },
          { value: 'eigener', label: 'Eigener Anbieter (bitte angeben)' },
        ]}
      />

      {data.hosting === 'eigener' && (
        <Input
          label="Eigener Hosting-Anbieter"
          name="hosting_anbieter"
          value={data.hosting_anbieter}
          onChange={(v) => update('hosting_anbieter', v)}
        />
      )}

      <Input
        label="Standort des Servers (für DSE wichtig)"
        name="hosting_standort"
        value={data.hosting_standort}
        onChange={(v) => update('hosting_standort', v)}
        placeholder="z.B. Deutschland, EU"
      />
    </div>
  );
}

function Step7Online({
  data,
  update,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 07 / ONLINE"
        title="MEDIEN &"
        italic="Online-Präsenz."
        priority="WICHTIG"
        description="Bilder, Social Media und Kontaktformular-Empfänger."
      />

      <FieldGroupLabel>Bildmaterial</FieldGroupLabel>

      <RadioGroup
        label="Haben Sie eigene Fotos? (Mitarbeiter in Uniform, Fahrzeuge, Objekte, Büro)"
        name="bildmaterial"
        value={data.bildmaterial}
        onChange={(v) => update('bildmaterial', v)}
        options={[
          { value: 'ja', label: 'Ja — sende ich mit' },
          { value: 'stock', label: 'Nein — bitte hochwertige Stock-Fotos einsetzen' },
          { value: 'shoot', label: 'Wir können einen Foto-Shoot organisieren' },
        ]}
      />

      <Input
        label="Bevorzugte Hauptfarbe neben Gold / Blau?"
        name="hauptfarbe"
        value={data.hauptfarbe}
        onChange={(v) => update('hauptfarbe', v)}
        placeholder="HEX-Code, z.B. #7CB3D1"
        hint="Aktuell: Dunkel + Gold-Akzent + Hellblau #7CB3D1"
      />

      <FieldGroupLabel>
        Social Media (nur ausfüllen, was existiert)
      </FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Instagram"
          name="instagram"
          type="url"
          value={data.instagram}
          onChange={(v) => update('instagram', v)}
          placeholder="https://"
        />
        <Input
          label="Facebook"
          name="facebook"
          type="url"
          value={data.facebook}
          onChange={(v) => update('facebook', v)}
          placeholder="https://"
        />
        <Input
          label="LinkedIn"
          name="linkedin"
          type="url"
          value={data.linkedin}
          onChange={(v) => update('linkedin', v)}
          placeholder="https://"
        />
        <Input
          label="Xing"
          name="xing"
          type="url"
          value={data.xing}
          onChange={(v) => update('xing', v)}
          placeholder="https://"
        />
        <Input
          label="TikTok"
          name="tiktok"
          type="url"
          value={data.tiktok}
          onChange={(v) => update('tiktok', v)}
          placeholder="https://"
        />
        <Input
          label="YouTube"
          name="youtube"
          type="url"
          value={data.youtube}
          onChange={(v) => update('youtube', v)}
          placeholder="https://"
        />
      </div>

      <Input
        label="Google-Unternehmensprofil (Maps)"
        name="google_business"
        type="url"
        value={data.google_business}
        onChange={(v) => update('google_business', v)}
        placeholder="https://"
      />

      <FieldGroupLabel>Kontaktformular — wohin sollen Anfragen gehen?</FieldGroupLabel>

      <Input
        label="E-Mail-Adresse für eingehende Kontaktanfragen"
        name="kontaktanfragen_email"
        type="email"
        value={data.kontaktanfragen_email}
        onChange={(v) => update('kontaktanfragen_email', v)}
        required
      />

      <RadioGroup
        label="Sollen Anfragen zusätzlich per WhatsApp / SMS kommen?"
        name="kontakt_whatsapp_pref"
        value={data.kontakt_whatsapp_pref}
        onChange={(v) => update('kontakt_whatsapp_pref', v)}
        options={[
          { value: 'nein', label: 'Nein, nur E-Mail' },
          { value: 'ja', label: 'Ja, zusätzlich per WhatsApp / SMS' },
        ]}
      />

      {data.kontakt_whatsapp_pref === 'ja' && (
        <Input
          label="WhatsApp / SMS Nummer"
          name="kontakt_whatsapp_nr"
          type="tel"
          value={data.kontakt_whatsapp_nr}
          onChange={(v) => update('kontakt_whatsapp_nr', v)}
        />
      )}
    </div>
  );
}
