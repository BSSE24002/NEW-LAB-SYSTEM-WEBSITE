import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Plus, Trash2, Loader2 } from "lucide-react";

export function PostsManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    api.getPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setCreating(true);
    try {
      await api.createPost({ title, content });
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to create post.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Posts Management</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Create updates and news for the homepage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4">New Post</h2>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-brand-obsidian"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-brand-obsidian resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-brand-obsidian text-white font-bold text-xs uppercase tracking-widest py-3 rounded-md hover:bg-black transition-colors disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Post"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white p-12 text-center text-gray-400 border border-gray-200 rounded-lg">
              <p className="text-sm uppercase tracking-widest font-bold">No posts available.</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2 block">
                  {new Date(post.created_at).toLocaleString()}
                </span>
                <h3 className="text-lg font-black uppercase tracking-widest mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{post.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
