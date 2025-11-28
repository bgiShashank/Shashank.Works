// Portfolio data
const portfolioData = {
    web: {
        title: "Web Developer",
        subtitle: "Creating beautiful and functional web experiences",
        about: "I'm a dedicated web developer with expertise in front-end technologies. I love creating interactive and responsive web applications that provide excellent user experiences.",
        contact: {
            email: "business.shashank3@gmail.com",
            linkedin: "https://www.linkedin.com/in/shashank-vishwakarma-4b3937386/",
            github: "https://github.com/bgiShashank",
            instagram: "https://www.instagram.com/31_03_shashank?igsh=aDM2cGY5cjNlbnNn"
        },
        skills: [
            { icon: "💻", title: "HTML", description: "Semantic markup and structure" },
            { icon: "🎨", title: "CSS", description: "Styling and animations" },
            { icon: "⚡", title: "JavaScript", description: "Interactive functionality" },
            { icon: "🐍", title: "Python", description: "Programming and automation" },
            { icon: "☕", title: "Java + DSA", description: "Object-oriented programming and algorithms" }
        ],
        projects: [
            {
                name: "Moodify",
                image: "Tech_Projects/Moodify_Logo.png",
                link: "https://moodify-eight-red.vercel.app/",
                description: "Mood-Based Music & Wallpaper Recommendation Web App",
                techStack: ["HTML", "CSS", "JavaScript", "JioSaavn API"],
                details: [
                    "Developed a web application that provides personalized music and wallpaper recommendations based on user mood selection.",
                    "Integrated JioSaavn API for Hindi/Bollywood music streaming and Pexels API for contextual wallpaper images.",
                    "Built a custom music player with play/pause controls and implemented intelligent duplicate prevention algorithms.",
                    "Created a responsive UI with interactive mood selection panel featuring smooth animations and hover effects.",
                    "Implemented wallpaper download functionality and refresh features with state management to avoid showing duplicate content."
                ]
            },
            {
                name: "India Hunters",
                image: "Tech_Projects/India_Hunters.png",
                link: "https://india-hunters.vercel.app/",
                description: "BGMI Tournament Registration & Management Platform",
                techStack: ["HTML", "CSS", "JavaScript"],
                details: [
                    "Designed and developed a responsive website for BGMI tournament registration and management.",
                    "Built team registration forms, payment section, and participant data handling features.",
                    "Created an admin panel to manage tournament entries and streamline operations.",
                    "Focused on user-friendly UI/UX and responsive design for mobile and desktop."
                ]
            }
        ]
    },
    video: {
        title: "Video Editor & Graphics Designer",
        subtitle: "Bringing creativity to life through visuals",
        about: "I'm a skilled video editor and graphics designer with a passion for visual storytelling. I create engaging content including logos, banners, thumbnails, overlays, and professional video edits.",
        contact: {
            email: "business.shashank3@gmail.com",
            freelancer: "https://www.freelancer.in/u/shashank307494",
            fiverr: "https://www.fiverr.com/meeshank_0807",
            instagram: "https://www.instagram.com/31_03_shashank?igsh=aDM2cGY5cjNlbnNn"
        },
        skills: [
            { icon: "🎬", title: "Video Editing", description: "Professional video production" },
            { icon: "🎨", title: "Graphics Design", description: "Logos, banners, and thumbnails" },
            { icon: "✨", title: "Overlays", description: "Custom overlay designs" }
        ],
        work: {
            logos: [
                "Editor_Work/Logos/image (1).jpg",
                "Editor_Work/Logos/image (2).jpg",
                "Editor_Work/Logos/IMG_20251016_014938.png",
                "Editor_Work/Logos/Picsart_25-11-04_16-13-13-587.jpg",
                "Editor_Work/Logos/SkyClub_Logo_.png",
                "Editor_Work/Logos/V7ZlUi4aHTyns4Do.png"
            ],
            banners: [
                "Editor_Work/Banners/Freelance 2.png",
                "Editor_Work/Banners/Freelance.png",
                "Editor_Work/Banners/IMG_20251104_131418.png",
                "Editor_Work/Banners/Picsart_25-11-03_13-30-55-420.jpg",
                "Editor_Work/Banners/Royal_Fortune_Casino_Banner.jpg"
            ],
            thumbnails: [
                "Editor_Work/Thumbnails/DOC-20251128-WA0001.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0002.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0003.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0004.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0005.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0006.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0007.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0008.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0010.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0011.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0014.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0015.jpg",
                "Editor_Work/Thumbnails/DOC-20251128-WA0017.jpg",
                "Editor_Work/Thumbnails/IMG_20251018_202111.png",
                "Editor_Work/Thumbnails/Picsart_24-10-15_11-17-31-129.jpg",
                "Editor_Work/Thumbnails/Picsart_24-10-21_18-13-12-181.jpg",
                "Editor_Work/Thumbnails/Picsart_24-11-15_09-18-32-125.jpg",
                "Editor_Work/Thumbnails/Picsart_24-11-16_18-29-37-429.jpg",
                "Editor_Work/Thumbnails/Picsart_25-02-17_14-27-52-884.jpg",
                "Editor_Work/Thumbnails/Picsart_25-07-13_15-00-06-268.jpg",
                "Editor_Work/Thumbnails/Picsart_25-07-13_15-31-00-535.jpg",
                "Editor_Work/Thumbnails/Picsart_25-09-12_18-24-17-781.jpg",
                "Editor_Work/Thumbnails/Picsart_25-09-19_21-37-27-139.jpg",
                "Editor_Work/Thumbnails/Picsart_25-10-11_21-11-38-457.jpg",
                "Editor_Work/Thumbnails/Picsart_25-11-11_15-14-06-462.jpg",
                "Editor_Work/Thumbnails/Picsart_25-11-11_15-49-07-211.jpg",
                "Editor_Work/Thumbnails/SAVE_20241203_134210.jpg"
            ]
        }
    }
};

