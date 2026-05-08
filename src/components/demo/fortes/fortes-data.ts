import { FORTES_DEMO_CONTACT_EMAIL, FORTES_ORIGIN } from "./fortes-constants";

const U = (path: string) => `${FORTES_ORIGIN}${path}`;

export const EXPERTISE_SLIDES = [
  {
    letter: "A",
    titleLines: ["Interior", "Rendering"] as const,
    href: `${FORTES_ORIGIN}/3d-interior-rendering-services/`,
    image: U("/wp-content/uploads/2025/11/AR-1.jpg"),
    alt: "Elegant living room with coffered ceiling, sofas, armchairs, and natural light.",
    video: null as string | null,
    description:
      "Complete creation of an interior that reflects your worldview. If you are an architect or real estate manager, you can make details to view the room for sale and meet prospective clients by showing them every element of the decor in impressive photorealism.",
  },
  {
    letter: "B",
    titleLines: ["Exterior", "Rendering"] as const,
    href: `${FORTES_ORIGIN}/3d-exterior-rendering-services/`,
    image: U("/wp-content/uploads/2025/09/1abb58c09f85e817d8ad4b4b7579e114aa0dfbb4-2.webp"),
    alt: "Modern high-rise apartment buildings with curved balconies against a blue sky.",
    video: null as string | null,
    description:
      "Previewing the exterior with the help of 3D visualization is extremely important because it can help identify deficiencies before construction begins. If there are certain nuances, they are much easier to detect and eliminate at the stage of creating a picture. All of the attention is focused on the details.",
  },
  {
    letter: "C",
    titleLines: ["Architectural", "Animation"] as const,
    href: `${FORTES_ORIGIN}/architectural-animation-services/`,
    image: null as string | null,
    video: U("/wp-content/uploads/2025/12/Convert_SkyPark_16_9_10mbit.mp4"),
    alt: "Architectural animation",
    description:
      "Due to architectural services you can present to customers a building that is still under renovation orconstruction. In this way, you will be able to look into the future, created based on your ideas!",
  },
  {
    letter: "D",
    titleLines: ["Brand", "Identity"] as const,
    href: `${FORTES_ORIGIN}/`,
    image: U("/wp-content/uploads/2025/08/Brand-Identity-1-1-e1769777703192.jpg"),
    alt: "Palm Beach branding: gray and olive green business cards on wood and stone textures.",
    video: null as string | null,
    description:
      "Expert brand identity design services combining visual identity, professional web design, and impactful print and digital media. From logo and brand guidelines to responsive websites and marketing materials, we make your business stand out, build trust, and clearly convey its value",
  },
  {
    letter: "E",
    titleLines: ["Website", "creation"] as const,
    href: `${FORTES_ORIGIN}/`,
    image: U("/wp-content/uploads/2025/09/Mockup-1.webp"),
    alt: "Laptop displaying Gardens Residences website, showcasing luxury apartments and pool.",
    video: null as string | null,
    description:
      "Custom web development for real estate companies and property developers. We build responsive websites with modern design, advanced property listings, and best quality content to attract qualified buyers, boost visibility, and deliver seamless digital experiences that convert visitors into loyal clients.",
  },
] as const;

export const VISUALIZE_ARCHITECTURE_TITLE = "We visualize architecture with intention.";
export const VISUALIZE_ARCHITECTURE_LEAD =
  "From 3D renders and animations to branding and web development - we help architects and developers tell stories that move projects forward.";

