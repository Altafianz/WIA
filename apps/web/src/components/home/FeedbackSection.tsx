import React from "react";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";
import { FeedbackFormData } from "../../hooks/useSubmitFeedback.js";

export interface FeedbackSectionProps {
  formData: FeedbackFormData;
  fieldErrors: Partial<Record<keyof FeedbackFormData, string>>;
  errorMessage: string | null;
  isSubmitting: boolean;
  isSuccess: boolean;
  successRef: React.RefObject<HTMLDivElement>;
  onChangeField: <K extends keyof FeedbackFormData>(
    field: K,
    value: FeedbackFormData[K]
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResetSuccess: () => void;
  simple?: boolean;
}

export function FeedbackSection({
  formData,
  fieldErrors,
  errorMessage,
  isSubmitting,
  isSuccess,
  successRef,
  onChangeField,
  onSubmit,
  onResetSuccess,
  simple = false,
}: FeedbackSectionProps) {
  return (
    <section
      id="saran"
      className="max-w-2xl mx-auto px-4 w-full scroll-mt-20 my-8"
      aria-labelledby="saran-heading"
    >
      <h2
        id="saran-heading"
        tabIndex={-1}
        className="text-2xl md:text-3xl font-bold text-text text-center focus:outline-none"
      >
        {copy.feedback.sectionTitle}
      </h2>
      <p className="text-text-muted text-center mt-2 mb-6 text-sm md:text-base">
        {copy.feedback.sectionIntro}
      </p>

      {/* Privacy Notice Box */}
      <div className="rounded-lg border border-border bg-surface p-4 text-xs md:text-sm text-text-muted mb-6 leading-relaxed">
        {simple
          ? copy.feedback.privacyNoticeSimple
          : copy.feedback.privacyNotice}
      </div>

      {isSuccess ? (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="rounded-lg border border-brand-200 bg-brand-50 p-6 text-center focus:outline-none flex flex-col items-center gap-3"
          data-testid="feedback-success"
        >
          <h3 className="text-lg font-bold text-brand-700">
            {copy.feedback.successTitle}
          </h3>
          <p className="text-sm text-text">{copy.feedback.successMessage}</p>
          <Button variant="secondary" onClick={onResetSuccess} className="mt-2">
            {copy.feedback.sendAnotherButton}
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3 text-sm text-danger-700 bg-danger-50 border border-danger-200 rounded-md"
              data-testid="feedback-error-banner"
            >
              {errorMessage}
            </div>
          )}

          {/* Jenis Saran */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="feedback-category"
              className="text-sm font-medium text-text"
            >
              {copy.feedback.categoryLabel}
            </label>
            <select
              id="feedback-category"
              value={formData.category}
              onChange={(e) =>
                onChangeField(
                  "category",
                  e.target.value as FeedbackFormData["category"]
                )
              }
              aria-invalid={!!fieldErrors.category}
              aria-describedby={
                fieldErrors.category ? "feedback-category-error" : undefined
              }
              className={[
                "rounded-md border bg-surface px-3 py-2 text-sm text-text",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                fieldErrors.category ? "border-danger-600" : "border-border",
              ].join(" ")}
              data-testid="feedback-category"
            >
              <option value="fitur">{copy.feedback.categoryFitur}</option>
              <option value="data">{copy.feedback.categoryData}</option>
              <option value="tampilan">{copy.feedback.categoryTampilan}</option>
              <option value="lainnya">{copy.feedback.categoryLainnya}</option>
            </select>
            {fieldErrors.category && (
              <p
                id="feedback-category-error"
                role="alert"
                className="text-xs text-danger-600"
              >
                {fieldErrors.category}
              </p>
            )}
          </div>

          {/* Isi Saran */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="feedback-message"
              className="text-sm font-medium text-text"
            >
              {copy.feedback.messageLabel}
            </label>
            <textarea
              id="feedback-message"
              rows={5}
              maxLength={1000}
              value={formData.message}
              onChange={(e) => onChangeField("message", e.target.value)}
              placeholder={copy.feedback.messagePlaceholder}
              aria-invalid={!!fieldErrors.message}
              aria-describedby="feedback-message-help feedback-message-counter"
              className={[
                "rounded-md border bg-surface px-3 py-2 text-sm text-text",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-focus resize-y min-h-[100px]",
                fieldErrors.message ? "border-danger-600" : "border-border",
              ].join(" ")}
              data-testid="feedback-message"
            />
            <div className="flex justify-between items-center text-xs text-text-muted mt-0.5">
              <span id="feedback-message-help">
                {fieldErrors.message ? (
                  <span role="alert" className="text-danger-600 font-medium">
                    {fieldErrors.message}
                  </span>
                ) : (
                  copy.feedback.messageHelp
                )}
              </span>
              <span id="feedback-message-counter" aria-live="polite">
                {copy.feedback.messageCharCount.replace(
                  "{count}",
                  String(formData.message.length)
                )}
              </span>
            </div>
          </div>

          {/* Kontak (Opsional) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="feedback-contact"
              className="text-sm font-medium text-text"
            >
              {copy.feedback.contactLabel}
            </label>
            <input
              id="feedback-contact"
              type="text"
              maxLength={100}
              value={formData.contact}
              onChange={(e) => onChangeField("contact", e.target.value)}
              placeholder={copy.feedback.contactPlaceholder}
              aria-describedby="feedback-contact-help"
              aria-invalid={!!fieldErrors.contact}
              className={[
                "rounded-md border bg-surface px-3 py-2 text-sm text-text",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                fieldErrors.contact ? "border-danger-600" : "border-border",
              ].join(" ")}
              data-testid="feedback-contact"
            />
            <p id="feedback-contact-help" className="text-xs text-text-muted">
              {fieldErrors.contact ? (
                <span role="alert" className="text-danger-600 font-medium">
                  {fieldErrors.contact}
                </span>
              ) : (
                copy.feedback.contactHelp
              )}
            </p>
          </div>

          {/* Honeypot field (hidden from view and assistive tech) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="feedback-website">{copy.feedback.honeypotLabel}</label>
            <input
              id="feedback-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => onChangeField("website", e.target.value)}
              data-testid="feedback-website"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6"
              data-testid="feedback-submit"
            >
              {isSubmitting
                ? copy.feedback.submittingButton
                : copy.feedback.submitButton}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}

