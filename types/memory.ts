export type MemoryRecord = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageKey: string;
  imageWidth?: number;
  imageHeight?: number;
  createdAt: number;
  updatedAt: number;
  status: "published";
  thumbnailUrl?: string;
  eventId?: string;
  authorId?: string;
  isDeleted?: boolean;
  sortOrder?: number | null;
};

export type CreateMemoryInput = {
  name: string;
  description: string;
  imageUrl: string;
  imageKey: string;
  imageWidth?: number;
  imageHeight?: number;
};
