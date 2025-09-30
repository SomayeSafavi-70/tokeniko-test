"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, fetchUsers, login } from "../core/_requests";
import { toast } from "react-toastify";
import { getAxiosErrorMessage } from "@/lib/http-error";

export function useUsersQuery() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 30_000,
  });
}

export function useCreateUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ["users"] });
      const name = data?.name || data?.username || "کاربر";
      toast.success(`ثبت‌نام با موفقیت انجام شد. خوش آمدید ${name}!`);
    },
    onError: (err) => {
      toast.error(getAxiosErrorMessage(err));
    },
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) =>
      login(identifier, password),
    onSuccess: (data: any) => {
      const name = data?.user?.name || data?.user?.username || "کاربر";
      toast.success(`خوش آمدید ${name} 👋`);
    },
    onError: (err) => {
      toast.error(getAxiosErrorMessage(err));
    },
  });
}
