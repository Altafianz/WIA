import React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";
import { Select } from "../ui/Select.js";
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
      className="w-full scroll-mt-20"
      aria-labelledby="saran-heading"
    >
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="saran-heading"
            tabIndex={-1}
            className="type-h2 text-text focus:outline-none"
          >
            {copy.feedback.sectionTitle}
          </h2>
          <p className="mt-2 text-base text-text-muted">
            {copy.feedback.sectionIntro}
          </p>
        </div>

        <div className="mt-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
          {/* Privacy Notice */}
          <div className="mb-8 flex h-fit items-center gap-3 rounded-2xl bg-footer-bg p-3 lg:top-24">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card text-brand-700"
            >
              <ShieldCheck className="h-4 w-4" />
            </span>
            <p className="text-sm leading-relaxed text-footer-text">
              {simple
                ? copy.feedback.privacyNoticeSimple
                : copy.feedback.privacyNotice}
            </p>
          </div>

          {/* Form or success state */}
          <div className="min-w-0 rounded-2xl border border-border bg-card p-5 sm:p-6">
            {isSuccess ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="flex flex-col items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center focus:outline-none"
                data-testid="feedback-success"
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-brand-700"
                >
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-brand-900">
                  {copy.feedback.successTitle}
                </h3>
                <p className="text-sm text-brand-900">
                  {copy.feedback.successMessage}
                </p>
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
                    className="rounded-xl border border-danger-200 bg-danger-50 p-3 text-sm font-medium text-danger-700"
                    data-testid="feedback-error-banner"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Jenis Saran */}
                <div className="flex flex-col gap-1.5">
                  <Select
                    id="feedback-category"
                    label={copy.feedback.categoryLabel}
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
                    className={
                      fieldErrors.category
                        ? "border-danger-600"
                        : undefined
                    }
                    data-testid="feedback-category"
                  >
                    <option value="fitur">{copy.feedback.categoryFitur}</option>
                    <option value="data">{copy.feedback.categoryData}</option>
                    <option value="tampilan">{copy.feedback.categoryTampilan}</option>
                    <option value="lainnya">{copy.feedback.categoryLainnya}</option>
                  </Select>
                  {fieldErrors.category && (
                    <p
                      id="feedback-category-error"
                      role="alert"
                      className="text-sm text-danger-600"
                    >
                      {fieldErrors.category}
                    </p>
                  )}
                </div>

                {/* Isi Saran */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="feedback-message"
                    className="text-sm font-semibold text-text"
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
                      "min-h-[140px] w-full resize-y rounded-xl border bg-card px-3.5 py-3 text-sm text-text",
                      "placeholder:text-text-muted transition-colors duration-150 hover:border-border-strong",
                      fieldErrors.message ? "border-danger-600" : "border-border",
                    ].join(" ")}
                    data-testid="feedback-message"
                  />
                  <div className="mt-0.5 flex flex-col justify-between gap-1 text-sm text-text-muted sm:flex-row sm:items-center">
                    <span id="feedback-message-help">
                      {fieldErrors.message ? (
                        <span role="alert" className="font-medium text-danger-600">
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
                    className="text-sm font-semibold text-text"
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
                      "h-12 w-full rounded-xl border bg-card px-3.5 text-sm text-text",
                      "placeholder:text-text-muted transition-colors duration-150 hover:border-border-strong",
                      fieldErrors.contact ? "border-danger-600" : "border-border",
                    ].join(" ")}
                    data-testid="feedback-contact"
                  />
                  <p id="feedback-contact-help" className="text-sm text-text-muted">
                    {fieldErrors.contact ? (
                      <span role="alert" className="font-medium text-danger-600">
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
                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 sm:w-auto"
                    data-testid="feedback-submit"
                  >
                    {isSubmitting
                      ? copy.feedback.submittingButton
                      : copy.feedback.submitButton}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
