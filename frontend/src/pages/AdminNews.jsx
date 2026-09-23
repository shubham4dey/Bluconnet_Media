import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaSignOutAlt,
  FaImage,
  FaUpload,
  FaCamera,
  FaEdit,
} from "react-icons/fa";
import {
  listAdminNews,
  createNews,
  updateNews,
  deleteNews,
  uploadNewsImageFile,
  migrateNewsImages,
  resolveUrl,
} from "../services/newsApi";
import { NEWS_THUMB_FALLBACK } from "../utils/newsImageFallback";

const AdminNews = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    shortDesc: "",
    fullContent: "",
    imageUrl: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Non-blocking upload error shown inline under the image area (no new design).
  const [uploadError, setUploadError] = useState(null);

  // Track an in-flight image upload so the submit handler waits for the
  // Cloudinary `secure_url` before publishing.
  //
  // The promise is kept in a REF as well as in state on purpose:
  //   • state (`pendingUpload`) drives the disabled submit button,
  //   • the ref lets `handleSubmit` await the upload and read the URL from the
  //     RESOLVED VALUE. Merely awaiting the promise is not enough — the handler
  //     keeps the `formData` snapshot of the render it was created in, so
  //     `setFormData({... imageUrl: url})` inside the upload callback is NOT
  //     visible to it. That stale-closure gap is what published articles with
  //     an empty `imageUrl` while the image was already on Cloudinary.
  const [pendingUpload, setPendingUpload] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const pendingUploadRef = useRef(null);
  // Monotonic id of the latest image selection: an older, slower upload must
  // never overwrite the image the admin picked afterwards.
  const uploadSeqRef = useRef(0);

    // Security Check & Load Data (from the central database, never localStorage)
  useEffect(() => {
    const isAuth = localStorage.getItem("bluconnet_admin_auth");
    if (isAuth !== "true") {
      navigate("/login");
      return;
    }

    let cancelled = false;
    (async () => {
      // Load this admin's view of ALL news from the central DB.
      const initial = await listAdminNews();
      const reachable = Boolean(initial && initial.ok);
      let list = (initial && initial.ok && initial.data) || [];

      // One-time migration: if the central DB is empty, pull any legacy
      // per-browser localStorage news into the shared database (so
      // pre-existing content becomes visible globally). Guards against
      // duplicates by only running when the DB is empty — and only when the
      // backend actually answered, otherwise an offline backend would delete
      // the legacy data without ever migrating it.
      const legacyRaw = localStorage.getItem("bluconnet_news");
      if (reachable && list.length === 0 && legacyRaw) {
        try {
          const legacy = JSON.parse(legacyRaw);
          if (Array.isArray(legacy)) {
            for (const item of legacy) {
              // eslint-disable-next-line no-await-in-loop
              await createNews({
                title: item.title,
                shortDesc: item.shortDesc,
                fullContent: item.fullContent,
                imageUrl: item.imageUrl,
                date: item.date,
              });
            }
            localStorage.removeItem("bluconnet_news");
          }
        } catch (e) {
          /* migration is best-effort */
        }
        const again = await listAdminNews();
        list = (again && again.ok && again.data) || [];
      }

      if (!cancelled) setNewsList(list);

      // One-time (per browser session) Cloudinary migration: any article still
      // pointing at a legacy local `/uploads/...` path or an inline base64 blob
      // is re-uploaded to Cloudinary by the backend, so the image keeps working
      // after a Render restart/redeploy. Best-effort — no UI change.
      const MIGRATION_FLAG = "bluconnet_news_image_migration";
      const needsMigration = (u) => {
        const v = (u || "").trim();
        if (!v) return false;
        return !/^https:\/\/res\.cloudinary\.com\//i.test(v);
      };
      try {
        if (
          reachable &&
          list.some((n) => needsMigration(n.imageUrl)) &&
          !sessionStorage.getItem(MIGRATION_FLAG)
        ) {
          sessionStorage.setItem(MIGRATION_FLAG, "1");
          const report = await migrateNewsImages();
          if (report && report.ok && report.migrated > 0) {
            const again = await listAdminNews();
            if (!cancelled) setNewsList((again && again.ok && again.data) || []);
          }
        }
      } catch (e) {
        /* image migration is best-effort (private-mode storage, offline…) */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const loadNews = async () => {
    const res = await listAdminNews();
    setNewsList((res && res.ok && res.data) || []);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear any prior upload error as soon as the admin picks a new file.
    setUploadError(null);

    // Instant local preview (preserves existing UX).
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary through the authenticated backend route and store
    // the permanent `secure_url` with the article. We never store a browser-only
    // base64/blob or a local /uploads path: Render wipes the local filesystem on
    // every restart/redeploy, so only a Cloudinary URL is acceptable. On failure
    // the real backend error is shown below and no URL is kept.
    //
    // The submit handler awaits this promise (via `pendingUploadRef`) and reads
    // the Cloudinary URL from its RESOLVED value, so the article is never
    // published with an empty `imageUrl` while the upload is still in flight —
    // the exact failure that previously saved "imageUrl: ''" for images that
    // were already visible in Cloudinary.
    const seq = uploadSeqRef.current + 1;
    uploadSeqRef.current = seq;

    const upload = uploadNewsImageFile(file);
    pendingUploadRef.current = upload;
    setPendingUpload(upload);
    setUploadInProgress(true);
    upload.then(({ url, error }) => {
      // A slower, superseded upload (another file was picked, or the image was
      // removed) must not touch the form any more.
      if (uploadSeqRef.current !== seq) return;
      if (url) {
        setImageBase64(null);
        setFormData((f) => ({ ...f, imageUrl: url }));
      } else {
        setUploadError(error || "Image upload failed.");
        setImageBase64(null);
        setFormData((f) => ({ ...f, imageUrl: "" }));
      }
    }).finally(() => {
      if (uploadSeqRef.current !== seq) return;
      pendingUploadRef.current = null;
      setPendingUpload(null);
      setUploadInProgress(false);
    });
  };

  const removeImage = () => {
    // Invalidate a still-running upload, otherwise its late response would put
    // the removed image back into the form.
    uploadSeqRef.current += 1;
    pendingUploadRef.current = null;
    setPendingUpload(null);
    setUploadInProgress(false);
    setImagePreview(null);
    setImageBase64(null);
    setFormData((f) => ({ ...f, imageUrl: "" }));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    // Wait for an in-flight image upload and take the Cloudinary `secure_url`
    // from the RESOLVED promise value. Reading it here — instead of relying on
    // `formData.imageUrl` — makes the saved article independent of React state
    // timing, so publishing while an upload is still running can no longer
    // store an empty image (the previous cause of articles showing the
    // placeholder although the image was already on Cloudinary).
    const inFlight = pendingUploadRef.current;
    const settled = inFlight ? await inFlight : null;
    const uploadedUrl = (settled && settled.url) || "";
    const payload = { ...formData, imageUrl: uploadedUrl || formData.imageUrl };

    try {
      if (editingId) {
        const res = await updateNews(editingId, payload);
        // A success must never hide the fact that the backend had to drop the
        // image — the panel would otherwise publish an article without one.
        const imageLost =
          Boolean(payload.imageUrl) &&
          Boolean(res && res.ok) &&
          !(res.data && res.data.imageUrl);
        const okText = imageLost
          ? "News updated successfully, but the image could not be stored — please upload it again."
          : "News updated successfully!";
        alert(res && res.ok ? okText : (res && res.error) || "Could not update news.");
      } else {
        // Publish explicitly — the backend stores status "published"
        // plus publishedAt (single global source of truth).
        const res = await createNews({ ...payload, status: "published" });
        const imageLost =
          Boolean(payload.imageUrl) && Boolean(res && res.ok) && res.imageStored === false;
        const okText = imageLost
          ? "News published successfully, but the image could not be stored — please upload it again."
          : "News published successfully!";
        alert(res && res.ok ? okText : (res && res.error) || "Could not publish news.");
      }
      await loadNews();
    } catch {
      alert("Could not save news.");
    }

    resetForm();
  };

  const handleEdit = (item) => {
    // Drop any upload started for the previous article, so its (late) result
    // cannot be attached to this one.
    uploadSeqRef.current += 1;
    pendingUploadRef.current = null;
    setPendingUpload(null);
    setUploadInProgress(false);
    setEditingId(item.id);
    setFormData({
      title: item.title,
      shortDesc: item.shortDesc,
      fullContent: item.fullContent,
      imageUrl: item.imageUrl,
      date: item.date,
    });
    setImagePreview(item.imageUrl);
    setImageBase64(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      await deleteNews(id);
      await loadNews();

      if (editingId === id) {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    // Nothing in flight may leak into the next article.
    uploadSeqRef.current += 1;
    pendingUploadRef.current = null;
    setPendingUpload(null);
    setUploadInProgress(false);
    setEditingId(null);
    setFormData({
      title: "",
      shortDesc: "",
      fullContent: "",
      imageUrl: "",
      date: new Date().toISOString().split("T")[0],
    });
    setImagePreview(null);
    setImageBase64(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("bluconnet_admin_auth");
    navigate("/login");
  };

  return (
    <main
      className={`min-h-screen pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 md:pb-20 px-4 sm:px-5 lg:px-6 ${
        isDarkMode ? "bg-[#050508] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADING - Margin top badha diya gaya hai */}
        <div className="mt-6 sm:mt-8 lg:mt-10 mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-center">
            <span
              className={`bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
            >
              News Admin Panel
            </span>
          </h1>
        </div>

        {/* Buttons - Mobile par stack, Tablet/Desktop par side-by-side */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-bold hover:underline w-full sm:w-auto justify-center sm:justify-start"
          >
            <FaArrowLeft /> Back to Website
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 w-full sm:w-auto justify-center sm:justify-start sm:justify-end"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Grid Layout - Mobile par 1 column, Tablet par 1 column, Desktop par 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
          {/* Add/Edit News Form */}
          <div
            className={`lg:col-span-1 p-5 sm:p-6 rounded-2xl border ${isDarkMode ? "bg-[#0f1535] border-white/10" : "bg-white border-gray-200"} shadow-xl h-fit`}
          >
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              {editingId ? <FaEdit className="text-blue-500" /> : <FaPlus />}
              {editingId ? "Edit News" : "Add New News"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="News Heading"
                required
                className="w-full p-3 rounded-lg bg-transparent border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-emerald-500"
              />
              <input
                name="shortDesc"
                value={formData.shortDesc}
                onChange={handleChange}
                placeholder="Short Description"
                required
                className="w-full p-3 rounded-lg bg-transparent border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-emerald-500"
              />
              <textarea
                name="fullContent"
                value={formData.fullContent}
                onChange={handleChange}
                placeholder="Full Details"
                required
                rows="6"
                className="w-full p-3 rounded-lg bg-transparent border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-emerald-500"
              />

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Upload Image
                </label>
                {!imagePreview ? (
                  <label
                    className={`flex flex-col items-center justify-center w-full h-36 sm:h-40 border-2 border-dashed rounded-lg cursor-pointer ${isDarkMode ? "border-white/20 hover:border-[#d4e157]" : "border-gray-300 hover:border-emerald-500"} transition`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaCamera className="text-2xl mb-2 opacity-50" />
                      <p className="text-sm opacity-70">
                        Click to upload image
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                                        <img
                      src={resolveUrl(imagePreview)}
                      alt="Preview"
                      className="w-full h-40 sm:h-44 sm:h-40 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Real backend upload error (reuses the existing text style) */}
              {uploadError && (
                <p className="text-red-500 text-sm font-bold">
                  Image upload failed: {uploadError}
                </p>
              )}

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                style={{
                  colorScheme: isDarkMode ? "dark" : "light",
                }}
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-[#0f1535] text-white border-gray-700"
                    : "bg-white text-black border-gray-300"
                }`}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={uploadInProgress}
                  className={`flex-1 py-3 rounded-lg font-bold bg-gradient-to-r ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4] text-black"
                      : "from-emerald-500 to-cyan-600 text-white"
                  } hover:opacity-90 transition flex items-center justify-center gap-2 ${uploadInProgress ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <FaUpload /> {editingId ? "Update News" : "Publish News"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-3 rounded-lg font-bold bg-gray-500 text-white hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Existing News List */}
          <div
            className={`lg:col-span-2 p-4 md:p-6 rounded-2xl border ${isDarkMode ? "bg-[#0f1535] border-white/10" : "bg-white border-gray-200"} shadow-xl`}
          >
            <h2 className="text-lg md:text-xl font-bold mb-4">
              Manage Existing News ({newsList.length})
            </h2>
            <div className="space-y-4 max-h-[450px] sm:max-h-[520px] lg:max-h-[600px] overflow-y-auto pr-1 md:pr-2">
              {newsList.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No news articles yet.
                </p>
              ) : (
                newsList.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col md:flex-row gap-4 p-3 md:p-4 rounded-xl border ${isDarkMode ? "border-white/5 bg-white/5" : "border-gray-100 bg-gray-50"}`}
                  >
                                        {/* Image */}
                    {item.imageUrl ? (
                      <img
                        src={resolveUrl(item.imageUrl)}
                        alt={item.title}
                        onError={(e) => {
                          // Inline fallback instead of an external placeholder
                          // service (which no longer serves images, so a broken
                          // URL showed up as a broken icon). The tile keeps its
                          // existing class/size.
                          e.target.onerror = null;
                          e.target.src = NEWS_THUMB_FALLBACK;
                        }}
                        className="w-full h-48 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0 bg-gray-200"
                      />
                    ) : (
                      <div
                        className={`w-full h-48 md:w-24 md:h-24 rounded-lg flex items-center justify-center flex-shrink-0 ${isDarkMode ? "bg-white/10" : "bg-gray-200"}`}
                      >
                        <FaImage
                          size={24}
                          className={
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }
                        />
                      </div>
                    )}

                    {/* Content & Actions */}
                    <div className="flex-1 min-w-0 flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1 min-w-0 text-left w-full">
                        <h3 className="font-bold truncate">{item.title}</h3>
                        <p className="text-xs text-gray-500 mb-1 md:mb-2">
                          {item.date}
                        </p>
                        <p className="text-sm line-clamp-2 opacity-80">
                          {item.shortDesc}
                        </p>
                      </div>

                      {/* Action Buttons - Side by side on mobile */}
                      <div className="flex gap-2 justify-end md:flex-col flex-shrink-0">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:bg-blue-500/10 p-2.5 rounded-lg transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:bg-red-500/10 p-2.5 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminNews;
