"use server";

import { signIn, signOut } from "@/auth";
import { registerFormSchema, signInFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";

// Sign in user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { success: false, message: "Invalid email or password" };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}

// Register user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = registerFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: formData.get("password"), // Plain password
    });

    return {
      success: true,
      message: "User registered successfuly",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { success: false, message: formatError(error) };
  }
}
