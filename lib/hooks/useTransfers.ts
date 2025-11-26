import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Transfer, CreateTransfer, UpdateTransfer } from '@/lib/schemas/transfer'

// API helper functions
async function fetchTransfers() {
  const res = await fetch('/api/transfers')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch transfers')
  }
  return res.json() as Promise<Transfer[]>
}

async function fetchTransfer(id: string) {
  const res = await fetch(`/api/transfers/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch transfer')
  }
  return res.json() as Promise<Transfer>
}

async function createTransfer(newTransfer: CreateTransfer) {
  const res = await fetch('/api/transfers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTransfer),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create transfer')
  }
  
  return res.json() as Promise<Transfer>
}

async function updateTransfer({ id, updates }: { id: string, updates: UpdateTransfer }) {
  const res = await fetch(`/api/transfers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update transfer')
  }
  
  return res.json() as Promise<Transfer>
}

async function deleteTransfer(id: string) {
  const res = await fetch(`/api/transfers/${id}`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete transfer')
  }
  
  return id
}

// React Query hooks
export function useTransfers() {
  return useQuery({
    queryKey: ['transfers'],
    queryFn: fetchTransfers,
  })
}

export function useTransfer(id: string) {
  return useQuery({
    queryKey: ['transfers', id],
    queryFn: () => fetchTransfer(id),
    enabled: !!id,
  })
}

export function useCreateTransfer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
    },
  })
}

export function useUpdateTransfer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateTransfer,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
      queryClient.invalidateQueries({ queryKey: ['transfers', id] })
    },
  })
}

export function useDeleteTransfer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
    },
  })
}
