"use client";

type Props = {
  title: string;
};

export default function ShareButton({
  title,
}: Props) {

  const handleShare = async () => {

    try {

      await navigator.share({

        title,

        text: title,

        url: window.location.href,

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
      Compartir
    </button>

  );

}