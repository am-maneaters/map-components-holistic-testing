import { useDroppable, useDraggable } from "@dnd-kit/core";

function Droppable(props) {
    const { isOver, setNodeRef } = useDroppable({
      id: 'droppable',
    });
    const style = {
      backgroundColor: isOver ? 'green' : 'red',
      ...props.style,
    };
  
    return (
      <div ref={setNodeRef} style={style}>
        {props.children}
      </div>
    );
  }
  
  function Draggable(props) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: 'draggable',
    });
  
    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;
  
    return (
      <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {props.children}
      </button>
    );
  }