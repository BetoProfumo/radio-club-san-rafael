import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  GraduationCap,
  Radar,
  Clock,
  Send,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Users,
  Award,
  Signal,
  Antenna,
  Zap,
  Waves,
  BookOpen,
  Shield,
  Heart,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import heroImage from "@/assets/hero-cerro-radio-club.jpg";
import campingImage from "@/assets/camping-valle-grande.jpg";
import campingCarrusel1 from "@/assets/camping-carrusel-1.jpg";
import campingCarrusel2 from "@/assets/camping-carrusel-2.jpg";
import campingCarrusel3 from "@/assets/camping-carrusel-3.jpg";
import logo from "@/assets/logo-radio-club.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Radio Club San Rafael · LU9MAB — Radioafición desde 1950" },
      {
        name: "description",
        content:
          "Sitio oficial del Radio Club San Rafael (LU9MAB). Cursos de radioaficionado, repetidoras, activaciones, camping Valle Grande y comunicaciones de emergencia en Mendoza, Argentina.",
      },
    ],
  }),
  component: HomePage,
});

/* ---------- Icons ---------- */
/* lucide-react no incluye logos de marcas: estos dos íconos siguen su
   mismo estilo (trazo, sin relleno) para las dos redes del club. */

function IconFacebook({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconInstagram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/* ---------- Utilities ---------- */

function useTheme() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("rcsr-theme", next ? "dark" : "light");
    } catch {}
    setIsDark(next);
  };
  return { isDark, toggle };
}

/* Traducción de toda la página vía Google Translate. Guardamos el idioma
   elegido en una cookie que el widget invisible lee al cargar la página
   (por eso, al cambiar, recargamos). */
