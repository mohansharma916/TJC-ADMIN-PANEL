"use client"
import Link from 'next/link';
import { Article } from '@/types/article';
import { useEffect, useState } from 'react';

// async function getArticles(): Promise<Article[]> {
//   const res = await fetch('http://localhost:3000/articles', {
//     cache: 'no-store'
//   });
//   if (!res.ok) throw new Error('Failed to fetch articles');
//   return res.json();
// }

export default  function ArticlesListPage() {
  // const articles = await getArticles();


  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5000/articles');
        if (!response.ok) throw new Error('Failed to fetch Articles');
        const data = await response.json();
        setArticles(data);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) return <div className="text-center py-8">Loading Articles...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;


  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Articles</h1>
        <Link href="/articles/create" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Create New
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {article.translations.find(t => t.language === 'en')?.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    article.status === 'published' ? 'bg-green-100 text-green-800' :
                    article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/articles/edit/${article._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                    Edit
                  </Link>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}