export const GALLERY_ROWS = [
  {
    cells: [
      {
        image: U("/wp-content/uploads/2025/09/e041437b3dff637a001ed3190e724a33aedde29e.webp"),
        alt: "Aerial view of a modern campus at sunset, showcasing green spaces and innovative architecture.",
        award: {
          src: U("/wp-content/uploads/2025/10/1.svg"),
          alt: "Architizer Vision Awards 2025 Finalist for Architecture + Environment.",
        },
        wrapperWidth: "832px",
      },
      {
        image: U("/wp-content/uploads/2025/10/af3bcc3fd25adb487604527d4cc7ee863cb158d0-1-1.jpg"),
        alt: "Couple enjoying ocean view from a luxury balcony with modern architecture at sunset.",
        wrapperWidth: "468px",
      },
    ],
  },
  {
    cells: [
      {
        image: U("/wp-content/uploads/2025/09/4a014011663dec08dac9b649eec69e8320ab65c1.jpg"),
        alt: "Modern bedroom with sliding glass doors opening to a private patio and plunge pool.",
        wrapperWidth: "357px",
      },
      {
        image: U("/wp-content/uploads/2025/09/7272fc842de3f50883603f0ac5f64720ceeaf9ee.jpg"),
        alt: "Modern kitchen island with four woven chairs, wood cabinets, and marble countertops.",
        award: {
          src: U("/wp-content/uploads/2025/12/Frame-1321319127.svg"),
          alt: "USA Property Awards ribbon for interior design, 2005-2006.",
        },
        wrapperWidth: "526px",
      },
      {
        image: U("/wp-content/uploads/2025/09/7cba78de3ba8ebf1c39f2e0a50f554b5a040ad0c.jpg"),
        alt: "Modern bedroom with city view, featuring a plush bed and comfortable seating.",
        wrapperWidth: "397px",
      },
    ],
  },
  {
    cells: [
      {
        image: U("/wp-content/uploads/2025/09/1805645d91c0150f13fcca4fe5e543e1fc867252.jpg"),
        alt: "Modern skyscraper and historic building on a city street at sunrise.",
        wrapperWidth: "468px",
      },
      {
        image: U("/wp-content/uploads/2025/10/5f2ced7efb73abd7f37f47179b1396cfc5a45b4f-1-1.jpg"),
        alt: "Modern house in a forest with sunlight filtering through the trees.",
        award: {
          src: U("/wp-content/uploads/2025/10/2.svg"),
          alt: "Architizer Vision Awards 2025, Rendering Artist of the Year Special Mention.",
        },
        wrapperWidth: "832px",
      },
    ],
  },
  {
    cells: [
      {
        image: U("/wp-content/uploads/2025/09/82512566f88e2c8e889b886fa4ec1e80d5b4d171.jpg"),
        alt: "Carlisle Bay Apartments entrance; couple arriving by car.",
        wrapperWidth: "600px",
      },
      {
        image: U("/wp-content/uploads/2025/08/5503a967df6d2962b158dfc56daaae6ca42411b3-1-1.jpg"),
        alt: "Modern apartment building with landscaped grounds and a couple strolling.",
        wrapperWidth: "340px",
      },
      {
        image: U("/wp-content/uploads/2025/09/5518544523c54378423410c22e5145faafa6b0cb.jpg"),
        alt: "Luxury home interior design with ocean view, featuring a modern bar and seating area.",
        wrapperWidth: "340px",
      },
    ],
  },
] as const;

export type FortesCaseStudyEntry = {
  readonly n: string;
  readonly title: string;
  readonly tags: string;
  readonly img: string;
  readonly href: string;
  readonly award?: { readonly src: string; readonly alt: string };
};

