import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import api from "@/utils/api";
import { CopyCheckIcon, CopyIcon, Edit, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  pin?: string | null;
  url?: string | null;
};

export type UniqueKeyPayload = {
  unique_key: string;
};

export type PinGenerateResponse = {
  pin: string;
  expires_at?: string;
  url?: string;
};

export type UniqueKeyUpdateResponse = {
  success: boolean;
  message: string;
  url?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const PinGenerate = (props: Props) => {
  const { pin, url } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [uniqueKey, setUniqueKey] = useState<string>("");
  const [pinGenerateResponseData, setPinGenerateResponseData] = useState({
    status: "idle" as "loading" | "success" | "error" | "idle",
    data: {} as PinGenerateResponse,
  });
  const [pinReGenerateResponseData, setPinReGenerateResponseData] = useState({
    status: "idle" as "loading" | "success" | "error" | "idle",
    data: {} as PinGenerateResponse,
  });
  const [uniqueKeyUpdateResponseData, setUniqueKeyUpdateResponseData] =
    useState({
      status: "idle" as "loading" | "success" | "error" | "idle",
      data: {} as UniqueKeyUpdateResponse,
    });
  const [copyStatusForPIn, setCopyStatusForPIN] = useState(false);
  const [copyStatusForURL, setCopyStatusForURL] = useState(false);

  useEffect(() => {
    if (pin !== null && url !== null) {
      setPinGenerateResponseData({
        status: "success",
        data: { pin: String(pin), url: String(url) },
      });
    }
  }, [pin, url]);

  useEffect(() => {
    // set default unique key from url
    if (
      pinGenerateResponseData.status === "success" &&
      pinGenerateResponseData.data.url
    ) {
      const urlParts = pinGenerateResponseData.data.url.split("/");
      const uKey = urlParts[urlParts.length - 1];
      setUniqueKey(uKey);
    }
  }, [pinGenerateResponseData]);

  // const { user } = useSelector((state: RootState) => state.auth);

  const validation = () => {
    if (uniqueKey.trim() === "") {
      toast({
        title: "Unique key is required",
      });
      return false;
    }

    // if(uniqueKey.length!==17){
    //   toast({
    //     title: "Unique key must be 17 characters",
    //   });
    //   return false;
    // }
    return true;
  };

  const handlePinGenerate = async () => {
    try {
      setPinGenerateResponseData({
        ...pinGenerateResponseData,
        status: "loading",
      });

      const response = await api.get<PinGenerateResponse>("/doctor/share-pin");

      setPinGenerateResponseData({
        status: "success",
        data: response.data,
      });

      toast({
        title: "Pin generated successfully ✅",
      });
    } catch (error: any) {
      setPinGenerateResponseData({
        status: "error",
        data: {} as PinGenerateResponse,
      });

      const errorResponse = error.response.data.errors.unique_key;

      if (errorResponse) {
        toast({
          title: errorResponse[0],
        });
        return;
      }

      toast({
        title: "Pin generation failed",
      });
    }
  };

  const handleRefreshPin = async () => {
    try {
      setPinReGenerateResponseData({
        ...pinReGenerateResponseData,
        status: "loading",
      });

      const response = await api.get<PinGenerateResponse>("/doctor/share-pin");

      setPinGenerateResponseData({
        status: "success",
        data: response.data,
      });

      setPinReGenerateResponseData({
        status: "success",
        data: response.data,
      });

      toast({
        title: "Pin generated successfully ✅",
      });
    } catch (error: any) {
      setPinReGenerateResponseData({
        status: "error",
        data: {} as PinGenerateResponse,
      });

      const errorResponse = error.response.data.errors.unique_key;

      if (errorResponse) {
        toast({
          title: errorResponse[0],
        });
        return;
      }

      toast({
        title: "Pin generation failed",
      });
    }
  };

  const randomNumber = (length: number): string => {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, "0");
  };

  async function copyText(text: string) {
    // Must be triggered by a real user click
    if (!text) throw new Error("Nothing to copy");

    // Preferred path
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // Fallback: hidden textarea + execCommand
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    // place off-screen but visible enough for iOS
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);

    // iOS requires selection inside input/textarea
    ta.select();
    ta.setSelectionRange(0, ta.value.length);

    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    if (!ok) throw new Error("Copy failed");
  }

  const handleCopytoClipboardPIN = async () => {
    try {
      const pin = pinGenerateResponseData?.data?.pin;
      await copyText(pin);
      toast({ title: "PIN copied to clipboard" });
      setCopyStatusForPIN(true);
      setTimeout(() => setCopyStatusForPIN(false), 4000);
    } catch (e) {
      toast({ title: "Could not copy PIN", description: (e as Error).message });
    }
  };

  const handleCopytoClipboardURL = async () => {
    try {
      const path = pinGenerateResponseData?.data?.url;
      const fullUrl = `${BASE_URL}${path ?? ""}`;
      await copyText(fullUrl);
      toast({ title: "URL copied to clipboard" });
      setCopyStatusForURL(true);
      setTimeout(() => setCopyStatusForURL(false), 4000);
    } catch (e) {
      toast({ title: "Could not copy URL", description: (e as Error).message });
    }
  };

  const handleEdit = () => {
    setOpen(true);
  };

  const handleUniqueKeyUpdate = async () => {
    try {
      if (!validation()) return;

      setUniqueKeyUpdateResponseData({
        ...uniqueKeyUpdateResponseData,
        status: "loading",
      });

      const payload: UniqueKeyPayload = {
        unique_key: uniqueKey,
      };

      const response = await api.post<UniqueKeyUpdateResponse>(
        "/profile/share/ukey/update",
        payload
      );

      if (!response.data.success) {
        toast({
          title: response.data.message ?? "Invalid or expired token/pin",
        });
        return;
        // setMsg(data?.message ?? "Invalid or expired token/pin");
      }

      setUniqueKeyUpdateResponseData({
        status: "success",
        data: response.data,
      });

      // just update url in pinGenerateResponseData state
      if (response.data.url) {
        setPinGenerateResponseData({
          ...pinGenerateResponseData,
          data: {
            ...pinGenerateResponseData.data,
            url: response.data.url,
          },
        });
      }

      setOpen(false);

      toast({
        title: "Unique key updated successfully",
      });
    } catch (error: any) {
      toast({
        title: error.message,
      });

      setUniqueKeyUpdateResponseData({
        status: "error",
        data: {} as UniqueKeyUpdateResponse,
      });
    }
  };

  return (
    <>
      <div className="mt-4">
        {pinGenerateResponseData.status !== "success" && (
          <Button
            className="cursor-pointer"
            onClick={handlePinGenerate}
            disabled={pinGenerateResponseData.status === "loading"}
          >
            {pinGenerateResponseData.status === "loading"
              ? "Generating..."
              : "Generate Pin"}
          </Button>
        )}

        <div className="mt-4">
          {pinGenerateResponseData.status === "success" && (
            <div className="p-4 text-sm text-left">
              <div className="flex gap-4 items-center mb-2">
                <p>
                  <strong>PIN:</strong> {pinGenerateResponseData.data.pin}
                </p>
                <div>
                  {/* copy button */}
                  <Button
                    className={`cursor-pointer mr-2 p-0 ${
                      copyStatusForPIn
                        ? "bg-green-700 text-white"
                        : "bg-white text-black hover:text-white"
                    } border-1 border-black`}
                    aria-label="Copy to clipboard"
                    title="Copy to clipboard"
                    onClick={handleCopytoClipboardPIN}
                    disabled={copyStatusForPIn}
                  >
                    {copyStatusForPIn ? <CopyCheckIcon /> : <CopyIcon />}
                  </Button>
                  {/* re-generate button */}
                  <Button
                    className={`cursor-pointer mr-2 p-0 bg-white text-black hover:text-white border-1 border-black`}
                    onClick={handleRefreshPin}
                    disabled={pinReGenerateResponseData.status === "loading"}
                  >
                    {pinReGenerateResponseData.status === "loading" ? (
                      "Generating..."
                    ) : (
                      <RefreshCw />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex gap-4 items-center mb-2">
                <a className="truncate max-w-xs">
                  <strong className="text-black">URL:</strong>
                  {BASE_URL}
                  {pinGenerateResponseData.data.url}
                </a>
                {/* <p>
                <strong>Expires At:</strong>{" "}
                {new Date(
                  pinGenerateResponseData.data.expires_at
                ).toLocaleString()}
              </p> */}
                <div className="flex items-center">
                  {/* copy button */}
                  <Button
                    className={`cursor-pointer mr-2 ${
                      copyStatusForURL
                        ? "bg-green-700 text-white"
                        : "bg-white text-black hover:text-white"
                    } border-1 border-black`}
                    aria-label="Copy to clipboard"
                    title="Copy to clipboard"
                    onClick={handleCopytoClipboardURL}
                    disabled={copyStatusForURL}
                  >
                    {copyStatusForURL ? <CopyCheckIcon /> : <CopyIcon />}
                  </Button>
                  {/* edit button */}
                  <Button
                    className="cursor-pointer bg-white text-black hover:text-white border-1 border-black mr-2"
                    onClick={handleEdit}
                  >
                    <Edit />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="grid gap-4">
            <DialogTitle>Edit URL</DialogTitle>

            <div className="grid gap-2">
              <Input
                placeholder="Enter uique key"
                onChange={(e) => setUniqueKey(e.target.value)}
                value={uniqueKey}
              />
            </div>

            <div className="mt-4">
              <Button
                className="cursor-pointer"
                onClick={handleUniqueKeyUpdate}
                disabled={uniqueKeyUpdateResponseData.status === "loading"}
              >
                {uniqueKeyUpdateResponseData.status === "loading"
                  ? "Updating..."
                  : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PinGenerate;
