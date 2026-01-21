//app/lib/ecryptUser.ts
"use client";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { IDecodedJWT, TokenData } from "@/interfaces/auth";
const cookies = new Cookies();

export const decryptUser = () => {
  const encryptedUserCookie = cookies.get("token");

  if (!encryptedUserCookie) {
    return;
  } else {
    try {
      if (!encryptedUserCookie) {
        console.log("Failed to decrypt token");
        return null;
      }
      console.log("I am token", encryptedUserCookie);
      return encryptedUserCookie;
    } catch (error) {
      console.log("Decryption or parsing failed:", error);
      return null;
    }
  }
};

export const getAccessToken = () => {
  const encryptedUserCookie = cookies.get("token");
  if (!encryptedUserCookie) {
    return;
  } else {
    if (!encryptedUserCookie) {
      console.log("Invalid token structure");
    }
    return encryptedUserCookie.accessToken;
  }
};

export const decodeAccessToken = () => {
  const encryptedUserCookie = cookies.get("token");
  if (!encryptedUserCookie) {
    return;
  } else {
    if (!encryptedUserCookie) {
      console.log("Invalid token structure");
    }
    const decodedUserData: IDecodedJWT = jwtDecode(
      encryptedUserCookie.accessToken
    );
    return decodedUserData;
  }
};

export const getRefreshToken = () => {
  const encryptedUserCookie = cookies.get("token");

  if (!encryptedUserCookie) {
    return;
  } else {
    try {
      if (!encryptedUserCookie.refreshToken) {
        console.log(
          "accessToken missing in decrypted data",
          encryptedUserCookie
        );
        return null;
      }
      return encryptedUserCookie.refreshToken;
    } catch (error) {
      console.log("Decryption or parsing failed:", error);
      return null;
    }
  }
};

export const encryptToken = (token: TokenData) => {
  cookies.remove("token", {
    path: "/",
    secure: true,
    sameSite: "lax",
  });
  cookies.set("token", token, {
    path: "/",
    secure: true,
    sameSite: "lax",
  });
};