import { NextResponse } from "next/server";
import {
  createMemoryObjectKey,
  uploadMemoryObject,
} from "@/lib/aws/s3";
import { getMissingServerEnv } from "@/lib/env";
import { getMemoryById, updateMemory } from "@/lib/firebase/memories";
import {
  getImageExtension,
  validateImageUploadInput,
  validateUpdateMemoryInput,
} from "@/lib/validations/memory";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const missingEnvVars = getMissingServerEnv();

  if (missingEnvVars.length > 0) {
    return NextResponse.json(
      {
        error: `필수 환경변수가 비어 있어요: ${missingEnvVars.join(", ")}`,
      },
      { status: 503 },
    );
  }

  try {
    const { id } = await context.params;
    const existingMemory = await getMemoryById(id);

    if (!existingMemory) {
      return NextResponse.json(
        {
          error: "수정할 데이터를 찾지 못했어요.",
        },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");
    const name = formData.get("name");
    const nickname = formData.get("nickname");
    const department = formData.get("department");
    const description = formData.get("description");
    const isVisible = formData.get("isVisible");
    const imageWidthValue = formData.get("imageWidth");
    const imageHeightValue = formData.get("imageHeight");

    let imagePayload:
      | {
          imageUrl: string;
          imageKey: string;
          imageWidth?: number;
          imageHeight?: number;
        }
      | undefined;

    if (file instanceof File && file.size > 0) {
      const validatedFile = validateImageUploadInput({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      const extension = getImageExtension(validatedFile.fileType);

      if (!extension) {
        return NextResponse.json(
          {
            error: "지원하지 않는 이미지 형식입니다.",
          },
          { status: 400 },
        );
      }

      const fileKey = createMemoryObjectKey(extension, validatedFile.fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      const { publicUrl } = await uploadMemoryObject({
        fileKey,
        contentType: validatedFile.fileType,
        body: buffer,
      });

      imagePayload = {
        imageUrl: publicUrl,
        imageKey: fileKey,
        imageWidth:
          typeof imageWidthValue === "string"
            ? Number(imageWidthValue)
            : undefined,
        imageHeight:
          typeof imageHeightValue === "string"
            ? Number(imageHeightValue)
            : undefined,
      };
    }

    const payload = validateUpdateMemoryInput({
      name,
      nickname,
      department,
      description,
      isVisible,
      ...(imagePayload ?? {}),
    });

    const memory = await updateMemory(id, payload);

    return NextResponse.json({ memory });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "추억 수정에 실패했어요.",
      },
      { status: 400 },
    );
  }
}
