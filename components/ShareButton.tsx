"use client";

type Props = {
  title: string;

  pdfUrl: string;
};

export default function ShareButton({
  title,
  pdfUrl,
}: Props) {

  const handleShare = async () => {

    try {

      const response =
        await fetch(pdfUrl);

      const blob =
        await response.blob();

      const file = new File(
        [blob],
        `${title}.pdf`,
        {
          type: "application/pdf",
        }
      );

      await navigator.share({

        title,

        text: title,

        files: [file],

      });

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <button
      onClick={handleShare}
      className="
        border
        border-gray-300
        px-4
        py-2
        rounded-xl
        bg-white
        hover:bg-gray-100
      "
    >
      Compartir PDF
    </button>

  );

}