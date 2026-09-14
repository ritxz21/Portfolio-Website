// ═══════════════════════════════════════════════════════════════
// Everything personal about the site lives here.
// Change your tagline, links or stats in this one file — the
// header, footer and landing page all read from it.
// ═══════════════════════════════════════════════════════════════

export const site = {
  name: "Ritika Chatterjee",
  role: "Data Scientist & AI Engineer",
  greeting: "hello there :)",

  tagline:
    "MS Data Science at Columbia. I build agentic AI systems, retrieval pipelines, and the data plumbing underneath them.",

  email: "rc3828@columbia.edu",

  links: {
    github: "https://github.com/ritxz21",
    linkedin: "https://linkedin.com/in/ritika-chatterjee21",
    // Drop your PDF at public/resume.pdf and this works.
    resume: "/resume.pdf",
  },

  // The count-up tiles on the landing page.
  // `note` is the small handwritten annotation underneath.
  stats: [
    { value: 4, label: "Internships", note: "and counting" },
    { value: 2, label: "Hackathons won", note: "nationwide" },
    { value: 1, label: "Publication", note: "IJARIIE, 2024" },
    { value: 9, label: "Things built", note: "all documented here" },
  ],
};
