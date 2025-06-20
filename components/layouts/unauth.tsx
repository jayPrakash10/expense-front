import Image from "next/image";
import React from "react";

type Props = {
  children: React.ReactNode;
  bgImage?: string;
};

const UnauthLayout = (props: Props) => {
  return (
    <div className="flex items-center justify-center h-screen relative">
      <div className="z-10 flex-1 flex items-center justify-center h-screen p-8">{props.children}</div>
      <div className="absolute lg:relative flex-1 flex items-center justify-center h-screen lg:rounded-l-2xl overflow-hidden bg-blue-950/30">
        <Image
          src={props.bgImage || "/images/auth-image.jpg"}
          alt="Login"
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default UnauthLayout;
