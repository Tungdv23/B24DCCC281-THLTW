import React, { useEffect, useState } from 'react';
import { getPostBySlug, Post } from '@/services/tintuc';
import { Card, Tag } from 'antd';

const Detail: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || '';
    if (!slug) return;
    getPostBySlug(slug).then((p) => setPost(p));
  }, []);

  if (!post) return <div style={{ padding: 16 }}>Bài viết không tìm thấy.</div>;

  return (
    <div style={{ padding: 16 }}>
      <Card title={post.title} extra={<span>{post.createdAt}</span>}>
        <div style={{ marginBottom: 8 }}>
          <strong>{post.author?.name}</strong>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <div style={{ marginTop: 12 }}>
          {post.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Detail;
