import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileText, Loader2, LogOut, Newspaper, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import { toast } from "sonner";
import { API, categoryGradient, formatDate } from "@/lib/contact";

const CATEGORIES = ["Badan Usaha", "BPOM", "Virtual Office", "Alkes", "Layanan Digital", "Umum"];
const EMPTY_FORM = { title: "", slug: "", category: CATEGORIES[0], excerpt: "", read_time: "5 menit baca", published_at: "", content: "" };

const inputCls =
  "w-full rounded-xl bg-white border border-sky-200 px-4 py-3 text-sm text-[#0C2D48] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition-all duration-300";

const slugify = (t) =>
  t.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("leads");
  const [leads, setLeads] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("legal_admin_token");
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) return navigate("/admin/login");
    (async () => {
      try {
        await axios.get(`${API}/auth/me`, auth);
        const [l, p] = await Promise.all([
          axios.get(`${API}/consultations`, auth),
          axios.get(`${API}/blog`),
        ]);
        setLeads(l.data.reverse());
        setPosts(p.data);
      } catch {
        localStorage.removeItem("legal_admin_token");
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    localStorage.removeItem("legal_admin_token");
    navigate("/admin/login");
  };

  const reloadPosts = async () => setPosts((await axios.get(`${API}/blog`)).data);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, published_at: new Date().toISOString().slice(0, 10) });
    setShowForm(true);
  };

  const openEdit = async (post) => {
    const full = (await axios.get(`${API}/blog/${post.slug}`)).data;
    setEditingId(post.id);
    setForm({
      title: full.title, slug: full.slug, category: full.category, excerpt: full.excerpt,
      read_time: full.read_time, published_at: full.published_at, content: full.content || "",
    });
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.title) };
    try {
      if (editingId) {
        await axios.put(`${API}/blog/${editingId}`, payload, auth);
        toast.success("Artikel berhasil diperbarui");
      } else {
        await axios.post(`${API}/blog`, payload, auth);
        toast.success("Artikel berhasil diterbitkan");
      }
      setShowForm(false);
      await reloadPosts();
    } catch (err) {
      const d = err.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "Gagal menyimpan artikel");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (post) => {
    if (!window.confirm(`Hapus artikel "${post.title}"?`)) return;
    await axios.delete(`${API}/blog/${post.id}`, auth);
    toast.success("Artikel dihapus");
    await reloadPosts();
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F4F8FB]">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </main>
    );
  }

  return (
    <main data-testid="admin-dashboard" className="min-h-screen bg-[#F4F8FB]">
      <header className="glass border-b border-sky-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Legalberizin.id" className="h-10 w-auto" />
            <span className="font-mono-alt text-xs uppercase tracking-[0.25em] text-sky-600">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-slate-500 hover:text-sky-600 transition-colors hidden sm:block">Lihat Website</a>
            <button
              data-testid="admin-logout-button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-sky-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-red-300 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              data-testid="admin-tab-leads"
              onClick={() => setTab("leads")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                tab === "leads" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : "glass text-slate-600 hover:border-sky-400"
              }`}
            >
              <Users className="w-4 h-4" /> Data Form Masuk ({leads.length})
            </button>
            <button
              data-testid="admin-tab-articles"
              onClick={() => setTab("artikel")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                tab === "artikel" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : "glass text-slate-600 hover:border-sky-400"
              }`}
            >
              <Newspaper className="w-4 h-4" /> Artikel Blog ({posts.length})
            </button>
          </div>
          {tab === "artikel" && (
            <button
              data-testid="admin-new-article-button"
              onClick={openNew}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Tulis Artikel Baru
            </button>
          )}
        </div>

        {tab === "leads" && (
          <div data-testid="admin-leads-table" className="mt-8 glass rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-sky-200 text-left">
                  <th className="px-5 py-4 font-mono-alt text-xs uppercase tracking-[0.15em] text-slate-500">Tanggal</th>
                  <th className="px-5 py-4 font-mono-alt text-xs uppercase tracking-[0.15em] text-slate-500">Nama</th>
                  <th className="px-5 py-4 font-mono-alt text-xs uppercase tracking-[0.15em] text-slate-500">WhatsApp</th>
                  <th className="px-5 py-4 font-mono-alt text-xs uppercase tracking-[0.15em] text-slate-500">Layanan</th>
                  <th className="px-5 py-4 font-mono-alt text-xs uppercase tracking-[0.15em] text-slate-500">Pesan</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Belum ada data form masuk.</td></tr>
                )}
                {leads.map((l) => (
                  <tr key={l.id} data-testid={`admin-lead-row-${l.id}`} className="border-b border-sky-100 hover:bg-sky-50/60 transition-colors">
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDate(l.created_at)}</td>
                    <td className="px-5 py-4 font-semibold">{l.name}</td>
                    <td className="px-5 py-4">
                      <a href={`https://wa.me/${String(l.phone).replace(/\D/g, "").replace(/^0/, "62")}`} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                        {l.phone}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{l.service}</td>
                    <td className="px-5 py-4 text-slate-600 max-w-[260px] truncate" title={l.message}>{l.message || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "artikel" && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="admin-articles-grid">
            {posts.map((p) => (
              <div key={p.id} className="glass rounded-2xl overflow-hidden" data-testid={`admin-article-${p.slug}`}>
                <div className={`h-24 bg-gradient-to-br ${categoryGradient(p.category)} flex items-end p-4`}>
                  <span className="font-mono-alt text-[10px] uppercase tracking-[0.2em] text-white/85 bg-white/15 rounded-full px-3 py-1">{p.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold leading-snug line-clamp-2">{p.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(p.published_at)} · /blog/{p.slug}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      data-testid={`admin-article-edit-${p.slug}`}
                      onClick={() => openEdit(p)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 px-4 py-1.5 text-xs font-semibold text-sky-700 hover:border-sky-400 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:border-sky-400 transition-colors">
                      <FileText className="w-3.5 h-3.5" /> Lihat
                    </a>
                    <button
                      data-testid={`admin-article-delete-${p.slug}`}
                      onClick={() => remove(p)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-[#0C2D48]/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-10 px-4" data-testid="admin-article-form-modal">
          <form onSubmit={save} className="w-full max-w-2xl glass rounded-2xl p-6 sm:p-8 my-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">{editingId ? "Edit Artikel" : "Tulis Artikel Baru"}</h2>
              <button type="button" data-testid="admin-article-form-close" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono-alt uppercase tracking-[0.15em] text-slate-500 mb-2">Judul *</label>
                <input data-testid="article-form-title" required className={inputCls} value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: editingId ? f.slug : slugify(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-xs font-mono-alt uppercase tracking-[0.15em] text-slate-500 mb-2">Slug URL *</label>
                <input data-testid="article-form-slug" required className={inputCls} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-mono-alt uppercase tracking-[0.15em] text-slate-500 mb-2">Kategori</label>
                <select data-testid="article-form-category" className={inputCls} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map((c) => <option key={c} value={c} className="bg-white">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono-alt uppercase tracking-[0.15em] text-slate-500 mb-2">Tanggal Terbit</label>
                <input data-testid="article-form-date" type="date" required className={inputCls} value={form.published_at} onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-mono-alt uppercase tracking-[0.15em] text-slate-500 mb-2">Estimasi Baca</label>
                <input data-testid="article-form-readtime" className={inputCls} value={form.read_time} onChange={(e) => setForm((f) => ({ ...f, read_time: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono-alt uppercase tracking-[0.15em] text-slate-500 mb-2">Ringkasan (excerpt) *</label>
                <textarea data-testid="article-form-excerpt" required rows={2} className={inputCls} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono-alt uppercase tracking-[0.15em] text-slate-500 mb-2">
                  Isi Artikel (HTML: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;) *
                </label>
                <textarea data-testid="article-form-content" required rows={10} className={`${inputCls} font-mono-alt text-xs`} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
              </div>
            </div>
            <button
              data-testid="article-form-submit"
              type="submit"
              disabled={saving}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 font-bold text-white disabled:opacity-60 transition-all"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Terbitkan Artikel"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
