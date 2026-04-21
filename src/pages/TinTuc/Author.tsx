import React, { useEffect, useState } from 'react';
import { Card, Avatar } from 'antd';
import { getPosts } from '@/services/tintuc';

const AuthorPage: React.FC = () => {
  const [authorName, setAuthorName] = useState<string>('');
  const [bio, setBio] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || '';
    setAuthorName(name);
    // try to find posts by this author to show simple bio
    getPosts({ page: 1, pageSize: 1000 }).then((r) => {
      const p = r.data.find((x) => x.author?.name === name);
      if (p) setBio(`Tác giả của ${p.title}.`);
      else if (!name) setBio('Tác giả chưa cung cấp thông tin.');
    });
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <Card title={`Giới thiệu tác giả: ${authorName || 'Không rõ'}`}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Avatar size={80}>{authorName ? authorName[0] : 'A'}</Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{authorName || 'Không rõ'}</div>
            <div style={{ marginTop: 8 }}>{bio}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthorPage;