// DOM Elements
const toggle = document.getElementById('portfolio-toggle');
const profileWeb = document.getElementById('profile-web');
const profileVideo = document.getElementById('profile-video');
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const aboutContent = document.getElementById('about-content');
const skillsContainer = document.getElementById('skills-container');
const projectsContainer = document.getElementById('projects-container');
const projectsTitle = document.getElementById('projects-title');
const leftLabel = document.getElementById('left-label');
const rightLabel = document.getElementById('right-label');
const contactButtonsContainer = document.querySelector('.contact-buttons');

// Initialize portfolio
let currentPortfolio = 'web';

// Function to switch profile picture with fade transition
function switchProfilePicture(isWeb) {
    if (isWeb) {
        profileWeb.classList.add('active');
        profileVideo.classList.remove('active');
    } else {
        profileVideo.classList.add('active');
        profileWeb.classList.remove('active');
    }
}

// Function to render web projects
function renderWebProjects(projects) {
    projectsContainer.classList.remove('editor-layout');
    projectsContainer.innerHTML = '';
    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card web-project-card';
        projectCard.innerHTML = `
            <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link">
                <div class="project-image-wrapper">
                    <img src="${project.image}" alt="${project.name}" class="project-image">
                    <div class="project-overlay">
                        <span class="project-link-text">Visit Website →</span>
                    </div>
                </div>
                <div class="project-info">
                    <div class="project-header">
                        <h3 class="project-name">${project.name}</h3>
                        ${project.techStack ? `
                            <div class="tech-stack">
                                ${project.techStack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <p class="project-description">${project.description}</p>
                    ${project.details.length > 0 ? `
                        <ul class="project-details">
                            ${project.details.map(detail => `<li>${detail}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            </a>
        `;
        projectsContainer.appendChild(projectCard);
        
        // Add animation classes
        projectCard.classList.add('scroll-fade-in');
        projectCard.classList.add(`scroll-fade-in-delay-${(index % 3) + 1}`);
        scrollObserver.observe(projectCard);
    });
}

// Function to render editor work
function renderEditorWork(work) {
    projectsContainer.classList.add('editor-layout');
    projectsContainer.innerHTML = '';

    function createWorkSection(title, images, options = {}) {
        const isThumbnails = options.isThumbnails === true;
        const section = document.createElement('div');
        section.className = 'work-section scroll-fade-in' + (isThumbnails ? ' thumbnails-section' : '');
        const titleEl = document.createElement('h3');
        titleEl.className = 'work-section-title';
        titleEl.textContent = title;
        section.appendChild(titleEl);

        const gallery = document.createElement('div');
        gallery.className = 'work-gallery' + (isThumbnails ? ' thumbnails-gallery' : '');

        images.forEach((src, index) => {
            const item = document.createElement('div');
            item.className = 'work-item';
            if (index >= 3) item.classList.add('hidden');
            const img = document.createElement('img');
            img.src = `./${src}`;
            img.alt = `${title} ${index + 1}`;
            img.className = 'work-image';
            img.loading = 'lazy';
            img.addEventListener('click', () => openLightbox(images, index));
            item.appendChild(img);
            gallery.appendChild(item);

            if (index < 3) {
                item.classList.add('scroll-fade-in');
                item.classList.add(`scroll-fade-in-delay-${(index % 4) + 1}`);
                scrollObserver.observe(item);
            }
        });

        section.appendChild(gallery);

        if (images.length > 3) {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'view-more-container';
            const btn = document.createElement('button');
            btn.className = 'contact-btn view-more-btn';
            btn.textContent = 'View More';
            btn.addEventListener('click', () => {
                gallery.querySelectorAll('.work-item.hidden').forEach((item, i) => {
                    item.classList.remove('hidden');
                    item.classList.add('scroll-fade-in');
                    item.classList.add(`scroll-fade-in-delay-${(i % 4) + 1}`);
                    scrollObserver.observe(item);
                });
                btnContainer.remove();
            });
            btnContainer.appendChild(btn);
            section.appendChild(btnContainer);
        }

        return section;
    }

    let logosImages = Array.isArray(work.logos) ? [...work.logos] : [];
    if (logosImages.length > 3) {
        logosImages = logosImages.slice(3).concat(logosImages.slice(0, 3));
    }
    const logosSection = createWorkSection('Logos', logosImages);
    const bannersSection = createWorkSection('Banners', work.banners);

    const row = document.createElement('div');
    row.className = 'work-sections-row scroll-fade-in';
    row.appendChild(logosSection);
    row.appendChild(bannersSection);
    projectsContainer.appendChild(row);
    scrollObserver.observe(row);
    scrollObserver.observe(logosSection);
    scrollObserver.observe(bannersSection);

    const thumbnailsSection = createWorkSection('Thumbnails', work.thumbnails, { isThumbnails: true });
    projectsContainer.appendChild(thumbnailsSection);
    scrollObserver.observe(thumbnailsSection);
}

let lightboxImages = [];
let lightboxIndex = 0;

function ensureLightbox() {
    let overlay = document.querySelector('.lightbox-overlay');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    const content = document.createElement('div');
    content.className = 'lightbox-content';

    const img = document.createElement('img');
    img.className = 'lightbox-image';
    content.appendChild(img);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', closeLightbox);
    content.appendChild(closeBtn);

    const prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-prev';
    prevBtn.textContent = '‹';
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    content.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-next';
    nextBtn.textContent = '›';
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    content.appendChild(nextBtn);

    overlay.appendChild(content);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    document.body.appendChild(overlay);
    return overlay;
}

function openLightbox(images, index) {
    const overlay = ensureLightbox();
    lightboxImages = images;
    lightboxIndex = index;
    updateLightboxImage();
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', handleLightboxKeys);
}

function closeLightbox() {
    const overlay = document.querySelector('.lightbox-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', handleLightboxKeys);
}

function updateLightboxImage() {
    const imgEl = document.querySelector('.lightbox-image');
    if (!imgEl || !lightboxImages.length) return;
    imgEl.src = `./${lightboxImages[lightboxIndex]}`;
    imgEl.alt = `Work Image ${lightboxIndex + 1}`;
}

function navigateLightbox(step) {
    if (!lightboxImages.length) return;
    lightboxIndex = (lightboxIndex + step + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
}

function handleLightboxKeys(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
}

// Function to update content with smooth transitions
function updateContent(portfolioType) {
    const data = portfolioData[portfolioType];
    
    // Fade out content
    heroTitle.style.opacity = '0';
    heroSubtitle.style.opacity = '0';
    aboutContent.style.opacity = '0';
    skillsContainer.style.opacity = '0';
    projectsContainer.style.opacity = '0';
    
    // Update content after fade out
    setTimeout(() => {
        heroTitle.textContent = data.title;
        heroSubtitle.textContent = data.subtitle;
        aboutContent.querySelector('p').textContent = data.about;
        heroTitle.classList.remove('hero-title-contrast');
        updateHeroTitleWrap();
        projectsTitle.textContent = portfolioType === 'web' ? 'Projects' : 'My Work';
        
        // Update skills
        skillsContainer.innerHTML = '';
        data.skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <div class="skill-icon">${skill.icon}</div>
                <h3>${skill.title}</h3>
                <p>${skill.description}</p>
            `;
            skillsContainer.appendChild(skillCard);
        });

        // Render software section for video editor portfolio
        renderSoftwareSection(portfolioType);
        
        // Update projects/work
        if (portfolioType === 'web' && data.projects) {
            renderWebProjects(data.projects);
        } else if (portfolioType === 'video' && data.work) {
            renderEditorWork(data.work);
        }

        // Update contact buttons
        renderContactButtons();
        
        // Fade in content
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroSubtitle.style.opacity = '1';
            aboutContent.style.opacity = '1';
            skillsContainer.style.opacity = '1';
            projectsContainer.style.opacity = '1';
            
            // Re-animate skill cards after content update
            setTimeout(() => {
                document.querySelectorAll('.skill-card').forEach((card, index) => {
                    // Remove existing animation classes
                    card.classList.remove('visible', 'scroll-fade-in-delay-1', 'scroll-fade-in-delay-2', 'scroll-fade-in-delay-3', 'scroll-fade-in-delay-4');
                    // Add animation classes
                    card.classList.add('scroll-fade-in');
                    card.classList.add(`scroll-fade-in-delay-${(index % 4) + 1}`);
                    // Observe for animation
                    scrollObserver.observe(card);
                });
            }, 50);

            setTimeout(() => {
                document.querySelectorAll('.contact-btn').forEach((btn, index) => {
                    btn.classList.add('scroll-fade-in');
                    btn.classList.add(`scroll-fade-in-delay-${(index % 3) + 1}`);
                    scrollObserver.observe(btn);
                });
            }, 50);
        }, 50);
    }, 200);
}

