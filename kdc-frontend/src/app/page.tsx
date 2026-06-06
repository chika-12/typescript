// No 'use client' — this is a Server Component.
// If you add useState/useEffect later (e.g. mobile menu toggle),
// extract that piece into its own client component file.

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ================================================================
          NAVBAR
          - White, sticky, z-50 so it sits above everything
          - Logo left, nav links center-right, Donate CTA far right
          - Hamburger visible only on mobile (md:hidden)
      ================================================================ */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3">
              <div className="bg-blue-900 w-9 h-9 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 font-bold text-lg">K</span>
              </div>
              <div>
                <p className="text-blue-900 font-bold text-lg leading-tight">
                  KDC
                </p>
                <p className="text-gray-400 text-xs hidden sm:block">
                  Karmo Development Centre
                </p>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#about"
                className="text-gray-600 hover:text-blue-900 font-medium text-sm transition"
              >
                About
              </a>
              <a
                href="#programs"
                className="text-gray-600 hover:text-blue-900 font-medium text-sm transition"
              >
                Programs
              </a>
              <a
                href="#portals"
                className="text-gray-600 hover:text-blue-900 font-medium text-sm transition"
              >
                Portals
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-900 font-medium text-sm transition"
              >
                Contact
              </a>
              <a
                href="#donate"
                className="bg-yellow-400 text-blue-900 px-5 py-2 rounded-lg hover:bg-yellow-300 font-semibold text-sm transition"
              >
                Donate Now
              </a>
            </div>

            {/* Mobile Hamburger — no logic yet, just the icon */}
            <button className="md:hidden text-gray-600 hover:text-blue-900">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ================================================================
          HERO
          - Deep navy gradient
          - Left: headline + subtext + two CTAs
          - Right: image placeholder (hidden on mobile)
          - Diagonal bottom edge using a clip-path trick via a div
      ================================================================ */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            {/* Left: Copy */}
            <div>
              <span className="inline-block bg-yellow-400/20 text-yellow-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                Karmo, Abuja · Est. 2015
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Quality Education{' '}
                <span className="text-yellow-400">for Every Child</span> in
                Karmo
              </h1>
              <p className="text-blue-200 text-lg leading-relaxed mb-10 max-w-lg">
                KDC provides scholarships, tutoring, and teacher training to
                children who would otherwise be left behind. No child should
                miss school because of poverty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#donate"
                  className="bg-yellow-400 text-blue-900 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-yellow-300 transition text-center"
                >
                  Support Our Work
                </a>
                <a
                  href="#about"
                  className="border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:border-white hover:bg-white/10 transition text-center"
                >
                  Our Story
                </a>
              </div>
            </div>

            {/* Right: Image Placeholder */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Decorative offset block */}
                <div className="absolute -bottom-3 -right-3 w-full h-full bg-yellow-400/20 rounded-2xl" />
                <div className="relative bg-white/10 border border-white/20 rounded-2xl aspect-[4/3] flex items-center justify-center">
                  <p className="text-white/40 text-sm font-medium">
                    Photo — KDC Students
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          IMPACT STATS
          - White bar, 4 numbers
          - Sits right below the hero — donors see it immediately
      ================================================================ */}
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-900 mb-1">500+</p>
              <p className="text-gray-500 text-sm font-medium">
                Students Enrolled
              </p>
            </div>

            <div>
              <p className="text-4xl font-bold text-blue-900 mb-1">25+</p>
              <p className="text-gray-500 text-sm font-medium">
                Teachers Trained
              </p>
            </div>

            <div>
              <p className="text-4xl font-bold text-blue-900 mb-1">3</p>
              <p className="text-gray-500 text-sm font-medium">
                Partner Schools
              </p>
            </div>

            <div>
              <p className="text-4xl font-bold text-blue-900 mb-1">100%</p>
              <p className="text-gray-500 text-sm font-medium">
                Scholarship Coverage
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          OUR STORY
          - Two-column: text left, image right
          - Short, punchy — 2 paragraphs + founder quote
          - No walls of text. Donors scan.
      ================================================================ */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <span className="inline-block text-yellow-500 font-semibold text-xs uppercase tracking-widest mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 leading-tight mb-6">
                Built from the community,{' '}
                <span className="text-yellow-500">for the community</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                KDC started in 2015 as a weekend tutoring circle under a tent in
                Karmo. A handful of teachers, parents, and local leaders saw
                talented children with no structured support — and decided to do
                something about it.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-10">
                Today we serve 500+ students annually, partner with three
                schools, and run teacher development programs across the FCT.
                Every naira donated goes directly to a child's education.
              </p>

              {/* Founder Quote */}
              <blockquote className="border-l-4 border-yellow-400 pl-5 py-1">
                <p className="text-gray-700 italic text-base leading-relaxed mb-3">
                  "Every child who walks through our doors carries a dream. Our
                  job is to give them the tools and confidence to chase it."
                </p>
                <cite className="text-blue-900 font-semibold text-sm not-italic">
                  — Founder, Karmo Development Centre
                </cite>
              </blockquote>
            </div>

            {/* Right: Image */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full bg-yellow-400 rounded-2xl z-0" />
              <div className="relative z-10 bg-blue-100 rounded-2xl aspect-[4/3] flex items-center justify-center">
                <p className="text-blue-400/60 text-sm font-medium">
                  Photo — KDC Community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          PROGRAMS
          - 3 cards on a light background
          - Icon, title, one-sentence description
          - No emoji — proper SVG icons, more institutional
      ================================================================ */}
      <section id="programs" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-yellow-500 font-semibold text-xs uppercase tracking-widest mb-4">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Programs Built for Impact
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Every program addresses a specific gap between where a child is
              and where they deserve to be.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Scholarships */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition group">
              <div className="bg-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:bg-yellow-400 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white group-hover:text-blue-900 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Scholarships
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Full and partial scholarships ensuring no child loses their
                school place due to inability to pay fees.
              </p>
            </div>

            {/* After-school Tutoring */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition group">
              <div className="bg-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:bg-yellow-400 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white group-hover:text-blue-900 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                After-school Tutoring
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Structured support in Math, English, and Science — bridging the
                gap between classroom teaching and real understanding.
              </p>
            </div>

            {/* Teacher Training */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition group">
              <div className="bg-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:bg-yellow-400 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white group-hover:text-blue-900 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Teacher Training
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Professional development workshops that equip local educators
                with modern pedagogy and classroom management skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          DONATE / CTA
          - Full-width yellow section — high visual contrast
          - Short copy, one strong button
          - This is what converts a visitor into a donor
      ================================================================ */}
      <section id="donate" className="bg-yellow-400 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-5">
            Every Donation Keeps a Child in School
          </h2>
          <p className="text-blue-800 text-lg leading-relaxed mb-10">
            Your N5,000 doesn't just pay school fees — it opens a classroom door
            for a child who's been waiting outside, dreaming of a desk and a
            notebook. Your N20,000 doesn't just fund a training session — it
            gives a teacher the tools to transform 50 young lives this year
            alone. Every kobo you give goes straight to work. No fancy offices.
            No middlemen. Just children learning, teachers growing, and a
            community rising together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@kdc.org?subject=Donation Enquiry"
              className="bg-blue-900 text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-blue-800 transition"
            >
              Donate Now
            </a>
            <a
              href="mailto:info@kdc.org?subject=Partnership Enquiry"
              className="border-2 border-blue-900 text-blue-900 px-10 py-4 rounded-xl font-bold text-base hover:bg-blue-900 hover:text-white transition"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================
          PORTAL SECTION
          - Dark navy — contrasts with the yellow CTA above
          - 3 cards: Admin, Teacher, Student
          - Admin card uses yellow accent to show hierarchy
      ================================================================ */}

      <section id="portals" className="bg-blue-900 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-yellow-400 font-semibold text-xs uppercase tracking-widest mb-4">
              Access Portals
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Login to Your Dashboard
            </h2>
            <p className="text-blue-300 text-lg max-w-xl mx-auto">
              Dedicated portals for administrators, teachers, and students to
              manage learning and operations.
            </p>
          </div>

          {/* Single  card, centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm bg-white/10 border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition">
              <div className="bg-yellow-400 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-blue-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Staff & Student Portal
              </h3>
              <p className="text-blue-200 text-sm leading-relaxed mb-6">
                Login to access your dashboard. The system will direct you based
                on your account type.
              </p>
              <a
                href="/login"
                className="block w-full bg-yellow-400 text-blue-900
              font-bold py-3 rounded-xl hover:bg-yellow-300 transition text-sm"
              >
                Login →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER
          - Dark gray base
          - 3 columns: Brand, Links, Contact
          - Newsletter input removed — no backend for it yet
          - Copyright bar at the bottom
      ================================================================ */}
      <footer id="contact" className="bg-gray-900 text-white pt-14 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-900 w-9 h-9 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-400 font-bold text-lg">K</span>
                </div>
                <p className="font-bold text-xl">KDC</p>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Providing formal education and support to children in Karmo
                community, Abuja, since 2015.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <a href="#about" className="hover:text-yellow-400 transition">
                    About KDC
                  </a>
                </li>
                <li>
                  <a
                    href="#programs"
                    className="hover:text-yellow-400 transition"
                  >
                    Our Programs
                  </a>
                </li>
                <li>
                  <a
                    href="#donate"
                    className="hover:text-yellow-400 transition"
                  >
                    Donate
                  </a>
                </li>
                <li>
                  <a
                    href="#portals"
                    className="hover:text-yellow-400 transition"
                  >
                    Portals
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-5">
                Contact
              </h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>Karmo District, Abuja, Nigeria</li>
                <li>
                  <a
                    href="tel:+2341234567890"
                    className="hover:text-yellow-400 transition"
                  >
                    +234 123 456 7890
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@kdc.org"
                    className="hover:text-yellow-400 transition"
                  >
                    info@kdc.org
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Karmo Development Centre. All
              rights reserved.
            </p>
            <p className="text-gray-600 text-xs">
              Built with ❤️ for the children of the world. Designed by [Chika
              Mark]. Developed by [Chika Mark].
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
