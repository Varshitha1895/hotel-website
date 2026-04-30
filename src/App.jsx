import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Phone, Wifi, Zap, Car, ChevronLeft, ChevronRight,
  Star, Send, MessageCircle, Navigation, X, Check, Bed, Users,
  Shield, Clock, Coffee, Menu, Mail, Instagram
} from "lucide-react";

/* ─── PALETTE ───────────────────────────────────────────────────────────────── */
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const GOLD_DARK = "#A67C2E";
const DEEP_BLUE = "#2C2825"; // Warm neutral dark

/* Dark mode = warm neutral/espresso */
const DARK = {
  pageBg : "#1A1714",
  cardBg : "#231F1C",
  surface: "#2D2824",
  border : "rgba(201,168,76,0.22)",
  text   : "#F0EFE8",
  muted  : "#A59E95",
  input  : "#332D28",
};
const LIGHT = {
  pageBg : "#F9F6EF",
  cardBg : "#FFFFFF",
  surface: "#F0EBE0",
  border : "rgba(201,168,76,0.2)",
  text   : DEEP_BLUE,
  muted  : "#64748B",
  input  : "#F5F2EB",
};
const th = (dark) => dark ? DARK : LIGHT;

/* ─── HERO CAROUSEL DATA (4 rich CSS hotel scenes) ─────────────────────────── */
const SLIDES = [
  {
    id: 0,
    tag: "Welcome to",
    h1: "Hotel Sree",
    h2: "Krishna Grand",
    sub: "Experience Premium Comfort in Palvancha",
    image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777546595/download_23_fporjh.jpg",
  },
  {
    id: 1,
    tag: "Luxury Rooms",
    h1: "Comfort Built",
    h2: "for Royalty",
    sub: "King-size beds · Split AC · HD TV — every detail crafted for you",
    image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777546595/download_23_fporjh.jpg",
  },
  {
    id: 2,
    tag: "Prime Location",
    h1: "One of Hotel in ",
    h2: "Palvancha",
    sub: "Ideally located near Bhadrachalam — the perfect base for your journey",
    image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777546651/download_24_onrqmb.jpg",
  },
  {
    id: 3,
    tag: "All Included",
    h1: "Premium",
    h2: "Amenities",
    sub: "Free Wi-Fi · 24/7 power · Parking · Lift — luxury without extra cost",
    image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777546548/Eleganz_pur_in_dieser_Lobby_kjnq9j.jpg",
  },
];

/* ─── STATIC DATA ───────────────────────────────────────────────────────────── */
const INITIAL_REVIEWS = [
  { id:1, name:"Ramesh Babu",     rating:5, avatar:"RB", date:"March 2025",    text:"Best A/C rooms in Palvancha! Spotlessly clean and the staff were incredibly helpful. Will definitely come back." },
  { id:2, name:"Priya Sharma",    rating:5, avatar:"PS", date:"February 2025", text:"Great hospitality and very clean rooms. The location is perfect for visiting Bhadrachalam. Highly recommended!" },
  { id:3, name:"Venkat Reddy",    rating:5, avatar:"VR", date:"January 2025",  text:"Excellent service! The AC was powerful and hot water was consistent. Best value hotel in the area." },
  { id:4, name:"Anitha K",        rating:4, avatar:"AK", date:"December 2024", text:"Very comfortable stay. Room was spacious and well-maintained. Free WiFi worked great throughout the stay." },
  { id:5, name:"Mohammed Farhan", rating:5, avatar:"MF", date:"November 2024", text:"Stayed 3 nights for a family trip. The hotel exceeded all our expectations. Pure luxury!" },
];

const ROOM_TYPES = [
  { id:"deluxe-ac",   label:"Deluxe AC Room",     price:1499 },
  { id:"standard-ac", label:"Standard AC Room",   price:999  },
  { id:"non-ac",      label:"Non-AC Double Room",  price:699  },
];

const AMENITIES = [
  { icon:Wifi,   label:"Free Wi-Fi",         desc:"High-speed throughout"  },
  { icon:Zap,    label:"24/7 Power",         desc:"Uninterrupted supply"   },
  { icon:Coffee, label:"Room Service",       desc:"Meals to your door"     },
  { icon:Shield, label:"CCTV Security",      desc:"24/7 surveillance"      },
  { icon:Car,    label:"Free Parking",       desc:"Safe & spacious"        },
  { icon:Clock,  label:"Front Desk 24/7",    desc:"Always available"       },
  { icon:Bed,    label:"Daily Housekeeping", desc:"Fresh rooms daily"      },
  { icon:Users,  label:"Lift Access",        desc:"Easy floor access"      },
];

const ROOMS = [
  { id:1, type:"Deluxe AC Room",     tag:"Most Popular", price:1499, icon:"👑", desc:"Experience the pinnacle of luxury in our spacious Deluxe AC Room. Designed with premium aesthetics, it features a plush king-size bed, high-end linens, and a state-of-the-art split AC for your perfect comfort. Unwind with HD television entertainment and enjoy the expansive en-suite bathroom with 24/7 hot water. Whether you are traveling for business or a romantic retreat, this room is meticulously crafted to exceed your expectations. Every detail is curated for guests who demand the very best in hospitality and refined living.", features:["King Bed","Split AC","HD TV","Hot Water","Wi-Fi"], image:"https://res.cloudinary.com/djuu7sxfw/image/upload/v1777547269/Glam_Decor_Design_For_A_Master_Bedroom_xu6ksa.jpg" },
  { id:2, type:"Standard AC Room",   tag:"Best Value",   price:999,  icon:"🏨", desc:"Enjoy an oasis of tranquility in our beautifully appointed Standard AC Room. This elegant space offers refreshing air-conditioned comfort, a cozy queen-size bed, and a thoughtfully designed interior that ensures a deeply restful stay. With essential amenities including complimentary high-speed Wi-Fi and television, you have everything needed for a relaxing getaway. Wake up feeling completely refreshed and ready to explore Palvancha, knowing you have a comfortable and stylish haven to return to each evening. Experience true comfort.", features:["Queen Bed","Window AC","TV","Hot Water","Wi-Fi"], image:"https://res.cloudinary.com/djuu7sxfw/image/upload/v1777547280/luxury_hotel_bedroom_Stock_Photo_qo1qno.jpg" },
  { id:3, type:"Non-AC Double Room", tag:"Budget Pick",  price:699,  icon:"🛏️", desc:"Discover incredible value without compromising on comfort in our Non-AC Double Room. Thoughtfully furnished to provide a clean and inviting atmosphere, this room features a comfortable double bed, excellent natural ventilation, and a ceiling fan. It's the perfect choice for budget-conscious travelers seeking a cozy, secure, and relaxing environment. Our attentive daily housekeeping ensures that your space remains pristine throughout your stay, allowing you to focus purely on enjoying your journey without any hassle.", features:["Double Bed","Ceiling Fan","TV","Hot Water","Wi-Fi"], image:"https://res.cloudinary.com/djuu7sxfw/image/upload/v1777548373/Beautiful_AI_Bed_Design_for_Modern_Homes_mr5qdz.jpg" },
];

const GALLERY = [
  { bg:"linear-gradient(135deg,#242428,#1C1C20)", ac:GOLD,       icon:"🛏️", label:"Deluxe Bedroom",   sub:"King Size · AC · TV" },
  { bg:"linear-gradient(135deg,#1C1C20,#111113)", ac:GOLD_LIGHT, icon:"🛁", label:"Luxury Bathroom",  sub:"Hot Water · 24/7"    },
  { bg:"linear-gradient(135deg,#2A2A2F,#1C1C20)", ac:GOLD,       icon:"👑", label:"Premium Suite",    sub:"Split AC · Spacious" },
  { bg:"linear-gradient(135deg,#111113,#242428)", ac:GOLD_LIGHT, icon:"🚿", label:"Modern Shower",    sub:"Rain Shower · Clean" },
  { bg:"linear-gradient(135deg,#1C1C20,#2A2A2F)", ac:GOLD,       icon:"🏨", label:"Reception Lobby",  sub:"24/7 Front Desk"     },
  { bg:"linear-gradient(135deg,#242428,#111113)", ac:GOLD_LIGHT, icon:"☕", label:"Room Service",     sub:"Meals to Your Door"  },
  { bg:"linear-gradient(135deg,#111113,#1C1C20)", ac:GOLD,       icon:"🛋️", label:"Standard Room",    sub:"Window AC · Cozy"    },
  { bg:"linear-gradient(135deg,#2A2A2F,#242428)", ac:GOLD_LIGHT, icon:"🌙", label:"Night Ambiance",   sub:"Peaceful · Quiet"    },
  { bg:"linear-gradient(135deg,#1C1C20,#111113)", ac:GOLD,       icon:"🪟", label:"Twin Room",        sub:"Two Beds · Spacious" },
  { bg:"linear-gradient(135deg,#242428,#1C1C20)", ac:GOLD_LIGHT, icon:"✨", label:"Elegant Interior", sub:"Premium Furnishing"  },
];

