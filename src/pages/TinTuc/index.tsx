import React, { useEffect, useState, useRef } from 'react';
import { List, Card, Tag, Input, Pagination, Row, Col } from 'antd';
import { getPosts, getTags, Post } from '@/services/tintuc';

const { Search } = Input;

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [q, setQ] = useState('');
  const debounceRef = useRef<number | null>(null);

  const load = async () => {
    const res = await getPosts({ page, pageSize, tag, q });
    setPosts(res.data);
    setTotal(res.total);
  };

  useEffect(() => {
    getTags().then(setTags);
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, tag, q]);

  const onSearchChange = (value: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setQ(value);
      setPage(1);
    }, 300);
  };

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={16} style={{ marginBottom: 12 }}>
        <Col flex="auto">
          <Search placeholder="Tìm kiếm bài viết" onSearch={(v) => setQ(v)} onChange={(e) => onSearchChange(e.target.value)} enterButton />
        </Col>
      </Row>

      <div style={{ marginBottom: 12 }}>
        <Tag color={!tag ? 'blue' : undefined} onClick={() => setTag(undefined)} style={{ cursor: 'pointer' }}>
          Tất cả
        </Tag>
        {tags.map((t) => (
          <Tag key={t} color={t === tag ? 'blue' : undefined} onClick={() => setTag(t)} style={{ cursor: 'pointer' }}>
            {t}
          </Tag>
        ))}
      </div>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={posts}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title} extra={<a href={`/TinTuc/Detail?slug=${item.slug}`}>Xem</a>}>
              <div dangerouslySetInnerHTML={{ __html: item.summary }} />
              <div style={{ marginTop: 8 }}>
                {item.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </Card>
          </List.Item>
        )}
      />

      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <Pagination current={page} pageSize={pageSize} total={total} onChange={(p) => setPage(p)} />
      </div>
    </div>
  );
};

export default Page;
