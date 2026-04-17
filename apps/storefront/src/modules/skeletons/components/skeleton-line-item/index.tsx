import { Table } from "@medusajs/ui"

const SkeletonLineItem = () => {
  return (
    <Table.Row className="w-full m-4">
      <Table.Cell className="p-4 w-24">
        <div className="flex w-24 h-24 p-4 animate-shimmer" />
      </Table.Cell>
      <Table.Cell className="text-left">
        <div className="flex flex-col gap-y-2">
          <div className="w-32 h-4 animate-shimmer" />
          <div className="w-24 h-4 animate-shimmer" />
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex gap-2 items-center">
          <div className="w-6 h-8 animate-shimmer" />
          <div className="w-14 h-10 animate-shimmer" />
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex gap-2">
          <div className="w-12 h-6 animate-shimmer" />
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex gap-2 justify-end">
          <div className="w-12 h-6 animate-shimmer" />
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default SkeletonLineItem
