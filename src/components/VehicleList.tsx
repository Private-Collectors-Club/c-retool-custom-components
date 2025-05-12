import { FC } from 'react'
import { useDrag, useDrop } from 'react-dnd'

interface VehicleListProps {
  vehicles: any[]
  onDropUnassign?: (vehicleId: string) => void
}

const VEHICLE_TYPE = 'VEHICLE'

export const VehicleList: FC<VehicleListProps> = ({ vehicles, onDropUnassign }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: VEHICLE_TYPE,
    drop: (item: { id: string }) => {
      if (onDropUnassign) onDropUnassign(item.id)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  return (
    <div
      ref={drop}
      style={{
        minHeight: 120,
        border: `2px dashed ${isOver ? '#007bff' : '#ccc'}`,
        borderRadius: 6,
        padding: 12,
        background: isOver ? '#e6f0ff' : '#fafbfc',
        transition: 'background 0.2s, border 0.2s',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Unassigned Vehicles</div>
      {vehicles.length === 0 ? (
        <div style={{ color: '#888', fontStyle: 'italic' }}>No unassigned vehicles.</div>
      ) : (
        vehicles.map((vehicle) => (
          <DraggableVehicle key={vehicle.id} vehicle={vehicle} />
        ))
      )}
      {isOver && canDrop && (
        <div style={{ color: '#007bff', marginTop: 8 }}>Release to unassign</div>
      )}
    </div>
  )
}

export const DraggableVehicle: FC<{ vehicle: any }> = ({ vehicle }) => {
  const [{ isDragging }, drag] = useDrag({
    type: VEHICLE_TYPE,
    item: { id: vehicle.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
        background: '#fff',
        cursor: 'grab',
      }}
    >
      {vehicle.name || vehicle.id}
    </div>
  )
}

export { VEHICLE_TYPE }
