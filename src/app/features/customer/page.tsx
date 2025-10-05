"use client";

import { useState, type FormEvent } from "react";

import PasswordStrengthIndicator from "@/app/shared/components/PasswordStrenghtIndicator";


export default function CustomerRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    console.log("Customer account created:", { email, password });
  };

  return (
      <h1 className="text-2xl font-bold mb-4">WAIT LANG DITO NA LALAGAT YUNG KAILANGAN NG USER</h1>
    
  );
}