export const CASE_STUDIES: readonly FortesCaseStudyEntry[] = [
  {
    n: "001",
    title: "Idaho Y",
    tags: "architectural renderings, | 3d animation film",
    img: U("/wp-content/uploads/2025/08/5-3-1.jpg"),
    href: `${FORTES_ORIGIN}/case/3d-house-rendering-for-a-modern-real-estate-in-idaho-idaho-y/`,
    award: { src: U("/wp-content/uploads/2025/10/4-1.png"), alt: "Awards" },
  },
  {
    n: "002",
    title: "Garderns Residence",
    tags: "architectural renderings, | 3d animation film, brand packaging",
    img: U("/wp-content/uploads/2025/08/1-3-1.jpg"),
    href: `${FORTES_ORIGIN}/case/property-brand-packaging-for-a-park-like-urban-space-gardens/`,
  },
  {
    n: "003",
    title: "Expansion",
    tags: "architectural renderings |",
    img: U("/wp-content/uploads/2025/10/8aeb63719724689838e97173af62ae84bfbe0c81-1-2-1.jpg"),
    href: `${FORTES_ORIGIN}/case/expansion/`,
    award: { src: U("/wp-content/uploads/2025/10/3.svg"), alt: "Awards" },
  },
  {
    n: "004",
    title: "Palm Beach Residence",
    tags: "architectural renderings, | 3d animation film, brand packaging",
    img: U("/wp-content/uploads/2025/08/1-2-1.jpg"),
    href: `${FORTES_ORIGIN}/case/photorealistic-3d-rendering-for-a-luxury-apartment-complex-palm-beach/`,
  },
  {
    n: "005",
    title: "Caspian Dream Liner",
    tags: "architectural renderings, | 3d animation film, brand packaging",
    img: U("/wp-content/uploads/2025/08/2-1.jpg"),
    href: `${FORTES_ORIGIN}/case/hospitality-3d-rendering-for-a-futuristic-apart-hotel-caspian-dream-liner/`,
    award: { src: U("/wp-content/uploads/2025/08/2025-Vega-Digital-Awards-Platinum-Winner-2.png"), alt: "Awards" },
  },
  {
    n: "006",
    title: "Chalk Hill",
    tags: "architectural renderings |",
    img: U("/wp-content/uploads/2025/08/7-6-1.jpg"),
    href: `${FORTES_ORIGIN}/case/interior-and-exterior-3d-rendering-for-a-village-aesthetic-complex-in-california-chalk-hill/`,
  },
  {
    n: "007",
    title: "Palazzo Del Mare",
    tags: "architectural renderings, | 3d animation film, brand packaging",
    img: U("/wp-content/uploads/2025/08/7f15b678365cbcfbfb9172ec1deaa2f80b34ff94-1.jpg"),
    href: `${FORTES_ORIGIN}/case/3d-visualization-of-a-luxury-cinematic-apart-hotel-palazzo-del-mare/`,
    award: { src: U("/wp-content/uploads/2025/08/2025-NYX-Gold-Winner-1.png"), alt: "Awards" },
  },
  {
    n: "008",
    title: "Bluenest",
    tags: "architectural renderings, | 3d animation film, website development",
    img: U("/wp-content/uploads/2025/08/5-5-1.jpg"),
    href: `${FORTES_ORIGIN}/case/real-estate-3d-rendering-and-property-branding-for-a-development-firm-bluenest/`,
  },
  {
    n: "009",
    title: "Emerald Chateau",
    tags: "architectural renderings, | 3d animation film",
    img: U("/wp-content/uploads/2025/08/0068_Emerald-Chateau_Still03_Terrace_FIN-01_0001-1-1.jpg"),
    href: `${FORTES_ORIGIN}/case/3d-virtual-tours-for-a-classical-residence-emerald-chateau/`,
  },
];

export const TRUSTED_LOGOS = [
  U("/wp-content/uploads/2025/08/Vector.svg"),
  U("/wp-content/uploads/2025/08/XMLID_1_.svg"),
  U("/wp-content/uploads/2025/08/Group.svg"),
  U("/wp-content/uploads/2025/08/Group-2.svg"),
  U("/wp-content/uploads/2025/06/Vector.svg"),
  U("/wp-content/uploads/2025/06/Group.svg"),
  U("/wp-content/uploads/2025/06/Group-1321318659.svg"),
  U("/wp-content/uploads/2025/08/Group-3.svg"),
  U("/wp-content/uploads/2025/06/Group-1.svg"),
  U("/wp-content/uploads/2025/08/Group-1321319076.svg"),
  U("/wp-content/uploads/2025/06/Group-2.svg"),
  U("/wp-content/uploads/2025/06/Group-4.svg"),
  U("/wp-content/uploads/2025/06/x30_Uf7II.tif.svg"),
  U("/wp-content/uploads/2025/06/landscape-forms-logo.svg"),
  U("/wp-content/uploads/2025/06/Layer-1.svg"),
  U("/wp-content/uploads/2025/06/logo-2.svg"),
  U("/wp-content/uploads/2025/06/p62CAy.tif.svg"),
  U("/wp-content/uploads/2025/08/Pages.svg"),
] as const;

export const PIPELINE_INTRO = {
  title: "Your 3D rendering project pipeline",
  subtitle:
    "Keep track of your project's progress through the following stages:",
} as const;

export const PIPELINE_STEPS = [
  "Once we receive all the necessary project information, we review the | scope, define the goals, align on expectations, and assign a dedicated | team. A clear timeline is also established at this stage.",
  "We either create a new 3D model or optimize an existing one. | Based on your input, we produce a draft preview that reflects the overall concept. | You provide feedback on three main aspects before we proceed further.",
  "AI Reference is a key part of our workflow. It helps visualize the intended | atmosphere and style early on, ensuring that the final result aligns with | the desired mood and direction.",
  "The updated version reflects previous corrections and enhances the visual accuracy. | This step ensures the image is even closer to the final approved design.",
  "We complete a final quality check to confirm all visual and technical standards are met. | The deliverables are then shared in the agreed resolution, format, and file type, ready for use.",
] as const;

