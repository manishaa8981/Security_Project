"use client";

import { ChevronsUpDown, LogOut, PictureInPicture } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/shadcn/sidebar";
import { useLogout, useProfileImageUpload } from "@/api/authApi";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/shadcn/dialog";
import ImageUploader from "../common/ImageUploader";
import { useState } from "react";
import { getNameInitials } from "@/utils/getNameInitials";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    profile_URL: string;
  };
}) {
  const { isMobile } = useSidebar();
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const { mutate: uploadImage, isPending } = useProfileImageUpload();

  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.profile_URL} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {getNameInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.profile_URL} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setUploaderOpen(true)}>
                  <PictureInPicture />
                  Change Profile Picture
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Dialog for Image Uploader */}
    <Dialog open={uploaderOpen} onOpenChange={setUploaderOpen}>
      <DialogContent className="max-w-md bg-background">
        <DialogTitle>Change Profile Picture</DialogTitle>
        <ImageUploader
          uploadFn={uploadImage}
          imageURL={user?.profile_URL}
          fallbackText={getNameInitials(user?.name)}
          isUploading={isPending}
          buttonText="Upload Profile Image"
        />
      </DialogContent>
    </Dialog>
    </>
  );
}
