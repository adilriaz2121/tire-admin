import React from "react";
import Login from "@/components/auth/login";
const login = ({ searchParams }: { searchParams: { error?: string } }) => {
  return <Login searchParams={searchParams} />;
};

export default login;
