type Props = {
  children: React.ReactNode;
};

export function TableWrapper({ children }: Props) {

  return (

    <div className="
      w-full
      overflow-x-auto
      bg-white
      rounded-2xl
      shadow
    ">

      <table className="
        w-full
        min-w-[900px]
      ">

        {children}

      </table>

    </div>

  );

}

export function Th({ children }: Props) {

  return (

    <th className="px-6 py-4 text-left bg-gray-100 font-semibold">

      {children}

    </th>

  );

}

export function Td({ children }: Props) {

  return (

    <td className="px-6 py-4">

      {children}

    </td>

  );

}