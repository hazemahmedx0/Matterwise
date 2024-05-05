enum SOCKET_EVENTS_ENUM {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  MESSAGE_SENT = 'message_sent',
  MESSAGE_UPDATED = 'message_updated',
  MESSAGE_DELETED = 'message_deleted',
  CHANNEL_CREATED = 'channel_created',
  CHANNEL_UPDATED = 'channel_updated',
  CHANNEL_DELETED = 'channel_deleted',
  WORKSPACE_UPDATED = 'workspace_updated',
  USERS_ADDED_TO_CHANNEL = 'users_added_to_channel',
  TYPING = 'typing',
}

export default SOCKET_EVENTS_ENUM;
