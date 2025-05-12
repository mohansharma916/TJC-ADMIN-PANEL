// src/types/category.ts

export interface TranslationDto {
    language: string;
    name: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
  }
  
  export interface CreateCategoryDto {
    slug: string;
    translations: TranslationDto[];
    parentCategoryId?: string;
    featuredImage?: string;
    displayOrder: number;
  }
  
  export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
    id: string;
  }
  
  export interface Category extends CreateCategoryDto {
    _id: string;
    createdAt?: Date;
    updatedAt?: Date;
  }