export const PIPELINE_IMAGES = [
  U("/wp-content/uploads/2025/08/1-ds-1.jpg"),
  U("/wp-content/uploads/2025/08/2-gf-1.jpg"),
  U("/wp-content/uploads/2025/08/3-ai-1.jpg"),
  U("/wp-content/uploads/2025/08/4-preview-1.jpg"),
  U("/wp-content/uploads/2025/08/5-final-1.jpg"),
] as const;

export const FAQ_ITEMS = [
  {
    q: "How much does 3D architectural rendering cost?",
    a: `Let's look at an example on the exterior:
You only have drawings in digital format and an understanding of the overall concept.
You need to make two angles (front and back).
The cost of such a project is USD 2200, taking into account the modeling stage.

Let's look at an example in the interior:
You only have drawings in digital format and an understanding of the overall concept.
You need:
- 1 view of the bathroom
- 1 foreshortening master bedroom
- 1 angle kitchen-living room
The cost of such a project is from 2100 USD, taking into account the modeling stage.
These prices assume three pools of edits for each image.`,
  },
  {
    q: "How long does a 3D rendering take?",
    a: "It usually takes 7–10 days for the interior picture and 12–15 days for the exterior picture. However, it all depends on the situation and complexity, so we invite you to an individual consultation.",
  },
  {
    q: "How do you make renders look realistic?",
    a: "To make renders look realistic, we use modern digital technologies; the main ones are 3ds Max, FStorm, Unreal Engine 5, and Matte Painting. Certainly, the program is a secondary story, and the lion’s share is the experience and competence of the team.",
  },
  {
    q: "What architectural rendering software do we use?",
    a: `Our render studio uses a wide range of modern software, which allows you to implement a project of any complexity.

Our core rendering software:
- 3ds Max
- Corona
- Fstorm
- V-Ray
- Photoshop
- Revit
- Unreal Engine 5`,
  },
  {
    q: "What makes a good rendering?",
    a: "“The key to an impressive image is not only technical skills but also a sense of mood and emotion. It is important to relive the story that is in the image and if you have felt and experienced the image is doomed to success,” Nikita Skulinets, ART DIRECTOR.",
  },
  {
    q: "What is architectural 3D rendering?",
    a: "Architectural rendering is the process of creating three-dimensional images of a proposed architectural design. The point is to enable the client to see the future design of the building or space in the brightest and smallest details. These are exactly the services that we provide - architectural visualization services.",
  },
  {
    q: "What does a 3D rendering artist do?",
    a: "Our 3D artist is a person with a well-developed spatial vision and taste who knows the technical aspects and can make your picture juicy. These skills combined with the knowledge of modern visualization programs guarantee an impressive result (also using a little magic).",
  },
  {
    q: "What do I need to get started?",
    a: `We can start working on a project even if you have nothing but your idea.
It would be great, however, if you have drawings or 3D models in digital format, references, and mood boards. This will help us achieve the desired goal and high-quality results faster.`,
  },
  {
    q: "What are the benefits of architectural rendering?",
    a: `1. Relevance and competitiveness
2. Incredible portfolio
3. Internet presence
4. Ease of transfer of ideas and points of view`,
  },
  {
    q: "What Is the 3D rendering process in Fortes Vision?",
    a: `The algorithm is as follows:
1. You provide us with the plans and necessary materials.
2. We do clay visualization and AI preview for your confirmation.
3. We offer three editing options.
4. You receive the final image in high resolution.`,
  },
  {
    q: "What rendering options do I have?",
    a: `Our rendering studio provides 3D rendering services like:
- Interior rendering
- Exterior rendering
- Floor plan rendering
- House rendering
- Landscape rendering
- Commercial 3D rendering
- 3D Site and Plot Plan rendering
And 3D animation services like:
- Architectural animation
- 3D walkthrough services.`,
  },
  {
    q: "How can I get best possible results?",
    a: `To get the best results you should trust us because we develop a project plan that optimizes all of the processes and minimizes the possibility of breaking the deadline. The development process is controlled.
We always keep in touch with the client, so you are aware of all the processes. However, at the same time, we expect from the client the same involvement in the project and fast feedback because we are a team together with you.
Choose a professional architectural visualization studio - Choose Fortes Vision.
Working with our company is guaranteed to get the best result because of our 3D rendering services and photorealistic rendering services - it is a mixture of successful projects and a team of professionals in our 3D rendering studio.`,
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Christie Tyreus",
    company: "Tyreus Architecture + Design",
    text: "Fantastic team to work with, great execution, and clear communication. They understand how to clarify and incorporate our stylistic preferences and have great intuition around what makes a compelling image.",
    date: "Jun 13, 2025",
  },
  {
    name: "Marlin Torres",
    company: "Pandiscio Green",
    text: "It was such a pleasure collaborating with Fortes Vision. The team delivered beautiful visuals that effortlessly adhered to our project schedule. Their creative expertise, attention to detail, and flexibility was a critical part of the project's success.",
    date: "Jun 15, 2025",
  },
  {
    name: "Masoud Akbarzadeh",
    company: "Professor of University of Pensilvania",
    text: "I have worked with Fortes.Vision on multiple projects and the results were excellent! I have had a very good experience working with their team. They always surprised me with their work quality and work ethics. It is fun to work with them too! Strongly recommend them!",
    date: "Jun 3, 2025",
  },
  {
    name: "Russell Holthouse",
    company: "Vantage Design Group",
    text: "Vantage has collaborated with Fortes Vision on five projects so far—and we’re looking forward to many more. Their architectural imagery has consistently elevated our presentation work and helped communicate our ideas with clarity. I particularly value their attention to detail, reliability, and consistently excellent communication. I would highly recommend Fortes Vision to anyone seeking top-tier rendering and architectural visualization services.",
    date: "Jun 21, 2025",
  },
  {
    name: "Luke Long",
    company: "Kenet Lawson",
    text: "The smooth back and force process I liked working with project manager Anya. She was always in touch and kept me informed about every step on the way. She made it simple for me. Even discussing edits and making changes was smooth and easy because of her clarifications and examples. On top of that, no other studio ever gave me 6 images of a \"deeper orange\" to choose from, but Anya did and provided the best experience I've ever had with an outsourced architectural visualization studio. They took into account all my wishes and even came up with the ideas.",
    date: "Oct 20, 2023",
  },
  {
    name: "Dale Tucker",
    company: "O X Y V I B",
    text: "Amazing work I was impressed by how much the images changed after the final integration of people. For me, it turned the renders into real photos of the project and inspired me for several ideas for interior renovation. The integrated people were part of the concept, not just loafing around, they were communicating, working, doing something, and it looked super organic. It was also super cool that there was no payment for each person and the payments didn't distract from the process.",
    date: "Oct 24, 2023",
  },
  {
    name: "STUDIO.BNA",
    company: "Architects",
    text: "The FORTES team is exceptional in every way. On behalf of our entire studio team, working with the exceptionally talented and brilliant team at FORTES.VISION for the past two months has been a highlight for our studio. Their creative talent is coupled with genuinely exceptional people. Their process is rigorous, organized, precise, thoughtful, and versatile. Our experience working with the team has been truly phenomenal, and our clients' response has been of the highest regard and appreciation. Not only have we found our go-to visualization team in FORTES, we also feel we have found new friends and colleagues who we trust and who bring their ideas and unique creative vision to the table making the project even better. We look forward to a long relationship with FORTES.VISION and recommend them without reservation to anyone looking for the best talent and skill-set to realize your projects. STUDIO.BNA architects Athens, Georgia, USA",
    date: "Nov 17, 2023",
  },
] as const;

