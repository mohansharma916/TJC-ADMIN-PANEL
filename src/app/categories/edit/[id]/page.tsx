"use client"
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { UpdateCategoryDto } from '@/types/category';
import { useParams } from 'next/navigation'




 const CategoryEditForm=()=> {
  const params = useParams()


  const router = useRouter();
  console.log("router",params.id)
  const { 
    register, 
    handleSubmit, 
    control, 
    reset, 
    formState: { errors },
    watch,
    setValue
  } = useForm<UpdateCategoryDto>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [translations, setTranslations] = useState<{language: string, name: string}[]>([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
     
        const response = await fetch(`http://localhost:5000/categories/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch category');
        const data = await response.json();
        reset(data);
        setTranslations(data.translations || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [params, reset]);

  const onSubmit = async (data: UpdateCategoryDto) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        setSuccessMessage('Category updated successfully!');
        setTimeout(() => router.push('/categories'), 2000);
      } else {
        throw new Error('Failed to update category');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTranslation = () => {
    const newTranslations = [...translations, { language: 'en', name: '' }];
    setTranslations(newTranslations);
    setValue('translations', newTranslations);
  };

  const removeTranslation = (index: number) => {
    const newTranslations = translations.filter((_, i) => i !== index);
    setTranslations(newTranslations);
    setValue('translations', newTranslations);
  };

  if (isLoading) return <div className="text-center py-8">Loading category data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Category</h1>
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              {...register('slug', { required: 'Slug is required' })}
              className={`w-full px-4 py-2 border rounded-md ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category
            </label>
            <select
              {...register('parentCategoryId')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">None</option>
              {/* You would populate this with actual categories from your API */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order *
            </label>
            <input
              type="number"
              {...register('displayOrder', { 
                required: 'Display order is required',
                valueAsNumber: true 
              })}
              className={`w-full px-4 py-2 border rounded-md ${errors.displayOrder ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.displayOrder && (
              <p className="mt-1 text-sm text-red-600">{errors.displayOrder.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image URL
            </label>
            <input
              {...register('featuredImage')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            {watch('featuredImage') && (
              <div className="mt-2">
                <img 
                  src={watch('featuredImage')} 
                  alt="Preview" 
                  className="h-20 object-cover rounded"
                />
              </div>
            )}
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

          {translations.map((translation, index) => (
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language *
                  </label>
                  <select
                    {...register(`translations.${index}.language`, { 
                      required: 'Language is required' 
                    })}
                    className={`w-full px-4 py-2 border rounded-md ${errors.translations?.[index]?.language ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    {/* Add more languages as needed */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    {...register(`translations.${index}.name`, { 
                      required: 'Name is required' 
                    })}
                    className={`w-full px-4 py-2 border rounded-md ${errors.translations?.[index]?.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register(`translations.${index}.description`)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    {...register(`translations.${index}.metaTitle`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <input
                    {...register(`translations.${index}.metaDescription`)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/categories')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Updating...' : 'Update Category'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryEditForm