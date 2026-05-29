import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Props
) {

  const { id } = await params;

  await prisma.batch.update({

    where: {
      id,
    },

    data: {
      printedAt: new Date(),
    },

  });

  return Response.json({
    success: true,
  });
}