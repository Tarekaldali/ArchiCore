import type { Project } from '@/types'

export const seedProjects: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Azure Cliff Residence',
    slug: 'azure-cliff-residence',
    description: 'A stunning cantilevered home perched on coastal cliffs with panoramic ocean views.',
    fullDescription: `The Azure Cliff Residence represents the pinnacle of modern coastal architecture. Perched dramatically on the rocky cliffs of Malibu, this 4,500 square foot home defies gravity with its bold cantilever extending over the Pacific Ocean.

The design philosophy centers on erasing the boundary between interior and exterior spaces. Floor-to-ceiling windows wrap the entire ocean-facing facade, creating an immersive experience where residents feel suspended above the waves.

Sustainable materials including reclaimed teak, locally-sourced limestone, and recycled steel form the structural backbone. The green roof system captures rainwater for irrigation, while passive solar design minimizes energy consumption year-round.`,
    category: 'residential',
    images: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80', publicId: 'azure-1', alt: 'Azure Cliff Residence - Exterior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', publicId: 'azure-2', alt: 'Azure Cliff Residence - Living Room', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', publicId: 'azure-3', alt: 'Azure Cliff Residence - Kitchen', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80', publicId: 'azure-4', alt: 'Azure Cliff Residence - Bedroom', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', publicId: 'azure-5', alt: 'Azure Cliff Residence - Pool', isPrimary: false },
    ],
    location: { city: 'Malibu', country: 'USA' },
    architect: 'Marcus Chen',
    team: ['Sarah Walsh', 'James Rivera'],
    year: 2024,
    area: 420,
    tags: ['coastal', 'sustainable', 'cantilever', 'luxury', 'modern'],
    featured: true,
    status: 'published'
  },
  {
    title: 'Vertex Tower',
    slug: 'vertex-tower',
    description: 'A 45-story mixed-use skyscraper redefining urban density with sustainable design.',
    fullDescription: `Vertex Tower stands as Singapore's newest landmark, a 45-story mixed-use development that reimagines what sustainable urban density can achieve.

The building's distinctive twisted form is not merely aesthetic—it's engineered to reduce wind loads by 24% while maximizing natural ventilation to upper floors. The parametric facade system adjusts shading automatically based on sun position.

Lower floors house a vibrant retail podium and co-working spaces, transitioning to premium office space in the mid-levels. The upper third comprises luxury residences with unobstructed views of Marina Bay.`,
    category: 'commercial',
    images: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80', publicId: 'vertex-1', alt: 'Vertex Tower - Exterior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=1200&q=80', publicId: 'vertex-2', alt: 'Vertex Tower - Lobby', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80', publicId: 'vertex-3', alt: 'Vertex Tower - Office', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', publicId: 'vertex-4', alt: 'Vertex Tower - Sky Garden', isPrimary: false },
    ],
    location: { city: 'Singapore', country: 'Singapore' },
    architect: 'David Okonkwo',
    team: ['Lisa Chang', 'Michael Torres'],
    year: 2023,
    area: 85000,
    tags: ['high-rise', 'sustainable', 'mixed-use', 'parametric', 'iconic'],
    featured: true,
    status: 'published'
  },
  {
    title: 'Minimalist Penthouse',
    slug: 'minimalist-penthouse',
    description: 'A 3,000 sq ft penthouse celebrating negative space and natural light.',
    fullDescription: `Located atop one of Tokyo's most prestigious residential towers, this penthouse embodies the Japanese philosophy of "Ma"—the purposeful use of negative space.

Every element has been carefully considered and edited. The open floor plan features just four pieces of custom furniture, each designed specifically for this space. Floor-to-ceiling windows on three sides flood the space with natural light.

The material palette is deliberately restrained: Hinoki cypress, white plaster, and blackened steel. A single Isamu Noguchi light sculpture serves as the living area's focal point.`,
    category: 'interior',
    images: [
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', publicId: 'penthouse-1', alt: 'Minimalist Penthouse - Living', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80', publicId: 'penthouse-2', alt: 'Minimalist Penthouse - Kitchen', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80', publicId: 'penthouse-3', alt: 'Minimalist Penthouse - Bedroom', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80', publicId: 'penthouse-4', alt: 'Minimalist Penthouse - Bathroom', isPrimary: false },
    ],
    location: { city: 'Tokyo', country: 'Japan' },
    architect: 'Yuki Tanaka',
    team: ['Kenji Yamamoto'],
    year: 2024,
    area: 280,
    tags: ['minimalist', 'japanese', 'luxury', 'penthouse', 'zen'],
    featured: true,
    status: 'published'
  },
  {
    title: 'Garden District Masterplan',
    slug: 'garden-district-masterplan',
    description: 'A 50-acre urban renewal project emphasizing green corridors and community spaces.',
    fullDescription: `The Garden District Masterplan transforms a former industrial zone into Melbourne's most livable neighborhood. This 50-acre development prioritizes pedestrians and cyclists, with a network of interconnected parks and plazas.

Central to the design is the Green Spine—a kilometer-long linear park that serves as the district's heart. Native plantings support local biodiversity while providing natural cooling and stormwater management.

Buildings are arranged to maximize solar access and natural ventilation, reducing reliance on mechanical systems by up to 40%.`,
    category: 'urban',
    images: [
      { url: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1200&q=80', publicId: 'garden-1', alt: 'Garden District - Aerial', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80', publicId: 'garden-2', alt: 'Garden District - Street View', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80', publicId: 'garden-3', alt: 'Garden District - Park', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80', publicId: 'garden-4', alt: 'Garden District - Night', isPrimary: false },
    ],
    location: { city: 'Melbourne', country: 'Australia' },
    architect: 'James Rivera',
    team: ['Elena Rodriguez', 'Tom Baker'],
    year: 2023,
    area: 202000,
    tags: ['masterplan', 'sustainable', 'urban-renewal', 'green-infrastructure'],
    featured: false,
    status: 'published'
  },
  {
    title: 'Coastal Retreat',
    slug: 'coastal-retreat',
    description: 'A serene beachfront villa blending indoor and outdoor living seamlessly.',
    fullDescription: `Nestled among the dunes of Byron Bay, the Coastal Retreat is a sanctuary where architecture dissolves into landscape. The design responds to the site's unique conditions—the building curves to embrace ocean breezes while providing shelter from prevailing winds.

Extensive use of local hardwoods and natural stone creates a material palette that ages gracefully alongside the coastal environment. Retractable glass walls transform the living spaces into covered outdoor rooms.

The infinity pool appears to merge with the ocean beyond, while native coastal plantings restore dune ecology disturbed by previous development.`,
    category: 'residential',
    images: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', publicId: 'coastal-1', alt: 'Coastal Retreat - Exterior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80', publicId: 'coastal-2', alt: 'Coastal Retreat - Interior', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200&q=80', publicId: 'coastal-3', alt: 'Coastal Retreat - Pool', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80', publicId: 'coastal-4', alt: 'Coastal Retreat - Bedroom', isPrimary: false },
    ],
    location: { city: 'Byron Bay', country: 'Australia' },
    architect: 'Sarah Walsh',
    team: ['Marcus Chen'],
    year: 2024,
    area: 350,
    tags: ['beachfront', 'sustainable', 'indoor-outdoor', 'luxury'],
    featured: false,
    status: 'published'
  },
  {
    title: 'Innovation Hub',
    slug: 'innovation-hub',
    description: 'A cutting-edge tech campus designed to foster creativity and collaboration.',
    fullDescription: `The Innovation Hub reimagines the corporate campus for the age of flexible work. Rather than enclosed offices, the complex offers a variety of work environments—from quiet focus pods to lively collaboration zones.

The building's distinctive undulating roof creates varied ceiling heights that subtly influence behavior—higher ceilings over social spaces, more intimate proportions for concentrated work.

A central atrium hosts weekly all-hands meetings and moonlights as an event space for the broader tech community.`,
    category: 'commercial',
    images: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', publicId: 'hub-1', alt: 'Innovation Hub - Exterior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80', publicId: 'hub-2', alt: 'Innovation Hub - Atrium', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80', publicId: 'hub-3', alt: 'Innovation Hub - Workspace', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&q=80', publicId: 'hub-4', alt: 'Innovation Hub - Lounge', isPrimary: false },
    ],
    location: { city: 'San Francisco', country: 'USA' },
    architect: 'David Okonkwo',
    team: ['Sarah Walsh', 'Elena Rodriguez'],
    year: 2023,
    area: 25000,
    tags: ['tech', 'campus', 'flexible-work', 'community'],
    featured: false,
    status: 'published'
  },
  {
    title: 'Art Gallery Renovation',
    slug: 'art-gallery-renovation',
    description: 'A historic gallery transformed with modern interventions respecting its heritage.',
    fullDescription: `The Art Gallery Renovation demonstrates how contemporary design can enhance rather than compete with heritage architecture. Our intervention preserves the Victorian gallery's ornate plasterwork while introducing modern climate control and lighting systems.

A new glazed extension provides flexible exhibition space that can be reconfigured for installations of any scale. The extension's minimal steel structure and frameless glazing create a transparent volume that defers to the original building.

Natural light is carefully controlled through motorized louvers and diffusing layers, protecting sensitive works while maintaining connection to the outside world.`,
    category: 'interior',
    images: [
      { url: 'https://images.unsplash.com/photo-1577720643272-265f09367456?w=1200&q=80', publicId: 'gallery-1', alt: 'Art Gallery - Main Hall', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&q=80', publicId: 'gallery-2', alt: 'Art Gallery - Exhibition', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&q=80', publicId: 'gallery-3', alt: 'Art Gallery - Detail', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=1200&q=80', publicId: 'gallery-4', alt: 'Art Gallery - Entrance', isPrimary: false },
    ],
    location: { city: 'London', country: 'UK' },
    architect: 'Elena Rodriguez',
    team: ['Yuki Tanaka'],
    year: 2022,
    area: 3500,
    tags: ['heritage', 'cultural', 'renovation', 'museum'],
    featured: false,
    status: 'published'
  },
  {
    title: 'Waterfront Promenade',
    slug: 'waterfront-promenade',
    description: 'A vibrant public space connecting the city to its waterfront heritage.',
    fullDescription: `The Waterfront Promenade transforms Copenhagen's former industrial harbor into a democratic public realm. The 2-kilometer intervention stitches together previously disconnected neighborhoods while celebrating the site's maritime history.

Repurposed shipping containers serve as pop-up cafes and community workshops, adding activity throughout the day and seasons. The promenade's dramatic timber decking features integrated seating terraces that step down to the water's edge.

Swimming areas, kayak launches, and fishing platforms invite direct engagement with the harbor waters, now cleaner than they've been in a century.`,
    category: 'urban',
    images: [
      { url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80', publicId: 'waterfront-1', alt: 'Waterfront Promenade - Overview', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', publicId: 'waterfront-2', alt: 'Waterfront Promenade - Deck', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', publicId: 'waterfront-3', alt: 'Waterfront Promenade - Night', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80', publicId: 'waterfront-4', alt: 'Waterfront Promenade - Activity', isPrimary: false },
    ],
    location: { city: 'Copenhagen', country: 'Denmark' },
    architect: 'James Rivera',
    team: ['Tom Baker', 'Anna Nielsen'],
    year: 2023,
    area: 45000,
    tags: ['public-space', 'waterfront', 'urban-design', 'community'],
    featured: false,
    status: 'published'
  },
  {
    title: 'Mountain Sanctuary',
    slug: 'mountain-sanctuary',
    description: 'A luxury retreat nestled in the mountains with floor-to-ceiling alpine views.',
    fullDescription: `Mountain Sanctuary is a private residence that celebrates its dramatic alpine setting. The home's low-slung profile minimizes visual impact from the valley below while maximizing mountain panoramas from within.

The structural system uses locally-sourced timber and stone, with massive fireplace walls providing thermal mass that moderates temperature swings between day and night.

Triple-glazed windows frame specific views—a waterfall to the east, the ski runs to the north—turning the landscape into a constantly changing artwork.`,
    category: 'residential',
    images: [
      { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80', publicId: 'mountain-1', alt: 'Mountain Sanctuary - Exterior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80', publicId: 'mountain-2', alt: 'Mountain Sanctuary - Living', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?w=1200&q=80', publicId: 'mountain-3', alt: 'Mountain Sanctuary - Fireplace', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80', publicId: 'mountain-4', alt: 'Mountain Sanctuary - View', isPrimary: false },
    ],
    location: { city: 'Aspen', country: 'USA' },
    architect: 'Marcus Chen',
    team: ['Sarah Walsh'],
    year: 2024,
    area: 480,
    tags: ['mountain', 'luxury', 'sustainable', 'alpine'],
    featured: false,
    status: 'published'
  },
  {
    title: 'Boutique Hotel NOIR',
    slug: 'boutique-hotel-noir',
    description: 'A 32-room boutique hotel that redefines luxury hospitality with moody elegance.',
    fullDescription: `Boutique Hotel NOIR occupies a converted 1920s warehouse, transforming industrial heritage into intimate luxury. The design embraces darkness—rich blacks, deep blues, and warm brass create spaces that feel mysterious yet welcoming.

Each of the 32 rooms is uniquely configured around existing industrial features like exposed brick, timber beams, and factory windows. Custom furniture by local artisans ensures no two spaces are alike.

The basement bar, accessed through a concealed door, has quickly become the city's most coveted reservation.`,
    category: 'interior',
    images: [
      { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', publicId: 'hotel-1', alt: 'Hotel NOIR - Lobby', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80', publicId: 'hotel-2', alt: 'Hotel NOIR - Room', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80', publicId: 'hotel-3', alt: 'Hotel NOIR - Bar', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80', publicId: 'hotel-4', alt: 'Hotel NOIR - Suite', isPrimary: false },
    ],
    location: { city: 'Brooklyn', country: 'USA' },
    architect: 'Yuki Tanaka',
    team: ['Elena Rodriguez', 'Marcus Chen'],
    year: 2023,
    area: 2800,
    tags: ['hospitality', 'boutique', 'adaptive-reuse', 'luxury'],
    featured: false,
    status: 'published'
  },
  {
    title: 'Green Tower One',
    slug: 'green-tower-one',
    description: 'A net-zero office building setting new standards for sustainable commercial design.',
    fullDescription: `Green Tower One is a 28-story office building that achieves net-zero energy through an integrated approach to sustainable design. The building's form is optimized for natural ventilation, reducing mechanical cooling demand by 60%.

Photovoltaic panels cover the south facade and rooftop, generating more energy annually than the building consumes. Excess power is exported to the grid, offsetting emissions from tenant commuting.

The building's most striking feature is its vertical forest—planted terraces at every fourth floor that provide shade, improve air quality, and create habitat for urban wildlife.`,
    category: 'commercial',
    images: [
      { url: 'https://images.unsplash.com/photo-1554435493-93422e8220c8?w=1200&q=80', publicId: 'green-1', alt: 'Green Tower One - Exterior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80', publicId: 'green-2', alt: 'Green Tower One - Interior', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80', publicId: 'green-3', alt: 'Green Tower One - Terrace', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80', publicId: 'green-4', alt: 'Green Tower One - Office', isPrimary: false },
    ],
    location: { city: 'Amsterdam', country: 'Netherlands' },
    architect: 'David Okonkwo',
    team: ['Elena Rodriguez', 'James Rivera'],
    year: 2024,
    area: 42000,
    tags: ['net-zero', 'sustainable', 'office', 'vertical-forest'],
    featured: false,
    status: 'published'
  },
  {
    title: 'Transit Hub Central',
    slug: 'transit-hub-central',
    description: 'A multimodal transportation hub unifying rail, bus, and bike systems.',
    fullDescription: `Transit Hub Central reimagines urban mobility infrastructure as civic architecture. The sweeping steel roof spans 180 meters without intermediate supports, creating a luminous interior that feels like an urban park.

The hub connects regional rail, light rail, bus rapid transit, and a new bike-share system. Legible wayfinding and generous public spaces eliminate the confusion typical of such complex facilities.

A rooftop solar array provides shelter for the bus platforms below while generating clean energy for the station's operations.`,
    category: 'urban',
    images: [
      { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80', publicId: 'transit-1', alt: 'Transit Hub - Interior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80', publicId: 'transit-2', alt: 'Transit Hub - Platform', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', publicId: 'transit-3', alt: 'Transit Hub - Exterior', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80', publicId: 'transit-4', alt: 'Transit Hub - Night', isPrimary: false },
    ],
    location: { city: 'Vienna', country: 'Austria' },
    architect: 'James Rivera',
    team: ['David Okonkwo', 'Lisa Chang'],
    year: 2023,
    area: 65000,
    tags: ['transit', 'infrastructure', 'civic', 'sustainable'],
    featured: false,
    status: 'published'
  },
  {
    title: 'Floating Garden Residence',
    slug: 'floating-garden-residence',
    description: 'An urban oasis featuring terraced gardens cascading down a hillside site.',
    fullDescription: `The Floating Garden Residence maximizes a challenging hillside site through a series of stacked garden terraces. Each level of the home opens onto its own private outdoor space, creating multiple microclimates for different plantings.

The reinforced concrete structure is deliberately expressed, providing a robust frame for trailing vines and climbing plants. Over time, the building will become increasingly green, merging with its established garden context.

Rainwater is harvested at each level and cascades down through a series of planted water features, irrigating the gardens while creating soothing ambient sound.`,
    category: 'residential',
    images: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', publicId: 'floating-1', alt: 'Floating Garden - Exterior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', publicId: 'floating-2', alt: 'Floating Garden - Interior', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1200&q=80', publicId: 'floating-3', alt: 'Floating Garden - Terrace', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', publicId: 'floating-4', alt: 'Floating Garden - Garden', isPrimary: false },
    ],
    location: { city: 'Lisbon', country: 'Portugal' },
    architect: 'Sarah Walsh',
    team: ['Elena Rodriguez'],
    year: 2024,
    area: 520,
    tags: ['garden', 'terraced', 'sustainable', 'hillside'],
    featured: false,
    status: 'published'
  },
  {
    title: 'Cultural Center Harmon',
    slug: 'cultural-center-harmon',
    description: 'A performing arts center celebrating local heritage through contemporary design.',
    fullDescription: `The Cultural Center Harmon serves a diverse community with theater, gallery, and educational spaces. The design draws inspiration from traditional craft techniques, reinterpreting them through contemporary digital fabrication.

The concert hall's interior features an acoustic "cloud" of suspended timber panels, each uniquely shaped by parametric modeling to optimize sound distribution. The result is intimate acoustics in a 1,200-seat hall.

Flexible gallery spaces can be combined or subdivided to accommodate exhibitions ranging from intimate local shows to major touring collections.`,
    category: 'commercial',
    images: [
      { url: 'https://images.unsplash.com/photo-1507891811136-aa6d0c09be11?w=1200&q=80', publicId: 'cultural-1', alt: 'Cultural Center - Exterior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&q=80', publicId: 'cultural-2', alt: 'Cultural Center - Hall', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&q=80', publicId: 'cultural-3', alt: 'Cultural Center - Gallery', isPrimary: false },
      { url: 'https://images.unsplash.com/photo-1577720643272-265f09367456?w=1200&q=80', publicId: 'cultural-4', alt: 'Cultural Center - Detail', isPrimary: false },
    ],
    location: { city: 'Seattle', country: 'USA' },
    architect: 'Marcus Chen',
    team: ['Yuki Tanaka', 'James Rivera'],
    year: 2023,
    area: 12000,
    tags: ['cultural', 'performing-arts', 'community', 'parametric'],
    featured: false,
    status: 'published'
  },
]
