import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Comment, CreateComment, UpdateComment } from '@/lib/schemas/comment'

// API helper functions
async function fetchComments() {
  const res = await fetch('/api/comments')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch comments')
  }
  return res.json() as Promise<Comment[]>
}

async function fetchComment(id: string) {
  const res = await fetch(`/api/comments/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch comment')
  }
  return res.json() as Promise<Comment>
}

async function createComment(newComment: CreateComment) {
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newComment),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create comment')
  }
  
  return res.json() as Promise<Comment>
}

async function updateComment({ id, updates }: { id: string, updates: UpdateComment }) {
  const res = await fetch(`/api/comments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update comment')
  }
  
  return res.json() as Promise<Comment>
}

async function deleteComment(id: string) {
  const res = await fetch(`/api/comments/${id}`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete comment')
  }
  
  return id
}

// React Query hooks
export function useComments() {
  return useQuery({
    queryKey: ['comments'],
    queryFn: fetchComments,
  })
}

export function useComment(id: string) {
  return useQuery({
    queryKey: ['comments', id],
    queryFn: () => fetchComment(id),
    enabled: !!id,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}

export function useUpdateComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateComment,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}
