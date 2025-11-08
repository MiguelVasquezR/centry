"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, BookOpen, Library, User, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { signUpWithEmail } from "@/src/firebase/auth";

// Zod schema for signup validation
const signupSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const { user, error } = await signUpWithEmail(
        data.email,
        data.password,
        data.displayName
      );

      if (error) {
        toast.error("Error al crear la cuenta. Inténtalo de nuevo.");
        return;
      }

      if (user) {
        toast.success(
          "¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta."
        );
        router.push("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Error al crear la cuenta. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <br />
      {/* Background with floating books animation */}
      <div className="floating-books">
        <div className="book book-1">📚</div>
        <div className="book book-2">📖</div>
        <div className="book book-3">📕</div>
        <div className="book book-4">📗</div>
        <div className="book book-5">📘</div>
        <div className="book book-6">📙</div>
      </div>

      <div className="signup-wrapper">
        <div className="signup-card">
          {/* Header */}
          <div className="signup-header">
            <div className="logo-container">
              <Library className="logo-icon" size={48} />
              <h1 className="logo-text">Letras Documental</h1>
            </div>
            <p className="signup-subtitle">
              Crea tu cuenta y comienza tu biblioteca digital
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
            <div className="form-group">
              <label className="form-label">
                <User size={20} />
                Nombre completo
              </label>
              <input
                type="text"
                className={`form-input ${errors.displayName ? "error" : ""}`}
                placeholder="Tu nombre completo"
                {...register("displayName")}
              />
              {errors.displayName && (
                <span className="error-message">
                  {errors.displayName.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={20} />
                Email
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="tu@email.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={20} />
                Contraseña
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Tu contraseña"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={20} />
                Confirmar contraseña
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-input ${
                    errors.confirmPassword ? "error" : ""
                  }`}
                  placeholder="Confirma tu contraseña"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`signup-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <BookOpen size={20} />
                  Crear mi cuenta
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="signup-footer">
            <p>
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="login-link">
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .signup-container {
          min-height: 100vh;
          background: white;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-books {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .book {
          position: absolute;
          font-size: 2rem;
          animation: float 6s ease-in-out infinite;
          opacity: 0.1;
        }

        .book-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        .book-2 {
          top: 20%;
          right: 15%;
          animation-delay: 1s;
        }
        .book-3 {
          top: 40%;
          left: 5%;
          animation-delay: 2s;
        }
        .book-4 {
          top: 60%;
          right: 10%;
          animation-delay: 3s;
        }
        .book-5 {
          top: 80%;
          left: 20%;
          animation-delay: 4s;
        }
        .book-6 {
          top: 30%;
          right: 30%;
          animation-delay: 5s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .signup-wrapper {
          width: 100%;
          max-width: 450px;
          padding: 20px;
          z-index: 10;
        }

        .signup-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .signup-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 10px;
        }

        .logo-icon {
          color: #667eea;
        }

        .logo-text {
          font-size: 1.8rem;
          font-weight: 700;
          color: #667eea;
        }

        .signup-subtitle {
          color: #999;
          font-size: 0.9rem;
        }

        .signup-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #667eea;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input.error {
          border-color: #e74c3c;
        }

        .password-input-container {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        .error-message {
          color: #e74c3c;
          font-size: 0.8rem;
          margin-top: 5px;
          display: block;
        }

        .signup-button {
          width: 100%;
          padding: 14px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .signup-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .signup-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .signup-button.loading {
          background: #999;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .signup-footer {
          text-align: center;
          color: #666;
          font-size: 0.9rem;
        }

        .login-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .signup-card {
            padding: 30px 20px;
            margin: 10px;
          }

          .logo-text {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;
