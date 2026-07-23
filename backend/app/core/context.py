from contextvars import ContextVar

# Store the current user's ID for audit logging
current_user_id: ContextVar[int] = ContextVar("current_user_id", default=None)
