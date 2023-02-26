"use client";
import React from "react";
export default function Page({}) {
  React.useEffect(() => {
    const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    document.getElementById("hecker-text")?.addEventListener("mouseover", (ev) => {
      ev.preventDefault();
      if (!ev.target) return;
      console.log(ev?.target);
    });
  }, []);
  return (
    <>
      <h1 id="hecker-text" data-value="Blackhole">
        Blackhole
      </h1>
    </>
  );
}