function updateHeroTitleWrap() {
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    if (currentPortfolio === 'video' && isDesktop) {
        heroTitle.style.whiteSpace = 'nowrap';
        heroTitle.style.wordBreak = 'keep-all';
    } else {
        heroTitle.style.whiteSpace = '';
        heroTitle.style.wordBreak = '';
    }
}

function renderSoftwareSection(portfolioType) {
    // Remove existing section if present
    const existing = document.getElementById('software');
    if (existing) existing.remove();

    if (portfolioType !== 'video') return;

    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const section = document.createElement('section');
    section.className = 'section scroll-fade-in';
    section.id = 'software';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'Softwares I Use';
    section.appendChild(title);

    const items = [
        { key: 'pr', name: 'Adobe Premiere Pro', label: 'Pr' },
        { key: 'ae', name: 'Adobe After Effects', label: 'Ae' },
        { key: 'ps', name: 'Adobe Photoshop', label: 'Ps' },
        { key: 'capcut', name: 'CapCut', icon: 'Images/CapCut_Logo.png' },
        { key: 'picsart', name: 'Picsart', icon: 'Images/PicsArt_Logo.png' },
    ];

    const container = document.createElement('div');
    container.className = 'software-container';

    items.forEach((it, index) => {
        const card = document.createElement('div');
        card.className = 'software-card';
        const hasIcon = !!it.icon;
        card.innerHTML = hasIcon
            ? `
                <div class="software-logo">
                    <img src="${it.icon}" alt="${it.name} logo" class="software-logo-img" />
                </div>
                <div class="software-name">${it.name}</div>
            `
            : `
                <div class="software-logo software-${it.key}">${it.label || ''}</div>
                <div class="software-name">${it.name}</div>
            `;
        container.appendChild(card);
        // animations
        card.classList.add('scroll-fade-in');
        card.classList.add(`scroll-fade-in-delay-${(index % 4) + 1}`);
        scrollObserver.observe(card);
    });

    section.appendChild(container);
    // Insert after skills section
    skillsSection.insertAdjacentElement('afterend', section);
    scrollObserver.observe(section);
}

