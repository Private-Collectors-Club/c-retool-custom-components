import { FC } from 'react'
import { useDrag } from 'react-dnd'

interface VehicleListProps {
  vehicles: any[]
}

const VEHICLE_TYPE = 'VEHICLE'

export const VehicleList: FC<VehicleListProps> = ({ vehicles }) => {
  return (
    <div>
      {vehicles.length === 0 && <div>No unassigned vehicles.</div>}
      {vehicles.map((vehicle) => (
        <DraggableVehicle key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  )
}

const DraggableVehicle: FC<{ vehicle: any }> = ({ vehicle }) => {
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
