import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Text,
} from "@react-email/components";
import * as React from "react";
import { ReactNode } from "react";
import { serverEnv } from "@/env.server.mjs";
import { APP_NAME } from "@/settings";

export const emailBaseUrl = serverEnv.BASE_URL;

export const EmailLayout = ({ children }: { children: ReactNode }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${emailBaseUrl}/logo-email.jpg`}
          width="60"
          height="60"
          alt="Logo"
        />
        {children}
        <Text style={footer}>{APP_NAME}</Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

export const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

export const title = {
  fontSize: "24px",
  lineHeight: 1.25,
};

export const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};

export const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
};

export const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px",
};

export const links = {
  textAlign: "center" as const,
};

export const link = {
  color: "#0366d6",
  fontSize: "12px",
};

export const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "60px",
};