// Initialize projects on page load
function initProjects() {
    const data = portfolioData[currentPortfolio];
    if (currentPortfolio === 'web' && data.projects) {
        renderWebProjects(data.projects);
    } else if (currentPortfolio === 'video' && data.work) {
        renderEditorWork(data.work);
    }
}

// Render contact buttons
function renderContactButtons() {
    const cw = (portfolioData.web && portfolioData.web.contact) || {};
    const cv = (portfolioData.video && portfolioData.video.contact) || {};
    const c = {
        email: cw.email || cv.email,
        linkedin: cw.linkedin,
        github: cw.github,
        instagram: cw.instagram || cv.instagram,
        fiverr: cv.fiverr,
        freelancer: cv.freelancer,
    };

    if (!contactButtonsContainer || !c.email) return;
    const links = [
        { href: `mailto:${c.email}`, label: 'Email Me' },
        c.linkedin ? { href: c.linkedin, label: 'LinkedIn', external: true } : null,
        c.github ? { href: c.github, label: 'GitHub', external: true } : null,
        c.instagram ? { href: c.instagram, label: 'Instagram', external: true } : null,
        c.fiverr ? { href: c.fiverr, label: 'Fiverr', external: true } : null,
        c.freelancer ? { href: c.freelancer, label: 'Freelancer', external: true } : null,
    ].filter(Boolean);

    const iconMap = {
        'Email Me': 'Images/email.svg',
        'LinkedIn': 'Images/linkedin.svg',
        'GitHub': 'Images/Github_logo.png',
        'Instagram': 'Images/Instagram_logo.png',
        'Fiverr': 'Images/Fiverr_logo.png',
        'Freelancer': 'Images/Freelancer_logo.png',
    };

    contactButtonsContainer.innerHTML = links.map(l => {
        const icon = iconMap[l.label] || '';
        return `<a href="${l.href}" ${l.external ? 'target="_blank" rel="noopener noreferrer"' : ''} class="contact-btn contact-btn-icon">${icon ? `<img src="${icon}" alt="${l.label}" class="contact-icon">` : ''}<span>${l.label}</span></a>`;
    }).join('');
}

