import { samplePosts, sampleTags } from '@/mock/tintuc';

export type Post = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // HTML for now
  author: { name: string; avatar?: string | null };
  tags: string[];
  createdAt: string;
  views: number;
};

export const getPosts = async (options?: { page?: number; pageSize?: number; tag?: string; q?: string }) => {
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 9;
  const itemsAll = loadPosts();
  let items = itemsAll.slice();
  if (options?.tag) items = items.filter((p) => p.tags.includes(options.tag!));
  if (options?.q) {
    const q = options.q.toLowerCase();
    items = items.filter((p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q));
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return { data: paged as Post[], total };
};

export const getPostBySlug = async (slug: string) => {
  const found = loadPosts().find((p) => p.slug === slug);
  return found ? (found as Post) : null;
};

export const getTags = async () => {
  return loadTags();
};

const POSTS_KEY = 'blog_posts_v1';
const TAGS_KEY = 'blog_tags_v1';

const loadPosts = (): Post[] => {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (raw) return JSON.parse(raw) as Post[];
  } catch (e) {
    // ignore
  }
  // initialize from sample
  const copy = samplePosts.map((p) => ({ ...p }));
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(copy));
  } catch (e) {}
  return copy as Post[];
};

const savePosts = (posts: Post[]) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

const loadTags = (): string[] => {
  try {
    const raw = localStorage.getItem(TAGS_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch (e) {}
  try {
    localStorage.setItem(TAGS_KEY, JSON.stringify(sampleTags));
  } catch (e) {}
  return sampleTags.slice();
};

const saveTags = (tags: string[]) => {
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
};

export const createPost = async (payload: Partial<Post>) => {
  const posts = loadPosts();
  const newItem: Post = {
    id: Date.now().toString(),
    slug: payload.slug || (payload.title || 'post').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: payload.title || 'No title',
    summary: payload.summary || '',
    content: payload.content || '',
    author: payload.author || { name: 'Unknown' },
    tags: payload.tags || [],
    createdAt: payload.createdAt || new Date().toISOString().slice(0, 10),
    views: payload.views || 0,
  };
  posts.unshift(newItem);
  savePosts(posts);
  return newItem;
};

export const updatePost = async (id: string, data: Partial<Post>) => {
  const posts = loadPosts();
  const newPosts = posts.map((p) => (p.id === id ? { ...p, ...data } : p));
  savePosts(newPosts);
  return newPosts.find((p) => p.id === id) || null;
};

export const deletePost = async (id: string) => {
  const posts = loadPosts();
  const newPosts = posts.filter((p) => p.id !== id);
  savePosts(newPosts);
  return true;
};

export const createTag = async (tag: string) => {
  const tags = loadTags();
  if (!tags.includes(tag)) {
    tags.push(tag);
    saveTags(tags);
  }
  return tags;
};

export const updateTag = async (oldTag: string, newTag: string) => {
  const tags = loadTags();
  const idx = tags.indexOf(oldTag);
  if (idx >= 0) {
    tags[idx] = newTag;
    saveTags(tags);
    // also update posts tags
    const posts = loadPosts().map((p) => ({ ...p, tags: p.tags.map((t) => (t === oldTag ? newTag : t)) }));
    savePosts(posts);
  }
  return tags;
};

export const deleteTag = async (tag: string) => {
  let tags = loadTags();
  tags = tags.filter((t) => t !== tag);
  saveTags(tags);
  const posts = loadPosts().map((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));
  savePosts(posts);
  return tags;
};
