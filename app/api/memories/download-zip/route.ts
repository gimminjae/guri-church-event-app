import JSZip from "jszip";
import { NextResponse } from "next/server";
import {
  getAttachmentContentDisposition,
  getMemoryZipEntryName,
} from "@/lib/memory-downloads";
import { listPublishedMemories } from "@/lib/firebase/memories";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { ids?: unknown };
    const ids = Array.isArray(payload.ids)
      ? payload.ids.filter((value): value is string => typeof value === "string")
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        {
          error: "다운로드할 이미지를 먼저 선택해 주세요.",
        },
        { status: 400 },
      );
    }

    if (ids.length > 100) {
      return NextResponse.json(
        {
          error: "한 번에 최대 100장까지 ZIP으로 다운로드할 수 있어요.",
        },
        { status: 400 },
      );
    }

    const idSet = new Set(ids);
    const memories = (await listPublishedMemories(1000)).filter((memory) =>
      idSet.has(memory.id),
    );

    if (memories.length === 0) {
      return NextResponse.json(
        {
          error: "선택한 이미지를 찾지 못했어요.",
        },
        { status: 404 },
      );
    }

    const zip = new JSZip();

    await Promise.all(
      memories.map(async (memory) => {
        const response = await fetch(memory.imageUrl);

        if (!response.ok) {
          throw new Error(`이미지를 불러오지 못했어요: ${memory.name}`);
        }

        zip.file(
          getMemoryZipEntryName(memory),
          await response.arrayBuffer(),
        );
      }),
    );

    const zipBytes = await zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    });
    const fileName = `memories-${new Date().toISOString().slice(0, 10)}.zip`;

    return new Response(zipBytes, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": getAttachmentContentDisposition(fileName),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "ZIP 다운로드에 실패했어요.",
      },
      { status: 400 },
    );
  }
}
