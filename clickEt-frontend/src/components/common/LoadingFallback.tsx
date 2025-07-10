import Ripple from "@/components/shadcn/ripple";

const Test = () => {
  return (
    <div className="bg-background min-h-screen w-full">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden border md:shadow-xl">
        <div className="size-[150px]">
          <img src="src/assets/icons/logo/Logo.png" />
        </div>
        <Ripple />
      </div>
    </div>
  );
};

export default Test;
