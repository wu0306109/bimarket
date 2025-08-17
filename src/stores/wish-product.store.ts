import {
  ApiResponse,
  ProductCategory,
  WishProductFormData,
} from '@/types/wish-product';
import { create } from 'zustand';

interface UploadedImage {
  id: string;
  url: string;
  file: File;
  filename: string;
}

interface WishProductStore {
  // 表單狀態
  formData: Partial<WishProductFormData>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;

  // 圖片上傳狀態
  uploadingImages: boolean;
  uploadedImages: UploadedImage[];

  // 類別資料
  categories: ProductCategory[];
  loadingCategories: boolean;
  categoriesError: string | null;

  // 動作
  updateFormData: (data: Partial<WishProductFormData>) => void;
  submitForm: (data: WishProductFormData) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  removeImage: (id: string) => void;
  loadCategories: () => Promise<void>;
  resetForm: () => void;
  clearError: () => void;
}

export const useWishProductStore = create<WishProductStore>((set, get) => ({
  // 初始狀態
  formData: {},
  isSubmitting: false,
  submitError: null,
  submitSuccess: false,

  uploadingImages: false,
  uploadedImages: [],

  categories: [],
  loadingCategories: false,
  categoriesError: null,

  // 動作實作
  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
      submitError: null, // 清除錯誤當用戶修改資料時
    }));
  },

  submitForm: async (data) => {
    set({ isSubmitting: true, submitError: null, submitSuccess: false });

    try {
      const formData = new FormData();

      // 新增文字欄位
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('categoryId', data.categoryId.toString());
      formData.append('region', data.region);

      if (data.additionalInfo) {
        formData.append('additionalInfo', data.additionalInfo);
      }

      // 新增圖片檔案
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await fetch('/api/wish-products', {
        method: 'POST',
        body: formData,
      });

      const result: ApiResponse<{ id: string; message: string }> =
        await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || '提交失敗');
      }

      set({
        isSubmitting: false,
        submitSuccess: true,
        submitError: null,
      });

      // 重置表單
      get().resetForm();
    } catch (error) {
      set({
        isSubmitting: false,
        submitError:
          error instanceof Error ? error.message : '提交失敗，請稍後再試',
      });
    }
  },

  uploadImage: async (file) => {
    const { uploadedImages } = get();

    // 檢查是否已達上限
    if (uploadedImages.length >= 5) {
      throw new Error('最多只能上傳5張圖片');
    }

    set({ uploadingImages: true });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result: ApiResponse<{
        id: string;
        url: string;
        filename: string;
        originalFilename: string;
      }> = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || '上傳失敗');
      }

      const newImage: UploadedImage = {
        id: result.data!.id,
        url: result.data!.url,
        file: file,
        filename: result.data!.filename,
      };

      set((state) => ({
        uploadedImages: [...state.uploadedImages, newImage],
        uploadingImages: false,
      }));

      return result.data!.filename;
    } catch (error) {
      set({ uploadingImages: false });
      throw error;
    }
  },

  removeImage: (id) => {
    set((state) => ({
      uploadedImages: state.uploadedImages.filter((img) => img.id !== id),
    }));
  },

  loadCategories: async () => {
    set({ loadingCategories: true, categoriesError: null });

    try {
      const response = await fetch('/api/categories');

      // 檢查 HTTP 狀態
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 檢查回應是否為空
      const text = await response.text();
      if (!text) {
        throw new Error('伺服器回傳空的回應');
      }

      let result: ApiResponse<ProductCategory[]>;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON 解析錯誤:', parseError);
        console.error('伺服器回應內容:', text);
        throw new Error(`無法解析伺服器回應: ${text.substring(0, 100)}`);
      }

      if (!result.success) {
        throw new Error(result.error?.message || '載入類別失敗');
      }

      set({
        categories: result.data || [],
        loadingCategories: false,
      });
    } catch (error) {
      console.error('載入類別錯誤:', error);
      set({
        loadingCategories: false,
        categoriesError:
          error instanceof Error ? error.message : '載入類別失敗',
      });
    }
  },

  resetForm: () => {
    set({
      formData: {},
      submitError: null,
      submitSuccess: false,
      uploadedImages: [],
    });
  },

  clearError: () => {
    set({ submitError: null, categoriesError: null });
  },
}));
