"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, BookOpen, Library, User, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { signInWithEmail, resetPassword } from "@/src/firebase/auth";

// Zod schema for login validation
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const { user, error } = await signInWithEmail(data.email, data.password);

      if (error) {
        toast.error("Error al iniciar sesión. Verifica tus credenciales.");
        return;
      }

      if (user) {
        toast.success("¡Bienvenido a tu biblioteca digital!");
        router.push("/book");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = (
      document.querySelector('input[type="email"]') as HTMLInputElement
    )?.value;

    if (!email) {
      toast.error("Por favor, ingresa tu email primero");
      return;
    }

    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error("Error al enviar el email de recuperación");
      } else {
        toast.success(
          "Email de recuperación enviado. Revisa tu bandeja de entrada."
        );
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error("Error al enviar el email de recuperación:", error);
      toast.error("Error al enviar el email de recuperación");
    }
  };

  return (
    <div className="login-container">
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

      <div className="login-wrapper">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="logo-container">
              <Library className="logo-icon" size={48} />
              <h1 className="logo-text">Letras Documental</h1>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
              <label className="form-label">
                <User size={20} />
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

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Recordarme
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="forgot-password"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className={`login-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <BookOpen size={20} />
                  Acceder a mi biblioteca
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="login-footer">
            <p>
              ¿No tienes cuenta?{" "}
              <a href="/signup" className="signup-link">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Recuperar Contraseña</h3>
            <p>
              Ingresa tu email y te enviaremos un enlace para restablecer tu
              contraseña.
            </p>
            <div className="modal-actions">
              <button
                onClick={handleForgotPassword}
                className="modal-button primary"
              >
                Enviar Email
              </button>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="modal-button secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .login-container {
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

        .login-wrapper {
          width: 100%;
          max-width: 400px;
          padding: 20px;
          z-index: 10;
        }

        .login-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .login-header {
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
          color: #00d1b2;
        }

        .logo-text {
          font-size: 1.8rem;
          font-weight: 700;
          color: #00d1b2;
        }

        .login-subtitle {
          color: #999;
          font-size: 0.9rem;
        }

        .login-form {
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
          color: #00d1b2;
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
          border-color: #00d1b2;
          box-shadow: 0 0 0 3px rgba(0, 209, 178, 0.1);
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
          color: #00d1b2;
        }

        .error-message {
          color: #e74c3c;
          font-size: 0.8rem;
          margin-top: 5px;
          display: block;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          font-size: 0.9rem;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #999;
        }

        .checkbox-container input {
          margin-right: 8px;
        }

        .forgot-password {
          color: #00d1b2;
          text-decoration: none;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          font-size: inherit;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background: #00d1b2;
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

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 209, 178, 0.3);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-button.loading {
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

        .login-footer {
          text-align: center;
          color: #666;
          font-size: 0.9rem;
        }

        .signup-link {
          color: #00d1b2;
          text-decoration: none;
          font-weight: 600;
        }

        .signup-link:hover {
          text-decoration: underline;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 15px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-content h3 {
          color: #00d1b2;
          margin-bottom: 15px;
          font-size: 1.5rem;
        }

        .modal-content p {
          color: #666;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .modal-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-button.primary {
          background: #00d1b2;
          color: white;
        }

        .modal-button.primary:hover {
          background: #00c4a7;
          transform: translateY(-2px);
        }

        .modal-button.secondary {
          background: #f8f9fa;
          color: #666;
          border: 1px solid #e1e5e9;
        }

        .modal-button.secondary:hover {
          background: #e9ecef;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
            margin: 10px;
          }

          .logo-text {
            font-size: 1.5rem;
          }

          .modal-content {
            padding: 20px;
            margin: 20px;
          }

          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
