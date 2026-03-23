"use client"

import { NmiPayments } from "@nmipayments/nmi-pay-react"
import { useRef, useCallback, forwardRef, useImperativeHandle } from "react"

type Props = {
  tokenizationKey: string
  onTokenChange: (token: string | null, complete: boolean) => void
}

export type NmiCardFieldsHandle = {
  resetFields: () => void
}

const NmiCardFields = forwardRef<NmiCardFieldsHandle, Props>(
  ({ tokenizationKey, onTokenChange }, ref) => {
    const nmiRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
      resetFields: () => {
        nmiRef.current?.resetFields?.()
      },
    }))

    const handleChange = useCallback(
      (response: any) => {
        if (response?.token) {
          onTokenChange(response.token, true)
        } else {
          onTokenChange(null, false)
        }
      },
      [onTokenChange]
    )

    return (
      <NmiPayments
        ref={nmiRef}
        tokenizationKey={tokenizationKey}
        onChange={handleChange}
        paymentMethods={["card"]}
      />
    )
  }
)

NmiCardFields.displayName = "NmiCardFields"
export default NmiCardFields