/* ─── UTILITIES ─────────────────────────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0, dir = "up" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity:0, y:dir==="up"?48:dir==="down"?-48:0, x:dir==="left"?48:dir==="right"?-48:0 }}
      animate={inView ? { opacity:1, y:0, x:0 } : {}}
      transition={{ duration:0.75, delay, ease:[0.22,1,0.36,1] }}>
      {children}
    </motion.div>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <div className="h-px w-16" style={{ background:`linear-gradient(to right,transparent,${GOLD})` }} />
      <div className="w-2 h-2 rotate-45 flex-shrink-0" style={{ background:GOLD }} />
      <div className="h-px w-16" style={{ background:`linear-gradient(to left,transparent,${GOLD})` }} />
    </div>
  );
}

function SecHead({ tag, title, sub, dark = false }) {
  const T = th(dark);
  return (
    <div className="text-center mb-16">
      <Reveal>
        <p className="uppercase tracking-[0.35em] text-xs font-bold mb-3" style={{ color:GOLD }}>{tag}</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color:T.text }}>{title}</h2>
        <GoldDivider />
        {sub && <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed mt-2" style={{ color:T.muted }}>{sub}</p>}
      </Reveal>
    </div>
  );
}

/* ─── CONFETTI ──────────────────────────────────────────────────────────────── */
function Confetti({ active }) {
  if (!active) return null;
  const p = Array.from({ length:60 }, (_,i) => ({
    id:i, x:Math.random()*100,
    color:[GOLD,GOLD_LIGHT,"#fff","#4a90d9","#2ECC71"][i%5],
    delay:Math.random()*0.5, dur:1.5+Math.random(), size:6+Math.random()*8, rot:Math.random()*360,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {p.map(q => (
        <motion.div key={q.id} className="absolute top-0 rounded-sm"
          style={{ left:`${q.x}%`, width:q.size, height:q.size, background:q.color }}
          initial={{ y:-20, opacity:1, rotate:q.rot }}
          animate={{ y:"110vh", opacity:[1,1,0], rotate:q.rot+360 }}
          transition={{ duration:q.dur, delay:q.delay, ease:"linear" }} />
      ))}
    </div>
  );
}

/* ─── GOLD DOTS BACKGROUND — soft glowing dots with mouse repel effect ──────── */
/* Used in Hero and optionally in themed sections.                               */
/* Dots float randomly; when mouse is nearby (< 120px) they gently push away.  */
function GoldDots({ count = 28, className = "absolute inset-0" }) {
  const mouseRef = useRef({ x: -999, y: -999 });
  const REPEL_RADIUS = 120;
  const REPEL_STRENGTH = 55;

  // Each dot: stable base position + animated offsets driven by mouse proximity
  const dots = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      bx: 5 + Math.random() * 90,   // base X %
      by: 5 + Math.random() * 90,   // base Y %
      size: 3 + Math.random() * 5,
      opacity: 0.12 + Math.random() * 0.22,
      dur: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      phase: Math.random() * Math.PI * 2,
    }))
  ).current;

  const [offsets, setOffsets] = useState(() => dots.map(() => ({ dx: 0, dy: 0 })));
  const rafRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -999, y: -999 }; };
    const el = containerRef.current;
    el?.addEventListener("mousemove", onMove);
    el?.addEventListener("mouseleave", onLeave);

    let t = 0;
    const animate = () => {
      t += 0.012;
      const W = containerRef.current?.offsetWidth  || 1000;
      const H = containerRef.current?.offsetHeight || 600;
      const { x: mx, y: my } = mouseRef.current;

      setOffsets(dots.map((d) => {
        // Natural float offset (sine wave)
        const floatX = Math.sin(t * 0.7 + d.phase) * 8;
        const floatY = Math.cos(t * 0.5 + d.phase) * 12;

        // Pixel position of this dot at base
        const px = (d.bx / 100) * W + floatX;
        const py = (d.by / 100) * H + floatY;

        const dx_raw = px - mx;
        const dy_raw = py - my;
        const dist   = Math.sqrt(dx_raw * dx_raw + dy_raw * dy_raw);

        let repelX = 0, repelY = 0;
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          repelX = (dx_raw / dist) * force;
          repelY = (dy_raw / dist) * force;
        }
        return { dx: floatX + repelX, dy: floatY + repelY };
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el?.removeEventListener("mousemove", onMove);
      el?.removeEventListener("mouseleave", onLeave);
    };
  }, [dots]);

  return (
    <div ref={containerRef} className={`${className} overflow-hidden pointer-events-none`} style={{ zIndex:1 }}>
      {dots.map((d, i) => (
        <div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.bx}%`,
            top:  `${d.by}%`,
            width:  d.size,
            height: d.size,
            opacity: d.opacity,
            background: GOLD,
            boxShadow: `0 0 ${d.size * 3}px ${d.size}px rgba(201,168,76,0.35)`,
            transform: `translate(${offsets[i]?.dx ?? 0}px, ${offsets[i]?.dy ?? 0}px)`,
            transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

/* Keep a lightweight FloatingParticles alias for Hero (uses GoldDots internally) */
function FloatingParticles() {
  return <GoldDots count={22} className="absolute inset-0 pointer-events-none" />;
}

/* ─── 3D HOTEL SCENE BACKGROUNDS for hero carousel ─────────────────────────── */
function HotelScene({ scene, active }) {
  /* Each scene: clean neutral charcoal gradient sky */
  const scenes = {
    entrance: {
      sky: "linear-gradient(180deg,#111113 0%,#1C1C20 50%,#151518 100%)",
      glow1: "radial-gradient(ellipse at 50% 85%,rgba(201,168,76,0.18) 0%,transparent 58%)",
      glow2: "radial-gradient(ellipse at 20% 25%,rgba(255,255,255,0.05) 0%,transparent 48%)",
    },
    rooms: {
      sky: "linear-gradient(180deg,#0D0D0F 0%,#1A1A1E 50%,#202024 100%)",
      glow1: "radial-gradient(ellipse at 70% 65%,rgba(255,255,255,0.05) 0%,transparent 52%)",
      glow2: "radial-gradient(ellipse at 28% 20%,rgba(201,168,76,0.12) 0%,transparent 44%)",
    },
    location: {
      sky: "linear-gradient(180deg,#0A0A0C 0%,#151518 50%,#1C1C20 100%)",
      glow1: "radial-gradient(ellipse at 50% 88%,rgba(201,168,76,0.18) 0%,transparent 48%)",
      glow2: "radial-gradient(ellipse at 75% 22%,rgba(201,168,76,0.08) 0%,transparent 38%)",
    },
    amenities: {
      sky: "linear-gradient(180deg,#0E0E10 0%,#1C1C20 55%,#111113 100%)",
      glow1: "radial-gradient(ellipse at 25% 72%,rgba(201,168,76,0.18) 0%,transparent 44%)",
      glow2: "radial-gradient(ellipse at 80% 28%,rgba(255,255,255,0.05) 0%,transparent 48%)",
    },
  };
  const sc = scenes[scene] || scenes.entrance;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Clean deep blue sky — no grid/diagonal lines */}
      <div className="absolute inset-0" style={{ background: sc.sky }} />
      {/* Gold ground glow */}
      <div className="absolute inset-0" style={{ background: sc.glow1 }} />
      {/* Soft accent light */}
      <div className="absolute inset-0" style={{ background: sc.glow2 }} />

      {/* 3D Animated Hotel Building */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl" style={{ perspective: "800px" }}>
        <motion.div
          animate={active ? { rotateY: [0, 1.5, 0, -1.5, 0], scale: [1, 1.003, 1] } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}>
          <svg width="100%" viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg">
            {/* Ground plane - perspective floor */}
            <ellipse cx="350" cy="375" rx="340" ry="18" fill="rgba(201,168,76,0.08)" />

            {/* Left wing */}
            <rect x="30" y="160" width="120" height="220" fill="#2A2622" rx="3" />
            <rect x="30" y="158" width="120" height="6" fill={GOLD} opacity="0.7" />
            {/* Left wing windows */}
            {[[40,175],[80,175],[115,175],[40,210],[80,210],[115,210],[40,245],[80,245],[115,245],[40,280],[80,280],[115,280],[40,315],[80,315],[115,315]].map(([x,y],i) => (
              <g key={i}>
                <rect x={x} y={y} width="22" height="26" rx="2" fill={i%4===0?"#E8C97A":i%3===0?"#C9A84C":"#B3A999"} opacity={0.18+(i%5)*0.12} />
                <rect x={x+1} y={y+1} width="20" height="11" rx="1" fill={i%3===0?"#E8C97A":"#D1C9BB"} opacity={0.45+(i%4)*0.15} />
              </g>
            ))}

            {/* Right wing */}
            <rect x="550" y="160" width="120" height="220" fill="#2A2622" rx="3" />
            <rect x="550" y="158" width="120" height="6" fill={GOLD} opacity="0.7" />
            {[[560,175],[600,175],[635,175],[560,210],[600,210],[635,210],[560,245],[600,245],[635,245],[560,280],[600,280],[635,280],[560,315],[600,315],[635,315]].map(([x,y],i) => (
              <g key={i}>
                <rect x={x} y={y} width="22" height="26" rx="2" fill={i%4===0?"#E8C97A":i%3===0?"#C9A84C":"#B3A999"} opacity={0.18+(i%5)*0.12} />
                <rect x={x+1} y={y+1} width="20" height="11" rx="1" fill={i%3===0?"#E8C97A":"#D1C9BB"} opacity={0.45+(i%4)*0.15} />
              </g>
            ))}

            {/* Main central tower */}
            <rect x="130" y="60" width="440" height="320" fill="#36312B" rx="4" />
            <rect x="130" y="58" width="440" height="8" fill={GOLD} opacity="0.85" rx="2" />

            {/* Rooftop parapet */}
            <rect x="150" y="32" width="400" height="30" fill="#231F1B" rx="3" />
            <rect x="170" y="18" width="360" height="18" fill="#1A1612" rx="2" />
            <rect x="150" y="30" width="400" height="6" fill={GOLD} opacity="0.6" />

            {/* Rooftop flag */}
            <rect x="348" y="5" width="2" height="30" fill={GOLD} opacity="0.7" />
            <polygon points="350,5 370,12 350,19" fill={GOLD} opacity="0.8" />

            {/* Central tower floor lines */}
            {[100,135,170,205,240,275,310,345].map((y,i) => (
              <rect key={i} x="130" y={y} width="440" height="1" fill={GOLD} opacity="0.12" />
            ))}

            {/* Main tower windows - 7 columns × 8 rows */}
            {[140,188,236,284,332,380,428,476].map((x,ci) =>
              [68,103,138,173,208,243,278,313].map((y,ri) => (
                <g key={`${ci}-${ri}`}>
                  <rect x={x} y={y} width="30" height="28" rx="2"
                    fill={(ci+ri)%5===0?GOLD:(ci+ri)%3===0?"#E8C97A":"#B3A999"}
                    opacity={0.15+((ci+ri)%5)*0.1} />
                  <rect x={x+1} y={y+1} width="28" height="12" rx="1"
                    fill={(ci+ri)%4===0?"#E8C97A":"#D1C9BB"}
                    opacity={0.4+((ci+ri)%4)*0.18} />
                </g>
              ))
            )}

            {/* Hotel signboard */}
            <rect x="185" y="218" width="330" height="36" fill={GOLD} opacity="0.1" rx="4" />
            <rect x="185" y="218" width="330" height="36" fill="none" stroke={GOLD} strokeOpacity="0.45" strokeWidth="1.5" rx="4" />
            <text x="350" y="241" textAnchor="middle" fill="#E8C97A" fontSize="13" fontFamily="Georgia,serif" fontWeight="bold" opacity="0.95">HOTEL SREE KRISHNA GRAND</text>

            {/* Grand portico */}
            <rect x="270" y="310" width="160" height="70" fill="#1C1814" rx="4 4 0 0" />
            <rect x="282" y="320" width="136" height="60" fill="#2A241F" rx="3 3 0 0" />
            <path d="M270 325 Q350 298 430 325" fill="none" stroke={GOLD} strokeWidth="2.5" opacity="0.7" />
            {/* Portico pillars */}
            <rect x="272" y="322" width="14" height="58" fill={GOLD} opacity="0.3" rx="2" />
            <rect x="414" y="322" width="14" height="58" fill={GOLD} opacity="0.3" rx="2" />
            {/* Door panels */}
            <rect x="307" y="332" width="32" height="48" fill={GOLD} opacity="0.1" rx="2" />
            <rect x="361" y="332" width="32" height="48" fill={GOLD} opacity="0.1" rx="2" />
            {/* Door handles */}
            <circle cx="339" cy="358" r="2.5" fill={GOLD} opacity="0.7" />
            <circle cx="361" cy="358" r="2.5" fill={GOLD} opacity="0.7" />

            {/* Ground gold glow */}
            <rect x="0" y="376" width="700" height="4" fill={GOLD} opacity="0.2" rx="2" />
          </svg>
        </motion.div>
      </div>

      {/* Ground reflection glow */}
      <div className="absolute bottom-0 left-0 right-0 h-40" style={{
        background:"linear-gradient(to top,rgba(201,168,76,0.12),transparent)"
      }} />
      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background:"radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.55) 100%)"
      }} />
      {/* Bottom fade so text above is readable */}
      <div className="absolute bottom-0 left-0 right-0 h-56" style={{
        background:"linear-gradient(to top,rgba(3,8,16,0.85),transparent)"
      }} />
    </div>
  );
}

/* ─── NAVBAR ────────────────────────────────────────────────────────────────── */
function Navbar() {
  const [sc, setSc] = useState(false);
  const [mo, setMo] = useState(false);
  useEffect(() => {
    const h = () => setSc(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMo(false); };
  const T = th();
  const nb = sc ? "rgba(255,255,255,0.95)" : "transparent";

  return (
    <>
      {/* Main Navbar */}
      <motion.nav initial={{ y:-80, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ duration:0.7, ease:[0.22,1,0.36,1], delay: 0.1 }}
        className="fixed left-0 right-0 z-50 transition-all duration-500"
        style={{ 
          top: 0, 
          background:nb, 
          backdropFilter:sc?"blur(20px)":"none",
          boxShadow:sc?"0 4px 30px rgba(0,0,0,0.15)":"none",
          borderBottom:sc?`1px solid ${T.border}`:"none" 
        }}
      >
        <div className="w-full px-6 md:px-12 lg:px-16 flex items-center justify-between h-24">
          <button onClick={() => go("hero")} className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:rotate-12"
              style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:DEEP_BLUE, boxShadow:`0 0 18px rgba(201,168,76,0.35)` }}>
              <span className="font-display text-lg font-black">SK</span>
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="font-display font-bold text-lg tracking-wide transition-colors" style={{ color:sc?T.text:"white" }}>Hotel Sree Krishna Grand</p>
              <p className="text-sm tracking-[0.2em] uppercase" style={{ color:GOLD }}>Premium Stay</p>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-6">
            {["About","Rooms","Gallery","Reviews","Contact"].map(l => (
              <button key={l} onClick={() => go(l.toLowerCase())}
                className="text-base font-display font-bold uppercase tracking-widest relative group transition-colors"
                style={{ color: sc ? T.text : "rgba(255,255,255,0.9)" }}>
                {l}
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300" style={{ background:GOLD }} />
              </button>
            ))}
            
            <div className="w-px h-6 mx-2" style={{ background: sc ? T.border : "rgba(255,255,255,0.2)" }} />


            
            <motion.a href="tel:+916305723339"
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
              className="w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{ borderColor: GOLD, color: sc ? T.text : "white" }}>
              <Phone size={16} />
            </motion.a>

            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
              onClick={() => go("booking")}
              className="px-8 py-3 rounded-lg text-sm font-display font-black tracking-widest uppercase relative overflow-hidden group"
              style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:DEEP_BLUE, boxShadow:`0 4px 20px rgba(201,168,76,0.35)` }}>
              <span className="relative z-10">Book Now</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </motion.button>
          </div>

          <div className="md:hidden flex items-center gap-3">

            <button onClick={() => setMo(!mo)} style={{ color:sc?T.text:"white" }}>
              {mo ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mo && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
              className="md:hidden overflow-hidden"
              style={{ background:"rgba(255,255,255,0.99)", borderTop:`1px solid ${T.border}` }}>
              <div className="px-6 py-4 space-y-1">
                {/* Mobile Contact Info */}
                <div className="flex flex-col gap-3 mb-4 pb-4 border-b" style={{ borderColor: T.border }}>
                  <a href="tel:+916305723339" className="flex items-center gap-3 text-sm font-bold" style={{ color: T.text }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)" }}>
                      <Phone size={14} color={GOLD} />
                    </div>
                    +91 63057 23339
                  </a>
                  <div className="flex items-center gap-3 text-sm font-bold" style={{ color: T.text }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)" }}>
                      <Navigation size={14} color={GOLD} />
                    </div>
                    Palvancha, Telangana
                  </div>
                </div>

                {["About","Rooms","Gallery","Reviews","Contact"].map(l => (
                  <button key={l} onClick={() => go(l.toLowerCase())}
                    className="block w-full text-left py-3 px-2 text-base font-bold uppercase tracking-widest border-b"
                    style={{ color:T.text, borderColor:"rgba(0,0,0,0.06)" }}>
                    {l}
                  </button>
                ))}
                
                <button onClick={() => go("booking")} className="mt-5 w-full py-3.5 rounded-lg font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2"
                  style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:DEEP_BLUE }}>
                  Book Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────────────── */
function Hero() {
  const [idx,  setIdx]  = useState(0);
  const [dir,  setDir]  = useState(1);
  const tmrRef = useRef(null);
  const ref    = useRef(null);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start start","end start"] });
  const tY = useTransform(scrollYProgress, [0,1], ["0%","25%"]);

  const goSlide = useCallback((i, d = 1) => {
    clearInterval(tmrRef.current);
    setDir(d); setIdx(i);
    tmrRef.current = setInterval(() => { setDir(1); setIdx(c => (c+1) % SLIDES.length); }, 5500);
  }, []);

  useEffect(() => {
    tmrRef.current = setInterval(() => { setDir(1); setIdx(c => (c+1) % SLIDES.length); }, 5500);
    return () => clearInterval(tmrRef.current);
  }, []);

  const s = SLIDES[idx];

  const bgV = {
    enter:  d => ({ opacity:0, scale:1.05, x:d > 0 ? "3%" : "-3%" }),
    center:   { opacity:1, scale:1, x:"0%", transition:{ duration:1.2, ease:[0.22,1,0.36,1] } },
    exit:   d => ({ opacity:0, scale:0.97, x:d > 0 ? "-3%" : "3%", transition:{ duration:0.65 } }),
  };
  const txV = {
    enter:  d => ({ opacity:0, y:d > 0 ? 30 : -30 }),
    center:   { opacity:1, y:0, transition:{ duration:0.7, ease:[0.22,1,0.36,1] } },
    exit:     { opacity:0, y:-18, transition:{ duration:0.4 } },
  };

  return (
    <section id="hero" ref={ref} className="relative h-screen min-h-[640px] overflow-hidden">
      {/* Background Image Carousel */}
      <AnimatePresence custom={dir} initial={false}>
        <motion.div key={`bg-${s.id}`} className="absolute inset-0"
          custom={dir} variants={bgV} initial="enter" animate="center" exit="exit">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img src={s.image} alt={s.h1} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      <FloatingParticles />

      {/* Content */}
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10"
        style={{ y:tY }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={`tx-${s.id}`} custom={dir} variants={txV} initial="enter" animate="center" exit="exit">
            <motion.p
              className="uppercase tracking-[0.45em] text-xs font-bold mb-5"
              style={{ color:GOLD_LIGHT }}>
              ✦ {s.tag} ✦
            </motion.p>

            <h1 className="font-display font-black text-white mb-4 leading-[0.9]"
              style={{ fontSize:"clamp(2.8rem,8vw,6.5rem)", textShadow:"0 6px 50px rgba(0,0,0,0.6)" }}>
              {s.h1}<br />
              <span style={{
                background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT},${GOLD})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                filter:`drop-shadow(0 0 30px rgba(201,168,76,0.55))`,
              }}>{s.h2}</span>
            </h1>

            <GoldDivider />

            <p className="text-stone-100 text-base md:text-lg max-w-lg mx-auto mt-3 mb-10 font-light leading-relaxed">
              {s.sub}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button whileHover={{ scale:1.06, boxShadow:`0 12px 40px rgba(201,168,76,0.5)` }}
                whileTap={{ scale:0.96 }}
                onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior:"smooth" })}
                className="px-10 py-4 rounded-xl font-black text-sm tracking-widest uppercase"
                style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:DEEP_BLUE }}>
                Reserve Now
              </motion.button>
              <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.96 }}
                onClick={() => document.getElementById("rooms")?.scrollIntoView({ behavior:"smooth" })}
                className="px-10 py-4 rounded-xl font-black text-sm tracking-widest uppercase border-2 text-white"
                style={{ borderColor:"rgba(201,168,76,0.6)" }}>
                View Rooms
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stats */}
        <motion.div className="flex flex-wrap justify-center gap-8 mt-14"
          initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.1 }}>
          {[["10+","Years"],["50+","Rooms"],["5000+","Guests"],["4.8★","Rating"]].map(([v,l]) => (
            <div key={l} className="text-center">
              <p className="font-display font-black text-2xl" style={{ color:GOLD_LIGHT }}>{v}</p>
              <p className="text-stone-300 text-xs tracking-widest uppercase">{l}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Arrows */}
      <button onClick={() => goSlide((idx-1+SLIDES.length)%SLIDES.length, -1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center"
        style={{ background:"rgba(0,0,0,0.35)", border:`1px solid rgba(201,168,76,0.4)`, backdropFilter:"blur(8px)" }}>
        <ChevronLeft size={20} color={GOLD_LIGHT} />
      </button>
      <button onClick={() => goSlide((idx+1)%SLIDES.length, 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center"
        style={{ background:"rgba(0,0,0,0.35)", border:`1px solid rgba(201,168,76,0.4)`, backdropFilter:"blur(8px)" }}>
        <ChevronRight size={20} color={GOLD_LIGHT} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
        {SLIDES.map((_,i) => (
          <button key={i} onClick={() => goSlide(i, i > idx ? 1 : -1)}
            className="rounded-full transition-all duration-300"
            style={{ width:i===idx?28:8, height:8, background:i===idx?GOLD:"rgba(201,168,76,0.35)" }} />
        ))}
      </div>

      {/* Slide counter */}
      <AnimatePresence mode="wait">
        <motion.div key={`lb-${s.id}`} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }}
          className="absolute bottom-20 left-6 z-20 hidden md:block">
          <p className="text-xs uppercase tracking-widest font-bold" style={{ color:GOLD }}>
            {String(idx+1).padStart(2,"0")} / {String(SLIDES.length).padStart(2,"0")}
          </p>
          <p className="text-white/50 text-xs mt-0.5">{s.tag}</p>
        </motion.div>
      </AnimatePresence>

      {/* Scroll mouse */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}>
        <motion.div animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:1.6 }}
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-1.5 mx-auto"
          style={{ borderColor:"rgba(201,168,76,0.4)" }}>
          <div className="w-1 h-3 rounded-full" style={{ background:GOLD }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────────────────────────── */
/* Image/illustration on LEFT, text on RIGHT — always, in both dark and light   */
function About({ dark }) {
  const T = th(dark);
  return (
    <section id="about" className="py-28 px-4 transition-colors duration-500 relative overflow-hidden" style={{ background:T.pageBg }}>
      <GoldDots count={16} className="absolute inset-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SecHead tag="Our Story" title="A Legacy of Warmth"
          sub="Over a decade of genuine South Indian hospitality in the heart of Palvancha." dark={dark} />

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* ══ LEFT: Hotel Night Illustration ══ */}
          <Reveal dir="right">
            <div className="relative">
              {/* Gold frame offset */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border-2 opacity-20"
                style={{ borderColor:GOLD }} />

              <div className="relative rounded-3xl overflow-hidden" style={{ height:"460px" }}>
                <img src="https://res.cloudinary.com/djuu7sxfw/image/upload/v1777568763/download_27_b4qywy.jpg" 
                     alt="Hotel Sree Krishna Grand A/C" 
                     className="absolute inset-0 w-full h-full object-cover" />
                {/* Bottom text overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-32" style={{
                  background:"linear-gradient(to top,rgba(6,12,22,0.95),transparent)"
                }} />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-display text-white text-xl font-bold">Hotel Sree Krishna Grand A/C</p>
                  <p className="text-xs tracking-widest uppercase mt-1" style={{ color:GOLD_LIGHT }}>Est. in Palvancha, Telangana</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_,i) => <Star key={i} size={13} fill={GOLD} color={GOLD} />)}
                  </div>
                </div>
              </div>

              {/* A/C badge */}
              <div className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl z-10"
                style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` }}>
                <span className="font-display font-black text-base" style={{ color:DEEP_BLUE }}>A/C</span>
                <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color:DEEP_BLUE }}>Luxury</span>
              </div>
            </div>
          </Reveal>

          {/* ══ RIGHT: Text ══ */}
          <div>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed mb-5" style={{ color:T.muted }}>
                Nestled in vibrant Palvancha, our hotel stands as a beacon of comfort and hospitality. We blend modern amenities with genuine Telugu warmth — creating an experience beyond mere accommodation.
              </p>
              <p className="text-lg leading-relaxed mb-8" style={{ color:T.muted }}>
                Whether you're here for business, family travel, or a pilgrimage to nearby{" "}
                <strong style={{ color:T.text }}>Bhadrachalam</strong>, every room is crafted with impeccable cleanliness and attentive service.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {["Spotless Cleanliness","Attentive Staff","Prime Location","24/7 Support"].map(pt => (
                  <div key={pt} className="flex items-center gap-2 text-sm font-semibold" style={{ color:T.muted }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background:"rgba(201,168,76,0.18)" }}>
                      <Check size={10} color={GOLD} />
                    </div>
                    {pt}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[["10+","Years"],["50+","Rooms"],["5000+","Guests"],["4.8★","Rating"]].map(([v,l]) => (
                  <div key={l} className="rounded-2xl p-4 text-center"
                    style={{ background:T.surface, border:`1px solid ${T.border}` }}>
                    <p className="font-display font-black text-2xl" style={{ color:GOLD_LIGHT }}>{v}</p>
                    <p className="text-xs tracking-wide mt-1" style={{ color:T.muted }}>{l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── OWNER VISION ───────────────────────────────────────────────────────────── */
function OwnerVision() {
  return (
    <section className="py-24 px-4 relative overflow-hidden"
      style={{ background:`linear-gradient(135deg,${DEEP_BLUE},#0F2A50,#1a3a6e)` }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
        style={{ background:GOLD }} />
      <div className="max-w-5xl mx-auto relative z-10">
        <SecHead tag="Leadership" title="Owner's Vision"
          sub="The heart and soul behind every experience at Hotel Sree Krishna Grand." dark />
        <Reveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-[420px] rounded-3xl overflow-hidden shadow-2xl relative group"
                  style={{ border:`2px solid rgba(201,168,76,0.35)` }}>
                  <img src="https://res.cloudinary.com/djuu7sxfw/image/upload/v1777571159/%D0%AD%D0%BB%D0%B5%D0%B3%D0%B0%D0%BD%D1%82%D0%BD%D1%8B%D0%B9_%D0%BA%D0%BE%D0%BD%D1%81%D1%8C%D0%B5%D1%80%D0%B6__%D1%83%D1%8E%D1%82%D0%BD%D1%8B%D0%B9_%D0%BE%D1%82%D0%B5%D0%BB%D1%8C_%D1%81_%D1%80%D0%BE%D1%81%D0%BA%D0%BE%D1%88%D0%BD%D1%8B%D0%BC_%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%8C%D0%B5%D1%80%D0%BE%D0%BC_%D0%B8_%D1%81%D0%B5%D1%80%D0%B2%D0%B8%D0%B7%D0%BE%D0%BC_xt3q8a.jpg" 
                       alt="Hotel Owner" 
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-black/20 to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-10">
                    <p className="font-display text-white text-2xl font-bold">Hotel Owner</p>
                    <p className="text-[10px] tracking-widest uppercase mt-2" style={{ color:GOLD_LIGHT }}>Founder & Managing Director</p>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-br-2xl"
                  style={{ border:`2px solid ${GOLD}`, borderTop:"none", borderLeft:"none" }} />
                <div className="absolute -top-3 -left-3 w-14 h-14 rounded-tl-2xl"
                  style={{ border:`2px solid ${GOLD}`, borderBottom:"none", borderRight:"none" }} />
              </div>
            </div>
            <div>
              <div className="text-8xl mb-2" style={{ color:GOLD, opacity:0.25, lineHeight:1, fontFamily:"Georgia" }}>"</div>
              <p className="font-display text-2xl md:text-3xl text-white leading-relaxed mb-6 -mt-6">
                My dream was to create a place where every guest feels the warmth of home, the comfort of luxury, and the trust of family.
              </p>
              <div className="h-px w-14 mb-5" style={{ background:GOLD }} />
              <p className="text-blue-200 text-base leading-relaxed">
                With a deep commitment to service excellence, our hotel was built as a promise — your stay will always be remembered with a smile.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {["Integrity","Warmth","Excellence","Trust"].map(v => (
                  <span key={v} className="px-4 py-1.5 rounded-full text-sm font-bold tracking-wide"
                    style={{ background:"rgba(201,168,76,0.12)", border:`1px solid rgba(201,168,76,0.35)`, color:GOLD_LIGHT }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── ROOMS ──────────────────────────────────────────────────────────────────── */
function RoomCard({ room, index, dark }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once:true, margin:"-60px" });
  const T = th(dark);
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:60 }} animate={inV?{opacity:1,y:0}:{}}
      transition={{ duration:0.7, delay:index*0.15, ease:[0.22,1,0.36,1] }}
      className="group relative w-full h-[460px]" style={{ perspective:"1000px" }}>
      
      <div className="absolute inset-0 w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl rounded-3xl">
        
        {/* FRONT */}
        <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden"
             style={{ backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden", border:`1px solid ${T.border}` }}>
          <img src={room.image} alt={room.type} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(6,12,22,0.9), transparent 60%)" }} />
          
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
            style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:DEEP_BLUE }}>{room.tag}</div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="font-display text-2xl font-bold text-white mb-1">{room.type}</h3>
            <span className="font-display font-bold text-xl" style={{ color:GOLD_LIGHT }}>₹{room.price.toLocaleString()}</span>
            <span className="text-gray-300 text-xs ml-1">/ night</span>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 w-full h-full rounded-3xl p-6 flex flex-col justify-between"
             style={{ background:T.cardBg, border:`1px solid ${T.border}`, backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden", transform:"rotateY(180deg)" }}>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{room.icon}</span>
              <h3 className="font-display text-xl font-bold" style={{ color:T.text }}>{room.type}</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color:T.muted }}>{room.desc}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {room.features.map(f => (
                <span key={f} className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background:"rgba(201,168,76,0.12)", color:dark?GOLD_LIGHT:GOLD_DARK, border:"1px solid rgba(201,168,76,0.3)" }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior:"smooth" })}
              className="w-full py-3 rounded-xl font-black text-sm tracking-wider uppercase"
              style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:DEEP_BLUE }}>
              Book Now
            </motion.button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function Rooms({ dark }) {
  const T = th(dark);
  return (
    <section id="rooms" className="py-28 px-4 transition-colors duration-500 relative overflow-hidden" style={{ background:T.pageBg }}>
      <GoldDots count={14} className="absolute inset-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SecHead tag="Accommodations" title="Our Rooms & Suites"
          sub="Every room is a sanctuary — thoughtfully designed for comfort, freshness, and peace of mind." dark={dark} />
        <div className="grid md:grid-cols-3 gap-8">
          {ROOMS.map((r,i) => <RoomCard key={r.id} room={r} index={i} dark={dark} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── AMENITIES ──────────────────────────────────────────────────────────────── */
function Amenities() {
  return (
    <section id="amenities" className="py-24 px-4 relative overflow-hidden"
      style={{ background:`linear-gradient(135deg,${DEEP_BLUE},#0F2A50)` }}>
      <div className="max-w-7xl mx-auto relative z-10">
        <SecHead tag="What We Offer" title="Premium Amenities"
          sub="Everything you need for a perfect stay — all included with every booking." dark />
        <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:"-60px" }}
          variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.08 } } }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {AMENITIES.map(a => (
            <motion.div key={a.label}
              variants={{ hidden:{ opacity:0, y:40 }, show:{ opacity:1, y:0, transition:{ duration:0.6 } } }}
              whileHover={{ y:-8, scale:1.03 }} className="rounded-2xl p-6 text-center group"
              style={{ background:"rgba(255,255,255,0.055)", border:"1px solid rgba(232, 229, 221, 0.2)", backdropFilter:"blur(10px)" }}>
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background:"rgba(201,168,76,0.14)" }}>
                <a.icon size={22} color={GOLD} />
              </div>
              <h3 className="font-display font-bold text-sm mb-1" style={{ color:GOLD_LIGHT }}>{a.label}</h3>
              <p className="text-blue-300 text-xs leading-relaxed">{a.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── GALLERY ─────────────────────────────────────────────────────────────────
   Infinite right-to-left scroll using CSS animation keyframes.
   • Hover the section  → entire scroll pauses (animation-play-state: paused)
   • Hover a card       → that card scales up 1.1× + gold glow shadow
   • 6 Bedroom cards + 4 Bathroom cards = 10 total, doubled for seamless loop   */
const GALLERY_ITEMS = [
  { image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777567264/Luxury_Soft_White_Dream_Bedroom_with_Royal_Ceiling_Design_landpa.jpg", ac:GOLD, icon:"🛏️", label:"Deluxe Bedroom", sub:"King Size · Split AC · TV", type:"bedroom" },
  { image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777567514/Luxury_Bathroom_Materials__A_Guide_to_the_Finest_Finishes_nhlo0x.jpg", ac:GOLD_LIGHT, icon:"🛁", label:"Luxury Bathroom", sub:"Rain Shower · Hot Water", type:"bathroom" },
  { image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777567277/Plum_Velvet_Luxury_Bedroom_with_Panel_Wall_Champagne_Decor_Marble_Floor_Modern_Penthouse_Design_iimjbe.jpg", ac:GOLD, icon:"👑", label:"Premium Suite", sub:"King Bed · Lounge Area", type:"bedroom" },
  { image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777567522/Morden_Bathroom_qcpc3k.jpg", ac:GOLD_LIGHT, icon:"🚿", label:"Modern Bathroom", sub:"Rainfall · Marble Finish", type:"bathroom" },
  { image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777567339/luxurious_and_modern_bedroom_interior_design_gvpi4e.jpg", ac:GOLD, icon:"🪟", label:"Standard Bedroom", sub:"Queen Bed · Window AC", type:"bedroom" },
  { image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777567556/Minimalist_Luxury_Bathroom_Design_%EF%B8%8F___Warm_Marble_fluted_Texture_Inspo_ws17ts.jpg", ac:GOLD_LIGHT, icon:"🛁", label:"En-suite Bathroom", sub:"Hot Water · 24/7", type:"bathroom" },
  { image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777567348/Indulge_in_opulent_design_with_rich_textures_curated_statement_pieces_and_sophisticated_light_h2bga8.jpg", ac:GOLD, icon:"🛋️", label:"Cozy Twin Room", sub:"Two Beds · Ceiling Fan", type:"bedroom" },
  { image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777567575/43_Most_Fabulous_Mood-Setting_Romantic_Bathrooms_Ever_uurxeo.jpg", ac:GOLD_LIGHT, icon:"🚿", label:"Guest Bathroom", sub:"Clean · Well-Lit · Fresh", type:"bathroom" },
  { image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777567665/Luxurious_Bedroom_with_Skylight_Stars_and_Golden_Glow_zvyy1e.jpg", ac:GOLD, icon:"🛏️", label:"Budget Double Room", sub:"Double Bed · Wi-Fi · TV", type:"bedroom" },
  { image: "https://res.cloudinary.com/djuu7sxfw/image/upload/v1777567670/download_26_f4rvma.jpg", ac:GOLD, icon:"🛏️", label:"Non-AC Bedroom", sub:"Natural Ventilation · Cozy", type:"bedroom" },
];

function GalleryCard({ img, paused }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex-shrink-0 relative rounded-3xl overflow-hidden shadow-lg group"
      style={{
        width: 480,
        height: 320,
        border: `1px solid ${hovered ? img.ac : "rgba(201,168,76,0.2)"}`,
        boxShadow: hovered
          ? `0 0 28px 6px ${img.ac}55, 0 20px 48px rgba(0,0,0,0.35)`
          : "0 4px 20px rgba(0,0,0,0.2)",
        transition: "box-shadow 0.35s ease, border-color 0.25s ease",
        zIndex: hovered ? 10 : 1,
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={img.image} alt={img.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.25]" />
      <div className="absolute inset-0 transition-opacity duration-300" style={{ background:"linear-gradient(to top, rgba(11,31,58,0.95), transparent 70%)" }} />
      <div className={`absolute inset-0 transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-40'}`} style={{ background:"#0B1F3A" }} />
      
      {/* Type badge */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest z-10 transition-transform duration-500"
        style={{
          background: img.type === "bedroom" ? `rgba(201,168,76,0.85)` : `rgba(74,144,217,0.85)`,
          color: DEEP_BLUE,
          transform: hovered ? "scale(1.1) translateY(2px) translateX(2px)" : "none",
          transformOrigin: "top left",
        }}>
        {img.type === "bedroom" ? "🛏 Bedroom" : "🚿 Bathroom"}
      </div>

      {/* Gold accent line */}
      <div className="absolute z-10" style={{
        bottom: 74, left: "50%", transform: "translateX(-50%)",
        width: hovered ? 64 : 36, height: 2,
        background: img.ac, opacity: hovered ? 0.9 : 0.5,
        transition: "width 0.4s ease, opacity 0.4s ease",
      }} />

      {/* Label bar */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-5 z-10 transition-colors duration-300"
        style={{ background: hovered ? "rgba(11,31,58,0.98)" : "transparent" }}>
        <div className="transition-transform duration-700" style={{ transform: hovered ? "scale(1.1) translateY(-2px)" : "scale(1)", transformOrigin: "left center" }}>
          <p className="text-white text-xl font-bold truncate">{img.label}</p>
          <p className="text-sm mt-1 truncate" style={{ color: img.ac }}>{img.sub}</p>
        </div>
      </div>
    </div>
  );
}

function Gallery({ dark }) {
  const [paused, setPaused] = useState(false);
  const T = th(dark);
  // Triple the items so the loop never shows a gap
  const triple = [...GALLERY_ITEMS, ...GALLERY_ITEMS, ...GALLERY_ITEMS];
  const CARD_W = 480 + 32; // card width + gap (gap-8 = 32px)
  const LOOP_W = GALLERY_ITEMS.length * CARD_W; // one full set width in px

  return (
    <section id="gallery" className="py-24 overflow-hidden transition-colors duration-500 relative"
      style={{ background: T.pageBg }}>

      {/* GoldDots layer for this section */}
      <GoldDots count={18} className="absolute inset-0 pointer-events-none" />

      <div className="px-4 mb-12 relative z-10">
        <SecHead tag="Photo Gallery" title="Inside Our Hotel"
          sub="All crafted for your comfort." dark={dark} />
      </div>

      {/* Scroll container — gallery-track + paused classes defined in index.css */}
      <div
        className="relative z-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className={`gallery-track flex gap-8 ${paused ? "paused" : ""}`}
          style={{
            width: `${triple.length * CARD_W}px`,
            /* Pass loop width to the CSS variable used by @keyframes in index.css */
            "--gallery-loop-width": `-${LOOP_W}px`,
          }}
        >
          {triple.map((img, i) => (
            <GalleryCard key={i} img={img} paused={paused} />
          ))}
        </div>

      </div>

    </section>
  );
}

/* ─── REVIEWS ────────────────────────────────────────────────────────────────── */
function StarRating({ value, onChange, size=24 }) {
  const [hov, setHov] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHov(s)} onMouseLeave={() => onChange && setHov(0)}>
          <Star size={size} fill={(hov||value)>=s?GOLD:"transparent"} color={(hov||value)>=s?GOLD:"rgba(201,168,76,0.3)"}
            style={{ filter:(hov||value)>=s?`drop-shadow(0 0 4px ${GOLD})`:"none", transition:"all 0.15s" }} />
        </button>
      ))}
    </div>
  );
}

function ReviewCard3D({ review, pos }) {
  if (Math.abs(pos) > 1) return null;
  const c = pos === 0;
  return (
    <motion.div animate={{ x:`${pos*86}%`, scale:c?1:0.78, rotateY:pos*-16, zIndex:c?10:5, opacity:c?1:0.52 }}
      transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
      className="absolute top-0 left-0 right-0 w-full max-w-md mx-auto pointer-events-none"
      style={{ transformStyle:"preserve-3d" }}>
      <div className="rounded-3xl p-8 mx-auto max-w-md" style={{
        background:c?"rgba(255,255,255,0.11)":"rgba(255,255,255,0.05)",
        backdropFilter:"blur(20px)",
        border:c?`1px solid rgba(201,168,76,0.48)`:"1px solid rgba(255,255,255,0.08)",
        boxShadow:c?`0 24px 80px rgba(0,0,0,0.15),0 0 40px rgba(201,168,76,0.14)`:"none",
      }}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-black text-lg flex-shrink-0"
            style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:DEEP_BLUE }}>
            {review.avatar}
          </div>
          <div>
            <p className="font-display font-bold text-white text-base">{review.name}</p>
            <p className="text-blue-300 text-xs">{review.date}</p>
            <div className="mt-1"><StarRating value={review.rating} size={13} /></div>
          </div>
        </div>
        <p className="text-blue-100 text-sm leading-relaxed italic">"{review.text}"</p>
      </div>
    </motion.div>
  );
}

function Reviews({ dark }) {
  const [reviews, setReviews] = useState(() => {
    try { const s = localStorage.getItem("skhotel_reviews"); return s ? JSON.parse(s) : INITIAL_REVIEWS; }
    catch { return INITIAL_REVIEWS; }
  });
  const [cur, setCur]   = useState(0);
  const [form, setForm] = useState({ name:"", rating:5, text:"" });
  const [ok, setOk]     = useState(false);
  const tmr = useRef(null);

  useEffect(() => { localStorage.setItem("skhotel_reviews", JSON.stringify(reviews)); }, [reviews]);

  const startTmr = useCallback(() => {
    clearInterval(tmr.current);
    tmr.current = setInterval(() => setCur(c => (c+1) % reviews.length), 5000);
  }, [reviews.length]);

  useEffect(() => { startTmr(); return () => clearInterval(tmr.current); }, [startTmr]);

  const submit = () => {
    if (!form.name.trim() || !form.text.trim()) return;
    const r = {
      id: Date.now(), name:form.name.trim(), rating:form.rating, text:form.text.trim(),
      avatar: form.name.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
      date: new Date().toLocaleDateString("en-IN",{ month:"long", year:"numeric" }),
    };
    setReviews(p => { const u=[r,...p]; localStorage.setItem("skhotel_reviews",JSON.stringify(u)); return u; });
    setCur(0); setForm({ name:"", rating:5, text:"" }); setOk(true);
    setTimeout(() => setOk(false), 3000);
  };

  return (
    <section id="reviews" className="py-28 px-4 relative overflow-hidden"
      style={{ background:`linear-gradient(160deg,${DEEP_BLUE} 0%,#0A1E3A 50%,#0F2A50 100%)` }}>
      <div className="max-w-7xl mx-auto relative z-10">
        <SecHead tag="Guest Reviews" title="What Our Guests Say" dark />

        {/* 3D Carousel */}
        <div className="relative h-72 mb-16" style={{ perspective:"1200px" }}>
          {reviews.map((r,i) => {
            let p = ((i - cur + reviews.length) % reviews.length);
            if (p > reviews.length/2) p -= reviews.length;
            return <ReviewCard3D key={r.id} review={r} pos={p} />;
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 mb-16">
          <button onClick={() => { setCur(c=>(c-1+reviews.length)%reviews.length); startTmr(); }}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background:"rgba(201,168,76,0.18)", border:`1px solid rgba(201,168,76,0.4)` }}>
            <ChevronLeft size={18} color={GOLD} />
          </button>
          <div className="flex gap-2">
            {reviews.slice(0,Math.min(reviews.length,8)).map((_,i) => (
              <button key={i} onClick={() => { setCur(i); startTmr(); }}
                className="rounded-full transition-all"
                style={{ background:i===cur?GOLD:"rgba(201,168,76,0.3)", width:i===cur?24:8, height:8 }} />
            ))}
          </div>
          <button onClick={() => { setCur(c=>(c+1)%reviews.length); startTmr(); }}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background:"rgba(201,168,76,0.18)", border:`1px solid rgba(201,168,76,0.4)` }}>
            <ChevronRight size={18} color={GOLD} />
          </button>
        </div>

        {/* Review form */}
        <Reveal>
          <div className="max-w-2xl mx-auto rounded-3xl p-8"
            style={{ background:"rgba(255,255,255,0.055)", backdropFilter:"blur(20px)", border:"1px solid rgba(201,168,76,0.22)" }}>
            <h3 className="font-display text-2xl font-bold text-white mb-2">Share Your Experience</h3>
            <p className="text-blue-300 text-sm mb-6">Your feedback helps future guests and motivates our team.</p>
            <div className="space-y-4">
              <input value={form.name} onChange={e => setForm({...form,name:e.target.value})}
                placeholder="Your Full Name" className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(201,168,76,0.3)" }} />
              <div>
                <p className="text-blue-200 text-xs uppercase tracking-widest mb-2">Your Rating</p>
                <StarRating value={form.rating} onChange={v => setForm({...form,rating:v})} size={28} />
              </div>
              <textarea value={form.text} onChange={e => setForm({...form,text:e.target.value})}
                placeholder="Tell us about your stay..." rows={3}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(201,168,76,0.3)" }} />
              <AnimatePresence mode="wait">
                {ok ? (
                  <motion.div key="ok" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                    className="py-4 text-center rounded-xl font-bold text-sm"
                    style={{ background:"rgba(46,204,113,0.18)", color:"#2ECC71", border:"1px solid rgba(46,204,113,0.3)" }}>
                    ✓ Review submitted! Thank you.
                  </motion.div>
                ) : (
                  <motion.button key="btn" whileHover={{ scale:1.02, boxShadow:`0 8px 30px rgba(201,168,76,0.35)` }}
                    whileTap={{ scale:0.97, y:2 }} onClick={submit}
                    className="w-full py-4 rounded-xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2"
                    style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:DEEP_BLUE }}>
                    <Send size={16} /> Submit Review
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── BOOKING ────────────────────────────────────────────────────────────────── */
function Booking({ dark, setConfetti }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ name:"", phone:"", roomType:ROOM_TYPES[0].id, checkin:today, checkout:"", adults:1 });
  const [err, setErr] = useState({});
  const T = th(dark);
  const rm = ROOM_TYPES.find(r => r.id === form.roomType);
  const nights = (() => {
    if (!form.checkin || !form.checkout) return 0;
    const d = (new Date(form.checkout) - new Date(form.checkin)) / 86400000;
    return d > 0 ? d : 0;
  })();
  const total = nights * (rm?.price || 0);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g,""))) e.phone = "Valid 10-digit number";
    if (!form.checkin) e.checkin = "Required";
    if (!form.checkout) e.checkout = "Required";
    else if (new Date(form.checkout) <= new Date(form.checkin)) e.checkout = "Must be after check-in";
    setErr(e);
    return !Object.keys(e).length;
  };

  const book = () => {
    if (!validate()) return;
    const msg = encodeURIComponent(
      `🏨 *Hotel Sree Krishna Grand - Booking*\n\n👤 ${form.name}\n📞 ${form.phone}\n🛏️ ${rm?.label}\n`+
      `📅 Check-in: ${new Date(form.checkin).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}\n`+
      `📅 Check-out: ${new Date(form.checkout).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}\n`+
      `🌙 ${nights} nights · 👥 ${form.adults} adults\n💰 Est. ₹${total.toLocaleString()}\n\nPlease confirm. 🙏`
    );
    setConfetti(true);
    setTimeout(() => { setConfetti(false); window.open(`https://wa.me/916305723339?text=${msg}`, "_blank"); }, 1200);
  };

  const lbl = dark ? "#A1A1AA" : "#64748B";
  const renderFld = (name, label, type="text", p={}) => (
    <div className="relative">
      <label className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color:lbl }}>{label}</label>
      <input type={type} value={form[name]} onChange={e => setForm({...form,[name]:e.target.value})}
        className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300"
        style={{ 
          background: T.input, 
          border: `1px solid ${err[name] ? "#ef4444" : "rgba(201,168,76,0.2)"}`, 
          color: T.text,
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
        }} 
        onFocus={(e) => e.target.style.borderColor = GOLD}
        onBlur={(e) => e.target.style.borderColor = err[name] ? "#ef4444" : "rgba(201,168,76,0.2)"}
        {...p} />
      {err[name] && <p className="absolute -bottom-5 right-0 text-red-500 text-[10px] font-bold">{err[name]}</p>}
    </div>
  );

  return (
    <section id="booking" className="py-24 px-4 transition-colors duration-500 relative overflow-hidden" style={{ background:T.pageBg }}>
      <GoldDots count={12} className="absolute inset-0 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <SecHead tag="Reservations" title="Book Your Stay"
          sub="Fill in your details and we'll confirm via WhatsApp instantly." dark={dark} />
          
        <Reveal>
          <div className="mt-12 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row bg-white dark:bg-[#0B0D14]" 
               style={{ background: T.cardBg, border: `1px solid ${T.border}` }}>
            
            {/* LEFT SIDE: Image panel */}
            <div className="lg:w-[45%] relative min-h-[300px] lg:min-h-auto">
              <img src="https://res.cloudinary.com/djuu7sxfw/image/upload/v1777567339/luxurious_and_modern_bedroom_interior_design_gvpi4e.jpg" 
                   alt="Luxury Bedroom" 
                   className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/40 to-transparent opacity-95" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="w-12 h-1 mb-6 rounded-full" style={{ background: GOLD }} />
                <h3 className="text-4xl font-display font-black text-white mb-3 leading-tight">
                  Your Premium <br/>Escape Awaits
                </h3>
                <p className="text-blue-100/80 text-sm leading-relaxed max-w-sm mb-8 font-semibold">
                  Experience the perfect blend of luxury, comfort, and unmatched hospitality. Reserve directly with us for exclusive rates.
                </p>
                
                <div className="flex gap-4 items-center">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B1F3A] overflow-hidden bg-zinc-800">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Guest" className="w-full h-full object-cover opacity-80" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#0B1F3A] bg-[#2ECC71] flex items-center justify-center text-white text-[10px] font-bold">
                      5k+
                    </div>
                  </div>
                  <div className="text-xs text-white font-bold">
                    Happy Guests <br/><span style={{ color: GOLD_LIGHT }}>⭐⭐⭐⭐⭐</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Booking Form */}
            <div className="lg:w-[55%] p-8 sm:p-12 lg:p-16">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
                
                {renderFld("name", "Full Name", "text", { placeholder:"John Doe" })}
                {renderFld("phone", "Phone Number", "tel", { placeholder:"10-digit mobile" })}

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color:lbl }}>Room Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {ROOM_TYPES.map(rt => (
                      <button key={rt.id} type="button" onClick={() => setForm({...form,roomType:rt.id})}
                        className="p-4 rounded-xl text-xs font-bold text-center transition-all duration-300 relative overflow-hidden group"
                        style={{
                          background: form.roomType===rt.id ? `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})` : T.input,
                          color: form.roomType===rt.id ? DEEP_BLUE : T.text,
                          border: `1px solid ${form.roomType===rt.id ? GOLD : "rgba(201,168,76,0.2)"}`,
                          transform: form.roomType===rt.id ? "scale(1.02)" : "scale(1)",
                          boxShadow: form.roomType===rt.id ? `0 10px 20px rgba(201,168,76,0.25)` : "none"
                        }}>
                        <div className="relative z-10 text-sm mb-1">{rt.label.split(" ")[0]}</div>
                        <div className={`relative z-10 text-[10px] ${form.roomType===rt.id ? 'opacity-80' : 'opacity-60'}`}>₹{rt.price}/night</div>
                      </button>
                    ))}
                  </div>
                </div>

                {renderFld("checkin", "Check-in Date", "date", { min:today })}
                {renderFld("checkout", "Check-out Date", "date", { min:form.checkin||today })}

                <div className="sm:col-span-2 flex items-center justify-between p-4 rounded-xl" style={{ background: T.input, border: `1px solid rgba(201,168,76,0.2)` }}>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color:lbl }}>Guests</label>
                    <p className="text-sm font-bold mt-1" style={{ color:T.text }}>Number of Adults</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => setForm({...form,adults:Math.max(1,form.adults-1)})}
                      className="w-10 h-10 rounded-full font-bold text-lg flex items-center justify-center transition-colors"
                      style={{ background: dark ? "#2A2A2A" : "#F1F5F9", color:T.text }}>−</button>
                    <span className="font-display font-black text-2xl w-4 text-center" style={{ color:T.text }}>{form.adults}</span>
                    <button type="button" onClick={() => setForm({...form,adults:Math.min(6,form.adults+1)})}
                      className="w-10 h-10 rounded-full font-bold text-lg flex items-center justify-center transition-colors"
                      style={{ background: dark ? "#2A2A2A" : "#F1F5F9", color:T.text }}>+</button>
                  </div>
                </div>

                {nights > 0 && (
                  <div className="sm:col-span-2 rounded-xl p-6 mt-2 relative overflow-hidden"
                    style={{ background:"rgba(201,168,76,0.05)", border:`1px solid rgba(201,168,76,0.3)` }}>
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: GOLD }} />
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold" style={{ color:T.text }}>{rm?.label}</span>
                      <span className="text-sm" style={{ color:lbl }}>{nights} night{nights>1?"s":""}</span>
                    </div>
                    <div className="h-px w-full my-3" style={{ background:"rgba(201,168,76,0.2)" }} />
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color:lbl }}>Total Estimate</span>
                      <span className="font-display font-black text-3xl" style={{ color:GOLD }}>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="sm:col-span-2 mt-4">
                  <motion.button type="button"
                    whileHover={{ scale:1.02, boxShadow:`0 15px 40px rgba(201,168,76,0.35)` }} whileTap={{ scale:0.98 }}
                    onClick={book}
                    className="w-full py-5 rounded-xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 relative overflow-hidden group"
                    style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:DEEP_BLUE }}>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <MessageCircle size={20} className="relative z-10" /> 
                    <span className="relative z-10">Confirm via WhatsApp</span>
                  </motion.button>
                  <p className="text-center text-[11px] mt-4 font-bold" style={{ color:lbl }}>
                    No credit card required. Fast, secure, and hassle-free.
                  </p>
                </div>

              </div>
            </div>
            
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────────────────────────── */
function Contact({ dark }) {
  const T = th(dark);
  return (
    <section id="contact" className="py-28 px-4 transition-colors duration-500 relative overflow-hidden" style={{ background:T.pageBg }}>
      <GoldDots count={14} className="absolute inset-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SecHead tag="Find Us" title="Location & Contact"
          sub="Conveniently located in the heart of Palvancha, easily accessible from all parts of town." dark={dark} />
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-5">
            {[
              { icon:Phone,      label:"Phone / WhatsApp", value:"+91 63057 23339",         link:"tel:+916305723339", clr:"#2ECC71" },
              { icon:Mail,       label:"Email",            value:"hotelsreekrishnagrand@gmail.com", link:"mailto:hotelsreekrishnagrand@gmail.com", clr:"#3B82F6" },
              { icon:Instagram,  label:"Instagram",        value:"@hotelsreekrishnagrand",  link:"https://instagram.com/hotelsreekrishnagrand", clr:"#E1306C" },
              { icon:Navigation, label:"Our Address",      value:"Nataraj Centre, 1st Floor,\nBhadradri Bank Building, KSP Rd,\nPalvancha, Telangana", clr:"#ef4444" },
              { icon:Clock,      label:"Check-in / Out",   value:"Check-in: 12:00 PM  •  Check-out: 11:00 AM", clr:GOLD },
            ].map(item => (
              <Reveal key={item.label}>
                <div className="flex gap-4 p-5 rounded-2xl"
                  style={{ background:T.cardBg, border:`1px solid ${T.border}`, boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:`${item.clr}1A` }}>
                    <item.icon size={20} color={item.clr} />
                  </div>
                  <div>
                    <p className="font-bold text-xs uppercase tracking-widest mb-1" style={{ color:T.muted }}>{item.label}</p>
                    {item.link
                      ? <a href={item.link} className="font-display font-bold text-lg hover:underline" style={{ color:T.text }}>{item.value}</a>
                      : <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color:T.text }}>{item.value}</p>
                    }
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.a href="tel:+916305723339" whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  className="flex-1 py-4 rounded-xl font-black text-sm tracking-widest uppercase text-center flex items-center justify-center gap-2"
                  style={{ background:"#2ECC71", color:"white", boxShadow:"0 6px 24px rgba(46,204,113,0.3)" }}>
                  <Phone size={16} /> Call Now
                </motion.a>
                <motion.a href="https://maps.google.com/?q=Nataraj+Centre+Palvancha+Telangana"
                  target="_blank" rel="noopener noreferrer" whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  className="flex-1 py-4 rounded-xl font-black text-sm tracking-widest uppercase text-center flex items-center justify-center gap-2"
                  style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:DEEP_BLUE }}>
                  <Navigation size={16} /> Get Directions
                </motion.a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="rounded-3xl overflow-hidden shadow-2xl"
              style={{ border:`2px solid rgba(201,168,76,0.3)`, height:420 }}>
              <iframe title="Hotel Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3832.0!2d80.7!3d17.5333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3349f63d5c3a97%3A0x1d9cd7c7d1c69c46!2sPalvancha%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border:0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <p className="text-center text-xs mt-3 font-semibold" style={{ color:`${T.muted}88` }}>
              📍 KSP Road, Palvancha, Telangana — Find us on Google Maps
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-12 px-4" style={{ background:"#08080A", borderTop:`1px solid rgba(201,168,76,0.18)` }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-sm flex-shrink-0"
                style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color:DEEP_BLUE }}>SK</div>
              <div>
                <p className="font-display font-bold text-white text-base">Hotel Sree Krishna Grand A/C</p>
                <p className="text-sm" style={{ color:GOLD }}>Palvancha, Telangana</p>
              </div>
            </div>
            <p className="text-zinc-400 text-base leading-relaxed">Your trusted home away from home in Palvancha. Premium comfort, genuine hospitality.</p>
          </div>
          <div>
            <p className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color:GOLD }}>Quick Links</p>
            <div className="space-y-3">
              {["About","Rooms","Gallery","Reviews","Contact"].map(l => (
                <button key={l} onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior:"smooth" })}
                  className="block text-zinc-400 text-base hover:text-white transition-colors">→ {l}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color:GOLD }}>Contact</p>
            <div className="space-y-3 text-zinc-400 text-base">
              <p>📍 Nataraj Centre, 1st Floor, KSP Rd, Palvancha</p>
              <p>📞 <a href="tel:+916305723339" className="hover:text-white">+91 63057 23339</a></p>
              <p>✉️ <a href="mailto:hotelsreekrishnagrand@gmail.com" className="hover:text-white">hotelsreekrishnagrand@gmail.com</a></p>
              <p>📸 <a href="https://instagram.com/hotelsreekrishnagrand" target="_blank" rel="noopener noreferrer" className="hover:text-white">@hotelsreekrishnagrand</a></p>
            </div>
          </div>
        </div>
        <div className="pt-6 text-center text-xs text-zinc-700" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          © 2025 Hotel Sree Krishna Grand A/C, Palvancha. All rights reserved.
          <span style={{ color:GOLD }}> ✦ </span>Where Comfort Meets Luxury.
        </div>
      </div>
    </footer>
  );
}

