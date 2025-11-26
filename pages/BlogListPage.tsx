import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../types';
import AnimatedElement from '../components/AnimatedElement';
import { ArrowRight } from 'lucide-react';

const BlogCardSkeleton = () => (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 animate-pulse shadow-sm">
        <div className="w-full h-48 bg-gray-200 dark:bg-neutral-800 rounded mb-4"></div>
        <div className="w-3/4 h-6 bg-gray-200 dark:bg-neutral-800 rounded mb-3"></div>
        <div className="w-full h-4 bg-gray-200 dark:bg-neutral-800 rounded mb-4"></div>
        <div className="w-1/2 h-4 bg-gray-200 dark:bg-neutral-800 rounded"></div>
    </div>
);

interface BlogCardProps {
    post: BlogPost;
    index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index }) => (
    <AnimatedElement delay={index * 100}>
        <Link to={`/insights/${post.slug}`} state={{ title: post.title, imageUrl: post.imageUrl, slug: post.slug }}>
            <div className="group relative block bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:hover:shadow-gray-700/50">
                <img src={post.imageUrl || 'https://picsum.photos/800/600'} alt={post.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="p-6">
                    <span className="inline-block bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">{post.category}</span>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-neutral-400 text-sm leading-relaxed mb-4">{post.summary}</p>
                </div>
                <div className="p-6 pt-0 mt-auto">
                    <div className="flex items-center text-sm font-semibold text-gray-800 dark:text-neutral-200">
                        Czytaj Więcej
                        <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    </AnimatedElement>
);

// Fix: Changed Polish category names to English to match the BlogPost type.
const categories = ['Wszystkie', 'SEO', 'Content Strategy', 'Social Media'];
const POSTS_PER_PAGE = 6;

const BlogListPage = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('Wszystkie');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = await blogService.getPosts();
      setAllPosts(posts);
    } catch (err) {
      setError("Nie udało się pobrać postów. Spróbuj odświeżyć stronę.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post =>
      activeFilter === 'Wszystkie' ? true : post.category === activeFilter
    );
  }, [allPosts, activeFilter]);

  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + POSTS_PER_PAGE);
  };

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    setVisibleCount(POSTS_PER_PAGE);
  };
  
  const canLoadMore = visibleCount < filteredPosts.length;

  return (
    <div className="container mx-auto px-6 py-16">
      <AnimatedElement>
        <h1 className="text-5xl md:text-6xl font-black text-center mb-4 dark:text-white">JAK realizujemy </h1>
        <p className="text-lg text-gray-600 dark:text-neutral-400 text-center max-w-3xl mx-auto">
            Poznaj nasze projekty w akcji - od kampanii i grafik, po strony internetowe, sklepy online i wydarzenia. Zobacz, jak pomysły zamieniamy w realne efekty.
        </p>
      </AnimatedElement>
      
      <AnimatedElement delay={200}>
        <div className="flex justify-center flex-wrap gap-4 my-12">
            {categories.map(category => (
                <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                    activeFilter === category
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-800'
                }`}
                >
                {category}
                </button>
            ))}
        </div>
      </AnimatedElement>


      <div className="my-16">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => <BlogCardSkeleton key={i} />)}
          </div>
        ) : error ? (
           <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))}
            </div>
            {canLoadMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-3 px-8 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg"
                >
                  Załaduj więcej
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;