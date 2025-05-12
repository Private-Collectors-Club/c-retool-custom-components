import { FC } from 'react'
import { useDrag, useDrop } from 'react-dnd'

interface VehicleListProps {
  vehicles: any[]
  onDropUnassign?: (vehicleId: string) => void
  onUnassignVehicle?: (vehicleId: string) => void
}

const VEHICLE_TYPE = 'VEHICLE'

export const VehicleList: FC<VehicleListProps> = ({ vehicles, onUnassignVehicle }) => {
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
        <DraggableVehicle key={vehicle.vehicle_id} vehicle={vehicle} onUnassignVehicle={onUnassignVehicle} />
      ))}
    </div>
  )
}

export const DraggableVehicle: FC<{
  vehicle: any
  dragOnlyName?: boolean
  onUnassignVehicle?: (vehicleId: string) => void
}> = ({ vehicle, onUnassignVehicle }) => {
  const [{ isDragging }, drag] = useDrag({
    type: VEHICLE_TYPE,
    item: { id: vehicle.vehicle_id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      style={{
        display: 'flex',
        alignItems: 'center',
        opacity: isDragging ? 0.5 : 1,
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
        background: '#fff',
        cursor: 'grab',
      }}
    >
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {vehicle.vehicle_name || vehicle.vehicle_id}
      </span>
      {onUnassignVehicle && (
        <button
          style={{
            flex: 1,
            flexGrow: 0,
            marginLeft: 8,
            padding: '2px 8px',
            border: '1px solid #ccc',
            borderRadius: 4,
            background: '#f5f5f5',
            cursor: 'pointer',
          }}
          onClick={() => onUnassignVehicle(vehicle.vehicle_id)}
          title="Unassign"
        >
          Unassign
        </button>
      )}
    </div>
  )
}

export { VEHICLE_TYPE }
