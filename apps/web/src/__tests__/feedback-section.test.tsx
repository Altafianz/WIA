import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { FeedbackSection } from "../components/home/FeedbackSection.js";
import { HomePage } from "../pages/HomePage.js";
import { AppFooter } from "../components/layout/AppFooter.js";
import { copy } from "../content/copy.id.js";
import { SimpleModeContext } from "../app/simple-mode-context.js";

function renderWithProviders(
  ui: React.ReactElement,
  { route = "/", isSimple = false } = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return renderToStaticMarkup(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SimpleModeContext.Provider value={{ isSimple, setSimple: () => {} }}>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </SimpleModeContext.Provider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

describe("FeedbackSection & Kirim Saran Integration", () => {
  it("renders feedback section on Beranda (HomePage) with id='saran'", () => {
    const html = renderWithProviders(<HomePage />);

    expect(html).toContain('id="saran"');
    expect(html).toContain(copy.feedback.sectionTitle);
    expect(html).toContain(copy.feedback.sectionIntro);
    expect(html).toContain(copy.feedback.privacyNotice);
  });

  it("renders footer link pointing to /#saran", () => {
    const html = renderWithProviders(<AppFooter />);

    expect(html).toContain('href="/#saran"');
    expect(html).toContain(copy.footer.feedbackLink);
  });

  it("shows validation error when message is too short", () => {
    const html = renderToStaticMarkup(
      <FeedbackSection
        formData={{ category: "fitur", message: "pendek", contact: "", website: "" }}
        fieldErrors={{ message: copy.feedback.errors.messageTooShort }}
        errorMessage={null}
        isSubmitting={false}
        isSuccess={false}
        successRef={{ current: null }}
        onChangeField={() => {}}
        onSubmit={() => {}}
        onResetSuccess={() => {}}
      />
    );

    expect(html).toContain(copy.feedback.errors.messageTooShort);
    expect(html).toContain('aria-invalid="true"');
  });

  it("displays thank you message on success", () => {
    const html = renderToStaticMarkup(
      <FeedbackSection
        formData={{ category: "fitur", message: "", contact: "", website: "" }}
        fieldErrors={{}}
        errorMessage={null}
        isSubmitting={false}
        isSuccess={true}
        successRef={{ current: null }}
        onChangeField={() => {}}
        onSubmit={() => {}}
        onResetSuccess={() => {}}
      />
    );

    expect(html).toContain(copy.feedback.successTitle);
    expect(html).toContain(copy.feedback.successMessage);
    expect(html).toContain(copy.feedback.sendAnotherButton);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });

  it("displays 429 rate limit message when rate limited and retains typed content", () => {
    const html = renderToStaticMarkup(
      <FeedbackSection
        formData={{
          category: "tampilan",
          message: "Ini saran yang sudah saya ketik panjang tapi kena batas laju.",
          contact: "test@example.com",
          website: "",
        }}
        fieldErrors={{}}
        errorMessage={copy.feedback.errors.rateLimited}
        isSubmitting={false}
        isSuccess={false}
        successRef={{ current: null }}
        onChangeField={() => {}}
        onSubmit={() => {}}
        onResetSuccess={() => {}}
      />
    );

    expect(html).toContain(copy.feedback.errors.rateLimited);
    expect(html).toContain('role="alert"');
    // Content is retained in textarea and contact input
    expect(html).toContain("Ini saran yang sudah saya ketik panjang tapi kena batas laju.");
    expect(html).toContain("test@example.com");
  });

  it("ensures honeypot field is hidden from assistive technology and layout", () => {
    const html = renderToStaticMarkup(
      <FeedbackSection
        formData={{ category: "fitur", message: "", contact: "", website: "" }}
        fieldErrors={{}}
        errorMessage={null}
        isSubmitting={false}
        isSuccess={false}
        successRef={{ current: null }}
        onChangeField={() => {}}
        onSubmit={() => {}}
        onResetSuccess={() => {}}
      />
    );

    // Honeypot container has hidden and aria-hidden="true"
    expect(html).toContain('class="hidden" aria-hidden="true"');
    expect(html).toContain('tabindex="-1"');
    expect(html.toLowerCase()).toContain('autocomplete="off"');
  });

  it("displays simple mode privacy notice when simple=true", () => {
    const html = renderToStaticMarkup(
      <FeedbackSection
        formData={{ category: "fitur", message: "", contact: "", website: "" }}
        fieldErrors={{}}
        errorMessage={null}
        isSubmitting={false}
        isSuccess={false}
        successRef={{ current: null }}
        onChangeField={() => {}}
        onSubmit={() => {}}
        onResetSuccess={() => {}}
        simple={true}
      />
    );

    expect(html).toContain(copy.feedback.privacyNoticeSimple);
  });
});
