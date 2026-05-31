import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const batch = await prisma.batch.findUnique({
      where: {
        id,
      },
      include: {
        qrCodes: true,
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Lote no encontrado" },
        { status: 404 }
      );
    }

    // ==================================================
    // PDF
    // ==================================================

    const pdfDoc = await PDFDocument.create();

    const font = await pdfDoc.embedFont(
      StandardFonts.Helvetica
    );

    const boldFont = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );

    const pageWidth = 595;
    const pageHeight = 842;

    let page = pdfDoc.addPage([
      pageWidth,
      pageHeight,
    ]);

    // ==================================================
    // CONFIGURACIÓN TAMAÑO QR
    // ==================================================

    const sizeParam =
      request.nextUrl.searchParams.get("size");

    const qrSize = sizeParam
      ? Number(sizeParam)
      : 120;

    // ==================================================
    // MÁRGENES Y ESPACIADOS
    // ==================================================

    const marginX = 40;
    const marginTop = 130;

    const gapX = 40;
    const gapY = 65;

    const footerHeight = 90;

    // ==================================================
    // COLUMNAS AUTOMÁTICAS
    // ==================================================

    const usableWidth =
      pageWidth - marginX * 2;

    const columns = Math.max(
      1,
      Math.floor(
        usableWidth / (qrSize + gapX)
      )
    );

    // ==================================================
    // FILAS AUTOMÁTICAS
    // ==================================================

    const usableHeight =
      pageHeight -
      marginTop -
      footerHeight;

    const maxRowsPerPage = Math.max(
      1,
      Math.floor(
        usableHeight / (qrSize + gapY)
      )
    );

    let currentColumn = 0;
    let currentRow = 0;

    // ==================================================
    // LÍNEAS DE RECORTE
    // ==================================================

    const drawCutMarks = (
      page: any,
      x: number,
      y: number,
      size: number
    ) => {
      const mark = 8;

      // Superior izquierda

      page.drawLine({
        start: {
          x: x - 4,
          y: y + 4,
        },
        end: {
          x: x - 4 + mark,
          y: y + 4,
        },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });

      page.drawLine({
        start: {
          x: x - 4,
          y: y + 4,
        },
        end: {
          x: x - 4,
          y: y + 4 - mark,
        },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });

      // Superior derecha

      page.drawLine({
        start: {
          x: x + size + 4,
          y: y + 4,
        },
        end: {
          x: x + size + 4 - mark,
          y: y + 4,
        },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });

      page.drawLine({
        start: {
          x: x + size + 4,
          y: y + 4,
        },
        end: {
          x: x + size + 4,
          y: y + 4 - mark,
        },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });

      // Inferior izquierda

      page.drawLine({
        start: {
          x: x - 4,
          y: y - size - 4,
        },
        end: {
          x: x - 4 + mark,
          y: y - size - 4,
        },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });

      page.drawLine({
        start: {
          x: x - 4,
          y: y - size - 4,
        },
        end: {
          x: x - 4,
          y: y - size - 4 + mark,
        },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });

      // Inferior derecha

      page.drawLine({
        start: {
          x: x + size + 4,
          y: y - size - 4,
        },
        end: {
          x: x + size + 4 - mark,
          y: y - size - 4,
        },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });

      page.drawLine({
        start: {
          x: x + size + 4,
          y: y - size - 4,
        },
        end: {
          x: x + size + 4,
          y: y - size - 4 + mark,
        },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });
    };

    // ==================================================
    // CABECERA
    // ==================================================

    const drawHeader = (page: any) => {
      page.drawText(
        `LOTE #${batch.batchNumber}`,
        {
          x: 40,
          y: pageHeight - 40,
          size: 22,
          font: boldFont,
          color: rgb(0, 0, 0),
        }
      );

      page.drawText(
        "renovacionfemenina.org",
        {
          x: 380,
          y: pageHeight - 40,
          size: 11,
          font,
          color: rgb(0.3, 0.3, 0.3),
        }
      );

      page.drawText(
        `${batch.qrCodes.length} códigos QR`,
        {
          x: 40,
          y: pageHeight - 65,
          size: 12,
          font,
          color: rgb(0.3, 0.3, 0.3),
        }
      );

      page.drawText(
        `Generado: ${new Date().toLocaleDateString()}`,
        {
          x: 40,
          y: pageHeight - 82,
          size: 10,
          font,
          color: rgb(0.4, 0.4, 0.4),
        }
      );
    };

    // ==================================================
    // PIE DE PÁGINA
    // ==================================================

    const drawFooter = (
      page: any,
      currentPage: number,
      totalPages: number
    ) => {
      page.drawText(
        `Página ${currentPage}/${totalPages}`,
        {
          x: 40,
          y: 25,
          size: 10,
          font,
          color: rgb(0.5, 0.5, 0.5),
        }
      );

      page.drawText(
        "QR Platform • renovacionfemenina.org",
        {
          x: 300,
          y: 25,
          size: 10,
          font,
          color: rgb(0.5, 0.5, 0.5),
        }
      );
    };

    // ==================================================
    // CABECERA PRIMERA PÁGINA
    // ==================================================

    drawHeader(page);

    // ==================================================
    // GENERACIÓN QR
    // ==================================================

    for (let i = 0; i < batch.qrCodes.length; i++) {
      const qr = batch.qrCodes[i];

      const qrUrl =
        `${request.headers.get("origin")}` +
        `/qr/${qr.token}`;

      const qrDataUrl =
        await QRCode.toDataURL(qrUrl, {
          margin: 1,
          width: 300,
        });

      const qrImageBytes = Buffer.from(
        qrDataUrl.split(",")[1],
        "base64"
      );

      const qrImage =
        await pdfDoc.embedPng(qrImageBytes);

      const x =
        marginX +
        currentColumn * (qrSize + gapX);

      const y =
        pageHeight -
        marginTop -
        currentRow * (qrSize + gapY);

      // ==================================================
      // DIBUJAR QR
      // ==================================================

      page.drawImage(qrImage, {
        x,
        y: y - qrSize,
        width: qrSize,
        height: qrSize,
      });

      // ==================================================
      // LÍNEAS DE RECORTE
      // ==================================================

      drawCutMarks(page, x, y, qrSize);

      // ==================================================
      // INFORMACIÓN QR
      // ==================================================

      page.drawText(
        `Lote #${batch.batchNumber}`,
        {
          x: x + 10,
          y: y - qrSize - 18,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        }
      );

      page.drawText(
        `QR #${String(qr.qrNumber).padStart(
          4,
          "0"
        )}`,
        {
          x: x + 10,
          y: y - qrSize - 34,
          size: 11,
          font: boldFont,
          color: rgb(0, 0, 0),
        }
      );

      // ==================================================
      // CONTROL COLUMNAS
      // ==================================================

      currentColumn++;

      if (currentColumn >= columns) {
        currentColumn = 0;
        currentRow++;
      }

      // ==================================================
      // NUEVA PÁGINA
      // ==================================================

      if (currentRow >= maxRowsPerPage) {
        page = pdfDoc.addPage([
          pageWidth,
          pageHeight,
        ]);

        drawHeader(page);

        currentRow = 0;
        currentColumn = 0;
      }
    }

    // ==================================================
    // FOOTERS TODAS LAS PÁGINAS
    // ==================================================

    const totalPages =
      pdfDoc.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const currentPage =
        pdfDoc.getPage(i);

      drawFooter(
        currentPage,
        i + 1,
        totalPages
      );
    }

    // ==================================================
    // GENERAR PDF
    // ==================================================

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type":
          "application/pdf",

        "Content-Disposition":
          `inline; filename="${batch.name}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error(
      "PDF ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: error?.message,
        stack: error?.stack,
      },
      { status: 500 }
    );
  }
}