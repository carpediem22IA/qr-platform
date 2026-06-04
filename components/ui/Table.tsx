type Props = {
  children: React.ReactNode;
  className?: string;
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

export function Th({
  children,
  className = "",
}: Props) {
  return (
    <th
      className={`px-6 py-4 text-left bg-gray-100 font-semibold ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
}: Props) {
  return (
    <td className={`px-6 py-4 ${className}`}>
      {children}
    </td>
  );
}