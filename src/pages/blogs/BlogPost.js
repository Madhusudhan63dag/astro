// pages/BlogPost.jsx
import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { posts } from '../../blogdata/data'; // adjust path [7]

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const BlogPost = () => {
  const { slug } = useParams(); // dynamic segment [1]
  const post = useMemo(() => posts.find(p => p.slug === slug), [slug]); // find by slug [7]

  if (!post) {
    return <Navigate to="/blog" replace />; // or render a 404 UI [10]
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: { '@type': 'Organization', name: 'SriAstroVeda' },
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    mainEntityOfPage: `/blog/${post.slug}`,
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
        <ol className="flex items-center gap-2">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/blog" className="hover:underline">Blog</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-gray-700 font-medium">{post.title}</li>
        </ol>
      </nav>

      <article>
        <header className="mb-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="mt-2 text-sm text-gray-600">
            <span className="uppercase text-indigo-700 font-semibold">{post.category}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span>{formatDate(post.datePublished)}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        {post.image && (
          <img src={post.image} alt="" className="w-full h-64 object-cover rounded-lg mb-6" loading="lazy" />
        )}

        {/* If you add a `content` field in data.js, render it here; fallback to excerpt */}
        <div className="prose max-w-none">
          <p>{post.content || post.excerpt}</p>
        </div>

        <footer className="mt-8">
          <div className="flex flex-wrap gap-2">
            {post.tags?.map(t => (
              <Link key={t} to={`/blog/tag/${t.toLowerCase()}`} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full hover:bg-gray-200">
                #{t}
              </Link>
            ))}
          </div>
        </footer>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
};

export default BlogPost;
