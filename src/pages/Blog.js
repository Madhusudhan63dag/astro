import React, { useMemo, useState } from 'react';
import { posts as blogPosts } from '../blogdata/data';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}


function PostCard({ post, layout = 'grid' }) {
  return (
    <article className={`rounded-lg border border-gray-200 overflow-hidden bg-white ${layout === 'list' ? 'flex gap-4' : ''}`}>
      <a href={`/blog/${post.slug}`} className={`${layout === 'list' ? 'w-48 shrink-0' : 'block'}`} aria-label={post.title}>
        <img src={post.image} alt="" className={`${layout === 'list' ? 'h-full w-full object-cover' : 'h-48 w-full object-cover'}`} loading="lazy" />
      </a>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold">
          <span className="uppercase">{post.category}</span>
          <span className="text-gray-300">•</span>
          <span>{formatDate(post.datePublished)}</span>
          <span className="text-gray-300">•</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-snug">
          <a href={`/blog/${post.slug}`} className="hover:underline">{post.title}</a>
        </h3>
        <p className="mt-1 text-gray-600 text-sm">{post.excerpt}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function Sidebar() {
  return (
    <aside className="space-y-6">
      <section className="rounded-xl border border-gray-200 p-4 bg-indigo-50">
        <h4 className="font-semibold text-indigo-900">Match Kundli</h4>
        <p className="text-sm text-indigo-900/80 mt-1">Check marriage compatibility with Vedic precision.</p>
        <a href="/match-kundli" className="inline-block mt-3 px-4 py-2 bg-indigo-700 text-white rounded-md">Match Now</a>
      </section>

      <section className="rounded-xl border border-gray-200 p-4">
        <h4 className="font-semibold">2025 Personalized Report</h4>
        <p className="text-sm text-gray-600 mt-1">Detailed yearly forecast tailored to birth details.</p>
        <a href="/2025-report" className="inline-block mt-3 px-4 py-2 bg-gray-900 text-white rounded-md">Get 2025 Report</a>
      </section>

      <section className="rounded-xl border border-gray-200 p-4">
        <h4 className="font-semibold">Ask a Question</h4>
        <p className="text-sm text-gray-600 mt-1">Get expert answers to personal or urgent queries.</p>
        <a href="/ask-question" className="inline-block mt-3 px-4 py-2 bg-gray-900 text-white rounded-md">Ask Now</a>
      </section>

      <section className="rounded-xl border border-gray-200 p-4">
        <h4 className="font-semibold">Sade Sati Report</h4>
        <p className="text-sm text-gray-600 mt-1">See impacts of Saturn’s transit and remedies.</p>
        <a href="/sade-sati" className="inline-block mt-3 px-4 py-2 bg-gray-900 text-white rounded-md">Check Now</a>
      </section>
    </aside>
  );
}

const Blog = () => {
  const [q, setQ] = useState('');

  const featured = useMemo(() => blogPosts.filter((p) => p.featured), []);

  const filtered = useMemo(() => {
    let list = blogPosts.slice().sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
    if (q.trim()) {
      const v = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(v) ||
          p.excerpt.toLowerCase().includes(v) ||
          p.tags.join(' ').toLowerCase().includes(v)
      );
    }
    return list;
  }, [q]);

  const jsonLd = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: filtered.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `/blog/${p.slug}`,
        item: {
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.excerpt,
          author: { '@type': 'Organization', name: 'SriAstroVeda' },
          datePublished: p.datePublished,
          dateModified: p.dateModified,
          image: p.image,
          mainEntityOfPage: `/blog/${p.slug}`,
        },
      })),
    };
  }, [filtered]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">

      <header className="mb-6">
        <h1 className="text-3xl font-bold">SriAstroVeda Blog</h1>
        <p className="mt-2 text-gray-600">
          Insights on Love, Career, Health, Dashas, Sade Sati, Numerology, Gemstones, and Nakshatras.
        </p>
      </header>

      {/* Simplified toolbar: search only */}
      <section className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-y border-gray-100 py-3 mb-6">
        <div className="flex items-center">
          <label htmlFor="blog-search" className="sr-only">Search</label>
          <input
            id="blog-search"
            type="search"
            placeholder="Search posts"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Featured</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <section className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-semibold">Latest</h2>
          <div className="space-y-6">
            {filtered.map((p) => (
              <PostCard key={p.id} post={p} layout="list" />
            ))}
          </div>

          <nav className="mt-6 flex items-center justify-between text-sm">
            <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50" disabled>
              ← Newer
            </button>
            <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
              Older →
            </button>
          </nav>
        </div>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
};

export default Blog;
