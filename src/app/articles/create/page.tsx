'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { CreateArticleDto } from '@/types/article';

export default function ArticleCreateForm() {
  const router = useRouter();
  const { register, handleSubmit, control, formState: { errors } } = useForm<CreateArticleDto>();
  const [translations, setTranslations] = useState([{ language: 'en', title: '', shortDescription: '', content: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: CreateArticleDto) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        router.push('/articles');
      } else {
        throw new Error('Failed to create article');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTranslation = () => {
    setTranslations([...translations, { language: 'en', title: '', shortDescription: '', content: '' }]);
  };

  const removeTranslation = (index: number) => {
    const updated = [...translations];
    updated.splice(index, 1);
    setTranslations(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Article</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input
              {...register('slug', { required: 'Slug is required' })}
              className={`w-full px-4 py-2 border rounded-md ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., new-iphone-release"
            />
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author ID *</label>
            <input
              {...register('authorId', { required: 'Author ID is required' })}
              className={`w-full px-4 py-2 border rounded-md ${errors.authorId ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.authorId && <p className="mt-1 text-sm text-red-600">{errors.authorId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              defaultValue="draft"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input type="checkbox" {...register('isFeatured')} className="mr-2" />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" {...register('isBreaking')} className="mr-2" />
              <span className="text-sm text-gray-700">Breaking News</span>
            </label>
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categories *</label>
          {/* In a real app, you would fetch categories and render checkboxes */}
          <input
            type="text"
            {...register('categoryIds', { required: 'At least one category is required' })}
            className={`w-full px-4 py-2 border rounded-md ${errors.categoryIds ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Comma-separated category IDs"
          />
          {errors.categoryIds && <p className="mt-1 text-sm text-red-600">{errors.categoryIds.message}</p>}
        </div>

        {/* Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
            <input
              {...register('featuredImage')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
            <input
              {...register('videoUrl')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>

        {/* Translations */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Translations *</h2>
            <button
              type="button"
              onClick={addTranslation}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm hover:bg-blue-200"
            >
              Add Translation
            </button>
          </div>

          {translations.map((_, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md space-y-4">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-700">Translation #{index + 1}</h3>
                {translations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTranslation(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
                  <select
                    {...register(`translations.${index}.language`, { required: 'Language is required' })}
                    className={`w-full px-4 py-2 border rounded-md ${errors.translations?.[index]?.language ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    {...register(`translations.${index}.title`, { required: 'Title is required' })}
                    className={`w-full px-4 py-2 border rounded-md ${errors.translations?.[index]?.title ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <textarea
                  {...register(`translations.${index}.shortDescription`, { required: 'Short description is required' })}
                  className={`w-full px-4 py-2 border rounded-md ${errors.translations?.[index]?.shortDescription ? 'border-red-500' : 'border-gray-300'}`}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  {...register(`translations.${index}.content`, { required: 'Content is required' })}
                  className={`w-full px-4 py-2 border rounded-md ${errors.translations?.[index]?.content ? 'border-red-500' : 'border-gray-300'}`}
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    {...register(`translations.${index}.metaTitle`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <input
                    {...register(`translations.${index}.metaDescription`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  {...register(`translations.${index}.tags`)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Comma-separated tags"
                />
              </div>
            </div>
          ))}
        </div>

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
            {isSubmitting ? 'Creating...' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
}