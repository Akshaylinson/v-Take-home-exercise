import React, { useState } from 'react';
import { AlertCircle, MessageSquare, Send, ShieldCheck, User } from 'lucide-react';
import { Comment } from '../types/ticket';

interface CommentThreadProps {
  comments: Comment[];
  ticketId: string;
  onAddComment: (content: string, author: string) => void;
}

export function CommentThread({ comments, ticketId, onAddComment }: CommentThreadProps) {
  const [author, setAuthor] = useState('Support Agent');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setError('Comment message cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      onAddComment(trimmed, author.trim() || 'Support Agent');
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="comments-section" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      {/* Thread Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <h2 className="text-base font-semibold text-slate-900">Activity & Comments</h2>
        </div>
        <span
          id="comments-thread-count"
          className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600"
        >
          {comments.length} {comments.length === 1 ? 'note' : 'notes'}
        </span>
      </div>

      {/* Chronological Comment List */}
      <div id="comments-list" className="space-y-3">
        {comments.length === 0 ? (
          <div
            id="comments-empty-state"
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center"
          >
            <MessageSquare className="h-8 w-8 text-slate-300 mb-2" aria-hidden="true" />
            <p className="text-xs font-medium text-slate-600">No notes or updates yet</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Add internal updates, communications, or notes using the form below.
            </p>
          </div>
        ) : (
          comments.map((comment, index) => {
            const isAgent =
              comment.author.toLowerCase().includes('agent') ||
              comment.author.toLowerCase().includes('support') ||
              comment.author.toLowerCase().includes('lead');

            return (
              <div
                key={comment.id || index}
                id={`comment-item-${comment.id}`}
                className="relative rounded-lg border border-slate-100 bg-slate-50/60 p-4 transition"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        isAgent
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isAgent ? (
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <User className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </div>
                    <span
                      id={`comment-author-${comment.id}`}
                      className="text-xs font-semibold text-slate-800"
                    >
                      {comment.author}
                    </span>
                    {isAgent && (
                      <span className="rounded-sm bg-indigo-50 px-1.5 py-0.2 text-[10px] font-medium text-indigo-700 border border-indigo-100">
                        Staff
                      </span>
                    )}
                  </div>
                  <time
                    dateTime={comment.createdAt}
                    id={`comment-timestamp-${comment.id}`}
                    className="text-[11px] text-slate-400"
                  >
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
                <p
                  id={`comment-content-${comment.id}`}
                  className="text-xs text-slate-700 leading-relaxed pl-8 whitespace-pre-wrap"
                >
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Add Comment Form */}
      <form
        id="add-comment-form"
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-700">Add New Update</span>
          <div className="flex items-center gap-1.5">
            <label htmlFor="commentAuthor" className="text-[11px] text-slate-500 font-medium">
              Posting as:
            </label>
            <input
              id="commentAuthor"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name or role"
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-36"
            />
          </div>
        </div>

        <div>
          <label htmlFor="commentContent" className="sr-only">
            Comment content
          </label>
          <textarea
            id="commentContent"
            rows={3}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError(null);
            }}
            placeholder={`Log an action, customer update, or internal progress for ticket ${ticketId}...`}
            className={`block w-full rounded-lg border bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition resize-y ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
            }`}
            aria-invalid={!!error}
            aria-describedby={error ? 'comment-error' : undefined}
          />
          {error && (
            <p id="comment-error" className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            id="btn-submit-comment"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-indigo-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 transition cursor-pointer disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Add Comment</span>
          </button>
        </div>
      </form>
    </section>
  );
}
