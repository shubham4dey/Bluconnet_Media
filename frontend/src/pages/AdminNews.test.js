/**
 * ============================================================
 *  Tests — News Admin panel (pages/AdminNews.jsx).
 *
 *  The bug under test: the panel used to publish articles with an
 *  EMPTY `imageUrl` whenever the admin submitted while the image
 *  upload was still running. The upload itself succeeded (the
 *  asset was visible in Cloudinary) but the record stored `""`,
 *  so both /admin-news and /news showed the placeholder.
 *
 *  The API client is mocked, so the panel is exercised without a
 *  network and the payload it sends can be asserted directly.
 * ============================================================
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminNews from "./AdminNews";
import {
  listAdminNews,
  createNews,
  updateNews,
  deleteNews,
  uploadNewsImageFile,
  migrateNewsImages,
} from "../services/newsApi";

jest.mock("../services/newsApi", () => ({
  listAdminNews: jest.fn(),
  createNews: jest.fn(),
  updateNews: jest.fn(),
  deleteNews: jest.fn(),
  uploadNewsImageFile: jest.fn(),
  migrateNewsImages: jest.fn(),
  // Cloudinary URLs pass through unchanged, exactly like the real helper.
  resolveUrl: (u) => (u ? String(u) : ""),
}));

jest.mock("../context/ThemeContext", () => ({
  useTheme: () => ({ isDarkMode: false }),
}));

const mockNavigate = jest.fn();
/* `virtual: true` because CRA 5's jest resolver reads `main` (react-router-dom
   v7 ships an `exports` map instead) — the mock is what the panel sees. */
jest.mock(
  "react-router-dom",
  () => ({ useNavigate: () => mockNavigate }),
  { virtual: true }
);

const CLOUD_URL =
  "https://res.cloudinary.com/wyixfdon/image/upload/v1790158832/bluconnet/news/logo_j7cfyn.png";
const CLOUD_PUBLIC_ID = "bluconnet/news/logo_j7cfyn";

/** An upload promise whose settlement the test controls. */
function deferred() {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

function renderAdmin() {
  localStorage.setItem("bluconnet_admin_auth", "true");
  return render(<AdminNews />);
}

function fillRequiredFields() {
  fireEvent.change(screen.getByPlaceholderText("News Heading"), {
    target: { value: "Cloudinary article" },
  });
  fireEvent.change(screen.getByPlaceholderText("Short Description"), {
    target: { value: "short" },
  });
  fireEvent.change(screen.getByPlaceholderText("Full Details"), {
    target: { value: "body" },
  });
}

function chooseImage(container) {
  const input = container.querySelector('input[type="file"]');
  const file = new File(["bytes"], "logo.png", { type: "image/png" });
  fireEvent.change(input, { target: { files: [file] } });
}

const publishButton = () => screen.getByRole("button", { name: /Publish News/i });

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  window.alert = jest.fn();
  window.scrollTo = jest.fn();
  listAdminNews.mockResolvedValue({ ok: true, data: [] });
  createNews.mockResolvedValue({ ok: true, data: { imageUrl: CLOUD_URL }, imageStored: true });
  updateNews.mockResolvedValue({ ok: true, data: { imageUrl: CLOUD_URL } });
  deleteNews.mockResolvedValue({ ok: true });
  migrateNewsImages.mockResolvedValue({ ok: true, migrated: 0 });
});

test("publishes the Cloudinary secure_url even when the upload is still running", async () => {
  const upload = deferred();
  uploadNewsImageFile.mockReturnValue(upload.promise);

  const { container } = renderAdmin();
  await waitFor(() => expect(listAdminNews).toHaveBeenCalled());

  fillRequiredFields();
  chooseImage(container);
  expect(uploadNewsImageFile).toHaveBeenCalledTimes(1);

  // The admin submits straight away (Enter in a field / a fast click): the
  // article must NOT be saved yet — the panel waits for the upload.
  fireEvent.submit(container.querySelector("form"));
  expect(createNews).not.toHaveBeenCalled();

  upload.resolve({ url: CLOUD_URL, publicId: CLOUD_PUBLIC_ID, error: null });

  await waitFor(() => expect(createNews).toHaveBeenCalledTimes(1));
  const payload = createNews.mock.calls[0][0];
  // The regression: this used to be "" because the handler read the stale
  // `formData` snapshot instead of the resolved upload result.
  expect(payload.imageUrl).toBe(CLOUD_URL);
  expect(payload.status).toBe("published");
  expect(payload.title).toBe("Cloudinary article");
});

test("a publish that waits for the upload stores the Cloudinary URL too", async () => {
  const upload = deferred();
  uploadNewsImageFile.mockReturnValue(upload.promise);

  const { container } = renderAdmin();
  await waitFor(() => expect(listAdminNews).toHaveBeenCalled());

  fillRequiredFields();
  chooseImage(container);

  // The existing UX guard: the submit button is unavailable while uploading.
  expect(publishButton()).toBeDisabled();

  upload.resolve({ url: CLOUD_URL, publicId: CLOUD_PUBLIC_ID, error: null });
  await waitFor(() => expect(publishButton()).toBeEnabled());

  fireEvent.click(publishButton());
  await waitFor(() => expect(createNews).toHaveBeenCalledTimes(1));
  expect(createNews.mock.calls[0][0].imageUrl).toBe(CLOUD_URL);
});

test("editing an article keeps its stored Cloudinary image", async () => {
  listAdminNews.mockResolvedValue({
    ok: true,
    data: [
      {
        id: "abc123",
        title: "Existing",
        shortDesc: "short",
        fullContent: "body",
        imageUrl: CLOUD_URL,
        imagePublicId: CLOUD_PUBLIC_ID,
        date: "2026-09-23",
        status: "published",
      },
    ],
  });

  renderAdmin();
  const edit = await screen.findByTitle("Edit");
  fireEvent.click(edit);

  fireEvent.click(screen.getByRole("button", { name: /Update News/i }));

  await waitFor(() => expect(updateNews).toHaveBeenCalledTimes(1));
  expect(updateNews.mock.calls[0][0]).toBe("abc123");
  expect(updateNews.mock.calls[0][1].imageUrl).toBe(CLOUD_URL);
});

test("a failed upload is reported and no broken image path is published", async () => {
  uploadNewsImageFile.mockResolvedValue({ url: null, publicId: "", error: "cloudinary down" });

  const { container } = renderAdmin();
  await waitFor(() => expect(listAdminNews).toHaveBeenCalled());

  fillRequiredFields();
  chooseImage(container);

  await screen.findByText(/Image upload failed: cloudinary down/i);

  fireEvent.click(publishButton());
  await waitFor(() => expect(createNews).toHaveBeenCalledTimes(1));
  expect(createNews.mock.calls[0][0].imageUrl).toBe("");
});
