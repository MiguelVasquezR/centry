"use client";

import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface PageHeaderProps {
  title: string;
  description?: string;
  backLabel?: string;
  onBack?: () => void;
  hideBack?: boolean;
  actions?: ReactNode;
  badges?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const PageHeader = ({
  title,
  description,
  backLabel = "Volver",
  onBack,
  hideBack = false,
  actions,
  badges,
  children,
  className,
}: PageHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <div
      className={clsx("card mb-5 page-header-card", className)}
      style={{
        borderRadius: "24px",
        border: "none",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
        background: "linear-gradient(180deg, #ffffff 0%, #fbfbff 100%)",
        marginBottom: "1.5rem",
      }}
    >
      <div className="card-content">
        <div className="is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap is-gap-3">
          <div className="is-flex is-align-items-center is-gap-4">
            {!hideBack && (
              <button
                type="button"
                className="button is-light is-medium"
                onClick={handleBack}
              >
                <ChevronLeft className="mr-2" size={18} />
                {backLabel}
              </button>
            )}
            <div>
              <p className="title is-4 mb-1">{title}</p>
              {description && (
                <p className="subtitle is-6 has-text-grey mb-2">
                  {description}
                </p>
              )}
              {badges}
            </div>
          </div>
          {actions && <div className="is-flex is-gap-2">{actions}</div>}
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