function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function useLanguage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  useEffect(() => {
    const c = getCookie("googtrans");
    setLang(c && c.includes("/en") ? "en" : "es");
  }, []);
  const setLanguage = (next: "es" | "en") => {
    const value = next === "en" ? "/es/en" : "/es/es";
    document.cookie = `googtrans=${value}; path=/`;
    document.cookie = `googtrans=${value}; path=/; domain=${location.hostname}`;
    location.reload();
  };
  return { lang, setLanguage };
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString("es-AR"));
  const [val, setVal] = useState("0");
  useEffect(() => {
    const u = rounded.on("change", setVal);
    return () => u();
  }, [rounded]);
  useEffect(() => {
    if (inView) {
      const c = animate(mv, to, { duration: 1.8, ease: "easeOut" });
      return () => c.stop();
    }
    // Red de seguridad: si por alguna razón el observer nunca marca el
    // elemento como visible (viewports chicos, cambios de tamaño en
    // móvil por la barra de direcciones, etc.), mostramos el valor final
    // igual después de un segundo para que el número nunca quede en 0.
    const fallback = setTimeout(() => mv.set(to), 3000);
    return () => clearTimeout(fallback);
  }, [inView, mv, to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* Live UTC clock — ticks every second. Renders a placeholder until
   mounted client-side so SSR/client markup always matches. */
function useUtcClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return { time: "--:--:--", date: "" };
  const time = now.toLocaleTimeString("es-AR", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const date = now.toLocaleDateString("es-AR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
  });
  return { time, date };
}

/* Solid backdrop for the logo so it reads correctly no matter what's
   behind it (dark mode, red panels, photos). */
function LogoBadge({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      style={{ width: size, height: size }}
      className={`grid shrink-0 place-items-center rounded-full bg-white ring-1 ring-border ${className}`}
    >
      <img
        src={logo}
        alt="Radio Club San Rafael"
        width={size}
        height={size}
        className="h-[86%] w-[86%] object-contain"
      />
    </span>
  );
}

function UtcClock({ className = "" }: { className?: string }) {
  const { time } = useUtcClock();
  return (
    <div
      className={`inline-flex h-9 shrink-0 items-stretch overflow-hidden rounded-sm border border-border ${className}`}
      aria-label="Hora UTC actual"
    >
      <div className="flex items-center gap-1.5 whitespace-nowrap bg-surface px-2.5">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-primary" />
        <span className="font-mono-tech text-xs font-semibold tabular-nums leading-none text-foreground">
          {time}
        </span>
      </div>
      <div className="flex items-center whitespace-nowrap bg-primary px-2 font-mono-tech text-[10px] font-bold leading-none text-primary-foreground">
        UTC
      </div>
    </div>
  );
}
function CardTicks() {
  return (
    <>
      <span className="absolute left-2.5 top-2.5 h-2 w-2 border-l-2 border-t-2 border-primary/50" />
      <span className="absolute right-2.5 top-2.5 h-2 w-2 border-r-2 border-t-2 border-primary/50" />
      <span className="absolute bottom-2.5 left-2.5 h-2 w-2 border-b-2 border-l-2 border-primary/50" />
      <span className="absolute bottom-2.5 right-2.5 h-2 w-2 border-b-2 border-r-2 border-primary/50" />
    </>
  );
}

/* ---------- Nav ---------- */

const NAV_LINKS = [
  { label: "Institución", href: "#institucion" },
  { label: "Radioafición", href: "#radioaficion" },
  { label: "Historia", href: "#historia" },
  { label: "Cursos", href: "#cursos" },
  { label: "Examen ENACOM", href: "#examen" },
  { label: "Biblioteca", href: "#biblioteca" },
  { label: "Repetidoras", href: "#repetidoras" },
  { label: "Propagación", href: "#propagacion" },
  { label: "Camping", href: "#camping" },
  { label: "Contacto", href: "#contacto" },
];

/* Solo los principales van en la barra de escritorio: 11 links no entran
   en ningún ancho de pantalla real. El listado completo sigue disponible
   en el menú móvil y en el footer. */
const HEADER_NAV_LINKS = NAV_LINKS.filter((l) =>
  ["#institucion", "#radioaficion", "#cursos", "#repetidoras", "#camping", "#contacto"].includes(
    l.href
  )
);

function Header() {
  const { isDark, toggle } = useTheme();
  const { lang, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-border bg-background/97 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_16px_-4px_rgba(0,0,0,0.12)]" : ""
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-3" aria-label="Radio Club San Rafael — inicio">
          <LogoBadge size={44} />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-sm font-bold tracking-tight text-foreground sm:text-base">
              Radio Club San Rafael
            </span>
            <span className="truncate font-mono-tech text-[11px] font-medium uppercase text-primary">
              LU9MAB · desde 1950
            </span>
          </span>
        </a>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto xl:flex"
          aria-label="Navegación principal"
        >
          {HEADER_NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <UtcClock className="hidden md:inline-flex" />
          <button
            onClick={() => setLanguage(lang === "en" ? "es" : "en")}
            className="notranslate hidden h-9 shrink-0 items-center justify-center rounded-sm border border-border bg-surface px-3 font-mono-tech text-xs font-semibold text-foreground transition-colors hover:bg-secondary sm:inline-flex"
            aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
          <button
            onClick={toggle}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-border bg-surface text-foreground transition-colors hover:bg-secondary"
            aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href="#socios"
            className="hidden items-center gap-1.5 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 lg:inline-flex"
          >
            Hacerse socio
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-border bg-surface xl:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border bg-background xl:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col p-4" aria-label="Navegación móvil">
            <div className="mb-2 flex items-center justify-between gap-2 sm:hidden">
              <UtcClock />
              <button
                onClick={() => setLanguage(lang === "en" ? "es" : "en")}
                className="notranslate inline-flex h-9 shrink-0 items-center justify-center rounded-sm border border-border bg-surface px-3 font-mono-tech text-xs font-semibold text-foreground"
                aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
              >
                {lang === "en" ? "ES" : "EN"}
              </button>
            </div>
            <UtcClock className="mb-2 hidden self-start sm:inline-flex md:hidden" />
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-sm px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {l.label}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
            <a
              href="#socios"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Hacerse socio <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </nav>
        </motion.div>
      )}
    </header>
  );
}

