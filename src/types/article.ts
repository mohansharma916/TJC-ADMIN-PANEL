export interface ArticleTranslationDto {
    language: string;
    title: string;
    shortDescription: string;
    content: string;
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
  }
  
  export interface CreateArticleDto {
    slug: string;
    categoryIds: string[];
    authorId: string;
    status?: 'draft' | 'published' | 'archived';
    isFeatured?: boolean;
    isBreaking?: boolean;
    featuredImage?: string;
    videoUrl?: string;
    publishedAt?: Date;
    translations: ArticleTranslationDto[];
    relatedArticles?: string[];
  }
  
  export interface UpdateArticleDto extends Partial<CreateArticleDto> {}
  
  export interface Article extends CreateArticleDto {
    _id: string;
    createdAt?: Date;
    updatedAt?: Date;
    views?: number;
  }