/**
 * Approach + read-more SEO block (static copy from fortes.vision).
 * `readMoreParagraphInnerHtml` is trusted static HTML for `dangerouslySetInnerHTML` only.
 */
export const SEO_SECTION = {
  approachHeadingTop: ["Our", "approach"] as const,
  approachMiddle: "to 3D",
  approachHeadingBottom: ["rendering", "services"] as const,
  approachImageAlt:
    "Modern home with pool and deck, showcasing sleek architecture and serene landscaping.",
  introColumns: [
    "Fortes Vision is a 3D rendering company that delivers high-quality 3D visualization and photorealistic architectural renderings for clients who expect precision and impact. We work with advanced technology and professional design standards to ensure every visual communicates value, realism, and a strong emotional impression. Our 3D visualization and CGI solutions accurately recreate future buildings, interiors, and exteriors, helping you present ideas with clarity and confidence. With speed, quality, and artistic accuracy, Fortes Vision provides visuals that feel alive and make your projects stand out in a competitive market.",
    "Our goal is to help you experience your future project in every detail through photorealistic 3D visualization. As a professional 3D rendering agency, we have been delivering high-quality architectural rendering and visualization solutions for over seven years. By combining advanced 3D rendering techniques with artistic precision, our architectural visualization studio creates visuals that meet the highest aesthetic expectations. We work closely with each client, carefully considering every requirement to ensure each project is unique, accurate, and visually compelling. Our 3D rendering studio brings together experienced specialists in 3D architectural visualization, delivering reliable results for a wide range of architectural projects and earning the trust of satisfied clients worldwide.",
  ] as const,
  readMoreTitle: ["3D Rendering Company", "that bring architectural concepts to life."] as const,
  readMoreParagraphInnerHtml: [
    "In today’s architectural and real estate landscape, visual clarity defines success. Developers, architects, and investors rely on precise, photorealistic imagery to understand projects long before construction begins. This growing demand for realism and accuracy is exactly why Fortes Vision has earned its reputation as a professional <strong>3D rendering agency</strong> and <strong>3D rendering studio</strong> supporting projects across the United States and international markets.",
    "We focus on <strong>architectural visualization</strong> and <strong>3D architectural rendering</strong>, helping teams translate technical drawings and design concepts into compelling visual narratives. Our work enables faster approvals, clearer communication between stakeholders, and stronger emotional engagement with future buyers. Every visualization is designed to explain space, materials, lighting, and atmosphere with realism that feels tangible rather than conceptual.",
    "As one of the experienced <strong>3D rendering companies</strong> in the architectural visualization space, Fortes Vision combines artistic sensibility with engineering-level precision. Our specialists build clean geometry, physically accurate lighting, and carefully balanced compositions that reflect real-world conditions. This approach ensures that each image works not only as a marketing asset but also as a practical decision-making tool for architects, developers, and investors.",
    "We collaborate closely with design studios and development teams, adapting our workflow to each project’s stage – from early concept visualization to presentation-ready imagery for sales and investor decks. This flexibility has positioned us among reliable <strong>architectural visualization companies</strong> delivering consistent quality across residential, commercial, and mixed-use developments.",
    "Unlike many <strong>architectural rendering companies</strong> that operate purely as production vendors, Fortes Vision acts as a creative partner. We help shape how projects are perceived, guiding visual direction to align with branding goals, target audiences, and commercial objectives. Our visuals are built to communicate intent clearly, reduce uncertainty, and support confident project progression.",
    "From large-scale real estate developments to boutique interior concepts, our studio supports projects of any complexity. Clients choose Fortes Vision for accuracy, consistency, and a strategic approach to visualization – not simply for attractive images, but for visuals that drive real outcomes.",
    'If you’re looking for execution-focused production workflows and detailed deliverables, explore our dedicated <a href="https://fortes.vision/services/" target="_blank" rel="noopener noreferrer">3D Rendering Services</a> to learn more about our full technical process and visualization capabilities.',
    "With a proven portfolio and long-term client partnerships, Fortes Vision continues to stand out among global <strong>3D rendering companies</strong>. When precision, aesthetics, and reliability matter, we deliver visual experiences that build trust, attract buyers, and move projects forward with confidence.",
  ] as const,
} as const;

