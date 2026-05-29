type Props = {
  children: React.ReactNode;
};

export default function InfoSection({
  children,
}: Props) {

  return (

    <div className="space-y-2 mb-6">

      {children}

    </div>

  );

}