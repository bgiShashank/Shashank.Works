import { useState, useEffect, useRef, useCallback } from 'react';
import './portfolio.css';
import CustomCursor from './CustomCursor';
import ClickBubbles from './ClickBubbles';

const GITHUB_RAW = 'https://raw.githubusercontent.com/bgiShashank/Shashank.Works/main';

const portfolioData = {
  web: {
    title: 'Web Developer',
    subtitle: 'Creating beautiful and functional web experiences',
    about:
      "I'm a dedicated web developer with expertise in front-end technologies. I love creating interactive and responsive web applications that provide excellent user experiences.",
    contact: {
      email: 'business.shashank3@gmail.com',
      linkedin: 'https://www.linkedin.com/in/shashank-vishwakarma-4b3937386/',
      github: 'https://github.com/bgiShashank',
      instagram: 'https://www.instagram.com/31_03_shashank?igsh=aDM2cGY5cjNlbnNn',
    },
    skills: [
      { icon: '💻', title: 'HTML', description: 'Semantic markup and structure' },
      { icon: '🎨', title: 'CSS', description: 'Styling and animations' },
      { icon: '⚡', title: 'JavaScript', description: 'Interactive functionality' },
      { icon: '🐍', title: 'Python', description: 'Programming and automation' },
      { icon: '☕', title: 'Java + DSA', description: 'Object-oriented programming and algorithms' },
    ],
    projects: [
      {
        name: 'Moodify',
        image: `${GITHUB_RAW}/Tech_Projects/Moodify_Logo.png`,
        link: 'https://moodify-eight-red.vercel.app/',
        description: 'Mood-Based Music & Wallpaper Recommendation Web App',
        techStack: ['HTML', 'CSS', 'JavaScript', 'JioSaavn API'],
        details: [
          'Developed a web application that provides personalized music and wallpaper recommendations based on user mood selection.',
          'Integrated JioSaavn API for Hindi/Bollywood music streaming and Pexels API for contextual wallpaper images.',
          'Built a custom music player with play/pause controls and implemented intelligent duplicate prevention algorithms.',
          'Created a responsive UI with interactive mood selection panel featuring smooth animations and hover effects.',
          'Implemented wallpaper download functionality and refresh features with state management to avoid showing duplicate content.',
        ],
      },
      {
        name: 'India Hunters',
        image: `${GITHUB_RAW}/Tech_Projects/India_Hunters.png`,
        link: 'https://india-hunters.vercel.app/',
        description: 'BGMI Tournament Registration & Management Platform',
        techStack: ['HTML', 'CSS', 'JavaScript'],
        details: [
          'Designed and developed a responsive website for BGMI tournament registration and management.',
          'Built team registration forms, payment section, and participant data handling features.',
          'Created an admin panel to manage tournament entries and streamline operations.',
          'Focused on user-friendly UI/UX and responsive design for mobile and desktop.',
        ],
      },
    ],
  },
  video: {
    title: 'Video Editor & Graphics Designer',
    subtitle: 'Bringing creativity to life through visuals',
    about:
      "I'm a skilled video editor and graphics designer with a passion for visual storytelling. I create engaging content including logos, banners, thumbnails, overlays, and professional video edits.",
    contact: {
      email: 'business.shashank3@gmail.com',
      freelancer: 'https://www.freelancer.in/u/shashank307494',
      fiverr: 'https://www.fiverr.com/meeshank_0807',
      instagram: 'https://www.instagram.com/31_03_shashank?igsh=aDM2cGY5cjNlbnNn',
    },
    skills: [
      { icon: '🎬', title: 'Video Editing', description: 'Professional video production', clickable: true },
      { icon: '🎨', title: 'Graphics Design', description: 'Logos, banners, and thumbnails' },
      { icon: '✨', title: 'Overlays', description: 'Custom overlay designs' },
    ],
    work: {
      logos: [
        `${GITHUB_RAW}/Editor_Work/Logos/image (1).jpg`,
        `${GITHUB_RAW}/Editor_Work/Logos/image (2).jpg`,
        `${GITHUB_RAW}/Editor_Work/Logos/IMG_20251016_014938.png`,
        `${GITHUB_RAW}/Editor_Work/Logos/Picsart_25-11-04_16-13-13-587.jpg`,
        `${GITHUB_RAW}/Editor_Work/Logos/SkyClub_Logo_.png`,
        `${GITHUB_RAW}/Editor_Work/Logos/V7ZlUi4aHTyns4Do.png`,
      ],
      banners: [
        `${GITHUB_RAW}/Editor_Work/Banners/Freelance 2.png`,
        `${GITHUB_RAW}/Editor_Work/Banners/Freelance.png`,
        `${GITHUB_RAW}/Editor_Work/Banners/IMG_20251104_131418.png`,
        `${GITHUB_RAW}/Editor_Work/Banners/Picsart_25-11-03_13-30-55-420.jpg`,
        `${GITHUB_RAW}/Editor_Work/Banners/Royal_Fortune_Casino_Banner.jpg`,
        `${GITHUB_RAW}/Editor_Work/Banners/TopGaming_Banner.jpg`,
      ],
      thumbnails: [
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Marry_Christmas_Wizzer_Thmbnl.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_25-02-17_14-27-52-884.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0001.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0002.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0003.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0004.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0005.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0006.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0007.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0008.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0010.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0011.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0014.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0015.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/DOC-20251128-WA0017.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/IMG_20251018_202111.png`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/IMG_20251129_200049.png`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_24-10-15_11-17-31-129.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_24-10-21_18-13-12-181.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_24-11-15_09-18-32-125.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_24-11-16_18-29-37-429.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_25-07-13_15-00-06-268.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_25-07-13_15-31-00-535.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_25-09-12_18-24-17-781.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_25-09-19_21-37-27-139.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_25-10-11_21-11-38-457.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_25-11-11_15-14-06-462.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/Picsart_25-11-11_15-49-07-211.jpg`,
        `${GITHUB_RAW}/Editor_Work/Thumbnails/SAVE_20241203_134210.jpg`,
      ],
      // YouTube video categories
      // isShort: true  → 9:16 vertical player (YouTube Shorts)
      // isShort: false → 16:9 horizontal player (regular YouTube)
      videoCategories: [
        // Titles verified via YouTube oEmbed; layout verified via /shorts/ pages
        {
          name: 'Motion Design Edits',
          isShort: true,
          ids: [
            'wpw9VAis2nM', // Motion Design Edit 1
            'jXuaAX2L1lM', // Motion Design Edit 2
            'niH-9TajeeI', // Motion Design Edit 3
            'gskhVyc9m5c', // Motion Design Edit 4
          ],
        },
        {
          name: 'AI & Creative Concept Shorts',
          isShort: true,
          ids: [
            'LgLTZFCo5uM', // Ai Generated 1
            'ACYIr9roZpU', // Ai Generated 2
            'RCLVTqISFG4', // Ai Generate 3
            'tuqR9ex2TRM', // Ai Generated 4
            'oDyl_mqVEKA', // Best Edit Short (Rawana V1)
          ],
        },
        {
          name: 'Promotional & Marketing Ads',
          isShort: true,
          // Shorts render on ONE line with 5 visible, so index 0/1 are the
          // top-left slots and index 3/4 are the top-right slots.
          ids: [
            'twMd_fISfv4', // Promotional Ad - top-left
            'wHRS0WFNP0w', // Promotional Ad - top-left
            'KnwdLdw6jW8', // Promotional Ad 1 - 3rd slot
            'WHOBO4K7HGU', // Product Promotional ad
            '9qeoM2OAy9Y', // D2C Marketing - top-right
            'MKBacqSfGB4', // D2C Marketing 2
            '3sVzGlPYe4g', // Trading promotional 3
          ],
        },
        {
          name: 'Explainers & Educational Edits',
          isShort: false,
          ids: [
            'MxmkDS_Zu1s', // Saas Tech Explainer
            '5lVBUFWSCuE', // Science of Discipline
            'th4etMIl9ac', // Psychology edit
          ],
        },
        {
          name: 'Entertainment Videos',
          isShort: false,
          ids: [
            'nHv1w0gQtCE', // Entertainment Youtube Video
            'cFlr5yehrZA', // Entertainment Youtube Video 2
          ],
        },
        {
          name: 'Advance level edit',
          isShort: false,
          ids: [
            '5Snos7GGpUA', // Advance level edit
          ],
        },
      ],
    },
  },
};

const softwareItems = [
  { key: 'pr', name: 'Adobe Premiere Pro', label: 'Pr' },
  { key: 'ae', name: 'Adobe After Effects', label: 'Ae' },
  { key: 'ps', name: 'Adobe Photoshop', label: 'Ps' },
  { key: 'capcut', name: 'CapCut', icon: `${GITHUB_RAW}/Images/CapCut_Logo.png` },
  { key: 'picsart', name: 'Picsart', icon: `${GITHUB_RAW}/Images/PicsArt_Logo.png` },
  // AI tooling (sparkle mark — deliberately not an "Ai" tile, which would read
  // as Adobe Illustrator, a tool I do not use).
  { key: 'ai', name: 'AI Tools', label: '✨', note: 'I use AI too' },
];

const iconMap: Record<string, string> = {
  'Email Me': `${GITHUB_RAW}/Images/email.svg`,
  LinkedIn: `${GITHUB_RAW}/Images/linkedin.svg`,
  GitHub: `${GITHUB_RAW}/Images/Github_logo.png`,
  Instagram: `${GITHUB_RAW}/Images/Instagram_logo.png`,
  Fiverr: `${GITHUB_RAW}/Images/Fiverr_logo.png`,
  Freelancer: `${GITHUB_RAW}/Images/Freelancer_logo.png`,
};

// ---------- Lightbox ----------
interface LightboxState {
  images: string[];
  index: number;
  open: boolean;
}

function Lightbox({
  state,
  onClose,
  onNavigate,
}: {
  state: LightboxState;
  onClose: () => void;
  onNavigate: (step: number) => void;
}) {
  useEffect(() => {
    if (!state.open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
    };
    document.addEventListener('keydown', handler);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.classList.remove('no-scroll');
    };
  }, [state.open, onClose, onNavigate]);

  if (!state.open) return null;
  const src = state.images[state.index];

  return (
    <div
      className="lightbox-overlay active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="lightbox-content">
        <img src={src} alt={`Work image ${state.index + 1}`} className="lightbox-image" />
        <button className="lightbox-close" onClick={onClose}>✕</button>
        <button className="lightbox-prev" onClick={() => onNavigate(-1)}>‹</button>
        <button className="lightbox-next" onClick={() => onNavigate(1)}>›</button>
      </div>
    </div>
  );
}

// ---------- VideoCard -------------------------------------------------------
// • YouTube embed — autoplays muted (browser requirement for autoplay)
// • Thumbnail shown when card is off-screen (< 30% visible)
// • iframe mounted & autoplays when card is ≥ 30% visible
// • iframe fully UNMOUNTED when card scrolls out — stops audio reliably
// • isShort: true → 9:16 portrait aspect ratio (YouTube Shorts)
// • isShort: false → 16:9 landscape aspect ratio (regular videos)
// ---------------------------------------------------------------------------
function VideoCard({
  videoId,
  isShort = false,
  autoplay = true,
}: {
  videoId: string;
  isShort?: boolean;
  autoplay?: boolean;
}) {
  const [inView, setInView] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  // The embed keeps pointer-events: none until the visitor clicks the card, so
  // a YouTube iframe cannot swallow the wheel and trap page scrolling.
  const [interactive, setInteractive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // YouTube thumbnails: mqdefault (320×180) works for both regular and Shorts
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  // autoplay=1 + mute=1: required by browsers; rel=0: no related videos after
  // playback. A click-to-play embed drops mute so the visitor hears the audio.
  const embedUrl = manualPlay
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`
    : `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&playsinline=1`;

  // Global auto-play switched off → stop any manual playback too.
  useEffect(() => {
    if (!autoplay) setManualPlay(false);
  }, [autoplay]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.intersectionRatio >= 0.3;
        setInView(visible);
        // Leaving the viewport hands control of the embed back, so the wheel
        // scrolls the page again once the visitor moves on.
        if (!visible) setInteractive(false);
      },
      { threshold: [0, 0.3] }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [videoId]);

  const showEmbed = manualPlay || (autoplay && inView);

  return (
    <div
      className={`work-item video-work-item${isShort ? ' shorts-item' : ''}`}
      ref={containerRef}
      onClick={() => setInteractive(true)}
    >
      {showEmbed ? (
        <iframe
          src={embedUrl}
          className={`video-iframe${interactive ? ' video-iframe-interactive' : ''}`}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          title={`Video ${videoId}`}
        />
      ) : (
        <>
          <img
            src={thumbnailUrl}
            alt="Video preview"
            className="work-image"
            loading="lazy"
          />
          <button
            type="button"
            className="video-play-btn"
            onClick={() => setManualPlay(true)}
            aria-label="Play video"
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
}

// ---------- ScrollRow -------------------------------------------------------
// One scrollable line: a fixed number of tiles visible side by side, the rest
// reached with the arrow buttons, a trackpad swipe or Shift+wheel, or
// click-and-drag on the row. Shorts use 5 visible, Thumbnails 6. The vertical
// wheel intentionally still scrolls the page, not the row.
// ---------------------------------------------------------------------------
function ScrollRow({
  className,
  count,
  label,
  children,
}: {
  className: string;
  count: number;
  label: string;
  children: React.ReactNode;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    syncEdges();
    el.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);

    // Deliberately NO wheel hijack here: mapping the vertical wheel to
    // horizontal scrolling meant the page itself could not be scrolled while
    // the pointer sat over a row. Horizontal input still reaches the row
    // through the browser's own handling (trackpad two-finger swipe, tilt
    // wheel or Shift+wheel), and the arrows and click-and-drag also work.
    return () => {
      el.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, [syncEdges, count]);

  const page = (dir: number) => {
    const el = rowRef.current;
    if (!el) return;
    // One column plus its gap. A "page" is however many columns the row shows
    // at the current width (5 on desktop, 2 columns x 2 rows on phones), so
    // paging lands on a column boundary instead of cutting a card in half.
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = first ? first.getBoundingClientRect().width + gap : 0;
    if (step <= 0) {
      el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
      return;
    }
    const cols = Math.max(1, Math.round((el.clientWidth + gap) / step));
    el.scrollBy({ left: dir * cols * step, behavior: 'smooth' });
  };

  // Click-and-drag scrubbing.
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const el = rowRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = rowRef.current;
    if (!el || !drag.current.active) return;
    el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };

  const endDrag = () => {
    drag.current.active = false;
    rowRef.current?.classList.remove('is-dragging');
  };

  const onDragStart = () => {
    if (drag.current.active) rowRef.current?.classList.add('is-dragging');
  };

  return (
    <div className="scroll-row">
      <button
        type="button"
        className="shorts-nav shorts-nav-prev"
        onClick={() => page(-1)}
        disabled={atStart}
        aria-label={`Scroll ${label} left`}
      >
        ‹
      </button>
      <div
        className={`work-gallery ${className}`}
        ref={rowRef}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => {
          onDragStart();
          onPointerMove(e);
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {children}
      </div>
      <button
        type="button"
        className="shorts-nav shorts-nav-next"
        onClick={() => page(1)}
        disabled={atEnd}
        aria-label={`Scroll ${label} right`}
      >
        ›
      </button>
    </div>
  );
}

// ---------- WorkSection (images) ----------
function WorkSection({
  title,
  images,
  isThumbnails,
  scrollAll = false,
  onOpenLightbox,
  scrollObserver,
}: {
  title: string;
  images: string[];
  isThumbnails?: boolean;
  scrollAll?: boolean;
  onOpenLightbox: (images: string[], index: number) => void;
  scrollObserver: IntersectionObserver;
}) {
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.classList.add('scroll-fade-in');
    scrollObserver.observe(el);
    return () => scrollObserver.unobserve(el);
  }, [scrollObserver]);

  const visible = showAll ? images : images.slice(0, 3);
  const hidden = images.slice(3);

  const renderItem = (src: string, idx: number) => (
    <WorkItem
      key={src}
      src={src}
      alt={`${title} ${idx + 1}`}
      delay={(idx % 4) + 1}
      onClick={() => onOpenLightbox(images, idx)}
      scrollObserver={scrollObserver}
    />
  );

  return (
    <div
      // `work-section-<title>` gives each gallery a semantic hook (e.g.
      // `.work-section-logos` vs `.work-section-banners`) so their mobile
      // layouts can differ without depending on child order.
      className={`work-section${isThumbnails ? ' thumbnails-section' : ''} work-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      ref={sectionRef}
    >
      <h3 className="work-section-title">{title}</h3>
      {scrollAll ? (
        // Too many tiles to stack, so they ride one scrollable line.
        <ScrollRow className="thumbnails-gallery" count={images.length} label={title}>
          {images.map(renderItem)}
        </ScrollRow>
      ) : (
        <>
          {/* Images 4+ come from `visible` once `showAll` is set — rendering
              the `hidden` list here too duplicated every extra tile. */}
          <div className="work-gallery">{visible.map(renderItem)}</div>
          {!showAll && hidden.length > 0 && (
            <div className="view-more-container">
              <button className="contact-btn view-more-btn" onClick={() => setShowAll(true)}>
                View More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function WorkItem({
  src,
  alt,
  delay,
  onClick,
  scrollObserver,
}: {
  src: string;
  alt: string;
  delay: number;
  onClick: () => void;
  scrollObserver: IntersectionObserver;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('scroll-fade-in', `scroll-fade-in-delay-${delay}`);
    scrollObserver.observe(el);
    return () => scrollObserver.unobserve(el);
  }, [delay, scrollObserver]);

  return (
    <div className="work-item" ref={ref} onClick={onClick}>
      <img src={src} alt={alt} className="work-image" loading="lazy" />
    </div>
  );
}

// ---------- Main App ----------
export default function App() {
  // Land on the Editor profile by default; the toggle switches to Web Developer.
  const [currentPortfolio, setCurrentPortfolio] = useState<'web' | 'video'>('video');
  const [isWeb, setIsWeb] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const [lightbox, setLightbox] = useState<LightboxState>({ images: [], index: 0, open: false });
  // Auto-play toggle for the Edited Videos gallery (on by default).
  const [videosAutoplay, setVideosAutoplay] = useState(true);

  // Shared IntersectionObserver instance
  const observerRef = useRef<IntersectionObserver | null>(null);
  if (!observerRef.current) {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerRef.current!.unobserve(entry.target);
          }
        });
      },
      // threshold 0 + a small negative bottom margin: reveal as soon as the
      // element's top enters the viewport. A non-zero threshold never fires for
      // sections taller than the viewport (the editor galleries are many
      // viewports tall), which left them stuck at opacity:0 (blank/black).
      { threshold: 0, rootMargin: '0px 0px -50px 0px' }
    );
  }
  const scrollObserver = observerRef.current!;

  // Observe static sections on mount
  useEffect(() => {
    const targets = document.querySelectorAll('.section, .section-title, .about-content, .contact-content');
    targets.forEach((el) => {
      el.classList.add('scroll-fade-in');
      scrollObserver.observe(el);
    });
  }, [scrollObserver]);

  // Observe skill cards whenever portfolio changes
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.classList.remove('visible');
        card.classList.add('scroll-fade-in', `scroll-fade-in-delay-${(index % 4) + 1}`);
        scrollObserver.observe(card);
      });
      document.querySelectorAll('.software-card').forEach((card, index) => {
        card.classList.remove('visible');
        card.classList.add('scroll-fade-in', `scroll-fade-in-delay-${(index % 4) + 1}`);
        scrollObserver.observe(card);
      });
      document.querySelectorAll('.contact-btn').forEach((btn, index) => {
        btn.classList.remove('visible');
        btn.classList.add('scroll-fade-in', `scroll-fade-in-delay-${(index % 3) + 1}`);
        scrollObserver.observe(btn);
      });
    }, 120);
    return () => clearTimeout(timer);
  }, [currentPortfolio, scrollObserver]);

  // Safety net: every element carrying `.scroll-fade-in` starts at opacity:0 and
  // is only revealed once it is observed. Some of them are created after mount
  // (web project cards, the video-mode "Softwares" section, the editor
  // galleries), and a fixed selector list missed them — so they stayed
  // invisible and the section looked blank/black. Re-scan the DOM on mount and
  // on every portfolio switch and observe anything not yet revealed.
  useEffect(() => {
    const timer = setTimeout(() => {
      document
        .querySelectorAll('.scroll-fade-in:not(.visible)')
        .forEach((el) => scrollObserver.observe(el));
    }, 150);
    return () => clearTimeout(timer);
  }, [currentPortfolio, scrollObserver]);

  // Handle title wrapping
  useEffect(() => {
    const heroTitle = document.getElementById('hero-title');
    if (!heroTitle) return;
    const update = () => {
      const isDesktop = window.matchMedia('(min-width: 769px)').matches;
      if (currentPortfolio === 'video' && isDesktop) {
        heroTitle.style.whiteSpace = 'nowrap';
        heroTitle.style.wordBreak = 'keep-all';
      } else {
        heroTitle.style.whiteSpace = '';
        heroTitle.style.wordBreak = '';
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [currentPortfolio]);

  const handleToggle = (checked: boolean) => {
    setContentVisible(false);
    setTimeout(() => {
      setIsWeb(!checked);
      setCurrentPortfolio(checked ? 'video' : 'web');
      setContentVisible(true);
    }, 200);
  };

  const openLightbox = useCallback((images: string[], index: number) => {
    setLightbox({ images, open: true, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox((lb) => ({ ...lb, open: false }));
  }, []);

  const navigateLightbox = useCallback((step: number) => {
    setLightbox((lb) => ({
      ...lb,
      index: (lb.index + step + lb.images.length) % lb.images.length,
    }));
  }, []);

  const scrollToVideos = () => {
    const el = document.getElementById('edited-videos');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const data = portfolioData[currentPortfolio];

  // Build contact links
  const webContact = portfolioData.web.contact;
  const videoContact = portfolioData.video.contact;
  const mergedContact = {
    email: webContact.email || videoContact.email,
    linkedin: 'linkedin' in webContact ? webContact.linkedin : undefined,
    github: 'github' in webContact ? webContact.github : undefined,
    instagram: webContact.instagram || videoContact.instagram,
    fiverr: 'fiverr' in videoContact ? videoContact.fiverr : undefined,
    freelancer: 'freelancer' in videoContact ? videoContact.freelancer : undefined,
  };

  const contactLinks = [
    { href: `mailto:${mergedContact.email}`, label: 'Email Me', external: false },
    mergedContact.linkedin ? { href: mergedContact.linkedin, label: 'LinkedIn', external: true } : null,
    mergedContact.github ? { href: mergedContact.github, label: 'GitHub', external: true } : null,
    mergedContact.instagram ? { href: mergedContact.instagram, label: 'Instagram', external: true } : null,
    mergedContact.fiverr ? { href: mergedContact.fiverr, label: 'Fiverr', external: true } : null,
    mergedContact.freelancer ? { href: mergedContact.freelancer, label: 'Freelancer', external: true } : null,
  ].filter(Boolean) as { href: string; label: string; external: boolean }[];

  // Logo images: reordered (original script moves first 3 to end)
  const logoImages = (() => {
    const logos = portfolioData.video.work.logos;
    if (logos.length > 3) return [...logos.slice(3), ...logos.slice(0, 3)];
    return logos;
  })();

  return (
    <>
      {/* Ambient layers (custom cursor, click bubbles) */}
      <CustomCursor />
      <ClickBubbles />
      <div className="container" id="main-container">
        {/* Header */}
        <header className="header">
          <nav className="nav">
            <ul className="nav-list">
              {['#home', '#about', '#skills', '#projects', '#contact'].map((href) => (
                <li key={href}>
                  <a
                    href={href}
                    className="nav-link"
                    onClick={(e) => handleNavClick(e, href)}
                  >
                    {href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* Hero */}
        <section id="home" className="hero">
          <div className="profile-container">
            <div className="profile-image-wrapper">
              <img
                src={`${GITHUB_RAW}/Images/Tech_Profile_Pic.png`}
                alt="Web Developer Profile"
                className={`profile-image${isWeb ? ' active' : ''}`}
                id="profile-web"
              />
              <img
                src={`${GITHUB_RAW}/Images/Editor_Profile_Pic.png`}
                alt="Editor Profile"
                className={`profile-image${!isWeb ? ' active' : ''}`}
                id="profile-video"
              />
            </div>
            <div className="shashank-signature-name">Shashank Vishwakarma</div>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <span
                  className="toggle-label"
                  id="left-label"
                  style={{
                    color: isWeb ? 'var(--text-light)' : 'rgba(255, 255, 255, 0.5)',
                    textShadow: isWeb ? '0 0 14px rgba(123, 179, 232, 0.85)' : 'none',
                    opacity: isWeb ? 1 : 0.85,
                  }}
                >
                  Web Developer
                </span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="portfolio-toggle"
                    checked={!isWeb}
                    onChange={(e) => handleToggle(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
                <span
                  className="toggle-label"
                  id="right-label"
                  style={{
                    color: !isWeb ? 'var(--text-light)' : 'rgba(255, 255, 255, 0.5)',
                    textShadow: !isWeb ? '0 0 14px rgba(123, 179, 232, 0.85)' : 'none',
                    opacity: !isWeb ? 1 : 0.85,
                  }}
                >
                  Editor
                </span>
              </div>
            </div>
          </div>
          <div
            className="hero-content"
            style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}
          >
            <h1
              className="hero-title"
              id="hero-title"
            >
              {data.title}
            </h1>
            <p className="hero-subtitle" id="hero-subtitle">
              {data.subtitle}
            </p>
            <div className="hero-actions" id="hero-actions">
              {currentPortfolio === 'web' ? (
                <a
                  href={`${GITHUB_RAW}/Shashank_Resume.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn hero-action-btn"
                >
                  Resume
                </a>
              ) : (
                <>
                  <a
                    href="https://drive.google.com/drive/folders/1y4DlAmqN2YmXofMwYt_-uYcokwjaMr0E?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-btn hero-action-btn"
                  >
                    Portfolio
                  </a>
                  <a
                    href={`${GITHUB_RAW}/Editor_Shashank_Resume.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-btn hero-action-btn"
                  >
                    Resume
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="section">
          <h2 className="section-title">About Me</h2>
          <div
            className="about-content"
            style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}
          >
            <p>{data.about}</p>
            {/* Experience badge, kept separate from the paragraph so it reads
                as a standout credential rather than more body copy. */}
            <div className="about-experience">
              <span className="about-experience-icon" aria-hidden="true">
                🏆
              </span>
              <span className="about-experience-text">
                <strong>3+ Years</strong> of Experience
              </span>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="section">
          <h2 className="section-title">Skills</h2>
          <div
            className="skills-container"
            id="skills-container"
            style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}
          >
            {data.skills.map((skill) => {
              const isClickable = 'clickable' in skill && skill.clickable;
              return (
                <div
                  key={skill.title}
                  className={`skill-card${isClickable ? ' clickable-skill' : ''}`}
                  onClick={isClickable ? scrollToVideos : undefined}
                  title={isClickable ? 'See my video edits' : undefined}
                >
                  <div className="skill-icon">{skill.icon}</div>
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                  {isClickable && <span className="skill-cta">See my edits ↓</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Software (video mode only) */}
        {currentPortfolio === 'video' && (
          <section className="section scroll-fade-in" id="software">
            <h2 className="section-title">Softwares I Use</h2>
            <div className="software-container">
              {softwareItems.map((it) => (
                <div key={it.key} className="software-card">
                  {it.icon ? (
                    <div className="software-logo">
                      <img src={it.icon} alt={`${it.name} logo`} className="software-logo-img" />
                    </div>
                  ) : (
                    <div className={`software-logo software-${it.key}`}>{it.label}</div>
                  )}
                  <div className="software-name">{it.name}</div>
                  {it.note && <div className="software-note">{it.note}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects / My Work */}
        <section id="projects" className="section">
          <h2 className="section-title" id="projects-title">
            {currentPortfolio === 'web' ? 'Projects' : 'My Work'}
          </h2>
          <div
            className={`projects-container${currentPortfolio === 'video' ? ' editor-layout' : ''}`}
            id="projects-container"
            style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}
          >
            {currentPortfolio === 'web' && portfolioData.web.projects.map((project, i) => (
              <div
                key={project.name}
                className={`project-card web-project-card scroll-fade-in scroll-fade-in-delay-${(i % 3) + 1}`}
              >
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                  <div className="project-image-wrapper">
                    <img src={project.image} alt={project.name} className="project-image" />
                    <div className="project-overlay">
                      <span className="project-link-text">Visit Website →</span>
                    </div>
                  </div>
                  <div className="project-info">
                    <div className="project-header">
                      <h3 className="project-name">{project.name}</h3>
                      {project.techStack && (
                        <div className="tech-stack">
                          {project.techStack.map((tech) => (
                            <span key={tech} className="tech-badge">{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="project-description">{project.description}</p>
                    {project.details.length > 0 && (
                      <ul className="project-details">
                        {project.details.map((d, di) => <li key={di}>{d}</li>)}
                      </ul>
                    )}
                  </div>
                </a>
              </div>
            ))}

            {currentPortfolio === 'video' && (
              <>
                {/* Logos + Banners row */}
                <div className="work-sections-row">
                  <WorkSection
                    title="Logos"
                    images={logoImages}
                    onOpenLightbox={openLightbox}
                    scrollObserver={scrollObserver}
                  />
                  <WorkSection
                    title="Banners"
                    images={portfolioData.video.work.banners}
                    onOpenLightbox={openLightbox}
                    scrollObserver={scrollObserver}
                  />
                </div>

                {/* Thumbnails */}
                <WorkSection
                  title="Thumbnails"
                  images={portfolioData.video.work.thumbnails}
                  isThumbnails
                  scrollAll
                  onOpenLightbox={openLightbox}
                  scrollObserver={scrollObserver}
                />

                {/* Edited Videos */}
                <div id="edited-videos" className="work-section videos-section">
                  <div className="section-strip" aria-hidden="true" />
                  <h3 className="work-section-title">Edited Videos</h3>
                  <div className="videos-toolbar">
                    <button
                      type="button"
                      className={`autoplay-toggle${videosAutoplay ? ' autoplay-toggle--on' : ''}`}
                      onClick={() => setVideosAutoplay((v) => !v)}
                      aria-pressed={videosAutoplay}
                      title={videosAutoplay ? 'Turn auto-play off' : 'Turn auto-play on'}
                    >
                      <span className="autoplay-toggle-dot" />
                      Auto-play {videosAutoplay ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  {portfolioData.video.work.videoCategories.map((cat) => (
                    <div key={cat.name} className="video-category">
                      <h4 className="video-category-title">{cat.name}</h4>
                      {cat.isShort ? (
                        <ScrollRow
                          className="shorts-gallery"
                          count={cat.ids.length}
                          label={cat.name}
                        >
                          {cat.ids.map((id) => (
                            <VideoCard key={id} videoId={id} isShort autoplay={videosAutoplay} />
                          ))}
                        </ScrollRow>
                      ) : (
                        <div className="work-gallery">
                          {cat.ids.map((id) => (
                            <VideoCard key={id} videoId={id} isShort={false} autoplay={videosAutoplay} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <p>Feel free to reach out for collaborations or inquiries!</p>
            <div className="contact-buttons">
              {contactLinks.map((link) => {
                const icon = iconMap[link.label];
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="contact-btn contact-btn-icon"
                  >
                    {icon && <img src={icon} alt={link.label} className="contact-icon" />}
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2025 Shashank Vishwakarma. All rights reserved.</p>
        </footer>
      </div>

      {/* Lightbox */}
      <Lightbox state={lightbox} onClose={closeLightbox} onNavigate={navigateLightbox} />
    </>
  );
}
