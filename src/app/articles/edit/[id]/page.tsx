'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { UpdateArticleDto } from '@/types/article';

export default function ArticleEditForm({ articleId }: any) {
  const router = useRouter();
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<UpdateArticleDto>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${articleId}`);
        if (!response.ok) throw new Error('Failed to fetch article');
        const data = await response.json();
        reset(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, reset]);

  const onSubmit = async (data: UpdateArticleDto) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        router.push('/articles');
      } else {
        throw new Error('Failed to update article');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading article data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Article</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields similar to CreateForm but with existing data */}
        {/* Implement similar fields as in ArticleCreateForm */}
        {/* ... */}
        
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/articles')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Updating...' : 'Update Article'}
          </button>
        </div>
      </form>
    </div>
  );
}