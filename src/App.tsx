import { useState, useEffect, useRef, useCallback } from 'react';
import './portfolio.css';

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
        {
          name: 'Edits & Concept Shorts',
          isShort: true,
          ids: [
            'RCLVTqISFG4',
            'tuqR9ex2TRM',
            'ACYIr9roZpU',
            'LgLTZFCo5uM',
            'MKBacqSfGB4',
            '9qeoM2OAy9Y',
            'WHOBO4K7HGU',
            'KnwdLdw6jW8',
            'oDyl_mqVEKA',
            '3sVzGlPYe4g',
          ],
        },
        {
          name: 'Commercial & Promotional',
          isShort: false,
          ids: [
            'cFlr5yehrZA',
            'nHv1w0gQtCE',
            'MxmkDS_Zu1s',
          ],
        },
        {
          name: 'Challenge & Entertainment Vlogs',
          isShort: false,
          ids: [
            '5lVBUFWSCuE',
            'th4etMIl9ac',
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
function VideoCard({ videoId, isShort = false }: { videoId: string; isShort?: boolean }) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // YouTube thumbnails: mqdefault (320×180) works for both regular and Shorts
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  // autoplay=1 + mute=1: required by browsers; rel=0: no related videos after playback
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&playsinline=1`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.3) {
          setActive(true);
        } else {
          setActive(false);
        }
      },
      { threshold: [0, 0.3] }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [videoId]);

  return (
    <div
      className={`work-item video-work-item${isShort ? ' shorts-item' : ''}`}
      ref={containerRef}
    >
      {active ? (
        <iframe
          src={embedUrl}
          className="video-iframe"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          title={`Video ${videoId}`}
        />
      ) : (
        <img
          src={thumbnailUrl}
          alt="Video preview"
          className="work-image"
          loading="lazy"
        />
      )}
    </div>
  );
}

// ---------- WorkSection (images) ----------
function WorkSection({
  title,
  images,
  isThumbnails,
  onOpenLightbox,
  scrollObserver,
}: {
  title: string;
  images: string[];
  isThumbnails?: boolean;
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

  return (
    <div
      className={`work-section${isThumbnails ? ' thumbnails-section' : ''}`}
      ref={sectionRef}
    >
      <h3 className="work-section-title">{title}</h3>
      <div className={`work-gallery${isThumbnails ? '' : ''}`}>
        {visible.map((src, idx) => (
          <WorkItem
            key={src}
            src={src}
            alt={`${title} ${idx + 1}`}
            delay={(idx % 4) + 1}
            onClick={() => onOpenLightbox(images, idx)}
            scrollObserver={scrollObserver}
          />
        ))}
        {showAll &&
          hidden.map((src, idx) => (
            <WorkItem
              key={src}
              src={src}
              alt={`${title} ${idx + 4}`}
              delay={(idx % 4) + 1}
              onClick={() => onOpenLightbox(images, idx + 3)}
              scrollObserver={scrollObserver}
            />
          ))}
      </div>
      {!showAll && hidden.length > 0 && (
        <div className="view-more-container">
          <button className="contact-btn view-more-btn" onClick={() => setShowAll(true)}>
            View More
          </button>
        </div>
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
  const [currentPortfolio, setCurrentPortfolio] = useState<'web' | 'video'>('web');
  const [isWeb, setIsWeb] = useState(true);
  const [contentVisible, setContentVisible] = useState(true);
  const [lightbox, setLightbox] = useState<LightboxState>({ images: [], index: 0, open: false });

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
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
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
                  style={{ color: isWeb ? 'var(--text-light)' : 'var(--accent-blue)', transition: 'color var(--transition-speed) ease' }}
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
                  style={{ color: !isWeb ? 'var(--text-light)' : 'var(--accent-blue)', transition: 'color var(--transition-speed) ease' }}
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
                  onOpenLightbox={openLightbox}
                  scrollObserver={scrollObserver}
                />

                {/* Edited Videos */}
                <div id="edited-videos" className="work-section videos-section">
                  <h3 className="work-section-title">Edited Videos</h3>
                  {portfolioData.video.work.videoCategories.map((cat) => (
                    <div key={cat.name} className="video-category">
                      <h4 className="video-category-title">{cat.name}</h4>
                      <div className={`work-gallery${cat.isShort ? ' shorts-gallery' : ''}`}>
                        {cat.ids.map((id) => (
                          <VideoCard key={id} videoId={id} isShort={cat.isShort} />
                        ))}
                      </div>
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
