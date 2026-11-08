import React from "react";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";
import { Select } from "../ui/Select.js";
import { Input, Textarea } from "../ui/Input.js";
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
      className="my-8 w-full scroll-mt-24"
      aria-labelledby="saran-heading"
    >
      <h2
        id="saran-heading"
        tabIndex={-1}
        className="type-h2 text-center focus:outline-none"
      >
        {copy.feedback.sectionTitle}
      </h2>
      <p className="prose-readable mx-auto mb-6 mt-3 text-center text-base text-text-muted">
        {copy.feedback.sectionIntro}
      </p>

      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        {/* Privacy Notice Box */}
        <div className="rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed text-text-muted">
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
            className="flex flex-col items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center shadow-sm focus:outline-none"
            data-testid="feedback-success"
          >
            <h3 className="type-h3 text-brand-800">
              {copy.feedback.successTitle}
            </h3>
            <p className="text-base text-text">{copy.feedback.successMessage}</p>
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
                className="rounded-2xl border border-danger-200 bg-danger-50 p-4 text-sm font-medium text-danger-700"
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
                  className="text-sm font-medium text-danger-600"
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
              <Textarea
                id="feedback-message"
                rows={5}
                maxLength={1000}
                value={formData.message}
                onChange={(e) => onChangeField("message", e.target.value)}
                placeholder={copy.feedback.messagePlaceholder}
                invalid={!!fieldErrors.message}
                aria-describedby="feedback-message-help feedback-message-counter"
                data-testid="feedback-message"
              />
              <div className="mt-0.5 flex items-center justify-between gap-3 text-sm text-text-muted">
                <span id="feedback-message-help">
                  {fieldErrors.message ? (
                    <span role="alert" className="font-medium text-danger-600">
                      {fieldErrors.message}
                    </span>
                  ) : (
                    copy.feedback.messageHelp
                  )}
                </span>
                <span id="feedback-message-counter" aria-live="polite" className="tabular-nums">
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
              <Input
                id="feedback-contact"
                type="text"
                maxLength={100}
                value={formData.contact}
                onChange={(e) => onChangeField("contact", e.target.value)}
                placeholder={copy.feedback.contactPlaceholder}
                aria-describedby="feedback-contact-help"
                invalid={!!fieldErrors.contact}
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
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full px-8 sm:w-auto"
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
    </section>
  );
}
