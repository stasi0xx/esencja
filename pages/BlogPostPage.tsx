import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogService } from '../services/blogService';
import AnimatedElement from '../components/AnimatedElement';
import type { BlogPost } from '../types';
import { sanitizeHtml } from '../utils/sanitizeHtml';

const BlogPostPage = () => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();

    const initialImageUrl = (location.state as any)?.imageUrl;

    const fetchPostContent = useCallback(async () => {
        if (!slug) return;
        try {
            setLoading(true);
            setError(null);
            const postData = await blogService.getPostBySlug(slug);
            if (postData) {
                setPost(postData);
            } else {
                setError('Nie znaleziono artykułu.');
            }
        } catch (err) {
            setError('Nie udało się załadować treści artykułu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchPostContent();
    }, [fetchPostContent]);

    const ArticleSkeleton = () => (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full"></div>
            <br />
            <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-4/6"></div>
        </div>
    );

    const title = post?.title || (location.state as any)?.title || 'Ładowanie...';
    const imageUrl = post?.img_url || initialImageUrl;

    // Heurystyka: jeśli treść zawiera tagi HTML, potraktuj ją jako HTML
    const content = post?.content || '';
    const isProbablyHtml = /<\/?[a-z][\s\S]*>/i.test(content);

    return (
        <div className="container mx-auto px-6 py-16">
            <article className="max-w-4xl mx-auto">
                <AnimatedElement>
                    <h1 className="text-4xl md:text-6xl font-black text-center mb-8 dark:text-white">{title}</h1>
                    {imageUrl && (
                        <div className="mb-12 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-800 shadow-sm">
                            <img src={imageUrl} alt={title} className="w-full h-auto object-cover" />
                        </div>
                    )}
                </AnimatedElement>

                <AnimatedElement delay={200}>
                    <div className="prose prose-lg max-w-none prose-h2:font-bold prose-h2:text-3xl prose-p:text-gray-600 prose-a:text-gray-800 hover:prose-a:underline prose-strong:text-gray-900 dark:prose-invert dark:prose-p:text-gray-400 dark:prose-a:text-gray-200 dark:prose-strong:text-white">
                        {loading ? (
                            <ArticleSkeleton />
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : isProbablyHtml ? (
                            <div
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
                            />
                        ) : (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content}
                            </ReactMarkdown>
                        )}
                    </div>
                </AnimatedElement>
            </article>
        </div>
    );
};

export default BlogPostPage;