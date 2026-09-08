import { useState, useEffect, useRef, useCallback } from 'react';
import './portfolio.css';
const GITHUB_RAW = 'https://raw.githubusercontent.com/bgiShashank/Shashank.Works/main';
/** Local media URLs. encodeURI keeps spaces in filenames valid (e.g. "image (1).jpg"). */
function media(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return encodeURI(normalized);
}
const portfolioData = {
  web: {

[17 lines collapsed]

    projects: [
      {
        name: 'Moodify',
        image: `${GITHUB_RAW}/Tech_Projects/Moodify_Logo.png`,
        image: `/Tech_Projects/Moodify_Logo.png`,
        link: 'https://moodify-eight-red.vercel.app/',
        description: 'Mood-Based Music & Wallpaper Recommendation Web App',
        techStack: ['HTML', 'CSS', 'JavaScript', 'JioSaavn API'],

[7 lines collapsed]

      },
      {
        name: 'India Hunters',
        image: `${GITHUB_RAW}/Tech_Projects/India_Hunters.png`,
        image: `/Tech_Projects/India_Hunters.png`,
        link: 'https://india-hunters.vercel.app/',
        description: 'BGMI Tournament Registration & Management Platform',
        techStack: ['HTML', 'CSS', 'JavaScript'],

[24 lines collapsed]

    ],
    work: {
      logos: [
        `${GITHUB_RAW}/Editor_Work/Logos/image (1).jpg`,
        `${GITHUB_RAW}/Editor_Work/Logos/image (2).jpg`,
        `${GITHUB_RAW}/Editor_Work/Logos/IMG_20251016_014938.png`,
        `${GITHUB_RAW}/Editor_Work/Logos/Picsart_25-11-04_16-13-13-587.jpg`,
        `${GITHUB_RAW}/Editor_Work/Logos/SkyClub_Logo_.png`,
        `${GITHUB_RAW}/Editor_Work/Logos/V7ZlUi4aHTyns4Do.png`,
        `/Editor_Work/Logos/image (1).jpg`,
        `/Editor_Work/Logos/image (2).jpg`,
        `/Editor_Work/Logos/IMG_20251016_014938.png`,
        `/Editor_Work/Logos/Picsart_25-11-04_16-13-13-587.jpg`,
        `/Editor_Work/Logos/SkyClub_Logo_.png`,
        `/Editor_Work/Logos/V7ZlUi4aHTyns4Do.png`,
      ],
      banners: [
        `${GITHUB_RAW}/Editor_Work/Banners/Freelance 2.png`,
        `${GITHUB_RAW}/Editor_Work/Banners/Freelance.png`,
        `${GITHUB_RAW}/Editor_Work/Banners/IMG_20251104_131418.png`,
        `${GITHUB_RAW}/Editor_Work/Banners/Picsart_25-11-03_13-30-55-420.jpg`,
        `${GITHUB_RAW}/Editor_Work/Banners/Royal_Fortune_Casino_Banner.jpg`,
        `${GITHUB_RAW}/Editor_Work/Banners/TopGaming_Banner.jpg`,
        `/Editor_Work/Banners/Freelance 2.png`,
        `/Editor_Work/Banners/Freelance.png`,
        `/Editor_Work/Banners/IMG_20251104_131418.png`,
        `/Editor_Work/Banners/Picsart_25-11-03_13-30-55-420.jpg`,
        `/Editor_Work/Banners/Royal_Fortune_Casino_Banner.jpg`,
        `/Editor_Work/Banners/TopGaming_Banner.jpg`,
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
        `/Editor_Work/Thumbnails/Marry_Christmas_Wizzer_Thmbnl.jpg`,
        `/Editor_Work/Thumbnails/Picsart_25-02-17_14-27-52-884.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0001.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0002.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0003.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0004.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0005.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0006.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0007.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0008.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0010.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0011.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0014.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0015.jpg`,
        `/Editor_Work/Thumbnails/DOC-20251128-WA0017.jpg`,
        `/Editor_Work/Thumbnails/IMG_20251018_202111.png`,
        `/Editor_Work/Thumbnails/IMG_20251129_200049.png`,
        `/Editor_Work/Thumbnails/Picsart_24-10-15_11-17-31-129.jpg`,
        `/Editor_Work/Thumbnails/Picsart_24-10-21_18-13-12-181.jpg`,
        `/Editor_Work/Thumbnails/Picsart_24-11-15_09-18-32-125.jpg`,
        `/Editor_Work/Thumbnails/Picsart_24-11-16_18-29-37-429.jpg`,
        `/Editor_Work/Thumbnails/Picsart_25-07-13_15-00-06-268.jpg`,
        `/Editor_Work/Thumbnails/Picsart_25-07-13_15-31-00-535.jpg`,
        `/Editor_Work/Thumbnails/Picsart_25-09-12_18-24-17-781.jpg`,
        `/Editor_Work/Thumbnails/Picsart_25-09-19_21-37-27-139.jpg`,
        `/Editor_Work/Thumbnails/Picsart_25-10-11_21-11-38-457.jpg`,
        `/Editor_Work/Thumbnails/Picsart_25-11-11_15-14-06-462.jpg`,
        `/Editor_Work/Thumbnails/Picsart_25-11-11_15-49-07-211.jpg`,
        `/Editor_Work/Thumbnails/SAVE_20241203_134210.jpg`,
      ],
      // YouTube video categories
      // isShort: true  → 9:16 vertical player (YouTube Shorts)

[41 lines collapsed]

  { key: 'pr', name: 'Adobe Premiere Pro', label: 'Pr' },
  { key: 'ae', name: 'Adobe After Effects', label: 'Ae' },
  { key: 'ps', name: 'Adobe Photoshop', label: 'Ps' },
  { key: 'capcut', name: 'CapCut', icon: `${GITHUB_RAW}/Images/CapCut_Logo.png` },
  { key: 'picsart', name: 'Picsart', icon: `${GITHUB_RAW}/Images/PicsArt_Logo.png` },
  { key: 'capcut', name: 'CapCut', icon: `/Images/CapCut_Logo.png` },
  { key: 'picsart', name: 'Picsart', icon: `/Images/PicsArt_Logo.png` },
];
const iconMap: Record<string, string> = {
  'Email Me': `${GITHUB_RAW}/Images/email.svg`,
  LinkedIn: `${GITHUB_RAW}/Images/linkedin.svg`,
  GitHub: `${GITHUB_RAW}/Images/Github_logo.png`,
  Instagram: `${GITHUB_RAW}/Images/Instagram_logo.png`,
  Fiverr: `${GITHUB_RAW}/Images/Fiverr_logo.png`,
  Freelancer: `${GITHUB_RAW}/Images/Freelancer_logo.png`,
  'Email Me': `/Images/email.svg`,
  LinkedIn: `/Images/linkedin.svg`,
  GitHub: `/Images/Github_logo.png`,
  Instagram: `/Images/Instagram_logo.png`,
  Fiverr: `/Images/Fiverr_logo.png`,
  Freelancer: `/Images/Freelancer_logo.png`,
};
// ---------- Lightbox ----------

[36 lines collapsed]

      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="lightbox-content">
        <img src={src} alt={`Work image ${state.index + 1}`} className="lightbox-image" />
        <img src={media(src)} alt={`Work image ${state.index + 1}`} className="lightbox-image" />
        <button className="lightbox-close" onClick={onClose}>✕</button>
        <button className="lightbox-prev" onClick={() => onNavigate(-1)}>‹</button>
        <button className="lightbox-next" onClick={() => onNavigate(1)}>›</button>

[154 lines collapsed]

  return (
    <div className="work-item" ref={ref} onClick={onClick}>
      <img src={src} alt={alt} className="work-image" loading="lazy" />
      <img src={media(src)} alt={alt} className="work-image" loading="lazy" />
    </div>
  );
}

[166 lines collapsed]

          <div className="profile-container">
            <div className="profile-image-wrapper">
              <img
                src={`${GITHUB_RAW}/Images/Tech_Profile_Pic.png`}
                src={media('/Images/Tech_Profile_Pic.png')}
                alt="Web Developer Profile"
                className={`profile-image${isWeb ? ' active' : ''}`}
                id="profile-web"