/* ---------- Hero: a QSL card, the postcard hams trade to confirm a contact ---------- */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-background pb-16 pt-32 sm:pb-24">
      <div className="absolute inset-0 grid-radar" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* The card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="perforated relative overflow-hidden rounded-lg border border-border bg-background p-6 shadow-elevated sm:p-10"
          >
            <CardTicks />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <LogoBadge size={84} className="shrink-0" />
                <div>
                  <p className="font-mono-tech text-[11px] uppercase text-muted-foreground">Confirmando contacto</p>
                  <p className="font-display text-2xl font-bold text-foreground">Radio Club San Rafael</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                <span className="font-mono-tech text-[11px] uppercase text-primary">Repetidora operativa</span>
              </div>
            </div>

            <h1 className="mt-8 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              Conectando el sur mendocino desde 1950
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Promovemos la radioafición, la capacitación técnica y las comunicaciones de emergencia
              en San Rafael, Mendoza — con setenta y cinco años de historia al aire.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#cursos"
                className="group inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Quiero ser radioaficionado
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#cursos"
                className="inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <GraduationCap className="h-4 w-4" />
                Próximos cursos
              </a>
            </div>

            <div className="perforated-b mt-10 pb-6" />
            <dl className="mt-6 grid grid-cols-3 gap-4 font-mono-tech text-xs">
              <div>
                <dt className="uppercase text-muted-foreground">Indicativo</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">LU9MAB</dd>
              </div>
              <div>
                <dt className="uppercase text-muted-foreground">QTH</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">San Rafael, MDZ</dd>
              </div>
              <div>
                <dt className="uppercase text-muted-foreground">Coordenadas</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">34.6°S 68.3°W</dd>
              </div>
            </dl>
          </motion.div>

          {/* Side photo panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border shadow-elevated lg:aspect-auto lg:h-full"
          >
            <img
              src={heroImage}
              alt="Cerro Diamante, 2450 SNM, locación de la repetidora del Radio Club San Rafael"
              width={900}
              height={1100}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-mono-tech text-[10px] uppercase text-background/80">Miembro RCA · IARU R2</p>
              <p className="mt-1 font-display text-lg font-bold text-background">
                Foto Cerro Diamante 2450 SNM - locación de la repetidora 147.210 +600 ST 110.9
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Stats ---------- */

const STATS = [
  { label: "Años de historia", value: 75, suffix: "+", icon: Award },
  { label: "Socios activos", value: 100, suffix: "", icon: Users },
  { label: "Cursos realizados", value: 68, suffix: "", icon: GraduationCap },
  { label: "Repetidoras", value: 2, suffix: "", icon: Antenna },
];

function Stats() {
  return (
    <section id="institucion" className="relative border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono-tech text-xs font-semibold uppercase text-primary">01 — Institución</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Una comunidad técnica con historia
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cifras que reflejan siete décadas de trabajo por la radioafición y el servicio a la
            comunidad de San Rafael.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="card-stock relative rounded-md p-5 transition-colors hover:border-primary/50"
            >
              <s.icon className="h-5 w-5 text-primary" aria-hidden />
              <div className="mt-4 font-display text-3xl font-bold tabular-nums text-foreground">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Radioafición ---------- */

const RADIO_ITEMS = [
  {
    icon: Waves,
    title: "¿Qué es la radioafición?",
    body:
      "Un servicio internacional de radiocomunicación sin fines de lucro para la experimentación técnica, la formación y el intercambio entre personas de todo el mundo.",
  },
  {
    icon: Antenna,
    title: "Bandas y equipos",
    body:
      "Operamos en HF, VHF y UHF con estaciones fijas, móviles y portátiles. Antenas dipolo, verticales, yagi y sistemas digitales modernos.",
  },
  {
    icon: BookOpen,
    title: "Licencia y capacitación",
    body:
      "Dictamos cursos oficiales para obtener la licencia otorgada por ENACOM. Formación en técnica, legislación y operación responsable.",
  },
  {
    icon: Shield,
    title: "Comunicaciones de emergencia",
    body:
      "Cuando fallan las redes convencionales, los radioaficionados operativos aseguran el enlace con Defensa Civil, bomberos y organismos de respuesta.",
  },
];

function Radioaficion() {
  return (
    <section id="radioaficion" className="relative border-b border-border py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono-tech text-xs font-semibold uppercase text-primary">02 — Radioafición</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-5xl">
            Tecnología, servicio y comunidad
          </h2>
          <p className="mt-4 text-muted-foreground">
            La radioafición combina ciencia, técnica y vocación social. Un hobby que forma
            profesionales y salva vidas.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {RADIO_ITEMS.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative bg-card p-8 transition-colors hover:bg-secondary"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-sm border border-primary/30 bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Historia / Timeline ---------- */

const TIMELINE = [
  {
    year: "1950",
    title: "Fundación del Radio Club San Rafael",
    body:
      "Un grupo de pioneros funda la institución para nuclear a los radioaficionados del sur mendocino.",
  },
  {
    year: "1972",
    title: "Primera repetidora en VHF",
    body:
      "Se inaugura el primer sistema de repetidora, ampliando la cobertura sobre San Rafael y la cordillera.",
  },
  {
    year: "1985",
    title: "Camping Valle Grande",
    body:
      "El club adquiere un predio en Valle Grande para actividades sociales, deportivas y de radio en portable.",
  },
  {
    year: "2004",
    title: "Comunicaciones de emergencia",
    body:
      "Convenio con Defensa Civil provincial. La red del club se activa en incendios, aluviones y sismos.",
  },
  {
    year: "2018",
    title: "Modos digitales",
    body:
      "Incorporación de DMR, FT8 y sistemas de enlace. Se moderniza el parque de repetidoras.",
  },
  {
    year: "2025",
    title: "75 aniversario",
    body:
      "Celebramos tres cuartos de siglo activando estaciones especiales y publicando diplomas conmemorativos.",
  },
];

function Historia() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="historia" className="relative border-b border-border bg-surface-elevated py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono-tech text-xs font-semibold uppercase text-primary">03 — Historia</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Bitácora del club
          </h2>
          <p className="mt-4 text-muted-foreground">
            Hitos que marcaron el rumbo del Radio Club San Rafael. Hacé clic en cada año para ampliar.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-border sm:left-1/2" />
          <div className="space-y-4">
            {TIMELINE.map((e, i) => {
              const isOpen = open === i;
              const alignRight = i % 2 === 0;
              return (
                <motion.div
                  key={e.year}
                  initial={{ opacity: 0, x: alignRight ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5 }}
                  className={`relative pl-12 sm:w-1/2 sm:pl-0 ${
                    alignRight ? "sm:pr-10" : "sm:ml-auto sm:pl-10"
                  }`}
                >
                  <span className="absolute left-2 top-6 grid h-5 w-5 place-items-center rounded-full bg-background ring-2 ring-primary sm:left-auto sm:right-[-11px] sm:top-8">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  {!alignRight && (
                    <span className="absolute left-[-11px] top-8 hidden h-5 w-5 place-items-center rounded-full bg-background ring-2 ring-primary sm:grid">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                  )}

                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="card-stock w-full rounded-md p-5 text-left transition-colors hover:border-primary/60"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono-tech text-2xl font-bold text-primary">{e.year}</span>
                      <span className="text-sm font-semibold text-foreground">{e.title}</span>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-sm leading-relaxed text-muted-foreground">{e.body}</p>
                    </motion.div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Cursos ---------- */

function Cursos() {
  return (
    <section id="cursos" className="relative border-b border-border py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <p className="font-mono-tech text-xs font-semibold uppercase text-primary">04 — Cursos</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Obtené tu licencia de radioaficionado
          </h2>
          <p className="mt-4 text-muted-foreground">
            Formación integral con docentes matriculados. Al finalizar rendís el examen oficial de
            ENACOM y obtenés tu indicativo internacional.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Técnica y electrónica básica",
              "Legislación y reglamento",
              "Prácticas de operación en HF y VHF",
              "Prácticas con equipos del club",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-foreground">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <Zap className="h-3 w-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Inscribirme
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Descargar programa
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="perforated relative overflow-hidden rounded-md bg-primary p-8 text-primary-foreground"
        >
          <CardTicks />
          <div className="inline-flex items-center gap-2 rounded-sm bg-background/15 px-3 py-1 font-mono-tech text-[10px] font-semibold uppercase">
            Próximo curso
          </div>
          <h3 className="mt-4 font-display text-3xl font-bold">Operador General 2026</h3>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Modalidad presencial en sede + clases online.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 font-mono-tech text-sm">
            {[
              ["Inicio", "Marzo 2026"],
              ["Duración", "16 semanas"],
              ["Cupo", "24 alumnos"],
              ["Frecuencia", "2 clases/sem"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-sm bg-background/10 p-4">
                <dt className="text-[10px] uppercase text-primary-foreground/60">{k}</dt>
                <dd className="mt-1 text-lg font-semibold">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex items-center gap-3 text-xs text-primary-foreground/80">
            <Calendar className="h-4 w-4" />
            Inscripciones abiertas hasta febrero
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Examen ENACOM ---------- */

const CATEGORIAS = [
  {
    nombre: "Novicio",
    detalle: "Categoría de ingreso. Acceso a bandas de VHF/UHF y a segmentos acotados de HF.",
  },
  {
    nombre: "General",
    detalle: "Se accede tras acreditar antigüedad y actividad continuada como Novicio. Habilita más bandas de HF.",
  },
  {
    nombre: "Superior",
    detalle: "Máxima categoría: todas las bandas habilitadas, mayor potencia y posibilidad de operar repetidoras.",
  },
];

const PASOS_EXAMEN = [
  {
    title: "Curso en el club",
    body: "Técnica y electrónica básica, legislación y reglamento, y operación — dictado por socios matriculados.",
  },
  {
    title: "Inscripción",
    body: "Presentás tu documentación en la sede y quedás anotado en la próxima mesa de examen disponible.",
  },
  {
    title: "Mesa examinadora",
    body: "Rendís ante una mesa integrada por el club y veedores de otras instituciones, según el reglamento de ENACOM.",
  },
  {
    title: "Trámite y licencia",
    body: "Con el acta aprobada, el club gestiona el alta ante ENACOM y te llega tu indicativo internacional.",
  },
];

function ExamenEnacom() {
  return (
    <section id="examen" className="relative border-b border-border py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono-tech text-xs font-semibold uppercase text-primary">05 — Examen ENACOM</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Cómo se rinde el examen de radioaficionado
          </h2>
          <p className="mt-4 text-muted-foreground">
            La licencia la otorga el Ente Nacional de Comunicaciones (ENACOM), según el Reglamento
            General de Radioaficionados (Res. 3635-E/2017). El club te acompaña en todo el proceso.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {PASOS_EXAMEN.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card-stock relative rounded-md p-6"
              >
                <span className="font-mono-tech text-xs text-primary">{`0${i + 1}`}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="perforated relative overflow-hidden rounded-md bg-surface-elevated p-6"
          >
            <CardTicks />
            <p className="font-mono-tech text-[11px] uppercase text-muted-foreground">Categorías</p>
            <ul className="mt-4 space-y-4">
              {CATEGORIAS.map((c) => (
                <li key={c.nombre} className="border-l-2 border-primary/40 pl-3">
                  <p className="font-display text-sm font-bold text-foreground">{c.nombre}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.detalle}</p>
                </li>
              ))}
            </ul>
            <div className="perforated-b mt-6 pb-5" />
            <div className="mt-5 flex flex-col gap-2">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Anotarme al próximo examen
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://www.enacom.gob.ar/radioaficionados_p127"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Reglamento oficial de ENACOM
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Biblioteca de estudio ---------- */

const MATERIALES = [
  {
    icon: Zap,
    title: "Técnica y electrónica",
    body: "Fundamentos de circuitos, antenas, propagación y equipos, tal como se dictan en el curso del club.",
    status: "Disponible en secretaría",
  },
  {
    icon: BookOpen,
    title: "Legislación y reglamento",
    body: "El Reglamento General de Radioaficionados de ENACOM (Res. 3635-E/2017) que rige la actividad en Argentina.",
    status: "Ver reglamento oficial",
    href: "https://www.enacom.gob.ar/radioaficionados_p127",
  },
  {
    icon: Radar,
    title: "Operación y ética operativa",
    body: "Procedimientos de radio, fonética internacional, uso de repetidoras y protocolo en emergencias.",
    status: "Disponible en secretaría",
  },
  {
    icon: Signal,
    title: "Modos digitales",
    body: "Guías de DMR, FT8 y otros modos digitales usados en las repetidoras y activaciones del club.",
    status: "Próximamente",
  },
];

function Biblioteca() {
  return (
    <section id="biblioteca" className="relative border-b border-border bg-surface-elevated py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono-tech text-xs font-semibold uppercase text-primary">06 — Biblioteca</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Material de estudio
          </h2>
          <p className="mt-4 text-muted-foreground">
            Los mismos temas que se dictan en el curso presencial, organizados para repasar antes del
            examen. El club amplía este material regularmente.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {MATERIALES.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-stock flex items-start gap-4 rounded-md p-6"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-primary/30 bg-primary/10 text-primary">
                <m.icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold text-foreground">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                {m.href ? (
                  <a
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    {m.status}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="mt-3 inline-flex items-center gap-1.5 font-mono-tech text-[11px] uppercase text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                    {m.status}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Repetidoras (preview) ---------- */

const REPEATERS = [
  { name: "Cerro Diamante", freq: "147.210", offset: "+600", tone: "110.9", status: "operativa" },
  { name: "Ciudad de San Rafael", freq: "147.060", offset: "+600", tone: "—", status: "operativa" },
];

function Repetidoras() {
  return (
    <section id="repetidoras" className="relative border-b border-border py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono-tech text-xs font-semibold uppercase text-primary">07 — Repetidoras</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Red de repetidoras del club
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sistema propio en VHF y UHF con cobertura sobre el sur mendocino, cordillera y zonas de
            actividades al aire libre.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {REPEATERS.map((r, i) => {
            const ok = r.status === "operativa";
            return (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card-stock rounded-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-sm border border-primary/30 bg-primary/10 text-primary">
                      <Radar className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">{r.name}</h3>
                      <p className="font-mono-tech text-xs uppercase text-muted-foreground">
                        VHF · San Rafael
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono-tech text-[10px] font-semibold uppercase ${
                      ok
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-amber-500/15 text-amber-600"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-600" : "bg-amber-600"} ${
                        ok ? "animate-pulse" : ""
                      }`}
                    />
                    {r.status}
                  </span>
                </div>
                <dl className="mt-6 grid grid-cols-3 gap-3 text-center font-mono-tech">
                  {[
                    ["Frec MHz", r.freq],
                    ["Offset", r.offset],
                    ["Subtono", r.tone],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-sm bg-surface-elevated p-3">
                      <dt className="text-[9px] uppercase text-muted-foreground">
                        {k}
                      </dt>
                      <dd className="mt-1 text-sm font-bold tabular-nums text-foreground">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Propagación ---------- */

function Propagacion() {
  return (
    <section id="propagacion" className="relative border-b border-border py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="font-mono-tech text-xs font-semibold uppercase text-primary">08 — Propagación</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Condiciones de propagación HF
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              El estado del sol determina cómo viajan las señales en HF. Estos son los indicadores que
              consultamos antes de salir al aire:
            </p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-primary/30 bg-primary/10 font-mono-tech text-[11px] font-bold text-primary">
                  SFI
                </span>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Flujo solar. </span>
                  Cuanto más alto, mejor suelen abrirse las bandas altas de HF (10 a 15 m).
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-primary/30 bg-primary/10 font-mono-tech text-[11px] font-bold text-primary">
                  K
                </span>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Índice geomagnético. </span>
                  Cuanto más bajo, más estable está el enlace. Valores altos anticipan aperturas pobres.
                </p>
              </li>
            </ul>
            <p className="mt-6 font-mono-tech text-[11px] uppercase text-muted-foreground">
              Datos: N0NBH ·{" "}
              <a
                href="https://www.hamqsl.com/solar.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                hamqsl.com
              </a>
              {" "}· se actualiza automáticamente
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="perforated relative overflow-hidden rounded-md bg-surface-elevated p-4 sm:p-6"
          >
            <CardTicks />
            <img
              src="https://www.hamqsl.com/solar101pic.php"
              alt="Condiciones solares y de propagación HF en vivo (N0NBH / hamqsl.com)"
              loading="lazy"
              className="mx-auto w-full max-w-md rounded-sm border border-border"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Camping ---------- */

function CampingCarousel() {
  const images = [
    { src: campingImage, alt: "Camping del Radio Club San Rafael en Valle Grande, sobre el río Atuel" },
    { src: campingCarrusel1, alt: "Río en Valle Grande, San Rafael, atardecer" },
    { src: campingCarrusel2, alt: "Costa del río en Valle Grande con playa de piedras" },
    { src: campingCarrusel3, alt: "Puesta de sol sobre el río en Valle Grande" },
  ];
  const [index, setIndex] = useState(0);
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + images.length) % images.length);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border shadow-elevated">
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          width={900}
          height={675}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4">
        <div>
          <p className="font-mono-tech text-xs uppercase text-white/70">Ubicación</p>
          <p className="font-display text-sm font-bold text-white">
            Valle Grande · Cañón del Atuel
          </p>
        </div>
        <MapPin className="h-5 w-5 text-white" />
      </div>

      {/* Controles del carrusel */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Foto anterior"
        className="absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Foto siguiente"
        className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <div className="absolute top-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir a la foto ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Camping() {
  return (
    <section id="camping" className="relative overflow-hidden border-b border-border bg-surface-elevated py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.1fr_1fr] md:items-center lg:px-8">
        <div>
          <p className="font-mono-tech text-xs font-semibold uppercase text-primary">09 — Camping Valle Grande</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Naturaleza y río en Valle Grande
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Un espacio único para socios y familia sobre el Cañón del Atuel: activaciones portables,
            fogones, campeonatos y encuentros institucionales.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {["Fogones", "Parrillas", "Antenas portables", "Baños", "Estacionamiento", "Salón"].map(
              (f) => (
                <div
                  key={f}
                  className="rounded-sm border border-border bg-surface px-3 py-2 text-center text-xs font-medium text-foreground"
                >
                  {f}
                </div>
              )
            )}
          </div>
        </div>

        <CampingCarousel />
      </div>
    </section>
  );
}

/* ---------- Socios CTA ---------- */

function Socios() {
  return (
    <section id="socios" className="relative border-b border-border py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="perforated relative overflow-hidden rounded-md bg-gold p-10 text-gold-foreground sm:p-14"
        >
          <CardTicks />
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-sm bg-primary px-3 py-1 font-mono-tech text-[10px] font-semibold uppercase text-primary-foreground">
                <Heart className="h-3 w-3" /> Comunidad
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                Hacete socio del Radio Club San Rafael
              </h2>
              <p className="mt-4 max-w-xl opacity-80">
                Accedé a las repetidoras, cursos con beneficios, uso del camping y participá de la red
                de emergencia. Tu aporte sostiene la infraestructura del club.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Solicitar asociación
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-current/30 px-5 py-3 text-sm font-semibold hover:bg-background/10"
              >
                Consultar cuota
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Contacto ---------- */

const CONTACT_ROWS = [
  { icon: MapPin, label: "Sede social", value: "Venezuela 87, San Rafael — Mendoza" },
  { icon: Mail, label: "Correo", value: "lu9mabsanrafael@yahoo.com.ar" },
  { icon: Phone, label: "WhatsApp", value: "+54 9 260 440-0601" },
  { icon: Clock, label: "Horario de secretaría", value: "Sábados 18 a 21 h" },
];

const CLUB_PHONE_INTL = "5492604400601"; // +54 9 2604400601, formato para wa.me
const CLUB_EMAIL = "lu9mabsanrafael@yahoo.com.ar";

function Contacto() {
  const formRef = useRef<HTMLFormElement>(null);

  const sendVia = (via: "whatsapp" | "email") => {
    const form = formRef.current;
    if (!form) return;
    if (!form.reportValidity()) return; // respeta los "required" del formulario

    const fd = new FormData(form);
    const nombre = String(fd.get("nombre") || "");
    const indicativo = String(fd.get("indicativo") || "");
    const email = String(fd.get("email") || "");
    const mensaje = String(fd.get("mensaje") || "");

    const cuerpo = [
      `Nombre: ${nombre}${indicativo ? ` (${indicativo})` : ""}`,
      `Correo de contacto: ${email}`,
      "",
      mensaje,
    ].join("\n");

    if (via === "whatsapp") {
      const texto = `Radiograma - Mensaje al club\n\n${cuerpo}`;
      window.open(`https://wa.me/${CLUB_PHONE_INTL}?text=${encodeURIComponent(texto)}`, "_blank");
    } else {
      const asunto = `Radiograma - Mensaje al club de ${nombre || "un radioaficionado"}`;
      window.location.href = `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    }
  };

  return (
    <section id="contacto" className="relative bg-surface-elevated py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono-tech text-xs font-semibold uppercase text-primary">10 — Contacto</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Hablemos por aire, o por escrito
          </h2>
          <p className="mt-4 text-muted-foreground">
            Consultas sobre cursos, asociación, el camping o la red de emergencia. Respondemos por
            los mismos canales que usamos para operar.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Station info */}
          <div className="card-stock overflow-hidden rounded-md">
            <div className="flex items-center justify-between bg-primary px-6 py-4">
              <span className="font-mono-tech text-xs font-bold uppercase tracking-wide text-primary-foreground">
                Estación base
              </span>
              <span className="font-mono-tech text-xs font-bold text-primary-foreground">LU9MAB</span>
            </div>
            <ul className="divide-y divide-border">
              {CONTACT_ROWS.map((row) => (
                <li key={row.label} className="flex items-start gap-4 px-6 py-5">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-primary/30 bg-primary/10 text-primary">
                    <row.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono-tech text-[10px] uppercase text-muted-foreground">
                      {row.label}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{row.value}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 border-t border-border px-6 py-5">
              <a
                href="https://www.facebook.com/p/Radio-Club-San-Rafael-100064487148257/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <IconFacebook className="h-4 w-4" />
                <span className="hidden sm:inline">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/radioclub.sr/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <IconInstagram className="h-4 w-4" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
              <a
                href={`https://wa.me/${CLUB_PHONE_INTL}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Radiogram-style message form */}
          <motion.form
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="perforated relative overflow-hidden rounded-md bg-background"
            aria-label="Formulario de contacto"
          >
            <CardTicks />
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-primary/30 bg-surface-elevated px-6 py-4">
              <span className="font-mono-tech text-xs font-bold uppercase tracking-wider text-primary">
                Radiograma · Mensaje al club
              </span>
              <span className="font-mono-tech text-[10px] uppercase text-muted-foreground">
                Nº {new Date().getFullYear()}-000
              </span>
            </div>

            <div className="grid gap-5 p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono-tech text-[11px] font-semibold uppercase text-muted-foreground">
                    De (nombre)
                  </span>
                  <input
                    required
                    type="text"
                    name="nombre"
                    maxLength={80}
                    className="border-b border-border bg-transparent pb-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary"
                    placeholder="Tu nombre"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono-tech text-[11px] font-semibold uppercase text-muted-foreground">
                    Indicativo (opcional)
                  </span>
                  <input
                    type="text"
                    name="indicativo"
                    maxLength={20}
                    className="border-b border-border bg-transparent pb-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary"
                    placeholder="LU9XYZ"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono-tech text-[11px] font-semibold uppercase text-muted-foreground">
                  Vía de respuesta (correo)
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  maxLength={120}
                  className="border-b border-border bg-transparent pb-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary"
                  placeholder="tu@correo.com"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono-tech text-[11px] font-semibold uppercase text-muted-foreground">
                  Texto del mensaje
                </span>
                <textarea
                  required
                  name="mensaje"
                  rows={5}
                  maxLength={1000}
                  className="resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  placeholder="Contanos en qué podemos ayudarte"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => sendVia("whatsapp")}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4" />
                  Enviar por WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => sendVia("email")}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <Mail className="h-4 w-4" />
                  Enviar por correo
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <LogoBadge size={40} />
              <div>
                <p className="font-display text-sm font-bold text-foreground">
                  Radio Club San Rafael
                </p>
                <p className="font-mono-tech text-[10px] uppercase text-primary">
                  LU9MAB · desde 1950
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Institución de radioaficionados sin fines de lucro. Promovemos la técnica, la
              formación y las comunicaciones de emergencia en el sur mendocino.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                {
                  icon: IconFacebook,
                  label: "Facebook",
                  href: "https://www.facebook.com/p/Radio-Club-San-Rafael-100064487148257/",
                },
                {
                  icon: IconInstagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/radioclub.sr/",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-surface text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-sm font-bold text-foreground">Enlaces</p>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV_LINKS.slice(0, 5).map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold text-foreground">Contacto</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Venezuela 87, San Rafael</li>
              <li>lu9mabsanrafael@yahoo.com.ar</li>
              <li>+54 260 400-0000</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Radio Club San Rafael. Todos los derechos reservados.</p>
          <p>Hecho con vocación técnica y de servicio.</p>
        </div>
      </div>
    </footer>
  );
}

/* Shows once, after 40s with no mouse/keyboard/scroll/touch activity. */
function InactivityPopup() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const INACTIVITY_MS = 40_000;

    const reset = () => {
      clearTimeout(timer);
      if (shownRef.current) return;
      timer = setTimeout(() => {
        if (!shownRef.current) {
          shownRef.current = true;
          setOpen(true);
        }
      }, INACTIVITY_MS);
    };

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "wheel",
    ];
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    reset();

    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inactivity-title"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="perforated relative w-full max-w-sm overflow-hidden rounded-md bg-background p-6 sm:p-7"
      >
        <CardTicks />
        <button
          onClick={() => setOpen(false)}
          aria-label="Cerrar"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {sent ? (
          <div className="pt-2 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
              <Heart className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">¡Gracias!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Te vamos a avisar apenas abramos inscripciones y publiquemos novedades.
            </p>
          </div>
        ) : (
          <>
            <span className="inline-flex items-center gap-2 rounded-sm bg-primary/10 px-3 py-1 font-mono-tech text-[10px] font-semibold uppercase text-primary">
              <Signal className="h-3 w-3" /> ¿Seguís por ahí?
            </span>
            <h3 id="inactivity-title" className="mt-3 font-display text-xl font-bold text-foreground">
              Te avisamos del próximo curso
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Dejanos tu correo y te contactamos cuando abramos inscripciones o haya novedades del
              club — sin spam, solo lo importante.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-5 flex flex-col gap-2.5"
            >
              <input
                required
                type="email"
                maxLength={120}
                placeholder="tu@correo.com"
                className="rounded-sm border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Quiero que me avisen
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="py-1 text-center text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                No, gracias
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ---------- Page ---------- */

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Header />
      <main id="main">
        <Hero />
        <Stats />
        <Radioaficion />
        <Historia />
        <Cursos />
        <ExamenEnacom />
        <Biblioteca />
        <Repetidoras />
        <Propagacion />
        <Camping />
        <Socios />
        <Contacto />
      </main>
      <Footer />
      <InactivityPopup />
    </div>
  );
}
