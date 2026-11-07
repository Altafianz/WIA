import { useState, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { FeedbackCategory } from "@danaterbuka/shared";
import { ApiClientError, fetchApi } from "../lib/api-client.js";
import { copy } from "../content/copy.id.js";

export interface FeedbackFormData {
  category: FeedbackCategory;
  message: string;
  contact: string;
  website: string;
}

const initialFormData: FeedbackFormData = {
  category: "fitur",
  message: "",
  contact: "",
  website: "",
};

export function useSubmitFeedback() {
  const [formData, setFormData] = useState<FeedbackFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FeedbackFormData, string>>
  >({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const successRef = useRef<HTMLDivElement | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: FeedbackFormData) => {
      return fetchApi<{ ok: boolean }>("/api/feedback", {
        method: "POST",
        body: {
          category: payload.category,
          message: payload.message.trim(),
          contact: payload.contact.trim() || undefined,
          website: payload.website,
        },
      });
    },
    onSuccess: () => {
      setIsSuccess(true);
      setFormData(initialFormData);
      setFieldErrors({});
      setErrorMessage(null);
      setTimeout(() => {
        successRef.current?.focus();
      }, 0);
    },
    onError: (err: unknown) => {
      if (
        err instanceof ApiClientError &&
        (err.code === "RATE_LIMITED" || err.status === 429)
      ) {
        setErrorMessage(copy.feedback.errors.rateLimited);
      } else {
        setErrorMessage(copy.feedback.errors.genericError);
      }
    },
  });

  const onChangeField = useCallback(
    <K extends keyof FeedbackFormData>(field: K, value: FeedbackFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      setErrorMessage(null);
    },
    []
  );

  const validate = useCallback((): boolean => {
    const errors: Partial<Record<keyof FeedbackFormData, string>> = {};

    if (!formData.category) {
      errors.category = copy.feedback.errors.categoryRequired;
    }

    const trimmedMsg = formData.message.trim();
    if (trimmedMsg.length < 10) {
      errors.message = copy.feedback.errors.messageTooShort;
    } else if (trimmedMsg.length > 1000) {
      errors.message = copy.feedback.errors.messageTooLong;
    }

    if (formData.contact && formData.contact.length > 100) {
      errors.contact = copy.feedback.errors.contactTooLong;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage(null);

      if (!validate()) {
        return;
      }

      mutation.mutate(formData);
    },
    [validate, mutation, formData]
  );

  const resetSuccess = useCallback(() => {
    setIsSuccess(false);
    setErrorMessage(null);
    setFieldErrors({});
  }, []);

  return {
    formData,
    fieldErrors,
    errorMessage,
    isSubmitting: mutation.isPending,
    isSuccess,
    successRef,
    onChangeField,
    onSubmit: handleSubmit,
    onResetSuccess: resetSuccess,
  };
}

