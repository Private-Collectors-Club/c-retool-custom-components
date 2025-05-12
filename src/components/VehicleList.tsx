import { FC } from 'react'
import { useDrag, useDrop } from 'react-dnd'

interface VehicleListProps {
  vehicles: any[]
  onDropUnassign?: (vehicleId: string) => void
}

const VEHICLE_TYPE = 'VEHICLE'

export const VehicleList: FC<VehicleListProps> = ({ vehicles }) => {
  return (
    <div
      style={{
        minHeight: 120,
        border: `2px dashed #ccc`,
        borderRadius: 6,
        padding: 12,
        background: '#fafbfc',
        transition: 'background 0.2s, border 0.2s',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Unassigned Vehicles</div>
      {vehicles.length === 0 && (
        <div style={{ color: '#888', fontStyle: 'italic' }}>No unassigned vehicles.</div>
      )}
      {vehicles.map((vehicle) => (
        <DraggableVehicle key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  )
}

export const DraggableVehicle: FC<{ vehicle: any; dragOnlyName?: boolean }> = ({ vehicle, dragOnlyName }) => {
  const [{ isDragging }, drag] = useDrag({
    type: VEHICLE_TYPE,
    item: { id: vehicle.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  if (dragOnlyName) {
    return (
      <span
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab',
          fontWeight: 500,
        }}
      >
        {vehicle.name || vehicle.id}
      </span>
    )
  }

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
