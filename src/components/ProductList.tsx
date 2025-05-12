import { FC } from 'react'
import { useDrop } from 'react-dnd'
import { VEHICLE_TYPE, DraggableVehicle } from './VehicleList'

interface ProductListProps {
  products: any[]
  vehiclesByProduct: Record<string, any[]>
  onDropVehicle: (vehicleId: string, productId: string) => void
  onUnassignVehicle: (vehicleId: string) => void
}

export const ProductList: FC<ProductListProps> = ({
  products,
  vehiclesByProduct,
  onDropVehicle,
  onUnassignVehicle,
}) => {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {products.map((product) => (
        <ProductDropZone
          key={product.id}
          product={product}
          vehicles={vehiclesByProduct[product.id] || []}
          onDropVehicle={onDropVehicle}
          onUnassignVehicle={onUnassignVehicle}
        />
      ))}
    </div>
  )
}

const ProductDropZone: FC<{
  product: any
  vehicles: any[]
  onDropVehicle: (vehicleId: string, productId: string) => void
  onUnassignVehicle: (vehicleId: string) => void
}> = ({ product, vehicles, onDropVehicle, onUnassignVehicle }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: VEHICLE_TYPE,
    drop: (item: { id: string }) => {
      onDropVehicle(item.id, product.id)
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
        minWidth: 200,
        minHeight: 120,
        border: `2px dashed ${isOver ? '#007bff' : '#ccc'}`,
        borderRadius: 6,
        padding: 12,
        background: isOver ? '#e6f0ff' : '#fafbfc',
        transition: 'background 0.2s, border 0.2s',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {product.name || product.id}
      </div>
      {vehicles.length === 0 ? (
        <div style={{ color: '#888', fontStyle: 'italic' }}>No vehicles assigned</div>
      ) : (
        vehicles.map((v) => (
          <div key={v.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <DraggableVehicle vehicle={v} />
            <button
              style={{
                marginLeft: 8,
                padding: '2px 8px',
                border: '1px solid #ccc',
                borderRadius: 4,
                background: '#f5f5f5',
                cursor: 'pointer',
              }}
              onClick={() => onUnassignVehicle(v.id)}
              title="Unassign"
            >
              Unassign
            </button>
          </div>
        ))
      )}
    </div>
  )
}
