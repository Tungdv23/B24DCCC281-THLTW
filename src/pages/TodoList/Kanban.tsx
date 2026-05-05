import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { getTasks, updateTask, reorderTasks, Task } from '@/services/todo';

const statusOrder: { key: string; title: string }[] = [
  { key: 'todo', title: 'Cần làm' },
  { key: 'doing', title: 'Đang làm' },
  { key: 'done', title: 'Hoàn thành' },
];

export default function Kanban() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => { load(); }, []);
  async function load() { const t = await getTasks(); setTasks(t); }

  function byStatus(status: string) { return tasks.filter(t => t.status === status); }

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const id = Number(draggableId);
    const destStatus = destination.droppableId;
    // update status in local state
    const updated = tasks.map(t => t.id === id ? { ...t, status: destStatus as any } : t);
    setTasks(updated);
    await updateTask(id, { status: destStatus as any });
  };

  return (
    <div style={{ display: 'flex', gap: 12, padding: 24 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {statusOrder.map(s => (
          <Droppable droppableId={s.key} key={s.key}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1 }}>
                <Card title={s.title} style={{ minHeight: 400 }}>
                  {byStatus(s.key).map((item, idx) => (
                    <Draggable draggableId={String(item.id)} index={idx} key={item.id}>
                      {(prov) => (
                        <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={{ padding: 8, marginBottom: 8, background: '#fff', border: '1px solid #eee' }}>
                          <div style={{ fontWeight: 600 }}>{item.title}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>{item.description}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Card>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}
