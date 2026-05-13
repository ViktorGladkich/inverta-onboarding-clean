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
// FORM DATA SHAPE
// ============================================
export interface FormData {
  // Step 1: Firma
  firmenname: string;
  rechtsform: string;
  adresse: string;
  plz_stadt: string;
  hrb: string;
  ust_id: string;
  steuernummer: string;
  geschaeftsfuehrer: string;
  gruendung: string;

  // Step 2: Kontakt & DSGVO
  email_kontakt: string;
  telefon: string;
  whatsapp: string;
  dsgvo_name: string;
  dsgvo_email: string;
  dsb_vorhanden: string;
  dsb_kontakt: string;

  // Step 3: Sicherheit
  sicherheit_leistungen: string[];
  sicherheit_weitere: string;
  wachschein_nr: string;
  haftpflicht: string;
  sicherheit_zielgruppe: string;
  sicherheit_gebiet: string;
  sicherheit_usp: string;

  // Step 4: Reinigung
  reinigung_arten: string[];
  reinigung_volumen: string;
  reinigung_gebiet: string;

  // Step 5: Umzug
  umzug_arten: string[];
  umzug_region: string[];
  umzug_zusatz: string[];
  umzug_formular: string;

  // Step 6: Design & Ziele
  markenfarbe_primaer: string;
  markenfarbe_sekundaer: string;
  markenfarben_weitere: string;
  tonalitaet: string[];
  inspiration_1: string;
  inspiration_2: string;
  inspiration_3: string;
  vermeiden: string;

  // Step 7: Ziele
  hauptziel: string;
  prioritaet_sicherheit: string;
  prioritaet_reinigung: string;
  prioritaet_umzug: string;
  kontaktwege: string[];
  google_business: string;
  social_media: string;
  konkurrenten: string;
}

const initialFormData: FormData = {
  firmenname: '',
  rechtsform: '',
  adresse: '',
  plz_stadt: '',
  hrb: '',
  ust_id: '',
  steuernummer: '',
  geschaeftsfuehrer: '',
  gruendung: '',
  email_kontakt: '',
  telefon: '',
  whatsapp: '',
  dsgvo_name: '',
  dsgvo_email: '',
  dsb_vorhanden: '',
  dsb_kontakt: '',
  sicherheit_leistungen: [],
  sicherheit_weitere: '',
  wachschein_nr: '',
  haftpflicht: '',
  sicherheit_zielgruppe: '',
  sicherheit_gebiet: '',
  sicherheit_usp: '',
  reinigung_arten: [],
  reinigung_volumen: '',
  reinigung_gebiet: '',
  umzug_arten: [],
  umzug_region: [],
  umzug_zusatz: [],
  umzug_formular: '',
  markenfarbe_primaer: '',
  markenfarbe_sekundaer: '',
  markenfarben_weitere: '',
  tonalitaet: [],
  inspiration_1: '',
  inspiration_2: '',
  inspiration_3: '',
  vermeiden: '',
  hauptziel: '',
  prioritaet_sicherheit: '',
  prioritaet_reinigung: '',
  prioritaet_umzug: '',
  kontaktwege: [],
  google_business: '',
  social_media: '',
  konkurrenten: '',
};

const STORAGE_KEY = 'inverta_onboarding_data';

const TOTAL_STEPS = 7;