// Toggle event listener
toggle.addEventListener('change', function() {
    const isWeb = !this.checked;
    currentPortfolio = isWeb ? 'web' : 'video';
    
    // Switch profile picture with fade transition
    switchProfilePicture(isWeb);
    
    // Update all content
    updateContent(currentPortfolio);
    
    // Update labels highlight
    if (isWeb) {
        leftLabel.style.color = 'var(--text-light)';
        rightLabel.style.color = 'var(--accent-blue)';
    } else {
        leftLabel.style.color = 'var(--accent-blue)';
        rightLabel.style.color = 'var(--text-light)';
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Enhanced scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once animated
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize scroll animations when DOM is loaded
function initScrollAnimations() {
    // Animate sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('scroll-fade-in');
        scrollObserver.observe(section);
    });

    // Animate section titles
    document.querySelectorAll('.section-title').forEach((title, index) => {
        title.classList.add('scroll-fade-in');
        title.classList.add(`scroll-fade-in-delay-${(index % 4) + 1}`);
        scrollObserver.observe(title);
    });

    // Animate skill cards with staggered delay
    document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.classList.add('scroll-fade-in');
        card.classList.add(`scroll-fade-in-delay-${(index % 4) + 1}`);
        scrollObserver.observe(card);
    });

    // Animate project cards with staggered delay
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.classList.add('scroll-fade-in');
        card.classList.add(`scroll-fade-in-delay-${(index % 3) + 1}`);
        scrollObserver.observe(card);
    });

    // Animate about content
    const aboutContent = document.getElementById('about-content');
    if (aboutContent) {
        aboutContent.classList.add('scroll-fade-in');
        aboutContent.classList.add('scroll-fade-in-delay-1');
        scrollObserver.observe(aboutContent);
    }

    // Animate contact content
    const contactContent = document.querySelector('.contact-content');
    if (contactContent) {
        contactContent.classList.add('scroll-fade-in');
        scrollObserver.observe(contactContent);
    }

    // Animate contact buttons
    document.querySelectorAll('.contact-btn').forEach((btn, index) => {
        btn.classList.add('scroll-fade-in');
        btn.classList.add(`scroll-fade-in-delay-${(index % 3) + 1}`);
        scrollObserver.observe(btn);
    });
}

// Initialize animations when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderContactButtons();
        updateContent(currentPortfolio);
        initScrollAnimations();
        updateHeroTitleWrap();
        window.addEventListener('resize', updateHeroTitleWrap);
    });
} else {
    renderContactButtons();
    updateContent(currentPortfolio);
    initScrollAnimations();
    updateHeroTitleWrap();
    window.addEventListener('resize', updateHeroTitleWrap);
}


// Initialize label colors
leftLabel.style.color = 'var(--text-light)';
rightLabel.style.color = 'var(--accent-blue)';
rightLabel.style.transition = 'color var(--transition-speed) ease';
leftLabel.style.transition = 'color var(--transition-speed) ease';

// Add smooth transitions to content elements
[heroTitle, heroSubtitle, aboutContent, skillsContainer].forEach(el => {
    el.style.transition = 'opacity var(--transition-speed) ease';
});

