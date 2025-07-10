import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/shadcn/dot-pattern";
import { useNavigate } from "react-router-dom";
import InteractiveHoverButton from "@/components/shadcn/interactive-hover-button";
import { ArrowRight } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative center h-screen w-full flex-col overflow-hidden bg-background md:shadow-xl gap-10">
      <div className="size-[150px]">
        <img src="src/assets/icons/logo/Logo.png" className="grayscale" />
      </div>
      <span className="text-primary text-2xl font-semibold text-wrap">
        You dont have authority to access this page!
      </span>
      <div className="flex flex-col sm:flex-row gap-5">
        <InteractiveHoverButton
          className="w-52 bg-stone-600"
          icon={<ArrowRight />}
          onClick={() => {
            navigate("/");
          }}
          text="Head back"
        />
        <InteractiveHoverButton
          className="w-60 bg-stone-600"
          icon={<ArrowRight />}
          onClick={() => {
            navigate("/login", {
              state: { 
                from: '/unauthorized',
                getPermission: true
              }
            });
          }}
          text="Get Permission"
        />
      </div>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
        )}
      />
    </div>
  );
};

export default UnauthorizedPage;