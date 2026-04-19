import { useContext } from 'react'
import { LuciferContext } from './lucifer-context'

export function useLucifer() {
  const value = useContext(LuciferContext)
  if (!value) {
    throw new Error('useLucifer must be used within LuciferProvider')
  }

  return value
}