const STEP_TITLES = [
  'Firma',
  'Kontakt',
  'Sicherheit',
  'Reinigung',
  'Umzug',
  'Design',
  'Ziele',
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
    '/pixolite3.png', // Step 2: Sicherheit
    '/pixolite4.png', // Step 3: Reinigung
    '/pixolite5.png', // Step 4: Umzug
    '/pixolite6.png', // Step 5: Design
    '/pixolite7.png', // Step 6: Ziele
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
            animate={{ opacity: 0.12, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 bg-no-repeat bg-center bg-[size:90%] sm:bg-[size:40%]"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-black)]/80 via-[var(--color-bg-black)]/10 to-[var(--color-bg-black)]/60" />
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
                <Step3Sicherheit
                  data={data}
                  update={update}
                  toggleArray={toggleArray}
                />
              )}
              {step === 3 && (
                <Step4Reinigung
                  data={data}
                  update={update}
                  toggleArray={toggleArray}
                />
              )}
              {step === 4 && (
                <Step5Umzug data={data} toggleArray={toggleArray} update={update} />
              )}
              {step === 5 && (
                <Step6Design
                  data={data}
                  update={update}
                  toggleArray={toggleArray}
                />
              )}
              {step === 6 && (
                <Step7Ziele data={data} update={update} toggleArray={toggleArray} />
              )}
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
        description="Für Impressum, Verträge und rechtssichere Umsetzung."
      />

      <Input
        label="Firmenname (vollständig)"
        name="firmenname"
        value={data.firmenname}
        onChange={(v) => update('firmenname', v)}
        required
        placeholder="z.B. Mustermann Sicherheit GmbH"
      />

      <Input
        label="Rechtsform"
        name="rechtsform"
        value={data.rechtsform}
        onChange={(v) => update('rechtsform', v)}
        placeholder="GmbH / UG / GbR / Einzelunternehmen"
        required
      />

      <Input
        label="Geschäftsadresse — Straße & Hausnummer"
        name="adresse"
        value={data.adresse}
        onChange={(v) => update('adresse', v)}
        required
        placeholder="Musterstraße 1"
      />

      <Input
        label="PLZ & Stadt"
        name="plz_stadt"
        value={data.plz_stadt}
        onChange={(v) => update('plz_stadt', v)}
        required
        placeholder="01217 Dresden"
      />

      <Input
        label="Handelsregister-Nr. + Amtsgericht"
        name="hrb"
        value={data.hrb}
        onChange={(v) => update('hrb', v)}
        placeholder="HRB 12345, Amtsgericht Dresden"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Umsatzsteuer-ID"
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
        label="Vertretungsberechtigte Person (Geschäftsführer)"
        name="geschaeftsfuehrer"
        value={data.geschaeftsfuehrer}
        onChange={(v) => update('geschaeftsfuehrer', v)}
        required
      />

      <Input
        label="Datum der Geschäftsgründung"
        name="gruendung"
        value={data.gruendung}
        onChange={(v) => update('gruendung', v)}
        placeholder="z.B. 03/2020"
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
        italic="DSGVO."
        priority="KRITISCH"
        description="Kontaktdaten für die Website und Datenschutz-Verantwortliche."
      />

      <FieldGroupLabel>Öffentliche Kontaktdaten (Website)</FieldGroupLabel>

      <Input
        label="E-Mail (Kontakt)"
        name="email_kontakt"
        type="email"
        value={data.email_kontakt}
        onChange={(v) => update('email_kontakt', v)}
        required
        placeholder="info@firma.de"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Telefon"
          name="telefon"
          type="tel"
          value={data.telefon}
          onChange={(v) => update('telefon', v)}
          required
        />
        <Input
          label="WhatsApp / Signal (optional)"
          name="whatsapp"
          type="tel"
          value={data.whatsapp}
          onChange={(v) => update('whatsapp', v)}
        />
      </div>

      <FieldGroupLabel>Datenschutz-verantwortliche Person</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Name"
          name="dsgvo_name"
          value={data.dsgvo_name}
          onChange={(v) => update('dsgvo_name', v)}
        />
        <Input
          label="E-Mail DSGVO"
          name="dsgvo_email"
          type="email"
          value={data.dsgvo_email}
          onChange={(v) => update('dsgvo_email', v)}
        />
      </div>

      <RadioGroup
        label="Externer Datenschutzbeauftragter (DSB) vorhanden?"
        name="dsb_vorhanden"
        value={data.dsb_vorhanden}
        onChange={(v) => update('dsb_vorhanden', v)}
        options={[
          { value: 'ja', label: 'Ja' },
          { value: 'nein', label: 'Nein' },
          { value: 'unsicher', label: 'Nicht sicher' },
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
    </div>
  );
}

function Step3Sicherheit({
  data,
  update,
  toggleArray,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggleArray: (key: keyof FormData, value: string) => void;
}) {
  const sicherheitOptions = [
    'Objektschutz',
    'Personenschutz',
    'Veranstaltungsschutz',
    'Empfangsdienst',
    'Wachdienst',
    'Baustellenbewachung',
    'Citystreife',
    'Ladendetektiv',
    'Notruf-Service',
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 03 / SERVICE 01"
        title="SICHER-"
        italic="heit."
        priority="KRITISCH"
        description="Details zur Sicherheitsdienstleistung — diese werden auf der Website präsentiert."
      />

      <FieldGroupLabel>Angebotene Leistungen (Mehrfachauswahl)</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {sicherheitOptions.map((opt) => (
          <Checkbox
            key={opt}
            label={opt}
            checked={data.sicherheit_leistungen.includes(opt)}
            onChange={() => toggleArray('sicherheit_leistungen', opt)}
          />
        ))}
      </div>

      <Input
        label="Weitere Leistungen"
        name="sicherheit_weitere"
        value={data.sicherheit_weitere}
        onChange={(v) => update('sicherheit_weitere', v)}
      />

      <FieldGroupLabel>Lizenzen & Versicherung</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Wachschein-Nr. (§34a GewO)"
          name="wachschein_nr"
          value={data.wachschein_nr}
          onChange={(v) => update('wachschein_nr', v)}
        />
        <Input
          label="Berufshaftpflicht-Versicherer"
          name="haftpflicht"
          value={data.haftpflicht}
          onChange={(v) => update('haftpflicht', v)}
        />
      </div>

      <RadioGroup
        label="Zielgruppe"
        name="sicherheit_zielgruppe"
        value={data.sicherheit_zielgruppe}
        onChange={(v) => update('sicherheit_zielgruppe', v)}
        options={[
          { value: 'b2b', label: 'B2B (Geschäftskunden)' },
          { value: 'b2c', label: 'B2C (Privatkunden)' },
          { value: 'beides', label: 'Beides' },
        ]}
      />

      <Input
        label="Service-Gebiet (Städte / PLZ / Bundesländer)"
        name="sicherheit_gebiet"
        value={data.sicherheit_gebiet}
        onChange={(v) => update('sicherheit_gebiet', v)}
        placeholder="z.B. Dresden, Sachsen"
      />

      <TextArea
        label="Was unterscheidet Sie von der Konkurrenz?"
        name="sicherheit_usp"
        value={data.sicherheit_usp}
        onChange={(v) => update('sicherheit_usp', v)}
        rows={4}
      />
    </div>
  );
}

function Step4Reinigung({
  data,
  update,
  toggleArray,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggleArray: (key: keyof FormData, value: string) => void;
}) {
  const reinigungOptions = [
    'Büroreinigung',
    'Industriereinigung',
    'Privathaushalt',
    'Grundreinigung',
    'Glasreinigung',
    'Teppichreinigung',
    'Treppenhausreinigung',
    'Baureinigung',
    'Sonderreinigung',
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 03 / SERVICE 02"
        title="REINI-"
        italic="gung."
        priority="KRITISCH"
        description="Details zur Reinigungsdienstleistung."
      />

      <FieldGroupLabel>Angebotene Reinigungsarten (Mehrfachauswahl)</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {reinigungOptions.map((opt) => (
          <Checkbox
            key={opt}
            label={opt}
            checked={data.reinigung_arten.includes(opt)}
            onChange={() => toggleArray('reinigung_arten', opt)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Mindestauftragsvolumen (€)"
          name="reinigung_volumen"
          type="number"
          value={data.reinigung_volumen}
          onChange={(v) => update('reinigung_volumen', v)}
        />
        <Input
          label="Service-Gebiet (PLZ-Radius)"
          name="reinigung_gebiet"
          value={data.reinigung_gebiet}
          onChange={(v) => update('reinigung_gebiet', v)}
        />
      </div>
    </div>
  );
}

function Step5Umzug({
  data,
  toggleArray,
  update,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggleArray: (key: keyof FormData, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 03 / SERVICE 03"
        title="UMZUG."
        priority="KRITISCH"
        description="Details zum Umzugsservice."
      />

      <FieldGroupLabel>Art der Umzüge (Mehrfachauswahl)</FieldGroupLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {['Privatumzüge', 'Firmenumzüge', 'Senioren-Umzüge'].map((opt) => (
          <Checkbox
            key={opt}
            label={opt}
            checked={data.umzug_arten.includes(opt)}
            onChange={() => toggleArray('umzug_arten', opt)}
          />
        ))}
      </div>

      <FieldGroupLabel>Region (Mehrfachauswahl)</FieldGroupLabel>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
        {['Inland', 'EU', 'International'].map((opt) => (
          <Checkbox
            key={opt}
            label={opt}
            checked={data.umzug_region.includes(opt)}
            onChange={() => toggleArray('umzug_region', opt)}
          />
        ))}
      </div>

      <FieldGroupLabel>Inkludierte Zusatzleistungen</FieldGroupLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {[
          'Verpackungsservice',
          'Möbelmontage',
          'Beiladung',
          'Klaviertransport',
          'Entsorgung',
          'Lagerung',
        ].map((opt) => (
          <Checkbox
            key={opt}
            label={opt}
            checked={data.umzug_zusatz.includes(opt)}
            onChange={() => toggleArray('umzug_zusatz', opt)}
          />
        ))}
      </div>

      <RadioGroup
        label="Online-Anfrage-Formular gewünscht?"
        name="umzug_formular"
        value={data.umzug_formular}
        onChange={(v) => update('umzug_formular', v)}
        options={[
          { value: 'kalkulator', label: 'Ja, mit Volumen-Kalkulator' },
          { value: 'einfach', label: 'Ja, einfaches Formular' },
          { value: 'nein', label: 'Nein' },
        ]}
      />
    </div>
  );
}

function Step6Design({
  data,
  update,
  toggleArray,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggleArray: (key: keyof FormData, value: string) => void;
}) {
  const moods = [
    'Seriös & vertrauensvoll',
    'Modern & technisch',
    'Premium & exklusiv',
    'Freundlich & nahbar',
    'Stark & dominant',
    'Schlicht & klar',
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 04 / DESIGN"
        title="DESIGN &"
        italic="Branding."
        priority="WICHTIG"
        description="Visuelle Identität für Ihre Website."
      />

      <FieldGroupLabel>Markenfarben (HEX-Codes)</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Primärfarbe"
          name="markenfarbe_primaer"
          value={data.markenfarbe_primaer}
          onChange={(v) => update('markenfarbe_primaer', v)}
          placeholder="#1A4D8C"
        />
        <Input
          label="Sekundärfarbe"
          name="markenfarbe_sekundaer"
          value={data.markenfarbe_sekundaer}
          onChange={(v) => update('markenfarbe_sekundaer', v)}
          placeholder="#F5A623"
        />
      </div>

      <Input
        label="Weitere Brand-Farben oder Notizen"
        name="markenfarben_weitere"
        value={data.markenfarben_weitere}
        onChange={(v) => update('markenfarben_weitere', v)}
      />

      <FieldGroupLabel>Tonalität & Stimmung (Mehrfachauswahl)</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {moods.map((opt) => (
          <Checkbox
            key={opt}
            label={opt}
            checked={data.tonalitaet.includes(opt)}
            onChange={() => toggleArray('tonalitaet', opt)}
          />
        ))}
      </div>

      <FieldGroupLabel>Inspiration (bis zu 3 Webseiten)</FieldGroupLabel>

      <Input
        label="Website 1 — URL & was gefällt"
        name="inspiration_1"
        value={data.inspiration_1}
        onChange={(v) => update('inspiration_1', v)}
        placeholder="https://example.com — klares Design"
      />
      <Input
        label="Website 2"
        name="inspiration_2"
        value={data.inspiration_2}
        onChange={(v) => update('inspiration_2', v)}
      />
      <Input
        label="Website 3"
        name="inspiration_3"
        value={data.inspiration_3}
        onChange={(v) => update('inspiration_3', v)}
      />

      <TextArea
        label="Was wir vermeiden sollen"
        name="vermeiden"
        value={data.vermeiden}
        onChange={(v) => update('vermeiden', v)}
        rows={3}
        placeholder="z.B. zu bunte Farben, Stockfoto-Look..."
      />
    </div>
  );
}

function Step7Ziele({
  data,
  update,
  toggleArray,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggleArray: (key: keyof FormData, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        step="TEIL 05 / ZIELE"
        title="ZIELE &"
        italic="Marketing."
        priority="WICHTIG"
        description="Was soll die Website erreichen?"
      />

      <RadioGroup
        label="Hauptziel der Website"
        name="hauptziel"
        value={data.hauptziel}
        onChange={(v) => update('hauptziel', v)}
        options={[
          { value: 'leads', label: 'Mehr Anfragen / Leads generieren' },
          { value: 'branding', label: 'Vertrauen aufbauen / Branding stärken' },
          { value: 'info', label: 'Bestehende Kunden besser informieren' },
          { value: 'booking', label: 'Online-Buchungen ermöglichen' },
          { value: 'recruiting', label: 'Mitarbeiter-Recruiting' },
        ]}
      />

      <FieldGroupLabel>Priorität der Services (1 = wichtigster Fokus)</FieldGroupLabel>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Sicherheit"
          name="prioritaet_sicherheit"
          type="number"
          value={data.prioritaet_sicherheit}
          onChange={(v) => update('prioritaet_sicherheit', v)}
          placeholder="1, 2 oder 3"
        />
        <Input
          label="Reinigung"
          name="prioritaet_reinigung"
          type="number"
          value={data.prioritaet_reinigung}
          onChange={(v) => update('prioritaet_reinigung', v)}
          placeholder="1, 2 oder 3"
        />
        <Input
          label="Umzug"
          name="prioritaet_umzug"
          type="number"
          value={data.prioritaet_umzug}
          onChange={(v) => update('prioritaet_umzug', v)}
          placeholder="1, 2 oder 3"
        />
      </div>

      <FieldGroupLabel>Bevorzugter Kontaktweg der Kunden</FieldGroupLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {[
          'Anruf',
          'E-Mail-Formular',
          'WhatsApp',
          'Rückruf-Service',
          'Direkter Termin (Cal.com)',
        ].map((opt) => (
          <Checkbox
            key={opt}
            label={opt}
            checked={data.kontaktwege.includes(opt)}
            onChange={() => toggleArray('kontaktwege', opt)}
          />
        ))}
      </div>

      <FieldGroupLabel>Existierende Marketing-Kanäle</FieldGroupLabel>

      <Input
        label="Google Business Profile — URL"
        name="google_business"
        type="url"
        value={data.google_business}
        onChange={(v) => update('google_business', v)}
      />

      <Input
        label="Instagram / Facebook / LinkedIn"
        name="social_media"
        value={data.social_media}
        onChange={(v) => update('social_media', v)}
      />

      <TextArea
        label="Hauptkonkurrenten (für Differenzierung)"
        name="konkurrenten"
        value={data.konkurrenten}
        onChange={(v) => update('konkurrenten', v)}
        rows={3}
      />
    </div>
  );
}
