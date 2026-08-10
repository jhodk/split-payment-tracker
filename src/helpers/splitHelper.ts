import type { SplitType } from "../services/paymentService.js"

export const splitTypeForPayer = (
    splitType: SplitType,
    currentUserId: number,
    payerId: number,
): SplitType => {
    if (currentUserId === payerId) {
        return splitType
    }

    if (splitType === '100-0') {
        return '0-100'
    }

    if (splitType === '0-100') {
        return '100-0'
    }

    return '50-50'
}