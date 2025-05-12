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

  // assignments: Array<{ product_id: string, vehicle_ids: string[] }>
  const [assignments, setAssignments] = Retool.useStateArray({
    name: 'assignments',
    initialValue: [],
  })

  // Type guard for assignment objects
  function isAssignment(obj: any): obj is { product_id: string, vehicle_ids: string[] } {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.product_id === 'string' &&
      Array.isArray(obj.vehicle_ids)
    )
  }

  // Always use safe arrays for vehicles/products/assignments
  const safeVehicles = Array.isArray(vehicles) ? vehicles : []
  const safeProducts = Array.isArray(products) ? products : []
  const safeAssignments = Array.isArray(assignments)
    ? assignments.filter(isAssignment)
    : []

  // Compute assigned vehicles per product
  const vehiclesByProduct: Record<string, any[]> = {}
  safeProducts.forEach((p: any) => {
    const assignment = safeAssignments.find((a: any) => a.product_id === p.id)
    vehiclesByProduct[p.id] = assignment
      ? assignment.vehicle_ids.map((vid: string) =>
        safeVehicles.find((v: any) => v.vehicle_id === vid)
      ).filter(Boolean)
      : []
  })

  // Compute unassigned vehicles
  const assignedVehicleIds = safeAssignments.flatMap((a: any) => a.vehicle_ids)
  const unassignedVehicles = safeVehicles.filter(
    (v: any) => !assignedVehicleIds.includes(v.vehicle_id)
  )

  // Handler for assigning a vehicle to a product
  const handleAssign = (vehicleId: string, productId: string) => {
    // Remove vehicleId from all products, then add to the selected product
    let found = false
    const newAssignments = safeProducts.map((product: any) => {
      let entry = safeAssignments.find((a: any) => a.product_id === product.id)
      if (!entry) entry = { product_id: product.id, vehicle_ids: [] }
      // Remove vehicleId from all arrays
      entry.vehicle_ids = entry.vehicle_ids.filter((vid: string) => vid !== vehicleId)
      // Add to the right product
      if (product.id === productId) {
        entry.vehicle_ids = [...entry.vehicle_ids, vehicleId]
        found = true
      }
      return entry
    })
    // If the product wasn't in the list, add it
    if (!found) {
      newAssignments.push({ product_id: productId, vehicle_ids: [vehicleId] })
    }
    setAssignments(newAssignments)
    console.log('Assignments after assign:', newAssignments)
  }

  // Handler for unassigning a vehicle (move back to unassigned)
  const handleUnassign = (vehicleId: string) => {
    const newAssignments = safeAssignments.map((a: any) => ({
      ...a,
      vehicle_ids: a.vehicle_ids.filter((vid: string) => vid !== vehicleId),
    }))
    setAssignments(newAssignments)
    console.log('Assignments after unassign:', newAssignments)
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