/* ─── WHATSAPP ───────────────────────────────────────────────────────────────── */
function WhatsApp() {
  return (
    <motion.a href="https://wa.me/916305723339?text=Hello%20Hotel%20Sree%20Krishna%20Grand!%20I%27d%20like%20to%20enquire%20about%20room%20booking."
      target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 rounded-full shadow-2xl"
      style={{ background:"#25D366", boxShadow:"0 8px 30px rgba(37,211,102,0.45)" }}
      initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
      transition={{ delay:1.5, type:"spring", stiffness:180 }}
      whileHover={{ scale:1.08 }} whileTap={{ scale:0.95 }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </motion.a>
  );
}

/* ─── CINEMATIC INTRO ───────────────────────────────────────────────────────── */
function CinematicIntro({ setIntroFinished, setIsSplitting }) {
  const [show, setShow] = useState(false);
  const [splitting, setSplitting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setShow(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [setIntroFinished]);

  const handleStart = () => {
    if (started || splitting) return;
    setStarted(true);
    
    setTimeout(() => {
      setSplitting(true);
      setIsSplitting(true);
      setTimeout(() => {
        setShow(false);
        setIntroFinished(true);
        document.body.style.overflow = "";
      }, 4200); // Wait 4.2s for doors to finish
    }, 600);
  };

  if (!show) return null;

  const imgSrc = "/intro-bg.png";

  return (
    <div 
      className="fixed inset-0 z-[100] cursor-pointer bg-transparent overflow-hidden" 
      style={{ perspective: "1500px" }}
      onMouseEnter={handleStart} onClick={handleStart}
    >
      {/* Left Door */}
      <motion.div 
        className="absolute top-0 left-0 w-1/2 h-full overflow-hidden origin-left"
        initial={{ rotateY: 0 }}
        animate={splitting ? { rotateY: 110 } : { rotateY: 0 }}
        transition={{ duration: 4.0, ease: [0.25, 1, 0.5, 1] }}
      >
        <div 
          className="absolute top-0 left-0 h-full flex items-center justify-center"
          style={{ width: "100vw" }}
        >
          <img 
            src={imgSrc} 
            alt="Intro Left"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </motion.div>

      {/* Right Door */}
      <motion.div 
        className="absolute top-0 right-0 w-1/2 h-full overflow-hidden origin-right"
        initial={{ rotateY: 0 }}
        animate={splitting ? { rotateY: -110 } : { rotateY: 0 }}
        transition={{ duration: 4.0, ease: [0.25, 1, 0.5, 1] }}
      >
        <div 
          className="absolute top-0 right-0 h-full flex items-center justify-center"
          style={{ width: "100vw" }}
        >
          <img 
            src={imgSrc} 
            alt="Intro Right"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </motion.div>

      {/* Hover Prompt */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        animate={(started || splitting) ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white text-xs sm:text-sm font-bold tracking-[0.3em] uppercase bg-black/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
          Enter The Grand
        </p>
      </motion.div>
    </div>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────────────────────────── */
const initialIntroFinished = false; // Play intro on every load

export default function App() {
  const [confetti, setConfetti] = useState(false);
  const [introFinished, setIntroFinished] = useState(initialIntroFinished);
  const [isSplitting, setIsSplitting] = useState(false);

  return (
    <div>
      {!introFinished && <CinematicIntro setIntroFinished={setIntroFinished} setIsSplitting={setIsSplitting} />}
      
      <motion.div
        initial={false}
        animate={{ 
          filter: introFinished ? "blur(0px)" : (isSplitting ? "blur(0px)" : "blur(40px)"),
          scale: introFinished ? 1 : (isSplitting ? 1 : 1.15)
        }}
        transition={{ duration: 8.0, ease: [0.25, 1, 0.5, 1] }}
      >
        <Confetti active={confetti} />
        <Navbar />
        <Hero />
        <About />
        <OwnerVision />
        <Rooms />
        <Amenities />
        <Gallery />
        <Reviews />
        <Booking setConfetti={setConfetti} />
        <Contact />
        <Footer />
        <WhatsApp />
      </motion.div>
    </div>
  );
}
