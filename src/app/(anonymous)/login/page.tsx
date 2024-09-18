import LoginForm from "@/components/forms/auth/login-form/LoginForm";

export async function generateMetadata() {
  return {
    title: "Login",
  };
}
export default async function LoginPage() {
  return <LoginForm />;
}
