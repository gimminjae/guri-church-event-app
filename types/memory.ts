export type MemoryRecord = {
  id: string;
  name: string;
  nickname: string;
  department: string;
  description: string;
  imageUrl: string;
  imageKey: string;
  imageWidth?: number;
  imageHeight?: number;
  createdAt: number;
  updatedAt: number;
  status: "published";
  isVisible: boolean;
  thumbnailUrl?: string;
  eventId?: string;
  authorId?: string;
  isDeleted?: boolean;
  sortOrder?: number | null;
};

export type CreateMemoryInput = {
  name: string;
  nickname: string;
  department: string;
  description: string;
  imageUrl: string;
  imageKey: string;
  imageWidth?: number;
  imageHeight?: number;
  isVisible?: boolean;
};

export type UpdateMemoryInput = {
  name: string;
  nickname: string;
  department: string;
  description: string;
  isVisible: boolean;
  imageUrl?: string;
  imageKey?: string;
  imageWidth?: number;
  imageHeight?: number;
};
