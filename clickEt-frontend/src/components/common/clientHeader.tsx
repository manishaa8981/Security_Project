import { Link, useNavigate } from "react-router-dom";
import { Button } from "../shadcn/button";
import { ModeToggle } from "../shadcn/theme-toggle";
import Menu from "../custom/ClientNavMenu";
import { useAuth } from "@/hooks/useAuth";
import { getNameInitials } from "@/utils/getNameInitials";
import { Camera, LogOut, MapPin, Settings, Ticket } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/shadcn/dialog";

import { useLogout, useProfileImageUpload } from "@/api/authApi";
import ImageUploader from "./ImageUploader";
import { useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";

const ClientHeader = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const { mutate: uploadImage, isPending } = useProfileImageUpload();
  const logoutMutation = useLogout();
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menuCfg = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Support", href: "/support" },
  ];

  return (
    <header className="absolute top-0 w-full flex justify-between z-10 p-4 space-x-4">
      <div className="place-content-center md:basis-[10%] shrink-0">
        <Link to={"/"}>
          <img src="src/assets/icons/logo/Logo.png" alt="ClickEt" width={50} />
        </Link>
      </div>
      <div className="hidden sm:flex gap-1.5 max-sm:pl-0 items-center border-primary">
        <button className="py-4 text-white flex gap-2 bg-secondary rounded-md items-center px-4">
          <MapPin size={22} className="text-primary" />
          <span className="hidden md:block text-primary hover:underline">
            Kathmandu
          </span>
        </button>
        <Menu config={menuCfg} />
      </div>
      <div className="space-x-2.5 flex justify-end items-center">
        <ModeToggle />
        {!isAuthenticated && (
          <div className="hidden sm:flex sm:flex-col md:flex-row gap-3 ">
            <Button
              onClick={() => {
                navigate("/login");
              }}
            >
              Sign in
            </Button>
            <Button
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </Button>
          </div>
        )}
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="rounded-full size-10 center bg-primary text-white cursor-pointer overflow-hidden">
                <img
                  className="bg-primary"
                  src={user?.profile_URL}
                  alt={getNameInitials(user?.full_name || "")}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
              <DropdownMenuLabel className="font-normal">
                {user?.full_name ?? "Profile Menu"}
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate("/admin/movies")}>
                <Settings />
                Visit Admin Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setUploaderOpen(true)}>
                <Camera />
                Change Profile Picture
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/bookings")}>
                <Ticket />
                View my Bookings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {/* Dialog for Image Uploader */}
      <Dialog open={uploaderOpen} onOpenChange={setUploaderOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogDescription></DialogDescription>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <ImageUploader
            uploadFn={uploadImage}
            imageURL={user?.profile_URL}
            fallbackText={getNameInitials(user?.full_name || "")}
            isUploading={isPending}
            buttonText="Upload Profile Image"
          />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default ClientHeader;