export const FORTES_CONTACT_TITLE_SPLIT = "Let’s create your | new project together" as const;

/** Footer columns, contact, and social links (paths via `FORTES_ORIGIN`). */
export const FORTES_FOOTER = {
  menu: [
    { href: U("/3d-rendering-portfolio/"), label: "Works" },
    { href: U("/about-us/"), label: "Studio" },
    { href: U("/blog/"), label: "Blog" },
  ] as const,
  services: [
    { href: U("/3d-exterior-rendering-services/"), label: "3D Exterior Rendering Services" },
    { href: U("/3d-interior-rendering-services/"), label: "3D Interior Rendering Services" },
    { href: U("/3d-floor-plan-rendering-services/"), label: "3D Floor Plan Rendering Services" },
    { href: U("/3d-restaurant-rendering-services/"), label: "3D Restaurant Rendering Services" },
    { href: U("/3d-house-rendering-services/"), label: "3D House Rendering Services" },
    { href: U("/3d-virtual-tour-services/"), label: "3D Virtual Tour Services" },
    { href: U("/architectural-animation-services/"), label: "3D Architectural Animation Services" },
  ] as const,
  email: FORTES_DEMO_CONTACT_EMAIL,
  phoneDisplay: "+1 (929) 547 74 73",
  phoneTel: "+19295477473",
  address: `Primary Office |\nUS, New York NY 10016, 347 5th Ave Suite 1402-374 ||\n\nBranch Office |\nUS, Delaware DE 19901, 8 The Green, |\nSuite Rin the City of Dover`,
  social: [
    { href: "https://www.linkedin.com/company/fortesvision/", label: "LinkedIn" },
    { href: "https://www.instagram.com/fortes.vision/", label: "Instagram" },
  ] as const,
} as const;
