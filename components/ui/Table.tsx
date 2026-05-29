type Props = {
  children: React.ReactNode;
};

export function TableWrapper({ children }: Props) {

  return (

    <div className="bg-white rounded-2xl shadow overflow-x-auto">

      <table className="w-full min-w-[1100px]">
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