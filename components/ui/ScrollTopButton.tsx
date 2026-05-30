"use client";

export default function ScrollTopButton() {

  const scrollToTop = () => {

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };

  return (

    <button
      onClick={scrollToTop}
      className="
        fixed
        bottom-6
        right-6
        z-50

        w-12
        h-12

        rounded-full

        bg-black
        text-white

        shadow-lg

        flex
        items-center
        justify-center

        text-xl

        hover:scale-105
        transition
      "
    >
      ↑
    </button>

  );

}