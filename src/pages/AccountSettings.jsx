import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImagePlus,
  LockKeyhole,
  LogOut,
  Mail,
  Save,
  UserRound,
} from "lucide-react";

import { updateProfile } from "firebase/auth";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";

// =====================================================
// CLOUDINARY CONFIG
// =====================================================

const CLOUDINARY_CLOUD_NAME = "u4jjuiur";
const CLOUDINARY_UPLOAD_PRESET = "noor_profile";

function AccountSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changingPassword, setChangingPassword] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Noor User";

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const handleProfileImageClick = () => {
    if (uploadingImage) return;

    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];

    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    if (!auth.currentUser) {
      toast.error(
        "Your session has expired. Please login again."
      );
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.secure_url) {
        console.error("Cloudinary error:", data);

        throw new Error(
          data?.error?.message ||
            "Unable to upload profile image."
        );
      }

      await updateProfile(auth.currentUser, {
        photoURL: data.secure_url,
      });

      toast.success(
        "Profile photo updated successfully!"
      );

      window.location.reload();
    } catch (error) {
      console.error(
        "Profile image upload error:",
        error
      );

      toast.error(
        error?.message ||
          "Unable to update profile photo."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // =====================================================
  // UPDATE NAME
  // =====================================================

  const handleUpdateName = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    if (!auth.currentUser) {
      toast.error(
        "Your session has expired. Please login again."
      );
      return;
    }

    try {
      setSavingName(true);

      await updateProfile(auth.currentUser, {
        displayName: trimmedName,
      });

      toast.success("Name updated successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Name update error:", error);

      toast.error(
        error?.message ||
          "Unable to update your name."
      );
    } finally {
      setSavingName(false);
    }
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (
      !auth.currentUser ||
      !auth.currentUser.email
    ) {
      toast.error(
        "Your session has expired. Please login again."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const credential =
        EmailAuthProvider.credential(
          auth.currentUser.email,
          currentPassword
        );

      await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );

      await updatePassword(
        auth.currentUser,
        newPassword
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success(
        "Password changed successfully!"
      );
    } catch (error) {
      console.error(
        "Password change error:",
        error
      );

      if (
        error?.code ===
          "auth/invalid-credential" ||
        error?.code === "auth/wrong-password"
      ) {
        toast.error(
          "Current password is incorrect."
        );
      } else if (
        error?.code === "auth/weak-password"
      ) {
        toast.error(
          "New password is too weak."
        );
      } else {
        toast.error(
          error?.message ||
            "Unable to change your password."
        );
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      navigate("/", { replace: true });

      await logout();
    } catch (error) {
      console.error("Logout error:", error);

      navigate("/account-settings", {
        replace: true,
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-77px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* TOP */}

        <div className="mb-7">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <UserRound className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                Noor Islamic
              </p>

              <h1 className="mt-1 text-2xl font-black text-slate-800 sm:text-3xl">
                Account Settings
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your profile information and account
            security from one place.
          </p>
        </div>

        {/* PROFILE */}

        <section className="mb-6 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-black text-slate-800">
                  Profile Information
                </h2>

                <p className="text-xs text-slate-400">
                  Update your personal information
                </p>
              </div>

            </div>
          </div>

          <div className="p-6 sm:p-8">

            {/* AVATAR */}

            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center">

              <div className="relative h-20 w-20 shrink-0">

                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50">

                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound className="h-9 w-9" />
                  )}

                </div>

                <button
                  type="button"
                  onClick={handleProfileImageClick}
                  disabled={uploadingImage}
                  aria-label="Change profile photo"
                  className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-emerald-600 text-white shadow-md transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingImage ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>

              </div>

              <div className="min-w-0">

                <h3 className="font-bold text-slate-800">
                  {displayName}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {user?.email}
                </p>

                <button
                  type="button"
                  onClick={handleProfileImageClick}
                  disabled={uploadingImage}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ImagePlus className="h-3.5 w-3.5" />

                  {uploadingImage
                    ? "Uploading..."
                    : "Change profile photo"}
                </button>

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleProfileImageChange}
                className="hidden"
              />

            </div>

            <div className="mb-7 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
              <p className="text-xs leading-5 text-emerald-700">
                Choose a JPG, PNG or WebP image. Maximum
                file size is 5MB.
              </p>
            </div>

            {/* NAME */}

            <form onSubmit={handleUpdateName}>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Display Name
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">

                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                  />

                </div>

                <button
                  type="submit"
                  disabled={savingName}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingName ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Name
                    </>
                  )}
                </button>

              </div>

            </form>

            {/* EMAIL */}

            <div className="mt-6">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email Address
              </label>

              <div className="relative">

                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-sm font-medium text-slate-500 outline-none"
                />

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Your email address is managed by Firebase
                Authentication.
              </p>

            </div>

          </div>
        </section>

        {/* PASSWORD */}

        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <LockKeyhole className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-black text-slate-800">
                  Password & Security
                </h2>

                <p className="text-xs text-slate-400">
                  Keep your Noor account secure
                </p>
              </div>

            </div>

          </div>

          <div className="p-6 sm:p-8">

            <form onSubmit={handleChangePassword}>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Current Password
                  </label>

                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(e.target.value)
                    }
                    placeholder="Current password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    New Password
                  </label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    placeholder="New password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                  />
                </div>

              </div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs leading-5 text-slate-400">
                  Password must contain at least 6 characters.
                </p>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {changingPassword ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Change Password
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        </section>

        {/* LOGOUT */}

        <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="font-black text-slate-800">
                Sign out of Noor
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Sign out from this account on this device.
              </p>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-bold text-red-500 transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />

              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </button>

          </div>
        </section>

      </div>
    </main>
  );
}

export default AccountSettings;