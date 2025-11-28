'use client'

import { createContext, useContext } from "react"
import { getOpdTahun, getUser } from "@/lib/cookie";
import { useState, useEffect, useCallback } from "react";

interface OptionType {
  value: number;
  label: string;
}
interface OptionTypeString {
  value: string;
  label: string;
}

interface BrandingContextType {
  title: string;
  clientName: string;
  logo: string;
  LoadingBranding: boolean;
  branding: {
    title: string;
    client: string;
    logo: string;
    api_perencanaan: string;
    api_permasalahan: string;
    api_csf: string;
    tahun: OptionType | null | undefined;
    opd: OptionTypeString | null | undefined;
    user: any;
  }
}

const appName = process.env.NEXT_PUBLIC_APP_NAME || "";
const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME || "";
const logo = process.env.NEXT_PUBLIC_LOGO_URL || "";
const api_perencanaan = process.env.NEXT_PUBLIC_API_URL || "";
const api_csf = process.env.NEXT_PUBLIC_API_URL_CSF || "";
const api_permasalahan = process.env.NEXT_PUBLIC_API_URL_PERMASALAHAN || "";

// context
const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: Readonly<{ children: React.ReactNode; }>) {

  const [Tahun, setTahun] = useState<OptionType | null>(null);
  const [SelectedOpd, setSelectedOpd] = useState<OptionTypeString | null>(null);
  const [User, setUser] = useState<any>(null);

  const [Loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (data) {
          if (data.tahun) {
            const valueTahun = {
              value: data.tahun.value,
              label: data.tahun.label
            }
            setTahun(valueTahun);
          }
          if (data.opd) {
            const valueOpd = {
              value: data.opd.value,
              label: data.opd.label
            }
            setSelectedOpd(valueOpd);
          }
          if (fetchUser) {
            setUser(fetchUser.user);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBranding();
  }, [])

  return (
    <BrandingContext.Provider
      value={{
        title: appName,
        clientName: clientName,
        logo: logo,
        LoadingBranding: Loading,
        branding: {
          title: appName,
          client: clientName,
          logo: logo,
          api_perencanaan: api_perencanaan,
          api_csf: api_csf,
          api_permasalahan: api_permasalahan,
          tahun: Tahun,
          opd: SelectedOpd,
          user: User

        }
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
}

export function useBrandingContext() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error("useBrandingContext must be used witihin a BrandingProvider")
  }
  return context;
}
