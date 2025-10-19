"use client";

import clsx from "clsx";
import React from "react";

interface GeneralModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  children?: React.ReactNode;
  showFooter?: boolean;
  confirmDisabled?: boolean;
  size?: "default" | "medium" | "large";
}

const GeneralModal: React.FC<GeneralModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  children,
  showFooter = true,
  confirmDisabled = false,
  size = "default",
}) => {
  const handleBackgroundClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    onClose();
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div className={clsx("modal", { "is-active": isOpen })}>
      <div className="modal-background" onClick={handleBackgroundClick} />
      <div
        className={clsx("modal-card", {
          "general-modal--medium": size === "medium",
          "general-modal--large": size === "large",
        })}
        onClick={handleCardClick}
      >
        {(title || onClose) && (
          <header className="modal-card-head">
            {title && <p className="modal-card-title">{title}</p>}
            <button className="delete" aria-label="close" onClick={onClose} />
          </header>
        )}
        <section className="modal-card-body">
          {description && <p className="mb-3">{description}</p>}
          {children}
        </section>
        {showFooter && (
          <footer className="modal-card-foot is-justify-content-flex-end">
            <button className="button" onClick={onClose}>
              {cancelLabel}
            </button>
            <button
              className="button is-primary has-text-white"
              onClick={onConfirm}
              disabled={confirmDisabled}
            >
              {confirmLabel}
            </button>
          </footer>
        )}
      </div>

      <style jsx>{`
        .modal-card {
          border-radius: 18px;
          border: none;
        }

        .modal-card-body {
          max-height: 60vh;
          overflow-y: auto;
        }

        .general-modal--medium {
          width: 720px;
        }

        .general-modal--large {
          width: 920px;
        }
      `}</style>
    </div>
  );
};

export default GeneralModal;
