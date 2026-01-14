"use client";

import { useEffect } from "react";
import { useGetMeQuery } from "@/store/api/auth.api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, logout } from "@/store/slices/auth.slice";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const { data, isError } = useGetMeQuery(undefined);

  useEffect(() => {
    if (data) {
      dispatch(setCredentials({ user: data }));
    }

    if (isError) {
      dispatch(logout());
    }
  }, [data, isError, dispatch]);

  return null;
}
