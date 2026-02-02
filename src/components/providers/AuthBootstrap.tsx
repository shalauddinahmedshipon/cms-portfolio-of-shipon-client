"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetMeQuery } from "@/store/api/auth.api";
import { setCredentials, logout } from "@/store/slices/auth.slice";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.accessToken);

  const { data, error } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data && token) {
      dispatch(
        setCredentials({
          user: data,
          accessToken: token,
        })
      );
    }

    if (error) {
      dispatch(logout());
    }
  }, [data, error, token, dispatch]);

  return null;
}
