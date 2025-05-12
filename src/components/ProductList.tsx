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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
        flex: 1,
        minWidth: 200,
        minHeight: 120,
        border: `2px dashed ${isOver ? '#007bff' : '#ccc'}`,
        borderRadius: 6,
        padding: 12,
        background: isOver ? '#e6f0ff' : '#fafbfc',
        transition: 'background 0.2s, border 0.2s',
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>
          {product.name || product.id}
        </div>
        {product.scheme_name && (
          <div style={{ color: '#555', fontSize: 13 }}>
            Scheme: {product.scheme_name}
          </div>
        )}
      </div>
      {vehicles.length === 0 ? (
        <div style={{ color: '#888', fontStyle: 'italic' }}>No vehicles assigned</div>
      ) : (
        vehicles.map((v) => (
          <DraggableVehicle vehicle={v} dragOnlyName onUnassignVehicle={onUnassignVehicle} />
        ))
      )}
    </div>
  )
}
