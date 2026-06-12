import { NextResponse } from "next/server";
import {
  createMemoryObjectKey,
  uploadMemoryObject,
} from "@/lib/aws/s3";
import { getMissingServerEnv } from "@/lib/env";
import { createMemory, listPublishedMemories } from "@/lib/firebase/memories";
import {
  getImageExtension,
  validateCreateMemoryInput,
  validateImageUploadInput,
} from "@/lib/validations/memory";

export const runtime = "nodejs";

export async function GET() {
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
    const memories = await listPublishedMemories();
    return NextResponse.json({ memories });
  } catch (error) {
    console.error("Failed to list memories", error);

    return NextResponse.json(
      {
        error: "추억 목록을 불러오지 못했어요.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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
    const formData = await request.formData();
    const file = formData.get("image");
    const name = formData.get("name");
    const nickname = formData.get("nickname");
    const department = formData.get("department");
    const description = formData.get("description");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "이미지 파일을 첨부해 주세요.",
        },
        { status: 400 },
      );
    }

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

    const imageWidthValue = formData.get("imageWidth");
    const imageHeightValue = formData.get("imageHeight");

    const payload = validateCreateMemoryInput({
      name,
      nickname,
      department,
      description,
      imageUrl: publicUrl,
      imageKey: fileKey,
      imageWidth:
        typeof imageWidthValue === "string" ? Number(imageWidthValue) : undefined,
      imageHeight:
        typeof imageHeightValue === "string"
          ? Number(imageHeightValue)
          : undefined,
    });
    const memory = await createMemory(payload);

    return NextResponse.json({ memory }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "추억 저장에 실패했어요.",
      },
      { status: 400 },
    );
  }
}
