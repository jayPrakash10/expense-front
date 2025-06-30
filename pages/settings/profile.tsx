import { useEffect, useRef } from "react";
import Head from "next/head";
import AuthLayout from "@/components/layouts/auth";
import { useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { updateSettings } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";
import { api } from "@/services/api";
import { updateUser } from "@/store/slices/userSlice";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageMinus, ImagePlus, Loader2 } from "lucide-react";

type Props = {};

function Profile({}: Props) {
  const { user, settings } = useAppSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    profile_img: user?.profile_img || "",
  });

  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profile_img: user.profile_img || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateUser();
  };

  const handleUpdateUser = () => {
    api.user
      .update(formData)
      .then((res) => {
        if (!res.error) {
          dispatch(updateUser(formData));
          toast.success("Profile updated successfully", {
            duration: 4000,
            position: "top-center",
            classNames: {
              success: "!bg-green-600",
            },
          });
        }
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  const handleUpdateLanguage = (language: string) => {
    api.user.updateSettings({ language }).then((res) => {
      if (!res.error) {
        dispatch(updateSettings({ language }));
        toast.success("Language updated successfully", {
          duration: 4000,
          position: "top-center",
          classNames: {
            success: "!bg-green-600",
          },
        });
      }
    });
  };

  const handleUpdateCurrency = (currency: string) => {
    api.user.updateSettings({ currency }).then((res) => {
      if (!res.error) {
        dispatch(updateSettings({ currency }));
        toast.success("Currency updated successfully", {
          duration: 4000,
          position: "top-center",
          classNames: {
            success: "!bg-green-600",
          },
        });
      }
    });
  };

  const handleUpdateProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.files = null;

    const storageRef = ref(storage, `${user?._id}`);

    if (file) {
      setIsUploading(true);
      uploadBytesResumable(storageRef, file)
        .then(() => {
          getDownloadURL(storageRef).then((url) => {
            setFormData((prev) => ({
              ...prev,
              profile_img: url,
            }));

            api.user.update({ profile_img: url }).then((res) => {
              if (!res.error) {
                dispatch(updateUser({ profile_img: url }));
                toast.success("Profile Image updated", {
                  duration: 4000,
                  position: "top-center",
                  classNames: {
                    success: "!bg-green-600",
                  },
                });
              }
            });
          });
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  };

  const removeProfileImage = () => {
    api.user.update({ profile_img: "" }).then((res) => {
      if (!res.error) {
        dispatch(updateUser({ profile_img: "" }));
        toast.success("Profile Image removed", {
          duration: 4000,
          position: "top-center",
          classNames: {
            success: "!bg-green-600",
          },
        });
      }
    });
  };

  const openImageUpload = () => {
    avatarRef.current?.click();
  };

  return (
    <>
      <Head>
        <title>Profile | Expense</title>
      </Head>
      <AuthLayout>
        <div className="py-4">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Profile Settings</h1>
            </div>

            {/* Profile Card */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="size-16">
                      <Input
                        ref={avatarRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUpdateProfileImage}
                        title="Upload Profile Image"
                        className="h-full w-full absolute cursor-pointer hidden"
                      />
                      <AvatarImage src={user?.profile_img} alt={user?.name} />
                      <AvatarFallback className="text-2xl bg-primary">
                        {user?.name?.slice(0, 1)}
                      </AvatarFallback>
                      {isUploading && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      )}
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={openImageUpload}>
                      <ImagePlus className="h-4 w-4" /> Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={removeProfileImage}>
                      <ImageMinus className="h-4 w-4" /> Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div>
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-2"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      className="mt-2"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 9876540123"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-2"
                      maxLength={10}
                      onKeyDown={(e) => {
                        if (
                          !e.key.match(/[^0-9]/g) ||
                          e.key.startsWith("Arrow") ||
                          e.key === "Backspace"
                        ) {
                          return;
                        }
                        e.preventDefault();
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold">User Configurations</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Language */}
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value: string) =>
                      handleUpdateLanguage(value)
                    }
                  >
                    <SelectTrigger className="mt-2 w-44">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                      <SelectItem value="marathi">Marathi</SelectItem>
                      <SelectItem value="bengali">Bengali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Currency */}
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value: string) =>
                      handleUpdateCurrency(value)
                    }
                  >
                    <SelectTrigger className="mt-2 w-44">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}

export default Profile;
