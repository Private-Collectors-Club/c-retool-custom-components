import { FC, useMemo } from 'react'
import { Retool } from '@tryretool/custom-component-support'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { VehicleList } from './VehicleList'
import { ProductList } from './ProductList'

export const QuoteBuilder: FC = () => {
  // Inputs from Retool
  const [vehicles] = Retool.useStateArray({ name: 'vehicles' })
  const [products] = Retool.useStateArray({ name: 'products' })

  // assignments: { [vehicleId]: productId }
  const [assignments, setAssignments] = Retool.useStateObject({
    name: 'assignments',
    initialValue: {},
  })

  // Always use safe arrays for vehicles/products
  const safeVehicles = Array.isArray(vehicles) ? vehicles : []
  const safeProducts = Array.isArray(products) ? products : []

  // Compute unassigned vehicles
  const unassignedVehicles = useMemo(
    () =>
      safeVehicles.filter(
        (v: any) =>
          !Object.prototype.hasOwnProperty.call(assignments, v.id) ||
          !safeProducts.some((p: any) => p.id === assignments[v.id])
      ),
    [safeVehicles, assignments, safeProducts]
  )

  // Compute assigned vehicles per product
  const vehiclesByProduct = useMemo(() => {
    const map: Record<string, any[]> = {}
    safeProducts.forEach((p: any) => {
      map[p.id] = []
    })
    safeVehicles.forEach((v: any) => {
      const pid = assignments[v.id]
      if (typeof pid === 'string' && map[pid]) {
        map[pid].push(v)
      }
    })
    return map
  }, [safeVehicles, assignments, safeProducts])

  // Handler for assigning a vehicle to a product
  const handleAssign = (vehicleId: string, productId: string) => {
    setAssignments({ ...assignments, [vehicleId]: productId })
  }

  // Handler for unassigning a vehicle (move back to unassigned)
  const handleUnassign = (vehicleId: string) => {
    const newAssignments = { ...assignments }
    delete newAssignments[vehicleId]
    setAssignments(newAssignments)
  }

  // Validation: all vehicles assigned?
  const allAssigned = safeVehicles.length > 0 && unassignedVehicles.length === 0

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3>Vehicles</h3>
          <VehicleList vehicles={unassignedVehicles} onDropUnassign={handleUnassign} />
        </div>
        <div style={{ flex: 2 }}>
          <h3>Products</h3>
          <ProductList
            products={safeProducts}
            vehiclesByProduct={vehiclesByProduct}
            onDropVehicle={handleAssign}
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
