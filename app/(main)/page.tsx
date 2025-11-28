'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TbDownload, TbBook2, TbCircleFilled } from "react-icons/tb";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { IsLoadingBranding } from "@/lib/loading";
import { ButtonSky } from "@/components/ui/button";

const Dashboard = () => {

  const { LoadingBranding } = useBrandingContext();

  const manual_user = process.env.NEXT_PUBLIC_LINK_MANUAL_USER;

  if (LoadingBranding) {
    return (
      <IsLoadingBranding />
    )
  } else {
    return (
      <div className="flex flex-col gap-2">
        <div className="p-5 rounded-xl border border-emerald-500">
          <p className="flex items-center gap-1 font-bold">
            <TbCircleFilled color="green"/>
            Selamat Datang, di kertas kerja perencanaan
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 p-5 rounded-xl border border-sky-500">
          <h1 className="flex items-center gap-2">
            <TbBook2 className="font-bold text-4xl rounded-full p-1 border border-black" />
            Download Panduan Website (Manual User)
          </h1>
          <Link
            href={manual_user || "https://drive.google.com/drive/folders/1xFqVRchn8eCRtMLhWvqSb78qDxTXB9Y1?usp=sharing"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ButtonSky className="flex items-center gap-2">
              <TbDownload />
              Download
            </ButtonSky>
          </Link>
        </div>
      </div>
    )
  }
}

export default Dashboard;