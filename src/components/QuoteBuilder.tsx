import { FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { VehicleList } from './VehicleList'
import { ProductList } from './ProductList'

export const QuoteBuilder: FC = () => {
  // Inputs from Retool
  const [vehicles] = Retool.useStateArray({ name: 'vehicles' })
  const [products] = Retool.useStateArray({ name: 'products' })

  // assignments: Array<{ vehicle_id: string, product_id: string }>
  const [assignments, setAssignments] = Retool.useStateArray({
    name: 'assignments',
    initialValue: [],
  })

  // Always use safe arrays for vehicles/products/assignments
  const safeVehicles = Array.isArray(vehicles) ? vehicles : []
  const safeProducts = Array.isArray(products) ? products : []
  const safeAssignments = Array.isArray(assignments) ? assignments : []

  // Compute unassigned vehicles
  const unassignedVehicles =
    safeVehicles.filter(
      (v: any) =>
        !safeAssignments.some(
          (a: any) =>
            a.vehicle_id === v.vehicle_id &&
            safeProducts.some((p: any) => p.id === a.product_id)
        )
    )

  // Compute assigned vehicles per product
  const vehiclesByProduct = (() => {
    const map: Record<string, any[]> = {}
    safeProducts.forEach((p: any) => {
      map[p.id] = []
    })
    safeAssignments.forEach((a: any) => {
      const vehicle = safeVehicles.find((v: any) => v.vehicle_id === a.vehicle_id)
      if (vehicle && map[a.product_id]) {
        map[a.product_id].push(vehicle)
      }
    })
    return map
  })()

  // Handler for assigning a vehicle to a product
  const handleAssign = (vehicleId: string, productId: string) => {
    // Remove any existing assignment for this vehicle
    const filtered = safeAssignments.filter((a: any) => a.vehicle_id !== vehicleId)
    setAssignments([...filtered, { vehicle_id: vehicleId, product_id: productId }])
  }

  // Handler for unassigning a vehicle (move back to unassigned)
  const handleUnassign = (vehicleId: string) => {
    const filtered = safeAssignments.filter((a: any) => a.vehicle_id !== vehicleId)
    // log out  vehicleId
    console.log('Unassigning vehicle:', vehicleId)
    console.log('before:', safeAssignments)
    console.log('after:', filtered)
    setAssignments(filtered)
  }

  // Validation: all vehicles assigned?
  const allAssigned = safeVehicles.length > 0 && unassignedVehicles.length === 0

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3>Vehicles</h3>
          <VehicleList vehicles={unassignedVehicles} />
        </div>
        <div style={{ flex: 2 }}>
          <h3>Products</h3>
          <ProductList
            products={safeProducts}
            vehiclesByProduct={vehiclesByProduct}
            onDropVehicle={handleAssign}
            onUnassignVehicle={handleUnassign}
          />
        </div>
      </div>
      {!allAssigned && (
        <div style={{ color: 'red', marginTop: 16 }}>
          All vehicles must be assigned to a product.
        </div>
      )}
    </DndProvider>
  )
}
